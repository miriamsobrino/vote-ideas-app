import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { IdeasProvider } from "./context/IdeasContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IdeasProvider>
      <App />
    </IdeasProvider>
  </StrictMode>
);
