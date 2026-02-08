-- Fix for RLS Policy Error
-- Run this in Supabase SQL Editor to fix the insert permission issue

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Allow public inserts" ON registrations;

-- Recreate the policy to allow inserts from all users (including anon)
CREATE POLICY "Allow public inserts" ON registrations
  FOR INSERT
  WITH CHECK (true);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'registrations' AND policyname = 'Allow public inserts';
