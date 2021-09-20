
type CommonParams = {
    framework: string,
    polyid   : number,
    index    : string,
    year     : number,
}

export type MonthlyQuery = CommonParams & {
    month    : number,
    period   : 'month',
}

export type SeasonalQuery = CommonParams & {
    season   : string, // how to best encode season? - number enum slightly more efficient
    period   : 'season',
}
