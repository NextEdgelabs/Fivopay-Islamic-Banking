# Troubleshooting Guide

## Issue: Login Page Not Loading (500 Error)

### Problem Description
The application was failing to load with a 500 error. The login page and all other pages were not displaying.

### Root Cause
**Tailwind CSS v4 Configuration Issue**

The project had Tailwind CSS v4.1.14 installed, which introduced breaking changes:
1. Tailwind CSS v4 moved the PostCSS plugin to a separate package `@tailwindcss/postcss`
2. The theme configuration syntax changed from `tailwind.config.ts` to CSS-based configuration using `@theme` directive
3. The `@tailwind` directives changed to `@import "tailwindcss"`

### Error Messages
```
Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. 
The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS 
with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
```

```
Error: Cannot apply unknown utility class `border-border`. Are you using CSS modules 
or similar and missing `@reference`?
```

### Solution

#### Step 1: Install @tailwindcss/postcss
```bash
npm install -D @tailwindcss/postcss
```

#### Step 2: Update postcss.config.mjs
**Before:**
```javascript
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**After:**
```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

#### Step 3: Update app/globals.css

**Before (v3 syntax):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
}
```

**After (v4 syntax):**
```css
@import "tailwindcss";

@theme {
  --color-primary-500: #635BFF;
  --color-border-light: #E3E8EF;
  /* ... other CSS variables */
}

* {
  border-color: var(--color-border-light);
}
```

#### Step 4: Migrate from @apply to Regular CSS

Tailwind CSS v4 recommends using CSS variables instead of `@apply` with custom colors. We updated all utility classes to use regular CSS with CSS variables.

**Before:**
```css
.card {
  @apply bg-white rounded-stripe border border-border-light shadow-sm;
}
```

**After:**
```css
.card {
  background-color: white;
  border-radius: var(--radius-stripe);
  border: 1px solid var(--color-border-light);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

### Key Changes Summary

1. ✅ Installed `@tailwindcss/postcss` package
2. ✅ Updated `postcss.config.mjs` to use `@tailwindcss/postcss`
3. ✅ Changed `@tailwind` directives to `@import "tailwindcss"`
4. ✅ Migrated theme configuration from `tailwind.config.ts` to CSS using `@theme` directive
5. ✅ Replaced `@apply` with regular CSS and CSS variables
6. ✅ Updated all custom color references to use CSS variables

### Result
✅ **Application is now running successfully on http://localhost:3001**
✅ **No compilation errors**
✅ **Login page loads correctly**
✅ **All pages accessible**

---

## Configuration Files After Fix

### postcss.config.mjs
```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

### package.json (relevant dependencies)
```json
{
  "devDependencies": {
    "@tailwindcss/forms": "^0.5.10",
    "@tailwindcss/postcss": "^4.1.0",
    "tailwindcss": "^4.1.14",
    "postcss": "^8.5.6"
  }
}
```

---

## Testing

### 1. Start Development Server
```bash
npm run dev
```

Expected output:
```
✓ Starting...
✓ Ready in ~1200ms
```

### 2. Access Pages
- Home: http://localhost:3001
- Login: http://localhost:3001/login
- Dashboard: http://localhost:3001/dashboard
- Customers: http://localhost:3001/customers

### 3. Test Login
1. Go to http://localhost:3001/login
2. Enter credentials:
   - Email: `admin@fivopay.com`
   - Password: `admin123`
3. Click "Sign In"
4. Should redirect to dashboard

---

## Common Issues

### Port Already in Use
If you see:
```
⚠ Port 3000 is in use, using available port 3001 instead.
```

**Solution:** Kill the process using port 3000 or use the alternate port (3001).

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Or use the alternate port that Next.js provides
```

### ESLint CSS Warnings
Warnings like `Unknown at rule @theme` are just linter warnings and don't affect functionality. They can be safely ignored or you can update your ESLint configuration.

---

## Migration Notes for Tailwind CSS v4

### What Changed
1. **PostCSS Plugin**: Moved to separate package
2. **Import Syntax**: `@import "tailwindcss"` instead of `@tailwind` directives
3. **Theme Configuration**: Use `@theme` in CSS instead of `tailwind.config.ts`
4. **CSS Variables**: Recommended over `@apply` for custom values
5. **No More JIT**: Built-in by default

### Benefits of v4
- ⚡ **Faster builds** - Significantly improved performance
- 🎨 **CSS-based configuration** - More flexible and powerful
- 📦 **Smaller bundle size** - Optimized output
- 🔧 **Better tooling** - Improved DX

### Documentation
- Tailwind CSS v4 Docs: https://tailwindcss.com/docs
- Migration Guide: https://tailwindcss.com/docs/upgrade-guide
- PostCSS Plugin: https://github.com/tailwindlabs/tailwindcss-postcss

---

## Additional Notes

### tailwind.config.ts
The `tailwind.config.ts` file is still present but **not actively used** by Tailwind CSS v4. The configuration is now in `app/globals.css` using the `@theme` directive.

You can keep the file for reference or remove it. The CSS variables in `globals.css` now control the theme.

### Component Compatibility
All existing components remain compatible. The utility classes like `bg-primary-500`, `text-neutral-900`, etc., still work because they're defined in the `@theme` section of `globals.css`.

### Custom CSS Classes
Custom classes like `.card`, `.btn-base`, `.rounded-stripe`, etc., continue to work and are defined in `globals.css` using regular CSS.

---

## Status: ✅ RESOLVED

**Date Fixed**: October 15, 2025  
**Next.js Version**: 15.5.4  
**Tailwind CSS Version**: 4.1.14  
**Node Version**: Latest LTS

---

## Quick Reference

### Development Commands
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Important URLs
- Local Dev: http://localhost:3000 (or 3001 if 3000 is in use)
- Login: /login
- Dashboard: /dashboard
- Customers: /customers

### Demo Credentials
- Email: `admin@fivopay.com`
- Password: `admin123`

---

**Last Updated**: October 15, 2025  
**Status**: All systems operational ✅
