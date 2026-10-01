import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ToastProvider } from "./context/Toast";
import { applyDensity, applyTheme } from "./utils/theme";
import { getSettings } from "./hooks/useSettings";
import "./styles/global.css";

applyTheme();
applyDensity(getSettings().appearance.density);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
