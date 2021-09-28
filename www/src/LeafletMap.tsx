
import React from 'react'
// import { connect as reduxConnect } from 'react-redux'
import L, { TileLayerOptions } from 'leaflet'

import { config } from './config'
// import { bboxFlatArrayToCoordArray } from '../../utility/geospatialUtility'
// import { roundTo3Decimals } from '../../utility/numberUtility'
// import { Product } from '../../catalog/types'
// import { GeoJsonObject } from 'geojson'
// import { State, AppActions, DispatchProps, initialState } from '../../state'

type Props = {
}
// type StateProps = State

let map: L.Map

// let LeafletMapComponent = (props: Props & StateProps & DispatchProps) => {
export let LeafletMap = (props: Props) => {

  React.useEffect(() => {
    
    map = L.map('leaflet-map', {
      minZoom: 2,
      maxZoom: config.maximumZoom,
    })

    map.setView(config.defaultCenter, config.defaultZoom)

    // base layer
    L.tileLayer(config.baseLayerUrlTemplate, {
      attribution: config.attribution,
      maxZoom: config.maximumZoom,
    }).addTo(map)
  
    // save the map view so we can come back to it from a different screen
    // map.on('zoomend', () => {
    //   props.dispatch(AppActions.leafletZoomChanged(map.getZoom()))
    // })
    // map.on('moveend', () => {
    //   props.dispatch(AppActions.leafletCenterChanged([map.getCenter().lat, map.getCenter().lng]))
    // })
  }, [])

//   React.useEffect(() => {

//     // set the position
//     map.setView(props.mapScreen.leaflet.center, props.mapScreen.leaflet.zoom, { animate: false })

//     // redraw the bbox rectangle
//     bboxRect.remove()
//     bboxRect = L.rectangle(
//       L.latLngBounds(bboxFlatArrayToCoordArray(props.mapScreen.bbox)), { fillOpacity: 0 }
//     )
//     bboxRect.addTo(map)
//     bboxRect.enableEdit() // enable a moveable bbox with leaflet.editable

//   }, [props.mapScreen.leaflet.redraw])

  // set the zoom when it changes (effectively a no-op when zoom changed by double-clicking / keyboard)
//   React.useEffect(() => {
//     map.setZoom(props.mapScreen.leaflet.zoom)
//   }, [props.mapScreen.leaflet.zoom])

  // toggle the visualisation layers
//   React.useEffect(() => {
//     if (props.mapScreen.visualise) {
//       map.addLayer(aggregateLayer)
//       map.addLayer(collectionWmsLayerGroup)
//     } else {
//       map.removeLayer(aggregateLayer)
//       map.removeLayer(collectionWmsLayerGroup)
//     }
//   }, [props.mapScreen.visualise])

  // react has nothing to do with the leaflet map;
  // map manipulation is performed via side-effects
  return <div id="leaflet-map" aria-describedby="sr-map-description"></div>
}

// export const LeafletMap = reduxConnect(
//   (s: State): StateProps => {
//     return s
//   }
// )(LeafletMapComponent)

