
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

export function parseHabitatids(args: Args) {
    if (!args.habitatids || Array.isArray(args.habitatids) && args.habitatids.length < 1) {
        return null
    }
    if (Array.isArray(args.habitatids)) {
        args.habitatids.forEach(function(id){
           if(id !== parseInt(id, 10)){
            throw `Expected habitatids array to only contain integers`
           }
        })
    } else {
        throw `Expected habitatids to be an array`
    }
    return args.habitatids
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

export function parseFrameName(args: Args) {
    if (!args.framename) {
        throw `Expected 'framename'.`
    }
    if (typeof args.framename !== 'string') {
        throw `Expected 'framename' to be a string.`
    }
    if (args.framename.length < 40) {
        throw `Invalid framename.`
    }
    return args.framename
}

export function parseThumbType(args: Args) {
    if (!args.thumbType) {
        throw `Expected 'thumbType'.`
    }
    if (typeof args.thumbType !== 'string') {
        throw `Expected 'thumbType' to be a string.`
    }
    if (args.thumbType.length < 3) {
        throw `Invalid thumbType.`
    }
    return args.thumbType
}

export function parseBbox(args: Args) {
    if (!args.bbox) {
        throw `Expected 'bbox'.`
    }
    if (typeof args.bbox !== 'string') {
        throw `Expected 'bbox' to be a string.`
    }
    if (args.bbox.length < 10) {
        throw `Invalid bbox.`
    }
    return args.bbox
}

export function parseYearFrom(args: Args, defaultYear: number) {
    if (!args.yearFrom) {
        return defaultYear
    }
    if (!Number.isInteger(args.yearFrom)) {
        throw `Expected 'yearFrom' to be an integer.`
    }
    return args.yearFrom as number
}

export function parseMonthFrom(args: Args, defaultMonth: number) {
    if (!args.monthFrom) {
        return defaultMonth
    }
    if (!Number.isInteger(args.monthFrom)) {
        throw `Expected 'monthFrom' to be an integer.`
    }
    return args.monthFrom as number
}

export function parseYearTo(args: Args, defaultYear: number) {
    if (!args.yearTo) {
        return defaultYear
    }
    if (!Number.isInteger(args.yearTo)) {
        throw `Expected 'yearTo' to be an integer.`
    }
    return args.yearTo as number
}

export function parseMonthTo(args: Args, defaultMonth: number) {
    if (!args.monthTo) {
        return defaultMonth
    }
    if (!Number.isInteger(args.monthTo)) {
        throw `Expected 'monthTo' to be an integer.`
    }
    return args.monthTo as number
}

export function parsePolyid(args: Args) {

    if (!args.polyid) {
        throw `Expected 'polyid'.`
    }
    if (typeof args.polyid !== 'string') {
        throw `Expected 'polyid' to be a string.`
    }
    // todo use validations in parsePolyids
    return args.polyid
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

export function parsePolyPartition(args: Args) {

    if (!args.polyPartition) {
        throw `Expected 'polyPartition'.`
    }
    if (typeof args.polyPartition !== 'string') {
        throw `Expected 'polyPartition' to be a string.`
    }
    // todo use validations in parsePolyPartitions
    return args.polyPartition
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
