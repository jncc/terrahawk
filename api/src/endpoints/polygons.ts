
import { query } from '../db'
import { parseArgs } from './polygonsArgParser'

/*
    example: POST /polygons
    {
        "framework": "liveng0",
        "bbox":      "POLYGON((-2.34 54.037, -2.34 54.097, -2.22 54.097, -2.22 54.037, -2.34 54.037))"
    }
*/

export const getPolygons = async (args: any) => {

    throw `Improve validation before exposing this function`

    console.log(`At ${(new Date()).toISOString()} - entering function`)

    let q = parseArgs(args)    
    let polygons = await getPolygonsImpl(q)
    
    console.log(`At ${(new Date()).toISOString()} - got query result`)

    return { polygons }
}

export let getPolygonsImpl = async (q: { framework: string, bbox: string }) => {

    let sql = `
        select
          polyid,
          partition,
          habitat,
          ST_AsGeoJSON(geometry_4326, 6) as geojson
        from framework_liveng0
        where ST_Intersects(ST_GeomFromText($1, 4326), geometry_4326)
        limit 2000
        `
    
    let polygonRows = await query(sql, [q.bbox]) // todo add framework

    return polygonRows.rows.map(r => ({
        ...r,
        geojson: JSON.parse(r.geojson),
    }))
}
