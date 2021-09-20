
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
