import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

# Originally generated for scothabmon to manage the converstion of partitions
# from csv to parquet where there are multiple frameworks

args = getResolvedOptions(sys.argv, ["JOB_NAME"])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args["JOB_NAME"], args)

partitions_csv = glueContext.create_dynamic_frame.from_catalog(
    database="statsdb",
    table_name="partitions_csv",
    transformation_ctx="partitions_csv",
)

partitions_parquet = glueContext.getSink(
    path="s3://jncc-scothabmon-alpha-stats-data/partitions-site/parquet/",
    connection_type="s3",
    updateBehavior="LOG",
    partitionKeys=["framework"],
    compression="snappy",
    enableUpdateCatalog=True,
    transformation_ctx="partitions_parquet",
)

partitions_parquet.setCatalogInfo(
    catalogDatabase="statsdb", catalogTableName="partitions"
)

partitions_parquet.setFormat("glueparquet")
partitions_parquet.writeFrame(partitions_csv)

job.commit()
