

// example: POST /stats
// {
//     "framework": "liveng0",
//     "indexname": "NDVI",
//     "poly_parition": ["SD87", "SD88"],
//     "polyid": ["489639", "489640", "489647", "489658"]
// }

import { athenaExpress } from "../aws"
import { parseArgs } from "./statsArgParser"

export const getStats = async (input: any) => {

    console.log(`At ${(new Date()).toISOString()} - entering function`)

    let args = parseArgs(input)

    let sql = `
        select s.polyid,
            max(s.z_mean_abs)   as z_mean_abs,
            max(s.z_median_abs) as z_median_abs,
            max(s.z_min_abs)    as z_min_abs,
            max(s.z_max_abs)    as z_max_abs,
            max(s.z_q1_abs)     as z_q1_abs,
            max(s.z_q3_abs)     as z_q3_abs
        from stats_compared_monthly_nearest50_10km s
        where
            framework='liveng0'
            and indexname='NDVI'
            and poly_partition in ('SD87', 'SD88')
            and polyid in ('489639', '489640', '489647', '489658')
        group by polyid
        limit 10
        `

    let query = { sql, db: "statsdb" }
    let result = await athenaExpress().query(query)

    console.log(`At ${(new Date()).toISOString()} - got query result`)
    
    return {
        data: result.Items
    }
}





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
