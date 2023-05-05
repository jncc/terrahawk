import sys
import boto3
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

required_params = ['JOB_NAME','SOURCE_TABLE_NAME','TARGET_PATH','TARGET_TABLE_NAME','FRAMEWORKS']
optional_params = ['FROM_YEAR_MONTH','TO_YEAR_MONTH']
workflow_params = ['WORKFLOW_NAME', 'WORKFLOW_RUN_ID']

workflow_present = list(set([i[2:] for i in sys.argv]).intersection([i for i in workflow_params]))

args = {}

if len(workflow_present) == 2:
    client = boto3.client('glue')
    
    workflow_name = args['WORKFLOW_NAME']
    workflow_run_id = args['WORKFLOW_RUN_ID']
    workflow_params = client.get_workflow_run_properties(Name=workflow_name,RunId=workflow_run_id)

    args = workflow_params["RunProperties"]

else:
    optional_present = list(set([i[2:] for i in sys.argv]).intersection([i for i in optional_params]))
    args = getResolvedOptions(sys.argv, required_params + optional_present)

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

neighbours = glueContext.create_dynamic_frame.from_catalog(
  database = "statsdb",
  table_name = "neighbours_nearest50"
)

between_date_clause = ''
if args.get('FROM_YEAR_MONTH') and args.get('TO_YEAR_MONTH'):
    between_date_clause += f"and a.year||a.month >= '{args['FROM_YEAR_MONTH']}' and a.year||a.month <= '{args['TO_YEAR_MONTH']}'"

# 'cf' ≈ 'compare'
comparisonsSql = f'''
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
    where a.framework in ({args['FRAMEWORKS']}) 
    {between_date_clause}
    group by a.framework, a.indexname, a.polyid, a.year, a.month
    order by a.framework, a.indexname, a.polyid, a.year, a.month
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
