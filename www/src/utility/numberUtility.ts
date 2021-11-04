
/** Rounds the number to 3 decimal places. */
export const roundTo3Decimals = (n: number) => Math.round(1000 * n) / 1000

/** Rounds the number to 2 decimal places. */
export const roundTo2Decimals = (n: number) => Math.round(100 * n) / 100

/** Rounds the number to 1 decimal place. */
export const roundTo1Decimal = (n: number) => Math.round(10 * n) / 10
