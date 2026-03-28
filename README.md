# 日本語 Journey — Learn Japanese

A block-based Japanese learning app built for trilingual speakers (English, Italian, Bengali). Features lessons, quizzes, and minigames with persistent progress tracking.

## Features

- **10 structured lessons** covering hiragana, particles, verbs, katakana, adjectives, て-form and more
- **6 quizzes** with score tracking and personal bests
- **3 minigames**: Block Builder, Particle Fill, Hiragana Speed Match
- **Persistent progress** saved to localStorage (XP, completed lessons, quiz scores)
- **Trilingual bridges** — leverages Bengali SOV structure and Italian pronunciation throughout

## Deploy to Vercel (fastest)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework: **Create React App** (auto-detected)
4. Click Deploy — done!

## Deploy to Netlify

1. Push to GitHub
2. Go to [netlify.com](https://app.netlify.com) → Add new site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `build`
5. Deploy!

## Run locally

```bash
npm install
npm start
```

Opens at http://localhost:3000

## Tech stack

- React 18 (Create React App)
- No external UI libraries — all custom components
- localStorage for progress persistence
- DM Sans + Noto Sans JP typography
