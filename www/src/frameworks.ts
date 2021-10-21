
export const frameworks: { [index: string]: Framework } = {
  liveng0: {
    name: `Living England: Yorkshire subset`,
    year: `2021`, // ?
    defaultCenter: { lat: 54.067, lng: -2.280 },
    defaultZoom: 13,
    defaultIndexname: 'NDVI',
  }
}

export type Framework = {
  name: string
  year: string
  defaultCenter: { lat: number, lng: number }
  defaultZoom: number
  defaultIndexname: string
}
