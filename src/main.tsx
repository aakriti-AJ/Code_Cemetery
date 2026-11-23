
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeProvider";
import { app, isPreviewMode } from "./lib/firebase";

import "./index.css";
import "./theme.css";
import "./features.css";
import "./r3.css";
import "./select-theme.css";
import "./owner-stars.css";

if (import.meta.env.DEV) {
  console.info(
    isPreviewMode ? "Code Cemetery Pre Alpha: read-only showcase, no real Firebase credentials." : "Firebase initialized for project:",
    app.options.projectId
  );
}

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
