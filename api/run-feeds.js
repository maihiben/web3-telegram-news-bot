import 'dotenv/config';
import pino from 'pino';
import { initBot, fetchAndPostAllFeeds } from '../src/telegramBot.js';

export default async function handler(req, res) {
  const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
  try {
    await initBot(logger);
    await fetchAndPostAllFeeds(logger);
    res.status(200).json({ ok: true });
  } catch (err) {
    logger.error({ err }, 'run-feeds failed');
    res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}

