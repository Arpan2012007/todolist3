import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(//It activates extra checks and warnings for its descendants (such as identifying unsafe lifecycles or deprecated APIs) to help catch potential bugs early//
  <React.StrictMode>
    <App />//Renders your main application component
  </React.StrictMode>
);
