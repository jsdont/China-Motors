// api/telegram.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  const { text } = req.body || {};
  const token = process.env.TELEGRAM_TOKEN;     // задашь в настройках проекта
  const chat_id = process.env.TELEGRAM_CHAT_ID; // тоже в настройках
  if (!token || !chat_id) return res.status(500).json({ error: 'Missing env' });

  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id, text })
  });
  const data = await r.json();
  if (!data.ok) return res.status(500).json(data);
  res.status(200).json({ ok: true });
}
