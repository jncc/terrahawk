
import { ensureSomeArgs, parseFrameName, parseThumbType, parseBbox, parseFramework } from '../validation'

/**
 * Parses an args input map from Express or Lambda.
 */
 export const parseArgs = (maybeArgs?: { [key: string]: unknown }) =>  {

    let args = ensureSomeArgs(maybeArgs)
    let frameName = parseFrameName(args)
    let thumbType = parseThumbType(args)
    let bbox = parseBbox(args)
    let framework = parseFramework(args)

    return {
        frameName,
        thumbType,
        bbox,
        framework
    }
}
