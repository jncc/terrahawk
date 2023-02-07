
// example: POST /athena

import { athenaExpress } from "../aws"


export const getAthena = async (args: any) => {

    console.log(`At ${(new Date()).toISOString()} - entering function`)

    let sql = `
        select *
        from stats_compared_monthly_nearest50_10km
        limit 10
        `

    let query = { sql, db: "statsdb" }
    let result = await athenaExpress().query(query)

    console.log(`At ${(new Date()).toISOString()} - got query result`)
    
    return {
        data: result.Items
    }
}

