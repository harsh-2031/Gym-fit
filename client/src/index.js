import React from "react";
import ReactDOM from "react-dom/client";

// Make sure both of these imports are here and in this order
import "react-calendar/dist/Calendar.css";
import "./index.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
