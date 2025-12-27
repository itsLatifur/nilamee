import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "@/store/store.js";
import { Provider } from "react-redux";
import { initializeTheme } from "@/config/app.config.js";
import { ThemeProvider } from "@/contexts/ThemeContext.jsx";

// Initialize theme before rendering
initializeTheme();

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
);





