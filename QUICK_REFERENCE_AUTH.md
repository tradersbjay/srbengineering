# Quick Reference: Supabase Auth & Admin Setup

## 🚀 5-Minute Quick Start

### 1. Environment Setup
```bash
# Create .env.local with:
VITE_SUPABASE_URL=https://zenpcuwtvdetqpncwlmm.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Run Dev Server
```bash
npm run dev
# Opens http://localhost:3001
```

### 3. Create Admin User in Supabase
Dashboard → Authentication → Users → "Invite user"
- Email: `info@srbeng.com`
- User sets password via email link

### 4. Test Login
- Go to `http://localhost:3001/#/srb-admin`
- Enter email + password
- Should see admin dashboard

### 5. Test Password Reset
- Click "Forgot Password?"
- Check email for link
- Click link → set new password
- Login with new password

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `lib/auth.ts` | Auth functions (signin, reset, logout) |
| `components/Admin.tsx` | Login UI + admin panel |
| `components/ResetPassword.tsx` | Password reset page |
| `DataContext.tsx` | CRUD operations |

---

## 🔑 Auth Functions

```ts
import { signInWithEmail, sendPasswordResetEmail, signOutUser } from '../lib/auth';

// Login
const result = await signInWithEmail(email, password);
if (result.success) {
  // User is authenticated
}

// Send reset email
const result = await sendPasswordResetEmail(email);
if (result.success) {
  // Recovery link sent
}

// Logout
await signOutUser();
```

---

## 🧪 Testing Checklist

- [ ] Login works
- [ ] Logout works
- [ ] Add project works
- [ ] Edit project works
- [ ] Delete project works
- [ ] Add service works
- [ ] Icon picker shows icons
- [ ] Password reset email received
- [ ] Password reset works
- [ ] Contact form service dropdown updated

---

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Invalid credentials" on login | Verify email exists in Supabase → Auth Users |
| Reset email not received | Check spam folder or create user again |
| Icon picker shows only wrenches | Clear browser cache, refresh page |
| CORS errors | Verify VITE_SUPABASE_URL in .env.local |
| Login page not showing | Go to `/#/srb-admin` explicitly |

---

## 📊 Deployment

```bash
# Build for production
npm run build

# Deploy dist/ folder to:
# - Vercel: vercel deploy --prod --dir=dist
# - Netlify: netlify deploy --prod --dir=dist
# - Self-hosted: scp -r dist/* server:/var/www/
```

**Set environment variables in hosting platform's dashboard**

---

## 🔒 Security Checklist

- ✅ Use HTTPS in production
- ✅ Never expose service role key
- ✅ Keep password strong (min 8 chars)
- ✅ Monitor auth logs (Supabase Dashboard)
- ✅ Apply PRODUCTION_RLS_POLICIES.sql for strict access
- ✅ Regular backups of database

---

## 📞 Help

- **Supabase**: https://supabase.com/docs
- **Auth**: https://supabase.com/docs/guides/auth
- **Database**: https://supabase.com/docs/guides/database

---

## Full Documentation

1. `COMPLETE_SETUP_GUIDE.md` - Step-by-step setup
2. `SUPABASE_AUTH_COMPLETE_GUIDE.md` - Auth details
3. `PASSWORD_RESET_GUIDE.md` - Reset implementation
4. `SUPABASE_ADMIN_COMPLETE_SUMMARY.md` - Feature overview

---

**Everything is ready! You can now:**
✅ Login securely  
✅ Reset passwords  
✅ Manage projects & services  
✅ Deploy to production  

Happy coding! 🎉
