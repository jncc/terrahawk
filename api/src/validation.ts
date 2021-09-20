
type Args = { [key: string]: unknown }

export function ensureSomeArgs(args?: { [key: string]: unknown }) {
    if (!args || Object.keys(args).length === 0) {
        throw 'Expected arguments, got none.'
    }
    return args
}

export function parseFramework(args: Args) {
    if (!args.framework) {
        throw `Expected 'framework'.`
    }
    if (typeof args.framework !== 'string') {
        throw `Expected 'framework' to be a string.`
    }
    if (args.framework.length < 3) {
        throw `Invalid framework.`
    }
    return args.framework
}

export function parseIndexname(args: Args) {
    if (!args.indexname) {
        throw `Expected 'indexname'.`
    }
    if (typeof args.indexname !== 'string') {
        throw `Expected 'indexname' to be a string.`
    }
    if (args.indexname.length < 3) {
        throw `Invalid indexname.`
    }
    return args.indexname
}

export function parsePolyids(args: Args) {

    if (!args.polyids) {
        throw `Expected 'polyids'.`
    }
    if (typeof args.polyids !== 'object' || !Array.isArray(args.polyids)) {
        throw `Expected 'polyids' to be an array.`
    }
    return args.polyids.map(s => {
        if (typeof s !== 'string') {
            throw `All 'polyids' must be a string.`
        }
        if (s.length < 3) {
            throw `Value '${s}' is surely too short for a polyid.`
        }
        if (s.length > 10) {
            throw `Value '${s}' is surely too long for a polyid.`
        }
        if (!/[0-9]+/.test(s)) {
            throw `Value '${s}' isn't an acceptable polyid.`
        }
        return s
    })
}

export function parsePolyPartitions(args: Args) {

    if (!args.polyPartitions) {
        throw `Expected 'polyPartitions'.`
    }
    if (typeof args.polyPartitions !== 'object' || !Array.isArray(args.polyPartitions)) {
        throw `Expected 'polyPartitions' to be an array.`
    }
    return args.polyPartitions.map(s => {
        if (typeof s !== 'string') {
            throw `All 'polyPartitions' must be a string.`
        }
        if (s.length < 3) {
            throw `Value '${s}' is surely too short for a polyPartition.`
        }
        if (s.length > 10) {
            throw `Value '${s}' is surely too long for a polyPartitions.`
        }
        if (!/[0-9]+/.test(s)) {
            throw `Value '${s}' isn't an acceptable polyPartitions.`
        }
        return s
    })
}

const statistics = [
    'mean',
    'sd',
    'median',
    'min',
    'max',
    'q1',
    'q3',
] as const

export type Statistic = typeof statistics[number]

/**
 * Returns the valid statistic name from a string, or throws.
 */
export function parseStatistic(s: string): Statistic {
    
    let maybe: unknown = s
    let statistic = statistics.find((s) => s === maybe)

    if (statistic) {
        return statistic
    }
    throw `'${maybe}' is not a valid statistic.`
}
