# Using App Configuration in Your Components

## Quick Reference

### Import App Config

```jsx
import { APP_CONFIG } from "@/config/app.config";
```

### Use in Your Component

```jsx
function MyComponent() {
  return (
    <div>
      <h1>{APP_CONFIG.name}</h1>
      <p>{APP_CONFIG.tagline}</p>
    </div>
  );
}
```

## Complete Examples

### Example 1: Header Component

```jsx
import { APP_CONFIG } from "@/config/app.config";

function Header() {
  return (
    <header className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">{APP_CONFIG.name}</h1>
        <p className="text-sm">{APP_CONFIG.tagline}</p>
      </div>
    </header>
  );
}

export default Header;
```

### Example 2: Footer Component

```jsx
import { APP_CONFIG } from "@/config/app.config";

function Footer() {
  return (
    <footer className="bg-background border-t border-border p-6">
      <div className="container mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Version {APP_CONFIG.version}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
```

### Example 3: About Page

```jsx
import { APP_CONFIG } from "@/config/app.config";

function About() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">About {APP_CONFIG.name}</h1>
      <p className="text-lg text-muted-foreground mb-6">{APP_CONFIG.tagline}</p>
      <p className="mb-4">{APP_CONFIG.description}</p>

      {/* More content */}
    </div>
  );
}

export default About;
```

### Example 4: Login Page with Theme Colors

```jsx
import { APP_CONFIG } from "@/config/app.config";

function Login() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">
          Welcome to {APP_CONFIG.name}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {APP_CONFIG.tagline}
        </p>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
```

### Example 5: Meta Tags (SEO)

```jsx
import { Helmet } from "react-helmet";
import { APP_CONFIG } from "@/config/app.config";

function HomePage() {
  return (
    <>
      <Helmet>
        <title>
          {APP_CONFIG.name} - {APP_CONFIG.tagline}
        </title>
        <meta name="description" content={APP_CONFIG.description} />
        <meta property="og:title" content={APP_CONFIG.name} />
        <meta property="og:description" content={APP_CONFIG.description} />
      </Helmet>

      <div>{/* Page content */}</div>
    </>
  );
}

export default HomePage;
```

### Example 6: Theme Switcher in Settings

```jsx
import { APP_CONFIG } from "@/config/app.config";
import ThemeSwitcher from "@/shared/components/ThemeSwitcher";

function Settings() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Appearance</h2>
        <ThemeSwitcher />
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">About</h2>
        <dl className="space-y-2">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              App Name
            </dt>
            <dd className="text-sm">{APP_CONFIG.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Version
            </dt>
            <dd className="text-sm">{APP_CONFIG.version}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Description
            </dt>
            <dd className="text-sm">{APP_CONFIG.description}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default Settings;
```

## Using Theme Colors in Tailwind

All theme colors are available as Tailwind classes:

### Text Colors

```jsx
<p className="text-foreground">Default text</p>
<p className="text-muted-foreground">Muted text</p>
<p className="text-primary">Primary colored text</p>
<p className="text-destructive">Error text</p>
```

### Background Colors

```jsx
<div className="bg-background">Page background</div>
<div className="bg-card">Card background</div>
<div className="bg-primary text-primary-foreground">Primary button</div>
<div className="bg-accent text-accent-foreground">Accent section</div>
```

### Border Colors

```jsx
<div className="border border-border">Standard border</div>
<input className="border border-input">Input border</input>
<div className="focus:ring-2 focus:ring-ring">Focus ring</div>
```

### Hover States

```jsx
<button className="bg-primary hover:bg-primary/90">Hover effect</button>
<div className="hover:border-accent">Hover border change</div>
```

## Dynamic Theme Usage

### Get Current Theme

```jsx
import { getActiveTheme } from "@/config/app.config";

function ThemeInfo() {
  const currentTheme = getActiveTheme();

  return (
    <div>
      <p>Current Theme: {currentTheme.name}</p>
      <p>Type: {currentTheme.type}</p>
    </div>
  );
}
```

### Change Theme Programmatically

```jsx
import { setActiveTheme } from "@/config/app.config";

function ThemeButton() {
  const handleThemeChange = () => {
    setActiveTheme("dark");
    window.location.reload(); // Reload to apply theme
  };

  return <button onClick={handleThemeChange}>Switch to Dark Mode</button>;
}
```

## Best Practices

### ✅ DO

- Import `APP_CONFIG` for branding information
- Use Tailwind theme classes for colors
- Keep branding consistent across all pages
- Update `app.config.js` when changing app name or colors

### ❌ DON'T

- Don't hardcode app name strings in components
- Don't use inline color styles (use Tailwind classes)
- Don't put branding in `.env` files
- Don't modify `index.css` for color changes

## Common Patterns

### Brand Logo with Text

```jsx
import { APP_CONFIG } from "@/config/app.config";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img src="/logo.png" alt={`${APP_CONFIG.name} logo`} className="h-8" />
      <span className="text-xl font-bold">{APP_CONFIG.name}</span>
    </div>
  );
}
```

### Page Title Pattern

```jsx
import { APP_CONFIG } from "@/config/app.config";
import { useEffect } from "react";

function MyPage() {
  useEffect(() => {
    document.title = `My Page - ${APP_CONFIG.name}`;
  }, []);

  return <div>{/* Page content */}</div>;
}
```

### Loading Screen

```jsx
import { APP_CONFIG } from "@/config/app.config";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading {APP_CONFIG.name}...</p>
      </div>
    </div>
  );
}
```

## Summary

- **App Branding**: Import from `@/config/app.config`
- **Theme Colors**: Use Tailwind classes (`bg-primary`, `text-foreground`, etc.)
- **Change Themes**: Use `setActiveTheme()` function
- **Single Source of Truth**: All configuration in `app.config.js`

For more details on theme customization, see [THEME_SYSTEM.md](../THEME_SYSTEM.md).
