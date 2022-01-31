
import { ensureSomeArgs, parseBbox } from '../validation'

/**
 * Parses an args input map from Express or Lambda.
 */
 export const parseArgs = (maybeArgs?: { [key: string]: unknown }) =>  {

    let args = ensureSomeArgs(maybeArgs)

    let bbox = parseBbox(args)

    return {
        bbox,
    }
}
