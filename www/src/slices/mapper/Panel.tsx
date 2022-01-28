
import React from 'react'

/// Floating map control panel.
export let Panel = (props: {extraClasses: string, children: React.ReactNode}) => {

  return (
    <div className={`z-abovemap animate-delayedfadein bg-white rounded-xl shadow-xl overflow-hidden ${props.extraClasses}`}>
      {props.children}
    </div>
  )
}
