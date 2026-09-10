const { createClient } = require('@supabase/supabase-js');

// Cron-invoked function that runs a trivial query against Supabase so the
// project registers activity and does not get paused on the free tier.
// Scheduled via the "crons" entry in vercel.json.
export default async function handler(req, res) {
  // Only allow GET (Vercel Cron issues GET requests)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // If a CRON_SECRET is configured, require it. Vercel Cron automatically
  // sends "Authorization: Bearer <CRON_SECRET>" when the env var is set.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseSecretKey);

    // Lightweight read: head-only count, no row data returned.
    const { error, count } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Keep-alive query error:', error);
      return res.status(500).json({ ok: false, error: 'Query failed' });
    }

    return res.status(200).json({ ok: true, count, ts: new Date().toISOString() });
  } catch (error) {
    console.error('Keep-alive error:', error);
    return res.status(500).json({ ok: false, error: 'Query failed' });
  }
}
