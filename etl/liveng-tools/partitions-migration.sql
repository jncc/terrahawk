CREATE TABLE statsdb.old_partitions
WITH (
    format = 'PARQUET',
    parquet_compression = 'SNAPPY',
    partitioned_by = ARRAY[ 'framework' ],
    external_location = 's3://jncc-habmon-alpha-stats-data/partitions-lg-old/parquet'
) AS SELECT polyid, partition, '1' as zone, framework FROM partitions