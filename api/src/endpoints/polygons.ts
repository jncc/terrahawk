
import { QueryResult } from 'pg'
import { query } from '../db'
import { parseArgs } from './polygonsArgParser'

/*
    example: POST /polygons
    {
        "framework": "liveng0",
        "bbox":      "POLYGON((-2.34 54.037, -2.34 54.097, -2.22 54.097, -2.22 54.037, -2.34 54.037))",
        "habitatids":  [23790, 23791] 
    }
*/

export const getPolygons = async (args: any) => {

    console.log(`At ${(new Date()).toISOString()} - entering function`)

    let q = parseArgs(args)    

    let polygons = q.habitatids ? await getPolygonsImplHabitatSubset(q) : await getPolygonsImpl(q)
    
    console.log(`At ${(new Date()).toISOString()} - got query result`)

    return { polygons }
}

export let getPolygonsImplHabitatSubset = async (q: { framework: string, bbox: string, habitatids: Array<number> }) => {
    
    let sql = getPolygonsQuery(q.framework, `and f.habitat_id = ANY($2::int[])`)
    
    let polygonRows = await query(sql, [q.bbox, q.habitatids])

    return returnPolygonRows(polygonRows)
}

export let getPolygonsImpl = async (q: { framework: string, bbox: string }) => {
    
    let sql = getPolygonsQuery(q.framework, ``)

    let polygonRows = await query(sql, [q.bbox])

    return returnPolygonRows(polygonRows)
}

function getPolygonsQuery(framework: string, filterClause: string) {
   return `
     select
        f.polyid,
        f.partition,
        h.id as habitatid,
        h.habitat,
        ST_AsGeoJSON(f.geometry_4326, 6) as geojson
     from framework_${framework} f
     inner join habitats h on h.id = f.habitat_id
     where ST_Intersects(ST_GeomFromText($1, 4326), f.geometry_4326)
     ${filterClause}
     limit 3001
     `
}

function returnPolygonRows(polygonRows: QueryResult<any>) {
    if (polygonRows.rows.length === 3001)
      throw 'Too many polygons. Was the bounding box too big?'

    return polygonRows.rows.map(r => ({
        ...r,
        geojson: JSON.parse(r.geojson),
    }))
}
