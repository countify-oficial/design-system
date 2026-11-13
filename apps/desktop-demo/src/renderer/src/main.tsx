import "@countify-oficial/tokens/fonts.css";
import "@countify-oficial/tokens/tokens.css";
import "@countify-oficial/core/styles.css";
import "@countify-oficial/charts/styles.css";
import "@countify-oficial/dates/styles.css";
import "@countify-oficial/modals/styles.css";
import "@countify-oficial/notifications/styles.css";
import "@countify-oficial/spotlight/styles.css";
import "./app.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const raiz = document.getElementById("root");
if (raiz) {
  createRoot(raiz).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
