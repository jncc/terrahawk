
import { ensureSomeArgs, parseBbox, parseFramework, parseHabitatids, parseLimit } from '../validation'

/**
 * Parses an args input map from Express or Lambda.
 */
 export const parseArgs = (maybeArgs?: { [key: string]: unknown }) =>  {

    let args = ensureSomeArgs(maybeArgs)

    let framework = parseFramework(args)
    let bbox = parseBbox(args)
    let habitatids = parseHabitatids(args)
    let limit = parseLimit(args)

    if (habitatids) {
      return {
            framework,
            bbox,
            habitatids,
            limit
       }
    } else {
        return {
            framework,
            bbox,
            limit
       } 
    }

}
