

/** Config for the map */

export const config = {
  defaultZoom: 8,
  maximumZoom: 13,
  defaultCenter: [56.4, -4] as [number, number],
  baseLayerUrlTemplate: `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam5jYy13ZWJtYXN0ZXIiLCJhIjoiY2s5c2wyeXdxMG8weTNlcWt6dmw3Nno4cCJ9.zSDqXxiNyofO3Ilq-hyfqg`,
  attribution: `Backdrop &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>`,
  defaultQuery: {
    collections: [`scotland-gov/lidar/phase-1/dsm`],
    bbox:        [-4.5, 56.1, -3.5, 56.7] as [number, number, number, number],
  }
}
