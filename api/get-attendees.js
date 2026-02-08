const { createClient } = require('@supabase/supabase-js');

// Serverless function to retrieve list of attendees (public endpoint)
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get credentials from environment variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
  
  if (!supabaseUrl || !supabaseSecretKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Initialize Supabase client with secret key
    const supabase = createClient(supabaseUrl, supabaseSecretKey);

    // Fetch only attendees (cannot_attend = false) with arrival dates
    const { data, error } = await supabase
      .from('registrations')
      .select('name, arrival_date')
      .eq('cannot_attend', false)
      .not('arrival_date', 'is', null)
      .order('arrival_date', { ascending: true });

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: 'Failed to retrieve attendees' });
    }

    // Transform data for display
    const attendees = data.map(attendee => {
      const arrivalDate = new Date(attendee.arrival_date);
      const cityMap = {
        '2026-11-18': 'Berlin',
        '2026-11-19': 'Berlin',
        '2026-11-20': 'Berlin',
        '2026-11-21': 'Prague',
        '2026-11-22': 'Prague',
        '2026-11-23': 'Vienna',
        '2026-11-24': 'Vienna',
        '2026-11-25': 'Vienna'
      };
      
      const dateStr = attendee.arrival_date;
      const city = cityMap[dateStr] || 'Berlin';
      
      return {
        name: attendee.name,
        city: city,
        date: arrivalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
    });

    return res.status(200).json({ 
      success: true, 
      attendees,
      count: attendees.length
    });

  } catch (error) {
    console.error('Error retrieving attendees:', error);
    return res.status(500).json({ error: 'Failed to retrieve attendees' });
  }
}
