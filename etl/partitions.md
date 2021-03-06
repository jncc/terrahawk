
Uploading partitioning info
===========================

The "partitions" table should really be called "polygon partitions" or similar. It lists which partition value each polygon is in. The polygons are partitioned by an OS gridsquare so that you only ever need to read one or four partitions to read the stats at any map position. (See the 'framework' table in the database scripts for details of how the polygon partition values are generated.)

Dump the `partitions` database table for the framework to a CSV file:

    psql "user=docker password=docker host=localhost port=5430 dbname=gis" -c "\copy framework_liveng0_partitions_10km to 'framework_liveng0_partitions_10km.csv' csv header"

    (ignore "Warning: No existing cluster is suitable as a default target.")

Copy up to S3:

    aws s3 cp ./framework_liveng0_partitions_10km.csv s3://jncc-habmon-alpha-stats-data/partitions/csv/framework=liveng0/data.csv --profile jncc-habmon-alpha-admin

Make a table in Athena: (this will need some tweaks when adding additional future frameworks)

    CREATE EXTERNAL TABLE IF NOT EXISTS statsdb.partitions_csv (
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
    MSCK REPAIR TABLE partitions_csv;

Convert to Parquet: (Note I used `lg` for "large" 10km-square partitionsm and `sm` for "small" 5km-square partitions as not sure which would perform best.)

    CREATE TABLE statsdb.partitions_LIVENG0_DELETEME
    WITH (
        format = 'PARQUET',
        parquet_compression = 'SNAPPY',
        external_location = 's3://jncc-habmon-alpha-stats-data/partitions-lg/parquet/framework=liveng0/'
    ) AS SELECT polyid, partition FROM partitions_csv

Make the final table:

    CREATE EXTERNAL TABLE statsdb.partitions (
        `polyid` string,
        `partition` string
    )
    PARTITIONED BY (
      `framework` string
    )
    ROW FORMAT SERDE 'org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe'
    STORED AS INPUTFORMAT 'org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat'
    OUTPUTFORMAT 'org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat'
    LOCATION 's3://jncc-habmon-alpha-stats-data/partitions-lg/parquet/'
    TBLPROPERTIES (
        'has_encrypted_data'='false',
        'parquet.compression'='SNAPPY'
    )

    -- 👉 load partitions (DON'T FORGET or you'll get zero results)!
    MSCK REPAIR TABLE partitions;
