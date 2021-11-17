
export function getArdUrl(frameId : string, baseUrl : string) {
  let satellite = getSatellite(frameId)
  let yearMonthDay = getYearMonthDayString(frameId)
  let ardFilename = getArdFilename(frameId)
  let url = `${baseUrl}/sentinel_${satellite}/${yearMonthDay}/${ardFilename}`

  return url
}

export function getIndexUrl(frameId : string, baseUrl : string, indexName : string) {
  let satellite = getSatellite(frameId)
  let yearMonthDay = getYearMonthDayString(frameId)
  let indexFilename = getIndexFilename(frameId, indexName)
  let url = `${baseUrl}/sentinel_${satellite}/${indexName.toLocaleLowerCase()}/${yearMonthDay}/${indexFilename}`

  return url
}

function getSatellite(frameId : string) {
  let satellite = frameId.substring(1, 2)

  return satellite
}

function getYearMonthDayString(frameId : string) {
  let year = frameId.substring(4, 8)
  let month = frameId.substring(8, 10)
  let day = frameId.substring(10, 12)

  return `${year}/${month}/${day}`
}

function getArdFilename(frameId : string) {
  let ardFilename = null
  if (frameId.toLocaleLowerCase().startsWith('s1')) {
    let ardProductName = frameId.substring(0, frameId.length - 3) // remove the two letter OSGB code from the end, e.g. _SD
    ardFilename = ardProductName + '.tif'
  } else {
    ardFilename = frameId + '_vmsk_sharp_rad_srefdem_stdsref.tif'
  }

  return ardFilename
}

function getIndexFilename(frameId : string, indexName : string) {
  let indexFilename = `${frameId}_${indexName}.tif`

  return indexFilename
}