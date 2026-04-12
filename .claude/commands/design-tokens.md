Review the code changes in this conversation and ensure all colors, fonts, and typography match the project's design tokens exactly. Flag any deviation and fix it.

## Font

**Family:** Inter (Google Fonts, weights 300/400/500/600/700), with fallbacks: `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Arial`, `sans-serif`.

Never introduce a different font family. The Inter import is in `styles/global.css` and `pages/_app.js`.

## Type scale (MUI theme — `styles/theme.js`)

| Variant    | Size        | Weight |
|------------|-------------|--------|
| h1         | 2rem        | 600    |
| h2         | 1.75rem     | 600    |
| h3         | 1.5rem      | 600    |
| h4         | 1.25rem     | 600    |
| h5         | 1.125rem    | 600    |
| h6         | 1rem        | 600    |
| subtitle1  | 1rem        | 500    |
| subtitle2  | 0.875rem    | 500    |
| body1      | 1rem        | 400    |
| body2      | 0.875rem    | 400    |
| caption    | 0.75rem     | 400    |
| button     | 0.875rem    | 500    |

## Color palette

| Token                      | Value     |
|----------------------------|-----------|
| primary.main               | `#094D92` |
| secondary.main             | `#1C1018` |
| error.main                 | `#D32F2F` |
| warning.main               | `#FBC02D` |
| info.main                  | `#2196F3` |
| success.main               | `#4CAF50` |
| background.default         | `#f4f6f8` |
| background.paper           | `#FFFFFF` |
| text.primary               | `#1C1018` |
| text.secondary             | `#094D92` |
| divider                    | `#E0E0E0` |
| tier.platinum              | `#E5E4E2` |
| tier.gold                  | `#FFD700` |
| tier.silver                | `#C0C0C0` |
| tier.bronze                | `#CD7F32` |

**Navbar background:** `rgba(9, 77, 146, 0.96)` (primary.main at 96% opacity)  
**Footer background:** `#0a3a6e`  
**Standard tier color (not in theme):** `#094D92` (same as primary.main)  
**Standard tier fallback in StatsCards:** `#78909C`

## Rules to enforce

1. All colors must reference MUI theme tokens (`primary.main`, `background.paper`, etc.) via `sx` prop or `theme.palette.*` — not hardcoded hex values, unless the color is a one-off decorative value (e.g. chart colors, gradient stops) that has no theme equivalent.
2. Never change the `fontFamily` or add `fontWeight`/`fontSize` values outside the type scale above.
3. Any new page or component must use `<Layout>` which applies the theme globally — do not wrap with a custom `ThemeProvider`.
