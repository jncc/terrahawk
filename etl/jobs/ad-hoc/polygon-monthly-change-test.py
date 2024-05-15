import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.dynamicframe import DynamicFrame

# Source and destination parameters
#===================================
source_table_name = "aggregated_monthly_test_burn_plough_test"
destination_table_name = "polygon-monthly-change-test"
destination_bucket_key = "s3://jncc-habmon-alpha-stats-data/testing/polygon-monthly-change-test/"
destination_partition_keys = ["framework", "year", "month"]

# Data selection query
#=====================

# source_table is mapped to the table identified by the "source_table_name" variable above.
sql = f'''
    select a.year,
        a.month,
        a.periodstartdate,
        a.framework,
        a.frameworkzone,
        a.polyid,
        a.seasonyear,
        a.season,
        a.platform,
        a.habitat,
        (a.mean - b.mean)/2 as pm_mean_change,
        (a.sd - b.sd)/2 as pm_sd_change,
        (a.median - b.median)/2 as pm_median_change,
        (a.min - b.min)/2 as pm_min_change,
        (a.max - b.max)/2 as pm_max_change,
        (a.q1 - b.q1)/2 as pm_q1_change,
        (a.q3 - b.q3)/2 as pm_q3_change
    from source_table as a
        inner source_table as b on a.framework = b.framework 
        and a.polyid = b.polyid
        and a.indexname = b.indexname
        and b.periodstartdate = add_months(a.periodstartdate, -1)
    where a.platform = 'S2'
    and a.framework = 'liveng1'
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