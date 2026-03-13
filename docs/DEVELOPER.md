# Developer Reference

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- npm

## Setup

```bash
git clone https://github.com/YearCountdown/YearCountdown.github.io.git
cd YearCountdown.github.io
npm install
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Runtime Structure

### Shells

- Homepage shell:
  - scrollable
  - header and footer visible
  - homepage appearance is theme-only
- View shell:
  - immersive `/view/*` routes
  - no footer
  - copy-embed and settings affordances
  - `embed=true` removes shell chrome

### Main Routes

- `/`
- `/samples`
- `/view/countdown`
- `/view/dots`
- `/view/pie`
- `/view/progress`
- `/view/all`

## Settings Model

### Homepage

- homepage theme is controlled separately
- homepage branding follows homepage theme

### View Pages

- view state is stored through:
  - query params for shareable URLs
  - cookies for persistence between visits
- appearance controls are managed from the view gear
- copied embed links preserve the active view configuration
- copied wallpaper URLs preserve the active view configuration plus requested image size
- view time can be pinned with `timezone=UTC+4` or another UTC offset
- embed-specific shell flags:
  - `embed=true` removes shell chrome
  - `logo=false` hides the embed corner logo

## Deployment

### GitHub Pages

- deployment happens from pushes to `main`
- workflow file: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
- the workflow runs:
  - `npm install`
  - `npm run build`
  - deploys `dist/`
- SPA deep-link reloads are handled by:
  - [`public/404.html`](../public/404.html)
  - route restoration logic in [`index.html`](../index.html)

### Vercel

- config file: [`vercel.json`](../vercel.json)
- Vercel uses:
  - `npm run build`
  - output directory `dist`
  - SPA rewrites to `index.html` for app routes

## Project Structure

```text
.
├── docs/
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── index.css
│   └── main.jsx
├── .github/workflows/
├── vercel.json
├── vite.config.js
└── package.json
```

## Tech Stack

- React 19
- React Router 7
- Vite 7
- Tailwind CSS 4
- GSAP

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md).
