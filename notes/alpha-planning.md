
Alpha project planning
======================

- {pm} has ~13 weeks work time until 1 Nov
- One sprint = 2 weeks

Phase 1 {pm with fm}
--------------------

- 2 sprints: (including this one) Finish Glue / Athena, fully loaded and API with handover to {?dev}
  - to the point where {?dev} is able to own, understand and run the full Yorkshire stats again
- 1 sprint: Habitat means {pm}
  - with some handover to {?dev}
- 1 sprint: Leave (actually 2.5 weeks spread throughout August)
- Prepare for Field Data implementation {pr}

Phase 2 (three parallel workstreams)
------------------------------------

    |--------------------------------- ---------------------------------------------------------------------------------------------|
    | Stats data {fm|cj, with ih}      | App services {cj}                | Alpha UI {pm}                                           |
    |                                  | *Depends on {pr} for datasets*   | *UI will be alpha quality, existing alpha URL, no SSL.* |
    |----------------------------------|----------------------------------|---------------------------------------------------------|
    | 2 sprints (hopefully none):      | 2 sprints:                       | 1 sprint: Implement React map, layout panels            |
    | depending on data QA issues      | Field data                       |                                                         |
    | Rerun processing if neccessary   | Design & implement backend DB    | 1 sprint: Parameterise on Index, Statistic, Date        |
    | and QA                           | table(s) and API                 |                                                         |
    | *Indexes on CEDA*                | with example datasets            | 1 sprint: Implement thumbnails                          |
    | QA the stats API {ih}            |                                  |                                                         |
    |                                  |----------------------------------| 1 sprint: Charts for selected polygon & field data      |
    | 2 sprints: Scotland processing`* | 2 sprints: (leeway/stretch)      |                                                         |    |                                  | Gazetteer                        |                                                         |
    | (leeway)                         | Design & implement backend DB    |                                                         |
    |                                  | with several datasets            |                                                         |
    |----------------------------------|----------------------------------|---------------------------------------------------------|

`*` Simple ARD Project time but need to factor in dev absence

Post-Alpha
----------

- ... more planning, react to feedback
- 3 sprints: Redeploy to new account, codify Glue jobs in Terraform (do we deploy Glue/Spark scripts from main repo, not terraform), use dedicated security roles etc, use JNCC static site module.
- 1 sprint: Web essentials
- 1 sprint: Accessibility, branding
- 1 sprint: Maps page (multiple mapping frameworks)
