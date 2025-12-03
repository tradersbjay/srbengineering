# S.R.B Engineering & Construction - Admin Portal

**Status:** ✅ Production Ready  
**Live Site:** https://srbeng.com  
**Repository:** https://github.com/tradersbjay/srbengineering  
**Last Updated:** December 4, 2025

---

## Overview

This is a full-featured website and admin portal for S.R.B Engineering & Construction. The platform includes:

- 🌐 **Public Website** - Showcase projects, services, and company information
- 🔐 **Admin Panel** - Manage projects, services, and handle contact inquiries
- 📧 **Contact Form** - Email notifications via EmailJS
- 📱 **Mobile First** - Fully responsive design for all devices
- ⚡ **Fast & Optimized** - Built with React, Vite, and Tailwind CSS
- 🔒 **Secure** - Authentication via Supabase, CORS-protected APIs

---

## Quick Start

### For Users

Simply visit: **https://srbeng.com**

- Browse projects and services
- View company information
- Submit contact inquiries
- Access admin panel (private)

### For Developers

#### Prerequisites
- Node.js 18+ (check with `node --version`)
- npm 9+ (check with `npm --version`)

#### Setup
```bash
# Clone repository
git clone https://github.com/tradersbjay/srbengineering.git
cd srbengineering

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

#### Build for Production
```bash
npm run build
# Creates optimized build in dist/ folder
```

---

## Features

### 🌍 Public Website
- **Hero Section** - Compelling landing page
- **Services** - Showcase all services
- **Projects** - Gallery with lightbox view
- **About** - Company information
- **Contact** - Email inquiry form
- **Team** - Meet the team
- **Responsive Design** - Works on all devices

### 🔐 Admin Panel (Protected)
**Access:** https://srbeng.com/#/srb-admin

**Credentials:**
- Email: `info@srbeng.com`
- Password: `Shashank@123`

**OR**
- Email: `ace.bista@gmail.com`
- Password: `Sachu@123!`

**Features:**
- 📊 Dashboard with stats
- 🏢 Manage Projects (Create, Read, Update, Delete)
- 🛠️ Manage Services (Create, Read, Update, Delete)
- 🎨 Icon Picker for services (supports any image URL)
- 🔑 Change password
- 🚪 Logout

### 📧 Contact Form
**Location:** https://srbeng.com/#contact

**Functionality:**
- Submit inquiries with name, email, phone, and message
- Automatic email notifications to admin
- Success/error message feedback
- Message storage in database
- Service selection dropdown

---

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Icon library

### Backend & Services
- **Supabase** - PostgreSQL database + authentication
- **EmailJS** - Email notifications
- **Vercel** - Hosting & serverless functions

### APIs
- **RLS Policies** - Row-level security for database
- **Proxy Endpoint** - CORS proxy for external images

---

## Project Structure

```
├── components/          # React components
│   ├── Admin.tsx       # Admin panel
│   ├── Contact.tsx     # Contact form
│   ├── Projects.tsx    # Project gallery
│   ├── Services.tsx    # Services section
│   └── ...
├── lib/                # Utilities & configuration
│   ├── auth.ts         # Authentication functions
│   └── supabase.ts     # Supabase client
├── api/                # Serverless functions
│   └── proxy-icon.ts   # CORS proxy
├── styles/             # CSS
│   └── index.css       # Global styles
├── .env.local          # Environment variables (local)
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Dependencies
└── README.md           # This file
```

---

## Environment Variables

### Required for Local Development

Create `.env.local` with:

```bash
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key_xxx
VITE_EMAILJS_FROM_EMAIL=info@srbeng.com
VITE_EMAILJS_RECIPIENT_EMAIL=shashank@srbeng.com

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_xxx
```

**Note:** 
- Variables must start with `VITE_` to be accessible in browser
- Never commit `.env.local` to Git
- Variables are already set in Vercel production

---

## Common Tasks

### Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### Build Production
```bash
npm run build
# Output in dist/ folder
```

### Preview Production Build
```bash
npm run preview
# Open http://localhost:4173
```

### Login to Admin Panel
1. Go to https://srbeng.com/#/srb-admin
2. Enter email and password
3. Click Login
4. You'll be redirected to admin dashboard

### Add a New Project
1. Login to admin panel
2. Scroll to "Add New Project" section
3. Fill in project details
4. Upload or paste image URL
5. Click "Add Project"
6. New project appears on website

### Add a New Service
1. Login to admin panel
2. Scroll to "Add New Service" section
3. Enter title and description
4. Click "Pick Icon" to choose icon from URL
5. Click "Add Service"
6. Service appears on website

### Change Admin Password
1. Login to admin panel
2. Click "Change Password" in navbar
3. Enter current and new password
4. Click "Update Password"
5. You'll need to login again with new password

---

## Troubleshooting

### Contact Form Not Working
**Solution:**
1. Check Vercel environment variables are set
2. Check browser console for errors
3. Verify EmailJS credentials are correct
4. Redeploy with `git push`

### Admin Panel Won't Load
**Solution:**
1. Clear browser cache
2. Check Supabase connection
3. Verify environment variables
4. Check browser console for errors

### Images Not Showing
**Solution:**
1. Verify image URL is valid
2. Check if image hosting has CORS enabled
3. Try uploading as base64
4. Use icon proxy for external icons

### Mobile Display Issues
**Solution:**
1. Clear browser cache
2. Force reload (Ctrl+Shift+R or Cmd+Shift+R)
3. Test in Chrome DevTools device mode
4. Check responsive CSS classes

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance

- **Build Size:** ~1.1MB (gzipped: ~233KB)
- **Build Time:** ~2 seconds
- **Page Load:** ~3 seconds
- **Mobile Performance:** Optimized for mobile-first

---

## Security

- 🔒 Password-protected admin panel
- 🔐 Row-level security (RLS) policies on database
- 🛡️ CORS protection with serverless proxy
- 📧 Secure email delivery
- 🔑 Environment variables protected

---

## Deployment

### Automatic (Recommended)
1. Push to GitHub
2. Vercel auto-deploys
3. Test at https://srbeng.com

### Manual
```bash
vercel --prod
```

### Environment Variables in Vercel
1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add all VITE_* variables from `.env.local`
4. Redeploy

---

## Documentation

**Getting Started:**
- [README_FINAL.md](./README_FINAL.md) - Quick start guide

**Guides:**
- [ICON_PICKER_GUIDE.md](./ICON_PICKER_GUIDE.md) - How to use icon picker
- [ADMIN_PANEL_COMPLETE_GUIDE.md](./ADMIN_PANEL_COMPLETE_GUIDE.md) - Full admin guide
- [MOBILE_USABILITY_AND_CONTACT_FIX.md](./MOBILE_USABILITY_AND_CONTACT_FIX.md) - Mobile & forms

**Technical:**
- [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) - Deployment setup
- [SESSION_SUMMARY_FINAL_DEC4.md](./SESSION_SUMMARY_FINAL_DEC4.md) - What was built
- [FINAL_DEPLOYMENT_CHECKLIST_COMPLETE.md](./FINAL_DEPLOYMENT_CHECKLIST_COMPLETE.md) - Verification

**Reference:**
- [QUICK_REFERENCE_FINAL.md](./QUICK_REFERENCE_FINAL.md) - Quick cheat sheet
- [ENVIRONMENT_VARIABLES_GUIDE.md](./ENVIRONMENT_VARIABLES_GUIDE.md) - Environment setup

---

## Contributing

### Code Style
- Use TypeScript for type safety
- Follow existing naming conventions
- Use Tailwind CSS for styling
- Keep components modular

### Testing Checklist
- [ ] Test locally: `npm run dev`
- [ ] Build successful: `npm run build`
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Mobile responsive
- [ ] All features working

### Submitting Changes
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with clear message
5. Push and create pull request

---

## Support & Contact

### Technical Issues
- GitHub Issues: https://github.com/tradersbjay/srbengineering/issues
- Email: info@srbeng.com

### Services
- Website: https://srbeng.com
- Phone: See contact page
- Email: info@srbeng.com

---

## License

Copyright © 2025 S.R.B Engineering & Construction Pvt. Ltd. All rights reserved.

---

## Credits

**Built by:** Shashank Raj Bista & Team  
**Technologies:** React, Vite, Supabase, Tailwind CSS  
**Hosting:** Vercel  
**Email:** EmailJS  

---

## Changelog

### v1.0.0 (December 4, 2025)
- ✅ Initial release
- ✅ Admin panel with full CRUD
- ✅ Contact form with email notifications
- ✅ Mobile responsive design
- ✅ Icon picker with CORS proxy
- ✅ Project gallery with lightbox
- ✅ Supabase authentication
- ✅ Production deployment on Vercel

---

**Status:** ✅ Production Ready  
**Next Update:** When new features are added

For more information, visit: **https://srbeng.com**
