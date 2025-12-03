# Environment Variables Setup Guide

## Overview

All sensitive configuration (EmailJS credentials, API keys) are now stored in environment variables instead of being hardcoded in the source code.

---

## Development Setup

### Step 1: Create .env.local File

The `.env.local` file already exists in your project root with:

```
GEMINI_API_KEY=PLACEHOLDER_API_KEY

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_6icbh5e
VITE_EMAILJS_TEMPLATE_ID=template_7supbk7
VITE_EMAILJS_PUBLIC_KEY=CfMFd7I-JWmaqUQYD
VITE_EMAILJS_RECIPIENT_EMAIL=info@srbeng.com
```

### Step 2: Using in Development

When you run `npm run dev`, Vite automatically loads these variables:

```bash
npm run dev
# Vite loads .env.local automatically
# Variables are available as process.env.VITE_*
```

---

## Production Deployment

### For Vercel

1. Go to your project settings
2. Navigate to **Settings → Environment Variables**
3. Add each variable:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
   - `VITE_EMAILJS_RECIPIENT_EMAIL`

### For Netlify

1. Go to **Site settings → Build & deploy → Environment**
2. Click **Edit variables**
3. Add the same environment variables

### For Traditional Hosting (DirectAdmin, cPanel, etc.)

1. Upload `.env.local` to your project root on the server
2. Or set environment variables in your control panel
3. Ensure `.env.local` is in `.gitignore` (already done)

### For AWS/Docker/Other Platforms

Set environment variables through:
- Docker: `ENV VITE_EMAILJS_SERVICE_ID=...` in Dockerfile
- AWS Lambda: Environment variables in function configuration
- GitHub Actions: Secrets in repository settings

---

## Environment Variable Naming Convention

### VITE_ Prefix

All frontend environment variables must start with `VITE_`:

```
✅ VITE_EMAILJS_SERVICE_ID      (exposed to browser)
✅ VITE_EMAILJS_TEMPLATE_ID     (exposed to browser)
✅ VITE_EMAILJS_PUBLIC_KEY      (exposed to browser)
✅ VITE_EMAILJS_RECIPIENT_EMAIL (exposed to browser)

❌ EMAILJS_PRIVATE_KEY          (would NOT be exposed)
❌ SECRET_API_KEY               (would NOT be exposed)
```

**Why VITE_ prefix?** Vite only exposes variables starting with `VITE_` to the browser for security.

---

## Files Changed

### .env.local (Existing)
```
# Already contains all EmailJS configuration
VITE_EMAILJS_SERVICE_ID=service_6icbh5e
VITE_EMAILJS_TEMPLATE_ID=template_7supbk7
VITE_EMAILJS_PUBLIC_KEY=CfMFd7I-JWmaqUQYD
VITE_EMAILJS_RECIPIENT_EMAIL=info@srbeng.com
```

### .env.example (New Reference)
```
# Copy this file to .env.local and fill in your values
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_RECIPIENT_EMAIL=your_email@example.com
```

### vite.config.ts (Updated)
Added environment variable definitions:
```typescript
define: {
  'process.env.VITE_EMAILJS_SERVICE_ID': JSON.stringify(env.VITE_EMAILJS_SERVICE_ID),
  'process.env.VITE_EMAILJS_TEMPLATE_ID': JSON.stringify(env.VITE_EMAILJS_TEMPLATE_ID),
  'process.env.VITE_EMAILJS_PUBLIC_KEY': JSON.stringify(env.VITE_EMAILJS_PUBLIC_KEY),
  'process.env.VITE_EMAILJS_RECIPIENT_EMAIL': JSON.stringify(env.VITE_EMAILJS_RECIPIENT_EMAIL)
}
```

### components/Contact.tsx (Updated)
Now reads from environment variables:
```typescript
// Initialize
const publicKey = process.env.VITE_EMAILJS_PUBLIC_KEY;
emailjs.init(publicKey);

// Send email
await emailjs.send(
  process.env.VITE_EMAILJS_SERVICE_ID!,
  process.env.VITE_EMAILJS_TEMPLATE_ID!,
  { /* ... */ },
);
```

### .gitignore (Created/Updated)
```
.env.local          # Never commit your secrets!
.env.*.local
.env
```

---

## Security Best Practices

### ✅ Do's
- ✅ Store `.env.local` locally (never commit)
- ✅ Use `VITE_` prefix for frontend variables
- ✅ Set environment variables on production servers
- ✅ Keep private keys separate from frontend
- ✅ Rotate credentials periodically

### ❌ Don'ts
- ❌ Commit `.env.local` to Git
- ❌ Hardcode credentials in source code
- ❌ Share `.env.local` via email/Slack
- ❌ Use public key for sensitive operations
- ❌ Expose private keys in frontend code

---

## Accessing Variables in Code

### In React Components
```typescript
// Reading environment variables
const serviceId = process.env.VITE_EMAILJS_SERVICE_ID;
const templateId = process.env.VITE_EMAILJS_TEMPLATE_ID;

// With type safety
const publicKey: string = process.env.VITE_EMAILJS_PUBLIC_KEY || '';
```

### In Vite Config
```typescript
const env = loadEnv(mode, '.');
const apiKey = env.VITE_EMAILJS_PUBLIC_KEY;
```

### In Build Process
```bash
# Variables are available during build
npm run build  # Uses .env.local if present
```

---

## Troubleshooting

### "Environment variable not found"

**Problem**: Variable shows as undefined
**Solution**: 
1. Check `.env.local` exists in root directory
2. Verify variable name starts with `VITE_`
3. Restart dev server: `npm run dev`
4. Check vite.config.ts includes the variable in `define`

### Variables Not Loading in Development

**Solution**:
```bash
# Stop dev server
# Delete node_modules/.vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

### Production Variables Not Working

**Solution**:
1. Verify environment variables set on hosting platform
2. Check variable names match exactly (case-sensitive)
3. Restart application/redeploy
4. Check build logs for variable references

---

## Reference

### All Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service identifier | `service_6icbh5e` |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS email template ID | `template_7supbk7` |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS authentication key | `CfMFd7I-JWmaqUQYD` |
| `VITE_EMAILJS_RECIPIENT_EMAIL` | Where emails are sent | `info@srbeng.com` |

### Files to Keep Secure

| File | Commit? | Where? |
|------|---------|--------|
| `.env.local` | ❌ NO | Local machine only |
| `.env.example` | ✅ YES | Git repository |
| `vite.config.ts` | ✅ YES | Git repository |
| Source code | ✅ YES | Git repository |

---

## Next Steps

1. **Verify Setup**: `npm run dev` should work without errors
2. **Test Form**: Submit contact form to verify emails send
3. **Deploy**: Set environment variables on production host
4. **Monitor**: Check application logs for variable errors

---

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Best Practices for API Keys](https://12factor.net/config)
