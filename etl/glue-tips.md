
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

AWS tips
--------

- for speed, increase data processing units (seems to be "workers" in the UI)

- for bigger output files, group the (small) input files:

https://aws.amazon.com/blogs/big-data/best-practices-to-scale-apache-spark-jobs-and-partition-data-with-aws-glue/
https://docs.aws.amazon.com/glue/latest/dg/grouping-input-files.html

    dyf = glueContext.create_dynamic_frame_from_options("s3", {'paths': ["s3://awsexamplebucket/"], 'groupFiles': 'inPartition', 'groupSize': '10485760'}, format="json")

