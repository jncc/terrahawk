
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

    // let polyids = args.polyids
    // if (!polyids) {
    //     throw `Expected 'polyids'.`
    // }
    // let polyidsArray = polyids.split(',')
    // if (polyidsArray.length === 0) {
    //     throw `Expected at least one polyid.`
    // }
    // if (!polyidsArray.every(id => id.match(/^\d+$/))) {
    //     throw `Polyids must be integers.`
    // }

    // let statistic = args.statistic
    // if (!statistic) {
    //     throw `Expected 'statistic'.`
    // }
    // let validStatistic = parseStatistic(statistic)
    
    return {
        framework,
        bbox,
    }
}
