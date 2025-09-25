import 'dotenv/config';
import pino from 'pino';
import { postRandomActivity } from '../src/postActivity.js';
import { config } from '../src/config.js';

export default async function handler(req, res) {
  const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
  try {
    // random gate: only post when within desired min/max windows to reduce noise if scheduled often
    const minMs = config.activityMinMinutes * 60_000;
    const maxMs = config.activityMaxMinutes * 60_000;
    const shouldPost = Math.random() < (minMs / ((minMs + maxMs) / 2));
    if (shouldPost) {
      await postRandomActivity(logger);
    } else {
      logger.info('run-activity skipped by random gate');
    }
    res.status(200).json({ ok: true, posted: shouldPost });
  } catch (err) {
    logger.error({ err }, 'run-activity failed');
    res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}

