import React, { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useHotkeys } from 'react-hotkeys-hook'

import { frameworks } from '../frameworks'
import { ChoroplethItem, Poly, Statistic } from './types'
import { getChoroplethMaxZValue, getColour, getCssClassForZScore } from './helpers/choroplethHelpers'
import { roundTo3Decimals } from '../utility/numberUtility'
import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { mapperActions } from './slice'
import { getBoundsOfBboxRectangle } from './helpers/bboxHelpers'
import { makePolygonTooltipHtml } from './PolygonTooltip'
import { bboxRectangleStyle, frameworkBoundaryStyle } from './helpers/styleHelpers'
import { globalActions } from '../global/slice'

type CustomPolygonLayer = L.GeoJSON & { polyid: string, habitat: string }

let map: L.Map
let bboxRectangle: L.Rectangle
let polyLayerGroup: L.LayerGroup<CustomPolygonLayer>

export let LeafletMap = () => {

  let state = useStateSelector(s => s.mapper)
  let dispatch = useStateDispatcher()
  
  // initialize the Leaflet map
  useEffect(() => {
    
    map = L.map('leaflet-map', {
      minZoom: 7,
      zoomControl: false,
    })

    // attribution
    L.control.attribution({ position: 'bottomleft', prefix: '' }).addTo(map)

    // base layer
    L.tileLayer(`https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=0vgdXUPqv75LUeDK8Xb4nTwLxMd28ZXe`, {
      attribution: `Contains OS data © Crown copyright and database rights 2021`,
    }).addTo(map)
  
    // framework boundary
    L.geoJSON(frameworks[state.query.framework].boundary, { style: frameworkBoundaryStyle }).addTo(map)

    // polygon layer group
    polyLayerGroup = L.layerGroup([])

    // listen for position changes
    map.on('moveend', () => {
      dispatch(mapperActions.mapCenterChanged(map.getCenter()))
    })

    // setView handily raises the 'moveend' event we've wired up above,
    // so no need to raise an initial event artifically
    map.setView(state.query.center, frameworks[state.query.framework].defaultZoom)

  }, [])

  // react to change of `query.center` (position change)
  useEffect(() => {

    if (bboxRectangle) {
      bboxRectangle.remove()
    }
    let bounds = getBoundsOfBboxRectangle(state.query.center)
    bboxRectangle = L.rectangle(
      L.latLngBounds(bounds.southWest, bounds.northEast),
      bboxRectangleStyle).addTo(map)

  }, [state.query.center])

  // react to change of `polygons`
  // (sync the polygons on the leaflet map with the polygons in state)
  useEffect(() => {

    // remove layers for polygons that aren't in state.polygons
    polyLayerGroup.getLayers()
      .filter((l: any) => !state.polygons.find(p => p.polyid === l.polyid))
      .forEach(l => {
        l.getTooltip()?.remove()
        polyLayerGroup.removeLayer(l)
        l.remove() // explictly remove the layer from the map to encourage garbage collection    
      })
      
    // add layers for polygons in state.polygons not already on the map
    state.polygons
      .filter(p => !(polyLayerGroup.getLayers() as CustomPolygonLayer[]).find(l => l.polyid === p.polyid))
      .forEach(p => makePolygonLayer(p).addTo(polyLayerGroup))

    

    // _(polylayers).shuffle().chunk(100).forEach((chunk, i) => {
    //   setTimeout(() => {
    //     chunk.forEach( p => p.layer.addTo(polyLayerGroup) )
    //   }, i * 50)
    // })

  }, [state.polygons.map(p => p.polyid).join(',')])  

  // react to change of `choropleth`
  // (sync the polygons layers on the leaflet map with the choropleth items in state)
  useEffect(() => {

    state.choropleth.forEach(c => {
      // we could well have changed position since the choropleth request was made,
      // so we can't assume that there will still be a polygon layer for any choropleth item
      let maybeLayer = (polyLayerGroup.getLayers() as CustomPolygonLayer[]).find(l => l.polyid === c.polyid)
      maybeLayer?.setStyle({ fillColor: getColour(Math.abs(c.max_z_mean)) })
      if (!maybeLayer?.getTooltip()) {
        maybeLayer?.bindTooltip(
          makePolygonTooltipHtml(
            maybeLayer.polyid,
            maybeLayer.habitat,
            getChoroplethMaxZValue(state.query.statistic, c),
            state.query.statistic),
          { offset: [80, 0] }
        )
      }
    })
  }, [state.choropleth.map(p => p.polyid).join(',')])  

  // react to changes of `showPolygons`
  useEffect(() => {
    if (state.showPolygons)
      // showing ~1000 polygons causes a noticeable lag in the React UI, so add a short delay
      setTimeout(() => polyLayerGroup.addTo(map), 50)
    else
      setTimeout(() => polyLayerGroup.remove(), 50)
    
  }, [state.showPolygons])

  useHotkeys('space', () => { dispatch(mapperActions.togglePolygons()) })
  useHotkeys('e', () => { dispatch(globalActions.errorOccurred('Bah humbug')) })

  // react has nothing to do with the leaflet map;
  // map manipulation is done via side-effects (useEffect)
  return <div id="leaflet-map" className="absolute inset-0"></div>
}



let makePolygonLayer = (p: Poly) => {
  let loStyle: L.PathOptions = { weight: 1, color: '#222', opacity: 0.6, }
  let hiStyle: L.PathOptions = { weight: 4, color: '#000', opacity: 0.6, }
  // let loStyle: L.PathOptions = { fill: true }
  // let hiStyle: L.PathOptions = { fill: false, }

  let style = {
    ...loStyle,
    // fill: true, // a polygon seems to need a fill for mouseover to work properly
    // fillOpacity: 0,
    fillColor: 'white',
  }

  let layer = L.geoJSON(p.geojson, { style })
  let fillColor;
  layer.on('mouseover', (e: any) => { e.target.setStyle(hiStyle) })
  layer.on('mouseout',  (e: any) => { e.target.setStyle(loStyle) })
  // layer.on('mouseover', (e: any) => { console.log('mouseover') })
  // layer.on('mouseout',  (e: any) => { console.log('mouseout') })
  // click:  (e: any) => POLYGON_SELECTED!

  // save some custom properties so we can easily find and use the layer later
  ;(layer as CustomPolygonLayer).polyid = p.polyid
  ;(layer as CustomPolygonLayer).habitat = p.habitat
  
  return layer
}
