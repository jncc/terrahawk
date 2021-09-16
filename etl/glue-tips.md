
General Glue tips
=================

Job properties to set for new jobs:

- role
- Job bookmark - DISABLE for dev (or the job won't run unless source data changes)
- retries: 0 (default is 3 retries)
- timeout: (60 minutes, to avoid accidentally spending $$$)
- tags (if necessary)

Parquet pain-points in Glue
---------------------------

- When writing parqet (Glue Parquet), seems you need need at least one partition.
- It seems you *cannot have a column that is also a partition*. You get a "duplicate column" error.

Useful S3 commands for working with Glue jobs 
---------------------------------------------

Data in destination bucket will not be deleted automatically. Empty a bucket:

    aws s3 rm s3://jncc-habmon-alpha-stats-raw-sample2 --recursive --profile jncc-habmon-alpha-admin

