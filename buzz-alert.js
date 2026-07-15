// buzz-alert.js
// Yahoo!ニュースRSS / Googleトレンド を取得し、指標リストとマッチしたらGmailで通知する。
//
// 使い方: README や返信メッセージの「実行方法」を参照。

require('dotenv').config({ quiet: true });
const path = require('path');
const fs = require('fs/promises');
const Parser = require('rss-parser');
const nodemailer = require('nodemailer');

const STATS_BASE_URL = process.env.STATS_BASE_URL || 'https://japan-stats.com';
const MAIL_TO = process.env.MAIL_TO || '100makeniki@gmail.com';
const HISTORY_FILE = path.join(__dirname, 'buzz-alert-history.json');
const MAX_HISTORY = 1000;

// 指標リスト: ニュースタイトルに含まれていたらマッチとみなすキーワードと、対応する japan-stats.com の詳細ページ
const INDICATORS = [
  { name: '通勤時間', slug: '/detail/commute-time' },
  { name: '離婚率', slug: '/detail/divorce-rate' },
  { name: '出生率', slug: '/detail/birth-rate' },
  { name: '最低賃金', slug: '/detail/min-wage' },
  { name: '平均給与', slug: '/detail/avg-salary' },
  { name: '医師数', slug: '/detail/doctor-count' },
  { name: '空き家率', slug: '/detail/vacancy-rate' },
  { name: '待機児童', slug: '/detail/nursery-waiting' },
  { name: '未婚率', slug: '/detail/unmarried-rate' },
  { name: '降水量', slug: '/detail/rainfall' },
  { name: '有効求人倍率', slug: '/detail/job-opening-ratio' },
  { name: '農業産出額', slug: '/detail/agriculture' },
  { name: '地価変動率', slug: '/detail/land-price-change' },
  { name: '森林率', slug: '/detail/forest-rate' },
  { name: '個人破産', slug: '/detail/personal-bankruptcy' },
  { name: '完全失業率', slug: '/detail/unemployment-rate' },
  { name: '非正規雇用率', slug: '/detail/non-regular-rate' },
  { name: 'ふるさと納税', slug: '/detail/furusato-tax' },
];

// 取得元フィード。Yahoo!ニュースの主要トピックスと、Googleトレンド(日本)の急上昇ワードRSS。
const FEEDS = [
  { source: 'Yahoo!ニューストピックス(主要)', url: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml' },
  { source: 'Yahoo!ニューストピックス(国内)', url: 'https://news.yahoo.co.jp/rss/topics/domestic.xml' },
  { source: 'Googleトレンド(日本)', url: 'https://trends.google.com/trending/rss?geo=JP' },
];

const parser = new Parser();

async function fetchAllNews() {
  const items = [];
  for (const feed of FEEDS) {
    try {
      const result = await parser.parseURL(feed.url);
      for (const item of result.items || []) {
        if (item.title && item.link) {
          items.push({ title: item.title.trim(), link: item.link.trim(), source: feed.source });
        }
      }
    } catch (err) {
      console.error(`[WARN] フィード取得失敗: ${feed.source} (${feed.url}) - ${err.message}`);
    }
  }
  return items;
}

function findMatches(title) {
  return INDICATORS.filter((indicator) => title.includes(indicator.name));
}

function buildReplyDraft(newsTitle, indicatorName) {
  const base = `「${newsTitle}」が話題。${indicatorName}のデータで見ると別の角度が見える。japan-stats.comで${indicatorName}をチェック→`;
  const chars = Array.from(base);
  return chars.length > 150 ? `${chars.slice(0, 149).join('')}…` : base;
}

async function loadHistory() {
  try {
    const raw = await fs.readFile(HISTORY_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return new Set(Array.isArray(data.sentLinks) ? data.sentLinks : []);
  } catch {
    return new Set();
  }
}

async function saveHistory(sentLinksSet) {
  const sentLinks = Array.from(sentLinksSet).slice(-MAX_HISTORY);
  await fs.writeFile(HISTORY_FILE, JSON.stringify({ sentLinks }, null, 2), 'utf-8');
}

function buildTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error('GMAIL_USER / GMAIL_APP_PASSWORD が .env に設定されていません。');
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

async function sendAlert(transport, newsItem, matches) {
  const indicatorNames = matches.map((m) => m.name).join('/');
  const subject = `【バズ乗りチャンス】${indicatorNames} × japan-stats.com`;

  const indicatorLines = matches
    .map((m) => `・${m.name}: ${STATS_BASE_URL}${m.slug}`)
    .join('\n');
  const replyDrafts = matches
    .map((m) => `・${m.name}向け: ${buildReplyDraft(newsItem.title, m.name)}`)
    .join('\n');

  const text = [
    '■ バズってるニュース',
    `${newsItem.title}`,
    `${newsItem.link}`,
    `(出典: ${newsItem.source})`,
    '',
    '■ 使える指標',
    indicatorLines,
    '',
    '■ リプ文案（150文字以内）',
    replyDrafts,
  ].join('\n');

  await transport.sendMail({
    from: process.env.GMAIL_USER,
    to: MAIL_TO,
    subject,
    text,
  });
}

async function main() {
  const history = await loadHistory();
  const newsItems = await fetchAllNews();

  let sentCount = 0;
  let transport = null;

  for (const item of newsItems) {
    if (history.has(item.link)) continue;

    const matches = findMatches(item.title);
    if (matches.length === 0) continue;

    if (!transport) transport = buildTransport();

    try {
      await sendAlert(transport, item, matches);
      console.log(`[SENT] ${item.title} -> ${matches.map((m) => m.name).join(', ')}`);
      sentCount += 1;
    } catch (err) {
      console.error(`[ERROR] メール送信失敗: ${item.title} - ${err.message}`);
    } finally {
      history.add(item.link);
    }
  }

  await saveHistory(history);
  console.log(`完了: ニュース${newsItems.length}件を確認し、${sentCount}件通知しました。`);
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
