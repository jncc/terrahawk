import { ChoroplethItem, Statistic } from '../types'

// export function getCssClassForZScore(z: number) {
//   // return z > 3.0 ? 'choropleth-6' :
//       //    z > 2.5 ? 'choropleth-5' :
//   return       z > 2.0 ? 'choropleth-4' :
//       //    z > 1.7 ? 'choropleth-3' :
//       //    z > 1.4 ? 'choropleth-2' :
//           z > 1.0 ? 'choropleth-1' :
//                     'choropleth-0';
// }

export function getColour(z: number) {
  return z > 2.0 ? '#D53F8C' :
         z > 1.0 ? '#D69E2E' :
                    'white';
}

export let getChoroplethMaxZValue = (s: Statistic, c: ChoroplethItem) => {
  switch (s) {
    case 'mean': return c.max_z_mean
    case 'median': return c.max_z_median
    case 'min': return c.max_z_min
    case 'max': return c.max_z_max
    case 'Q1': return c.max_z_q1
    case 'Q3': return c.max_z_q3
  }
}