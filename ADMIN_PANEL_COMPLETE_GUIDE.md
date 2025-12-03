# Complete Admin Panel Guide - December 2025

## 🚀 Quick Start

### Access Admin Panel
1. **Local Development**: `http://localhost:3002/#/srb-admin`
2. **Production**: `https://yourdomain.com/#/srb-admin`

### Login Credentials

| Email | Password | Role |
|-------|----------|------|
| `info@srbeng.com` | `Shashank@123` | Admin |
| `ace.bista@gmail.com` | `Sachu@123!` | Admin |

---

## 📋 Features Overview

### 1. Authentication
- ✅ Email + Password login (from `admin_users` table)
- ✅ Session persistence (localStorage)
- ✅ Change password feature
- ✅ Logout functionality

### 2. Projects Management
- ✅ Add new projects
- ✅ Edit existing projects
- ✅ Delete projects
- ✅ Upload project images (base64 or URL)
- ✅ Categorize projects (Residential, Commercial, etc.)
- ✅ Add location and year information

### 3. Services Management
- ✅ Add new services
- ✅ Edit existing services
- ✅ Delete services
- ✅ Add service icons (via URL)
- ✅ Description/details for each service

### 4. Data Management
- ✅ Real-time updates to database
- ✅ Form validation
- ✅ Error/success messages
- ✅ Responsive design

---

## 🔐 Security

### Authentication Flow
```
1. User enters email + password
2. App queries admin_users table
3. Password compared against pw_code
4. Session created and stored in localStorage
5. All future requests use active session
```

### Session Management
- Sessions stored in `srb_admin_session` key
- Automatically checked on page load
- Cleared on logout
- Verified against database periodically

### Database Access
- Row-Level Security (RLS) enabled
- Public can SELECT (for login)
- Only authenticated admins can UPDATE/INSERT/DELETE
- Passwords never sent in requests (only email)

---

## 🎨 Adding/Editing Services with Icons

### Icon Picker - How to Use

#### Step 1: Open Icon Picker
- Click **"Pick Icon"** button when adding/editing service

#### Step 2: Choose Icon Source
Any of these work:

**Lucide Icons** (Recommended)
```
https://cdn.jsdelivr.net/npm/lucide@latest/icons/[icon-name].svg
```

**Heroicons**
```
https://cdn.heroicons.dev/[icon-name].svg
```

**Custom Images**
```
https://your-cdn.com/icons/custom-icon.png
```

#### Step 3: Popular Icons for Construction

| Service | Icon URL |
|---------|----------|
| Residential | `https://cdn.jsdelivr.net/npm/lucide@latest/icons/home.svg` |
| Commercial | `https://cdn.jsdelivr.net/npm/lucide@latest/icons/building-2.svg` |
| Steel/Prefab | `https://cdn.jsdelivr.net/npm/lucide@latest/icons/container.svg` |
| Consulting | `https://cdn.jsdelivr.net/npm/lucide@latest/icons/pencil-ruler.svg` |
| Energy | `https://cdn.jsdelivr.net/npm/lucide@latest/icons/zap.svg` |
| Water Systems | `https://cdn.jsdelivr.net/npm/lucide@latest/icons/droplets.svg` |
| Tools | `https://cdn.jsdelivr.net/npm/lucide@latest/icons/wrench.svg` |
| Safety | `https://cdn.jsdelivr.net/npm/lucide@latest/icons/hard-hat.svg` |

#### Step 4: Preview & Save
- See icon preview before saving
- Click "Add Icon" to confirm
- Icon is stored in database as URL

**Finding More Icons**: https://lucide.dev (search, copy URL)

---

## 📸 Adding Project Images

### Two Methods

#### Method 1: Upload File
1. Click "Choose File" in Project Image section
2. Select PNG/JPG/SVG from computer
3. Image is converted to base64 and stored
4. Preview shows immediately

#### Method 2: Paste Image URL
1. Paste direct URL to image: `https://...`
2. Image will display if URL is accessible
3. No conversion needed for URLs

**Pro Tips**:
- Use HTTPS URLs (HTTP may be blocked)
- Test URLs in browser first
- For large files, consider resizing before upload
- SVG files are smallest and best quality

---

## ✏️ Managing Projects

### Add New Project
```
1. Fill in Title, Category, Year, Location
2. Add description
3. Upload/paste image
4. Click "Add Project"
5. Check success message
```

### Edit Project
```
1. Find project in list
2. Click to expand edit form
3. Modify any fields
4. Click "Save"
5. Confirm changes
```

