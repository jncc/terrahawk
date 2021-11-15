import React from 'react'
import ReactDOM from 'react-dom'

import '../styles.css'
import { App } from './App'
import { store } from './state/store'
import { Provider } from 'react-redux'
import { Styler } from './Styler'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      {/* <Styler /> */}
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
