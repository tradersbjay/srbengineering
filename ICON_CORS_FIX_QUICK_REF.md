# Icon CORS Fix - Quick Reference

## Problem
Icons loaded via external CDN URLs don't show up on production Vercel deployment due to CORS restrictions.

## Solution
Automatic CORS proxy that routes external icon URLs through a Vercel serverless function.

---

## How It Works

### Local Development (localhost)
```
User clicks service icon
  ↓
getServiceIcon() checks if it's a URL
  ↓
Detects localhost environment
  ↓
Direct load from CDN (no CORS issues locally)
  ↓
Icon displays ✅
```

### Production (Vercel)
```
User clicks service icon
  ↓
getServiceIcon() checks if it's a URL
  ↓
Detects production environment (srbeng.com)
  ↓
Routes to /api/proxy-icon?url=[icon-url]
  ↓
Proxy fetches from CDN with CORS headers
  ↓
Returns icon with proper headers ✅
  ↓
Icon displays with brand blue filter ✅
```

---

## Key Changes

### 1. vercel.json (NEW)
```json
{
  "redirects": [
    {
      "source": "/webmail",
      "destination": "https://uscloud.himalayan.host/roundcube/",
      "permanent": false
    }
  ]
}
```

### 2. api/proxy-icon.ts (NEW)
Serverless function that:
- Accepts URL as query parameter
- Fetches from external CDN
- Returns with CORS headers
- Caches for 24 hours

### 3. utils.tsx (UPDATED)
```tsx
export const getServiceIcon = (iconName?: string) => {
  if (iconName && /^(https?:\/\/|data:|\/)/i.test(iconName)) {
    // Detect production
    const isProduction = window.location.hostname !== 'localhost' && 
                        window.location.hostname !== '127.0.0.1';
    
    // Route through proxy on production
    let imageUrl = iconName;
    if (/^https?:\/\//.test(iconName) && isProduction) {
      imageUrl = `/api/proxy-icon?url=${encodeURIComponent(iconName)}`;
    }
    
    return <img src={imageUrl} ... />;
  }
}
```

### 4. components/Admin.tsx (UPDATED)
Same proxy logic applied to IconRenderer component.

### 5. package.json (UPDATED)
Added: `"@vercel/node": "^3.0.0"`

---

## Supported Icon Sources

| Source | URL Pattern | Works Locally | Works on Vercel |
|--------|-------------|---------------|-----------------|
| Lucide | `https://cdn.jsdelivr.net/npm/lucide@latest/icons/[name].svg` | ✅ | ✅ (proxy) |
| Heroicons | `https://cdn.heroicons.dev/[name].svg` | ✅ | ✅ (proxy) |
| Font Awesome | `https://cdn.jsdelivr.net/npm/@fortawesome/...` | ✅ | ✅ (proxy) |
| Flaticon | `https://cdn-icons.flaticon.com/...` | ❌ CORS | ✅ (proxy) |
| Custom CDN | Any HTTPS URL | Depends | ✅ (proxy) |
| Data URI | `data:image/svg+xml;base64,...` | ✅ | ✅ |

---

## Testing

### Before Deployment
```bash
npm run build
npm run preview
# Visit http://localhost:4173
# Icons should load normally
```

### After Deployment
```bash
# Test proxy endpoint
curl "https://srbeng.com/api/proxy-icon?url=https://cdn.jsdelivr.net/npm/lucide@latest/icons/wrench.svg" -I

# Should return:
# HTTP/1.1 200 OK
# Content-Type: image/svg+xml
# Cache-Control: public, max-age=86400, s-maxage=86400
```

---

## Troubleshooting

### Icons Still Not Showing?

1. **Check browser console** for errors
2. **Verify icon URL** is valid and complete
3. **Check Network tab** to see if proxy request succeeds
4. **Test manually**: `curl "https://srbeng.com/api/proxy-icon?url=[your-url]"`

### Proxy Endpoint Returns 404?

1. Ensure `api/proxy-icon.ts` exists
2. Rebuild and redeploy: `npm run build && vercel --prod`
3. Check Vercel deployment logs for build errors

### Icons Load Locally but Not on Production?

This is expected! The proxy only activates on production.
- Local: Direct load from CDN
- Production: Via proxy endpoint

---

## Caching

- Proxy caches icons for **24 hours**
- First request may be slower (fetching from CDN)
- Subsequent requests are instant (served from cache)
- Cache automatically refreshes after 24 hours

### Bypass Cache (if needed)
Add version parameter to icon URL:
```
https://cdn.jsdelivr.net/npm/lucide@latest/icons/wrench.svg?v=2
```
Then update in database and redeploy.

---

## Environment Variables

**None needed!** The proxy auto-detects the environment:
- `localhost` → Direct load
- `127.0.0.1` → Direct load  
- Other domains → Via proxy

---

## Deployment Checklist

- [ ] Run `npm install` to add @vercel/node
- [ ] Verify `vercel.json` exists
- [ ] Verify `api/proxy-icon.ts` exists
- [ ] Run `npm run build` (no errors)
- [ ] Commit: `git add . && git commit -m "Add Vercel icon proxy"`
- [ ] Push: `git push`
- [ ] Deploy: `vercel --prod` or auto-deploy via GitHub
- [ ] Test webmail redirect: `curl -I https://srbeng.com/webmail`
- [ ] Test icons on https://srbeng.com
- [ ] Test proxy: `curl https://srbeng.com/api/proxy-icon?url=...`

---

## Summary

✅ Webmail redirect: `/webmail` → `uscloud.himalayan.host/roundcube/`
✅ Icon proxy: External URLs automatically routed through proxy on production
✅ Color filter: Icons maintain brand blue color in all environments
✅ Fallback: If proxy fails, tries direct load
✅ Performance: 24-hour caching on Vercel

**Ready to deploy!**
