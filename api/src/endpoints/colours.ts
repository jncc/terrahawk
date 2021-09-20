
import { query } from '../db'
import { parseArgs } from './coloursArgParser'

// eg POST /colours
// {
//    framework: "liveng-0",
//    method: "sametype",
//    indexname: "NDVI",
//    polyids: [368442,368484,368487]
// }

export const getColours = async (args: any) => {

    let q = parseArgs(args)
    
    let sql = `
        select p.polyid,
            max(p.mean_diff) as max_mean_diff,
            max(p.median_diff) as max_median_diff,
            max(p.min_diff) as max_min_diff,
            max(p.max_diff) as max_max_diff,
            max(p.q1_diff) as max_q1_diff,
            max(p.q3_diff) as max_q3_diff
        from polygon_info_by_month p
        where framework=$1 and polyid=any($2)
            and method=$3
            and indexname=$4
            and year=2020 and month=4 -- todo: parameterise
        group by p.polyid
        `
    
    let polygons = await query(sql, [q.framework, q.polyids, q.method, q.indexname])
        
    return {
        polygons: polygons.rows
    }
}
