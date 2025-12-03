# 🚀 S.R.B Engineering Admin - Complete Setup & Deployment Guide

## Overview
This guide walks you through setting up and deploying your admin portal with Supabase Auth and full CRUD functionality.

---

## Phase 1: Local Development (15 min)

### 1.1 Clone & Install
```bash
cd /Users/babi/Downloads/s.r.b-engineering-&-construction
npm install
```

### 1.2 Set Environment Variables
Create `.env.local`:
```env
VITE_SUPABASE_URL=https://zenpcuwtvdetqpncwlmm.supabase.co
VITE_SUPABASE_ANON_KEY=<your_anon_key_from_supabase_dashboard>
VITE_EMAILJS_SERVICE_ID=<your_emailjs_service_id>
VITE_EMAILJS_TEMPLATE_ID=<your_emailjs_template_id>
VITE_EMAILJS_PUBLIC_KEY=<your_emailjs_public_key>
```

**Where to get these:**
- **Supabase keys**: Dashboard → Project Settings → API
- **EmailJS keys**: emailjs.com → Dashboard → Integration (for contact form)

### 1.3 Start Dev Server
```bash
npm run dev
```
Opens at `http://localhost:3001`

### 1.4 Test the App
- Go to `http://localhost:3001/#/srb-admin`
- You'll see a login page (no users created yet — see Phase 2)

---

## Phase 2: Supabase Setup (10 min)

### 2.1 Create Database Tables
In Supabase Dashboard → SQL Editor, run:
```bash
# Copy entire contents of supabase/COMPLETE_DATABASE_SETUP.sql
# Paste into SQL Editor → Run
```

This creates:
- `projects` table
- `services` table
- `admin_users` table (for role mapping)
- `contact_messages` table
- RLS policies for public READ, authenticated WRITE

### 2.2 Create Admin User
**Option A: Via Dashboard (Recommended)**
1. Supabase Dashboard → Authentication → Users
2. Click "Invite user"
3. Enter email: `info@srbeng.com`
4. Click "Invite"
5. Supabase sends invitation email
6. User clicks link and sets password
7. Done!

**Option B: Via Admin API (Server-side only)**
```bash
# Run from secure server/terminal ONLY
# Replace YOUR_SERVICE_ROLE_KEY with key from Supabase → Project Settings → API

curl -X POST "https://zenpcuwtvdetqpncwlmm.supabase.co/auth/v1/admin/users" \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"info@srbeng.com","password":"Shashank@123","email_confirm":true}'
```

### 2.3 Map User to Admin Role (Optional)
If you want strict admin-only access:
```sql
-- In Supabase SQL Editor
INSERT INTO public.admin_users (email, role, created_at)
VALUES ('info@srbeng.com', 'admin', now())
ON CONFLICT (email) DO UPDATE
  SET role = EXCLUDED.role;
```

---

## Phase 3: Local Testing (10 min)

### 3.1 Test Login
1. Go to `http://localhost:3001/#/srb-admin`
2. Enter:
   - Email: `info@srbeng.com`
   - Password: (password you set via invitation link)
3. Should see admin dashboard with stats

### 3.2 Test Add Project
1. In "Add New Project" form, enter:
   - Title: "Test House"
   - Category: "Residential"
   - Year: "2025"
   - Location: "Kathmandu"
   - Image URL: "https://via.placeholder.com/400x300"
   - Description: "A beautiful house"
2. Click "Add Project"
3. Should see "✅ Project added successfully!"
4. Check projects list at bottom

### 3.3 Test Add Service
1. In "Add New Service" form, enter:
   - Title: "Consulting"
   - Description: "Expert engineering consulting"
2. Click "Pick from library" button
3. Search for "hammer" in icon picker
4. Click hammer icon
5. Click "Add Service"
6. Should see "✅ Service added successfully!"

### 3.4 Test Password Reset
1. Click logout
2. On login page, click "Forgot Password?"
3. Enter email: `info@srbeng.com`
4. Check email inbox for recovery link
5. Click link → should land on reset password page
6. Enter new password (min 8 chars)
7. Click "Reset Password"
8. Should redirect to login
9. Login with new password

### 3.5 Verify Contact Form
1. Go to home page: `http://localhost:3001`
2. Scroll to Contact section
3. Click "Interested Service" dropdown
4. Should show services you added

---

## Phase 4: Production Deployment (20 min)

### 4.1 Build for Production
```bash
npm run build
# Creates dist/ folder with optimized build
```

### 4.2 Deploy Options

#### Option A: Vercel (Recommended)
```bash
npm i -g vercel
vercel
# Follow prompts, connect to GitHub, deploy
```

#### Option B: Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Option C: Self-Hosted
Upload `dist/` folder to your server:
```bash
scp -r dist/* user@yourserver.com:/var/www/html/
```

