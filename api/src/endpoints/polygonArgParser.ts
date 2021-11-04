
import { ensureSomeArgs,
    parseFramework,
    parseIndexname,
    parsePolyid,
    parsePolyPartition,
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

    return {
        framework,
        indexname,
        polyPartition,
        polyid,
    }
}
