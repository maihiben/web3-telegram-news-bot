import 'dotenv/config';
import cron from 'node-cron';
import pino from 'pino';
import { fetchAndPostAllFeeds, initBot } from './telegramBot.js';
import { config } from './config.js';
import { postRandomActivity } from './postActivity.js';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception');
});

async function main() {
  logger.info('Starting Telegram Web3 News Bot');
  await initBot(logger);

  // Run immediately at startup
  await fetchAndPostAllFeeds(logger);
  if (config.activityEnabled) {
    logger.info('Immediate activity kick-off');
    await postRandomActivity(logger);
  }

  // On Vercel we won’t run local schedulers; keep this file for local dev only

  logger.info({ everyMinutes: config.pollMinutes }, 'Scheduler started');
}

main();

