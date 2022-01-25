import "./index.css";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { FocusItemContextProvider } from "./contexts/focus-item-context";

ReactDOM.render(
  <React.StrictMode>
    <FocusItemContextProvider>
      <App />
    </FocusItemContextProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
