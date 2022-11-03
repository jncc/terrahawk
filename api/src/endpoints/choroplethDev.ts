
import * as format from 'pg-format'

import { athenaExpress } from "../aws"
import { parseArgs } from "./choroplethArgParser"

/*
    example: POST /choropleth
    {
        "framework": "liveng0",
        "indexname": "NDVI",
        "polyPartitions": ["SD87", "SD88"],
        "polyids": ["489639", "489640", "489647", "489658"]
    }
*/

export const getChoroplethDev = async (input: any) => {

    console.log(`At ${(new Date()).toISOString()} - entering function`)

    let args = parseArgs(input)

    let maxZScores = await getMaxZScores({
        framework:      args.framework,
        indexname:      args.indexname,
        yearFrom:       args.yearFrom,
        monthFrom:      args.monthFrom,
        yearTo:         args.yearTo,
        monthTo:        args.monthTo,
        polyPartitions: args.polyPartitions,
        polyids:        args.polyids,
    })

    console.log(`At ${(new Date()).toISOString()} - got maxZScores result`)
    
    return maxZScores
}

type MaxZScoreQuery = {
    framework: string
    indexname: string
    yearFrom: number
    monthFrom: number
    yearTo: number
    monthTo: number
    polyPartitions: string[]
    polyids: string[]    
}

export let getMaxZScores = async (q: MaxZScoreQuery) => {

    // https://github.com/datalanche/node-pg-format
    // %% outputs a literal % character.
    // %I outputs an escaped SQL identifier.
    // %L outputs an escaped SQL literal.
    // %s outputs a simple string.

    // get date strings like '202004' (for April 2020)
    let dateFrom = `${q.yearFrom}${zeroPad(q.monthFrom)}`
    let dateTo = `${q.yearTo}${zeroPad(q.monthTo)}`

    let sql = format(`
        select s.polyid,
            max(abs(s.z_mean)  ) as max_z_mean,
            max(abs(s.z_median)) as max_z_median,
            max(abs(s.z_min)   ) as max_z_min,
            max(abs(s.z_max)   ) as max_z_max,
            max(abs(s.z_q1)    ) as max_z_q1,
            max(abs(s.z_q3)    ) as max_z_q3
        from monthly_nearest50_test s
        where
            framework=%L
            and indexname=%L
            and year || month >= %L
            and year || month <= %L
            and poly_partition in (%L)
            and polyid in (%L)
        group by polyid
        `,
        q.framework,
        q.indexname,
        dateFrom,
        dateTo,
        q.polyPartitions,
        q.polyids
    )

    console.log(sql)

    let result = await athenaExpress().query({ sql, db: 'statsdb' })
    // if (!result.Items) throw 'No items returned from query'
    return result.Items
}

let zeroPad = (n: number) => String(n).padStart(2, '0')
