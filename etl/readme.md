
Working notes for AWS Glue ETL processing chain
===============================================

Diagram
--------

        s3://...stats-raw/parquet/   (written to S3 from Jasmin)
        🏢 raw_stats
              |                  **there is also an equivalent `seasonally` branch!**
       💥 aggregate-monthly         
              |
    s3://...stats-data/aggregated-monthly/parquet/      
    🏢 stats_aggregated_monthly                         
                            \         s3://...stats-data/neighbours/nearest50/parquet/
                             \        🏢 stats_neighbours_nearest50
                              \           |
                               \          |     s3://...stats-data/partitions-lg/parquet/
                                \         |     🏢 stats_partitions
                                 \        |        /
                             💥 compare-monthly-nearest50
                                          |
                      s3://...stats-data/compared-monthly-nearest50/parquet/
                      🏢 stats_compared_monthly_nearest50

Creating a new database
-----------------------

AWS Glue Catalog --> Databases --> create new

Creating buckets
----------------

The following buckets are required

- `jncc-habmon-alpha-working` - a scratch area for athena to save results from queries
- `jncc-habmon-alpha-stats-raw` - the raw data that gets uploaded from the jasmin workflow
- `jncc-habmon-alpha-stats-data` - the glue processed data and lookup data.

Setting up 🏢raw_stats
----------------------

Use AWS Athena to make tables in the AWS Glue catalog.

We write CSV as well as Parquet for our convenience. Parquet is currently hard to visualise.

    CREATE EXTERNAL TABLE `raw_stats_csv`(
      `indexname` string, 
      `polyid` string, 
      `date` string, 
      `seasonyear` int, 
      `season` string, 
      `habitat` string, 
      `gridsquare` string, 
      `frame` string,
      `frameworkzone` string,
      `platform` string, 
      `mean` double, 
      `sd` double, 
      `median` double, 
      `min` double, 
      `max` double, 
      `q1` double, 
      `q3` double)
    PARTITIONED BY ( 
      `framework` string, 
      `year` string, 
      `month` string)
    ROW FORMAT DELIMITED 
      FIELDS TERMINATED BY ',' 
    STORED AS INPUTFORMAT 
      'org.apache.hadoop.mapred.TextInputFormat' 
    OUTPUTFORMAT 
      'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
    LOCATION
      's3://jncc-habmon-alpha-stats-raw/csv/'
    TBLPROPERTIES (
      'classification'='csv',
      'skip.header.line.count'='1', 
      'delimiter'=',');

    -- 👉 load partitions (DON'T FORGET or you'll get zero results)!
    MSCK REPAIR TABLE raw_stats_csv;

    -- demo query
    select * 
    from raw_stats_csv
    limit 100;

    CREATE EXTERNAL TABLE `raw_stats`(
      `indexname` string, 
      `polyid` string, 
      `date` string, 
      `seasonyear` int, 
      `season` string, 
      `habitat` string, 
      `gridsquare` string, 
      `frame` string,
      `frameworkzone` string, 
      `platform` string, 
      `mean` float, 
      `sd` float, 
      `median` float, 
      `min` float, 
      `max` float, 
      `q1` float, 
      `q3` float)
    PARTITIONED BY (
      `framework` string, 
      `year` string, 
      `month` string)
    ROW FORMAT SERDE 
      'org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe' 
    STORED AS INPUTFORMAT 
      'org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat' 
    OUTPUTFORMAT 
      'org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat'
    LOCATION
      's3://jncc-habmon-alpha-stats-raw/parquet/'
    TBLPROPERTIES (
      'classification'='parquet'
    );

    -- 👉 load partitions (DON'T FORGET or you'll get zero results)!
    MSCK REPAIR TABLE raw_stats;

    -- demo query
    select * 
    from raw_stats
    limit 100;

