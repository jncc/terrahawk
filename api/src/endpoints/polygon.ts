
import * as format from 'pg-format'

import { athenaExpress } from "../aws"
import { parseArgs } from "./polygonArgParser"
import { env } from '../env'

/*
    example: POST /polygon
    {
        "framework": "liveng0",
        "indexname": "NDVI",
        "polyid": ["489639"],
        "polyPartition": ["SD87"],
        "yearFrom":2020,"monthFrom":12,"yearTo":2021,"monthTo":3    - Date range optional - if not passed all contents will be returned
    }

    The normal use case is to query for a single polygon / partition, 
    but specifying the query parameters as arrays allows API users to include multiple if required
*/

export const getPolygon = async (input: any) => {

    console.log(`At ${(new Date()).toISOString()} - entering function`)

    let args = parseArgs(input)

    // get date strings like '202004' (for April 2020)
    let dateFrom = `${args.yearFrom}${zeroPad(args.monthFrom)}`
    let dateTo = `${args.yearTo}${zeroPad(args.monthTo)}`

    // https://github.com/datalanche/node-pg-format
    // %% outputs a literal % character.
    // %I outputs an escaped SQL identifier.
    // %L outputs an escaped SQL literal.
    // %s outputs a simple string.

    let sql = format(`
        select *
        from %I s
        where
            framework=%L
            and indexname=%L
            and year || month >= %L
            and year || month <= %L
            and poly_partition in (%L)
            and polyid in (%L)
        order by year, month
        `,
        env.MONTHLY_NEAREST_50_TABLE,
        args.framework,
        args.indexname,
        dateFrom,
        dateTo,
        args.polyPartitions,
        args.polyids
    )

    console.log(sql)
    let result = await athenaExpress().query({ sql, db: 'statsdb' })

    console.log(`At ${(new Date()).toISOString()} - got query result`)
    return result.Items
}

let zeroPad = (n: number) => String(n).padStart(2, '0')
