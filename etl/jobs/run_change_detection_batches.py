import sys
import math
import boto3
import time
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

contexts = {
    "england": {
        "workflow_name": "generate-compare-nearest-50",
        "filter_trigger_name": "Run filter raw stats",
        "filter_job_name": "filter-raw-stats",
        "aggregation_trigger_name": "Run aggregate-monthly",
        "aggregation_job_name": "aggregate-monthly-parameterised",
        "compare_monthly_trigger_name": "Run Compare Monthly Nearest 50",
        "compare_monthly_job_name": "compare-monthly-nearest50-parameterised"
    },
    "england_test": {
        "workflow_name": "generate-compare-nearest-50-test",
        "filter_trigger_name": "Run filter raw stats test",
        "filter_job_name": "filter-raw-stats",
        "aggregation_trigger_name": "Run Aggregate Monthly Test",
        "aggregation_job_name": "aggregate-monthly-parameterised",
        "compare_monthly_trigger_name": "Run Compare Monthly Nearest 50 test",
        "compare_monthly_job_name": "compare-monthly-nearest50-parameterised"

    },
    "scotland": {
        "workflow_name": "generate-compare-nearest-50-scotland",
        "filter_trigger_name": "Run filter raw stats scotland",
        "filter_job_name": "filter-raw-stats",
        "aggregation_trigger_name": "Run Aggregate Monthly Scotland",
        "aggregation_job_name": "aggregate-monthly-parameterised",
        "compare_monthly_trigger_name": "Run Compare Monthly Nearest 50 for Scotland",
        "compare_monthly_job_name": "compare-monthly-nearest50-parameterised"
    },
    "scotland_test": {
        "workflow_name": "generate-compare-nearest-50-scotland-test",
        "filter_trigger_name": "Run filter raw stats scotland test",
        "filter_job_name": "filter-raw-stats",
        "aggregation_trigger_name": "Run Aggregate Monthly Test for Scotland",
        "aggregation_job_name": "aggregate-monthly-parameterised",
        "compare_monthly_trigger_name": "Run Compare Monthly Nearest 50 test for Scotland",
        "compare_monthly_job_name": "compare-monthly-nearest50-parameterised"
    },
}


def get_date_ranges(from_year, from_month, to_year, to_month, months_per_run):
    if from_year > to_year or (from_year == to_year and from_month > to_month):
        exit("From year and month {} {} must not be after To year and month {} {}".format(
            from_year, from_month, to_year, to_month))
    date_ranges = []
    total_months = (to_year - from_year) * 12 + to_month - from_month + 1
    no_runs = math.ceil(total_months / months_per_run)
    start_year = from_year
    start_month = from_month
    for i in range(no_runs):
        end_year_month = add_months_with_floor(
            start_year, start_month, months_per_run - 1, to_year, to_month)
        date_range = {
            "--FROM_YEAR_MONTH": format_year_month_as_parameter(start_year, start_month),
            "--TO_YEAR_MONTH": format_year_month_as_parameter(end_year_month[0], end_year_month[1])
        }
        date_ranges.append(date_range)
        start_year, start_month = add_months(
            end_year_month[0], end_year_month[1], 1)
    return date_ranges


def add_months(from_year, from_month, addend_months):
    to_year = from_year + (from_month + addend_months - 1) // 12
    to_month = (from_month + addend_months - 1) % 12 + 1
    return to_year, to_month


def add_months_with_floor(from_year, from_month, addend_months, floor_year, floor_month):
    to_year_month = add_months(from_year, from_month, addend_months)
    if (floor_year < to_year_month[0] or floor_year == to_year_month[0] and floor_month <= to_year_month[1]):
        return floor_year, floor_month
    else:
        return to_year_month[0], to_year_month[1]


def format_year_month_as_parameter(year, month):
    return str(year) + f'{month:02}'


def check_initial_workflow_availability(client, workflow_name):
    while True:
        response = client.get_workflow(
            Name=workflow_name
        )
        if not response or not response["Workflow"]:
            exit("Could not retrieve Workflow with name " + workflow_name)
        status = response["Workflow"]["LastRun"]["Status"]
        if status in ['RUNNING', 'STOPPING']:
            time.sleep(60)
            continue
        elif status in ['COMPLETED', 'ERROR', 'STOPPED']:
            break
        else:
            exit("Encountered unexpected workflow status: " + status)


