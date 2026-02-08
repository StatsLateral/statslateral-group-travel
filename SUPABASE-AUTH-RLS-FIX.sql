-- Final RLS Fix: Allow authenticated users to insert their own registrations
-- Run this in Supabase SQL Editor

-- Step 1: Drop all existing policies
DROP POLICY IF EXISTS "Allow public inserts" ON public.registrations;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.registrations;
DROP POLICY IF EXISTS "Allow service role to read all" ON public.registrations;
DROP POLICY IF EXISTS "Enable select for service role only" ON public.registrations;
DROP POLICY IF EXISTS "Prevent public reads" ON public.registrations;
DROP POLICY IF EXISTS "Disable select for public" ON public.registrations;
DROP POLICY IF EXISTS "Prevent public updates" ON public.registrations;
DROP POLICY IF EXISTS "Disable update for public" ON public.registrations;
DROP POLICY IF EXISTS "Prevent public deletes" ON public.registrations;
DROP POLICY IF EXISTS "Disable delete for public" ON public.registrations;

-- Step 2: Create INSERT policy for authenticated users
CREATE POLICY "Allow authenticated users to insert"
ON public.registrations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Step 3: Create SELECT policy for service role (admin access)
CREATE POLICY "Allow service role to read all"
ON public.registrations
FOR SELECT
TO service_role
USING (true);

-- Step 4: Create SELECT policy for authenticated users (own records)
CREATE POLICY "Allow users to read own registration"
ON public.registrations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Step 5: Create UPDATE policy for authenticated users (own records)
CREATE POLICY "Allow users to update own registration"
ON public.registrations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Step 6: Verify policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd AS command
FROM pg_policies 
WHERE tablename = 'registrations'
ORDER BY policyname;
