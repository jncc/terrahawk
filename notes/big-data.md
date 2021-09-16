Should we be using Postgres ?
=============================

1. Postgres works well once data is imported, aggregated and indexed
2. Loading data in to Postgres caused a significant problem
3. Running aggregations is slow

Yorkshire data gave us:

- ~400,000 polygons
- ~200 million rows
- ~20 GB (4 years of data)

Can expect maybe x10 for England, then conceivably x10 different frameworks (maps) in time.
Could be separate tables, no problem.
BUT, will grow every year.  
~~> 20 x 10 x 10 = ~2TB

Things to explain
-----------------

- "Raw" stats
- Monthly / seasonal aggregation
- Comparator values (habitat means)
  - separate table to support different comparisons, or just add to side
  - calculate diff (0,1,2) (this way of scoring could possibly change)
- Full time-series of diffs for one polyindex (12 x total years = ~100 rows)
- Max diff for each polyindex (~1000) in viewport within selected time series (of ~100 rows)

"Raw" stats
-----------

| framework* | polyid*  | indexname* | date*          | seasonyear†| season†| habitat†                | gridsquare†| frame†                                             | mean        | sd        | ... |
|------------|----------|------------|----------------|------------|--------|-------------------------|------------|----------------------------------------------------|-------------|-----------| --- |
| liveng-0   | 708353   | NDVI       | 2021-02-27     | 2020       | Winter | Arable and horticulture | T30UWE     | S2B_20210227_lat54lon217_T30UWE_ORB080_utm30n_osgb | -0.88104787 | 0.3129950 | ... |

† Denormalised but useful data

Monthly / seasonal aggregation
------------------------------

- Aggregation *by month* reduces size by well over half (as there are several satellite frames per month).
- Aggregation also needs to be done *by season* (so 1/4 of the size of monthly).

We need to fold `frame` as a CSV value or whatever, as we need to know all the frames that have contributed to the aggregated stat.

How to do this automatically or statically?

Primary keys for `by_month` and `by_season` respectively:

| framework* | polyid*  | indexname* | year* | month* |
|------------|----------|------------|-------|--------|
| liveng-0   | 708353   | NDVI       | 2021  | 2      |

| framework* | polyid*  | indexname* | seasonyear* | season* |
|------------|----------|------------|-------------|---------|
| liveng-0   | 708353   | NDVI       | 2020        | Winter  |

Comparision values
------------------

We basically want to know what is "normal" for a polygon.
A table is (somehow) made for comparison - eg an average of the stats for *all the polygons of the same habitat type*.
We need to model "comparators" that only apply to subsets of polygons.
A simple way is to provide (certainly much-duplicated) values for each stat row.

| framework* | polyid*  | indexname* | year* | month*        | | comparison | comp_mean   | comp_mean_sd | ... |
|------------|----------|------------|-------|---------------|-|------------|-------------|--------------| --- |
| liveng-0   | 708353   | NDVI       | 2021  | 2             | | sametype   | -0.68104787 | 0.2134450    | ... |

| framework* | polyid*  | indexname* | seasonyear* | season* | | comparison | comp_mean   | comp_mean_sd | ... |
|------------|----------|------------|-------------|---------|-|------------|-------------|--------------| --- |
| liveng-0   | 708353   | NDVI       | 2020        | Winter  | | sametype   | -0.68104787 | 0.2134450    | ... |

You can envisage different kinds of comparison:

- The simplest, I call "sametype" - average *all the polygons of same habitat type*.
- We will be given a method for calculating comparison stats by a specialist contractor (something like "sametype-nearby").
- Another is to look at the previous year(s). This doesn't strictly need another table - could be a query. (Same date *two* years ago, anyone? Mean of last five years?)

If it *couldn't* be done dynamically, we would still want to be able to generate new comparator values, perhaps only for a subset of the data if necessary..... to see if the comparison is useful.

Then, we want to know if a polygon (for some index, date and stat) differs from the comparator by more than 1 or 2 SDs.

I currently use two materialized views joined on `habitat` (since I only currently have one value per habitat):

   select
       p.*,
       h.method,
       get_diff(p.mean, h.mean, h.mean_sd) as mean_diff, ...
   from polygon_stats_by_month p
   inner join habitat_stats_by_month h on p.framework = h.framework and p.habitat = h.habitat and p.indexname = h.indexname and p.year = h.year and p.month = h.month

