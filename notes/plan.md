
Plan
====

The deliverables to end-of-year (1 April 2021):

- Demonstrate upscaled batch processing (all of Yorkshire)
  - including a first version of a UI to support this (however, as discussed...)
- Present the first draft of a UK-scale system design / architecture

Sprint 1 (to Tues 16 Feb)
-------------------------

- [x] Flesh out API-first proposal for PR/LW {pm}
- [x] Talk to Cathy / Felix re Jasmin hosting capabilities {pm}
  - Jasmin can host the thumbnails on 'group workspace'
- [x] Confirm current shiny PoC cannot be upscaled in reasonable time {bt, ih, pm}
- [x] Go over Jasmin processing technically {cj, ih, pm, fm}
  - confirm feasibility of per-polygon processing meetin
  - go through process conceptually again
  - cedar archive or copying?
  - do we need to gen the indexes (and thumbs) per polygon or do we do the whole ard frame first, or...?
  - what can jasmin / luigi do to help
  - do we need new jasmin resources?
- [x] Inputs and outputs specified precisely {ih, pm, fm}
  - Inputs
    - list of ARD frames (txt file)
    - spatial framework (shp file)
  - Outputs
    - rows in the polygon_stats in a sqllite table
    - png files for thumbnails
- [x] Thumbnail design session {pm, md, ih}
  - could we also have raster tiles for viz at other useful zoom levels?
  - estimate storage for AoU, pass on to Ulli
- [x] 🎁 Decide thumbnail file path convention (eg phi/12345/20161002/NDVI.png)
- [x] 🎁 Prepare area of upscaling (AoU)
  - [x] decide on an AoU (Yorkshire) {ih, pr}
  - [x] check we have the spatial framework data for AoU {ih, pr}
  - [x] check we have good ARD for AoU - what time periods do we want / have? {ih, fm}
    - use wildcard match the Cedar archive REST api to create manual list of ARD
  - generate or cook habitat means for the AoU as a backup in case we can't do in postgres {ih, pr}
- [x] 🎁 Demo of proof of concept of jasmin/non-jasmin split (Postgres database) {pm}
- [x] 🎁 Request dedicated group workspace on Jasmin for thumbs and stats output {pm, uw}
  - decision: use existing ~4TB free space on existing group workspace

Not done in Sprint 1:

- [x] 🎁 Demo of S1 reframing {fm}

Sprint 2 (to Tues 2 Mar)
------------------------

- [x] Work on thumbnail code {ih, fm}
- [x] Do further API design - spatial query for Area of Interest {pm}
- [x] One week leave {pm}
- [x] 🎁 Demo one ARD frame fully processed {fm, ih}
  - demo of a user running the job on Jasmin
- [x] 🎁 Demo of API spike on DarkPeak {pm}
  - Postgres DB on AWS
- [x] Get hold of some likely other spatial frameworks (how big, what the coverage is, etc.) {ih}
  - estimate potential size of spatial frameworks

Sprint 3 (to Tues 16 March)
---------------------------

- [x] 🎁 Demo processing of *several* frames ~~with their *thumbnails*~~ {fm}
- [x] 🎁 PolygonStats shipped manually to AWS Postgres {fm, pm}
- [x] 🎁 Draft v0 wireframes {pm}
- [x] 🎁 Guesstimate scale of processing for Yorkshire and UK-scale {pm}
  - SQLLite DB is 350MB for 16 frames of S2. UK is Yorkshire so ~350GB?
  - This is probably wrong. We decided to wait for the Yorkshire stats for objectivity
- [x] 🎁 Guesstimate size of thumbnails for Yorkshore & UK
  - storage size for thumbs and stats (for hosting guesstimates)

Sprint 4 (to Tues 30 March)
---------------------------

~~- [ ] Add thumbnail code to processing {fm, ih}~~
- [x] 🎁 (MUST) AoU (Yorkshire) batch processed
- [x] 🎁 (MUST) PolygonStats shipped manually to AWS Postgres
- [x] 🎁 (MUST) Demo API in terminal
- [x] 🎁 (NICE) Demo webpage in a browser
  - (stretch) show the thumbnails too
- [x] 🎁 (MUST) Present v0 design / architecture for UK-scale system
  - technology list
  - architecture diagram
  - benefits / risks

Plan for 2021
-------------

Sprint 5 (to April 30)
----------------------

- [x] Import stats into Postgres {pm, fm}
- [x] Spike COG thumbnails {cj}
- [x] Load test CEDA archive with COG requests {cj}
- [x] Ask Jasmin about COG support and CORS {cj}
  - We want to build an app off this data
  - Can they enable CORS?
  - Likely stability / uptime?
- [x] Ask Jasmin about putting intermediate products (index values) on Cedar archive. {uw}
- [x] Decide index file storage convention
  - `satellite/year/month/day/index/frame.tif` to follow similar pattern to the ARD.
