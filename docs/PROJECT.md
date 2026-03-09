# Project Information

## Overview

**YearCountdown** is a small React application that turns the current year into a few focused visual readings instead of one generic progress bar.

Live deployments:
- [yearcountdown.github.io](https://yearcountdown.github.io)
- [theyearcountdown.vercel.app](https://theyearcountdown.vercel.app/)

## Routes

### Homepage

- `/`
- Editorial landing page with:
  - animated hero
  - live countdown preview
  - sections explaining the four main readings of the year
  - lock-screen / wallpaper guidance

### Views

- `/view/countdown`
- `/view/dots`
- `/view/pie`
- `/view/progress`
- `/view/all`

Each view is designed as a focused full-screen reading. Normal view routes keep the site header. `embed=true` hides shell chrome and uses the view as a standalone embed.

Examples:

- `/view/dots`
- `/view/dots?embed=true`
- `/view/pie?embed=true`
- `/view/dots?embed=true&logo=false`

## Main Features

- Five dedicated year views:
  - Countdown
  - Dots
  - Pie
  - Progress
  - All
- Shareable embed links from every view
- Direct PageShot wallpaper URLs from every view
- Per-view settings persisted in cookies
- Homepage theme controls
- View-specific appearance and display controls
- GitHub Pages and Vercel deployment support

## Appearance Model

### Homepage

- Homepage uses site theme only: `light` or `dark`
- Homepage header, footer, and loader follow the homepage theme

### View Pages

- Views support appearance settings in the gear panel
- View appearance is query-driven for sharing and embed links
- View settings are also persisted locally via cookies
- When a view is opened, the site theme follows that view unless an explicit `theme` query param is present

## View Notes

### Countdown

- Live countdown to the next January 1
- Responsive multi-unit layout
- Settings include display mode, frame, and labels

### Dots

- One dot per day of the current year
- Completed days and remaining days are visually separated
- Settings include shape, spacing, inset, outer spacing, and inactive opacity

### Pie

- Circular or rectangular reading of year progress
- Filled and outline modes
- Full-screen and centered variants

### Progress

- Full-field or line-based linear reading
- Full-screen mode by default
- Adjustable decimals, line width, and layout spacing

## Embed Behavior

- `embed=true` hides header and settings gear
- Embed links preserve current view settings
- The embed icon remains visible with a small glass badge for contrast
- `logo=false` hides the small embed logo badge when a chrome-free preview is needed

## Wallpaper URLs

- Every view gear can copy a direct wallpaper image URL
- Wallpaper URLs are generated through PageShot from the GitHub Pages embed URL
- Wallpaper URLs preserve:
  - active view settings
  - theme
  - primary and secondary colors
  - text tone
  - requested image width and height
- Intended use:
  - iPhone Shortcuts
  - direct image fetching
  - daily wallpaper automation

## License

[MIT](../LICENSE)
