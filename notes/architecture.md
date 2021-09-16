
Architecture diagram v2.1
-------------------------

          JASMIN                                             AWS 

    |---------------|              |---------------------|            |--------------|
    |     stats,  --|-- written ---|---->   S3   ──────┐ |            |      RDS     | <--- manually
    |      COGs     |   directly   |         └─ Glue <─┘ |            |  (Postgres   |      loaded
    |       |       |              |      Athena         |            |   + Postgis) |
    |       |       |              |---------------------|            |--------------|
    |       |       |                stats, comparisons         hab maps, field data, gazetteer
    | CEDA archive  |                        |                              |
    |---------------|                 |------------------------------------------|
                    \                 |          API: Gateway + Lambda           |
                     \                |------------------------------------------|
       thumbnails     \                         /
       (generated      \                       /   JSON
       dynamically)     \                     /
                      |-------------------------|
                      |        web app :-)      |
                      |-------------------------|
                 local storage: app state + thumbnail cache

