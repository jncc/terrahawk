import React, { useEffect } from 'react'
import L, { LatLngBounds } from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { frameworks } from '../../frameworks'
import { FieldData, isChoroplethItem, Poly } from './types'
import { getChoroplethMaxZValue, getColour } from './helpers/choroplethHelpers'
import { getMarkerColour } from './helpers/fieldDataHelper'
import { useStateDispatcher, useStateSelector } from '../../state/hooks'
import { mapperActions } from './slice'
import { getBoundsOfBboxRectangle } from './helpers/bboxHelpers'
import { makePolygonTooltipHtml } from './PolygonTooltip'
import { bboxRectangleStyle, frameworkBoundaryStyle } from './helpers/styleHelpers'
import { AnyAction, Dispatch } from '@reduxjs/toolkit'
import 'leaflet-active-area'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faClipboardList } from '@fortawesome/free-solid-svg-icons'

import ReactDOMServer from 'react-dom/server'

type CustomPolygonLayer = L.GeoJSON & { polyid: string, habitat: string }
type CustomFieldDataLayer = L.GeoJSON & { fieldData: FieldData }

let map: L.Map
let bboxRectangle: L.Rectangle
let polyLayerGroup: L.LayerGroup<CustomPolygonLayer>
let selectedPolyLayerGroup: L.LayerGroup<CustomPolygonLayer>
let fieldDataLayerGroup: L.LayerGroup<CustomFieldDataLayer>
let frameworkBoundary: L.GeoJSON

export let LeafletMap = () => {

  let state = useStateSelector(s => s.mapper)
  let dispatch = useStateDispatcher()
  
  let framework = frameworks[state.query.framework]

  // initialize the Leaflet map
  useEffect(() => {
    
    map = L.map('leaflet-map', {
      minZoom: framework.minZoom,
      maxZoom: framework.maxZoom,
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
    frameworkBoundary = L.geoJSON(framework.boundary, { style: frameworkBoundaryStyle }).addTo(map)

    // polygon layer group
    polyLayerGroup = L.layerGroup()
    selectedPolyLayerGroup = L.layerGroup().addTo(map)

    // field data layer group
    fieldDataLayerGroup = L.layerGroup()

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

  // redraw boundary for change of `framework`
  useEffect(() => {
    dispatch(mapperActions.selectPolygon(undefined))
    frameworkBoundary.remove()
    frameworkBoundary = L.geoJSON(framework.boundary, { style: frameworkBoundaryStyle }).addTo(map)
  }, [state.query.framework])

  // react to change of `zoom`
  useEffect(() => {
    map.setZoom(state.zoom)
  }, [state.zoom])

  // react to change of `query.center` (position change)
  useEffect(() => {

    if (bboxRectangle) {
      bboxRectangle.remove()
    }
    
    let bounds = getBoundsOfBboxRectangle(state.query.center, state.query.framework)
    bboxRectangle = L.rectangle(
      L.latLngBounds(bounds.southWest, bounds.northEast),
      bboxRectangleStyle).addTo(map)

  }, [state.query.center, state.query.framework])

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

  // react to change of `field data`
  useEffect(() => {
    
    if (state.showNpmsData && state.zoomedEnoughToShowPolygons)
    fieldDataLayerGroup.getLayers()
      .filter((l: any) => !state.fieldData?.find(f => f.sampleid === l.sampleId))
      .forEach(l => {
        fieldDataLayerGroup.removeLayer(l)
        l.remove()
      })
      
    // add layers for field data in state.fieldData not already on the map
    if (state.fieldData) {
      state.fieldData.filter(f =>
        !(fieldDataLayerGroup.getLayers() as CustomFieldDataLayer[]).find(l => l.fieldData.sampleid === f.sampleid)
      ).forEach(f => {
        let position = new L.LatLng(f.latitude, f.longitude)
        let marker = L.marker(position)

        let colour = getMarkerColour(f.match.toLowerCase() === 'yes')

        let iconHtml = ReactDOMServer.renderToString(
          <span className="block relative w-8 h-8 -left-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} size="3x" color={colour} stroke="black" stroke-width="5"></FontAwesomeIcon>
          </span>
        )

        let popupHtml = ReactDOMServer.renderToString(
          <div className="fielddata-popup-info">
            <h1>
              <div className="flex">
                <span className="mr-2"><FontAwesomeIcon icon={faClipboardList} size="2x"></FontAwesomeIcon></span>
                {f.classsystem} {f.finehabitat}
              </div>
            </h1>
            <h2>{f.date}</h2>

            {f.finehabitat &&
            <>
              <h3>Fine habitat type</h3>
              <p>{f.finehabitat}</p>
            </>
            }

            {f.broadhabitat &&
            <>
              <h3>Broad habitat type</h3>
              <p>{f.broadhabitat}</p>
            </>
            }

            {f.classsystem &&
            <>
              <h3>Classification system</h3>
              <p>{f.classsystem}</p>
            </>
            }

            {f.surveyname &&
            <>
              <h3>Survey</h3>
              <p>{f.surveyname}</p>
            </>
            }

            {f.habitatcondition && 
            <>
              <h3>Habitat condition</h3>
              <p>{f.habitatcondition}</p>
            </>
            }
            
            {f.management &&
            <>
              <h3>Management</h3>
              <p>{f.management}</p>
            </>
            }

            {f.species &&
            <>
              <h3>Species</h3>
              <p>{f.species}</p>
            </>
            }

            {f.structure &&
            <>
              <h3>Structure</h3>
              <p>{f.structure}</p>
            </>
            }
            
            {f.other &&
            <>
              <h3>Other</h3>
              <p>{f.other}</p>
            </>
            }
          </div>
        )

        let icon = L.divIcon({
          className: '', // stops the white box appearing
          html: iconHtml
        })
        
        marker.setIcon(icon)
        marker.bindPopup(popupHtml)
      
        marker.addTo(fieldDataLayerGroup)
      })
    }
  }, [state.fieldData.map(f => f.sampleid).join(',')])

  // react to changes of `showPolygons` and `zoomedEnoughToShowPolygons`
  useEffect(() => {
    if (state.showPolygons && state.zoomedEnoughToShowPolygons)
      // showing ~1000 polygons causes a noticeable lag in the UI, so add a short delay
      setTimeout(() => polyLayerGroup.addTo(map), 50)
    else
      setTimeout(() => polyLayerGroup.remove(), 50)
    
  }, [state.showPolygons, state.zoomedEnoughToShowPolygons])

  // react to changes of `showNpmsData` and `zoomedEnoughToShowPolygons`
  useEffect(() => {
    if (state.showNpmsData && state.zoomedEnoughToShowPolygons)
      setTimeout(() => fieldDataLayerGroup.addTo(map), 50)
    else
      setTimeout(() => fieldDataLayerGroup.remove(), 50)
    
  }, [state.showNpmsData, state.zoomedEnoughToShowPolygons])

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
