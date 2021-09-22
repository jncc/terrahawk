
import * as format from 'pg-format'

// example: POST /stats
// {
//     "framework": "liveng0",
//     "indexname": "NDVI",
//     "polyPartitions": ["SD87", "SD88"],
//     "polyids": ["489639", "489640", "489647", "489658"]
// }

import { athenaExpress } from "../aws"
import { parseArgs } from "./statsArgParser"

export const getStats = async (input: any) => {

    console.log(`At ${(new Date()).toISOString()} - entering function`)

    let args = parseArgs(input)

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
        from stats_compared_monthly_nearest50_10km s
        where
            framework=%L
            and indexname=%L
            and poly_partition in (%L)
            and polyid in (%L)
        group by polyid
        `,
        args.framework,
        args.indexname,
        args.polyPartitions,
        args.polyids
        )

    // TODO: remove
    console.log(sql)

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
