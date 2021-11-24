import { fromUrl } from 'geotiff'
import { plot, addColorScale, renderColorScaleToCanvas } from 'plotty'
import proj4 from 'proj4'

import { Scale, ThumbnailType, ColourScale } from './types'
import { ardUrlBase, colourScales, indicesUrlBase, thumbnailBuffer, thumbnailConfig, projections } from './config'
import { getArdUrl, getIndexUrl } from './urlHelper'
import { getCacheItem , setCacheItem } from './cacheHelper'

// bands as they appear in the geotiff image
const blueBand = 0
const greenBand = 1
const redBand = 2

const vv = 0
const vh = 1

export function getPolygonOutline(coordinates : number[][][][], width : number, height : number) : string[] {
  let thumbnailBbox = getBoundingBoxWithBuffer(coordinates, thumbnailBuffer)

  let osgbScale = {
    xMin: thumbnailBbox[0],
    xMax: thumbnailBbox[1],
    yMin: thumbnailBbox[2],
    yMax: thumbnailBbox[3]
  }
  
  let polygonRings : string[] = []
  let singlePolygonCoords = coordinates[0] // assume we only have one polygon in this geojson
  singlePolygonCoords.forEach(polygonRing => {
    let pixelScale = {
      xMin: 0,
      xMax: width,
      yMin: 0,
      yMax: height
    }

    let pointsString = ''
    polygonRing.forEach(coords => {
      let pixelCoords = convertOsgbToPixelCoords(coords, osgbScale, pixelScale)
      pointsString += `${pixelCoords[0]},${pixelCoords[1]} `
    })

    polygonRings.push(pointsString)
  })

  return polygonRings
}

export async function getThumbnail(frameId: string, polygonId: string, coordinates: number[][][][], thumbnailType: string, useCache: boolean = true) {

  let thumbnailString = ''
  let type = thumbnailConfig[thumbnailType]
  
  if (useCache) {
    let thumbnailKey = `thumbs_${frameId}_${polygonId}_${type.text}`
    let cachedValue = getCacheItem(thumbnailKey)
    if (cachedValue && cachedValue != null) {
      thumbnailString = cachedValue
    } else {
      thumbnailString = await getThumbnailString(frameId, coordinates, type)
      setCacheItem(thumbnailKey, thumbnailString)
    }
  } else {
    thumbnailString = await getThumbnailString(frameId, coordinates, type)
  }

  return thumbnailString
}

export function getReprojectedCoordinates(coordinates : number[][][][], toProjection : string, fromProjection : string = 'WGS84') {
  let targetProjDefinition = projections[toProjection.toLowerCase()]
  
  let reprojectedCoordinates = []
  for (let a = 0; a < coordinates.length; a++) {
    let polygonRings = coordinates[a]

    let reprojectedRings = []
    for (let b = 0; b < polygonRings.length; b++) {
      let coordPairs = polygonRings[b]

      let reprojectedCoordPairs = []
      for (let c = 0; c < coordPairs.length; c++) {
        let coordPair = coordPairs[c]
        let reprojectedCoord = proj4(fromProjection, targetProjDefinition, coordPair)

        reprojectedCoordPairs.push(reprojectedCoord)
      }
      reprojectedRings.push(reprojectedCoordPairs)
    }
    reprojectedCoordinates.push(reprojectedRings)
  }

  return reprojectedCoordinates
}

async function getThumbnailString(frameId : string, coordinates: number[][][][], type : ThumbnailType) : Promise<string> {
  let thumbnailString = ''

  if (type.colourScale == 'rgb' && type.rgbDomains) {
    let url = getArdUrl(frameId, ardUrlBase)
    let satellite = frameId.substring(0, 2).toLocaleLowerCase()

    thumbnailString = await generateRGBThumbnail(url, coordinates, satellite)
  } else if (type.colourScale !== 'rgb' && type.domain) {
    let url = getIndexUrl(frameId, indicesUrlBase, type.text)

    thumbnailString = await generateIndexThumbnail(url, coordinates, type.domain, type.colourScale)
  } else {
    throw 'Colour scale not of the right type'
  }

  return thumbnailString
}

