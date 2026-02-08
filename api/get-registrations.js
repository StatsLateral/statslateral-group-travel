const fs = require('fs');
const path = require('path');

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

  // Get the secret key from environment variable
  const secretKey = process.env.REGISTRATION_SECRET;
  if (!secretKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { password } = req.body;

    // Verify password matches the secret
    if (password !== secretKey) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Path to CSV file
    const csvPath = path.join('/tmp', 'registrations.csv');

    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      // Return empty array if no registrations yet
      return res.status(200).json({ 
        success: true, 
        registrations: [],
        message: 'No registrations found'
      });
    }

    // Read the CSV file
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    
    if (lines.length <= 1) {
      // Only headers, no data
      return res.status(200).json({ 
        success: true, 
        registrations: [],
        message: 'No registrations found'
      });
    }

    // Parse CSV into array of objects
    const headers = lines[0].split(',').map(h => h.trim());
    const registrations = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      // Simple CSV parsing (handles quoted fields)
      const values = [];
      let current = '';
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          if (inQuotes && line[j + 1] === '"') {
            current += '"';
            j++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      // Create object from headers and values
      const registration = {};
      headers.forEach((header, index) => {
        registration[header] = values[index] || '';
      });
      registrations.push(registration);
    }

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
