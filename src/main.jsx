import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import App from "./App";

// Styles — order matters: theme tokens → global reset → mobile layout
import "./styles/theme.css";
import "./styles/globals.css";
import "./styles/mobile.css";
import "./framer/framer.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  </StrictMode>
);