def await_workflow_run_completion(client, workflow_name, run_id):
    while True:
        response = client.get_workflow_run(
            Name=workflow_name,
            RunId=run_id,
        )
        status = response["Run"]["Status"]
        if status in ['RUNNING', 'STOPPING']:
            time.sleep(60)
            continue
        elif status == 'COMPLETED':
            break
        else:
            exit("Encountered unexpected workflow status: " + status)


def get_trigger(client, trigger_name):
    triggerResponse = client.get_trigger(
        Name=trigger_name
    )
    if not triggerResponse or not triggerResponse["Trigger"]:
        exit("Could not retrieve Trigger with name " + trigger_name)
    return triggerResponse["Trigger"]


def set_triggered_job_params(client, trigger, job_name, params):
    for x in trigger["Actions"]:
        if x['JobName'] == job_name:
            arguments = x['Arguments']
            break
    if not arguments:
        exit("Could not locate arguments for job " + job_name)
    for key, value in params.items():
        arguments[key] = value

    # update_trigger API properties are a subset of get_trigger properties
    # and we have to provide exactly all of those (can neither include non-updateable properties nor exclude mandatory updateable properties which have not been updated)
    trigger_update_params = {
        'Name': trigger["Name"],
        'Description': trigger.get("Description", ''),
        'Schedule': trigger.get("Schedule", ''),
        'Actions': trigger["Actions"],
        'Predicate': trigger["Predicate"],
    }
    if trigger.get("EventBatchingCondition") is not None:
        trigger_update_params['EventBatchingCondition'] = trigger["EventBatchingCondition"]

    client.update_trigger(
        Name=trigger["Name"],
        TriggerUpdate=trigger_update_params
    )


def start_workflow(client, workflow_name):
    response = client.start_workflow_run(
        Name=workflow_name
    )
    return response["RunId"]


def validate_month(month, arg_name):
    if not month.isdigit() or not (1 <= int(month) <= 12):
        exit("Parameter {} must be a number between 1 and 12".format(arg_name))


def validate_year(year, arg_name):
    if not year.isdigit() or not (2000 <= int(year) <= 2050):
        exit("Parameter {} must be a number between 2000 and 2050".format(arg_name))


def validate_months_per_run(value, arg_name):
    if not value.isdigit() or int(value) == 0:
        exit("Parameter {} must be a postive whole number".format(arg_name))


args = getResolvedOptions(sys.argv, [
                          'JOB_NAME', 'CONTEXT', 'FROM_YEAR', 'FROM_MONTH', 'TO_YEAR', 'TO_MONTH', 'MONTHS_PER_RUN'])

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

context = contexts.get(args['CONTEXT'])
if not context:
    exit("No context parameters found for supplied parameter " + args['CONTEXT'])
validate_year(args['FROM_YEAR'], "FROM_YEAR")
validate_month(args['FROM_MONTH'], "FROM_MONTH")
validate_year(args['TO_YEAR'], "TO_YEAR")
validate_month(args['TO_MONTH'], "TO_MONTH")
validate_months_per_run(args['MONTHS_PER_RUN'], "MONTHS_PER_RUN")
date_ranges = get_date_ranges(int(args['FROM_YEAR']), int(args['FROM_MONTH']),
    int(args['TO_YEAR']), int(args['TO_MONTH']), int(args['MONTHS_PER_RUN']))

client = boto3.client('glue')
filter_trigger = get_trigger(client, context["filter_trigger_name"])
aggregation_trigger = get_trigger(client, context["aggregation_trigger_name"])
compare_monthly_trigger = get_trigger(client, context["compare_monthly_trigger_name"])
check_initial_workflow_availability(client, context["workflow_name"])
last_run_id = None
for date_range in date_ranges:
    if last_run_id:
        await_workflow_run_completion(client, context["workflow_name"], last_run_id)
    set_triggered_job_params(client, filter_trigger, context["filter_job_name"], date_range)    
    set_triggered_job_params(client, aggregation_trigger, context["aggregation_job_name"], date_range)
    set_triggered_job_params(client, compare_monthly_trigger, context["compare_monthly_job_name"], date_range)
    last_run_id = start_workflow(client, context["workflow_name"])

job.commit()
