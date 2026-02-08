# Supabase Auth Integration Setup

## Overview
The registration system now automatically creates Supabase Auth user accounts when someone submits a registration. This enables future authentication features and user management.

## How It Works

### 1. User Creation on Registration
When someone submits the registration form:
- If they provide an email (attendees), a Supabase Auth user is created
- A random password is generated and auto-confirmed
- User metadata includes their name and registration type
- The `user_id` is linked to the registration record

### 2. Database Schema
The `registrations` table now includes:
```sql
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
```

This creates a foreign key relationship between registrations and Supabase Auth users.

## Setup Instructions

### 1. Update the Database Schema

Run this SQL in Supabase SQL Editor to add the `user_id` column:

```sql
-- Add user_id column to existing table
ALTER TABLE registrations 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_user_id 
ON registrations(user_id) WHERE user_id IS NOT NULL;

-- Add comment
COMMENT ON COLUMN registrations.user_id 
IS 'Link to Supabase Auth user account created during registration';
```

**Note:** If you're creating the table fresh, use the updated `SUPABASE-SCHEMA.sql` which already includes this column.

### 2. Enable Email Auth in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. Configure email settings:
   - **Enable email confirmations**: OFF (we auto-confirm)
   - **Secure email change**: ON (recommended)
   - **Enable email OTP**: Optional

### 3. Configure Email Templates (Optional)

If you want to send welcome emails or password reset emails:

1. Go to **Authentication** → **Email Templates**
2. Customize templates for:
   - Confirmation email (not sent since we auto-confirm)
   - Password reset
   - Magic link

## User Account Details

### For Attendees (with email)
- **Email**: Their provided email address
- **Password**: Random generated (24 characters)
- **Email Confirmed**: Auto-confirmed (no verification needed)
- **User Metadata**:
  ```json
  {
    "name": "John Doe",
    "registration_type": "attendee"
  }
  ```

### For Non-Attendees (without email)
- No auth user is created
- `user_id` remains `NULL` in registrations table

## Benefits

✅ **User Management**: All registrants with emails have user accounts  
✅ **Future Features**: Can add login, profile pages, trip updates  
✅ **Data Integrity**: Foreign key ensures data consistency  
✅ **Cascade Delete**: If user is deleted, registration is also deleted  
✅ **Metadata**: Store additional info in user metadata  

## Future Enhancements

### Possible Features to Add:
1. **Login Portal**: Let attendees log in to view trip details
2. **Profile Management**: Update dietary restrictions, travel dates
3. **Trip Updates**: Send notifications to all registered users
4. **Document Sharing**: Share itineraries, tickets, hotel info
5. **Group Chat**: Enable communication between attendees
6. **Password Reset**: Let users reset their auto-generated passwords

## Viewing Auth Users

### In Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. You'll see all created users with their emails
3. Click on a user to see metadata and linked registrations

### Via SQL:
```sql
-- View all auth users with registration data
SELECT 
  au.id as user_id,
  au.email,
  au.created_at as user_created,
  au.raw_user_meta_data->>'name' as name,
  au.raw_user_meta_data->>'registration_type' as type,
  r.cannot_attend,
  r.arrival_date,
  r.departure_date
FROM auth.users au
LEFT JOIN registrations r ON r.user_id = au.id
ORDER BY au.created_at DESC;
```

## Security Notes

- **Service Role Key Required**: User creation requires the service role key (already configured)
- **Auto-Confirmation**: Users are auto-confirmed to avoid email verification flow
- **Random Passwords**: Generated passwords are secure (24 chars, alphanumeric)
- **Password Reset**: Users can request password reset if they want to log in later
- **RLS Policies**: Auth users respect Row Level Security policies

## Troubleshooting

### "User already exists" error
- Supabase Auth prevents duplicate emails
- The API gracefully handles this and continues with registration
- Check if email is already in the Auth users table

### User creation fails but registration succeeds
- This is by design - registration continues even if auth fails
- Check Supabase logs for auth errors
- Verify `SUPABASE_SECRET_KEY` is set correctly

### Cannot see user_id in registrations
- Run the ALTER TABLE command to add the column
- Existing registrations will have `NULL` user_id
- New registrations will populate user_id automatically

## Testing

Test both scenarios:

### Test 1: Attendee Registration (with email)
1. Submit registration with email
2. Check **Authentication** → **Users** in Supabase
3. Verify user was created with correct email
4. Check `registrations` table - `user_id` should be populated

### Test 2: Non-Attendee Registration (no email)
1. Check "cannot attend" box
2. Submit registration with wish
3. Check `registrations` table - `user_id` should be `NULL`
4. No auth user should be created