The `get_diff` UDF produces 0, 1 or 2.

So (just for monthly):

| framework* | polyid*  | indexname* | year* | month* | habitat                 | frames (folded, shorted!)                             | mean        | comparison | comp_mean   | comp_mean_sd | mean_diff | ... |
|------------|----------|------------|-------|--------|-------------------------|-------------------------------------------------------|-------------|------------|-------------|--------------|-----------| --- |
| liveng-0   | 708353   | NDVI       | 2021  | 2      | Arable and horticulture | S2B_202102...osgb,S2B_202102...osgb,S2B_202102...osgb | -0.88104787 | sametype   | -0.68104787 | 0.2134450    | 1         | ... |

Max diff for each polyindex (~1000) in viewport within selected time series (of ~100 rows)
------------------------------------------------------------------------------------------

The biggest query the app needs to make is - for:

- one framework (habitat map)
- one indexname (we *probably* will only ever look at one index at a time)
- ~1000 polygons (in the viewport, perhaps up to ~1500)
- ~100 months for the entire 2016+ time series (currently 4x12=50 rows, with 12 added per year)
- one stat value (mean *or* median *or*...) in that row (at least in current UI design), plus all the useful data in that row (so 5 stat columns won't be needed)

...*get the row with the biggest diff*. (See "colours" query.)

> We've decided to make these assumptions in order to make a performant query

Good summary of Athena: https://www.npmjs.com/package/athena-express

Partitioning
------------

Suggestion: use the first two characters of the polyid. Examine count / distribution with this strategy:

    select substring(cast(polyid as text), 0, 3) as polyid_partition, count(*)
    from framework_liveng_0
    group by polyid_partition
    order by polyid_partition
    limit 1000

jncc-habmon-alpha-stats-raw (currently called `ImportYorkshireCSV2`)
--------------------------------------------------------------------

Correcting the Yorkshire data and outputting in Parquet in `jncc-habmon-alpha-stats-raw` gave us:

- ~ 400,000 polygons `->` same (`select count (distinct polyid) from "jncc-habmon-alpha-stats-raw"`)
- 152 million rows (perhaps I rounded up? when I said ~200 million rows - should be the same as CSV)
- 4.5GB (~1/4 of the size of 20 GB)

jncc-habmon-alpha-stats-bymonth (currently called `AggregateByMonth2`)
--------------------------------------------------------------------

    select
        substring(polyid, 0, 2) as polyid_partition,
        count(*) as count,
        framework,
        polyid,
        indexname,
        year,
        month,
        habitat,
        avg(mean) as mean,
        avg(sd) as sd,
        avg(median) as median,
        min(min) as min,
        max(max) as max,
        avg(q1) as q1,
        avg(q3) as q3
    from input
    group by framework, polyid, indexname, year, month, habitat

- 64 million rows (as expected 😀 for 2 or 3 passes per month)
- 2.7 GB

Time series for one polygon takes <1 sec.

    select year, month, mean
    from "jncc-habmon-alpha-stats-bymonth"
    where framework='liveng-0'
      and indexname='NDVI'
      and polyid_partition='23'
      and polyid='239876'
      order by year, month

Habitat means
-------------

- Generated nearest neighbours (see nearest-neighbours.md)

- Join each stat row (from `polygon_stats_by_month`) with the aggregation of the stats in the rows with the same index and date for the neighbouring polygons:

    select a.framework, a.indexname, a.polyid, a.year, a.month,
      cast(avg(b.mean) as real)     as cf_mean,    -- "habitat mean"
      cast(stddev(b.mean) as real)  as cf_mean_sd, -- "sd of habitat mean"
      count(*)                      as cf_count    -- count of contributing polygons
    from polygon_stats_by_month a
    inner join framework_liveng_0_nearest50_sample n
      on a.polyid=n.polyid
    inner join polygon_stats_by_month b
      on a.framework=b.framework and a.indexname=b.indexname and n.neighbour=b.polyid and a.year=b.year and a.month=b.month
    where a.polyid = 508326 -- just for testing
    group by a.framework, a.indexname, a.polyid, a.year, a.month
    order by a.framework, a.indexname, a.polyid, a.year, a.month
