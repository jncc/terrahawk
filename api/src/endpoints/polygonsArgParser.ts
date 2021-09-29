
/**
 * Parses an args input map from Express or Lambda.
 */
 export const parseArgs = (args?: { [key: string]: string }) => {

    if (!args) {
        throw 'Expected arguments, got none.'
    }

    let framework = args.framework
    if (!framework) {
        throw `Expected 'framework'.`
    }
    if (framework.length < 3) {
        throw `Invalid framework.`
    }

    let bbox = args.bbox
    if (!bbox) {
        throw `Expected 'bbox'.`
    }

    return {
        framework,
        bbox,
    }
}
