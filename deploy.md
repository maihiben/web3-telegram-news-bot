Vercel + Upstash Deployment Steps

1) Prepare the repo
- Push this project to GitHub/GitLab/Bitbucket.

2) Create Upstash Redis (free tier)
- Go to upstash.com → Redis → Create database.
- Copy credentials: REDIS_URL and REDIS_TOKEN.

3) Create Vercel project
- vercel.com → New Project → Import your repo.
- Root directory: project root (where `package.json` lives).

4) Configure Environment Variables (Project → Settings → Environment Variables)
- TELEGRAM_BOT_TOKEN = your @BotFather token
- TELEGRAM_CHAT_ID = your channel id or @handle
- REDIS_URL = from Upstash
- REDIS_TOKEN = from Upstash
- Optional tuning:
  - ACTIVITY_ENABLED=true
  - ACTIVITY_MIN_MINUTES=1
  - ACTIVITY_MAX_MINUTES=3
  - ACTIVITY_IMAGE_URLS=https://your-image-1.png,https://your-image-2.png
  - NEWS_MAX_PER_RUN=10
  - SEND_MIN_DELAY_MS=1200
  - FEED_JITTER_SECONDS=20

5) Cron schedules (already included)
- `vercel.json` defines:
  - /api/run-feeds → every 10 minutes
  - /api/run-activity → every 1 minute (endpoint self-randomizes)
- To change frequency, edit `vercel.json` in the repo and redeploy.

6) Deploy
- Click Deploy. Wait for build to finish.

7) Test
- Open: https://<your-app>.vercel.app/api/run-feeds → should post news
- Open: https://<your-app>.vercel.app/api/run-activity → may post an activity (random gate)

8) Notes
- On Vercel, the bot runs only during requests; cron triggers those requests.
- Dedupe state is stored in Redis, not `data/state.json`.
- Image URLs must be public HTTPS.

Troubleshooting
- 401/403 from Telegram: check TELEGRAM_BOT_TOKEN, channel admin permissions, and TELEGRAM_CHAT_ID.
- No posts: view Vercel Logs for /api/run-feeds and /api/run-activity; verify Redis vars.
- Too many messages: lower NEWS_MAX_PER_RUN or reduce cron frequency in `vercel.json`.


Upload to GitHub without git (web UI)

1) Create an empty repo
- Go to github.com → New → Repository → name it (e.g., telegram-web3-news-bot) → Create repository.

2) Open the upload page
- In the new repo, click “uploading an existing file”.

3) Drag & drop the project
- In File Explorer, open your project folder `telegram_bot`.
- Select all files and folders except:
  - `node_modules/` (skip)
  - `.env` (skip secrets)
- Drag them onto the GitHub upload page. Wait for files to finish listing.

4) Commit
- Add a commit message (e.g., “Initial upload”).
- Click “Commit changes”.

5) .gitignore (optional but recommended)
- If `node_modules/` was uploaded accidentally, delete it in the repo.
- Add a `.gitignore` with:
  - `node_modules/`
  - `.env`
  - `data/state.json`

Alternative: GitHub Desktop (no CLI)
- Install GitHub Desktop → File → Add Local Repository → Choose your folder → Publish repository.