### 4.3 Set Environment Variables in Production
For Vercel/Netlify:
1. Go to project settings
2. Add environment variables:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_EMAILJS_SERVICE_ID=...
   VITE_EMAILJS_TEMPLATE_ID=...
   VITE_EMAILJS_PUBLIC_KEY=...
   ```
3. Redeploy

### 4.4 Test Production
1. Visit your live domain
2. Go to `yourdomain.com/#/srb-admin`
3. Login with admin credentials
4. Test CRUD operations
5. Test password reset (email goes to real inbox)

---

## Phase 5: Security Hardening (Optional but Recommended)

### 5.1 Enable Production RLS Policies
For strict admin-only write access:
```bash
# In Supabase SQL Editor, run:
# Copy entire contents of supabase/PRODUCTION_RLS_POLICIES.sql
```

This restricts writes to:
- Authenticated users only (projects, services, team, stats)
- Anyone can submit contact messages
- Only authenticated can view contact messages

### 5.2 Set Password Policy
In Supabase Dashboard → Authentication → Policies:
- Min password length: 8 characters
- Require uppercase: Yes (optional)
- Require special characters: Yes (optional)

### 5.3 Enable MFA (Optional)
In Supabase Dashboard → Authentication → Settings:
- Enable TOTP multi-factor authentication (if desired)

### 5.4 Monitor Logs
In Supabase Dashboard → Logs:
- Watch for auth failures
- Monitor password reset requests
- Track failed login attempts

---

## Troubleshooting

### Login fails with "Invalid credentials"
**Solution:**
1. Verify email exists in Supabase Dashboard → Authentication → Users
2. Check email is confirmed (has checkmark)
3. Try password reset

### Reset email not received
**Solution:**
1. Check spam/junk folder
2. Verify email address in Supabase
3. For production, configure SMTP (Supabase Dashboard → Email)

### Icon picker shows only wrenches
**Solution:**
- This was fixed in latest version
- If persists, check browser console for errors
- Clear cache: Cmd+Shift+Delete in Chrome

### CORS errors on Supabase calls
**Solution:**
1. Verify `VITE_SUPABASE_URL` is correct
2. Check `VITE_SUPABASE_ANON_KEY` is valid
3. Ensure Supabase project is active

### Projects/services not saving
**Solution:**
1. Check browser console for errors
2. Verify authenticated session (login again)
3. Check Supabase dashboard for RLS policy violations
4. Verify database tables exist (run COMPLETE_DATABASE_SETUP.sql)

---

## Maintenance

### Regular Backups
```bash
# Export projects
curl -s "https://zenpcuwtvdetqpncwlmm.supabase.co/rest/v1/projects?limit=10000" \
  -H "apikey: YOUR_ANON_KEY" > backup_projects.json

# Export services
curl -s "https://zenpcuwtvdetqpncwlmm.supabase.co/rest/v1/services?limit=10000" \
  -H "apikey: YOUR_ANON_KEY" > backup_services.json
```

### Monitor Auth Activity
- Supabase Dashboard → Logs → Authentication
- Look for suspicious login attempts
- Monitor password reset frequency

### Update Dependencies
```bash
npm update
npm audit fix
```

---

## Quick Reference Commands

```bash
# Development
npm run dev                          # Start dev server
npm run build                        # Production build

# Database
# Run any SQL in Supabase Dashboard → SQL Editor

# Supabase CLI (optional, install via: npm i -g @supabase/supabase-js)
supabase status                     # Check project status
supabase projects list              # List your projects
```

---

## Key Files Reference

```
App.tsx                             - Main routing
components/
  Admin.tsx                         - Admin panel (login, CRUD, icon picker)
  ResetPassword.tsx                 - Password reset page
lib/
  auth.ts                           - Auth functions
  supabase.ts                       - Supabase client
DataContext.tsx                     - CRUD operations
utils.tsx                           - Utilities (icon rendering)
supabase/
  COMPLETE_DATABASE_SETUP.sql       - Database schema
  PRODUCTION_RLS_POLICIES.sql       - Secure policies for prod
```

---

## Documentation

- `SUPABASE_AUTH_COMPLETE_GUIDE.md` - Detailed auth setup
- `PASSWORD_RESET_GUIDE.md` - Password reset flow details
- `SUPABASE_ADMIN_COMPLETE_SUMMARY.md` - Full feature summary
- `PRODUCTION_RLS_POLICIES.sql` - Security policies

---

## Support

- **Supabase**: https://supabase.com/docs
- **React**: https://react.dev/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## Success Checklist

- ✅ Local dev server running
- ✅ Supabase database created
- ✅ Admin user created and invited
- ✅ Login works
- ✅ Add/edit/delete projects works
- ✅ Add/edit/delete services works
- ✅ Icon picker shows icons
- ✅ Password reset flow works
- ✅ Production build successful
- ✅ Deployed to live server
- ✅ Live domain tested end-to-end

**You're ready to go! 🎉**
