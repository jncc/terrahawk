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
  table_name = "raw_stats_test",
  transformation_ctx = "raw"
  )

# Deduplicates rows which have the same date, index and polyid 
# by choosing the first gridref ordered alphabetically
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
    from
        (select framework, frameworkzone, indexname, year, month, polyid, seasonyear, season, 
            date, frame, platform, habitat, mean, sd, median, min, max, q1, q3,
            row_number() over (partition by date, polyid, indexname order by gridsquare asc ) as partedrownum
        from raw)
    where partedrownum = 1
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
    path = "s3://jncc-habmon-alpha-stats-data/testing/aggregated-monthly/",
    connection_type = "s3",
    updateBehavior = "UPDATE_IN_DATABASE",
    partitionKeys = ["framework", "year", "month"],
    enableUpdateCatalog = True,
    transformation_ctx = "sink"
)
sink.setCatalogInfo(catalogDatabase = "statsdb", catalogTableName = "aggregated_monthly_test")
sink.setFormat("glueparquet")
sink.writeFrame(aggregated)

job.commit()
