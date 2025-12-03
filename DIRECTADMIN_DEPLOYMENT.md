# DirectAdmin Deployment Guide
## S.R.B Engineering & Construction Website

---

## 📋 Prerequisites

- DirectAdmin hosting account
- FTP/SFTP access or File Manager access
- PHP 7.4 or higher
- MySQL database (optional, for future backend)

---

## 🚀 Deployment Steps

### Step 1: Build the Project Locally

1. Open terminal in the project directory
2. Run the build command:
   ```bash
   npm run build
   ```
3. This creates a `dist/` folder with all production files

### Step 2: Access DirectAdmin

1. Log in to your DirectAdmin panel
2. Navigate to **File Manager** or use FTP client (FileZilla, etc.)

### Step 3: Upload Files

#### Option A: Using DirectAdmin File Manager

1. Go to **File Manager** in DirectAdmin
2. Navigate to `public_html/` (or `domains/yourdomain.com/public_html/`)
3. Delete any existing `index.html` or default files
4. Upload ALL files from the `dist/` folder:
   - `index.html`
   - `assets/` folder (contains CSS and JS)
5. Upload the `upload-image.php` file to the same directory

#### Option B: Using FTP Client

1. Connect to your server via FTP:
   - Host: your-domain.com or server IP
   - Username: your DirectAdmin username
   - Password: your DirectAdmin password
   - Port: 21 (or 22 for SFTP)

2. Navigate to `public_html/`
3. Upload all files from `dist/` folder
4. Upload `upload-image.php`

### Step 4: Create Uploads Directory

1. In DirectAdmin File Manager or FTP:
2. Create a new folder: `uploads/`
3. Inside `uploads/`, create: `projects/`
4. Set permissions:
   - `uploads/` → 755
   - `uploads/projects/` → 755

**Via DirectAdmin File Manager:**
- Right-click folder → Permissions → Set to 755

**Via FTP:**
- Right-click folder → File Permissions → 755

**Via SSH (if available):**
```bash
mkdir -p uploads/projects
chmod 755 uploads
chmod 755 uploads/projects
```

### Step 5: Configure PHP Settings (if needed)

1. In DirectAdmin, go to **PHP Settings** or **PHP Configuration**
2. Ensure these settings:
   ```ini
   upload_max_filesize = 10M
   post_max_size = 10M
   max_execution_time = 60
   memory_limit = 128M
   ```

3. If using `.htaccess`, add:
   ```apache
   php_value upload_max_filesize 10M
   php_value post_max_size 10M
   php_value max_execution_time 60
   php_value memory_limit 128M
   ```

### Step 6: Test the Website

1. Visit your domain: `https://yourdomain.com`
2. Check all pages load correctly
3. Test navigation and smooth scrolling
4. Verify images display properly

### Step 7: Test Admin Panel

1. Navigate to: `https://yourdomain.com/#/srb-admin`
2. Login with:
   - **Email**: `info@srbeng.com`
   - **Password**: `Shashank@123`
3. Test adding a project with image upload
4. Verify image uploads to `uploads/projects/`
5. Check image displays on the main site

---

## 🔒 Security Hardening

### 1. Protect Admin Credentials

**Change default credentials** in `assets/index-*.js`:
- This requires editing the built JavaScript file
- Better: Implement proper backend authentication

### 2. Secure Upload Directory

Create `.htaccess` in `uploads/` folder:

```apache
# Prevent PHP execution in uploads directory
<FilesMatch "\.(php|php3|php4|php5|phtml)$">
    Order Deny,Allow
    Deny from all
</FilesMatch>

# Allow only image files
<FilesMatch "\.(jpg|jpeg|png|gif|webp)$">
    Order Allow,Deny
    Allow from all
</FilesMatch>
```

### 3. Protect upload-image.php

Add authentication check to `upload-image.php`:

```php
// Add at the top of upload-image.php after <?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}
```

### 4. Enable HTTPS

1. In DirectAdmin, go to **SSL Certificates**
2. Use **Let's Encrypt** for free SSL
3. Enable **Force SSL/HTTPS**

### 5. Set Proper File Permissions

```bash
# Files should be 644
find public_html -type f -exec chmod 644 {} \;

# Directories should be 755
find public_html -type d -exec chmod 755 {} \;

# upload-image.php should be 644
chmod 644 public_html/upload-image.php
```

---

## 📁 Final Directory Structure

