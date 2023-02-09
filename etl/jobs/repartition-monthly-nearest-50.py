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

args = getResolvedOptions(sys.argv, ["JOB_NAME"])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args["JOB_NAME"], args)


source = glueContext.create_dynamic_frame.from_catalog(
    database="statsdb",
    table_name="monthly_nearest50",
    transformation_ctx="source",
)

sql = f'''
    select * from monthly_nearest50
'''

filterQuery = sparkSqlQuery(
  glueContext,
  query = sql,
  mapping = {"monthly_nearest50": source},
  transformation_ctx = "filterQuery")


sink = glueContext.getSink(
    format_options = {"compression": "snappy"},
    path = "s3://jncc-habmon-alpha-stats-data/20230125/monthly-nearest50-2/",
    connection_type = "s3",
    updateBehavior = "UPDATE_IN_DATABASE",
    partitionKeys = ["framework", "indexname", "poly_partition"],
    enableUpdateCatalog = True,
    transformation_ctx = "sink"
)
sink.setCatalogInfo(catalogDatabase = "statsdb", catalogTableName = "monthly_nearest50_20230125")
sink.setFormat("glueparquet")
sink.writeFrame(filterQuery)

job.commit()
