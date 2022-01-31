

import { query } from '../db'
import { parseArgs } from './npmsArgParser'

// example: POST /npms

export const getNpms = async (input: any) => {

    console.log(`At ${(new Date()).toISOString()} - entering function`)

    let args = parseArgs(input)

    let sql = `
        select
            sample_id as sampleid,
            latitude,
            longitude,
            survey_nam as surveyname,
            date,
            broad_habi as broadhabitat,
            fine_habit as finehabitat,
            habitat_co as habitatcondition,
            management,
            species,
            class_syst as classsystem,
            structure,
            other,
            match_habm as match
        from npms_example
        where ST_Intersects(ST_GeomFromText($1, 4326), wkb_geometry)
        `
    
    let result = await query(sql, [args.bbox])

    console.log(`At ${(new Date()).toISOString()} - got query result`)
    
    return {
        data: result.rows
    }
}

