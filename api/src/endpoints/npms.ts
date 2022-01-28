

import { query } from '../db'

// example: POST /npms

export const getNpms = async (args: any) => {

    console.log(`At ${(new Date()).toISOString()} - entering function`)

    let sql = `
        select
            sample_id,
            latitude,
            longitude,
            survey_nam,
            date,
            broad_habi,
            fine_habit,
            habitat_co,
            management,
            species,
            structure,
            other,
            match_habm
        from npms_example
        `
    
    let result = await query(sql, [])

    console.log(`At ${(new Date()).toISOString()} - got query result`)
    
    return {
        data: result.rows
    }
}

