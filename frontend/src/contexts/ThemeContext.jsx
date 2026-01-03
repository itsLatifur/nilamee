import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Available themes
export const THEMES = {
  ROYAL_BURGUNDY: "RoyalBurgundy",
  BLACK_GOLD: "BlackGold",
  WHITESTONE: "Whitestone",
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || THEMES.ROYAL_BURGUNDY;
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove("dark", "whitestone");
    document.body.classList.remove("dark-mode", "whitestone-mode");

    if (currentTheme === THEMES.BLACK_GOLD) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-mode");
    } else if (currentTheme === THEMES.WHITESTONE) {
      document.documentElement.classList.add("whitestone");
      document.body.classList.add("whitestone-mode");
    }

    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const setTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  const isDarkMode = currentTheme === THEMES.BLACK_GOLD;

  return (
    <ThemeContext.Provider
      value={{ currentTheme, setTheme, isDarkMode, THEMES }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
