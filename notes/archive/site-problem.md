
Sites
=====

It seems you can have two architectures:

1. Site-based - new data is processed per-site. All data is *about* a site. As we add more data, more sites appear in the app. (Imagine UK map slowly filling up over time with more named sites appearing - see powerpoint pres.)

    - patchwork
    - you look at one site at a time, areas are looked up by site
    - sites will need a unique identifier scheme (I'm sure they don't all come from the same set - there are different kinds of sites)
    - existing UI might last longer - it is fundamentally site-based.
    - sites will need to be manually prepared for processing
    - "sites" (some of which are expanded boxes around an actual site, eg Cors Bodeilio) might overlap
    - you could do an SSSI and also a national park that contains it - that would be logically possible but weird
    - not everywhere is with a named site - so likely there will be gaps between sites, meaning full county or UK coverage not possible
    - visualisations (thumbnails and closeups) are generated and stored *per site* (the current way)

2. Fully-generic - new data is just processed by area (per-frame, or per-bounding box / custom polygon)

    - enables generic full-coverage of UK, no gaps
    - stats are not coupled to sites / "about" a site
    - how to determine which other polygons to compare for SameSiteSameType algorithm? 10k box? Will that work as well?
    - suits other algorithms better - ie RunningAverage or whatever
    - still allows search by any kind of site via a gazatteer or spatial query
    - images (thumbnails) will need to be done in a completely different way
      - not generated per-site
      - currently the source files are convenient to generate at the same time as the indexes
    - full decoupling of Stats, Gazetteer and Image microservices

Solving the site problem
------------------------

If we tweak the algorithm, we could avoid the site problem and make the whole system generic.

Just had interesting chat with Gwawr where I suggested alternatives to SameTypeSameSite.

- SameTypeIn10kBox - compare with polygons of the same habitat type within a 10k *bounding box around the polygon* (cf. Cors Bodeilio)
- SameTypeNearestN - compare with the *spatially nearest* `n` (10, 20, or 100 whatever) polygons of the same habitat type.
- SameTypeSameFrame - Gwawr suggested just using the Sentinel frame! Even simpler. :-)

Theoretically, using a bigger area might make the results better. It might make some results worse, for bio-geo reasons.

We should run the alternative algorithm(s) on the existing pilot sites and compare the stats. We could see how much variation there is and whether they are as good. We could publish additional instances of the existing pilot app to Shintyapps to enable comparison. Eg. https://jncc.shinyapps.io/CUUSameTypeSameFrame/
