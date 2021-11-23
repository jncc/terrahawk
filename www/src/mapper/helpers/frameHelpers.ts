
import { trimAny } from '../../utility/stringUtility'
import { MonthStats, SimpleDate } from '../types'

/// Date field in the stats data is an aggregated string from Spark SQL's collect_list
/// e.g. `[20210414, 20210421, 20210428]`
let getDatesFromDateField = (value: string): SimpleDate[] => {
  let strings = trimAny(value, ['[', ']']).split(', ')
  return strings.map(s => {
    return ({
      year:  parseInt(s.substring(0, 4)),
      month: parseInt(s.substring(4, 6)),
      day:   parseInt(s.substring(6, 8)),
    })
  })
}

/// Frame field in the stats data is an aggregated string from Spark SQL's collect_list
/// e.g. `[value1, value2, value3]`
let getFramesFromFrameField = (value: string): string[] => {
  return trimAny(value, ['[', ']']).split(', ')
}

/// Get the pairs of {frame, date} in the stats
export let getFramesWithDate = (stats: MonthStats[]) => {
  let allFrames = stats.flatMap(d => getFramesFromFrameField(d.frame))
  let allDates = stats.flatMap(d => getDatesFromDateField(d.date))
  return allFrames.map((f, i) => ({frame: f, date: allDates[i]}))
}