- [x] Implement the polygon spatial query API {pm}

Sprint 6 (to May 14)
--------------------

- [x] Field data feasibility meeting {pr, ih, pm}
- [x] Polygon query slowness on AWS {pm}
- [ ] Jasmin / R changes for dynamic thumbnails {fm}
  - [x] Add `frame` column (for dynamic thumbnails)
  - [x] Neaten the names of the indices files so that they look something like frame ID + index name
  - [x] Convert index files to COGs and save in output area
  - [x] "No data" command needs to go before the GOC command (so nodata set zero) (check w md)
  - [x] Do not allow `NA` values. We've ignored them in all stat columns. (And check habitat column!)
    - check why this is happening? Are we OK just ignoring these rows? {ih}
    - probably all to do with chopping
  - [x] Change `seasonyear` format to `yyyy-season`
- [x] Add `frame` to import.py
- [x] System design and forward planning session {pm, cj, md, fm}
- [x] Initial Bytes architect discussion {pm, cj, md, fm}
- [x] 🎁 Stats imported (finally! ⌚) {pm}
- [x] 🎁 Demo completed thumbs solution, with caching and colorscales {cj}
- [x] 🎁 Demo Yorkshire PoC web app with polygon UI and diffs {pm}


Sprint 7 (to May 28)
--------------------
- [x] Issue with the processing of split granules -it looks like there are only 35 of them for Yorkshire {fm, ih}
- [x] "Big data" query work, Bytes consultancy {pm, fm}
  - Work with Tom to get a Statement of Work 
- [x] Overview / workstream planning {pm}
- [x] Further thumbnail refinement {cj}
- [x] Change `seasonyear` to `yyyy` {fm}.
- [x] Make decision about how to do habitat means for Yorkshire 
  - [x] Demo query with spatially weighted sametype (nearest neighbours) {pm}

Sprint 8 (to June 11)
---------------------

- [x] Test changes to Jasmin code (split granules, frame field...) {ih, fm}
- [x] Arrange and prepare big data work with Bytes {pm, fm}

Sprint 9 (to June 25)
---------------------

- [x] Produce parquet file output {fm}
- [x] Add gridsquare column {fm, pm}
- [x] Big Data exploratory work with Bytes {pm, fm}
  - going slowly
- [x] Memory issue with R raster library is causing intermittant failures {fm}

Sprint 10 (to July 9)
---------------------

- [x] Await Jasmin decision about putting intermediate products (index values) on CEDA archive. {uw}
- [x] Adjust index file storage convention
  - `satellite/index/year/month/day/frame.tif` (each index will have a separate metadata record on CEDA)
- [x] Big Data work with Bytes {pm, fm}
  - [x] Complete Glue pre-processing to parquet (to match new workflow output)
  - [x] Partition key generation step (polyid)   
  - [x] By-month aggregation
  - [x] ~~Example "hardest" query running in <2 seconds~~
  - [x] Example Athena query in Lambda

Sprint 11 (to July 23)
----------------------

- [x] Progress Jasmin decision about putting intermediate products (index values) on CEDA archive. {uw}
- [x] Big Data work with Bytes {pm, fm}
  - [x] Example "hardest" query running in <2 seconds ~ more or less
- [x] Proof / test nearest neighbours SQL

Sprint 12 (to August 6)
-------------------------

- [x] 🎁 Get a solution for S1 top-shift problem {uw, cj}
  - contractor making progress 
- [x] 🎁 Rewrite problematic R function in Python {fm, ih}
- [x] Chase Jasmin decision about putting intermediate products (index values) on CEDA archive. {uw}
- [x] Get hold of all the alpha field data {ih}

Sprint 13 (to August 27)
-------------------------
- [x] 🎁 Generate the "nearest50" neighbours for liveng-0 {pm}
- [x] 🎁 Re-run *some* test data on Jasmin
  - reprocess at least some S2 Yorkshire data. Do a small batch of it first for {pm} to check.
  - pick the S1 scenes where the artifact won't affect Yorkshire {ih}
  - what dates do we want? can we have the updated frame lists for the baskets {ih}
  - configuration / setup basket {cj}
- [x] 🎁 Jasmin decision about putting intermediate products (index values) on CEDA archive. {uw}

Sprint 14 (to September 17)
---------------------------

- [ ] 🎁 Regenerate the "nearest50" neighbours using open licence data for `liveng0` {ih, pm}
- [ ] 🎁 Write metadata for intermediate products on CEDA {ih}
- [ ] Double-check that there's no shift problem for S2 {uw}
- [ ] Plan for how to actually get index files to CEDA archive
- [ ] Monitor contractor for S1 top-shift problem {uw, cj}
- [ ] Ensure that Cloudhealth is billing everything in `jncc-habmon-alpha` account {jp}
- [ ] Check / review time recording against plan {jp}
- [ ] Investigate QA processes for index files {uw}
- [ ] 🎁 Complete (or get Bytes to start) implementation of finished Glue jobs based on completed data and SQL {pm, fm}
- [ ] 🥳 Moved to "code-based" Glue jobs {pm}
- [ ] 🥳 Generate gridded  partition value for each polygon {pm}
- [ ] 🥳 Generate Z-scores in final output {pm}
- [ ] 🥳 New Git repo, tidy & archive all notes & docs {pm}

