
Spatial frameworks (habitat maps)
=================================

Spatial frameworks are a key concept in the system and we need a nice, versioning string identifier for each.

The `framework` table keeps a list of maps.

TODO: Create `framework` table.

PostGIS
-------

PostGIS spatial extensions will need to be enabled for spatial operations.

- locally, I used the `kartoza/postgis` Docker image
- on AWS, I ran all these commands https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.PostgreSQL.CommonDBATasks.PostGIS.html

Importing Living England map into Postgres
------------------------------------------

Export a Postgres dump from QGIS:

- Layer menu, Add Layer, `liveng0.shp`, OK. Ignore yellow warning banner.
- On the layer (on left), Export, Save features as...
  - Postgres SQL dump
  - CREATE_SCHEMA: no
  - DROP_TABLE: if exists

Import into Postgres:

    psql "user=docker password=docker host=localhost port=5430 dbname=gis" -f /c/Work/liveng0-dump.sql

Rename the table to `framework_{framework-identifier}`, e.g. `framework_liveng0`.

Rename the column:

    ALTER TABLE framework_liveng0
    RENAME COLUMN wkb_geometry TO geometry;

Delete the area column:

    (TO DO?)

Add a precomputed EPSG:4326 (WGS84) column to avoid dynamic reprojecting.

    ALTER TABLE framework_liveng0
    ADD COLUMN geometry_4326 geometry;

    UPDATE framework_liveng0 SET geometry_4326=ST_Transform(geometry, 4326)
    > Query returned successfully in 1 min 14 secs.

    ALTER TABLE framework_liveng0
    ALTER COLUMN geometry_4326 SET NOT NULL;

Add a spatial index

    CREATE INDEX framework_liveng0_geometry_4326_index
    ON framework_liveng0
    USING GIST (geometry_4326);
    > Query returned successfully in 6 secs 32 msec.

Add the partition column

    ALTER TABLE framework_liveng0
    ADD COLUMN partition text;

Load the partition values

    - Load the OSGB 5km grid into QGIS and export.
    - Import into Postgres

        psql "user=docker password=docker host=localhost port=5430 dbname=gis" -f /c/Work/osgb5km.sql

    - Generate the partitions

        select p.polyid, g.tile_name as partition
        into framework_liveng0_partitions
        from framework_liveng0 p
        inner join lateral
        (select g.tile_name
        from osgb5km g
        where ST_Intersects(p.geometry_4326, g.wkb_geometry)
        limit 1  -- just choose the first one!
        ) g on true

    - Insert into the new partition column

        UPDATE framework_liveng0 p
        SET partition = x.partition
        from framework_liveng0_partitions x
        where x.polyid = p.polyid



    