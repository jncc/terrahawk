
import { ensureSomeArgs, parseFrameName, parseIndexname, parseBbox } from '../validation'

/**
 * Parses an args input map from Express or Lambda.
 */
 export const parseArgs = (maybeArgs?: { [key: string]: unknown }) =>  {

    let args = ensureSomeArgs(maybeArgs)
    let frameName = parseFrameName(args)
    let indexname = parseIndexname(args)
    let bbox = parseBbox(args)

    return {
        frameName,
        indexname,
        bbox
    }
}
