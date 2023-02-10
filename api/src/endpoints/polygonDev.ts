
import * as format from 'pg-format'

import { athenaExpress } from "../aws"
import { parseArgs } from "./polygonDevArgParser"
import { env } from '../env'

/*
    example: POST /polygon
    {
        "framework": "liveng0",
        "indexname": "NDVI",
        "polyid": "489639",
        "polyPartition": "SD87"
    }
*/

export const getPolygonDev = async (input: any) => {

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
            and poly_partition=%L
            and polyid=%L
        order by year, month
        `,
        env.MONTHLY_NEAREST_50_TEST_TABLE,
        args.framework,
        args.indexname,
        dateFrom,
        dateTo,
        args.polyPartition,
        args.polyid
    )

    console.log(sql)
    let result = await athenaExpress().query({ sql, db: 'statsdb' })

    console.log(`At ${(new Date()).toISOString()} - got query result`)
    return result.Items
}

let zeroPad = (n: number) => String(n).padStart(2, '0')
