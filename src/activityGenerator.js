import { config } from './config.js';

function randomChoice(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomHex(prefix = '0x', len = 40) {
  const chars = '0123456789abcdef';
  let s = prefix;
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function shortHex(addr) {
  return addr.slice(0, 6) + '...' + addr.slice(-2);
}

const cities = [
  'Warsaw', 'Antwerp', 'Lagos', 'Berlin', 'Tokyo', 'Buenos Aires', 'Nairobi', 'Toronto', 'Lisbon', 'Bengaluru', 'Istanbul', 'Seoul', 'Paris'
];

const chains = ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism', 'Solana'];
const severities = ['Low', 'Medium', 'High', 'Critical'];
const riskEmojis = { Low: '🟢', Medium: '🟡', High: '🟠', Critical: '🔴' };
const assets = ['USDT', 'USDC', 'WETH', 'WBTC', 'DAI', 'OP', 'ARB', 'SOL'];
const detectors = ['Allowance Scanner', 'Phishing Detector', 'Rugpull Monitor', 'Bytecode Analyzer', 'MEV Monitor'];
const attackTypes = ['phishing', 'rugpull', 'ice phishing', 'approval drain', 'honeypot', 'flash-loan exploit'];
const protocols = ['Uniswap v3', 'PancakeSwap', 'Aave', 'Curve', 'Sushi', 'QuickSwap'];

function randomAmount() {
  const base = Math.floor(10 + Math.random() * 5000) / 10; // 1 decimal
  return base.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

const templates = [
  () => {
    const severity = randomChoice(severities);
    const chain = randomChoice(chains);
    const contract = shortHex(randomHex());
    const issues = 1 + Math.floor(Math.random() * 4);
    return `${riskEmojis[severity]} Smart-contract audit complete on ${chain} (${contract})\n• Findings: ${issues} • Severity: ${severity}\n• Module: Bytecode Analyzer 🔍`;
  },
  () => {
    const city = randomChoice(cities);
    const approvals = 1 + Math.floor(Math.random() * 4);
    const asset = randomChoice(assets);
    const wallet = shortHex(randomHex());
    return `🧹 User in ${city} revoked ${approvals} risky approvals\n• Wallet: ${wallet} • Asset: ${asset}\n• Tool: Allowance Scanner 🛡️`;
  },
  () => {
    const protocol = randomChoice(protocols);
    const chain = randomChoice(chains);
    const hash = shortHex(randomHex('0x', 64));
    const usd = randomAmount();
    return `🚨 Suspicious swap detected on ${protocol} (${chain})\n• Tx: ${hash}\n• Value: ~$${usd}k • Detector: MEV Monitor ⚡`;
  },
  () => {
    const chain = randomChoice(chains);
    const site = `http://${shortHex(randomHex('', 10))}.xyz`;
    const kind = randomChoice(attackTypes);
    return `🕵️ Phishing domain flagged (${chain})\n• Vector: ${kind}\n• Domain: ${site} • Detector: Phishing Detector 🧠`;
  },
  () => {
    const chain = randomChoice(chains);
    const token = shortHex(randomHex());
    const severity = randomChoice(severities);
    return `🧪 Token risk assessment updated on ${chain}\n• Token: ${token}\n• Risk: ${severity} ${riskEmojis[severity]} • Module: Rugpull Monitor 📉`;
  },
  () => {
    const chain = randomChoice(chains);
    const wallet = shortHex(randomHex());
    const findings = 1 + Math.floor(Math.random() * 5);
    return `🔎 Wallet posture scan (${chain})\n• Address: ${wallet}\n• Findings: ${findings} • Tool: Security Posture Scanner 🛡️`;
  },
  () => {
    const city = randomChoice(cities);
    const guide = randomChoice([
      'How to Revoke Dangerous Token Approvals',
      'Private Key Management Best Practices',
      'Spotting Honeypots on DEXs',
      'Bridge Safety: Minimizing Cross-Chain Risk'
    ]);
    return `📘 New security guide published\n• Title: '${guide}'\n• Shared with users in ${city} 🌍`;
  }
];

export function generateRandomActivity() {
  const text = randomChoice(templates)();
  const imageUrl = randomChoice(config.activityImageUrls);
  return { text, imageUrl };
}

