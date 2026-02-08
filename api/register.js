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
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  
  if (!supabaseUrl || !supabasePublishableKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { name, cannotAttend, wish, email, phone, arrivalDate, departureDate, restrictions } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // If cannot attend, only wish is optional
    if (cannotAttend) {
      // No additional validation needed for cannot attend case
    } else {
      // If can attend, validate attendance fields
      if (!email || !phone || !arrivalDate || !departureDate) {
        return res.status(400).json({ error: 'Email, phone, and dates are required for attendees' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabasePublishableKey);

    // Prepare data for insertion
    const insertData = {
      name,
      cannot_attend: cannotAttend || false,
      wish: cannotAttend ? (wish || null) : null,
      email: cannotAttend ? null : email,
      phone: cannotAttend ? null : phone,
      arrival_date: cannotAttend ? null : arrivalDate,
      departure_date: cannotAttend ? null : departureDate,
      restrictions: cannotAttend ? null : (restrictions || null)
    };

    // Insert registration into Supabase
    const { data, error } = await supabase
      .from('registrations')
      .insert([insertData])
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
