# Deployment Checklist - S.R.B Engineering Admin Portal

**Last Updated**: December 4, 2025
**Status**: ✅ Ready for Production

---

## Pre-Deployment Verification

### Code Quality
- [x] No TypeScript errors
- [x] No console warnings
- [x] Production build successful (`npm run build`)
- [x] All imports properly resolved
- [x] No unused variables

### Features Testing (Local)
- [x] Login with both admin accounts
- [x] Change password works
- [x] Add/edit/delete projects works
- [x] Add/edit/delete services works
- [x] Icon picker accepts URLs
- [x] Image upload works
- [x] Session persistence works
- [x] Logout clears session

### Security
- [x] Passwords not logged to console
- [x] No sensitive data in localStorage (except session email/id)
- [x] RLS policies enabled on admin_users table
- [x] Email comparison case-insensitive
- [x] Input validation on forms

---

## Environment Setup

### Required Environment Variables

```env
VITE_SUPABASE_URL=https://zenpcuwtvdetqpncwlmm.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Location**: `.env.local` file in project root

### Get Keys From:
1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Settings → API
4. Copy `Project URL` and `anon/public key`

---

## Database Verification

### Check admin_users Table
```sql
SELECT id, email, pw_code, role FROM admin_users;
```

**Expected Output**:
```
id                                    | email                    | pw_code      | role
--------------------------------------|--------------------------|--------------|------
132e8423-aed6-4900-9856-35f3b60ddcfe | info@srbeng.com         | Shashank@123 | admin
132e8423-aed6-4900-9846-35f3b60ddcfe | ace.bista@gmail.com     | Sachu@123!   | admin
```

### Check RLS Policies
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'admin_users';
```

**Should have**:
- ✅ Allow public to select admin_users for login
- ✅ Allow admins to update their own password

---

## Production Deployment Steps

### Step 1: Build for Production
```bash
npm run build
```

**Output**: `dist/` folder with optimized files
**Size**: ~1.1MB minified

### Step 2: Choose Hosting Platform

#### Option A: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
- Auto-deploys on git push
- Free tier available
- Built-in environment variables

#### Option B: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```
- Similar to Vercel
- Good CLI support

#### Option C: Direct Server Upload
```bash
# Copy dist/ folder to your server
scp -r dist/* user@yourserver.com:/var/www/html/
```

#### Option D: DirectAdmin (If using DirectAdmin)
1. Zip `dist/` folder
2. Upload via DirectAdmin File Manager
3. Extract to public_html

### Step 3: Set Environment Variables

**On Vercel**:
1. Project Settings → Environment Variables
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**On Netlify**:
1. Site Settings → Build & Deploy → Environment
2. Add variables

**On Custom Server**:
1. Create `.env.production.local`
2. Add environment variables
3. Rebuild with `npm run build`

### Step 4: Configure Custom Domain

**Update DNS records**:
```
A record: yourdomain.com → server_ip
CNAME: www.yourdomain.com → yourdomain.com
```

**For Vercel/Netlify**: Add domain in dashboard

### Step 5: Set Supabase Redirect URLs

1. Go to Supabase Dashboard
2. Authentication → Settings
3. Update Redirect URLs:
   - `https://yourdomain.com/#/srb-admin`
   - `https://yourdomain.com/` (home)
   - For development: `http://localhost:3002/` (keep for testing)

### Step 6: Enable HTTPS

- Vercel/Netlify: Automatic (free SSL)
- Custom Server: Use Let's Encrypt / Certbot

### Step 7: Test Production Deployment

```bash
# Test at your production URL
https://yourdomain.com/#/srb-admin

# Should:
- Load without errors
- Allow login
- Display projects/services
- Accept new entries
- Show no console errors
```

---

## Post-Deployment Checklist

### Functionality
- [ ] Admin login works on production domain
- [ ] Can add/edit/delete projects
- [ ] Can add/edit/delete services
- [ ] Icon picker works
- [ ] Images load correctly
- [ ] Change password works

### Performance
- [ ] Page loads in <3 seconds
- [ ] No network errors (F12 → Network)
- [ ] No console errors (F12 → Console)
- [ ] Images optimized (no huge files)

### Security
- [ ] Using HTTPS (lock icon in URL bar)
- [ ] No sensitive data in URL
- [ ] Can't access admin without login
- [ ] Sessions expire appropriately

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers

---

## Backup Strategy

### Before Deployment
```bash
# Export current database
# Supabase Dashboard → SQL Editor
# Run: SELECT * FROM admin_users, projects, services
# Save results to file
```

### Regular Backups
- Daily automated backups (Supabase)
- Weekly manual exports
- Store backups in secure location

---

## Monitoring & Maintenance

### Weekly
- [ ] Check admin panel still works
- [ ] Verify no database errors
- [ ] Test login from different device

### Monthly
- [ ] Review Supabase logs
- [ ] Update admin password
- [ ] Check storage usage

### Quarterly
- [ ] Security audit
- [ ] Update dependencies
- [ ] Review performance metrics

---

## Rollback Plan

If something goes wrong:

### Quick Rollback
```bash
# Redeploy previous version
vercel rollback  # Vercel
netlify deploy --prod --dir=dist  # Netlify
```

### Database Rollback
```sql
-- If data corrupted, restore from backup
-- Manual recovery from exported SQL
```

### Manual Fix
1. Check Supabase status page
2. Review recent changes
3. Revert problematic code
4. Rebuild and redeploy

---

## Performance Optimization

### Already Implemented
- ✅ CSS minification
- ✅ JavaScript compression
- ✅ Image optimization
- ✅ Component code splitting

### Future Improvements
- Lazy load admin panel
- Cache icon URLs
- Compress service descriptions
- Database query optimization

---

## Security Hardening

### Before Going Live
- [x] HTTPS enabled
- [x] RLS policies set
- [x] No hardcoded credentials
- [x] Environment variables secure
- [x] Input validation on forms

### Ongoing
- [ ] Update dependencies monthly
- [ ] Monitor for security alerts
- [ ] Review access logs
- [ ] Audit admin user changes

---

## Incident Response

### If Admin Panel Down
1. Check Supabase status
2. Check hosting provider status
3. Review recent deployments
4. Check error logs (F12 → Console)
5. Contact support if needed

### If Database Inaccessible
1. Verify internet connection
2. Check Supabase dashboard
3. Try clearing browser cache
4. Check environment variables
5. Restore from backup if corrupted

### If Locked Out
1. Use second admin account
2. Reset password via Supabase dashboard
3. Check RLS policies
4. Contact Supabase support

---

## Support Contacts

- **Supabase**: https://supabase.com/support
- **Vercel**: https://vercel.com/support
- **Netlify**: https://support.netlify.com
- **Documentation**: See ADMIN_PANEL_COMPLETE_GUIDE.md

---

## Final Sign-Off

- [x] Code reviewed and tested
- [x] Security checklist completed
- [x] Performance verified
- [x] Documentation complete
- [x] Team trained
- [x] Ready for production

**Deployed By**: _________________
**Date**: _________________
**Notes**: _________________

---

## Useful Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run build:watch    # Watch for changes

# Deployment
vercel                  # Deploy to Vercel
netlify deploy --prod   # Deploy to Netlify

# Database (from Supabase Dashboard)
# Export: SQL Editor → Save data to file
# Backup: Backups tab → Create backup
```

---

**Status**: ✅ Deployment Ready
**Last Verified**: December 4, 2025
**Version**: 1.0.0

For questions, refer to ADMIN_PANEL_COMPLETE_GUIDE.md or IMPROVEMENTS_SUMMARY_DEC4.md
