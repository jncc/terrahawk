import React, { useEffect } from 'react'
import L, { LatLngBounds } from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { frameworks } from '../frameworks'
import { isChoroplethItem, Poly } from './types'
import { getChoroplethMaxZValue, getColour } from './helpers/choroplethHelpers'
import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { mapperActions } from './slice'
import { getBoundsOfBboxRectangle } from './helpers/bboxHelpers'
import { makePolygonTooltipHtml } from './PolygonTooltip'
import { bboxRectangleStyle, frameworkBoundaryStyle } from './helpers/styleHelpers'
import { AnyAction, Dispatch } from '@reduxjs/toolkit'
import 'leaflet-active-area'

type CustomPolygonLayer = L.GeoJSON & { polyid: string, habitat: string }

let map: L.Map
let bboxRectangle: L.Rectangle
let polyLayerGroup: L.LayerGroup<CustomPolygonLayer>
let selectedPolyLayerGroup: L.LayerGroup<CustomPolygonLayer>

export let LeafletMap = () => {

  let state = useStateSelector(s => s.mapper)
  let dispatch = useStateDispatcher()
  
  let framework = frameworks[state.query.framework]

  // initialize the Leaflet map
  useEffect(() => {
    
    map = L.map('leaflet-map', {
      minZoom: 7,
      zoomControl: false,
      attributionControl: false,
      maxBounds: new LatLngBounds(framework.maxBounds.southWest, framework.maxBounds.northEast)
    })

    // attribution
    L.control.attribution({ position: 'bottomright', prefix: '' }).addTo(map)

    // base layer
    L.tileLayer(`https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=0vgdXUPqv75LUeDK8Xb4nTwLxMd28ZXe`, {
      attribution: `Contains OS data © Crown copyright and database rights 2021`,
    }).addTo(map)
  
    // framework boundary
    L.geoJSON(framework.boundary, { style: frameworkBoundaryStyle }).addTo(map)

    // polygon layer group
    polyLayerGroup = L.layerGroup()
    selectedPolyLayerGroup = L.layerGroup().addTo(map)

    // listen for zoom changes
    map.on('zoomend', () => {
      dispatch(mapperActions.mapZoomChanged(map.getZoom()))
    })

    // listen for position changes
    map.on('moveend', () => {
      dispatch(mapperActions.mapCenterChanged(map.getCenter()))
    })

    // setView handily raises the 'moveend' event we've wired up above,
    // so no need to raise an initial event artifically
    map.setView(state.query.center, state.zoom)

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
      .filter((l: any) => !state.polygons.polys.find(p => p.polyid === l.polyid))
      .forEach(l => {
        l.getTooltip()?.remove()
        polyLayerGroup.removeLayer(l)
        l.remove() // explictly remove the layer from the map to encourage garbage collection    
      })
      
    // add layers for polygons in state.polygons not already on the map
    state.polygons.polys.filter(p =>
      !(polyLayerGroup.getLayers() as CustomPolygonLayer[]).find(l => l.polyid === p.polyid)
    ).forEach(p => makePolygonLayer(p, dispatch).addTo(polyLayerGroup))
    // but add them in chunks for a nicer visual effect
    // todo: but this causes a race-condition
    // chunk(shuffle(toAdd), toAdd.length / 8).forEach((chunk, i) => {
    //   setTimeout(() => {
    //     chunk.forEach(p => makePolygonLayer(p).addTo(polyLayerGroup))
    //   }, i * 50)
    // })
  }, [Object.values(state.polygons.params).join(':') + '|' + state.polygons.polys.map(p => p.polyid).join(',')])

  // react to change of `choropleth`
  // (sync the polygons layers on the leaflet map with the choropleth items in state)
  useEffect(() => {

    state.choropleth.items.forEach(c => {
      // we could well have changed position since the choropleth request was made,
      // so we can't assume that there will still be a polygon layer for any choropleth item
      let maybeLayer = (polyLayerGroup.getLayers() as CustomPolygonLayer[]).find(l => l.polyid === c.polyid)
      
      if (isChoroplethItem(c)) {
        let maxZ = getChoroplethMaxZValue(state.query.statistic, c)
        maybeLayer?.setStyle({ fillColor: getColour(Math.abs(maxZ)) })
      } else {
        maybeLayer?.setStyle({ fillColor: 'white' }) // no data
      }

      let currentlyOpen = maybeLayer && maybeLayer.getTooltip() && maybeLayer.isTooltipOpen()

      maybeLayer?.unbindTooltip()
      maybeLayer?.bindTooltip(
        makePolygonTooltipHtml(
          maybeLayer.polyid,
          maybeLayer.habitat,
          state.query.statistic,
          state.query.indexname,
          c
        ),
        { offset: [80, 0], className:'custom-leaflet-tooltip' }
      )

      // reopen the currently open tooltip for a much better experience
      if (currentlyOpen)
        maybeLayer?.openTooltip()
    })

  }, [
    Object.values(state.choropleth.params).join(':') + '|' + state.choropleth.items.map(c => c.polyid).join(','),
    state.query.statistic // statistic values are all in the same choropleth item object - simply redraw when this changes 
  ])

  // react to changes of `showPolygons` and `zoomedEnoughToShowPolygons`
  useEffect(() => {
    if (state.showPolygons && state.zoomedEnoughToShowPolygons)
      // showing ~1000 polygons causes a noticeable lag in the UI, so add a short delay
      setTimeout(() => polyLayerGroup.addTo(map), 50)
    else
      setTimeout(() => polyLayerGroup.remove(), 50)
    
  }, [state.showPolygons, state.zoomedEnoughToShowPolygons])

  // listen for selection / deselection of polygon
  useEffect(() => {
    selectedPolyLayerGroup.clearLayers()
    if (state.selectedPolygon) {
      let layer = L.geoJSON(state.selectedPolygon.geojson, {style: { weight: 5}})

      layer.addTo(selectedPolyLayerGroup)
      // let layer = polyLayerGroup.getLayers().find((l: any) => state.selectedPolygon?.polyid === l.polyid)

    }
    if (!state.previousSelectedPolygon && state.selectedPolygon) {
      // reduce the "active area" https://github.com/Mappy/Leaflet-active-area
      // and pan to the center of the newly-selected polygon
      // @ts-expect-error
      map.setActiveArea('leaflet-active-area-when-polygon-selected')
      let layer = L.geoJSON(state.selectedPolygon.geojson, {style: {weight: 5}})
      map.panTo(layer.getBounds().getCenter())
    }
    if (state.previousSelectedPolygon && !state.selectedPolygon) {
      // restore the "active area" (to full screen) with an animation (true, true)
      // @ts-expect-error
      map.setActiveArea('leaflet-active-area-when-polygon-not-selected', true, true)
    }
  }, [state.selectedPolygon, state.previousSelectedPolygon])
  
    // react has nothing to do with the leaflet map
  // map manipulation is done via side-effects (useEffect)
  return <div id="leaflet-map" className="absolute inset-0"></div>
}

let makePolygonLayer = (p: Poly, dispatch: Dispatch<AnyAction>) => {
  let loStyle: L.PathOptions = { weight: 1, color: '#000', opacity: 0.3, }
  let hiStyle: L.PathOptions = { weight: 3, color: '#000', opacity: 0.6, }

  let style: L.PathOptions = {
    ...loStyle,
    fillColor: 'white',
  }

  let layer = L.geoJSON(p.geojson, { style })
  layer.on('mouseover', (e: any) => {e.target.setStyle(hiStyle)})
  layer.on('mouseout',  (e: any) => {e.target.setStyle(loStyle)})
  layer.on('click', () => {dispatch(mapperActions.selectPolygon(p))})

  // save some custom properties so we can easily find and use the layer later
  ;(layer as CustomPolygonLayer).polyid = p.polyid
  ;(layer as CustomPolygonLayer).habitat = p.habitat
  
  return layer
}
