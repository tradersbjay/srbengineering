# Supabase Password Reset Implementation

## Overview
Implemented a complete password reset flow using Supabase Auth that:
- Allows users to request password resets from the admin login page
- Sends secure recovery emails with time-limited tokens
- Provides a dedicated reset password page (`/reset-password`)
- Stores new passwords securely in Supabase Auth

## How It Works

### 1. User Requests Password Reset
- On the admin login page (`#/srb-admin`), click "Forgot Password?"
- Enter your email address
- A recovery link is sent to your email

### 2. User Clicks Recovery Link
- The link redirects to: `https://yourdomain.com#/reset-password?access_token=...`
- The `ResetPassword` component parses the access token from the URL
- Supabase session is automatically set with the token

### 3. User Sets New Password
- On the reset password page, enter and confirm new password
- Click "Reset Password"
- The password is securely updated in Supabase Auth
- User is redirected to admin login

### 4. User Logs In
- Use the new password to sign in via Supabase Auth

---

## Setup Instructions

### Step 1: Configure Supabase Auth Email
In Supabase Dashboard:
1. Go to **Authentication → Email Templates**
2. Click **Edit** on the "Reset password" template
3. Ensure the `{{ .ConfirmationURL }}` contains your redirect:
   - Default: `{{ .SiteURL }}/auth/confirm?token={{ .Token }}&type=recovery`
   - **Change to**: `{{ .SiteURL }}/#/reset-password?access_token={{ .TokenHash }}`
   - Or let Supabase auto-handle (recommended)

### Step 2: Create Auth Users in Supabase
In Supabase Dashboard:
1. Go to **Authentication → Users**
2. Click **Invite user** (or **New user**)
3. Enter admin email: `info@srbeng.com`
4. Supabase sends an invite link
5. User clicks link to set password

### Step 3: Map Auth User to App Admin Role (Optional)
If you want to restrict CRUD to specific users, run this SQL:

```sql
INSERT INTO public.admin_users (email, role, created_at)
VALUES ('info@srbeng.com', 'admin', now())
ON CONFLICT (email) DO UPDATE
  SET role = EXCLUDED.role;
```

Then update RLS policies to check admin_users table (see `PRODUCTION_RLS_POLICIES.sql`).

### Step 4: Test the Flow Locally
1. Run dev server: `npm run dev`
2. Go to `http://localhost:3001/#/srb-admin`
3. Click "Forgot Password?"
4. Enter your Supabase auth user email
5. Check your inbox for recovery link
6. Click link → should land on reset password page
7. Set new password → should redirect to login

---

## File Changes

| File | Change |
|------|--------|
| `components/ResetPassword.tsx` | New: Dedicated password reset page component |
| `lib/auth.ts` | New: Auth helper functions (signIn, sendReset, etc.) |
| `components/Admin.tsx` | Updated: Supabase Auth sign-in + forgot password UI |
| `App.tsx` | Updated: Routing to detect reset token and show reset page |

---

## Key Functions

### `sendPasswordResetEmail(email: string)`
Sends a recovery email with reset link.
```ts
const result = await sendPasswordResetEmail('user@example.com');
if (result.success) {
  console.log('Email sent');
}
```

### `signInWithEmail(email: string, password: string)`
Signs in user with email/password.
```ts
const result = await signInWithEmail('user@example.com', 'password123');
if (result.success) {
  // User is now authenticated
}
```

### `signOutUser()`
Signs out current user.
```ts
await signOutUser();
```

---

## Security Notes

1. **Tokens are time-limited**: Supabase recovery tokens expire (usually 1 hour).
2. **HTTPS only**: Always use HTTPS in production; tokens can be intercepted over HTTP.
3. **Password requirements**: Supabase has default password policies (e.g., min 6 chars). Adjust in Dashboard → Authentication → Policies.
4. **Session storage**: Supabase automatically manages sessions in localStorage. Clear on logout.

---

## Troubleshooting

### Reset link redirects to homepage
**Problem**: URL doesn't reach the reset password page.
**Solution**: 
- Check `App.tsx` routing logic for `isResetPasswordPage` condition.
- Ensure token is in URL hash or query string.
- Verify Supabase email template has correct redirect URL.

### "No reset token found" message
**Problem**: Token missing or invalid.
**Solution**:
- Check email — click the link Supabase sent.
- Verify token in URL: `#access_token=...`.
- Token may be expired — request a new reset.

### "Failed to reset password" error
**Problem**: Supabase Auth rejected the update.
**Solution**:
- Check password meets Supabase policy (min 6 chars, etc.).
- Verify session is set (check browser DevTools → Application → localStorage for `sb-access-token`).
- Check Supabase logs for auth errors.

### User can't sign in after reset
**Problem**: Auth works but user gets "Invalid credentials".
**Solution**:
- Wait a few seconds — Supabase may be syncing.
- Clear browser localStorage and try again.
- Verify user is in Supabase Dashboard → Authentication → Users.

---

## Next Steps

1. **Apply Production RLS Policies** (if needed):
   - Run `supabase/PRODUCTION_RLS_POLICIES.sql` to restrict writes to authenticated users.

2. **Test with Real Supabase Project**:
   - Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`.
   - Create a test user in Supabase Dashboard.
   - Test full reset flow end-to-end.

3. **Email Customization** (optional):
   - Customize email template in Supabase Dashboard → Email Templates.
   - Add branding, custom message, etc.

4. **Monitor Password Resets**:
   - Supabase logs all auth events. Check Dashboard → Logs for password reset activity.
