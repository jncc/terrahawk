import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.dynamicframe import DynamicFrame

# Source and destination parameters
#===================================
source_table_name = "monthly_nearest50"
destination_table_name = "monthly_nearest50_20230125"
destination_bucket_key = "s3://jncc-habmon-alpha-stats-data/20230125/monthly-nearest50-2/"
destination_partition_keys = ["framework", "indexname", "poly_partition"]

# Data selection query
#=====================

# source_table is mapped to the table identified by the "source_table_name" variable above.
sql = f'''
    select * from source_table
'''


def sparkSqlQuery(glueContext, query, mapping, transformation_ctx) -> DynamicFrame:
    for alias, frame in mapping.items():
        frame.toDF().createOrReplaceTempView(alias)
    result = spark.sql(query)
    return DynamicFrame.fromDF(result, glueContext, transformation_ctx)

args = getResolvedOptions(sys.argv, ["JOB_NAME"])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args["JOB_NAME"], args)


source = glueContext.create_dynamic_frame.from_catalog(
    database="statsdb",
    table_name=source_table_name,
    transformation_ctx="source",
)


filterQuery = sparkSqlQuery(
  glueContext,
  query = sql,
  mapping = {"source_table": source},
  transformation_ctx = "filterQuery")


sink = glueContext.getSink(
    format_options = {"compression": "snappy"},
    path = destination_bucket_key,
    connection_type = "s3",
    updateBehavior = "UPDATE_IN_DATABASE",
    partitionKeys = destination_partition_keys,
    enableUpdateCatalog = True,
    transformation_ctx = "sink"
)
sink.setCatalogInfo(catalogDatabase = "statsdb", catalogTableName = destination_table_name)
sink.setFormat("glueparquet")
sink.writeFrame(filterQuery)


job.commit()