- 🙋 At this point, can we reliably generate stats and do we have a working comparison method?
- ⏱ We are at least ~2 weeks behind schedule. Due to our Glue issues (and summer break stop-starting?).

*End of alpha phase 1; Start of alpha phase 2.*

Sprint 15 (to October 1)
------------------------ 

- What to go in here?

Stats data workstream:

- [ ] QA the current results in more depth {?}
- [ ] Solve S1 shift problem {?}
- [ ] Process for getting indexes on CEDA {?}
- [ ] 🎁 Run all stats all the way through {?}
- [ ] QA the final stats {ih}

App services workstream:

- [ ] 🎁 Field data API prototype {cj}
  - research & design 
  - get data into Postgres
  - deploy API

UI workstream
-------------

- [ ] 🎁 Implement React map, layout panels
- [ ] 🎁 Parameterise on Index, Statistic, Date
- [ ] 🎁 Implement thumbnails
- [ ] 🎁 Charts for selected polygon
- [ ] 🎁 Field data

Backlog
-------

- [ ] Solve "top 2km" S1 scene issue

- [ ] Reprocess Yorkshire data
  - We need to know where the indexes and COGs are going before we process all England. Short-term solution if we can't get COGs on to CEDA.

- [ ] Aggregate the rows by month and season (separate output DBs).
  - need to store the frames contributing to the aggregation - can we store them efficiently without normalising??
- [ ]  Database normalisation (storage optimisation)?
    - `habitat`
    - `frame`

- [ ] Accessibility in React https://reactjs.org/docs/accessibility.html

- [ ] Z-score / Standard score. Anomaly detection.

- [ ] Ask AWS about storing ARD on AWS Open Data

- [ ] Look at GEE app https://twitter.com/jstnbraaten/status/1366480344367521794?s=20

- [ ] System design dev session {pm, fm, cj, md}
  - how to store and ultimate ship the stats data - could we use group workspace and poll/pull from AWS?

- [ ] System design and forward planning session {all}

- [ ] Design and test Jasmin -> AWS Postgres data transfer
  - How to coordinate multiple writes on Jasmin? SQLite file architecture does not work. Ask Jasmin?

- [ ] Support a date range (yyyy-MM to yyyy-MM)

- [ ] Get hold of some likely other spatial frameworks (how big, what the coverage is, etc.) {ih}
  - import into a common Postgres table structure

- [ ] Investigate vector tiles {pm}
  - generate a vector tile layer for a spatial framework? (ArcGIS?)
  - spike vector tiles in Leaflet - web map using vector tiles showing uk (or maybe just yorkshire) coverage

- [ ] Design session for how to increment and/or repeat processing (state/inventory storage?)
  - ie how do we smoothly add more data to get to UK-scale and as more arrives?
  - also, how do we ensure we don't reprocess polygons at the edges of frames? maybe it doesn't matter

- [ ] Improve efficiency of processing if necessary {fm, ih}

- [ ] Use national character areas to improve habitat means

- [ ] Static website hosting on S3 / Cloudfront {pm}

- [ ] JNCC Gazetteer service https://gazetteer.jncc.gov.uk
  - public, UK-wide gazetteer service for conservation-related sites of interest
  - free text search returns 
  - optionally specify which datasets you want to search, polygon area filter, etc. at later date.
  - licencing?
  - supported, documented web service
  - scalable due to RDS Aurora and Lambda - gives us a chance to explore Aurora

Workstreams
-----------

- Thumbnails (done in principle, with implementation example)
- Big Data backend (progressing very well) - architecture v2 is taking shape as planned
- Comparison methods aka habitat means, how the changes/diffs are generated (fairly big area)
  - need something for `liveng-1` (pm can generate `sametype`, but...)
  - is it fit-for-purpose? Alternatives?
  - what does the data structure look like? Currently one-row-per-habitat. Would it be one-row-per-stat-row?
- Web app (and further related API work)
  - the next most urgent thing is to be able to reproduce essential functionality of pilot
    - change parameters (index, dates)
    - view charts and thumbs
  - support multiple frameworks
  - support multiple methods
- Running and importing all England (`liveng-1`)
- Field data service
- Gazetteer service
- Additional habitat maps (Scotland, etc)
- ~~Vector tiles investigation~~

Web app - obvious to-dos
--------------------------

- Terraform
  - [ ] SSL / cloudfront (perhaps can still deploy with sls once set up in terraform? https://www.serverless.com/learn/tutorial/creating-aws-cloudfront-distribution)
  - API can still be deployed with sls.

