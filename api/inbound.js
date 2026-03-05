export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', service: 'milo-inbox' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;
    const from = payload.from || payload.sender || JSON.stringify(payload.from_email || 'unknown');
    const to = payload.to || 'felix@join.getmilo.dev';
    const subject = payload.subject || '(no subject)';
    const text = payload.text || payload.html || payload.body || '';
    const ts = new Date().toISOString();

    const ghToken = process.env.GITHUB_TOKEN;
    if (!ghToken) {
      console.error('No GITHUB_TOKEN configured');
      return res.status(200).json({ status: 'received', stored: false });
    }

    const issueBody = `**From:** ${from}\n**To:** ${to}\n**Subject:** ${subject}\n**Received:** ${ts}\n\n---\n\n${typeof text === 'string' ? text.substring(0, 8000) : JSON.stringify(text).substring(0, 8000)}\n\n---\n<details><summary>Raw payload</summary>\n\n\`\`\`json\n${JSON.stringify(payload, null, 2).substring(0, 15000)}\n\`\`\`\n</details>`;

    await fetch('https://api.github.com/repos/getmilodev/milo-inbox/issues', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ghToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        title: `📧 ${from}: ${subject}`.substring(0, 200),
        body: issueBody,
        labels: ['inbound-email']
      })
    });

    console.log('INBOUND:', JSON.stringify({ from, to, subject, ts }));
    return res.status(200).json({ status: 'received', stored: true });
  } catch (err) {
    console.error('Error:', err.message);
    return res.status(200).json({ status: 'error', message: err.message });
  }
}
