# Quick Reference Card - Admin Panel

## 🔑 Login

| Email | Password |
|-------|----------|
| `info@srbeng.com` | `Shashank@123` |
| `ace.bista@gmail.com` | `Sachu@123!` |

**Access**: `http://localhost:3002/#/srb-admin` (dev) or `https://yourdomain.com/#/srb-admin` (prod)

---

## 📱 Main Features

### Projects
- **Add**: Fill form → Upload image → Click "Add Project"
- **Edit**: Click project → Modify → Click "Save"
- **Delete**: Click project → Click "Delete"

### Services
- **Add**: Fill form → Click "Pick Icon" → Paste URL → Click "Add Service"
- **Edit**: Click service → Modify → Click "Save"
- **Delete**: Click service → Click "Delete"

### Account
- **Change Password**: Click "Change Password" in navbar
- **Logout**: Click "Logout" in navbar

---

## 🎨 Icon URLs (Copy & Paste)

| Icon | URL |
|------|-----|
| Building | `https://cdn.jsdelivr.net/npm/lucide@latest/icons/building-2.svg` |
| Home | `https://cdn.jsdelivr.net/npm/lucide@latest/icons/home.svg` |
| Zap | `https://cdn.jsdelivr.net/npm/lucide@latest/icons/zap.svg` |
| Water | `https://cdn.jsdelivr.net/npm/lucide@latest/icons/droplets.svg` |
| Hammer | `https://cdn.jsdelivr.net/npm/lucide@latest/icons/hammer.svg` |
| Wrench | `https://cdn.jsdelivr.net/npm/lucide@latest/icons/wrench.svg` |

**More Icons**: https://lucide.dev (search → copy URL)

---

## 🖼️ Image Upload

1. Click "Choose File" or paste URL
2. Formats: PNG, JPG, SVG (recommended)
3. Max size: 5MB
4. Preview appears before saving

---

## ⚙️ Dev Commands

```bash
npm run dev           # Start dev server (port 3002)
npm run build        # Build for production
npm run build:watch  # Auto-rebuild on changes
```

---

## 🔍 Troubleshooting

**Can't login?**
- Check email spelling
- Check password (case-sensitive)
- Clear browser cache: `Cmd+Shift+Delete`

**Icon not showing?**
- Paste URL in browser address bar to test
- Try different icon source
- Use https:// URLs

**Data not saving?**
- Check internet connection
- Open F12 → Console for errors
- Try logout and login again

---

## 📊 Database

**Tables**: admin_users, projects, services
**Hosted on**: Supabase
**Access**: https://app.supabase.com

---

## 🚀 Deployment

```bash
npm run build        # Build
vercel              # Deploy to Vercel
# OR
netlify deploy --prod --dir=dist  # Deploy to Netlify
```

---

## 📞 Support

- **Full Guide**: ADMIN_PANEL_COMPLETE_GUIDE.md
- **Setup Info**: IMPROVEMENTS_SUMMARY_DEC4.md
- **Deployment**: DEPLOYMENT_CHECKLIST_FINAL.md
- **Icon Help**: ICON_PICKER_GUIDE.md

---

**Printed**: December 4, 2025
**Status**: ✅ Ready to Use
