import sys
import boto3
import botocore
import json
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.dynamicframe import DynamicFrame

required_params = ['JOB_NAME','SOURCE_TABLE_NAME','TARGET_PATH','TARGET_TABLE_NAME','FRAMEWORKS']
optional_params = ['FROM_YEAR_MONTH','TO_YEAR_MONTH']
workflow_params = ['WORKFLOW_NAME', 'WORKFLOW_RUN_ID']

database_name = 'statsdb'

def sparkSqlQuery(glueContext, query, mapping, transformation_ctx) -> DynamicFrame:
    for alias, frame in mapping.items():
        frame.toDF().createOrReplaceTempView(alias)
    result = spark.sql(query)
    return DynamicFrame.fromDF(result, glueContext, transformation_ctx)

workflow_present = list(set([i[2:] for i in sys.argv]).intersection([i for i in workflow_params]))

args = {}

client = boto3.client('glue')

if len(workflow_present) == 2:

    job_params = getResolvedOptions(sys.argv, ['JOB_NAME'] + workflow_present)

    workflow_name = job_params['WORKFLOW_NAME']
    workflow_run_id = job_params['WORKFLOW_RUN_ID']

    workflow_run_properties = client.get_workflow_run_properties(Name=workflow_name,RunId=workflow_run_id)['RunProperties']

    args = {
        'JOB_NAME'          : job_params['JOB_NAME'],
        'FRAMEWORKS'        : workflow_run_properties['FRAMEWORKS'],
        'SOURCE_TABLE_NAME' : workflow_run_properties['SOURCE_TABLE_NAME'],
        'TARGET_TABLE_NAME' : workflow_run_properties['FILTERED_TARGET_TABLE_NAME'],
        'TARGET_PATH'       : workflow_run_properties['FILTERED_TARGET_PATH'],
        'FROM_YEAR_MONTH'   : workflow_run_properties['FROM_YEAR_MONTH'],
        'TO_YEAR_MONTH'     : workflow_run_properties['TO_YEAR_MONTH']
    }

    args_string = json.dumps(args)
    print(f"workflow args: {args_string}")

else:
    optional_present = list(set([i[2:] for i in sys.argv]).intersection([i for i in optional_params]))
    args = getResolvedOptions(sys.argv, required_params + optional_present)

try:
    table_info = client.get_table(
        DatabaseName=database_name,
        Name=args['TARGET_TABLE_NAME'],
    )
    
    args['TARGET_PATH'] = table_info['Table']['StorageDescriptor']['Location']
    
except botocore.exceptions.ClientError as error:
    if error.response['Error']['Code'] == 'EntityNotFoundException':
        print(f"table {args['TARGET_TABLE_NAME']} doesn't exist and will be created")
    else:
        raise error


sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

raw = glueContext.create_dynamic_frame.from_catalog(
  database = database_name,
  table_name = args['SOURCE_TABLE_NAME'],
  transformation_ctx = "raw"
  )

between_date_clause = ''
if args.get('FROM_YEAR_MONTH') and args.get('TO_YEAR_MONTH'):
    between_date_clause += f"and year||month >= '{args['FROM_YEAR_MONTH']}' and year||month <= '{args['TO_YEAR_MONTH']}'"

filterSql = f'''
    select
        ft.framework, 
        ft.frameworkzone, 
        ft.indexname, 
        ft.year, 
        ft.month, 
        ft.polyid, 
        ft.seasonyear, 
        ft.season, 
        ft.date, 
        ft.frame, 
        ft.platform, 
        ft.gridsquare, 
        ft.habitat, 
        ft.mean, 
        ft.sd, 
        ft.median, 
        ft.min, 
        ft.max, 
        ft.q1, 
        ft.q3
    from (select framework, frameworkzone, indexname, year, month, polyid, seasonyear, season, 
            date, frame, platform, gridsquare, habitat, mean, sd, median, min, max, q1, q3,
            row_number() over (partition by framework, date, polyid, indexname order by gridsquare asc ) as partedrownum
        from raw
        where framework in ({args['FRAMEWORKS']})
            {between_date_clause}) ft
    where partedrownum = 1
'''

nodupes = sparkSqlQuery(
  glueContext,
  query = filterSql,
  mapping = {"raw": raw},
  transformation_ctx = "filterQuery")

ndviSql = '''
    select
        r0.framework, 
        r0.frameworkzone, 
        r0.indexname, 
        r0.year, 
        r0.month, 
        r0.polyid, 
        r0.seasonyear, 
        r0.season, 
        r0.date, 
        r0.frame, 
        r0.platform, 
        r0.gridsquare, 
        r0.habitat, 
        r0.mean, 
        r0.sd, 
        r0.median, 
        r0.min, 
        r0.max, 
        r0.q1, 
        r0.q3
    from nodupes r0 
    where r0.platform != 'S2' or
        exists (select 1 
        from nodupes as r1
        where r1.indexname = 'NDVI'
            and r1.polyid = r0.polyid
            and r1.framework = r0.framework
            and r1.frame = r0.frame
            and r1.platform = r0.platform
            and r1.platform = 'S2'
            and r1.mean > 0.2)
'''

ndviFilterQuery = sparkSqlQuery(
  glueContext,
  query = ndviSql,
  mapping = {"nodupes": nodupes},
  transformation_ctx = "ndviFilterQuery")


sink = glueContext.getSink(
    format_options = {"compression": "snappy"},
    path = args['TARGET_PATH'],
    connection_type = "s3",
    updateBehavior = "UPDATE_IN_DATABASE",
    partitionKeys = ["framework", "year", "month"],
    enableUpdateCatalog = True,
    transformation_ctx = "sink"
)
sink.setCatalogInfo(catalogDatabase = database_name, catalogTableName = args['TARGET_TABLE_NAME'])
sink.setFormat("glueparquet")
sink.writeFrame(ndviFilterQuery)

job.commit()
