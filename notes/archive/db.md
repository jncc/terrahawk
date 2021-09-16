
Database
========

Spatial framework
-----------------

Makes the habitat maps available to the app. We use the polygons in the map.
But could these be packaged as tile vectors instead? In which case wouldn't need a DB?
But would still need for any queries? Coverage?

    Framework (              // small lookup table for the different frameworks (habitat maps)
        code,       PK       // 'phi' | 'phi-2022' | 'hagrid' | 'eunis' | 'phase1' ... (phase1 isn't the best name!)
        name,                // eg 'Living England and PHI' | ...
        country,             // 'England' | 'Scotland' ... (for grouping by country - frameworks are generally country-specific)
        centroid,            // so we can show a good default map position
        boundary,            // so we can show the boundary of where we have polygons
        description,         // Markdown description
    )

    Polygon (                // Individual polygons in the framework
        framework,      PK   // Framework code
        polyid INTEGER, PK   // Framework-specific polygon id - check the real IDs and that 32 bit will be enough - and that the frameworks all use IDs 
        boundary GEOMETRY,
        centre   GEOMETRY,   // central coordinate so we can order by (for top 500 from bbox centre)
        metadata JSON,       // include eg habitat?
    )

Main table
----------

Outputs from the batch processing.

    polygon_stats
    -------------

    Stats about each polygon in a framework, for each date, for each index.

    framework TEXT, PK   // Derived from the shapefile name ie /Living_England_v1.shp would give Living_England_v| ...
    polyid INTEGER, PK   // the ID of the polygon in the framework
    index TEXT,     PK   // 'NDVI' | 'NDWI' | 'NDMI' | 'RVI' | 'RVIv' (called `indexname` in SQLLITE)
    date TEXT,      PK   // '2016-10-02'  # could be a DATE or whatever
    year INT             // 2016 }
    month INT            // 10   } denormalised date for efficiency
    season TEXT,         // spring
    seasonyear TEXT,     // 2016
    mean REAL,           // }
    sd REAL,             // }
    median REAL,         // }
    min REAL,            // } stats are about the polgon
    max REAL,            // }
    q1 REAL,             // }
    q3 REAL,             // }
    platform TEXT,       // 'S1' | 'S2' (can be deduced from index but useful to have)
    habitat TEXT,        // ? 'Improved grassland' (we could look this up later from the polyid & framework)
    frame TEXT,          // ? might be useful to store the frame (if there is only one?)

We could reduce the size of the database by creating foreign key relationships.

- framework
- index
- season
- habitat

That way all columns could be simple non-textual values.

Views
-----

    habitat_stats_by_month|season (view)
    ------------------------------------

    Stats for a habitat (polygons of same type) in a framework, for an index, for some method of calculation, in a time period.

    framework TEXT,   PK
    habitat TEXT,     PK  // # is there a shorter habitat code we could use instead of the display name of the habitat?
    index TEXT,       PK
    year INTEGER,     PK
    month INTEGER,    PK  // WHEN ANNUAL
    season TEXT,      PK  // WHEN SEASONAL
    method TEXT,      PK  // 'samesite' | 'sameframe' | 'nearest50' | ...
    mean REAL,
    mean_sd REAL,
    median REAL,
    median_sd REAL,
    min REAL,
    min_sd REAL,
    max REAL,
    max_sd REAL,
    q1 REAL,
    q1_sd REAL,
    q3 REAL,
    q3_sd REAL,
    platform TEXT,
    area_of_consideration TEXT  // ? possibly worth having the spatial information included so that the area the mean has been generated is recorded and users could plot this for reference? but potentially big if geometry and repeated
--  period TEXT,      PK  // '2016-06' WHEN MONTHLY, or '2016-autumn' WHEN SEASONAL (if we don't split monthly/seasonally)

    polygon_info_by_month|season
    ----------------------------

    Final stats about a polygon in a framework, for an index, for some method of calculation, in a time period.

    framework TEXT,   PK
    polyid INTEGER,   PK
    index TEXT,       PK
    method TEXT,      PK   // 'samesite' | 'sameframe' | 'nearest50' .... 'previousyear' | 'previousmonth'
    year INTEGER,     PK
    month INTEGER,    PK   // WHEN ANNUAL
    season TEXT,      PK   // WHEN SEASONAL
    mean,                  // (from polygon_stats)
    mean_diff INTEGER,     // 2 | 1 | 0 (for '>2SD' | '>1SD' | '<1SD')   # thresholds could possibly be changed ...?
    median,                // (from polygon_stats)
    median_diff,           // 2 | 1 | 0
    q1,                    // (from polygon_stats)
    q1_diff,               // 2 | 1 | 0
    q3,                    // (from polygon_stats)
    q3_diff,               // 2 | 1 | 0
    habitat_mean,          // (from habitat_stats_by_period)
    habitat_mean_sd,       // (from habitat_stats_by_period)
    habitat_median,        // (from habitat_stats_by_period)
    habitat_median_sd,     // (from habitat_stats_by_period)
    habitat_q1,            // (from habitat_stats_by_period)
    habitat_q1_sd,         // (from habitat_stats_by_period)
    habitat_q3,            // (from habitat_stats_by_period)
    habitat_q3_sd,         // (from habitat_stats_by_period)
    habitat TEXT,          // (from polygon_stats)
    platform TEXT,         // (from polygon_stats)
    dates TEXT,            // string of one or several aquisition dates '2016-06-06,2016-07-19'
