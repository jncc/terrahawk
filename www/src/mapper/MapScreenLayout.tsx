
import * as React from 'react'
import { connect as reduxConnect } from 'react-redux'
import { ChoroplethItem } from './types'
import { LeafletMap } from './LeafletMap'
import { MapControls } from './MapControls'
import { LibreMap } from './LibreMap'

// import { CollectionTuple, State } from '../../state'
// import { ProductResult } from '../../catalog/types'
// import { LeafletMap } from './LeafletMap'
// import { ProductListPanel } from './ProductListPanel'
// import { DatasetListPanels } from './DatasetListPanels'
// import { Delayed } from '../../shared/Delayed'
// import { BasketSummary } from './BasketSummary'
// import { MapControls } from './MapControls'
// import { motion } from 'framer-motion'

const rightPanelAnimationVariants = {
  open: { x: 0 },
  closed: { x: '104%' }, // move right by slightly more than its width
}
const leftPanelAnimationVariants = {
  open: { x: 0 },
  closed: { x: '-104%' }, // move left by slightly more than its width
}


export type Props = {
}
  
export const MapScreenLayout = (props: Props) => {

  let [rightPanelOpen, setRightPanelOpen] = React.useState(true)
  let [leftPanelOpen, setLeftPanelOpen] = React.useState(true)
  
  return <>
    {makeSmallScreenWarningUI()}
    {/* <span id="sr-map-description" className="accessibility">
      The map is not accessible.
    </span> */}
    <div className="d-none d-lg-block ">
      <div className="relative">
        {/* <Delayed delayInMilliseconds={800}>
          <motion.div className="left-panel-container"
            initial="open"
            animate={leftPanelOpen ? 'open' : 'closed'}
            variants={leftPanelAnimationVariants}
          >
            {currentCollection &&
              <div className="left-panel-container-toggle" onClick={() => setLeftPanelOpen(!leftPanelOpen)}>
                {leftPanelOpen
                  ? <i className="fas fa-chevron-left fa-xs" aria-hidden="true" />
                  : <i className="fas fa-chevron-right fa-xs"  aria-hidden="true" />
                }
              </div>
            }
            <DatasetListPanels
              collections={props.collections}
              productCountByCollection={props.productCountByCollection}
            />
          </motion.div>        
        </Delayed>
        <Delayed delayInMilliseconds={800}>
          <motion.div className="right-panel-container"
            initial="open"
            animate={rightPanelOpen ? 'open' : 'closed'}
            variants={rightPanelAnimationVariants}
          >
            {currentCollection &&
              <div className="right-panel-container-toggle" onClick={() => setRightPanelOpen(!rightPanelOpen)}>
                {rightPanelOpen
                  ? <i className="fas fa-chevron-right fa-xs" aria-hidden="true" />
                  : <i className="fas fa-chevron-left fa-xs" aria-hidden="true" />
                }
              </div>
            }
            <ProductListPanel
              products={props.products}
              currentCollection={currentCollection}
              productCountByCollection={props.productCountByCollection}
              productCountForCurrentCollection={productCountForCurrentCollection}
            />
            <BasketSummary />
          </motion.div>
        </Delayed>*/}   
      </div>
      <MapControls />
      <LeafletMap />
      {/* <LibreMap /> */}
    </div>
  </>
}

const makeSmallScreenWarningUI = () => {
  return (
    <div className="d-lg-none text-center text-danger p-2 mb-4">
      <br />
      The map is made for desktop devices.
      <br />
      Please increase your screen size and ensure your browser zoom level is reasonable.
    </div>
  )
}
