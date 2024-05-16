import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.dynamicframe import DynamicFrame

# Source and destination parameters
#===================================
source_table_name = "aggregated_monthly_20230718"
# this is a table containing one column of poly id's for the burn plough use case
filer_table_name = "Burn_plough_Surrey_Berkshire_polyids"
destination_table_name = "aggregated_monthly_test_burn_plough_test"
destination_bucket_key = "s3://jncc-habmon-alpha-stats-data/testing/aggregated_monthly_test_burn_plough_test/"
destination_partition_keys = ["framework", "periodstartdate"]

# Data selection query
#=====================

# source_table is mapped to the table identified by the "source_table_name" variable above.
sql = f'''
SELECT 
  framework, 
  year, 
  month,
  count , 
  frameworkzone , 
  indexname , 
  source_table.polyid , 
  seasonyear , 
  season , 
  date , 
  frame, 
  platform , 
  habitat , 
  mean , 
  sd , 
  median , 
  min , 
  max , 
  q1 , 
  q3 ,
  make_date(year, month, 1) as periodstartdate
  FROM source_table
   inner join poly_table on source_table.polyid = poly_table.polyid
  WHERE framework in ('liveng1');
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

polyFilter = glueContext.create_dynamic_frame.from_catalog(
    database="statsdb",
    table_name=filer_table_name,
    transformation_ctx="polyfilter",
)

filterQuery = sparkSqlQuery(
  glueContext,
  query = sql,
  mapping = {"source_table": source,
             "poly_table": polyFilter},
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