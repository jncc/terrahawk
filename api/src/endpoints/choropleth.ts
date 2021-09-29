
import * as format from 'pg-format'

import { athenaExpress } from "../aws"
import { parseArgs } from "./choroplethArgParser"
import { getPolygonsImpl } from './polygons'

/*
    example: POST /choropleth
    {
        "framework": "liveng0",
        "indexname": "NDVI",
        "bbox":      "POLYGON((-2.34 54.037, -2.34 54.097, -2.22 54.097, -2.22 54.037, -2.34 54.037))"
    }
*/

export const getChoropleth = async (input: any) => {

    console.log(`At ${(new Date()).toISOString()} - entering function`)

    let args = parseArgs(input)

    let polygons = await getPolygonsImpl(args)
    console.log(`At ${(new Date()).toISOString()} - got polygons result`)

    let maxZScoresForThesePolygons = await getMaxZScores({
        framework:      args.framework,
        indexname:      args.indexname,
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

type MaxZScoreQuery = {
    framework: string
    indexname: string
    polyPartitions: string[]
    polyids: string[]    
}

let getMaxZScores = async (q: MaxZScoreQuery) => {

    // https://github.com/datalanche/node-pg-format
    // %% outputs a literal % character.
    // %I outputs an escaped SQL identifier.
    // %L outputs an escaped SQL literal.
    // %s outputs a simple string.

    let sql = format(`
        select s.polyid,
            max(s.z_mean_abs)   as max_z_mean_abs,
            max(s.z_median_abs) as max_z_median_abs,
            max(s.z_min_abs)    as max_z_min_abs,
            max(s.z_max_abs)    as max_z_max_abs,
            max(s.z_q1_abs)     as max_z_q1_abs,
            max(s.z_q3_abs)     as max_z_q3_abs
        from monthly_nearest50 s
        where
            framework=%L
            and indexname=%L
            and poly_partition in (%L)
            and polyid in (%L)
        group by polyid
        `,
        q.framework,
        q.indexname,
        q.polyPartitions,
        q.polyids
    )

    console.log(sql)

    let result = await athenaExpress().query({ sql, db: 'statsdb' })
    if (!result.Items) throw 'No items returned from query'
    return result.Items
}

    // could join on server for perf improvement - something like:
    // let colourRows = await getColours({
    //     framework: 'liveng0',
    //     index: 'NDVI',
    //     polyids: polygons.map(r => r.polyid)
    // })

    // let joined = polygons.map(p => ({
    //     p,
    //     c: colourRows.polygons.filter(p2 => p2.polyid === p.polyid)
    // })).map(x => ({ ...x.p, ...x.c }))

    // return { joined }
    


// import * as format from 'pg-format'

// import { MonthlyQuery } from '../query'
// import { query } from '../db'

// export const getStats = async (q: MonthlyQuery) => {
//     console.log(q)

//     let sql = format(`
//         select *
//         from %I
//         where year=$1 and month=$2
//         limit 1000`,
//         'polygon_stats_by_month')

//     let result = await query(
//         sql,
//         [q.year, q.month])
        
//     return result.rows
// }
