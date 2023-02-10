
import { ensureSomeArgs,
    parseFramework,
    parseIndexname,
    parsePolyids,
    parsePolyPartitions,
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

    return {
        framework,
        indexname,
        polyPartitions,
        polyids,
    }
}
