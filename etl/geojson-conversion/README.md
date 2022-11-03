Converts geojason files to Esrijson for ingestion by AWS Athena

Dev env
=======
- install node & npm
- install typescript
- install terraformer (nothing related to hashicorp terraform :) )

```
npm i -D typescript
npm i -D @types/node
npm i @terraformer/arcgis
npm i -D @types/terraformer__arcgis

```

Table creation
==============

- Upload data to bucket 

```

CREATE external TABLE IF NOT EXISTS livingeng
 (
 polyid string,
 habitat string,
 geometry binary
 )
ROW FORMAT SERDE 'com.esri.hadoop.hive.serde.JsonSerde'
STORED AS INPUTFORMAT 'com.esri.json.hadoop.EnclosedJsonInputFormat'
OUTPUTFORMAT 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
LOCATION 's3://jncc-habmon-livingeng/raw/';



````
git filter-branch --index-filter "git rm -rf --cached --ignore-unmatch etl/geojason-conversion/data/LivingEngland_zone1.geojson" HEAD