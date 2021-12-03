
import * as dayjs from 'dayjs'
import * as dayOfYear from 'dayjs/plugin/dayOfYear'

// this is how dayjs "plugins" work...
dayjs.extend(dayOfYear)

export function getDayOfYear(year: number, month: number, day: number) {
    let date = new Date(year, month - 1, day) // correct month index for 0-based JS date constructor
    return dayjs(date).dayOfYear()
}
