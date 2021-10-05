
import { ensureSomeArgs, parseBbox, parseFramework, parseIndexname } from '../validation'

/**
 * Parses an args input map from Express or Lambda.
 */
 export const parseArgs = (maybeArgs?: { [key: string]: unknown }) =>  {

    let args = ensureSomeArgs(maybeArgs)

    let framework = parseFramework(args)
    let bbox = parseBbox(args)

    return {
        framework,
        bbox,
    }
}
