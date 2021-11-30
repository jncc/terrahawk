
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFire, faLeaf, faTint, faWater } from '@fortawesome/free-solid-svg-icons'

import { Indexname } from '../types'

export let getIndexnameIcon = (indexname: Indexname) => {
    switch (indexname) {
        case 'EVI':  return faLeaf
        case 'NBR':  return faFire
        case 'NDMI': return faTint
        case 'NDVI': return faLeaf
        case 'NDWI': return faWater
    }
}