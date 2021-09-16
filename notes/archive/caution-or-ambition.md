
Caution or ambition
===================

(A) Cautious - stay with Postgres for now, scale to England, then see.
- Cheapest and fastest way to England-scale.
- We're ready to go.
- This is good "MVP" practice - do it as simply as you can first, then iterate.
- Lower-risk - good if this ends up not being useful.
- Risks
 - loading new data becomes a management nightmare
 - we have to swap out the backend and simultaneously run an active service
 - data migration challenge

(B) Ambitious - swap the "backend" to a "Big Data" solution
- We'll need help (but we can get immediately from Bytes)
- We'll need to commit more dev up-front
- Note that there shouldn't be much of a "calendar" delay. The UI can now be built quite independently of the backend.
