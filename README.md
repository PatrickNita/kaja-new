# KAJA Product Site

React + Node product presentation website with a black background, fixed top menu, elastic custom cursor and six controlled scroll segments.

## Requirements

- Node.js 18+
- npm

## Install

```bash
npm run install:all
```

Or manually:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

## Development

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5050

## Production build

```bash
npm run build
npm start
```

The Express server serves the built React app from `client/dist`.

## Project structure

```text
kaja-product-site/
├─ client/          React + Vite app
│  └─ src/assets/   KAJA logo
├─ server/          Node + Express API/static server
├─ package.json     root scripts
├─ README.md
└─ .gitignore
```

## Notes

- Scroll is intentionally controlled. The browser does not free-scroll between sections.
- Mouse wheel progress scrubs each segment animation forward/backward.
- Once a segment animation reaches the end, the next segment becomes active.
- The custom cursor is hidden automatically on smaller screens.
