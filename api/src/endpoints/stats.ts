
import * as format from 'pg-format'

import { MonthlyQuery } from '../query'
import { query } from '../db'

export const getStats = async (q: MonthlyQuery) => {
    console.log(q)

    let sql = format(`
        select *
        from %I
        where year=$1 and month=$2
        limit 1000`,
        'polygon_stats_by_month')

    let result = await query(
        sql,
        [q.year, q.month])
        
    return result.rows
}