async function generateRGBThumbnail(url : string, coordinates : number[][][][], satellite : string) : Promise<string> {
  let thumbnailBbox = getBoundingBoxWithBuffer(coordinates, thumbnailBuffer)
  let tiff = await fromUrl(url)
  let image = await tiff.getImage()
  let bbox = await image.getBoundingBox()

  let pixelBbox = getPixelBboxForThumbnail(thumbnailBbox, bbox, image.getWidth(), image.getHeight())
  let samples = []

  if (satellite == 's1') {
    samples = [vv, vh]
  } else {
    samples = [redBand, greenBand, blueBand] // order matters
  }

  let data = await image.readRasters({ 
    window: pixelBbox,
    samples: samples
  })
  // console.log(data)

  return drawRGBImage(data, satellite)
}

async function generateIndexThumbnail(url : string, coordinates : number[][][][], domain : number[], colourScaleName : string) : Promise<string> {
  let thumbnailBbox = getBoundingBoxWithBuffer(coordinates, thumbnailBuffer)
  let tiff = await fromUrl(url)
  let image = await tiff.getImage()
  let bbox = await image.getBoundingBox()

  let pixelBbox = getPixelBboxForThumbnail(thumbnailBbox, bbox, image.getWidth(), image.getHeight())

  let data = await image.readRasters({ 
      window: pixelBbox
  })

  let thumbnailPixelHeight = data.height
  let thumbnailPixelWidth = data.width

  let canvas = document.createElement('canvas')

  let colourScale : ColourScale | undefined = colourScales.find(scale => scale.name == colourScaleName)
  if (colourScale) {
    addColorScale(colourScale.name, colourScale.colours, colourScale.positions)
    renderColorScaleToCanvas(colourScaleName, canvas)
  }

  let dataPlot = new plot({
    canvas: canvas,
    data: data[0],
    colorScale: colourScaleName,
    width: thumbnailPixelWidth,
    height: thumbnailPixelHeight,
    domain: domain,
    noDataValue: -9999
  })
  dataPlot.render()

  let canvasImage = canvas.toDataURL('image/png')
  return canvasImage
}

function drawRGBImage(data : any, satellite : string) : string {
  let thumbnailPixelHeight = data.height
  let thumbnailPixelWidth = data.width

  let canvas = document.createElement('canvas')
  canvas.width = thumbnailPixelWidth
  canvas.height = thumbnailPixelHeight

  let ctx = canvas.getContext('2d')

  if (ctx) {
    let totalPixelCount = 0
    for (let y = 0; y < thumbnailPixelHeight; y++) {
      for (let x = 0; x < thumbnailPixelWidth; x++) {
        let alpha = 1
        let red = 0
        let green = 0
        let blue = 0
        
        if (satellite === 's1') {
          if (data[0][totalPixelCount] && data[1][totalPixelCount]) {
            red = stretchColour(thumbnailConfig.falseColour.rgbDomains.red, thumbnailConfig.trueColour.rgbDomains.red, data[0][totalPixelCount])
            green = stretchColour(thumbnailConfig.falseColour.rgbDomains.green, thumbnailConfig.trueColour.rgbDomains.green, data[1][totalPixelCount])
            blue =  stretchColour(thumbnailConfig.falseColour.rgbDomains.blue, thumbnailConfig.trueColour.rgbDomains.blue, Math.round(red/green))
          } else {
            alpha = 0
          }
        } else {
          if (data[0][totalPixelCount] && data[1][totalPixelCount] && data[2][totalPixelCount]) {
            red = data[0][totalPixelCount]
            green = data[1][totalPixelCount]
            blue = data[2][totalPixelCount]
          } else {
            alpha = 0
          }
        }
        let colour = `rgb(${red}, ${green}, ${blue}, ${alpha})`
        
        ctx.fillStyle = colour
        ctx.fillRect(x, y, 1, 1)

        totalPixelCount++
      }
    }
  }

  let canvasImage = canvas.toDataURL('image/png')
  return canvasImage
}

