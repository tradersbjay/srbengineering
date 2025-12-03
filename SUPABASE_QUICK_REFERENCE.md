# 📋 Supabase Setup Quick Reference

## 🚀 One-Command Setup

```bash
cd /Users/babi/Downloads/s.r.b-engineering-&-construction
export SUPABASE_MCP_TOKEN=sbp_your_token_here
chmod +x supabase/setup-interactive.sh
./supabase/setup-interactive.sh
```

---

## 🔑 Get Your Token

1. https://app.supabase.com
2. Select project (zenpcuwtvdetqpncwlmm)
3. Settings → API → Copy token
4. Or generate new token if needed

---

## ✅ What Gets Created

| Item | Type | Count | Status |
|------|------|-------|--------|
| Tables | Database | 6 | ✅ Created |
| Stored Procs | Functions | 15+ | ✅ Created |
| RLS Policies | Security | 20+ | ✅ Created |
| Storage Buckets | Files | 3 | ✅ Created |
| Sample Data | Rows | 12 | ✅ Seeded |

---

## 📊 Tables (Read After Setup)

```bash
# Check projects
curl -X GET https://zenpcuwtvdetqpncwlmm.supabase.co/rest/v1/projects \
  -H "Authorization: Bearer anon_key" \
  -H "apikey: anon_key"

# Or use Supabase Dashboard:
# Table Editor → projects → See 5 rows
```

---

## 🔌 React Integration (After Verifying Setup)

```bash
# 1. Install
npm install @supabase/supabase-js

# 2. Create src/lib/supabase.ts
cat > src/lib/supabase.ts << 'EOF'
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
EOF

# 3. Add to .env.local
VITE_SUPABASE_URL=https://zenpcuwtvdetqpncwlmm.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# 4. Update DataContext.tsx (see SUPABASE_INTEGRATION.md)
# 5. Update Contact.tsx (see SUPABASE_INTEGRATION.md)
```

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Dashboard | https://app.supabase.com |
| API Docs | https://zenpcuwtvdetqpncwlmm.supabase.co/rest/v1 |
| Storage CDN | https://zenpcuwtvdetqpncwlmm.supabase.co/storage/v1/object/public/ |

---

## 📁 Migration Files

| File | Lines | Purpose |
|------|-------|---------|
| 0001_create_tables_and_functions.sql | 240 | Core schema + CRUD |
| 0002_create_storage_buckets.sql | 21 | Image storage |
| 0003_seed_initial_data.sql | 34 | Sample data |

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Token invalid | Copy exact token from Settings → API |
| Table exists | Migrations use IF NOT EXISTS (safe to re-run) |
| Buckets missing | Create manually in Dashboard → Storage |
| RLS errors | Check Dashboard → Security → Policies |

---

## 📚 Documentation Files

- `SUPABASE_MCP_COMPLETE_SETUP.md` - Full setup guide
- `SUPABASE_INTEGRATION.md` - React integration code examples
- `supabase/MCP_DEPLOY.md` - Manual curl deployment

---

## 💾 Environment Variables

```bash
# Get from Settings → API
VITE_SUPABASE_URL=https://zenpcuwtvdetqpncwlmm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Setup only (do NOT commit)
SUPABASE_MCP_TOKEN=sbp_your_token_here
```

---

## ✨ Next Steps

1. Run setup script
2. Verify in Dashboard (5 projects, 5 services)
3. Get anon key
4. Install @supabase/supabase-js
5. Create supabase.ts client
6. Update DataContext
7. Update Contact form
8. Test with live data

---

## 🎯 Success Indicators

After setup, you should see:

- ✅ 6 tables in Table Editor
- ✅ 15+ functions in Functions section
- ✅ 3 buckets in Storage section
- ✅ 5 projects, 5 services, 3 team members seeded
- ✅ 4 stats initialized
- ✅ 0 contact messages (none submitted yet)

---

**Status**: 🚀 Ready to Deploy

See SUPABASE_MCP_COMPLETE_SETUP.md for detailed guide.
