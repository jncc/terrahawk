
Achievements in 2020/21 financial year
======================================

- Statistics for Sentinel 2 #TODO and Sentinel 1 processed on Jasmin supercomputer
- Draft app design, wireframes
- "Plan A" architectural proposal
- Explored and demonstrated the Postgres-based solution to UK-scaling
- Moved some R processing logic within the Postgres database
- Backend API to support "plan A" architecure (perhaps 50% complete)
  - See https://a7ion0ny26.execute-api.eu-west-2.amazonaws.com/api/hello
- Shipped demo web page using some of this API
  - See http://jncc-habmon-alpha-web.s3-website.eu-west-2.amazonaws.com/
- Decided a naming and versioning convention for habitat maps

What we don't quite yet know
----------------------------

- Will the "Plan A" architecture truly support to UK-scale?

In other words,

- Will the Postgres database be too big or too slow?
- Will the thumbnails take too long to generate or take up too much space?
