
import { ensureSomeArgs, parseBbox, parseFramework, parseHabitatid, parseIndexname } from '../validation'

/**
 * Parses an args input map from Express or Lambda.
 */
 export const parseArgs = (maybeArgs?: { [key: string]: unknown }) =>  {

    let args = ensureSomeArgs(maybeArgs)

    let framework = parseFramework(args)
    let bbox = parseBbox(args)
    let habitatid = parseHabitatid(args)

    if (habitatid) {
      return {
            framework,
            bbox,
            habitatid
       }
    } else {
        return {
            framework,
            bbox
       } 
    }

}
