
import { query } from '../db'
import { getColours } from './colours'
import { parseArgs } from './polygonsArgParser'

// example: POST /polygons
// {
//    framework: "liveng-0"
//    bbox: "POLYGON((-2.34 54.037, -2.34 54.097, -2.22 54.097, -2.22 54.037, -2.34 54.037))"
// }

export const getPolygons = async (args: any) => {

    console.log(`At ${(new Date()).toISOString()} - entering function`)

    let q = parseArgs(args)
    
    let sql = `
        select polyid, habitat, ST_AsGeoJSON(geometry_4326, 6) as geojson
        from framework_liveng0
        where ST_Intersects(ST_GeomFromText($1, 4326), geometry_4326)
        limit 2000
        `
    
    let polygonRows = await query(sql, [q.bbox])
    
    console.log(`At ${(new Date()).toISOString()} - got query result`)

    let polygons = polygonRows.rows.map(r => ({
        ...r,
        geojson: JSON.parse(r.geojson),
    }))

    // let colourRows = await getColours({
    //     framework: 'liveng-0',
    //     method: 'sametype',
    //     index: 'NDVI',
    //     polyids: polygons.map(r => r.polyid)
    // })

    // let joined = polygons.map(p => ({
    //     p,
    //     c: colourRows.polygons.filter(p2 => p2.polyid === p.polyid)
    // })).map(x => ({ ...x.p, ...x.c }))

    // return { joined }
    
    return { polygons }
}
