# DirectAdmin Deployment Guide for SRB Engineering

**Quick Reference:** Deploy your S.R.B website to DirectAdmin in 15 minutes

---

## Prerequisites

- ✅ DirectAdmin account with srbeng.com domain
- ✅ SSH/SFTP access (or DirectAdmin File Manager)
- ✅ Local `.env.local` file with credentials (included)

---

## Step 1: Build Production Bundle

On your local machine:

```bash
cd /Users/babi/Downloads/s.r.b-engineering-&-construction
npm run build
```

**Expected Output:**
```
✓ built in 1.31s
dist/
  ├── index.html
  ├── assets/
  │   ├── index-xxx.js
  │   ├── index-xxx.css
  │   └── other files...
```

**Size Check:** Should be ~300KB total (uncompressed)

---

## Step 2: Upload to DirectAdmin

### Option A: Using SFTP (Recommended)

```bash
# From your local machine
sftp admin@srbeng.com  # or your DirectAdmin IP

# Once connected:
cd public_html
lcd /Users/babi/Downloads/s.r.b-engineering-&-construction/dist

# Delete old files first
rm -rf *

# Upload new build
put -r ./*

# Verify upload
ls -la

# Exit
bye
```

### Option B: Using DirectAdmin File Manager

1. Log in to DirectAdmin Control Panel
2. Navigate to: **File Manager**
3. Go to: **public_html/**
4. Delete existing files (except `.htaccess`)
5. Upload `dist/` contents:
   - `index.html`
   - `assets/` folder
   - All files from `dist/`

---

## Step 3: Create .env.local on Server

### Via DirectAdmin File Manager:

1. In **public_html/**, click **"New File"**
2. Name: `.env.local`
3. Copy and paste this content:

```bash
GEMINI_API_KEY=PLACEHOLDER_API_KEY

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_6icbh5e
VITE_EMAILJS_TEMPLATE_ID=template_7supbk7
VITE_EMAILJS_PUBLIC_KEY=CfMFd7I-JWmaqUQYD
VITE_EMAILJS_FROM_EMAIL=info@srbeng.com
VITE_EMAILJS_RECIPIENT_EMAIL=shashank@srbeng.com
```

4. Click **"Save"**

### Via SSH:

```bash
ssh admin@srbeng.com

cd public_html

cat > .env.local << 'EOF'
GEMINI_API_KEY=PLACEHOLDER_API_KEY

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_6icbh5e
VITE_EMAILJS_TEMPLATE_ID=template_7supbk7
VITE_EMAILJS_PUBLIC_KEY=CfMFd7I-JWmaqUQYD
VITE_EMAILJS_FROM_EMAIL=info@srbeng.com
VITE_EMAILJS_RECIPIENT_EMAIL=shashank@srbeng.com
EOF

chmod 600 .env.local  # Secure file permissions
```

---

## Step 4: Create .htaccess for SPA Routing

### Via DirectAdmin File Manager:

1. In **public_html/**, create **New File**
2. Name: `.htaccess`
3. Copy this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite if requesting actual files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite all requests to index.html (for React Router)
  RewriteRule ^(.*)$ index.html [L]
</IfModule>
```

4. Click **"Save"**

---

## Step 5: Configure SSL/HTTPS

### In DirectAdmin Control Panel:

1. Go to: **SSL Certificates**
2. Select: **srbeng.com**
3. Click: **"Issue/Renew AutoSSL"**
4. Wait: 2-5 minutes (usually automatic)
5. Verify: Green padlock in browser

---

## Step 6: DNS Configuration (If Needed)

### If domain not yet pointing to DirectAdmin:

In your domain registrar (GoDaddy, Namecheap, etc.):

1. Update **A Record:**
   - Name: `@`
   - Value: `[Your DirectAdmin Server IP]`
   - TTL: 3600

2. Update **CNAME Records:**
   - Name: `www`
   - Value: `srbeng.com`
   - TTL: 3600

3. Wait 24-48 hours for DNS propagation

**Check DNS Status:**
```bash
nslookup srbeng.com
# Should show your DirectAdmin server IP
```

---

## Step 7: Test Deployment

### Test URL Access:

1. **Browser Test:**
   ```
   https://srbeng.com
   ```
   - Page should load
   - No 404 errors
   - All images display

2. **Mobile Test:**
   - Test on phone/tablet
   - Verify responsive design
   - Check touch interactions

3. **Admin Panel Test:**
   ```
   https://srbeng.com/admin
   ```
   - Can you access admin?
   - Can you add a project?
   - Does it save locally? (in that browser)

4. **Contact Form Test:**
   ```
   https://srbeng.com#contact
   ```
   - Fill out form
   - Click "Send Message"
   - Check shashank@srbeng.com for email
   - Email should say "From: info@srbeng.com"

---

## Step 8: Verify Email Delivery

### Troubleshooting Email:

**If email not arriving:**

1. **Check spam folder** in shashank@srbeng.com
   - Mark as "Not Spam"

2. **Verify credentials in .env.local:**
   ```bash
   cat public_html/.env.local
   ```
   - Should show correct SERVICE_ID
   - Should show correct TEMPLATE_ID
   - Should show correct PUBLIC_KEY
   - Should show correct RECIPIENT_EMAIL

3. **Test via EmailJS Dashboard:**
   - Go to: https://dashboard.emailjs.com
   - Login with your account
   - Check "Activity" tab for failed sends
   - Verify template format is correct

4. **Check browser console for errors:**
   - Open DevTools (F12)
   - Go to "Console" tab
   - Look for red error messages
   - Report any errors

---

## Step 9: Final Verification Checklist

- [ ] Site loads at https://srbeng.com
- [ ] HTTPS/SSL working (green padlock)
- [ ] All pages accessible (Hero, Projects, Services, About, Contact, Admin)
- [ ] Images loading correctly
- [ ] Mobile responsive (test on phone)
- [ ] Contact form submits without errors
- [ ] Email arrives at shashank@srbeng.com
- [ ] Email "From" shows as info@srbeng.com
- [ ] Admin panel loads at /admin
- [ ] Can make changes in admin (saves to browser)
- [ ] No TypeScript errors in console
- [ ] No 404 errors for any resources

---

## Common Issues & Solutions

### Issue: "404 Not Found" on page refresh

**Solution:** .htaccess not working properly
```bash
# Verify .htaccess exists and is readable:
cat public_html/.htaccess

# Check Apache mod_rewrite is enabled:
# Contact DirectAdmin support if needed
```

---

### Issue: Environment variables not loading

**Solution:** Variables not in .env.local or not readable
```bash
# Check file exists:
ls -la public_html/.env.local

# Check permissions (should be -rw-------):
chmod 600 public_html/.env.local

# Check content:
cat public_html/.env.local
```

---

### Issue: Email not sending from info@srbeng.com

**Solution:** Check EmailJS template configuration
1. Log in to EmailJS dashboard
2. Edit template to include {{from_email}} variable
3. Set "From" field to: {{from_email}}
4. Save and test

---

### Issue: Contact form says "Unexpected error"

**Solution:** Check browser console for details
1. Open DevTools (F12)
2. Go to Console tab
3. Submit form again
4. Look for error messages
5. Common causes:
   - Missing environment variables
   - Invalid credentials
   - Network issue
   - Wrong template ID

---

### Issue: HTTPS not working

**Solution:** Renew SSL certificate
```bash
# Via SSH:
ssh admin@srbeng.com

# Navigate to DirectAdmin:
# Control Panel > SSL Certificates > Issue AutoSSL for srbeng.com

# Or force renew:
/usr/local/directadmin/custombuild/build rewrite_confs
/usr/local/directadmin/custombuild/build apache
systemctl restart httpd
```

---

## Performance Optimization (Optional)

### Enable Gzip Compression:

Add to `.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

### Browser Caching:

Add to `.htaccess`:
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access 1 hour"
  ExpiresByType image/* "access 1 year"
  ExpiresByType application/javascript "access 1 year"
  ExpiresByType text/css "access 1 year"
</IfModule>
```

---

## Rollback Plan (If Something Goes Wrong)

### Backup Before Deploying:

```bash
# On DirectAdmin server:
cd public_html
tar -czf backup-$(date +%Y%m%d_%H%M%S).tar.gz *

# Download backup:
sftp admin@srbeng.com
cd public_html
get backup-*.tar.gz
```

### Restore Previous Version:

```bash
# If deployment goes wrong:
cd public_html
rm -rf *
tar -xzf backup-20231203_120000.tar.gz

# Your old site is back!
```

---

## Post-Deployment Monitoring

### Daily Checks:

1. **Site accessibility:**
   ```bash
   curl -I https://srbeng.com
   # Should return: HTTP/2 200
   ```

2. **Email delivery:**
   - Send test message via contact form
   - Verify email arrives at shashank@srbeng.com

3. **Performance:**
   - Load time should be <2 seconds
   - Test on slow 3G (DevTools throttling)

### Weekly Checks:

1. Check SSL certificate expiration
2. Verify all pages load correctly
3. Test contact form functionality
4. Review any error logs

---

## DirectAdmin Account Maintenance

### Recommended Settings:

1. **Auto SSL Renewal:** Enable (default)
2. **Automatic Backups:** Enable if available
3. **Email Forwarding:** Set up info@srbeng.com → shashank@srbeng.com
4. **DNS Management:** Configure auto-renewal for domain

---

## Support Resources

- **DirectAdmin Docs:** https://www.directadmin.com/features.html
- **EmailJS Setup:** https://www.emailjs.com/docs/
- **React SPA Routing:** Standard .htaccess rules work with Vite builds
- **SSL/HTTPS:** DirectAdmin handles automatically with AutoSSL

---

## Quick Command Reference

```bash
# SSH Connection
ssh admin@srbeng.com

# Navigate to app
cd public_html

# View .env.local (verify credentials)
cat .env.local

# View .htaccess (verify routing)
cat .htaccess

# Check file permissions
ls -la

# Secure .env.local
chmod 600 .env.local

# View recent changes
ls -lt | head -20

# Clear browser cache (tell users)
# Ctrl+Shift+Delete (Windows/Linux)
# Cmd+Shift+Delete (Mac)
```

---

## Success Indicators ✅

After deployment, you should see:

- ✅ Website accessible at https://srbeng.com
- ✅ All pages load without 404 errors
- ✅ Contact form sends emails to shashank@srbeng.com
- ✅ Admin panel works for making local changes
- ✅ SSL certificate valid (green padlock)
- ✅ Mobile responsive design working
- ✅ No console errors in DevTools
- ✅ Load time <2 seconds
- ✅ Email delivery 100% success rate

---

## You're All Set! 🚀

Your S.R.B Engineering & Construction website is ready for DirectAdmin deployment.

**Time estimate:** 15-30 minutes
**Difficulty:** Beginner-friendly
**Downtime:** ~5 minutes during upload

---

**Questions?** Refer to:
- DEPLOYMENT_READINESS_ASSESSMENT.md - Architecture overview
- ENVIRONMENT_VARIABLES_GUIDE.md - Env var setup
- CONTACT_FORM_IMPLEMENTATION.md - Email troubleshooting
- SECURITY_CHECKLIST.md - Security best practices