### Delete Project
```
1. Find project in list
2. Click "Delete" button
3. Project removed from database
4. Refresh shows updated list
```

---

## 🔄 Change Password

### How to Change Password
1. Click **"Change Password"** in top-right navbar
2. Enter current password
3. Enter new password (min 6 characters)
4. Confirm new password
5. Click "Update Password"
6. Success message appears

### Password Requirements
- Minimum 6 characters
- Can contain numbers, special characters
- Must match confirmation field

### Important
- New password takes effect immediately
- You'll need to login again if session expires
- Keep password secure

---

## 📊 Database Structure

### admin_users Table
```sql
id          UUID PRIMARY KEY
email       TEXT UNIQUE
pw_code     TEXT (stored password)
role        TEXT (default: 'admin')
created_at  TIMESTAMP
```

### services Table
```sql
id          UUID PRIMARY KEY
title       TEXT
description TEXT
icon        TEXT (URL to icon)
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### projects Table
```sql
id          UUID PRIMARY KEY
title       TEXT
category    TEXT
year        TEXT
location    TEXT
description TEXT
image       TEXT (base64 or URL)
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

---

## 🐛 Troubleshooting

### Login Issues

**Problem**: "Invalid email or password"
- ✅ Check email spelling (must match exactly)
- ✅ Check password (case-sensitive)
- ✅ Ensure account exists in admin_users table

**Problem**: Session lost after refresh
- ✅ Clear browser cache: `Cmd+Shift+Delete`
- ✅ Try incognito/private mode
- ✅ Check browser localStorage is enabled

### Icon Not Showing

**Problem**: Icon displays as wrench (fallback)
- ✅ Check URL is valid: paste in browser address bar
- ✅ Check CORS: Some CDNs block certain domains
- ✅ Try different icon source (Lucide, Heroicons)
- ✅ Use trusted CDNs (jsdelivr.net, heroicons.dev)

**Problem**: Icon preview broken in modal
- ✅ Make sure URL has `http://` or `https://`
- ✅ Avoid relative URLs like `/images/icon.svg`
- ✅ Use absolute full URLs

### Data Not Saving

**Problem**: Click "Save" but nothing happens
- ✅ Check browser console (F12 → Console tab)
- ✅ Verify internet connection
- ✅ Check if Supabase is accessible
- ✅ Try logout/login again

**Problem**: Form shows error message
- ✅ Check all required fields are filled
- ✅ Check image size (max 5MB)
- ✅ Ensure no special characters in some fields

---

## 🌐 Website Display

### How Changes Appear on Website

1. **Edit in Admin Panel**
   - Update project, service, or icon
   - Click Save
   - Data updated in database

2. **Website Loads Data**
   - Home page fetches latest from Supabase
   - Changes appear in ~5 seconds
   - No page refresh needed

3. **Clear Cache if Needed**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Clear browser cache in settings

---

## 📱 Responsive Design

Admin panel works on:
- ✅ Desktop (full layout)
- ✅ Tablet (2-column grid)
- ✅ Mobile (single column, stacked)

All forms are touch-friendly and responsive.

---

## ⚡ Performance Notes

- Images stored as base64 (small file size)
- Session stored in browser (no server calls for auth check)
- Real-time updates via Supabase
- CSS-in-Tailwind (no loading delays)

---

## 🔒 Security Best Practices

1. **Change default password**: Update `pw_code` in database
2. **Use HTTPS**: Always access over secure connection
3. **Don't share credentials**: Each admin has unique password
4. **Logout after use**: Always logout when done
5. **Keep browser updated**: Security patches important

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Lucide Icons**: https://lucide.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React**: https://react.dev

---

## ✅ Checklist Before Launch

- [ ] Test login with both admin accounts
- [ ] Add 1-2 test projects
- [ ] Add 1-2 test services with icons
- [ ] Verify icons display on website
- [ ] Test change password feature
- [ ] Test logout and re-login
- [ ] Check responsive design on mobile
- [ ] Verify no console errors (F12)
- [ ] Test in different browsers
- [ ] Confirm production URLs correct

---

## 🎯 Next Steps

1. **Start using admin panel**
   - Add your projects
   - Add your services
   - Upload company images

2. **Monitor website**
   - Verify changes appear
   - Check mobile responsiveness
   - Test on different browsers

3. **Share with team**
   - Provide credentials
   - Send this guide
   - Train on icon picker

4. **Keep updated**
   - Change password monthly
   - Back up database regularly
   - Monitor Supabase logs

---

**Last Updated**: December 4, 2025
**Status**: Production Ready ✅

For questions or issues, refer to the troubleshooting section above.
