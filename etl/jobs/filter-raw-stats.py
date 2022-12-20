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

required_params = ['JOB_NAME','SOURCE_TABLE_NAME','TARGET_PATH','TARGET_TABLE_NAME']
optional_params = ['FROM_YEAR_MONTH','TO_YEAR_MONTH']
optional_present = list(set([i[2:] for i in sys.argv]).intersection([i for i in optional_params]))
args = getResolvedOptions(sys.argv, required_params + optional_present)

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

raw = glueContext.create_dynamic_frame.from_catalog(
  database = "statsdb",
  table_name = args['SOURCE_TABLE_NAME'],
  transformation_ctx = "raw"
  )

between_date_clause = ''
if args.get('FROM_YEAR_MONTH') and args.get('TO_YEAR_MONTH'):
    between_date_clause += f"and year||month >= '{args['FROM_YEAR_MONTH']}' and year||month <= '{args['TO_YEAR_MONTH']}'"

aggregateSql = f'''
    select
        ft.framework, 
        ft.frameworkzone, 
        ft.indexname, 
        ft.year, 
        ft.month, 
        ft.polyid, 
        ft.seasonyear, 
        ft.season, 
        ft.date, 
        ft.frame, 
        ft.platform, 
        ft.gridsquare, 
        ft.habitat, 
        ft.mean, 
        ft.sd, 
        ft.median, 
        ft.min, 
        ft.max, 
        ft.q1, 
        ft.q3
    from (select framework, frameworkzone, indexname, year, month, polyid, seasonyear, season, 
            date, frame, platform, gridsquare, habitat, mean, sd, median, min, max, q1, q3,
            row_number() over (partition by framework, date, polyid, indexname order by gridsquare asc ) as partedrownum
        from raw r0
        where exists (select r1.mean 
                    from raw as r1
                    where r1.indexname = 'NDVI'
                        and r1.polyid = r0.polyid
                        and r1.framework = r0.framework
                        and r1.frame = r0.frame
                        and r1.mean > 0.1
            )) ft
    where partedrownum = 1 {between_date_clause}
'''

filterQuery = sparkSqlQuery(
  glueContext,
  query = aggregateSql,
  mapping = {"raw": raw},
  transformation_ctx = "filterQuery")


sink = glueContext.getSink(
    format_options = {"compression": "snappy"},
    path = args['TARGET_PATH'],
    connection_type = "s3",
    updateBehavior = "UPDATE_IN_DATABASE",
    partitionKeys = ["framework", "year", "month"],
    enableUpdateCatalog = True,
    transformation_ctx = "sink"
)
sink.setCatalogInfo(catalogDatabase = "statsdb", catalogTableName = args['TARGET_TABLE_NAME'])
sink.setFormat("glueparquet")
sink.writeFrame(filterQuery)

job.commit()
