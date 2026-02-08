-- Check and Fix RLS Policies for registrations table
-- Run this in Supabase SQL Editor

-- Step 1: Check current RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE tablename = 'registrations';

-- Step 2: View all current policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd AS command,
  qual AS using_expression,
  with_check AS with_check_expression
FROM pg_policies 
WHERE tablename = 'registrations'
ORDER BY policyname;

-- Step 3: Drop ALL existing policies
DROP POLICY IF EXISTS "Allow public inserts" ON public.registrations;
DROP POLICY IF EXISTS "Allow service role to read all" ON public.registrations;
DROP POLICY IF EXISTS "Prevent public reads" ON public.registrations;
DROP POLICY IF EXISTS "Prevent public updates" ON public.registrations;
DROP POLICY IF EXISTS "Prevent public deletes" ON public.registrations;

-- Step 4: Create the correct INSERT policy for all roles
CREATE POLICY "Enable insert for all users"
ON public.registrations
FOR INSERT
TO public
WITH CHECK (true);

-- Step 5: Create SELECT policy for service role only (admin access)
CREATE POLICY "Enable select for service role only"
ON public.registrations
FOR SELECT
TO service_role
USING (true);

-- Step 6: Prevent public SELECT (security)
CREATE POLICY "Disable select for public"
ON public.registrations
FOR SELECT
TO anon, authenticated
USING (false);

-- Step 7: Prevent public UPDATE
CREATE POLICY "Disable update for public"
ON public.registrations
FOR UPDATE
TO anon, authenticated
USING (false);

-- Step 8: Prevent public DELETE
CREATE POLICY "Disable delete for public"
ON public.registrations
FOR DELETE
TO anon, authenticated
USING (false);

-- Step 9: Verify the new policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd AS command
FROM pg_policies 
WHERE tablename = 'registrations'
ORDER BY policyname;

-- Step 10: Test insert permission (this should work)
-- Uncomment to test:
-- INSERT INTO public.registrations (name, cannot_attend, email, phone, arrival_date, departure_date, connection)
-- VALUES ('Test User', false, 'test@example.com', '+1234567890', '2026-11-18', '2026-11-20', 'Test connection');

-- Step 11: Clean up test data (if you ran the test)
-- DELETE FROM public.registrations WHERE name = 'Test User';
