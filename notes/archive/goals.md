
Goals
=====

How to improve on the pilot Shiny app?

- Enable incremental processing of more processed sites / areas
  - more sites?
  - generic areas?
  - we need to know what's already been processed and how to process new areas (inventory)
- Support potential alternative detection methods/algorithms
  - how easy can we make this?
- Make the app 10-1000x faster
- Make thumbnails appear 100-10000x faster
- Save state between sessions
- Don't time-out
- Show where we have stats available (perhaps combine with showing each framework)
- Potentially have nicer UI / interactions eg different ways of visualising the data and images (thumbs)
- Potentially enable hires images / link to source ARD

To do this
----------

- In essence, "get rid of config.yaml"
- We have to define the inputs/outputs of the processing precisely
  - ARD filesets
  - Spatial framework and its parameters (such as its polygonIdField, habitatField)
  - Keep inventory of what has been processed so can be incremented?
- Get hold of frameworks (how big, what the coverage is, etc.)
- Agree fundamental architecture
  - Site-based, fully-generic (or hybrid?)
  - Could dynamic/semi-dynamic stat processing help?
- Get buy-in for a 6-month dev project
- Map the S1 frames to S2 (pre-processing step)
- Get first step (polygon_stats) working on Jasmin
- Finish all the algorithm / processing design and test it
- How to generate images (thumbnails) if not site-based architecture - one per polygon
  - Could we also have raster tiles at other useful zoom levels...?
- Estimate potential size of spatial framework and stats tables
- How many polygons can we show at once?
  - This will determine how the UI works.
- Generate a vector tile layer for each spatial framework? (ArcGIS?)
  - Spike vector tiles in Leaflet - deliverable - web map using vector tiles showing uk (or maybe just yorkshire) coverage
