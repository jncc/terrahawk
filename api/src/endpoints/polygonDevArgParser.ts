
import { ensureSomeArgs,
    parseFramework,
    parseIndexname,
    parseMonthFrom,
    parseMonthTo,
    parsePolyid,
    parsePolyPartition,
    parseYearFrom,
    parseYearTo,
} from '../validation'

/**
 * Parses an args input map from Express or Lambda.
 */
 export const parseArgs = (maybeArgs?: { [key: string]: unknown }) =>  {

    let args = ensureSomeArgs(maybeArgs)

    let framework = parseFramework(args)
    let indexname = parseIndexname(args)
    let polyPartition = parsePolyPartition(args)
    let polyid = parsePolyid(args)
    let yearFrom = parseYearFrom(args, 2010)
    let monthFrom = parseMonthFrom(args, 1)
    let yearTo = parseYearTo(args, new Date().getFullYear())
    let monthTo = parseMonthTo(args, new Date().getMonth() + 1)

    return {
        framework,
        indexname,
        polyPartition,
        polyid,
        yearFrom,
        monthFrom,
        yearTo,
        monthTo,
    }
}
