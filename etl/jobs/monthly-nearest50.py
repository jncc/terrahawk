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

raw = glueContext.create_dynamic_frame.from_catalog(database = "statsdb", table_name = "raw_stats", transformation_ctx = "source")

aggregateSql = '''
    select
        count(*) as count,
        framework,
        indexname,
        year,
        month,
        polyid,
        seasonyear,
        season,
        collect_list(date) as date,
        collect_list(frame) as frame,
        platform,
        habitat,
        avg(mean) as mean,
        avg(sd) as sd,
        avg(median) as median,
        min(min) as min,
        max(max) as max,
        avg(q1) as q1,
        avg(q3) as q3
    from raw
    group by framework, polyid, indexname, year, month, seasonyear, season, platform, habitat

'''
aggregated = sparkSqlQuery(
  glueContext,
  query = aggregateSql,
  mapping = {"raw": raw},
  transformation_ctx = "aggregated")

neighbours = glueContext.create_dynamic_frame.from_catalog(
  database = "statsdb",
  table_name = "neighbours_nearest50",
  transformation_ctx = "neighbours")

# 'cf' ≈ 'compare'
comparisonsSql = '''
    select a.framework, a.indexname, a.polyid, a.year, a.month,
      count(*)                        as cf_count,   -- count of contributing polygons
      cast(avg   (b.mean)   as float) as cf_mean,    -- "habitat mean"
      cast(stddev(b.mean)   as float) as cf_mean_sd, -- "sd of habitat mean"
      cast(avg   (b.median) as float) as cf_median,
      cast(stddev(b.median) as float) as cf_median_sd,
      cast(avg   (b.min)    as float) as cf_min,
      cast(stddev(b.min)    as float) as cf_min_sd,
      cast(avg   (b.max)    as float) as cf_max,
      cast(stddev(b.max)    as float) as cf_max_sd,
      cast(avg   (b.q1)     as float) as cf_q1,
      cast(stddev(b.q1)     as float) as cf_q1_sd,
      cast(avg   (b.q3)     as float) as cf_q3,
      cast(stddev(b.q3)     as float) as cf_q3_sd
    from aggregated a
    inner join neighbours n
      on a.framework=n.framework and a.polyid=n.polyid
    inner join aggregated b
      on n.neighbour=b.polyid and a.framework=b.framework and a.indexname=b.indexname and a.year=b.year and a.month=b.month
    group by a.framework, a.indexname, a.polyid, a.year, a.month
    order by a.framework, a.indexname, a.polyid, a.year, a.month
'''

comparisons = sparkSqlQuery(
  glueContext,
  query = comparisonsSql,
  mapping = {"aggregated": aggregated, "neighbours": neighbours},
  transformation_ctx = "comparisons")

partitions = glueContext.create_dynamic_frame.from_catalog(
  database = "statsdb",
  table_name = "partitions",
  transformation_ctx = "partitions")

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
      cast(abs((a.mean   - c.cf_mean)   / c.cf_mean_sd)   as float) as z_mean_abs,
      cast(abs((a.median - c.cf_median) / c.cf_median_sd) as float) as z_median_abs,
      cast(abs((a.min    - c.cf_min)    / c.cf_min_sd)    as float) as z_min_abs,
      cast(abs((a.max    - c.cf_max)    / c.cf_max_sd)    as float) as z_max_abs,
      cast(abs((a.q1     - c.cf_q1)     / c.cf_q1_sd)     as float) as z_q1_abs,
      cast(abs((a.q3     - c.cf_q3)     / c.cf_q3_sd)     as float) as z_q3_abs,
      p.partition as poly_partition
    from aggregated a
    inner join comparisons c
      on a.framework=c.framework and a.indexname=c.indexname and a.polyid=c.polyid and a.year=c.year and a.month=c.month
    inner join partitions p
      on a.framework = p.framework and a.polyid = p.polyid
'''

result = sparkSqlQuery(
  glueContext,
  query = resultSql,
  mapping = {"aggregated": aggregated, "comparisons": comparisons, "partitions": partitions},
  transformation_ctx = "result")

sink = glueContext.getSink(
    format_options = {"compression": "snappy"},
    path = "s3://jncc-habmon-alpha-stats-data/monthly-nearest50/parquet/",
    connection_type = "s3",
    updateBehavior = "UPDATE_IN_DATABASE",
    partitionKeys = ["framework", "indexname", "poly_partition"],
    enableUpdateCatalog = True,
    transformation_ctx = "sink"
)
sink.setCatalogInfo(catalogDatabase = "statsdb", catalogTableName = "monthly_nearest50")
sink.setFormat("glueparquet")
sink.writeFrame(result)

job.commit()