import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import axios from "axios";

// Set base URL depending on environment
// if (process.env.NODE_ENV === "development") {
// axios.defaults.baseURL = "http://localhost:3001";
// axios.defaults.baseURL = "http://192.168.1.7:3001";

// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
