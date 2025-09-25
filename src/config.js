export const config = {
  botToken: process.env.TELEGRAM_BOT_TOKEN,
  chatId: process.env.TELEGRAM_CHAT_ID,
  pollMinutes: Math.max(1, parseInt(process.env.POLL_INTERVAL_MINUTES || '10', 10)),
  activityEnabled: String(process.env.ACTIVITY_ENABLED || 'false').toLowerCase() === 'true',
  activityEveryMinutes: Math.max(1, parseInt(process.env.ACTIVITY_EVERY_MINUTES || '15', 10)),
  activityMinMinutes: Math.max(1, parseInt(process.env.ACTIVITY_MIN_MINUTES || '2', 10)),
  activityMaxMinutes: Math.max(1, parseInt(process.env.ACTIVITY_MAX_MINUTES || '10', 10)),
  activityImageUrls: (process.env.ACTIVITY_IMAGE_URLS || 'https://i.imgur.com/0KFBHTB.png,https://i.imgur.com/7YlZq0H.png')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  feedJitterSeconds: Math.max(0, parseInt(process.env.FEED_JITTER_SECONDS || '20', 10)),
  activityJitterSeconds: Math.max(0, parseInt(process.env.ACTIVITY_JITTER_SECONDS || '35', 10)),
  newsMaxPerRun: Math.max(1, parseInt(process.env.NEWS_MAX_PER_RUN || '10', 10)),
  sendMinDelayMs: Math.max(500, parseInt(process.env.SEND_MIN_DELAY_MS || '1200', 10))
};

