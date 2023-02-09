Deletions and data replacement
==============================

From time to time there will be a need to delete or replace data. The problem is that the data in athena is immutable. The process to replace data is as follows.

1. Export the data you want to keep to a new location / table using glue.
2. Process the new data into the new location / table.
3. Validate the data in the new locatoin
4. Repoint the app at the new table.
5. Remove the old table and data.


## Exporting the data to a new loction
Create a glue job that copies the data that needs to be kept to a new table and location. See *etl/jobs/ad-hoc/repartition-monthly-nearest-50.py* for an example of a glue job that could be repurposed for this. 

Define an sql query that excludes the data you want to remove. For example by creating a query like the following

```
select * from source_table
(year = '2020' and month in ('02', '04','05'))
```

## Process new data into the new table

Create a glue job / process to run any new data into the newly created table, for example by modifying the targets of the existing workflows.

## Validate the data in the new location

Make sure the timespans and counts of the new and old data match taking account of any data removed.

## Repoint the app at the new table

paint the MONTHLY_NEAREST_50_TABLE environment variable for the lambda functions at the new table.

## Remove the old table and data

Note that deleteing a table in athena / glue does not remove the data in S3, this must be done seperately if required.


