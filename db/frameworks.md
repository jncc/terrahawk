
Spatial frameworks (habitat maps)
=================================

The `framework_...` tables store the habitat maps - the individual polygons and information about them.

Spatial frameworks are a key concept in the system and we need a nice, versioning string identifier for each.

- A framework code should be alphanumeric `[a-z0-9]+` (to be easily used as identifiers in table, ETL jobs and on querystrings) and allow versioning. Examples:

    - `liveng0` - Yorkshire subset of Living England habitat map
    - `liveng1` - Proposed whole-of-England full-classification Living England habitat map
    - `habmos1` - Habitat map of Scotland
    - `eunis1km` - etc...

We'll store each framework in its own table rather than trying to mung them together in one huge table (better for data management and performance).


PostGIS
-------

Postgres PostGIS spatial extensions will need to be enabled for spatial operations.

- locally, I used the `kartoza/postgis` Docker image
- on AWS, I ran all these commands https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.PostgreSQL.CommonDBATasks.PostGIS.html

Uploading a table from a local Postgres to AWS
----------------------------------------------

Could use pg_dump and pg_restore:

    pg_dump -Fc --no-owner -h localhost -p 5430 -U docker -W -d gis -t framework_liveng0 > /c/Work/framework_liveng0.dump
    pg_restore --no-owner -h postgresdb.xxxxxxxxxxx.eu-west-2.rds.amazonaws.com -p 5432 -U postgres -W -d habmon-alpha -t framework_liveng0 /c/Work/framework_liveng0.dump

... but a difference in versions between my local and AWS Postgres meant pg_restore currently didn't work. We can recreate from scatch (locally or remotely) using the following steps. This could be a problem for the full framework though, as uploading a QGIS dump of `liveng` to AWS took an hour or so...

Framework `liveng0` (Living England, Yorkshire subset)
--------------------------------------------

- Import Living England map into Postgres.

    - Export a Postgres dump from QGIS.

        - Layer menu, Add Layer, `liveng0.shp`, OK. Ignore yellow warning banner.
        - On the layer (on left), Export, Save features as...
        - Postgres SQL dump
        - CREATE_SCHEMA: no
        - DROP_TABLE: if exists

    - Import into Postgres...

            psql "user=docker password=docker host=localhost port=5430 dbname=gis" -f /c/Work/liveng0.sql
            
    - ...or if connected to the database via psql shell on a Windows machine, import by using \i followed by the path to the file, eg: 
     
            \i C:/Users/Martin.Bamford/Documents/habmos_Cairngorms.sql
                   

- Rename the table to `framework_{framework-identifier}`, e.g. `framework_liveng0`.

- Rename the geometry column.

        ALTER TABLE framework_liveng0
        RENAME COLUMN wkb_geometry TO geometry;

- Add a precomputed EPSG:4326 (WGS84) column to avoid dynamic reprojection when serving application requests.

        ALTER TABLE framework_liveng0
        ADD COLUMN geometry_4326 geometry;

        UPDATE framework_liveng0 SET geometry_4326=ST_Transform(geometry, 4326)
        > Query returned successfully in 1 min 14 secs.

        ALTER TABLE framework_liveng0
        ALTER COLUMN geometry_4326 SET NOT NULL;

- Add a spatial index.

        CREATE INDEX framework_liveng0_geometry_4326_index
        ON framework_liveng0
        USING GIST (geometry_4326);
        > Query returned successfully in 6 secs 32 msec.

- Add the partition column.

        ALTER TABLE framework_liveng0
        ADD COLUMN partition text;

- Load the partition values.

    - Load the OSGB 10km grid into QGIS and export as Postgres dump.

        - https://github.com/charlesroper/OSGB_Grids/blob/master/GeoJSON/OSGB_Grid_10km.geojson

    - Import into Postgres.

            psql "user=docker password=docker host=localhost port=5430 dbname=gis" -f /c/Work/osgb10km.sql

    - Generate the partitions.

            select p.polyid, g.tile_name as partition
            into framework_liveng0_partitions_10km
            from framework_liveng0 p
            inner join lateral
            (select g.tile_name
            from osgb10km g
            where ST_Intersects(p.geometry_4326, g.wkb_geometry)
            limit 1  -- choose the first one (assign exactly one gridsquare to each polygon!)
            ) g on true
            
            > Query returned successfully in 17 secs 828 msec.

    - Insert into the new partition column.

            UPDATE framework_liveng0 p
            SET partition = x.partition
            from framework_liveng0_partitions_10km x
            where x.polyid = p.polyid

            > Query returned successfully in 42 secs 910 msec.

    - Visualise a partition (use the Postgis "View all geometries in this column" button).

            select *
            from framework_liveng0 p
            where partition = 'SD87'

    - It might be useful to add an index on partition. Not necessary for the app, though.
    
- Create a framework boundary

    - This isn't currently stored in the database, but a framework has a boundary to display on the mapper.
    - Used the QGIS Disolve function to genereate a boundary of all the polygons
    - Exported as Geojson
    - Used https://mapshaper.org/ to reduce size for web
    - Added to www/src/assets/frameworks with a naming convention.
