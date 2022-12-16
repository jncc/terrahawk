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

args = getResolvedOptions(sys.argv, ['JOB_NAME','SOURCE_TABLE_NAME','TARGET_PATH','TARGET_TABLE_NAME','FRAMEWORKS'])

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

aggregated = glueContext.create_dynamic_frame.from_catalog(
  database = "statsdb",
  table_name = args['SOURCE_TABLE_NAME'],
  transformation_ctx = "aggregated"
)

# aggregated = glueContext.create_dynamic_frame_from_options(
#   "s3",
#   { 'paths': ["s3://jncc-habmon-alpha-stats-data/aggregated-monthly/"], 'groupFiles': 'inPartition', 'groupSize': '10485760' },
#   format="glueparquet"
# )

neighbours = glueContext.create_dynamic_frame.from_catalog(
  database = "statsdb",
  table_name = "neighbours_nearest50"
)

# 'cf' ≈ 'compare'
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
                        and r1.mean > 0.1)
          and r0.framework in ({args['FRAMEWORKS']})
          ) ft
    where partedrownum = 1
'''



comparisons = sparkSqlQuery(
  glueContext,
  query = comparisonsSql,
  mapping = {"aggregated": aggregated, "neighbours": neighbours},
  transformation_ctx = "comparisons"
)

partitions = glueContext.create_dynamic_frame.from_catalog(
  database = "statsdb",
  table_name = "partitions"
)

# to avoid having to group by every single row in the aggregated table,
# which makes things even harder to understand, join again
# to get all the original columns from the input table paired with the generated comparisons
# also generate the z-scores
# also get the poly_partition
# (this step could be probably all be done in the first query though...)
resultSql = '''
    select
      a.*,
      c.cf_count,
      c.cf_mean,
      c.cf_mean_sd,
      c.cf_median,
      c.cf_median_sd,
      c.cf_min,
      c.cf_min_sd,
      c.cf_max,
      c.cf_max_sd,
      c.cf_q1,
      c.cf_q1_sd,
      c.cf_q3,
      c.cf_q3_sd,
      cast((a.mean   - c.cf_mean)   / c.cf_mean_sd   as float) as z_mean,
      cast((a.median - c.cf_median) / c.cf_median_sd as float) as z_median,
      cast((a.min    - c.cf_min)    / c.cf_min_sd    as float) as z_min,
      cast((a.max    - c.cf_max)    / c.cf_max_sd    as float) as z_max,
      cast((a.q1     - c.cf_q1)     / c.cf_q1_sd     as float) as z_q1,
      cast((a.q3     - c.cf_q3)     / c.cf_q3_sd     as float) as z_q3,
      p.partition as poly_partition
    from aggregated a
    inner join comparisons c
      on a.framework=c.framework and a.indexname=c.indexname and a.polyid=c.polyid and a.year=c.year and a.month=c.month
    inner join partitions p
      on a.framework=p.framework and a.polyid=p.polyid
'''

result = sparkSqlQuery(
  glueContext,
  query = resultSql,
  mapping = {"aggregated": aggregated, "comparisons": comparisons, "partitions": partitions},
  transformation_ctx = "result"
)

# https://github.com/aws-samples/aws-glue-samples/blob/master/FAQ_and_How_to.md#1-how-do-i-repartition-or-coalesce-my-output-into-more-or-fewer-files
repartitioned_dataframe = result.toDF().repartition(1)
repartitioned = DynamicFrame.fromDF(repartitioned_dataframe, glueContext, "repartitioned_dataframe")

sink = glueContext.getSink(
    format_options = {"compression": "snappy"},
    path = args['TARGET_PATH'],
    connection_type = "s3",
    updateBehavior = "UPDATE_IN_DATABASE",
    partitionKeys = ["framework", "indexname", "poly_partition"],
    enableUpdateCatalog = True,
    transformation_ctx = "sink"
)
sink.setCatalogInfo(catalogDatabase = "statsdb", catalogTableName = args['TARGET_TABLE_NAME'])
sink.setFormat("glueparquet")
sink.writeFrame(repartitioned)

job.commit()
