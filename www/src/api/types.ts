
export type Choropoly = {
  polyid: string
  habitat: string
  geojson: any
  max_z_mean_abs: number
  max_z_median_abs: number
  max_z_min_abs: number
  max_z_max_abs: number
  max_z_q1_abs: number
  max_z_q3_abs: number
}

// export type MaxZScores = {
//   polyid: string
// }

// export type MaxZScoresQuery = {
//   framework: string,
//   indexname: string,
//   polyPartitions: string[]
//   polyids: string[]
// }