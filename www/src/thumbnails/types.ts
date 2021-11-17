export type Polygon = {
  polygonId: string,
  coordinates: number[][][][]
}

export type Scale = {
  xMax: number,
  xMin: number,
  yMin: number,
  yMax: number
}

export type ThumbnailType = {
  text: string,
  domain?: number[],
  rgbDomains?: {
    red: number[],
    green: number[],
    blue: number[]
  },
  colourScale: string
}

export type ColourScale = {
  name: string,
  colours: string[],
  positions: number[]
} 