import TelegramBot from 'node-telegram-bot-api';
import Parser from 'rss-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { feeds } from './web3Feeds.js';
import { getSeen, setSeen } from './stateStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let bot = null;
let parser = null;

export async function initBot(logger) {
  if (!config.botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN is not set');
  }
  if (!config.chatId) {
    throw new Error('TELEGRAM_CHAT_ID is not set');
  }
  bot = new TelegramBot(config.botToken, { polling: false });
  parser = new Parser({ timeout: 15000 });
  logger.info('Telegram bot initialized');
}

function articleKey(item) {
  return item.guid || `${item.link}|${item.pubDate || ''}`;
}

function formatMessage(item, feedTitle) {
  const title = item.title?.trim() || 'Untitled';
  const link = item.link || '';
  const source = feedTitle ? `\nSource: ${feedTitle}` : '';
  return `${title}\n${link}${source}`.trim();
}

async function sendWithRateLimit(messages, logger) {
  for (const message of messages) {
    try {
      await bot.sendMessage(config.chatId, message, { disable_web_page_preview: false });
    } catch (err) {
      // Handle Telegram 429 rate limit by waiting the suggested retry_after
      const retryAfter = err?.response?.body?.parameters?.retry_after;
      if (retryAfter) {
        const waitMs = (parseInt(retryAfter, 10) || 1) * 1000;
        logger.warn({ waitMs }, 'Rate limited. Waiting before retrying message');
        await new Promise((r) => setTimeout(r, waitMs));
        try {
          await bot.sendMessage(config.chatId, message, { disable_web_page_preview: false });
        } catch (e2) {
          logger.error({ err: e2 }, 'Failed to send message after rate-limit wait');
        }
      } else {
        logger.error({ err }, 'Failed to send message');
      }
    }
    await new Promise((r) => setTimeout(r, config.sendMinDelayMs));
  }
}

export async function fetchAndPostAllFeeds(logger) {
  if (!bot || !parser) {
    throw new Error('Bot not initialized. Call initBot first.');
  }

  let messagesToSend = [];

  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const feedTitle = feed.title || new URL(feedUrl).hostname;
      const seenForFeed = await getSeen(feedUrl);

      // Sort newest first by pubDate if present
      const items = (feed.items || []).slice().sort((a, b) => {
        const ad = new Date(a.isoDate || a.pubDate || 0).getTime();
        const bd = new Date(b.isoDate || b.pubDate || 0).getTime();
        return ad - bd; // oldest -> newest, we will push in order so newest send last
      });

      for (const item of items) {
        const key = articleKey(item);
        if (!key) continue;
        if (seenForFeed[key]) continue;

        seenForFeed[key] = Date.now();
        const msg = formatMessage(item, feedTitle);
        messagesToSend.push(msg);
      }

      await setSeen(feedUrl, seenForFeed);
    } catch (err) {
      logger.warn({ err, feedUrl }, 'Failed to fetch/parse feed');
      continue;
    }
  }

  // Cap how many news items we send per run
  if (messagesToSend.length > config.newsMaxPerRun) {
    messagesToSend = messagesToSend.slice(-config.newsMaxPerRun);
  }

  if (messagesToSend.length === 0) {
    logger.info('No new articles to send');
    return;
  }

  logger.info({ count: messagesToSend.length }, 'Sending new articles');
  await sendWithRateLimit(messagesToSend, logger);
}

