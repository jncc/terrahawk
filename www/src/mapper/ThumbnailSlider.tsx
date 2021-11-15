import { stat } from 'fs'
import React, { Component } from 'react'
// import 'react-responsive-carousel/lib/styles/carousel.min.css'
// import { Carousel } from 'react-responsive-carousel'

// import 'pure-react-carousel/dist/react-carousel.es.css';
// import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel'
// import AliceCarousel from 'react-alice-carousel'
// import 'react-alice-carousel/lib/alice-carousel.css'

import Carousel from '@brainhubeu/react-carousel'
import '@brainhubeu/react-carousel/lib/style.css'

import jnccLogoUrl from '../assets/JNCCLogo_Black-340.png'
import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { getFramesFromFrameField } from './helpers/frameHelpers'

export let ThumbnailSlider = (props: {frames: string[]}) => {

  let dispatch = useStateDispatcher()
  let {selectedPolygonStats, selectedFrame} = useStateSelector(s => s.mapper)
  let [selected, setSelected] = React.useState(0)

  if (!props.frames || !selectedPolygonStats || !selectedFrame)
    return null

  // let frames = selectedPolygonStats.flatMap(d => getFramesFromFrameField(d.frame))

  console.log('total frames' + props.frames.length)
  console.log('ix of sel frame ' + props.frames.indexOf(selectedFrame))

  let frameCount = props.frames.length
  let indexOfSelectedFrame = props.frames.indexOf(selectedFrame)

  return (

    <div className="">
      <div>frameCount {frameCount}</div>
      <div>indexOfSelectedFrame {indexOfSelectedFrame}</div>

      <Carousel
        itemWidth={144}
        // offset={10} // gap
        value={indexOfSelectedFrame}
        // onChange={(value) => {valu}}
      >
        {getItems(props.frames, indexOfSelectedFrame)}
      </Carousel>
    </div>
)
}

let getItems = (frames: string[], indexOfSelectedFrame: number) => {
  return frames.map((f, i) => {
    return (
        <div key={f} className="w-36 border-2 border-gray-300 p-2 rounded-xl overflow-hidden">
          {indexOfSelectedFrame == i && <div>SELECTED</div>}
          {f}
        </div>
    )
  })
}

// let getPureItems = (frames: string[]) => {
//   return frames.map((f, i) => {
//     return (
//         <Slide key={f}  index={i}  className="w-36">{f.substr(0, 15)}</Slide>
//     )
//   })
// }

    // <AliceCarousel mouseTracking items={getItems(frames)} autoWidth />

    // <CarouselProvider
    //     naturalSlideWidth={100}
    //     naturalSlideHeight={10}
    //     totalSlides={3}
    //   >

    //     <Slider>
    //       {getPureItems(props.frames)}
    //     </Slider>

    //     <ButtonBack>Back</ButtonBack>
    //     <ButtonNext>Next</ButtonNext>        

    // </CarouselProvider>