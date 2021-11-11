import React, { Component } from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import jnccLogoUrl from '../assets/JNCCLogo_Black-340.png'
import { useStateDispatcher, useStateSelector } from '../state/hooks'

export let ThumbnailSlider = (props: {frames: string[]}) => {

  let dispatch = useStateDispatcher()
  let selectedDate = useStateSelector(s => s.mapper.selectedDate)

  let [selected, setSelected] = React.useState(0)

  return (
    <Carousel showThumbs={false}
    onChange={(index, item) => console.log(index)} // 0-based index
    >
      {getItems(props.frames)}
    </Carousel>
  )
}

let getItems = (frames: string[]) => {
  return frames.map(f => {
    return (
        <div className="w-5 ">{f.substr(0, 5)}</div>
    )
  })
}
