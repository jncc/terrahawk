
import { Indexname, MonthStats, Statistic, StatValues } from '../types'

export let getStatValues = (statistic: Statistic, s: MonthStats): StatValues => {
  switch (statistic) {
    case 'mean':   return {value: s.mean,   cf_value: s.cf_mean,   cf_value_sd: s.cf_mean_sd,   z_score: s.z_mean}
    case 'median': return {value: s.median, cf_value: s.cf_median, cf_value_sd: s.cf_median_sd, z_score: s.z_median}
    case 'min':    return {value: s.min,    cf_value: s.cf_min,    cf_value_sd: s.cf_min_sd,    z_score: s.z_min}
    case 'max':    return {value: s.max,    cf_value: s.cf_max,    cf_value_sd: s.cf_max_sd,    z_score: s.z_max}
    case 'Q1':     return {value: s.q1,     cf_value: s.cf_q1,     cf_value_sd: s.cf_q1_sd,     z_score: s.z_q1}
    case 'Q3':     return {value: s.q3,     cf_value: s.cf_q3,     cf_value_sd: s.cf_q3_sd,     z_score: s.z_q3}
  }
}

// todo: make this the source of truth in `types`, then define the union from it
export const indexnames: {[name in Indexname]: { description: string}} = {
  'NBR':  {description: 'burn',       },
  'NDMI': {description: 'moisture',   },
  'NDVI': {description: 'vegetation', },
  'NDWI': {description: 'water',      },
  'RVI':  {description: 'SAR vegetation', },
  'VVVH':  {description: 'SAR cross-ratio', },
  'VHVV':  {description: 'SAR cross-ratio', },
  'RFDI':  {description: 'SAR forest degredation', }
}

// todo: make this the source of truth in `types`, then define the union from it
export const statistics: Statistic[] = ['mean' , 'median' , 'min' , 'max' , 'Q1' , 'Q3']
  