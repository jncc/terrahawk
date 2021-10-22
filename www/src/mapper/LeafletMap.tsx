import React, { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import * as _ from 'lodash'

import { frameworks } from '../frameworks'
import { ChoroplethItem, Poly, Statistic } from './types'
import { getChoroplethMaxZValue, getColour, getCssClassForZScore } from './choroplethHelpers'
import { roundTo3Decimals } from '../utility/numberUtility'
import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { mapperActions } from './slice'
import { getBoundsOfMapperBbox } from './bboxHelpers'
import { makePolygonTooltipHtml } from './PolygonTooltip'

let map: L.Map
let bboxRectangle: L.Rectangle
let polyLayerGroup: L.LayerGroup
let polylayers: { poly: Poly, layer: L.GeoJSON<any> }[]

export let LeafletMap = () => {

  let state = useStateSelector(s => s.mapper)
  let dispatch = useStateDispatcher()
  
  React.useEffect(() => {
    
    map = L.map('leaflet-map', {
      minZoom: 2,
      zoomControl: false,
    })

    // base layer
    L.tileLayer(`https://api.os.uk/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?key=0vgdXUPqv75LUeDK8Xb4nTwLxMd28ZXe`, {
      // attribution: config.attribution,
    }).addTo(map)
  
    polyLayerGroup = L.layerGroup([]).addTo(map)

    map.on('moveend', () => {
      dispatch(mapperActions.mapCenterChanged(map.getCenter()))
    })

    // setView handily raises the 'moveend' event we've wired up above,
    // so data gets fetched initially without needing the map to be moved
    map.setView(state.query.center, frameworks.liveng0.defaultZoom)

  }, [])

  // react to change of `query.center`
  useEffect(() => {

    // bbox
    if (bboxRectangle) {
      bboxRectangle.remove()
    }
    let bounds = getBoundsOfMapperBbox(state.query.center)
    bboxRectangle = L.rectangle(
      L.latLngBounds(bounds.southWest, bounds.northEast),
      { color: '#ff7800', weight: 1, fill: false, interactive: false }
    )
    bboxRectangle.addTo(map)

  }, [state.query.center])  

  // react to change of `polygons`
  useEffect(() => {

    // polys
    if (polyLayerGroup || (polylayers && polylayers.length > 0)) {
      polylayers = []
      polyLayerGroup.clearLayers()  
    }
    polylayers = makePolylayers(state.polygons)
    _(polylayers).shuffle().chunk(100).forEach((chunk, i) => {
      setTimeout(() => {
        chunk.forEach( p => p.layer.addTo(polyLayerGroup) )
      }, i * 50)
    })
    // polylayers.forEach(p => p.layer.addTo(polyLayerGroup))

  }, [state.polygons.map(p => p.polyid).join(',')])  

  // react to change of `choropleth`
  useEffect(() => {

    state.choropleth.forEach(c => {
      let maybePolylayer = polylayers.find(x => x.poly.polyid === c.polyid)
      maybePolylayer?.layer.setStyle({ fillColor: getColour(Math.abs(c.max_z_mean)) })
      maybePolylayer?.layer.bindTooltip(
        makePolygonTooltipHtml(
          maybePolylayer.poly,
          getChoroplethMaxZValue(state.query.statistic, c),
          state.query.statistic),
        { offset: [80, 0] }
      )
    })

  }, [state.choropleth.map(p => p.polyid).join(',')])  

  return <div id="leaflet-map" className="absolute inset-0"></div>
}



let makePolylayers = (ps: Poly[]) => {

  return ps.map(p => {

    let loStyle = { weight: 1, color: '#222', opacity: 0.6 }
    let hiStyle = { weight: 2, color: '#000', opacity: 0.6 }

    let style = {
      ...loStyle,
      fill:   true, // a polygon seems to need a fill for mouseover to work properly
      fillOpacity: 0,
      fillColor: 'white',
      // fillColor: getColour(p.max_z_mean_abs),
      // className: getCssClassForZScore(Math.abs(p.max_z_mean))
    }

    let layer = L.geoJSON(p.geojson, { style } )
    layer.on('mouseover', (e: any) => { e.target.setStyle(hiStyle) })
    layer.on('mouseout',  (e: any) => { e.target.setStyle(loStyle) })
    // click:  (e: any) => POLYGON_SELECTED!

    return { poly: p, layer: layer }
  })
}
