
import { parseStatistic } from '../validation'

/**
 * Parses an args input map from Express or Lambda.
 */
 export const parseArgs = (args?: { [key: string]: unknown }) =>  {

    if (!args) {
        throw 'Expected arguments, got none.'
    }

    let framework = args.framework
    if (!framework) {
        throw `Expected 'framework'.`
    }
    if (typeof framework !== 'string') {
        throw `Expected 'framework' to be a string.`
    }
    if (framework.length < 3) {
        throw `Invalid framework.`
    }

    let polyids = args.polyids
    if (!polyids) {
        throw `Expected 'polyids'.`
    }
    if (typeof polyids !== 'object') {
        throw `Expected 'polyids' to be an array.`
    }
    
    // TODO: validate integer array
    // let polyidsArray = polyids.split(',')
    // if (polyids.length === 0) {
    //     throw `Expected at least one polyid.`
    // }
    // if (!polyid.every(id => id.match(/^\d+$/))) {
    //     throw `Polyids must be integers.`
    // }

    let method = args.method
    if (!method) {
        throw `Expected 'method'.`
    }
    if (typeof method !== 'string') {
        throw `Expected 'method' to be a string.`
    }

    let indexname = args.indexname
    if (!indexname) {
        throw `Expected 'indexname'.`
    }
    if (typeof indexname !== 'string') {
        throw `Expected 'indexname' to be a string.`
    }

    // let statistic = args.statistic
    // if (!statistic) {
    //     throw `Expected 'statistic'.`
    // }
    // let validStatistic = parseStatistic(statistic)

    // let habitat = args.habitat
    // let year = args.year
    // let month = args.month
    // let season = args.season
    
    return {
        framework,
        method,
        indexname,
        // habitat,
        // year,
        // season,
        polyids,
    }
}
