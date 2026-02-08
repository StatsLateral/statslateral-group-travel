# Fix Magic Link Redirect Issue

## Problem
Magic link redirects to homepage (`/#access_token=...`) instead of `rsvp.html`, requiring users to sign in again.

## Solution Applied

### 1. Updated `registration.js`
Added auth callback handler to process magic link tokens:
- Detects `access_token` in URL hash
- Exchanges token for session using `setSession()`
- Cleans up URL hash after processing
- Then checks auth status normally

### 2. Supabase Configuration Required

**Go to Supabase Dashboard → Authentication → URL Configuration**

Update the **Redirect URLs** to include:
```
https://statslateral-group-travel.vercel.app/rsvp.html
http://localhost:3000/rsvp.html
```

**Important:** The redirect URL in the magic link email is set by Supabase based on:
1. The `emailRedirectTo` parameter in `signInWithOtp()` (already set to `/rsvp.html`)
2. The allowed redirect URLs in Supabase settings (must include the full URL)

### 3. How It Works Now

1. User enters email on `auth.html`
2. Supabase sends magic link with redirect to `rsvp.html`
3. User clicks link → redirected to `rsvp.html#access_token=...`
4. `registration.js` detects the hash parameters
5. Exchanges access token for session
6. Cleans up URL (removes hash)
7. Shows RSVP form (user is now authenticated)

### 4. Testing

After updating Supabase redirect URLs:
1. Go to `auth.html`
2. Enter email
3. Click magic link in email
4. Should go directly to `rsvp.html` with form visible
5. No second sign-in required

## Alternative: Use Auth Code Flow (More Secure)

If the hash-based flow still has issues, you can switch to PKCE flow:

```javascript
// In auth.js, change signInWithOtp to:
const { data, error } = await supabaseClient.auth.signInWithOtp({
    email: email,
    options: {
        emailRedirectTo: `${window.location.origin}/rsvp.html`,
        shouldCreateUser: true
    }
});
```

The current implementation should work once the redirect URLs are configured in Supabase.
