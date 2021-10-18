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


# i don't believe we can use .from_options because we have partitioned input data
# "Because the partition information is stored in the Data Catalog, use the from_catalog API calls to include the partition columns in the DynamicFrame."
# https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-partitions.html

# the following example fails because Glue can't find the 'year' parition column. 
raw = glueContext.create_dynamic_frame.from_options(
  connection_type = "s3",
  format = "parquet",
  connection_options = { "paths": ["s3://jncc-habmon-alpha-stats-raw/parquet/"], "recurse": True },
  transformation_ctx = "raw")

aggregateSql = '''
    select
        count(*) as count,
        framework,
        indexname,
        year,
        month,
        polyid,
    from raw
    where year='2020' and month='04'
    group by framework, polyid, indexname, year, month
'''

aggregated = sparkSqlQuery(
  glueContext,
  query = aggregateSql,
  mapping = {"raw": raw},
  transformation_ctx = "aggregated")

sink = glueContext.getSink(
    format_options = {"compression": "snappy"},
    path = "s3://jncc-habmon-alpha-stats-data/october-test-1/parquet/",
    connection_type = "s3",
    updateBehavior = "UPDATE_IN_DATABASE",
    partitionKeys = ["framework"],
    enableUpdateCatalog = True,
    transformation_ctx = "sink"
)
sink.setCatalogInfo(catalogDatabase = "statsdb", catalogTableName = "october_test_1")
sink.setFormat("glueparquet")
sink.writeFrame(result)

job.commit()
