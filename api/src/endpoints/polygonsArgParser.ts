
import { ensureSomeArgs, parseBbox, parseFramework, parseHabitatids, parseIndexname } from '../validation'

/**
 * Parses an args input map from Express or Lambda.
 */
 export const parseArgs = (maybeArgs?: { [key: string]: unknown }) =>  {

    let args = ensureSomeArgs(maybeArgs)

    let framework = parseFramework(args)
    let bbox = parseBbox(args)
    let habitatids = parseHabitatids(args)

    if (habitatids) {
      return {
            framework,
            bbox,
            habitatids
       }
    } else {
        return {
            framework,
            bbox
       } 
    }

}
