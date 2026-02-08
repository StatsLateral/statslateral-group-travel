-- Brotherhood Trip Registration Table with RLS
-- Run this in Supabase SQL Editor

-- Drop existing table if you need to recreate it
-- DROP TABLE IF EXISTS registrations CASCADE;

-- Create registrations table with all form fields
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- Link to Supabase Auth user
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic info (always required)
  name TEXT NOT NULL,
  
  -- Cannot attend flag
  cannot_attend BOOLEAN DEFAULT FALSE NOT NULL,
  
  -- Wish/comment (only for those who cannot attend)
  wish TEXT,
  
  -- Attendance details (required only if can attend)
  email TEXT,
  phone TEXT,
  arrival_date DATE,
  departure_date DATE,
  connection TEXT,
  restrictions TEXT,
  
  -- Constraints to ensure data integrity
  CONSTRAINT email_required_if_attending CHECK (
    cannot_attend = TRUE OR (email IS NOT NULL AND email != '')
  ),
  CONSTRAINT phone_required_if_attending CHECK (
    cannot_attend = TRUE OR (phone IS NOT NULL AND phone != '')
  ),
  CONSTRAINT dates_required_if_attending CHECK (
    cannot_attend = TRUE OR (arrival_date IS NOT NULL AND departure_date IS NOT NULL)
  ),
  CONSTRAINT connection_required_if_attending CHECK (
    cannot_attend = TRUE OR (connection IS NOT NULL AND connection != '')
  ),
  CONSTRAINT wish_only_if_not_attending CHECK (
    cannot_attend = TRUE OR wish IS NULL
  ),
  CONSTRAINT valid_date_range CHECK (
    cannot_attend = TRUE OR departure_date >= arrival_date
  )
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_cannot_attend ON registrations(cannot_attend);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id) WHERE user_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON TABLE registrations IS 'Brotherhood Trip registration responses including both attendees and well-wishers';
COMMENT ON COLUMN registrations.user_id IS 'Link to Supabase Auth user account created during registration';
COMMENT ON COLUMN registrations.cannot_attend IS 'True if person cannot attend but wants to leave a wish';
COMMENT ON COLUMN registrations.wish IS 'Message from those who cannot attend';
COMMENT ON COLUMN registrations.email IS 'Required for attendees, null for non-attendees';
COMMENT ON COLUMN registrations.phone IS 'WhatsApp number, required for attendees';
COMMENT ON COLUMN registrations.arrival_date IS 'Trip arrival date (Nov 18-25, 2026)';
COMMENT ON COLUMN registrations.departure_date IS 'Trip departure date (Nov 18-25, 2026)';
COMMENT ON COLUMN registrations.connection IS 'How the attendee knows Shikhin, required for attendees';
COMMENT ON COLUMN registrations.restrictions IS 'Dietary restrictions or special requests';

-- Enable Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if recreating
DROP POLICY IF EXISTS "Allow public inserts" ON registrations;
DROP POLICY IF EXISTS "Allow service role to read all" ON registrations;

-- Policy 1: Allow anyone to insert registrations (public form submission)
-- Note: This allows inserts from both anonymous and authenticated users
CREATE POLICY "Allow public inserts" ON registrations
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Allow service role to read all registrations (for admin page)
CREATE POLICY "Allow service role to read all" ON registrations
  FOR SELECT
  TO service_role
  USING (true);

-- Policy 3: Prevent public from reading data (security)
CREATE POLICY "Prevent public reads" ON registrations
  FOR SELECT
  TO anon, authenticated
  USING (false);

-- Policy 4: Prevent public updates and deletes
CREATE POLICY "Prevent public updates" ON registrations
  FOR UPDATE
  TO anon, authenticated
  USING (false);

CREATE POLICY "Prevent public deletes" ON registrations
  FOR DELETE
  TO anon, authenticated
  USING (false);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT INSERT ON registrations TO anon, authenticated;
GRANT SELECT ON registrations TO service_role;

-- Verify the setup
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'registrations';

-- View all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'registrations';
