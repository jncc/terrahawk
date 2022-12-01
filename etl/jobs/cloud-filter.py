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

sc = SparkContext.getOrCreate()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)

# job.init(args['JOB_NAME'], args)

raw = glueContext.create_dynamic_frame.from_catalog(
    database = "statsdb",
    table_name = "raw_stats",
    transformation_ctx = "raw"
    )

sql = '''
    select
        r.polyid,
        r.year,
        r.month
        percentile(r.mean, 0.03) as percentile
    from raw r
    where indexname='NDVI'
    group by framework, polyid, year, month
    limit 100
'''

result = sparkSqlQuery(
    glueContext,
    query = sql,
    mapping = {"raw": raw},
    transformation_ctx = "result")