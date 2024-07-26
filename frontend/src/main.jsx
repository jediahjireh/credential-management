// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
// import App component
import App from "./App.jsx";
// import styles
import "bootstrap/dist/css/bootstrap.min.css";
// import "./styles/App.css";
import "./styles/index.css";

// create root and render App component
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
