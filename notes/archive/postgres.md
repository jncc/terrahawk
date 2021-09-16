
Postgres
========

polygon_stats_by_month demo table
---------------------------------

For importing the Dark Peak pilot data.

    CREATE TABLE polygon_stats_by_month(
        ID INTEGER,
        index TEXT,
        month integer,
        year integer,
        mean real,
        sd real,
        median real,
        min real,
        max real,
        Q1 real,
        Q3 real,
        dates text,
        monthdate text,
        HABITAT text
    )

--COPY polygon_stats FROM 'C:\Work\darkpeak-polygon-stats\RVI.txt' WITH (FORMAT csv, HEADER);

--delete from polygon_stats where index = 'RVI'

I renamed id -> polyid and added the framework column with value set to 'phi'.

I also had to dedupe a load of rows by copying into a temporary table...

    select count(*) from
    (
    select p.framework, p.polyid, p.index, p.year, p.month, count(*)
    from polygon_stats_by_month p
    group by p.framework, p.polyid, p.index, p.year, p.month
    having count(*) > 1
    ) x

    CREATE TABLE polygon_stats_by_month_DEDUPED (LIKE polygon_stats_by_month);
    INSERT INTO polygon_stats_by_month_DEDUPED(
            polyid,
            index ,
            month ,
            year ,
            mean ,
            sd ,
            median ,
            min ,
            max ,
            Q1 ,
            Q3 ,
            dates ,
            monthdate ,
            HABITAT, 
            framework
    )
    SELECT 
        DISTINCT ON (framework, polyid, index, year, month)
            polyid,
            index ,
            month ,
            year ,
            mean ,
            sd ,
            median ,
            min ,
            max ,
            Q1 ,
            Q3 ,
            dates ,
            monthdate ,
            HABITAT ,
            framework
    FROM polygon_stats_by_month; 

`psql` command line client
--------------------------

I installed psql (on Ubuntu):

    sudo apt-get install -y postgresql-client
    psql --version

I loaded my .env file:

    export $(grep -v '^#' .env | xargs)
    echo $PGHOST

Then started the interactive psql tool:

    psql

    psql < /the/path/to/sqlite-dumpfile.sql  # doesn't work

pgloader
--------

    sudo apt-get install pgloader

    export $(grep -v '^#' .env | xargs)
/mnt/c/Work/habmon/api/.env.yml

