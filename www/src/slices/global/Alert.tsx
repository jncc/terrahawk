
import { ExclamationIcon } from '@heroicons/react/solid'
import React from 'react'

import { useStateSelector } from '../../state/hooks'

export let Alert = () => {

  let errorMessage = useStateSelector(s => s.global.errorMessage)

  let friendlierErrorMessage = errorMessage === 'ajax error' ? 'Network error' : errorMessage

  if (errorMessage) {
    return (
      <div className="z-abovemap absolute top-4 w-full">
        <div className="flex justify-center">
          <div className="flex gap-1 items-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white text-sm px-8 py-1 rounded-xl shadow-xl">
            <ExclamationIcon className="h-7 w-7"/>
            <div className="">
              {friendlierErrorMessage}
            </div>

          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}
