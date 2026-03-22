// Dedup cache — survives across warm invocations in the same container
const sent = new Map();
const DEDUP_TTL = 24 * 60 * 60 * 1000; // 24 hours

function dedupKey(to, subject) {
  const recipients = [].concat(to).sort().join(',').toLowerCase();
  return `${recipients}::${subject}`;
}

function pruneOld() {
  const cutoff = Date.now() - DEDUP_TTL;
  for (const [key, ts] of sent) {
    if (ts < cutoff) sent.delete(key);
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', service: 'milo-outbound' });
  }
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth: require Bearer token
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const validToken = process.env.MILO_SEND_KEY;
  if (!validToken || token !== validToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(500).json({ error: 'Missing config' });

  const { to, subject, text, html, from, reply_to } = req.body;
  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: 'Missing: to, subject, text/html' });
  }

  // Dedup: reject if same to+subject sent in last 24h
  pruneOld();
  const dk = dedupKey(to, subject);
  if (sent.has(dk)) {
    return res.status(409).json({ error: 'Duplicate: same to+subject sent in last 24h' });
  }

  const replyTo = reply_to || process.env.DEFAULT_REPLY_TO || 'milo@getmilo.dev';
  const sender = from || process.env.DEFAULT_FROM || 'Milo <milo@getmilo.dev>';

  const payload = { from: sender, to: [].concat(to), subject };
  if (text) payload.text = text;
  if (html) payload.html = html;
  if (replyTo) payload.reply_to = replyTo;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: 'Send failed', details: data });

    // Record successful send for dedup
    sent.set(dk, Date.now());

    return res.status(200).json({ status: 'sent', id: data.id, reply_to: replyTo || sender });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
