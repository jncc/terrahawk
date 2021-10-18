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

args = getResolvedOptions(sys.argv, ['JOB_NAME'])

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

raw = glueContext.create_dynamic_frame.from_catalog(
  database = "statsdb",
  table_name = "raw_stats",
  transformation_ctx = "raw"
  )

aggregateSql = '''
    select
        count(*) as count,
        framework,
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
    --where year='2020' and month='04'
    group by framework, polyid, indexname, year, month, seasonyear, season, platform, habitat
'''

aggregated = sparkSqlQuery(
  glueContext,
  query = aggregateSql,
  mapping = {"raw": raw},
  transformation_ctx = "aggregated")


sink = glueContext.getSink(
    format_options = {"compression": "snappy"},
    path = "s3://jncc-habmon-alpha-stats-data/aggregated-monthly/",
    connection_type = "s3",
    updateBehavior = "UPDATE_IN_DATABASE",
    partitionKeys = ["framework", "year", "month"],
    enableUpdateCatalog = True,
    transformation_ctx = "sink"
)
sink.setCatalogInfo(catalogDatabase = "statsdb", catalogTableName = "aggregated_monthly")
sink.setFormat("glueparquet")
sink.writeFrame(aggregated)

job.commit()
