
export function getDayOfYear(year: number, month: number, day: number) {

  let date = new Date(year, month - 1, day) // correct month index for 0-based JS date constructor

  // https://awesomeopensource.com/project/you-dont-need/You-Dont-Need-Momentjs#user-content-day-of-year
  return Math.floor(
    (date.valueOf() - new Date(date.getFullYear(), 0, 0).valueOf()) / 1000 / 60 / 60 / 24
  )
}
