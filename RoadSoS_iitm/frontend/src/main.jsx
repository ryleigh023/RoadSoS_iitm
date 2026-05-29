import React from "react";
import ReactDOM from "react-dom/client";
import { Workbox } from "workbox-window";
import App from "./App";
import "./styles.css";

if ("serviceWorker" in navigator) {
  const wb = new Workbox("/sw.js");
  wb.register();
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
