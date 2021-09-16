
API and implementation queries
==============================

User has already selected:

- Bbox (Area of Interest) (explicitly or implicitly - the viewport)
- Framework

First, do a spatial query on Area of Interest / viewport bbox.
This gets us the polygon IDs in the centre of the viewport, and lets us draw them on the map.

Get polygons
------------

    GET /polygons { framework: string, bbox: string }
    ->
    {
        polygons: {
            polyid: number,
            habitat: string,
            geojson: string,
        } []
    }

    select p.id, p.boundary
    from polygon p
    inner join framework f on p.framework = f.id
    where boundary intersects bbox
    order by distance from centre of bbox -- to avoid SRSP "top-left" problem
    limit 500 -- how many polygons can we draw in leaflet?

Get lookups
-----------

Then, do IN queries to get the lookup values relevant to these polygons:

- years
- seasons? (not really, can just assume all four)
- habitats

These *could probably* all be hard-coded or got from a simpler lookup (all the possible years and habitats) - but some (particularly more zoomed-in) bboxes will obviously not have values for all the years and habitats.

    GET /lookups { framework: string, polyids: string[] }
    ->
    {
        methods:  string[]
        indexes:  string[]
        habitats: string[]
        years:    string[]
        seasons:  string[]
    }

This performs a few queries in parallel. Example lookup query for "years":

    select p.year
    from polygon_stats_by_month p
    where framework = 'phi' -- actually will be 'liveng-0'
        and polyid in (1000,1001,1002)
    group by p.year

How to colour the polygons? Hardest bit.

    GET /colours { framework, polyids: [], method, index, statistic, habitat?, year?, season? }
    ->
    {
        polygons: {
            polyid:        integer
            habitat:       string    // or could get earlier from /polygons
            max_stat_diff: integer
        } []
    }

For all the 500 polygons, for the selected framework, method, index, and statistic (possibly filtered by habitat, year, season):

    select p.polyid, p.habitat, max(p.mean_diff) as max_stat_diff
    from polygon_info_by_month p
    where framework='phi'
        and polyid in (1000,1001,1002)
        and method='sametype'
        and index='NDVI'
        -- dynamically add habitat, year and season to the where clause!
        -- Or even do on the client. What exactly is the use case(s) for filtering?
    group by p.polyid, p.habitat

Choose the correct column dynamically for the selected statistic (mean, median, etc.)

We could possibly combine all this on the server side and return a union of the return types (no round-tripping the big list of integers):

    GET /polygons { framework: string, bbox: string .... need more optional }
    ->
    {
        polygons: {
            polyid: number,
            boundary: string,   // geojson
            habitat: string,
            max_stat_diff: integer
        } [],
        lookups: {
            methods:  string[]
            indexes:  string[]
            habitats: string[]
            years:    string[]
            seasons:  string[]
        }
    }

But what happens when your selection / filter becomes invalid on moving the bbox...?
Less efficient, since you only actually want the *new* polygons when you move the map. Sending IDs-only could be optimised for this (theoretically!).

Get the stats to plot the chart for an individual polygon. This will give us a manageable number of rows (current ~45 for Dark Peak):

    GET /polygon { framework: string, polyid: integer, index: string, method: string }
    ->
    {
        stats: {
            year:     string           // '2020'
            period:   string           // '04' or 'spring'
            polygon:  PolygonStat[]    // the row from the final view
            baseline: BaselineStat[]   // the row from the habitat view
        }
    }

    select *
    from polygon_info_by_month
    where framework = 'phi' and polyid = 3052
        and index = 'RVI'
        and method = 'sametype'
    order by year, month

Example query for 'sametype' method. Get the stats to plot the baseline (ie habitat mean). This will give us the values to plot the baseline / normal line for the time period (currently 45 for Dark Peak)

    select *
    from habitat_stats_by_month
    where
        framework='phi'
        and habitat='Lowland fens' -- the habitat of the polygon
        and index='RVI'
    order by year, month

Spike previousyear
------------------

    select
        p.*,
        'previousyear' as method,
        get_diff(p.mean, a.mean, a.sd) as mean_diff -- does this even make sense?
    from polygon_stats_by_month p
    inner join polygon_stats_by_month a on p.framework= a.framework and p.habitat=a.habitat and p.index=a.index and p.year=(a.year-1) and p.month=a.month
    limit 10000

Initial getSites / Gazeteer ideas
---------------------------------

    getSites({q: string, geojson: string}): Site[] | Error   // returns up to ten sites matching the query;
                                                             // error if geojson overlaps country boundary ?

    # this doesn't support "uploading shapefiles" (what for?) or searching for postcodes
    # (if uploading shapefile support were really needed, make a separate service to validate and convert to geojson)
    # how does the "buffer" work? can it be a bbox or must it follow the site shape?
    # confirm site == AOI
    # but you also surely want to know "what have we got?", ie what's available and processed. need to see availability map
    # why error if query overlaps country boundary?

    type Site {                      // or, AOI
        frameworks: Framework[]      // available spatial framework(s) for this site.
        platforms: Platform[]        // available platforms for this site
        outlineGeojson: string       // all sites will need an outline for previewing # how get? 
        type: SiteType
        country: Country
    }

    type SiteType =
        | 'custom'         // hand-drawn bbox or polygon
        | 'sssi' | 'sac'   // # examples so far?
        | ....             // # what site types are we considering?

    type Country = 'e' | 'n' | 's' | 'w'

    # some sites surely overlap country boundaries - what to do??

    getStats({
        polygonId: string,
        framework: Framework,

    }): Stats

    type Framework = 'phi' | 'hagrid' | 'eunis' | ...

Questions
---------

- What is / are the axes of scaling for this phase?
  - more sites
  - more dates (sentinel images)
  - more frameworks
  - more algorithms
