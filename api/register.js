const { createClient } = require('@supabase/supabase-js');

// Serverless function to handle registration submissions
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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

  // Verify Supabase credentials
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { name, email, phone, arrivalDate, departureDate, restrictions } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !arrivalDate || !departureDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Insert registration into Supabase
    const { data, error } = await supabase
      .from('registrations')
      .insert([
        {
          name,
          email,
          phone,
          arrival_date: arrivalDate,
          departure_date: departureDate,
          restrictions: restrictions || null
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save registration' });
    }

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Registration submitted successfully!',
      data: data[0]
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to process registration' });
  }
}
