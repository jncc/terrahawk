
Athena
======

    CREATE EXTERNAL TABLE IF NOT EXISTS mydatabase.stats_202005_s2_yorkshire_raw (
    `framework` string,
    `polyid` int,
    `indexname` string,
    `date` string,
    `platform` string,
    `mean` float,
    `sd` float,
    `median` float,
    `min` float,
    `max` float,
    `q1` float,
    `q3` float,
    `month` int,
    `year` int,
    `season` string,
    `seasonyear` string,
    `habitat` string,
    `recordtimestamp` string 
    )
    ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe'
    WITH SERDEPROPERTIES (
    'serialization.format' = ',',
    'field.delim' = ','
    ) LOCATION 's3://jncc-habmon-alpha-bigdatasandbox/csv_raw/'
    TBLPROPERTIES ('has_encrypted_data'='false');

    CREATE EXTERNAL TABLE IF NOT EXISTS mydatabase.stats_202005_s2_yorkshire_BY_MONTH (
    `framework` string,
    `polyid` int,
    `indexname` string,
    `year` int,
    `month` int,
    `polygon_count` int,
    `mean` float,
    `median` float,
    `min` float,
    `max` float,
    `q1` float,
    `q3` float 
    )
    ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe'
    WITH SERDEPROPERTIES (
    'serialization.format' = ',',
    'field.delim' = ','
    ) LOCATION 's3://jncc-habmon-alpha-bigdatasandbox/csv_by_month/'
    TBLPROPERTIES ('has_encrypted_data'='false');


    CREATE TABLE mydatabase.stats_202005_s2_yorkshire_raw_parquet_snappy
        WITH (
            format = 'PARQUET',
            parquet_compression = 'SNAPPY',
            external_location = 's3://jncc-habmon-alpha-bigdatasandbox/parquet_raw'
        ) AS SELECT * FROM stats_202005_s2_yorkshire_raw
        
    CREATE TABLE mydatabase.stats_202005_s2_yorkshire_by_month_parquet_snappy
        WITH (
            format = 'PARQUET',
            parquet_compression = 'SNAPPY',
            external_location = 's3://jncc-habmon-alpha-bigdatasandbox/parquet_by_month'
        ) AS SELECT * FROM stats_202005_s2_yorkshire_by_month

            


Manually convert SQLite to CSV
-------------------------------

Using the biggest SQLite file (1.8GB)
https://gws-access.jasmin.ac.uk/public/defra_eo/change-detection/dbs/202005_s2_yorkshire.db

    # start sqlite interactive
    sqlite3 /c/Work/202004_s2_yorkshire.db

    .headers on
    .mode csv
    .output 202005_s2_yorkshire_BY_MONTH.csv

    select
        framework,
        polyid,
        indexname,
        year,
        month,
        count(*) as polygon_count, -- useful
        cast(avg(p.mean) as real) as mean,
        --cast(stddev(p.mean) as real) as mean_sd,
        -- what about SD?? surely this is all wrong
        cast(avg(p.median) as real) as median,
        --cast(stddev(p.median) as real) as median_sd,
        cast(avg(p.min) as real) as min,
        --cast(stddev(p.min) as real) as min_sd,
        cast(avg(p.max) as real) as max,
        --cast(stddev(p.max) as real) as max_sd,
        cast(avg(p.q1) as real) as q1,
        --cast(stddev(p.q1) as real) as q1_sd,
        cast(avg(p.q3) as real) as q3
        --cast(stddev(p.q3) as real) as q3_sd
    from zonal_stats p
    group by p.framework, p.polyid, p.indexname, year, month
    ;
    .quit

    aws s3 cp 202005_s2_yorkshire_BY_MONTH.csv s3://jncc-habmon-alpha-bigdatasandbox/202005_s2_yorkshire_BY_MONTH.csv --profile jncc-habmon-alpha-admin
