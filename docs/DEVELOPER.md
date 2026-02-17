# Developer Reference

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
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
| `npm run dev` | Start dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable UI (e.g., SampleHeading.jsx)
│   ├── pages/       # Route components (Home.jsx, NotFound.jsx)
│   ├── assets/      # Images, icons
│   ├── main.jsx     # Entry point & Routing
│   └── index.css    # Tailwind v4 entry & Theme
├── docs/            # Documentation
├── vite.config.js   # Vite config (Tailwind plugin enabled)
└── package.json     # Deps: GSAP, React Router, Tailwind v4

```

## Tech Stack

* **Styling:** Tailwind CSS v4 (Vite-native)
* **Animation:** GSAP with `@gsap/react`
* **Routing:** React Router v6

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md).
