
import React from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import { useStateSelector } from '../state/hooks'

import customStyleJson from './OS_VTS_27700_Greyscale.json'


export const LibreMap = () => {

  let state = useStateSelector(s => s.mapper)

  
  var apiKey = '0vgdXUPqv75LUeDK8Xb4nTwLxMd28ZXe';

  // More styles can be found at https://github.com/OrdnanceSurvey/OS-Vector-Tile-API-Stylesheets.
  // var customStyleJson = 'https://raw.githubusercontent.com/OrdnanceSurvey/OS-Vector-Tile-API-Stylesheets/master/OS_VTS_27700_Greyscale.json';

  React.useEffect(() => {

    let map = new maplibregl.Map({
      container: 'libremap',
      minZoom: 6,
      maxZoom: 18,
      style: customStyleJson as any,
      maxBounds: [
          [ -10.76418, 49.528423 ],
          [ 1.9134116, 61.331151 ]
      ],
      center: state.center,
      zoom: 9,
      transformRequest: url => {
          if(! /[?&]key=/.test(url) ) url += '?key=' + apiKey
          return {
              url: url + '&srs=3857'
          }
      }
    })

    map.dragRotate.disable()
    map.touchZoomRotate.disableRotation()    
  })

  return <div id="libremap"></div>
}