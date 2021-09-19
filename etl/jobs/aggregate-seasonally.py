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

source = glueContext.create_dynamic_frame.from_catalog(database = "statsdb", table_name = "stats_raw", transformation_ctx = "source")

sql = '''
    select
        count(*) as count,
        framework,
        indexname,
        polyid,
        seasonyear,
        season,
        collect_list(date) as date,
        collect_list(gridsquare) as gridsquare,
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
    from input
    group by framework, polyid, indexname, seasonyear, season, platform, habitat

'''
transform = sparkSqlQuery(glueContext, query = sql, mapping = {"input": source}, transformation_ctx = "transform")

sink = glueContext.getSink(
    format_options = {"compression": "snappy"},
    path = "s3://jncc-habmon-alpha-stats-data/aggregated-seasonally/parquet/",
    connection_type = "s3",
    updateBehavior = "UPDATE_IN_DATABASE",
    partitionKeys = ["framework","seasonyear","season"],
    enableUpdateCatalog = True,
    transformation_ctx = "sink"
)
sink.setCatalogInfo(catalogDatabase = "statsdb", catalogTableName = "stats_aggregated_seasonally")
sink.setFormat("glueparquet")
sink.writeFrame(transform)

job.commit()