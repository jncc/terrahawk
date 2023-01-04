
import { ensureSomeArgs,
    parseFramework,
    parseIndexname,
    parsePolyid,
    parsePolyPartition,
} from '../validation'

 export const parseArgs = (maybeArgs?: { [key: string]: unknown }) =>  {

    let args = ensureSomeArgs(maybeArgs)

    let framework = parseFramework(args)

    return {
        framework,
    }
}
