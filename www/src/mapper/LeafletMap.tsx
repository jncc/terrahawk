import React from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { frameworks } from '../frameworks'
import { Poly } from './types'
import { getColour, getCssClassForZScore } from '../utility/choroplethUtility'
import { roundTo3Decimals } from '../utility/numberUtility'
import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { mapperActions } from './slice'
import { getBoundsOfMapperBbox } from './bbox'

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
      // maxZoom: config.maximumZoom,
    })

    // attribution
    // L.control.attribution({ position: 'bottomleft', prefix: '' }).addTo(map)


    // footprint and collection layers
    // productFootprintLayerGroup = L.layerGroup([]).addTo(map)

    // base layer
    L.tileLayer(`https://api.os.uk/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?key=0vgdXUPqv75LUeDK8Xb4nTwLxMd28ZXe`, {
      // attribution: config.attribution,
    }).addTo(map)
  
    map.on('moveend', () => {
      // console.log('moveend')
      // console.log(map.getCenter())
      dispatch(mapperActions.mapCenterChanged(map.getCenter()))
    })

    polyLayerGroup = L.layerGroup([]).addTo(map)

    // initial 
    // dispatch(mapperActions.mapCenterChanged(map.getCenter()))
    map.setView(state.query.center, frameworks.liveng0.defaultZoom)

  }, [])

  React.useEffect(() => {

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

  React.useEffect(() => {

    // polys
    if (polyLayerGroup || (polylayers && polylayers.length > 0)) {
      polylayers = []
      polyLayerGroup.clearLayers()  
    }
    polylayers = makePolylayers(state.polygons)
    polylayers.forEach(p => p.layer.addTo(polyLayerGroup))

  }, [state.polygons.map(p => p.polyid).join(',')])  

  React.useEffect(() => {

    // choropleth
    state.choropolys.forEach(c => {
      let maybePolylayer = polylayers.find(x => x.poly.polyid === c.polyid)
      maybePolylayer?.layer.setStyle({ fillColor: getColour(Math.abs(c.max_z_mean)) })
    })

  }, [state.choropolys.map(p => p.polyid).join(',')])  

  return <div id="leaflet-map" className="absolute inset-0"></div>
}



let makePolylayers = (ps: Poly[]) => {

  return ps.map(p => {

    let loStyle = { weight: 1, color: '#222', opacity: 0.6 }
    let hiStyle = { weight: 1, color: '#000', opacity: 1.0 }

    let style = {
      ...loStyle,
      fill:   true, // a polygon seems to need a fill for mouseover to work properly
      fillOpacity: 0.7,
      fillColor: 'transparent',
      // fillColor: getColour(p.max_z_mean_abs),
      // className: getCssClassForZScore(Math.abs(p.max_z_mean))
    }

    // return (
    //   <GeoJSON key={p.polyid} data={p.geojson} style={style} onEachFeature={onFeatureCreated}  >
    //     <Tooltip offset={[40, 0]}>
    //       <b>{p.habitat}</b>
    //       <br />
    //       Polygon {p.polyid}
    //       <br />
    //       <b>{roundTo3Decimals(Math.abs(p.max_z_mean))}</b> maximum Z-score (mean)
    //     </Tooltip>
    //   </GeoJSON>
    // )

    let layer = L.geoJSON(p.geojson, { style } )
    layer.on('mouseover', (e: any) => { e.target.setStyle(hiStyle) })
    layer.on('mouseout',  (e: any) => { e.target.setStyle(loStyle) })
    // click:  (e: any) => POLYGON_SELECTED!

    return { poly: p, layer: layer }
  })
}
