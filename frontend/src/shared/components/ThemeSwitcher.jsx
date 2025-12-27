import React, { useState, useEffect } from "react";
import { THEMES, getActiveTheme, setActiveTheme } from "@/config/app.config.js";

/**
 * Theme Switcher Component
 *
 * Allows users to switch between different app themes.
 * Can be placed in settings, header, or any other location.
 */
const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState(getActiveTheme().name);

  const handleThemeChange = (themeName) => {
    const themeKey = Object.keys(THEMES).find(
      (key) => THEMES[key].name === themeName
    );

    if (themeKey && setActiveTheme(themeKey)) {
      setCurrentTheme(themeName);
      // Force re-render to apply theme
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Theme</label>
      <select
        value={currentTheme}
        onChange={(e) => handleThemeChange(e.target.value)}
        className="px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {Object.entries(THEMES).map(([key, theme]) => (
          <option key={key} value={theme.name}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSwitcher;

/**
 * Theme Preview Component
 * Shows a preview of all available themes with color swatches
 */
export const ThemePreview = () => {
  const [selectedTheme, setSelectedTheme] = useState(
    Object.keys(THEMES).find(
      (key) => THEMES[key].name === getActiveTheme().name
    )
  );

  const handleThemeSelect = (themeKey) => {
    setSelectedTheme(themeKey);
    setActiveTheme(themeKey);
    window.location.reload();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(THEMES).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => handleThemeSelect(key)}
          className={`p-4 border-2 rounded-lg transition-all hover:scale-105 ${
            selectedTheme === key ? "border-primary shadow-lg" : "border-border"
          }`}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{theme.name}</h3>
              {selectedTheme === key && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                  Active
                </span>
              )}
            </div>

            {/* Color Palette Preview */}
            <div className="grid grid-cols-5 gap-2">
              {/* Primary */}
              <div
                className="h-12 rounded"
                style={{ background: `hsl(${theme.colors.primary})` }}
                title="Primary"
              />
              {/* Accent */}
              <div
                className="h-12 rounded"
                style={{ background: `hsl(${theme.colors.accent})` }}
                title="Accent"
              />
              {/* Secondary */}
              <div
                className="h-12 rounded"
                style={{ background: `hsl(${theme.colors.secondary})` }}
                title="Secondary"
              />
              {/* Destructive */}
              <div
                className="h-12 rounded"
                style={{ background: `hsl(${theme.colors.destructive})` }}
                title="Destructive"
              />
              {/* Muted */}
              <div
                className="h-12 rounded"
                style={{ background: `hsl(${theme.colors.muted})` }}
                title="Muted"
              />
            </div>

            {/* Background Preview */}
            <div
              className="h-20 rounded flex items-center justify-center text-sm"
              style={{
                background:
                  theme.gradients?.background ||
                  `hsl(${theme.colors.background})`,
                color: `hsl(${theme.colors.foreground})`,
              }}
            >
              Background Preview
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
















