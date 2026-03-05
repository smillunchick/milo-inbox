export default async function handler(req, res) {
  // GET: health check + env status
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      service: 'milo-outbound',
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasGithubToken: !!process.env.GITHUB_TOKEN,
      envKeys: Object.keys(process.env).filter(k => 
        k.includes('RESEND') || k.includes('STRIPE') || k.includes('TWITTER') || 
        k.includes('ZOHO') || k.includes('APOLLO') || k.includes('API')
      )
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  }

  const { to, subject, text, html, from } = req.body;
  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, text or html' });
  }

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: from || 'Felix <felix@getmilo.dev>',
        to: Array.isArray(to) ? to : [to],
        subject,
        text: text || undefined,
        html: html || undefined
      })
    });

    const data = await emailRes.json();
    
    if (!emailRes.ok) {
      console.error('Resend error:', JSON.stringify(data));
      return res.status(emailRes.status).json({ error: 'Resend API error', details: data });
    }

    console.log('EMAIL SENT:', JSON.stringify({ to, subject, id: data.id }));
    return res.status(200).json({ status: 'sent', id: data.id });
  } catch (err) {
    console.error('Send error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
