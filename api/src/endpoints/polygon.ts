
import * as format from 'pg-format'

import { athenaExpress } from "../aws"
import { parseArgs } from "./polygonArgParser"

/*
    example: POST /polygon
    {
        "framework": "liveng0",
        "indexname": "NDVI",
        "polyid": "489639",
        "polyPartition": "SD87"
    }
*/

export const getPolygon = async (input: any) => {

    console.log(`At ${(new Date()).toISOString()} - entering function`)

    let args = parseArgs(input)

    // https://github.com/datalanche/node-pg-format
    // %% outputs a literal % character.
    // %I outputs an escaped SQL identifier.
    // %L outputs an escaped SQL literal.
    // %s outputs a simple string.

    let sql = format(`
        select *
        from monthly_nearest50_6 s
        where
            framework=%L
            and indexname=%L
            and poly_partition=%L
            and polyid=%L
        order by year, month
        `,
        args.framework,
        args.indexname,
        args.polyPartition,
        args.polyid
    )

    console.log(sql)
    let result = await athenaExpress().query({ sql, db: 'statsdb' })

    console.log(`At ${(new Date()).toISOString()} - got query result`)
    return result.Items
}
