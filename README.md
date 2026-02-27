# Lyricist's Lexicon

A Khmer rhyming and consonance dictionary.

## Setup

### Prerequisites
- Node.js
- PostgreSQL

### Install dependencies

```bash
npm run install:all
```

### Database setup

Create the PostgreSQL database:

```bash
createdb lyricists_lexicon
```

### Environment variables

The server `.env` file is already configured for local development. For production (Render), set `DATABASE_URL` to your Render PostgreSQL connection string.

### Run locally

From the root:

```bash
npm run dev
```

This starts both:
- Frontend at http://localhost:5174
- Backend at http://localhost:3002

## Project structure

```
lyricists-lexicon/
├── client/         # React + Vite frontend
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── main.jsx
│       └── index.css
└── server/         # Node + Express backend
    ├── index.js
    ├── db.js
    └── .env
```
# lyricists-lexicon
