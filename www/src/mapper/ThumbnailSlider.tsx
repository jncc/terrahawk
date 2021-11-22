
import React, { Component, useState } from 'react'
// import 'react-responsive-carousel/lib/styles/carousel.min.css'
// import { Carousel } from 'react-responsive-carousel'
// import 'pure-react-carousel/dist/react-carousel.es.css';
// import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel'
// import AliceCarousel from 'react-alice-carousel'
// import 'react-alice-carousel/lib/alice-carousel.css'
// import Carousel from '@brainhubeu/react-carousel'
// import '@brainhubeu/react-carousel/lib/style.css'
// import ItemsCarousel from 'react-items-carousel'
import Whirligig from 'react-whirligig'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { Thumbnail } from './Thumbnail'

export let ThumbnailSlider = (props: {frames: string[]}) => {

  let {selectedPolygonStats, selectedFrame} = useStateSelector(s => s.mapper)
  
  if (!props.frames || !selectedPolygonStats || !selectedFrame)
    return null

  let indexOfSelectedFrame = props.frames.indexOf(selectedFrame)

  // let whirligig: any

  return (
    <div>
      <Whirligig
        // ref={(_whirligigInstance: any) => { whirligig = _whirligigInstance}}
        startAt={indexOfSelectedFrame - 2}
        slideTo={indexOfSelectedFrame - 2}
        gutter="0.5em"
      >
        {getItems(props.frames)}
      </Whirligig>
    </div>
  )

}

let getItems = (frames: string[]) => {
  return frames.map(f => <Thumbnail key={f} frame={f} load={true} />)
}
