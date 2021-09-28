import React from "react";
import ReactDOM from "react-dom";
import "../styles.css";
import {App} from "./App";
// import { store } from "./app/store";
// import { Provider } from "react-redux";

console.log('hi')

ReactDOM.render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
      <App />
    {/* </Provider> */}
  </React.StrictMode>,
  document.getElementById("root")
);
