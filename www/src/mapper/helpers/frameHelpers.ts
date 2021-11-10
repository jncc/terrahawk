
import { trimAny } from '../../utility/stringUtility'
import { SimpleDate } from '../types'

/// Date field in the stats data is an aggregated string from Spark SQL's collect_list
/// e.g. `[20210414, 20210421, 20210428]`
export let getDatesFromDateField = (value: string): SimpleDate[] => {
  let strings = trimAny(value, ['[', ']']).split(', ')
  return strings.map(s => {
    return ({
      year:  parseInt(s.substring(0, 4)),
      month: parseInt(s.substring(4, 6)),
      day:   parseInt(s.substring(6, 8)),
    })
  })
}
