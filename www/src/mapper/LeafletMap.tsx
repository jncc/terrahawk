import React, { useCallback, useEffect, useMemo, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Rectangle, TileLayer, GeoJSON, Tooltip } from 'react-leaflet'

import { frameworks } from '../frameworks'
import { Choropoly } from './types'
import { getCssClassForZScore } from '../utility/choroplethUtility'
import { roundTo3Decimals } from '../utility/numberUtility'
import { useStateSelector } from '../state/hooks'
import { getPaddedBoundsAroundPoint } from '../utility/geospatialUtility'

export type Props = {
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
      className: getCssClassForZScore(Math.abs(p.max_z_mean))
    }

    let onFeatureCreated = (feature: any, layer: any) => {
      layer.on({
        mouseover: (e: any) => { e.target.setStyle(hiStyle) },
        mouseout:  (e: any) => { e.target.setStyle(loStyle) }
        // click:  (e: any) => POLYGON_SELECTED!
      });
    }    

    return (
      <GeoJSON key={p.polyid} data={p.geojson} style={style} onEachFeature={onFeatureCreated}  >
        <Tooltip offset={[40, 0]}>
          <b>{p.habitat}</b>
          <br />
          Polygon {p.polyid}
          <br />
          <b>{roundTo3Decimals(Math.abs(p.max_z_mean))}</b> maximum Z-score (mean)
        </Tooltip>
      </GeoJSON>
    )
  })
}

export let LeafletMapX = (props: Props) => {

  let [center, setCenter] = React.useState(frameworks.liveng0.defaultCenter)

  let [latPad, lngPad] = [0.03, 0.06]
  let bounds = L.latLngBounds([center.lat - latPad, center.lng - lngPad], [center.lat + latPad, center.lng + lngPad])

  return (
    <MapContainer
      className="absolute inset-0"
      center={center}
      zoom={frameworks.liveng0.defaultZoom}>
      <TileLayer
        url="https://api.os.uk/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?key=0vgdXUPqv75LUeDK8Xb4nTwLxMd28ZXe"
        //attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Rectangle bounds={bounds} color='#ff7800' weight={2} fill={false} interactive={false} />
      {/* {makePolygonLayers(props.choropolys)} */}
    </MapContainer>
  )
}






const defaultCenter = { lat: 51.505, lng: -0.09 }
const defaultZoom = 13

export let LeafletMap = (props: Props) => {
  
  let [map, setMap] = React.useState<L.Map>()
  
  let zoom =  useStateSelector(s => s.mapper.zoom)
  let center =  useStateSelector(s => s.mapper.center)
  let box = getPaddedBoundsAroundPoint(center)
  let bounds = L.latLngBounds(box.southWest, box.northEast)
 
  return (
    <>
      {map ? <DisplayPosition map={map} /> : null}
      {map ? <EventListeners map={map} /> : null}
      {/* {makeLeafletMap} */}
      <MapContainer
        className="absolute inset-0 left-48" // 
        center={center}
        zoom={zoom}
        whenCreated={setMap}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Rectangle bounds={bounds} color='#ff7800' weight={2} fill={false} interactive={false} />

      </MapContainer>
    </>
  )
}

let EventListeners = ({ map }: { map: L.Map }) => {

  // let [position, setPosition] = useState(map.getCenter())

  let reset = useCallback(() => {
    map.setView(defaultCenter, defaultZoom)
  }, [map])

  let getPosition = useCallback(() => {
    // setPosition(map.getCenter())

  }, [map])

  return null
}

let DisplayPosition = (props: any ) => {
  let map = props.map
  
  const [position, setPosition] = useState(map.getCenter())

  const reset = useCallback(() => {
    map.setView(defaultCenter, defaultZoom)
  }, [map])

  const onMove = useCallback(() => {
    setPosition(map.getCenter())
  }, [map])

  useEffect(() => {
    map.on('move', onMove)
    return () => {
      map.off('move', onMove)
    }
  }, [map, onMove])

  return (
    <>
    <div>
      latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{' '}
    </div>
    <div>
      <button onClick={reset}>reset</button>
    </div>
    </>
  )
}