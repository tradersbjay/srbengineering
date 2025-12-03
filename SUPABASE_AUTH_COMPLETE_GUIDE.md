# Complete Supabase Auth + Admin Setup Guide

## Quick Summary
You now have:
✅ Supabase Auth sign-in (email + password)
✅ Password reset flow with secure recovery emails
✅ Admin panel with login/logout
✅ Database CRUD operations (when authenticated)

---

## Step 1: Create Supabase Auth User

### Via Dashboard (Recommended)
1. Open your Supabase project: https://app.supabase.com/projects
2. Go to **Authentication → Users**
3. Click **Invite user** button
4. Enter email: `info@srbeng.com`
5. Supabase sends an invitation email
6. User clicks link in email to set password
7. Done!

### Via Admin API (Server-side only)
If you prefer programmatic creation, use this curl (run from secure server/terminal only):

```bash
curl -X POST "https://zenpcuwtvdetqpncwlmm.supabase.co/auth/v1/admin/users" \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"info@srbeng.com",
    "password":"Shashank@123",
    "email_confirm":true
  }'
```

**⚠️ WARNING**: Never expose your `SERVICE_ROLE_KEY`. Use Dashboard method instead.

---

## Step 2: Test Login Locally

1. Run dev server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3001/#/srb-admin`

3. You should see the login page with:
   - Email input
   - Password input
   - "Forgot Password?" link

4. Try logging in:
   - Email: `info@srbeng.com`
   - Password: (the password set during user creation)

---

## Step 3: Test Password Reset Flow

1. On login page, click **Forgot Password?**
2. Enter email: `info@srbeng.com`
3. Check your email inbox for recovery link
4. Click the link → redirects to reset password page
5. Enter new password (min 8 chars for this app)
6. Click "Reset Password"
7. Should see: "✅ Password reset successfully!"
8. You're redirected to login after 2 seconds
9. Log in with new password

---

## Step 4: (Optional) Set Admin Role in Database

If you want to restrict CRUD to specific admins (recommended for production):

1. Open Supabase Dashboard → SQL Editor
2. Run this SQL:

```sql
-- Upsert all existing auth users as admins
INSERT INTO public.admin_users (email, role, created_at)
SELECT email, 'admin', now()
FROM auth.users
WHERE email IS NOT NULL
ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      role  = EXCLUDED.role;
```

3. Then update RLS policies to check admin_users table (see `PRODUCTION_RLS_POLICIES.sql`).

---

## Step 5: Enable Production RLS Policies (Important!)

Currently, your RLS allows **any authenticated user** to read/write all data.

For production, you should:

1. Go to Supabase SQL Editor
2. Run `supabase/PRODUCTION_RLS_POLICIES.sql`
3. This restricts writes to users in `admin_users` table only
4. Public users can still READ projects/services/etc.

---

## Environment Variables Needed

Make sure your `.env.local` has:

```env
VITE_SUPABASE_URL=https://zenpcuwtvdetqpncwlmm.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these from Supabase Dashboard → Project Settings → API.

---

## File Structure

```
lib/
  auth.ts                    ← Auth helper functions
  supabase.ts                ← Supabase client setup

components/
  Admin.tsx                  ← Login + admin panel
  ResetPassword.tsx          ← Password reset page
  
App.tsx                      ← Routing (detects reset token)
```

---

## How It Works Internally

### Login Flow
1. User enters email + password on Admin.tsx
2. `signInWithEmail()` calls `supabase.auth.signInWithPassword()`
3. Supabase returns session token
4. `setIsAuthenticated(true)` shows admin panel
5. All CRUD ops now use the authenticated session

### Password Reset Flow
1. User clicks "Forgot Password?" on login page
2. `sendPasswordResetEmail()` calls `supabase.auth.resetPasswordForEmail()`
3. Supabase sends recovery email with link to `/#/reset-password?access_token=...`
4. User clicks link → ResetPassword component loads
5. Token is parsed and session is set with `supabase.auth.setSession()`
6. User enters new password
7. `supabase.auth.updateUser({password})` updates password
8. User redirected to login with new password

### Auth Session Management
- Supabase stores session in browser localStorage
- Session persists across page reloads
- Logout clears session from localStorage
- CRUD operations check session before executing

---

## Troubleshooting

### "No reset token found" on reset page
- Check email link — make sure you clicked the full link
- Check URL in browser — should contain `access_token=...`
- Token may have expired (usually 1 hour)

### Login fails with "Invalid credentials"
- Verify email/password in Supabase Dashboard → Authentication → Users
- Check that email is confirmed (has checkmark)
- Try resetting password

### Can't receive reset email
- Check spam/junk folder
- Verify email address is correct in Supabase
- Supabase may need SMTP setup for production (see Email settings)

### "Objects are not valid as a React child" error (icon picker)
- This was fixed — uses curated `SAFE_ICON_NAMES` list
- If error persists, check browser console for details

---

## Next Steps for Production

1. ✅ Create Supabase auth users
2. ✅ Test login + password reset locally
3. ⬜ Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in production
4. ⬜ Apply `PRODUCTION_RLS_POLICIES.sql` if restricting to admins
5. ⬜ Deploy to hosting (Vercel, Netlify, etc.)
6. ⬜ Test full flow on live domain
7. ⬜ Monitor Supabase logs for auth issues

---

## Support / Resources

- Supabase Docs: https://supabase.com/docs
- Auth Methods: https://supabase.com/docs/guides/auth
- Password Reset: https://supabase.com/docs/reference/javascript/auth-resend
- RLS Policies: https://supabase.com/docs/guides/auth/row-level-security
