
import React, { useState } from 'react'

export let Toggle = (props: { label: string, position: 'left'|'right', checked: boolean, onChange: () => void }) => {

  // let [checked, setChecked] = useState(checked)
  {/* https://medium.com/front-end-weekly/build-a-css-only-toggle-switch-using-tailwindcss-d2739882934         */ }

  let margin = props.position === 'left' ? 'ml-2' : 'mr-2'
  let hover  = props.checked ? 'peer-hover:bg-gray-500' : 'peer-hover:bg-gray-300'

  return (
    <label className="cursor-pointer text-sm relative flex justify-between items-center group p-2">
      {props.position === 'left' && props.label}
      <input
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
        className="custom-ring cursor-pointer absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
      <span className={`cursor-pointer w-8 h-5 flex items-center flex-shrink-0 ${margin} p-0.5 bg-gray-200 ${hover} rounded-full duration-100 ease-in-out peer-checked:bg-gray-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-100 peer-checked:after:translate-x-3`}></span>
      {props.position === 'right' && props.label}
    </label>

  )
}
