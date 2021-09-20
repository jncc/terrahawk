

import { query } from '../db'

// example: GET /alive

export const getAlive = async (args: any) => {

    console.log(`At ${(new Date()).toISOString()} - entering function`)

    let sql = `
        select *
        from framework_liveng0
        limit 1
        `
    
    let result = await query(sql, [])

    console.log(`At ${(new Date()).toISOString()} - got query result`)
    
    return {
        data: result.rows
    }
}

