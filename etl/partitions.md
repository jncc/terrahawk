
Uploading partitioning info
===========================

Dump the partitions table to a CSV file:

    psql "user=docker password=docker host=localhost port=5430 dbname=gis" -c "\copy framework_liveng0_partitions to 'framework_liveng0_partitions.csv' csv header"
    (ignore "Warning: No existing cluster is suitable as a default target.")

Copy up to S3:

    aws s3 cp ./framework_liveng0_partitions.csv s3://jncc-habmon-alpha-stats-data/partitions/csv/framework=liveng0/data.csv --profile jncc-habmon-alpha-admin

Make a table in Athena: (this will need some tweaks when adding additional future frameworks)

    CREATE EXTERNAL TABLE IF NOT EXISTS statsdb.stats_partitions_csv (
      `polyid` string,
      `partition` string 
    )
    PARTITIONED BY (
      `framework` string
    )
    ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe'
    WITH SERDEPROPERTIES (
      'serialization.format' = ',',
      'field.delim' = ','
    ) LOCATION 's3://jncc-habmon-alpha-stats-data/partitions/csv/'
    TBLPROPERTIES ('has_encrypted_data'='false','skip.header.line.count' = '1');

    -- 👉 load partitions (DON'T FORGET or you'll get zero results)!
    MSCK REPAIR TABLE stats_partitions_csv;

Convert to Parquet:

    CREATE TABLE statsdb.stats_stats_partitions_LIVENG0_DELETEME
    WITH (
        format = 'PARQUET',
        parquet_compression = 'SNAPPY',
        external_location = 's3://jncc-habmon-alpha-stats-data/partitions/parquet/framework=liveng0'
    ) AS SELECT polyid, partition FROM stats_partitions_csv

Make the final table:

    CREATE EXTERNAL TABLE statsdb.stats_partitions (
        `polyid` string,
        `partition` string
    )
    PARTITIONED BY (
      `framework` string
    )
    ROW FORMAT SERDE 'org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe'
    STORED AS INPUTFORMAT 'org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat'
    OUTPUTFORMAT 'org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat'
    LOCATION 's3://jncc-habmon-alpha-stats-data/partitions/parquet/'
    TBLPROPERTIES (
        'has_encrypted_data'='false',
        'parquet.compression'='SNAPPY'
    )

    -- 👉 load partitions (DON'T FORGET or you'll get zero results)!
    MSCK REPAIR TABLE stats_partitions;
