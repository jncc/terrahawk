
import React from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useStateSelector } from '../state/hooks'

export const LibreMap = () => {

  let state = useStateSelector(s => s.mapper)

  React.useEffect(() => {

    let map = new maplibregl.Map({
      container: 'libre-map',
      style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL', // stylesheet location
      center: state.center, // [-74.5, 40],
      zoom: state.zoom,
      accessToken: 'OpIi9ZULNHzrESv6T2vL'
    })
    // map = L.map('leaflet-map', {
    //   minZoom: 2,
    //   maxZoom: config.maximumZoom,
    //   editable: true, // enable leaflet.editable plugin
    // })

    // attribution
    // L.control.attribution({ position: 'bottomleft', prefix: '' }).addTo(map)

    // map.setView(props.mapScreen.leaflet.center, props.mapScreen.leaflet.zoom)

  })

  return <div id="libre-map"></div>
}