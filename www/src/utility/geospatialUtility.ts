
export type Bbox = {
    west:  number,
    south: number,
    east:  number,
    north: number,
  }
  
  export const bboxToWkt = (bbox: Bbox) => {
    return `POLYGON((${bbox.west} ${bbox.south}, ${bbox.west} ${bbox.north}, ${bbox.east} ${bbox.north}, ${bbox.east} ${bbox.south}, ${bbox.west} ${bbox.south}))`
  }
