
General Glue tips
=================

Job properties to set for new jobs
----------------------------------

- role
- Job bookmark - DISABLE for dev (or the job won't run unless source data changes)
- retries: 0 (default is 3 retries)
- timeout: (60 minutes, to avoid accidentally spending $$$)
- tags (if necessary)

Glue catalog tables need to have new partitions loaded manually
---------------------------------------------------------------

When new data is added, if it is in a new partition (which it will be for new dates in `raw_stats`), you have to run the `MSCK REPAIR TABLE` command (can be done in Athena).

Parquet pain-points in Glue
---------------------------

- When writing parqet (Glue Parquet), seems you need need at least one partition.
- It seems you *cannot have a column that is also a partition*. You get a "duplicate column" error.

Useful S3 commands for working with Glue jobs 
---------------------------------------------

To reset a bookmark:

    aws glue reset-job-bookmark --job-name monthly-nearest50 --region eu-west-2 --profile jncc-habmon-alpha-admin

Empty a bucket or folder (perhaps to delete data in destination bucket).

    aws s3 rm s3://jncc-habmon-alpha-jasmin-csv-sample --recursive --profile jncc-habmon-alpha-admin

To delete a bucket, empty a bucket first (see above ^^^), then delete:

    aws s3 rb s3://jncc-habmon-alpha-jasmin-csv-sample --profile jncc-habmon-alpha-admin

To move a folder:

    aws s3 mv s3://jncc-habmon-alpha-stats-data/monthly-nearest50-2/ s3://jncc-habmon-alpha-stats-data/monthly-nearest50/ --recursive --profile jncc-habmon-alpha-admin

AWS tips
--------

- for speed, increase data processing units (seems to be "workers" in the UI)

- for bigger output files, group the (small) input files:

https://aws.amazon.com/blogs/big-data/best-practices-to-scale-apache-spark-jobs-and-partition-data-with-aws-glue/
https://docs.aws.amazon.com/glue/latest/dg/grouping-input-files.html

    dyf = glueContext.create_dynamic_frame_from_options("s3", {'paths': ["s3://awsexamplebucket/"], 'groupFiles': 'inPartition', 'groupSize': '10485760'}, format="json")

    