function getPixelBboxForThumbnail(thumbnailOsgbBbox : number[], ardOsgbBbox : number[], ardPixelWidth : number, ardPixelHeight : number) {
  let ardXmin = ardOsgbBbox[0]
  let ardXmax = ardOsgbBbox[2]
  let ardYmin = ardOsgbBbox[1]
  let ardYmax = ardOsgbBbox[3]

  let thumbnailXmin = thumbnailOsgbBbox[0]
  let thumbnailXmax = thumbnailOsgbBbox[1]
  let thumbnailYmin = thumbnailOsgbBbox[2]
  let thumbnailYmax = thumbnailOsgbBbox[3]

  // for any given axis we know the min and max values of the ARD image in the OSGB coordinate system and in pixels
  // e.g. the x min and max values in OSGB might be 60000 and 62000, and in pixels might be 0 and 10000
  // so e.g. a thumbnail with xmin and max of 61000 and 62000 in OSGB would be 5000 and 10000 in pixels

  let bboxXRange = ardXmax - ardXmin
  let bboxYRange = ardYmax - ardYmin

  let xMinPixel = Math.round(((thumbnailXmin - ardXmin) / bboxXRange)*ardPixelWidth)
  let xMaxPixel = Math.round(((thumbnailXmax - ardXmin) / bboxXRange)*ardPixelWidth)
  // pixel coords go topleft to bottomright so need to reverse the y
  let yMinPixel = Math.round((1-((thumbnailYmax - ardYmin) / bboxYRange))*ardPixelHeight)
  let yMaxPixel = Math.round((1-((thumbnailYmin - ardYmin) / bboxYRange))*ardPixelHeight)

  let pixelBbox = [xMinPixel, yMinPixel, xMaxPixel, yMaxPixel]

  return pixelBbox
}

function stretchColour(sourceColourScale : number[], targetColourScale : number[], value : number) {
  let sourceRange = sourceColourScale[1] - sourceColourScale[0]
  let targetRange = targetColourScale[1] - targetColourScale[0]

  let stretchedValue = Math.round(((value - sourceColourScale[0]) / sourceRange)*targetRange)

  return stretchedValue
}

function convertOsgbToPixelCoords(osgbCoords : number[], osgbScale : Scale, pixelScale : Scale) {
  let osgbXRange = osgbScale.xMax - osgbScale.xMin
  let osgbYRange = osgbScale.yMax - osgbScale.yMin
  let pixelXRange = pixelScale.xMax - pixelScale.xMin
  let pixelYRange = pixelScale.yMax - pixelScale.yMin

  let pixelCoords = [
    Math.round(((osgbCoords[0] - osgbScale.xMin) / osgbXRange) * pixelXRange),
    Math.round((1 - ((osgbCoords[1] - osgbScale.yMin)) / osgbYRange) * pixelYRange)
  ]

  return pixelCoords
}

function getBoundingBoxWithBuffer(coordinates : number[][][][], bufferPercentage : number) {
  let eastings  : number[] = []
  let northings : number[] = []

  let coordPairs = coordinates[0][0] // assume there's only one polygon, then use just the outer ring to calculate the bbox
  coordPairs.forEach(coordPair => {
    eastings.push(coordPair[0])
    northings.push(coordPair[1])
  })

  let minEasting = Math.min.apply(null, eastings)
  let maxEasting = Math.max.apply(null, eastings)
  let minNorthing = Math.min.apply(null, northings)
  let maxNorthing = Math.max.apply(null, northings)

  // make it square
  let width = maxEasting - minEasting
  let height = maxNorthing - minNorthing

  let longestSide = Math.max(width, height)
  let distanceFromMidPoint = longestSide/2
  let polygonMidEastingPoint = width/2 + minEasting
  let polygonMidNorthingPoint = height/2 + minNorthing

  let minSquareEasting = polygonMidEastingPoint - distanceFromMidPoint
  let maxSquareEasting = polygonMidEastingPoint + distanceFromMidPoint
  let minSquareNorthing = polygonMidNorthingPoint - distanceFromMidPoint
  let maxSquareNorthing = polygonMidNorthingPoint + distanceFromMidPoint

  // add buffer
  let bufferAmount = longestSide*bufferPercentage
  let bufferedMinSquareEasting = minSquareEasting - bufferAmount
  let bufferedMaxSquareEasting = maxSquareEasting + bufferAmount
  let bufferedMinSquareNorthing = minSquareNorthing - bufferAmount
  let bufferedMaxSquareNorthing = maxSquareNorthing + bufferAmount

  let bbox = [bufferedMinSquareEasting, bufferedMaxSquareEasting, bufferedMinSquareNorthing, bufferedMaxSquareNorthing]
  return bbox
}
