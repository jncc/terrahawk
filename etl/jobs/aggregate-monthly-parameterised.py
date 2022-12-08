import sys
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

required_params = ['JOB_NAME','SOURCE_TABLE_NAME','TARGET_PATH','TARGET_TABLE_NAME']
optional_params = ['YEAR','MONTH']
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

aggregateSql = '''
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
    group by framework, frameworkzone, polyid, indexname, year, month, seasonyear, season, platform, habitat
    order by framework, year, month
'''

where_date_clause = ''
if args.get('YEAR'):
    where_date_clause += "where year={}".format(args['YEAR'])
    if args.get('MONTH'):
        where_date_clause += " and month={}".format(args['MONTH'])
aggregateSql = aggregateSql.format(where_date_clause)

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
