
import { query } from '../db'
import { parseArgs } from './habitatsArgParser'

/*
    example: POST /habitats
    {
        "framework": "liveng0"
    }
*/

export const getHabitats = async (args: any) => {

    console.log(`At ${(new Date()).toISOString()} - entering habitats function`)

    let q = parseArgs(args)    

    let habitats = await getHabitatsImpl(q)
    
    console.log(`At ${(new Date()).toISOString()} - got habitats query result`)

    return { habitats }
}

export let getHabitatsImpl = async (q: { framework: string }) => {
    // All current frameworks have < 99 habitats but if we ever get a framework with a large number we may need to page or limit this query
    let sql = `
      select
         id,
         habitat
      from habitats
      where framework = $1
      order by habitat
      `

    let habitatRows = await query(sql, [q.framework])

    return habitatRows.rows
}
