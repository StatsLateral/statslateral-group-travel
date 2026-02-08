const { createClient } = require('@supabase/supabase-js');

// Serverless function to update existing registration
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
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
  
  if (!supabaseUrl || !supabaseSecretKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { id, name, cannotAttend, wish, email, phone, arrivalDate, departureDate, restrictions } = req.body;

    // Validate required fields
    if (!id || !name) {
      return res.status(400).json({ error: 'Registration ID and name are required' });
    }

    // If can attend, validate attendance fields
    if (!cannotAttend) {
      if (!email || !phone || !arrivalDate || !departureDate) {
        return res.status(400).json({ error: 'Email, phone, and dates are required for attendees' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
    }

    // Initialize Supabase client with secret key
    const supabase = createClient(supabaseUrl, supabaseSecretKey);

    // Prepare update data
    const updateData = {
      name,
      cannot_attend: cannotAttend || false,
      wish: cannotAttend ? (wish || null) : null,
      phone: cannotAttend ? null : phone,
      arrival_date: cannotAttend ? null : arrivalDate,
      departure_date: cannotAttend ? null : departureDate,
      restrictions: cannotAttend ? null : (restrictions || null)
    };

    // Update registration in Supabase
    const { data, error } = await supabase
      .from('registrations')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(500).json({ error: 'Failed to update registration' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'RSVP updated successfully!',
      data: data[0]
    });

  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ error: 'Failed to update registration' });
  }
}
