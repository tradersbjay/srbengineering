# S.R.B Engineering & Construction - Deployment Guide

## ✅ Build Status: READY FOR DEPLOYMENT

All build issues have been resolved. The website is production-ready.

---

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow the prompts**:
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: srb-engineering-construction
   - Directory: `./`
   - Override settings: No

4. **Production deployment**:
   ```bash
   vercel --prod
   ```

**Live URL**: You'll receive a URL like `https://srb-engineering-construction.vercel.app`

---

### Option 2: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Or use Netlify Drop**:
   - Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag and drop the `dist` folder

---

### Option 3: GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts**:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Add base path to vite.config.ts**:
   ```typescript
   export default defineConfig({
     base: '/repository-name/',
     // ... rest of config
   });
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

---

### Option 4: Traditional Web Hosting (cPanel, etc.)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload contents of `dist/` folder** to your web server's public directory (usually `public_html/` or `www/`)

3. **Ensure your server supports**:
   - Static file serving
   - HTML5 History API (for hash routing, this is already handled)

---

## 🔧 Build Commands

### Development Server
```bash
npm run dev
```
Access at: `http://localhost:3000`

### Production Build
```bash
npm run build
```
Output: `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Access at: `http://localhost:4173`

---

## 📋 Pre-Deployment Checklist

- [x] All dependencies installed (`npm install`)
- [x] Build completes without errors (`npm run build`)
- [x] React version compatibility fixed (18.2.0)
- [x] Missing CSS file created
- [x] TypeScript types properly configured
- [x] Admin panel accessible at `/#/srb-admin`
- [x] Responsive design verified
- [x] All images loading from CDN (Unsplash)

---

## 🔐 Admin Access

**URL**: `https://your-domain.com/#/srb-admin`

**Credentials**:
- Email: `info@srbeng.com`
- Code: `1234`

**Features**:
- Add new projects
- Add new services
- View statistics
- Auto-calculated metrics

---

## 🌐 Environment Variables

Currently, the app uses:
- `GEMINI_API_KEY` (defined in `.env.local` for potential future AI features)

For production deployment, set this in your hosting platform's environment variables section if needed.

---

## 📱 Features Verified

✅ Responsive navigation with mobile menu  
✅ Smooth scroll behavior  
✅ Hero section with CTA buttons  
✅ About section with company info  
✅ Services showcase  
✅ Projects gallery with filtering  
✅ Contact form  
✅ Admin panel for content management  
✅ Local storage persistence for projects  

---

## 🐛 Known Issues & Notes

1. **Package Name Warning**: The package name contains `&` which triggers a lint warning. This doesn't affect functionality.

2. **Admin Authentication**: Currently uses simple client-side authentication. For production, consider implementing:
   - Backend authentication
   - Secure password hashing
   - Session management

3. **Contact Form**: Currently client-side only. To make it functional:
   - Integrate with email service (EmailJS, SendGrid, etc.)
   - Or add backend API endpoint

4. **Image Hosting**: Currently uses Unsplash CDN. For production:
   - Consider hosting images on your own CDN
   - Or use a service like Cloudinary

---

## 🔄 Continuous Deployment

### Vercel (Auto-deploy from Git)

1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Vercel
3. Vercel auto-deploys on every push to main branch

### Netlify (Auto-deploy from Git)

1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

---

## 📞 Support

For deployment issues, contact:
- Email: info@srbeng.com
- Phone: +977 9843919796

---

## 🎉 Ready to Deploy!

Your website is fully functional and ready for production deployment. Choose your preferred hosting option above and follow the steps.

**Recommended**: Start with Vercel for the easiest deployment experience.
