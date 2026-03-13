# YearCountdown

|![YearCountdown](public/logo/logo-light-bg.svg)|<h1>YearCountdown</h1>|
|-|-|

A minimal web app for reading the current year in multiple visual forms.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

[![Watch](http://www.video-thumbnail.com/youtube/BBVOtLgd258)](https://youtu.be/BBVOtLgd258)

## Live

[yearcountdown.github.io](https://yearcountdown.github.io)

Also available on Vercel:
- [theyearcountdown.vercel.app](https://theyearcountdown.vercel.app/)

Deploy targets:
- GitHub Pages
- Vercel

## Features

- Homepage with animated hero and case-study style sections
- Five view routes:
  - `/view/countdown`
  - `/view/dots`
  - `/view/pie`
  - `/view/progress`
  - `/view/all`
- Samples browser:
  - `/samples`
- Per-view settings with shareable embed URLs
- Direct PageShot wallpaper URLs for Shortcuts and lock-screen automation
- Optional timezone override for shared views and wallpapers
- Theme-aware homepage and embed-friendly views
- GitHub Pages and Vercel deployment support

## Quick Start

```bash
npm install
npm run dev
```

## Documentation

See [docs/README.md](./docs/README.md) for full documentation.

## Timezone Override

Views can optionally pin their clock to a UTC offset by setting `timezone` in the query string or gear panel.

Example:

```text
/view/countdown?timezone=UTC+4
```

- Accepted format: `UTC±H` with optional minutes such as `UTC+5:30`
- Leave it blank to keep the runtime's local/system time
- Invalid values fall back to `UTC+0`

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE) © YearCountdown
