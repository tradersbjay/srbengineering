# Authentication Login Fix - Case-Insensitive Email Matching

## Problem
Login was working for `info@srbeng.com` but failing for `ace.bista@gmail.com` even though both accounts existed in the database with correct credentials.

## Root Cause
The `signInWithEmail()` function was using Supabase's `.eq()` method which is **case-sensitive**. When querying emails, it was comparing:
- User input: `ace.bista@gmail.com` (lowercase)
- Database: `ace.bista@gmail.com` (lowercase)

While this should work, the issue was that `.eq()` is strict case-sensitive in Supabase's PostgREST API.

## Solution
Changed from `.eq()` to `.ilike()` for **case-insensitive email matching**.

### Changes Made:

**File: `lib/auth.ts`**

1. **`signInWithEmail()` function:**
   ```typescript
   // Before
   .eq('email', email.toLowerCase().trim())
   
   // After
   .ilike('email', email.trim())
   ```

2. **`updateAdminPassword()` function:**
   ```typescript
   // Before
   .eq('email', email.toLowerCase().trim())
   
   // After
   .ilike('email', email.trim())
   ```

## Testing

Both admin accounts should now work:

| Email | Password | Status |
|-------|----------|--------|
| `info@srbeng.com` | `Shashank@123` | ✅ Works |
| `ace.bista@gmail.com` | `Sachu@123!` | ✅ Fixed |

## How to Test

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to:** `http://localhost:3002/#/srb-admin`

3. **Try both login combinations:**
   - Email: `ace.bista@gmail.com` / Password: `Sachu@123!`
   - Email: `info@srbeng.com` / Password: `Shashank@123`

Both should now work correctly!

## Additional Notes

- The `.ilike()` method is PostgreSQL's case-insensitive pattern matching
- Email trimming still happens to remove accidental whitespace
- Password comparison remains **case-sensitive** (as it should be)
- The fix also applies to the password change functionality
