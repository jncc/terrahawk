
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFire, faFireAlt, faLeaf, faTint, faWater, faTree, faSatelliteDish } from '@fortawesome/free-solid-svg-icons'

import { Indexname } from '../types'

export let getIndexnameIcon = (indexname: Indexname) => {
    switch (indexname) {
        case 'NBR':  return faFireAlt
        case 'NDMI': return faTint
        case 'NDVI': return faLeaf
        case 'NDWI': return faWater
        case 'RVI':  return faLeaf
        case 'VVVH':  return faSatelliteDish
        case 'VHVV':  return faSatelliteDish
        case 'RFDI':  return faTree
    }
}