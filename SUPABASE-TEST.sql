-- Supabase Database Verification and Testing Script
-- Run these queries in Supabase SQL Editor to verify your setup

-- ============================================
-- PART 1: VERIFY TABLE STRUCTURE
-- ============================================

-- Check if table exists and has RLS enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE tablename = 'registrations';

-- View table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'registrations'
ORDER BY ordinal_position;

-- View all constraints
SELECT
  con.conname AS constraint_name,
  con.contype AS constraint_type,
  CASE con.contype
    WHEN 'c' THEN 'CHECK'
    WHEN 'f' THEN 'FOREIGN KEY'
    WHEN 'p' THEN 'PRIMARY KEY'
    WHEN 'u' THEN 'UNIQUE'
  END AS constraint_type_desc,
  pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'registrations';

-- View all indexes
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'registrations';

-- ============================================
-- PART 2: VERIFY RLS POLICIES
-- ============================================

-- View all RLS policies
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

-- ============================================
-- PART 3: TEST DATA INSERTION (ATTENDEE)
-- ============================================

-- Insert a test attendee registration
INSERT INTO registrations (
  name,
  cannot_attend,
  email,
  phone,
  arrival_date,
  departure_date,
  restrictions
) VALUES (
  'Test Attendee',
  FALSE,
  'test@example.com',
  '+1 555 123 4567',
  '2026-11-18',
  '2026-11-25',
  'Vegetarian'
);

-- Verify the insertion
SELECT 
  id,
  created_at,
  name,
  cannot_attend,
  email,
  phone,
  arrival_date,
  departure_date,
  restrictions
FROM registrations
WHERE name = 'Test Attendee';

-- ============================================
-- PART 4: TEST DATA INSERTION (NON-ATTENDEE)
-- ============================================

-- Insert a test non-attendee with wish
INSERT INTO registrations (
  name,
  cannot_attend,
  wish
) VALUES (
  'Test Well-Wisher',
  TRUE,
  'Have an amazing trip! Wish I could be there.'
);

-- Verify the insertion
SELECT 
  id,
  created_at,
  name,
  cannot_attend,
  wish,
  email,
  phone
FROM registrations
WHERE name = 'Test Well-Wisher';

-- ============================================
-- PART 5: TEST CONSTRAINTS
-- ============================================

-- Test 1: This should FAIL (attendee without email)
-- Uncomment to test:
-- INSERT INTO registrations (name, cannot_attend, phone, arrival_date, departure_date)
-- VALUES ('Bad Test 1', FALSE, '+1 555 999 9999', '2026-11-18', '2026-11-20');

-- Test 2: This should FAIL (attendee without phone)
-- Uncomment to test:
-- INSERT INTO registrations (name, cannot_attend, email, arrival_date, departure_date)
-- VALUES ('Bad Test 2', FALSE, 'bad@example.com', '2026-11-18', '2026-11-20');

-- Test 3: This should FAIL (attendee without dates)
-- Uncomment to test:
-- INSERT INTO registrations (name, cannot_attend, email, phone)
-- VALUES ('Bad Test 3', FALSE, 'bad@example.com', '+1 555 999 9999');

-- Test 4: This should FAIL (departure before arrival)
-- Uncomment to test:
-- INSERT INTO registrations (name, cannot_attend, email, phone, arrival_date, departure_date)
-- VALUES ('Bad Test 4', FALSE, 'bad@example.com', '+1 555 999 9999', '2026-11-25', '2026-11-18');

-- Test 5: This should SUCCEED (non-attendee with only name)
INSERT INTO registrations (name, cannot_attend)
VALUES ('Test Minimal', TRUE);

-- ============================================
-- PART 6: VIEW ALL REGISTRATIONS
-- ============================================

-- View all registrations with formatted output
SELECT 
  id,
  TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as registered_at,
  name,
  CASE 
    WHEN cannot_attend THEN 'Cannot Attend'
    ELSE 'Attending'
  END as status,
  wish,
  email,
  phone,
  TO_CHAR(arrival_date, 'Mon DD, YYYY') as arrival,
  TO_CHAR(departure_date, 'Mon DD, YYYY') as departure,
  restrictions
FROM registrations
ORDER BY created_at DESC;

-- Count registrations by type
SELECT 
  CASE 
    WHEN cannot_attend THEN 'Well-Wishers'
    ELSE 'Attendees'
  END as type,
  COUNT(*) as count
FROM registrations
GROUP BY cannot_attend
ORDER BY cannot_attend;

-- ============================================
-- PART 7: CLEANUP TEST DATA
-- ============================================

-- Delete test records (run this after testing)
-- Uncomment to clean up:
-- DELETE FROM registrations 
-- WHERE name IN ('Test Attendee', 'Test Well-Wisher', 'Test Minimal');

-- Verify cleanup
-- SELECT COUNT(*) as remaining_test_records 
-- FROM registrations 
-- WHERE name LIKE 'Test%';

-- ============================================
-- PART 8: PERFORMANCE CHECK
-- ============================================

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as "Times Used",
  idx_tup_read as "Tuples Read",
  idx_tup_fetch as "Tuples Fetched"
FROM pg_stat_user_indexes
WHERE tablename = 'registrations';

-- ============================================
-- VERIFICATION CHECKLIST
-- ============================================

/*
✓ Table 'registrations' exists
✓ RLS is enabled
✓ All columns present with correct types
✓ Primary key constraint exists
✓ Check constraints enforce data integrity
✓ Indexes created for performance
✓ RLS policies allow public inserts
✓ RLS policies prevent public reads
✓ Service role can read all data
✓ Test attendee insertion works
✓ Test non-attendee insertion works
✓ Constraints prevent invalid data
*/
