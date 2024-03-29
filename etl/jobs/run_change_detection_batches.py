import sys
import math
import boto3
import time
import json
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job


contexts = {
    "england": {
        "crawler_name": "raw_stats_crawler",
        "workflow_name": "generate-compare-nearest-50-parallel",
        "run_properties" : {
            "FRAMEWORKS": "'liveng1'",
            "SOURCE_TABLE_NAME": "raw_stats",
            "FILTERED_TARGET_TABLE_NAME": "raw_stats_filtered_20230718",
            "FILTERED_TARGET_PATH": "s3://jncc-habmon-alpha-stats-data/20230718/raw-stats-filtered/",
            "AGGREGATION_TARGET_TABLE_NAME": "aggregated_monthly_20230718",
            "AGGREGATION_TARGET_PATH": "s3://jncc-habmon-alpha-stats-data/20230718/aggregated-monthly/",
            "NEAREST50_TARGET_TABLE_NAME": "monthly_nearest50_20230718",
            "NEAREST50_TARGET_PATH": "s3://jncc-habmon-alpha-stats-data/20230718/monthly-nearest50/"
            }
        },
    "england_test": {
        "crawler_name": "raw_stats_crawler",
        "workflow_name": "generate-compare-nearest-50-parallel",
        "run_properties" : {
            "FRAMEWORKS": "'liveng0','liveng1'",
            "SOURCE_TABLE_NAME": "raw_stats",
            "FILTERED_TARGET_TABLE_NAME": "raw_stats_filtered_test_1",
            "FILTERED_TARGET_PATH": "s3://jncc-habmon-alpha-stats-data/testing/raw-stats-filtered_1/",
            "AGGREGATION_TARGET_TABLE_NAME": "aggregated_monthly_test_1",
            "AGGREGATION_TARGET_PATH": "s3://jncc-habmon-alpha-stats-data/testing/aggregated-monthly_1/",
            "NEAREST50_TARGET_TABLE_NAME": "monthly_nearest50_test_1",
            "NEAREST50_TARGET_PATH": "s3://jncc-habmon-alpha-stats-data/testing/monthly_nearest50_1/"
            }
        },
    "scotland": {
        "crawler_name": "raw_stats_scotland_crawler",
        "workflow_name": "generate-compare-nearest-50-parallel",
        "run_properties" : {
            "FRAMEWORKS": "'habmos_cairngorms','spaceint_cairngorms'",
            "SOURCE_TABLE_NAME": "raw_stats_scotland",
            "FILTERED_TARGET_TABLE_NAME": "raw_stats_filtered_20230718",
            "FILTERED_TARGET_PATH": "s3://jncc-habmon-alpha-stats-data/20230718/raw-stats-filtered/",
            "AGGREGATION_TARGET_TABLE_NAME": "aggregated_monthly_20230718",
            "AGGREGATION_TARGET_PATH": "s3://jncc-habmon-alpha-stats-data/20230718/aggregated-monthly/",
            "NEAREST50_TARGET_TABLE_NAME": "monthly_nearest50_20230718",
            "NEAREST50_TARGET_PATH": "s3://jncc-habmon-alpha-stats-data/20230718/monthly-nearest50/"
            }
        },
    "scotland_test": {
        "crawler_name": "raw_stats_scotland_crawler",
        "workflow_name": "generate-compare-nearest-50-parallel",
        "run_properties" : {
            "FRAMEWORKS": "'habmos_cairngorms','spaceint_cairngorms'",
            "SOURCE_TABLE_NAME": "raw_stats_scotland",
            "FILTERED_TARGET_TABLE_NAME": "raw_stats_filtered_test_3",
            "FILTERED_TARGET_PATH": "s3://jncc-habmon-alpha-stats-data/testing/raw-stats-filtered_3/",
            "AGGREGATION_TARGET_TABLE_NAME": "aggregated_monthly_test_3",
            "AGGREGATION_TARGET_PATH": "s3://jncc-habmon-alpha-stats-data/testing/aggregated-monthly_3/",
            "NEAREST50_TARGET_TABLE_NAME": "monthly_nearest50_test_3",
            "NEAREST50_TARGET_PATH": "s3://jncc-habmon-alpha-stats-data/testing/monthly-nearest50_3/"
            }
        },
    }

def format_year_month_as_parameter(year, month):
    return str(year) + f'{month:02}'

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
            "FROM_YEAR_MONTH": format_year_month_as_parameter(start_year, start_month),
            "TO_YEAR_MONTH": format_year_month_as_parameter(end_year_month[0], end_year_month[1])
        }
        date_ranges.append(date_range)
        start_year, start_month = add_months(
            end_year_month[0], end_year_month[1], 1)
    return date_ranges

def start_workflow(client, workflow_name, run_properties):
    response = client.start_workflow_run(
        Name=workflow_name,
        RunProperties=run_properties
    )
    return response["RunId"]

# 'RUNNING'|'COMPLETED'|'STOPPING'|'STOPPED'|'ERROR'
def check_running_workflows(client, workflow_name, running_workflows):
    for run_id in running_workflows:
        response = client.get_workflow_run(
            Name=workflow_name,
            RunId=run_id,
        )

        status = response['Run']['Status']

        if status in ['STOPPED','COMPLETED']:
            running_workflows.remove(run_id)
        elif status == 'ERROR':
            running_workflows.remove(run_id)
            print(f"Encountered workflow error: {response['Run']['ErrorMessage']}")
            print(json.dumps(response['Run']['WorkflowRunProperties']))
        
        # to prevent exceeding the api rate limit
        time.sleep(5)
    

def start_crawler(client, crawler_name):
    response = client.start_crawler(Name=crawler_name)
    return response

def check_crawler_running(client, crawler_name):
    response = client.get_crawler(Name=crawler_name)
    if response['Crawler']['State'] == "READY":
        return False
    elif response['Crawler']['State'] in ('RUNNING','STOPPING'):
        return True
    else:
        raise Exception(f"Unknown crawler state {response['Crawler']['State']}")


args = getResolvedOptions(sys.argv, [
                          'JOB_NAME', 'CONTEXT', 'FROM_YEAR', 'FROM_MONTH', 'TO_YEAR', 'TO_MONTH', 'MONTHS_PER_RUN', 'MAX_RUNNING_WORKFLOWS'])


sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

context = contexts.get(args['CONTEXT'])

date_ranges = get_date_ranges(int(args['FROM_YEAR']), int(args['FROM_MONTH']),
    int(args['TO_YEAR']), int(args['TO_MONTH']), int(args['MONTHS_PER_RUN']))
    
max_running_workflows = int(args['MAX_RUNNING_WORKFLOWS'])

client = boto3.client('glue')

# crawl the source table
print(f"Running crawler {context['crawler_name']}")

if not check_crawler_running(client, context['crawler_name']):
    start_crawler(client, context['crawler_name'])

while check_crawler_running(client, context['crawler_name']):
    time.sleep(5)

running_workflows = []

date_range_index = 0

print(f"running workflow {context['workflow_name']}")

while date_range_index <= (len(date_ranges) - 1):
    # prunes workflows that have completed
    check_running_workflows(client, context["workflow_name"], running_workflows)

    if len(running_workflows) < max_running_workflows:
        #add the date range to the parameters for the run
        context["run_properties"].update(date_ranges[date_range_index])

        #start a run
        run_id = start_workflow(client, context["workflow_name"], context["run_properties"])

        #log run and increment
        running_workflows.append(run_id)

        date_range_index += 1

    if len(running_workflows) == max_running_workflows:
        time.sleep(60)
    else:
        time.sleep(5)

job.commit()
