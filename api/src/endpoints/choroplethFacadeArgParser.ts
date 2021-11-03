
import { ensureSomeArgs, parseBbox, parseFramework, parseIndexname,
     parseMonthFrom, parseMonthTo, parseYearFrom, parseYearTo } from '../validation'

/**
 * Parses an args input map from Express or Lambda.
 */
 export const parseArgs = (maybeArgs?: { [key: string]: unknown }) =>  {

    let args = ensureSomeArgs(maybeArgs)
    let framework = parseFramework(args)
    let yearFrom = parseYearFrom(args, 2010)
    let monthFrom = parseMonthFrom(args, 1)
    let yearTo = parseYearTo(args, new Date().getFullYear())
    let monthTo = parseMonthTo(args, new Date().getMonth() + 1)
    let indexname = parseIndexname(args)
    let bbox = parseBbox(args)

    return {
        framework,
        indexname,
        yearFrom,
        monthFrom,
        yearTo,
        monthTo,
        bbox,
    }
}
