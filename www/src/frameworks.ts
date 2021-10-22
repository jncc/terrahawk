import { Indexname, Statistic } from "./mapper/types"

export const frameworks: { [index: string]: Framework } = {
  liveng0: {
    name: `Living England: Yorkshire subset`,
    defaultCenter: { lat: 54.067, lng: -2.280 },
    defaultZoom: 13,
    defaultIndexname: 'NDVI',
    defaultStatistic: 'mean',
  }
}

export type Framework = {
  name: string
  defaultCenter: { lat: number, lng: number }
  defaultZoom: number
  defaultIndexname: Indexname
  defaultStatistic: Statistic
}
