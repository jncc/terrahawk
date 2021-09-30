import React from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Rectangle, TileLayer, GeoJSON, Tooltip } from 'react-leaflet'

import { frameworks } from './frameworks'
import { Choropoly } from './api/types'
import { getCssClassForZScore } from './utility/choroplethUtility'
import { roundTo3Decimals } from './utility/numberUtility'

export type Props = {
  choropolys: Choropoly[]
}

let makePolygonLayers = (ps: Choropoly[]) => {

  return ps.map(p => {

    let loStyle = { weight: 1, color: '#222', opacity: 0.6 }
    let hiStyle = { weight: 1, color: '#000', opacity: 1.0 }

    let style = {
      ...loStyle,
      fill:   true, // a polygon seems to need a fill for mouseover to work properly
      fillOpacity: 0.7,
      // fillColor: getColour(p.max_z_mean_abs),
      className: getCssClassForZScore(p.max_z_mean_abs)      
    }

    let onFeatureCreated = (feature: any, layer: any) => {
      layer.on({
        mouseover: (e: any) => { e.target.setStyle(hiStyle) },
        mouseout:  (e: any) => { e.target.setStyle(loStyle) }
        // click:  (e: any) => POLYGON_SELECTED!
      });
    }    

    return (
      // @ts-ignore
      <GeoJSON key={p.polyid} data={p.geojson} style={style} onEachFeature={onFeatureCreated}  >
        <Tooltip offset={[40, 0]}>
          Polygon <b>{p.polyid}</b>
          <br />
          <i>{p.habitat}</i>
          <br />
          {roundTo3Decimals(p.max_z_mean_abs)} max abs Z-score (mean)
        </Tooltip>
      </GeoJSON>
    )
  })
}

export let LeafletMap = (props: Props) => {

  let [center, setCenter] = React.useState(frameworks.liveng0.defaultCenter)

  let [latPad, lngPad] = [0.02, 0.04]
  let bounds = L.latLngBounds([center.lat - latPad, center.lng - lngPad], [center.lat + latPad, center.lng + lngPad])

  // let [map, setMap] = React.useState<L.Map>()

  return (
    <MapContainer
      className="leaflet-map-container"
      center={center}
      zoom={frameworks.liveng0.defaultZoom}>
      <TileLayer
        url="https://tile.viaeuropa.uk.com/osmao-scotg-ov012-a8f54/m0335/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Rectangle bounds={bounds} color='#ff7800' weight={3} fill={false} interactive={false} />
      {makePolygonLayers(props.choropolys)}
    </MapContainer>
  )
}
