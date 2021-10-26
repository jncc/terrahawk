
import React, { useState } from 'react'

export let Toggle = (props: { checked: boolean }) => {

    // let [checked, setChecked] = useState(checked)
    return (
        <label className="cursor-pointer relative flex justify-between items-center group p-2">
          Choropleth
          <input type="checkbox" className="cursor-pointer absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
          <span className="cursor-pointer w-8 h-5 flex items-center flex-shrink-0 ml-2 p-0.5 bg-gray-300 rounded-full duration-100 ease-in-out peer-checked:bg-green-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-100 peer-checked:after:translate-x-3"></span>
        </label>        
    )
}
