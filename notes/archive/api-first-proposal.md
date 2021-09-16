
API-first proposal for EOY deliverable
======================================

It is not practical to upscale the existing PoC Shiny app to an area the size of Yorkshire.

- the app is implicitly small-area (site)-based
- this makes perfect sense for the pilot / PoC
- due to this underlying assumption, fundamental changes are needed to demonstrate upscaling
- at best, the changes would be an expensive hack
- the whole thing will then be thrown away

Instead, commence work on the UK-scale system.

We will provide a working first-draft of an essential component of the UK-scale system: the "API". The API will provide the eventual UK-scale app *the data it needs to work*. See diagram.

For this deliverable, we will:

- demonstrate, for any of the ~10,000 (#CHECK!) polygons in the Area of Upscaling, for any of the available indexes and time-periods;
  - in the terminal, the API returning the relevant statistical data for the polygon in JSON format
  - in a browser, a web chart showing change detection for the polygon
- present a v1 draft design and architecture for a UK-scale system
  - this design will include a proposed JASMIN/non-JASMIN processing split
- learn empirically (a PoC) the likely feasibility of the proposed architecture at UK-scale
  - in particular, the deliverable will indicate whether the proposed JASMIN processing split is feasible

