import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "@/store/store.js";
import { Provider } from "react-redux";
import { initializeTheme } from "@/config/app.config.js";
import { ThemeProvider } from "@/contexts/ThemeContext.jsx";

// Pre-apply class-based theme to prevent flash of wrong theme
(function applyInitialThemeClass() {
  try {
    const savedUiTheme = localStorage.getItem("theme") || "Whitestone";
    document.documentElement.classList.remove("dark", "whitestone");
    document.body.classList.remove("dark-mode", "whitestone-mode");
    if (savedUiTheme === "BlackGold") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-mode");
    } else if (savedUiTheme === "Whitestone") {
      document.documentElement.classList.add("whitestone");
      document.body.classList.add("whitestone-mode");
    }
  } catch (_) {}
})();

// Initialize CSS-variable theme before rendering
initializeTheme();

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
);





