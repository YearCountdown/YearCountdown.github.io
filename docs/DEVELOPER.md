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
│   ├── main.jsx     # Entry point
│   ├── App.jsx      # Root component
│   └── assets/      # Images, icons
├── docs/            # Documentation
├── vite.config.js   # Vite config
└── package.json
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md).