```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
├── upload-image.php
├── uploads/
│   └── projects/
│       ├── project_1234567890_abc123.jpg
│       └── project_1234567891_def456.png
└── .htaccess (optional)
```

---

## 🔧 Troubleshooting

### Issue: Images not uploading

**Check:**
1. `uploads/projects/` directory exists
2. Directory permissions are 755
3. PHP upload settings are correct
4. Check PHP error log in DirectAdmin

**Solution:**
```bash
chmod 755 uploads
chmod 755 uploads/projects
```

### Issue: "Failed to upload image"

**Check:**
1. File size (must be < 5MB)
2. File type (only images allowed)
3. PHP `upload_max_filesize` setting

**Solution:**
- Reduce image size before upload
- Increase PHP limits in DirectAdmin

### Issue: Admin login not working

**Check:**
1. Correct credentials: `info@srbeng.com` / `Shashank@123`
2. Clear browser cache
3. Check browser console for errors

### Issue: 404 errors for uploaded images

**Check:**
1. Image URL in database/LocalStorage
2. File actually exists in `uploads/projects/`
3. Correct file permissions

**Solution:**
```bash
# Check if file exists
ls -la uploads/projects/

# Fix permissions
chmod 644 uploads/projects/*.jpg
chmod 644 uploads/projects/*.png
```

### Issue: Website shows DirectAdmin default page

**Solution:**
1. Ensure `index.html` is in the correct directory
2. Check DirectAdmin → Domain Setup → Document Root
3. Clear browser cache

---

## 🔄 Updating the Website

### To Update Content:
1. Use the admin panel at `/#/srb-admin`
2. Add/Edit/Delete projects and services
3. Changes are saved automatically

### To Update Code:
1. Make changes locally
2. Run `npm run build`
3. Upload new files from `dist/` to server
4. **Note**: This will overwrite `index.html` and `assets/`

---

## 📊 Monitoring & Maintenance

### Check Upload Directory Size

Via DirectAdmin File Manager:
- Navigate to `uploads/projects/`
- View total size

Via SSH:
```bash
du -sh uploads/projects/
```

### Clean Old Images

Manually delete unused images:
1. Go to File Manager
2. Navigate to `uploads/projects/`
3. Delete old/unused images

Or via SSH:
```bash
# Delete images older than 90 days
find uploads/projects/ -type f -mtime +90 -delete
```

### Backup

**Regular Backups:**
1. DirectAdmin → Backups → Create Backup
2. Include:
   - Website files
   - `uploads/` directory
   - Database (if using)

**Manual Backup:**
```bash
# Via SSH
tar -czf backup-$(date +%Y%m%d).tar.gz public_html/
```

---

## 🌐 Domain Configuration

### If using subdomain:

1. DirectAdmin → Subdomain Management
2. Create subdomain: `www.yourdomain.com`
3. Point to `public_html/`

### If using custom domain:

1. Update DNS records:
   - A Record: Point to server IP
   - CNAME: www → yourdomain.com

2. Wait for DNS propagation (up to 48 hours)

---

## 📧 Email Configuration

Update contact form email (future enhancement):

1. In DirectAdmin → Email Accounts
2. Create: `info@srbeng.com`
3. Configure SMTP settings for contact form

---

## 🔐 Admin Credentials

**Current Login:**
- **URL**: `https://yourdomain.com/#/srb-admin`
- **Email**: `info@srbeng.com`
- **Password**: `Shashank@123`

**⚠️ IMPORTANT**: Change these credentials before going live!

---

## 📝 Post-Deployment Checklist

- [ ] Website loads at your domain
- [ ] All pages and sections display correctly
- [ ] Images load properly
- [ ] Navigation works smoothly
- [ ] Mobile responsive design verified
- [ ] Admin panel accessible
- [ ] Admin login works
- [ ] Image upload functionality tested
- [ ] SSL certificate installed and working
- [ ] Contact information is correct
- [ ] Google Analytics added (optional)
- [ ] Backup configured

---

## 🆘 Support

**Technical Issues:**
- DirectAdmin Support: Check your hosting provider
- Website Issues: Contact developer

**Company Contact:**
- Email: info@srbeng.com
- Phone: +977 9843919796

---

## 📚 Additional Resources

- [DirectAdmin Documentation](https://docs.directadmin.com/)
- [PHP File Upload Guide](https://www.php.net/manual/en/features.file-upload.php)
- [Let's Encrypt SSL](https://letsencrypt.org/)

---

*Deployment Guide Version 1.0*  
*Last Updated: December 3, 2025*
