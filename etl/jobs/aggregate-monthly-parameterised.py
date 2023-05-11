import sys
import boto3
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.dynamicframe import DynamicFrame

def sparkSqlQuery(glueContext, query, mapping, transformation_ctx) -> DynamicFrame:
    for alias, frame in mapping.items():
        frame.toDF().createOrReplaceTempView(alias)
    result = spark.sql(query)
    return DynamicFrame.fromDF(result, glueContext, transformation_ctx)

required_params = ['JOB_NAME','SOURCE_TABLE_NAME','TARGET_PATH','TARGET_TABLE_NAME','FRAMEWORKS']
optional_params = ['FROM_YEAR_MONTH','TO_YEAR_MONTH']
workflow_params = ['WORKFLOW_NAME', 'WORKFLOW_RUN_ID',]

workflow_present = list(set([i[2:] for i in sys.argv]).intersection([i for i in workflow_params]))

args = {}

if len(workflow_present) == 2:
    client = boto3.client('glue')
    
    workflow_name = args['WORKFLOW_NAME']
    workflow_run_id = args['WORKFLOW_RUN_ID']
    workflow_params = client.get_workflow_run_properties(Name=workflow_name,RunId=workflow_run_id)

    job_name = getResolvedOptions(sys.argv, ['JOB_NAME'])
    args = workflow_params["RunProperties"]
    args.update({'JOB_NAME' : job_name})

else:
    optional_present = list(set([i[2:] for i in sys.argv]).intersection([i for i in optional_params]))
    args = getResolvedOptions(sys.argv, required_params + optional_present)


sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

raw = glueContext.create_dynamic_frame.from_catalog(
  database = "statsdb",
  table_name = args['SOURCE_TABLE_NAME'],
  transformation_ctx = "raw"
  )

between_date_clause = ''
if args.get('FROM_YEAR_MONTH') and args.get('TO_YEAR_MONTH'):
    between_date_clause += f"and year||month >= '{args['FROM_YEAR_MONTH']}' and year||month <= '{args['TO_YEAR_MONTH']}'"

aggregateSql = f'''
    select
        count(*) as count,
        framework,
        frameworkzone,
        indexname,
        year,
        month,
        polyid,
        seasonyear,
        season,
        collect_list(date) as date,
        collect_list(frame) as frame,
        platform,
        habitat,
        avg(mean) as mean,
        avg(sd) as sd,
        avg(median) as median,
        min(min) as min,
        max(max) as max,
        avg(q1) as q1,
        avg(q3) as q3
    from raw 
    where framework in ({args['FRAMEWORKS']}) 
    {between_date_clause}
    group by framework, frameworkzone, polyid, indexname, year, month, seasonyear, season, platform, habitat
    order by framework, year, month
'''

aggregated = sparkSqlQuery(
  glueContext,
  query = aggregateSql,
  mapping = {"raw": raw},
  transformation_ctx = "aggregated")


sink = glueContext.getSink(
    format_options = {"compression": "snappy"},
    path = args['TARGET_PATH'],
    connection_type = "s3",
    updateBehavior = "UPDATE_IN_DATABASE",
    partitionKeys = ["framework", "year", "month"],
    enableUpdateCatalog = True,
    transformation_ctx = "sink"
)
sink.setCatalogInfo(catalogDatabase = "statsdb", catalogTableName = args['TARGET_TABLE_NAME'])
sink.setFormat("glueparquet")
sink.writeFrame(aggregated)

job.commit()
