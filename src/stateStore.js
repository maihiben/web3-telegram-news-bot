import { Redis } from '@upstash/redis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const stateFile = path.join(__dirname, '..', 'data', 'state.json');

let redis = null;
function getRedis() {
  if (process.env.REDIS_URL && process.env.REDIS_TOKEN) {
    if (!redis) {
      redis = new Redis({ url: process.env.REDIS_URL, token: process.env.REDIS_TOKEN });
    }
    return redis;
  }
  return null;
}

async function ensureFile() {
  try {
    await fs.mkdir(path.dirname(stateFile), { recursive: true });
    await fs.access(stateFile);
  } catch {
    await fs.writeFile(stateFile, JSON.stringify({ seen: {} }, null, 2), 'utf8');
  }
}

export async function getSeen(feedUrl) {
  const r = getRedis();
  if (r) {
    const data = await r.hget('seen', feedUrl);
    return data || {};
  }
  await ensureFile();
  const raw = await fs.readFile(stateFile, 'utf8');
  const json = JSON.parse(raw || '{"seen":{}}');
  return json.seen[feedUrl] || {};
}

export async function setSeen(feedUrl, seenMap) {
  const r = getRedis();
  if (r) {
    await r.hset('seen', { [feedUrl]: seenMap });
    return;
  }
  await ensureFile();
  const raw = await fs.readFile(stateFile, 'utf8');
  const json = JSON.parse(raw || '{"seen":{}}');
  json.seen = json.seen || {};
  json.seen[feedUrl] = seenMap;
  await fs.writeFile(stateFile, JSON.stringify(json, null, 2), 'utf8');
}

