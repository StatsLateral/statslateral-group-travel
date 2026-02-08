const { createClient } = require('@supabase/supabase-js');

// Serverless function to retrieve all registrations (password protected)
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get credentials from environment variables
  const secretKey = process.env.REGISTRATION_SECRET;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
  
  if (!secretKey || !supabaseUrl || !supabaseSecretKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { password } = req.body;

    // Verify password matches the secret
    if (password !== secretKey) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Initialize Supabase client with secret key (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseSecretKey);

    // Fetch all registrations from Supabase
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: 'Failed to retrieve registrations' });
    }

    // Transform data to match expected format for admin page
    const registrations = data.map(reg => ({
      Timestamp: reg.created_at,
      Name: reg.name,
      Email: reg.email,
      Phone: reg.phone,
      'Arrival Date': reg.arrival_date,
      'Departure Date': reg.departure_date,
      Restrictions: reg.restrictions || ''
    }));

    return res.status(200).json({ 
      success: true, 
      registrations,
      count: registrations.length
    });

  } catch (error) {
    console.error('Error reading registrations:', error);
    return res.status(500).json({ error: 'Failed to retrieve registrations' });
  }
}
