
Postgres demo
=============

- Feasibility study on how this will perform.
- I am VERY pro-pre-cooking.
  - Fast, reliable, sleep-at-night systems that don't break
- This system is very, very pre-cookable
- But, I'm proposing we don't do as much precooking as initially assumed
- And actually do as little as possible, at least for now
- Why then am I proposing that we don't pre-cook a lot of the data?
  1. There's actually quite a lot of different things to precook to reproduce existing functionality
  2. Flexbility - we're still at an early stage and fundamentals could change
      - method of calculation
      - UI/UX
  3. Enable dynamic functionality, perhaps add new methods
  4. Might not be necessary! Doing Yorkshire will give us a feel for the performance.
  5. Doesn't stop us moving to precook when system design is more settled.
  6. It's been quite easy to reproduce the stats code in SQL

Show table that we get from Jasmin ("zonal stats")
This is stats about each polygon, for each index, for each time period (a month or a season in some year)

- Show postgres.md
- I've imported the Dark Peak data from text files.
- Munged it a bit as there were a few weird bits of data
- > 660,000 rows

- we need to have a DB of some kind (feasibly could be Dynamo though)
  - because need to query by polyid, index and date
  - so that means we definitely have (a) Jasmin and (b) some DB
  - we need to do a spatial query on the AoI/viewport to find the polygons
  - so we probably have Postgres/Postgis
- flexbility

- Proposal us to try to make a Jasmin/non-Jasmin split, at least for this year.
- Indexes will get us quite far
- Materialized views might get us further
  - this is a different type of pre-cooking
