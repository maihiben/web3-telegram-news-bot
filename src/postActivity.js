import TelegramBot from 'node-telegram-bot-api';
import { config } from './config.js';
import { generateRandomActivity } from './activityGenerator.js';

let botInstance = null;

function getBot() {
  if (!botInstance) {
    botInstance = new TelegramBot(config.botToken, { polling: false });
  }
  return botInstance;
}

export async function postRandomActivity(logger) {
  const bot = getBot();
  const { text, imageUrl } = generateRandomActivity();
  try {
    if (imageUrl) {
      await bot.sendPhoto(config.chatId, imageUrl, { caption: text });
    } else {
      await bot.sendMessage(config.chatId, text);
    }
  } catch (err) {
    logger.error({ err }, 'Failed to post activity');
  }
}

