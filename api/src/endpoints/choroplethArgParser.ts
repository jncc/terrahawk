
import { ensureSomeArgs,
    parseFramework,
    parseIndexname,
    parsePolyids,
    parsePolyPartitions,
    parseYearFrom,
    parseMonthFrom,
    parseYearTo,
    parseMonthTo,
} from '../validation'

/**
 * Parses an args input map from Express or Lambda.
 */
 export const parseArgs = (maybeArgs?: { [key: string]: unknown }) =>  {

    let args = ensureSomeArgs(maybeArgs)

    let framework = parseFramework(args)
    let indexname = parseIndexname(args)
    let yearFrom = parseYearFrom(args, 2010)
    let monthFrom = parseMonthFrom(args, 1)
    let yearTo = parseYearTo(args, new Date().getFullYear())
    let monthTo = parseMonthTo(args, new Date().getMonth() + 1)
    let polyPartitions = parsePolyPartitions(args)
    let polyids = parsePolyids(args)

    return {
        framework,
        indexname,
        polyPartitions,
        polyids,
        yearFrom,
        monthFrom,
        yearTo,
        monthTo,
    }
}
