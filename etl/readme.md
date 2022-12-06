
Working notes for AWS Glue ETL processing chain
===============================================

Diagram
--------

        s3://...stats-raw/parquet/   (written to S3 from Jasmin)
        🏢 raw_stats
              |                  **there is also an equivalent `seasonally` branch!**
       💥 aggregate-monthly-parameterised         
              |
    s3://...stats-data/aggregated-monthly/parquet/      
    🏢 stats_aggregated_monthly                         
                            \         s3://...stats-data/neighbours/nearest50/parquet/
                             \        🏢 stats_neighbours_nearest50
                              \           |
                               \          |     s3://...stats-data/partitions-lg/parquet/
                                \         |     🏢 stats_partitions
                                 \        |        /
                             💥 compare-monthly-nearest50-parameterised
                                          |
                      s3://...stats-data/compared-monthly-nearest50/parquet/
                      🏢 stats_compared_monthly_nearest50

Frame level stats are stored in the `raw_stats` table and then grouped by month by the `aggregate-monthly-parameterised` job. This job will also remove "duplicates" which are made likely due to the fact that the frames overlap by about 10km. The `compare-monthly-nearest50-parameterised` job then uses the `neighbours_nearest50` table to calculate the monthly means, monthly mins, monthly maxes, etc (cf scores) using the nearest 50 polygons of the same habitat. It will also calculate the Z scores (difference scores) and use the `partitions` table to add the partition ID for each polygon (for querying efficiency). These extra details are added to the original columns and saved to the `monthly_nearest50_x` table.

Z scores greater than 1 are indicated as yellow on the app, Z scores greater than 2 are indicated as red.

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
    ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
    WITH SERDEPROPERTIES (
      'separatorChar'=',',
      'quoteChar'='"'
    )
    LOCATION 
      's3://jncc-habmon-alpha-stats-raw/csv/'
    TBLPROPERTIES (
      'skip.header.line.count'='1'
    );

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

Migrating data for table changes
--------------------------------

If you add or remove columns from the Athena tables, you may need to do a data migration to make sure the data is still read correctly. CSV in particular needs the values to appear in the correct order but parquet seems a bit more flexible. Our last data migration was needed for the addition of the frameworkzone column. Steps below:

1. First update the raw_stats data.

    Backup the existing stats just in case (i.e. copy them to a different location in S3), then run the following commands in Athena to migrate the parquet and csv data into temporary tables with the additional frameworkzone value. If the temporary `old_raw_stats` and `old_raw_stats_csv` tables already exist, they will need dropping in Athena, and if the files exist in the temp location in S3 (e.g. `s3://jncc-habmon-alpha-stats-data/temp/old_raw_stats/`) then they will need deleting first.
    
    For parquet:

    ```
    CREATE TABLE statsdb.old_raw_stats
    WITH (
        format = 'PARQUET',
        parquet_compression = 'SNAPPY',
        partitioned_by = ARRAY['framework', 'year', 'month'],
        external_location = 's3://jncc-habmon-alpha-stats-data/temp/old_raw_stats/parquet'
    ) AS SELECT indexname, polyid, date, seasonyear, season, habitat, gridsquare, frame, '1' as frameworkzone, platform, mean, sd, median, min, max, q1, q3, framework, year, month FROM raw_stats

    MSCK REPAIR TABLE old_raw_stats
    ```

    For csv:

    ```
    CREATE TABLE statsdb.old_raw_stats_csv
    WITH (
        format = 'TEXTFILE',
        field_delimiter=',',
        partitioned_by = ARRAY['framework', 'year', 'month'],
        external_location = 's3://jncc-habmon-alpha-stats-data/temp/old_raw_stats/csv'
    ) AS SELECT indexname, polyid, date, seasonyear, season, habitat, gridsquare, frame, '1' as frameworkzone, platform, mean, sd, median, min, max, q1, q3, framework, year, month FROM raw_stats_csv

    MSCK REPAIR TABLE old_raw_stats_csv
    ```

    Once they've run and been MSCK REPAIR'd, you should be able to query them in Athena to check the new frameworkzone values were added:

    ```
    select *
    from old_raw_stats
    limit 100
    ```

    You should also see that files have been created in S3, e.g. at `s3://jncc-habmon-alpha-stats-data/temp/old_raw_stats/`. The filenames will look a bit weird because they've been created by Athena but that's OK.

2. Next clean out the raw_stats tables and move the migrated data in.

    Drop the tables (`raw_stats` and `raw_stats_csv`) and delete the data (under `jncc-habmon-alpha-stats-raw/parquet/` and `jncc-habmon-alpha-stats-raw/csv`). Now move the updated data files from the temp area to the raw_stats area (e.g. `s3://jncc-habmon-alpha-stats-data/temp/old_raw_stats/` goes to `jncc-habmon-alpha-stats-raw`). The important thing is to keep the partitions the same here.

3. Recreate the raw_stats tables with the updated table definitions.

    See the `Setting up raw_stats` section of this readme for the existing table definitions which you'll need to update with your column changes and run again. For CSV, you'll need to make sure the order of the columns is the same as what you used in the old_raw_stats_csv query or CSV will get confused. After creating the tables, run `MSCK REPAIR TABLE <tablename>` on them and you should be able to query them to check they have the migrated data.

4. Update the code in the glue jobs if needed.

5. Rerun the `generate-compare-nearest-50` glue workflow to carry the change through to the final stats tables.

    You'll first need to drop the `aggregated_monthly` and `monthly_nearest50_x` tables and clear the data first (in this bucket: `jncc-habmon-alpha-stats-data`). Then trigger the workflow and it should recreate those tables for you.
    
Setting parameters for parameterised jobs
-----------------------------------------

The aggregate-monthly and compare-monthly-nearest50 jobs have been parameterised to allow the same script to be reused for either 
live or test data and for either England or Scotland data, and additionally to optionally select a specific month of data to aggregate.

The mandatory parameter keys have been specified in the Job Details > Advanced Properties section of the Glue Jobs in Glue Studio, with some default values provided.
This is purely to document within Glue Studio which parameters are required, and to make it easier if developers need to run these jobs in isolation.
However, these values will be overridden by the values specified for each job within each of the different workflows for England or Scotland, test or live.
These values can be seen/changed by clicking on the job within the Workflow Legend and selecting Action > Edit Job Parameters.

Below by way of illustration for each job is a list of the parameters required and the (currently) correct value to use for live England data

aggregate-monthly-parameterised:

- --SOURCE_TABLE_NAME   raw_stats
- --TARGET_PATH         s3://jncc-habmon-alpha-stats-data/aggregated-monthly/
- --TARGET_TABLE_NAME   aggregated_monthly

Optionally, the --FROM_YEAR_MONTH and --TO_YEAR_MONTH parameters can be specified to subset the data that is agggregated.
If they are not specified, all of the available data in the source location will be processed.  Due to a quirk of Glue Studio, they cannot be specified
in the Job parameters with blank values, the parameter keys will just get removed when you save the job.  If the subset is not required, just omit the parameters.
Example (would aggregate 11/21, 12/21, 01/22 and 02/22) :
- --FROM_YEAR_MONTH        202111
- --TO_YEAR_MONTH          202202

compare-monthly-nearest50-parameterised:

- --SOURCE_TABLE_NAME   aggregated_monthly
- --TARGET_PATH         s3://jncc-habmon-alpha-stats-data/monthly-nearest50/parquet/
- --TARGET_TABLE_NAME   monthly_nearest50_6
- --FRAMEWORKS          'liveng0', 'liveng1'


