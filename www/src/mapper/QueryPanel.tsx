
import React from 'react'

import { useStateDispatcher, useStateSelector } from '../state/hooks'
import { globalActions } from '../global/slice'
import { mapperActions } from './slice'
import { Panel } from './Panel'

export let QueryPanel = () => {

  let dispatch = useStateDispatcher()
  let state = useStateSelector(s => s.mapper)
  let globalState = useStateSelector(s => s.global)

  return (
    <div className="z-abovemap absolute top-6 left-6 w-80 animate-delayedfadein ">

      <div className="bg-white rounded-xl overflow-hidden shadow-xl p-5">

        <h1 className="text-2xl font-semibold text-gray-900">Welcome back!</h1>
        {/* <form className="mt-12" action="" method="POST">
          <div className="relative">
            <input id="email" name="email" type="text" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-jncc" placeholder="john@doe.com" />
            <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email address</label>
          </div>
          <div className="mt-10 relative">
            <input id="password" type="password" name="password" className="peer h-10 w-full border-b-2 border-light text-gray-900 placeholder-transparent focus:outline-none focus:border-jncc" placeholder="Password" />
            <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
          </div>

          <input type="sumbit" value="Sign in" className="mt-20 px-4 py-2 rounded bg-jncc hover:bg-gray-200 text-white font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-urgent focus:ring-opacity-80 cursor-pointer" />
        </form>
        <a href="#" className="mt-4 block text-sm text-center font-medium text-jncc hover:underline focus:outline-none focus:ring-2 focus:ring-urgent"> Forgot your password? </a> */}

      </div>

    </div>
  )
}

        {/* <button onClick={() => dispatch(mapperActions.mapCenterChanged())}>
          fetchPolygons
        </button>
        <br />
        <button onClick={() => dispatch(globalActions.ping())}>
          PING
        </button>
        <br />
        <div>
          Loading? {globalState.loading}
        </div>
        <div>
          Error: {globalState.errorMessage}
        </div>
        <button onClick={() => dispatch(mapperActions.mapZoomChanged(13))} aria-label="Zoom in">
          Zoom to 13
        </button>
        <br />
        {state.polygons.map(p => <div key={p.polyid}>{p.polyid}</div>)} */}
