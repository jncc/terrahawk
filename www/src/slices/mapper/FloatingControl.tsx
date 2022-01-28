
import React from 'react'

export let FloatingControl = (props: {extraClasses: string, children: React.ReactNode}) => {

  // <div className="z-abovemap absolute top-6 left-6 w-96 animate-delayedfadein ">
  // <div className="bg-white rounded-xl overflow-hidden shadow-xl p-4 ">

  // <div className="z-abovemap absolute bottom-4 left-6 animate-delayedfadein">
  // <div className="bg-white rounded-xl overflow-hidden shadow-md pl-4 pr-6 py-2 my-2" >

  let classes = `z-abovemap absolute top-6 left-6 w-96 animate-delayedfadein bg-white rounded-xl overflow-hidden shadow-xl ${props.extraClasses}`
  return (
    <div className={classes}>
      {props.children}
    </div>
  )
}
