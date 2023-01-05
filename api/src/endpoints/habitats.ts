
import { query } from '../db'
import { parseArgs } from './habitatsArgParser'

/*
    example: POST /habitats
    {
        "framework": "liveng0"
    }
*/

export const getHabitats = async (args: any) => {

    console.log(`At ${(new Date()).toISOString()} - entering function`)

    let q = parseArgs(args)    

    let habitats = await getHabitatsImpl(q)
    
    console.log(`At ${(new Date()).toISOString()} - got query result`)

    return { habitats }
}

export let getHabitatsImpl = async (q: { framework: string }) => {
    
    let sql = `
      select
         id,
         habitat
      from habitats
      where framework = $1
      order by habitat
      limit 999
      `

    let habitatRows = await query(sql, [q.framework])

    return habitatRows.rows
}