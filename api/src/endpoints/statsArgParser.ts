
import { ensureSomeArgs, parseFramework, parseIndexname, parsePolyids, parsePolyPartitions } from '../validation'

/**
 * Parses an args input map from Express or Lambda.
 */
 export const parseArgs = (maybeArgs?: { [key: string]: unknown }) =>  {

    let args = ensureSomeArgs(maybeArgs)
    let framework = parseFramework(args)
    let indexname = parseIndexname(args)
    let polyids = parsePolyids(args)
    let polyPartitions = parsePolyPartitions(args)

    return {
        framework,
        indexname,
        polyids,
        polyPartitions,
        // habitat,
        // year,
        // season,
    }
}
