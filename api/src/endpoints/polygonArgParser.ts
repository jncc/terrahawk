
import { ensureSomeArgs,
    parseFramework,
    parseIndexname,
    parseMonthFrom,
    parseMonthTo,
    parsePolyids,
    parsePolyPartitions,
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
    let polyPartitions = parsePolyPartitions(args)
    let polyids = parsePolyids(args)
    let yearFrom = parseYearFrom(args, 2010)
    let monthFrom = parseMonthFrom(args, 1)
    let yearTo = parseYearTo(args, new Date().getFullYear())
    let monthTo = parseMonthTo(args, args.yearTo ? 12 : new Date().getMonth() + 1)

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
