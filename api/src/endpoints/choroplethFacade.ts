
import { getMaxZScores } from './choropleth'
import { parseArgs } from "./choroplethFacadeArgParser"
import { getPolygonsImpl } from './polygons'

/*
    example: POST /choropleth
    {
        "framework": "liveng0",
        "indexname": "NDVI",
        "bbox":      "POLYGON((-2.34 54.037, -2.34 54.097, -2.22 54.097, -2.22 54.037, -2.34 54.037))"
    }
*/

export const getChoroplethFacade = async (input: any) => {

    console.log(`At ${(new Date()).toISOString()} - entering function`)

    let args = parseArgs(input)

    let polygons = await getPolygonsImpl(args)
    console.log(`At ${(new Date()).toISOString()} - got polygons result`)

    let maxZScoresForThesePolygons = await getMaxZScores({
        framework:      args.framework,
        indexname:      args.indexname,
        yearFrom:       args.yearFrom,
        monthFrom:      args.monthFrom,
        yearTo:         args.yearTo,
        monthTo:        args.monthTo,
        polyids:        polygons.map(p => p.polyid as string),
        polyPartitions: [...new Set(polygons.map(p => p.partition))] // use Set for `distinct`
    })
    console.log(`At ${(new Date()).toISOString()} - got maxZScores result`)
    
    return {
        result: polygons.map(p => {

            let maxZScores = maxZScoresForThesePolygons.find((s: any) => s.polyid === p.polyid) as any
            
            return {
                ...p,
                ...maxZScores
            }
        })
    }
}
