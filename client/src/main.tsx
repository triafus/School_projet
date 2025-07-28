import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import App from "./App";
import { QueryProvider } from "./providers/QueryProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>
);
