Telegram Web3 News Bot

A free Node.js bot that posts web3/crypto news from RSS feeds to your Telegram channel.

Setup

1) Create a Telegram Bot
- Talk to @BotFather, run /newbot, copy the token.
- Add your bot as channel admin with post permission.

2) Get your Channel Chat ID
- Forward a channel message to @JsonDumpBot and copy chat.id, or use @yourchannelusername.

3) Configure and Run
```bash
cp .env.example .env
npm install
npm start
```

4) Customize Feeds
- Edit src/web3Feeds.js to add/remove sources.

Notes
- For local dev, dedupe uses `data/state.json`. For Vercel, Redis (Upstash) is used.
- Use any host for 24/7. For Vercel deploy, see below.

Activity Messages (optional)
- Enable by setting `ACTIVITY_ENABLED=true` in `.env`
- Control frequency via `ACTIVITY_EVERY_MINUTES` (default 15)
- Provide comma-separated image URLs in `ACTIVITY_IMAGE_URLS`

Deploy to Vercel + Upstash (serverless)

1) Create Upstash Redis
- Get `REDIS_URL` and `REDIS_TOKEN` from Upstash dashboard (free tier works).

2) Vercel Project
- Import this repo in the Vercel dashboard.
- Add Environment Variables:
  - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
  - `REDIS_URL`, `REDIS_TOKEN`
  - Optional: `NEWS_MAX_PER_RUN`, `SEND_MIN_DELAY_MS`, `ACTIVITY_*`, `FEED_JITTER_SECONDS`

3) Cron Schedules
- `vercel.json` includes:
  - `*/10 * * * *` → `api/run-feeds`
  - `*/1 * * * *` → `api/run-activity` (internally gates to randomize)

4) Test
- Open the deployed URLs:
  - `/api/run-feeds` to trigger a manual news run
  - `/api/run-activity` to trigger an activity attempt

Local development
- `npm run dev` to watch and run locally (uses file store if Redis not set)
