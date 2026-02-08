# Supabase Setup Guide

## 1. Create the Database Table

In your Supabase project dashboard, go to **SQL Editor** and run this SQL:

```sql
-- Create registrations table
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  restrictions TEXT
);

-- Create index on created_at for faster sorting
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for registration form)
CREATE POLICY "Allow public inserts" ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow reads with service role only (for admin page)
CREATE POLICY "Allow service role to read all" ON registrations
  FOR SELECT
  TO service_role
  USING (true);
```

## 2. Get Your Supabase Credentials

From your Supabase project dashboard:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Project API keys**:
     - **publishable (anon)** key (for client-side operations)
     - **secret (service_role)** key (for server-side admin operations - keep this secret!)

## 3. Add Environment Variables to Vercel

Go to your Vercel project → **Settings** → **Environment Variables** and add:

| Name | Value | Description |
|------|-------|-------------|
| `REGISTRATION_SECRET` | (your existing password) | Admin password for viewing registrations |
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | Your Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | `eyJhbG...` | Your Supabase publishable (anon) key |
| `SUPABASE_SECRET_KEY` | `eyJhbG...` | Your Supabase secret (service_role) key (SECRET!) |

**Important:** Set these for all environments (Production, Preview, Development)

## 4. Redeploy

After adding the environment variables, redeploy your Vercel project for changes to take effect.

## 5. Test the Integration

1. Submit a test registration on your site
2. Go to Supabase dashboard → **Table Editor** → `registrations` table
3. Verify the data appears
4. Access your admin page at `/admin.html` to view registrations

## Database Schema

```
registrations
├── id (UUID, Primary Key)
├── created_at (Timestamp with timezone)
├── name (Text, Required)
├── email (Text, Required)
├── phone (Text, Required)
├── arrival_date (Date, Required)
├── departure_date (Date, Required)
└── restrictions (Text, Optional)
```

## Security Notes

- **Row Level Security (RLS)** is enabled
- Public users can only INSERT (submit registrations)
- Only the service role can SELECT (read registrations)
- The admin page uses the service role key server-side
- Never expose the service role key to the client

## Benefits Over CSV

✅ **Persistent Storage** - Data never gets lost  
✅ **Scalable** - Handles thousands of registrations  
✅ **Queryable** - Easy to filter, sort, and analyze data  
✅ **Secure** - Built-in authentication and RLS  
✅ **Real-time** - Can add real-time updates if needed  
✅ **Backups** - Automatic backups included  

## Troubleshooting

### Registration form not working
- Check that `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` are set in Vercel
- Verify the RLS policy allows public inserts
- Check browser console for errors

### Admin page shows no data
- Verify `SUPABASE_SECRET_KEY` is set correctly
- Check that data exists in Supabase Table Editor
- Ensure you're using the correct admin password

### "relation does not exist" error
- Make sure you ran the SQL schema creation script
- Verify you're connected to the correct Supabase project
