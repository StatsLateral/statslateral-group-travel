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
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
  
  if (!supabaseUrl || !supabasePublishableKey || !supabaseSecretKey) {
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

    // Initialize Supabase clients
    const supabase = createClient(supabaseUrl, supabasePublishableKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey);
    
    let userId = null;

    // Create Supabase Auth user if email is provided
    if (email) {
      try {
        // Generate a random password for the user (they can reset it later if needed)
        const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
        
        // Create auth user with email using admin client
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          password: randomPassword,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            name: name,
            registration_type: cannotAttend ? 'well-wisher' : 'attendee'
          }
        });

        if (authError) {
          console.error('Auth user creation error:', authError);
          // Continue with registration even if auth fails
        } else if (authData.user) {
          userId = authData.user.id;
        }
      } catch (authException) {
        console.error('Auth exception:', authException);
        // Continue with registration even if auth fails
      }
    }

    // Prepare data for insertion
    const insertData = {
      user_id: userId,
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
