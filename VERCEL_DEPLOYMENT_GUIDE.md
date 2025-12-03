# Vercel Deployment Configuration

## Overview
This document covers the setup for deploying the S.R.B Engineering admin portal to Vercel with proper redirect handling and CORS proxy for external icon URLs.

---

## 1. URL Redirect Setup

### Webmail Redirect
When deployed on Vercel, the following redirect is configured:

```
https://srbeng.com/webmail → https://uscloud.himalayan.host/roundcube/
```

**Configuration File**: `vercel.json`

This is handled automatically by the Vercel platform. No additional setup needed.

---

## 2. Icon Loading Fix for Production

### Problem
When icons are loaded via external CDN URLs (like Flaticon, Lucide CDN, etc.), they may fail to load on the production Vercel site due to CORS (Cross-Origin Resource Sharing) restrictions.

### Solution
We've implemented a **CORS proxy endpoint** that Vercel will serve to bypass these restrictions.

#### How It Works

1. **Icon URL Detection**
   - Code detects if we're in production (`https://srbeng.com`)
   - External URLs are routed through the proxy endpoint

2. **Proxy Endpoint** (`/api/proxy-icon`)
   - Located in: `/api/proxy-icon.ts`
   - Fetches the icon from the external CDN
   - Returns it with proper CORS headers
   - Caches for 24 hours for performance

3. **Fallback Logic**
   - If proxy fails, attempts to load the original URL
   - Ensures icons still work even if proxy has issues

#### URL Flow

**Local Development**:
```
https://cdn-icons.flaticon.com/... → Direct load (no CORS issues locally)
```

**Production (Vercel)**:
```
https://cdn-icons.flaticon.com/... 
  → /api/proxy-icon?url=https://cdn-icons.flaticon.com/...
  → Proxy fetches and returns with CORS headers ✅
```

---

## 3. Files Modified

### New Files Created

1. **`vercel.json`**
   - Defines redirects (webmail endpoint)
   - Configures caching headers
   - Sets up CORS headers for API routes

2. **`api/proxy-icon.ts`**
   - Serverless function to proxy external icon URLs
   - Handles CORS headers
   - Includes error handling and caching

### Updated Files

1. **`utils.tsx`**
   - Modified `getServiceIcon()` function
   - Detects production environment
   - Routes external URLs through proxy
   - Includes fallback error handling

2. **`components/Admin.tsx`**
   - Updated `IconRenderer` component
   - Same proxy logic for consistency
   - Error handling for failed loads

3. **`package.json`**
   - Added `@vercel/node` dependency for API routes

---

## 4. Testing Before Deployment

### Local Testing
```bash
npm run dev
# Open http://localhost:3000
# Icons should load normally from CDN
```

### Build Verification
```bash
npm run build
# Check for any build errors
# Verify dist/ folder is created
```

### API Route Testing (after deployment)
```bash
# Test the proxy endpoint once deployed:
curl "https://srbeng.com/api/proxy-icon?url=https://cdn.jsdelivr.net/npm/lucide@latest/icons/wrench.svg"
# Should return the SVG with CORS headers
```

---

## 5. Deployment Steps

### Step 1: Update Dependencies
```bash
npm install
```

### Step 2: Commit Changes
```bash
git add .
git commit -m "Add Vercel configuration and icon proxy"
git push
```

### Step 3: Deploy to Vercel

#### Option A: Via Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

#### Option B: Via GitHub Integration
1. Push to GitHub
2. Vercel will auto-deploy from your repository

### Step 4: Verify Deployment

1. **Check Redirects**
   ```bash
   curl -I https://srbeng.com/webmail
   # Should show redirect to uscloud.himalayan.host
   ```

2. **Check Icon Loading**
   - Visit https://srbeng.com
   - Go to Services section
   - Verify all service icons display correctly

3. **Check API Route**
   ```bash
   curl "https://srbeng.com/api/proxy-icon?url=https://cdn.jsdelivr.net/npm/lucide@latest/icons/wrench.svg" -I
   # Should return 200 with Content-Type: image/svg+xml
   ```

---

## 6. Icon URLs That Work

### Recommended CDNs (No CORS Issues)

1. **Lucide Icons** (via jsDelivr CDN)
   ```
   https://cdn.jsdelivr.net/npm/lucide@latest/icons/[icon-name].svg
   ```

2. **Heroicons** (via CDN)
   ```
   https://cdn.heroicons.dev/[icon-name].svg
   ```

3. **Font Awesome** (via jsDelivr)
   ```
   https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/svgs/solid/[icon-name].svg
   ```

### CDNs That May Have CORS Issues (Use Proxy)

1. **Flaticon**
   ```
   https://cdn-icons.flaticon.com/...
   ```
   → Will automatically use proxy on production ✅

2. **Custom CDNs**
   → Proxy will handle if needed

---

## 7. Troubleshooting

### Icons Still Not Showing?

1. **Check Browser Console**
   - Look for any error messages
   - Check Network tab to see if proxy request succeeds

2. **Verify Proxy Endpoint**
   ```bash
   curl "https://srbeng.com/api/proxy-icon?url=https://example.com/icon.svg" -v
   ```

3. **Check Icon URL Format**
   - Must be a valid, complete URL
   - Should return image file (SVG, PNG, etc.)

### Redirect Not Working?

1. **Verify `vercel.json`**
   - Check syntax is valid JSON
   - Verify redirect source/destination are correct

2. **Check Vercel Dashboard**
   - Go to Project Settings → Redirects
   - Ensure redirect is listed

3. **Clear Browser Cache**
   ```bash
   # Hard refresh or clear cache if testing locally
   ```

---

## 8. Performance Optimization

### Caching Strategy

The proxy endpoint caches icons for **24 hours**:
```
Cache-Control: public, max-age=86400, s-maxage=86400
```

This means:
- First request fetches from CDN
- Subsequent requests served from Vercel cache
- 24 hours after, cache refreshes

### Performance Tips

1. **Use SVG Icons**
   - Smaller file size (~1-2KB)
   - Scales to any size
   - Better performance than PNG/JPG

2. **Use jsDelivr CDN**
   - Global distribution
   - Excellent performance
   - No CORS issues with proxy

3. **Avoid Too Many Different Icon URLs**
   - Reduces cache misses
   - Better performance

---

## 9. Environment Configuration

No additional environment variables are needed for icon proxy on Vercel. The detection is automatic based on hostname.

---

## 10. Production Checklist

- [ ] `vercel.json` created with redirect configuration
- [ ] `api/proxy-icon.ts` created
- [ ] `utils.tsx` updated with proxy logic
- [ ] `components/Admin.tsx` updated with proxy logic
- [ ] `package.json` updated with @vercel/node
- [ ] Dependencies installed: `npm install`
- [ ] Build verified: `npm run build`
- [ ] Changes committed: `git push`
- [ ] Deployed to Vercel
- [ ] Redirects verified
- [ ] Icons loading correctly
- [ ] Proxy endpoint responding

---

## 11. Rollback Instructions

If issues occur after deployment:

```bash
# Revert to previous version
git revert HEAD
git push

# Vercel will auto-redeploy previous version
```

Or manually redeploy from Vercel dashboard:
1. Go to Vercel Dashboard
2. Select srbeng.com project
3. Go to Deployments
4. Select previous successful deployment
5. Click "Promote to Production"

---

## Support

For issues with:
- **Vercel Configuration**: Check [Vercel Docs](https://vercel.com/docs)
- **CORS**: Check [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- **Icon URLs**: See "Icon URLs That Work" section above

---

**Last Updated**: December 4, 2025
**Status**: ✅ Ready for production deployment
