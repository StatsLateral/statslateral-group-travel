const fs = require('fs');
const path = require('path');

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

  // Verify the secret key from environment variable
  const secretKey = process.env.REGISTRATION_SECRET;
  if (!secretKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { name, email, arrivalDate, departureDate, restrictions } = req.body;

    // Validate required fields
    if (!name || !email || !arrivalDate || !departureDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create CSV row (escape commas and quotes in data)
    const escapeCsvField = (field) => {
      if (!field) return '';
      const stringField = String(field);
      if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
      }
      return stringField;
    };

    const timestamp = new Date().toISOString();
    const csvRow = [
      escapeCsvField(timestamp),
      escapeCsvField(name),
      escapeCsvField(email),
      escapeCsvField(arrivalDate),
      escapeCsvField(departureDate),
      escapeCsvField(restrictions || '')
    ].join(',') + '\n';

    // Path to CSV file
    const csvPath = path.join('/tmp', 'registrations.csv');

    // Check if file exists, if not create with headers
    if (!fs.existsSync(csvPath)) {
      const headers = 'Timestamp,Name,Email,Arrival Date,Departure Date,Restrictions\n';
      fs.writeFileSync(csvPath, headers);
    }

    // Append the new registration
    fs.appendFileSync(csvPath, csvRow);

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Registration submitted successfully!' 
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to process registration' });
  }
}
