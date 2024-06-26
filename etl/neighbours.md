
Nearest neighbours
==================

Generate the lookup data for our `nearest50` anomoly detection method.

    -- *get the 50 nearest polygons of the same habitat within 50km!*

    select a.polyid, b.polyid as neighbour
    -- into framework_liveng0_nearest50 -- produce an output table (and don't forget to add a PK constraint manually)
    from framework_liveng0 a
    inner join lateral -- fancy! (enables the sub query to reference the columns in the outer query)
      (select c.polyid
       from framework_liveng0 c
       where c.habitat_id = a.habitat_id
         and c.polyid <> a.polyid
         and ST_Distance(c.geometry_4326::geography, a.geometry_4326::geography) < 50000
       order by c.geometry_4326 <-> a.geometry_4326
       limit 50) b
    on true
    -- where a.polyid = '368521' -- malham tarn
    -- where cast(a.polyid as int) % 20 = 0 -- chunk if necessry
    -- limit 100000

- Takes 38 seconds on my laptop to process ~850 polyids, so 22 polygons/sec. 425788 polygons in `liveng0` / 22 seconds => 5.4 hours.
- Doing a mod operation on the polyid allows reliable chunking, so can do the whole thing in e.g. 20 separate runs.

Makes a table like this:

| polyid | neighbour |
| ------ | --------- |
| 508326 | 652497    |
| 508326 | 652514    |
| ...    | ...       |

(...up to 50 neighbours)

Using the output....
--------------------

Dump the neighbours to a CSV file:

    psql "user=docker password=docker host=localhost port=5430 dbname=gis" -c "\copy framework_liveng0_nearest50 to 'framework_liveng0_nearest50.csv' csv header"
    Ignore "Warning: No existing cluster is suitable as a default target."

Copy up to S3:

    aws s3 cp ./framework_liveng0_nearest50.csv s3://jncc-habmon-alpha-stats-data/neighbours/nearest50/csv/framework=liveng0/data.csv --profile jncc-habmon-alpha-admin

Make a table in Athena: (this will need some tweaks when adding additional future frameworks)

    CREATE EXTERNAL TABLE IF NOT EXISTS statsdb.neighbours_nearest50_csv (
      `polyid` string,
      `neighbour` string, 
      `zone` string
    )
    PARTITIONED BY (
      `framework` string
    )
    ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe'
    WITH SERDEPROPERTIES (
      'serialization.format' = ',',
      'field.delim' = ','
    ) LOCATION 's3://jncc-habmon-alpha-stats-data/neighbours/nearest50/csv/'
    TBLPROPERTIES ('has_encrypted_data'='false','skip.header.line.count' = '1');

    -- 👉 load partitions (DON'T FORGET or you'll get zero results)!
    MSCK REPAIR TABLE neighbours_nearest50_csv;

Convert to Parquet:

CREATE TABLE statsdb.neighbours_nearest50
WITH (
    format = 'PARQUET',
    parquet_compression = 'SNAPPY',
    partitioned_by = ARRAY[ 'framework' ],
    external_location = 's3://jncc-habmon-alpha-stats-data/neighbours/nearest50/parquet'
) AS SELECT polyid, neighbour, zone, framework FROM neighbours_nearest50_csv


-- 👉 load neighbours (DON'T FORGET or you'll get zero results)!
    MSCK REPAIR TABLE neighbours_nearest50;

