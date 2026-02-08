# Registration System Setup

## Overview
This project includes a CSV-based registration system for The Brotherhood Trip. Registrations are stored securely and require an environment variable to be set on Vercel.

## Files Created
- `/api/register.js` - Serverless API endpoint for handling form submissions
- `/data/registrations.csv` - CSV file with headers (initial template)
- `/js/registration.js` - Frontend JavaScript for form handling
- `/css/registration.css` - Styling for the registration form
- `/.env.example` - Example environment variable configuration
- `/vercel.json` - Vercel configuration for the API function

## Setup Instructions

### 1. Set Environment Variable on Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `REGISTRATION_SECRET`
   - **Value**: Generate a random secure string (e.g., use a password generator)
   - **Environment**: Production, Preview, and Development

### 2. Redeploy

After setting the environment variable, redeploy your project for the changes to take effect.

## How It Works

1. **User fills out the registration form** on the homepage (#join section)
   - Name (required)
   - Email (required)
   - Arrival Date (required)
   - Departure Date (required)
   - Dietary Restrictions / Special Requests (optional)

2. **Form submission** sends data to `/api/register` endpoint

3. **API validates** the data and checks for the environment variable

4. **Data is appended** to a CSV file in `/tmp/registrations.csv` on Vercel

5. **User receives confirmation** message on the page

## CSV Format

The CSV file contains the following columns:
```
Timestamp,Name,Email,Arrival Date,Departure Date,Restrictions
```

## Accessing Registration Data

Since Vercel serverless functions use ephemeral storage (`/tmp`), the CSV data is temporary. For production use, you should:

### Option 1: Download via API (Recommended)
Create a protected endpoint to download the CSV:
- Add authentication
- Return the CSV file for download

### Option 2: Use a Database
Integrate with:
- Vercel Postgres
- Supabase
- Airtable
- Google Sheets API

### Option 3: Email Notifications
Modify `/api/register.js` to send email notifications for each registration using:
- SendGrid
- Resend
- Nodemailer

## Security Notes

- The `REGISTRATION_SECRET` environment variable is required for the API to function
- Email validation is performed on the backend
- CSV fields are properly escaped to prevent injection attacks
- CORS is configured to allow requests from your domain

## Testing Locally

1. Create a `.env` file (copy from `.env.example`)
2. Set `REGISTRATION_SECRET=test-secret-key`
3. Run `vercel dev` to test the API locally
4. Open the form at `http://localhost:3000/#join`

## Troubleshooting

- **500 Error**: Check that `REGISTRATION_SECRET` is set in Vercel environment variables
- **Form not submitting**: Check browser console for JavaScript errors
- **Data not persisting**: Remember that `/tmp` storage is ephemeral on Vercel - implement one of the persistence options above
