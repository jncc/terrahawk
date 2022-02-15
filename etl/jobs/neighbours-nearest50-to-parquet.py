import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

args = getResolvedOptions(sys.argv, ["JOB_NAME"])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args["JOB_NAME"], args)

# Script generated for node AWS Glue Data Catalog
neighbours_nearest50_csv = glueContext.create_dynamic_frame.from_catalog(
    database="statsdb",
    table_name="neighbours_nearest50_csv",
    transformation_ctx="neighbours_nearest50_csv",
)

# Script generated for node Amazon S3
neighbours_nearest50 = glueContext.getSink(
    path="s3://jncc-scothabmon-alpha-stats-data/neighbours/nearest50/parquet/",
    connection_type="s3",
    updateBehavior="LOG",
    partitionKeys=["framework"],
    compression="snappy",
    enableUpdateCatalog=True,
    transformation_ctx="neighbours_nearest50",
)

neighbours_nearest50.setCatalogInfo(
    catalogDatabase="statsdb", catalogTableName="neighbours_nearest50"
)

neighbours_nearest50.setFormat("glueparquet")
neighbours_nearest50.writeFrame(neighbours_nearest50_csv)
job.commit()
