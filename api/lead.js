export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(500).json({ error: 'Missing config' });

  const { name, email, company, industry, team_size, pain_point, message, ref, type } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const formType = type === 'demo' ? 'PROJECT INQUIRY' : 'PILOT APPLICATION';
  const subjectPrefix = type === 'demo' ? 'LEAD' : 'PILOT APPLICATION';

  const lines = [
    formType,
    'Name: ' + name,
    'Email: ' + email,
  ];
  if (company) lines.push('Company: ' + company);
  if (industry) lines.push('Industry: ' + industry);
  if (team_size) lines.push('Team size: ' + team_size);
  if (ref) lines.push('Source: ' + ref);
  lines.push('Time: ' + new Date().toISOString());
  if (pain_point) lines.push('Pain point: ' + pain_point);
  if (message) lines.push('Notes: ' + message);

  const payload = {
    from: 'Milo Leads <milo@getmilo.dev>',
    to: ['milo@getmilo.dev'],
    subject: subjectPrefix + ': ' + name + ' — ' + (company || 'no company'),
    text: lines.join('\n'),
    reply_to: email
  };

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: 'Send failed' });
    return res.status(200).json({ status: 'received' });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}
