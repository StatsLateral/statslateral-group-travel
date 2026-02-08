# Supabase Auth Magic Link Setup Instructions

## Overview
We've switched to Supabase Auth with magic link email authentication to solve the RLS policy issues. Users now:
1. Enter their email on the auth page
2. Receive a magic link via email
3. Click the link to authenticate
4. Access the RSVP form as an authenticated user

## Step 1: Run the RLS Policy Fix

Go to Supabase SQL Editor and run `SUPABASE-AUTH-RLS-FIX.sql`:

```sql
-- Drop all existing policies
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

-- Create INSERT policy for authenticated users
CREATE POLICY "Allow authenticated users to insert"
ON public.registrations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create SELECT policy for service role (admin access)
CREATE POLICY "Allow service role to read all"
ON public.registrations
FOR SELECT
TO service_role
USING (true);

-- Create SELECT policy for authenticated users (own records)
CREATE POLICY "Allow users to read own registration"
ON public.registrations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create UPDATE policy for authenticated users (own records)
CREATE POLICY "Allow users to update own registration"
ON public.registrations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

## Step 2: Configure Supabase Auth Settings

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email settings:
   - **Enable email confirmations**: OFF (magic link doesn't need confirmation)
   - **Secure email change**: ON
   - **Enable email OTP**: ON (for magic links)

## Step 3: Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Select **Magic Link** template
3. Customize if needed (optional)
4. Ensure the redirect URL is set correctly

## Step 4: Update Supabase Credentials in Code

Edit `js/supabase-config.js` and replace the placeholder values:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'your-publishable-key-here';
```

Get these from: Supabase Dashboard → **Settings** → **API**

## Step 5: Configure Site URL

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL** to your production URL: `https://statslateral-group-travel.vercel.app`
3. Add **Redirect URLs**:
   - `https://statslateral-group-travel.vercel.app/rsvp.html`
   - `http://localhost:3000/rsvp.html` (for local testing)

## How It Works

### User Flow:
1. User visits homepage and clicks "RSVP Here"
2. Redirected to `auth.html` - email entry page
3. User enters email and clicks "Send Magic Link"
4. Supabase sends magic link email
5. User clicks link in email
6. Redirected to `rsvp.html` as authenticated user
7. Form is visible and user can submit
8. Registration is saved with their `user_id` from auth

### Security:
- RLS policies ensure users can only insert/update their own registrations
- `user_id` is automatically set from authenticated session
- Admin page uses service role key to view all registrations
- Public cannot read any registration data

## Files Changed

**New Files:**
- `auth.html` - Email entry page for magic link
- `js/auth.js` - Magic link authentication logic
- `js/supabase-config.js` - Supabase client configuration
- `SUPABASE-AUTH-RLS-FIX.sql` - Updated RLS policies
- `SUPABASE-AUTH-SETUP-INSTRUCTIONS.md` - This file

**Updated Files:**
- `rsvp.html` - Added auth check, shows auth required message if not logged in
- `js/registration.js` - Checks authentication before showing form
- `index.html` - Updated all RSVP buttons to point to `auth.html`

## Testing

### Local Testing:
1. Update `js/supabase-config.js` with your credentials
2. Run a local server: `python -m http.server 3000`
3. Visit `http://localhost:3000/auth.html`
4. Enter your email
5. Check email for magic link
6. Click link to authenticate
7. Fill out RSVP form
8. Submit and verify in Supabase

### Production Testing:
1. Deploy to Vercel
2. Visit your site and click "RSVP Here"
3. Complete the auth flow
4. Submit registration
5. Check Supabase database for the record

## Troubleshooting

### "Failed to send magic link"
- Check that Email provider is enabled in Supabase
- Verify SMTP settings are configured
- Check Supabase logs for errors

### "Authentication Required" message on rsvp.html
- User needs to click the magic link first
- Check that redirect URL is correct
- Verify session is being created

### RLS policy error still occurring
- Verify you ran the SQL script
- Check that policies are created: `SELECT * FROM pg_policies WHERE tablename = 'registrations'`
- Ensure user is authenticated before form submission

### Magic link not received
- Check spam folder
- Verify email provider is configured in Supabase
- Check Supabase email logs

## Benefits

✅ **Solves RLS issues** - Authenticated users can insert their own records  
✅ **Better security** - Users can only access their own data  
✅ **No password needed** - Magic link is simpler and more secure  
✅ **Email verification** - Built-in email validation  
✅ **Future features** - Can add user profiles, dashboards, etc.  

## Next Steps

After setup:
1. Test the complete flow
2. Customize email templates (optional)
3. Add user profile page (future enhancement)
4. Add "My RSVP" page to view/edit own registration
