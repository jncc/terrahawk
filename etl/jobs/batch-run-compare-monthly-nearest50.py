import sys
import math
import boto3
import time
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

    
context = {
    "task_name": "compare-monthly-nearest50-parameterised",
    "params": {
        "--FRAMEWORKS": "'liveng0','liveng1'",
        "--SOURCE_TABLE_NAME": "aggregated_monthly_20230125",
        "--TARGET_TABLE_NAME": "monthly_nearest50_20230125",
        "--TARGET_PATH": "s3://jncc-habmon-alpha-stats-data/20230125/monthly-nearest50-2/"
    }
}


def add_months(from_year, from_month, addend_months):
    to_year = from_year + (from_month + addend_months - 1) // 12
    to_month = (from_month + addend_months - 1) % 12 + 1
    return to_year, to_month

def format_year_month_as_parameter(year, month):
    return str(year) + f'{month:02}'

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
            "--FROM_YEAR_MONTH": format_year_month_as_parameter(start_year, start_month),
            "--TO_YEAR_MONTH": format_year_month_as_parameter(end_year_month[0], end_year_month[1])
        }
        date_ranges.append(date_range)
        start_year, start_month = add_months(
            end_year_month[0], end_year_month[1], 1)
    return date_ranges


def start_job_run(task_args):
    response = client.start_job_run(
                JobName = context["task_name"],
                Arguments = task_args )
    
    return response["JobRunId"]
    
def await_task_run_completion(client, task_name, run_id):
    while True:
        response = client.get_job_run(
            JobName=task_name,
            RunId=run_id,
            PredecessorsIncluded=False
        )
        status = response["JobRun"]["JobRunState"]
        if status in ['STARTING', 'WAITING', 'RUNNING', 'STOPPING']:
            time.sleep(60)
            continue
        elif status == 'SUCCEEDED':
            break
        else:
            raise Exception("Encountered unexpected job status: " + status)
        
def validate_month(month, arg_name):
    if not month.isdigit() or not (1 <= int(month) <= 12):
        exit("Parameter {} must be a number between 1 and 12".format(arg_name))


def validate_year(year, arg_name):
    if not year.isdigit() or not (2000 <= int(year) <= 2050):
        exit("Parameter {} must be a number between 2000 and 2050".format(arg_name))


def validate_months_per_run(value, arg_name):
    if not value.isdigit() or int(value) == 0:
        exit("Parameter {} must be a postive whole number".format(arg_name))


client = boto3.client('glue')

args = getResolvedOptions(sys.argv, 
                          ['JOB_NAME', 'FROM_YEAR', 'FROM_MONTH', 'TO_YEAR', 'TO_MONTH', 'MONTHS_PER_RUN'])

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

validate_year(args['FROM_YEAR'], "FROM_YEAR")
validate_month(args['FROM_MONTH'], "FROM_MONTH")
validate_year(args['TO_YEAR'], "TO_YEAR")
validate_month(args['TO_MONTH'], "TO_MONTH")
validate_months_per_run(args['MONTHS_PER_RUN'], "MONTHS_PER_RUN")

date_ranges = get_date_ranges(int(args['FROM_YEAR']), int(args['FROM_MONTH'])
                              , int(args['TO_YEAR']), int(args['TO_MONTH']), int(args['MONTHS_PER_RUN']))

last_run_id = None

for date_range in date_ranges:

    context["params"].update(date_range)
    last_run_id = start_job_run(context["params"])

    if last_run_id:
        await_task_run_completion(client, context["task_name"], last_run_id)

job.commit()
