#!/bin/bash

# MCP Setup Script - Step by Step with Token Prompt

set -e

# Configuration
PROJECT_REF="zenpcuwtvdetqpncwlmm"
MCP_URL="https://mcp.supabase.com/mcp?project_ref=${PROJECT_REF}&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching%2Cstorage"

echo "🚀 SRB Engineering Supabase MCP Setup"
echo "======================================"
echo ""
echo "This script will set up your Supabase database with:"
echo "  ✓ Tables (projects, services, team, stats, contacts)"
echo "  ✓ Functions (CRUD operations)"
echo "  ✓ Storage (buckets for images)"
echo "  ✓ RLS Policies (security)"
echo "  ✓ Sample Data (initial projects and services)"
echo ""

# Check for token
if [ -z "$SUPABASE_MCP_TOKEN" ]; then
  echo "⚠️  SUPABASE_MCP_TOKEN not found in environment"
  echo ""
  echo "To get your token:"
  echo "  1. Go to https://app.supabase.com"
  echo "  2. Select your project"
  echo "  3. Settings → API → Copy 'Project ref' and generate/copy API token"
  echo ""
  read -p "Enter your SUPABASE_MCP_TOKEN: " SUPABASE_MCP_TOKEN
  if [ -z "$SUPABASE_MCP_TOKEN" ]; then
    echo "❌ No token provided. Exiting."
    exit 1
  fi
  export SUPABASE_MCP_TOKEN
  echo "✅ Token set"
else
  echo "✅ Token found in environment"
fi

echo ""
echo "📋 Step 1/3: Creating tables and core functions..."
RESPONSE1=$(curl -s -X POST \
  -H "Authorization: Bearer $SUPABASE_MCP_TOKEN" \
  -H "Content-Type: application/sql" \
  --data-binary @./supabase/migrations/0001_create_tables_and_functions.sql \
  "$MCP_URL" 2>&1)

if echo "$RESPONSE1" | grep -qi "error\|unauthorized\|forbidden"; then
  echo "❌ Step 1 failed:"
  echo "$RESPONSE1" | head -20
  exit 1
else
  echo "✅ Step 1 complete"
fi

sleep 2

echo ""
echo "📋 Step 2/3: Creating storage buckets and policies..."
RESPONSE2=$(curl -s -X POST \
  -H "Authorization: Bearer $SUPABASE_MCP_TOKEN" \
  -H "Content-Type: application/sql" \
  --data-binary @./supabase/migrations/0002_create_storage_buckets.sql \
  "$MCP_URL" 2>&1)

if echo "$RESPONSE2" | grep -qi "error\|unauthorized\|forbidden"; then
  echo "⚠️  Step 2 warning (buckets may need manual creation):"
  echo "$RESPONSE2" | head -10
else
  echo "✅ Step 2 complete"
fi

sleep 2

echo ""
echo "📋 Step 3/3: Seeding initial data..."
RESPONSE3=$(curl -s -X POST \
  -H "Authorization: Bearer $SUPABASE_MCP_TOKEN" \
  -H "Content-Type: application/sql" \
  --data-binary @./supabase/migrations/0003_seed_initial_data.sql \
  "$MCP_URL" 2>&1)

if echo "$RESPONSE3" | grep -qi "error\|unauthorized\|forbidden"; then
  echo "⚠️  Step 3 warning (some data may not seed):"
  echo "$RESPONSE3" | head -10
else
  echo "✅ Step 3 complete"
fi

echo ""
echo "======================================"
echo "✅ Setup Script Complete!"
echo "======================================"
echo ""
echo "📊 Next, verify your setup:"
echo ""
echo "1. Log in to: https://app.supabase.com"
echo "2. Select your project (zenpcuwtvdetqpncwlmm)"
echo "3. Check:"
echo "   • Table Editor → See all tables created"
echo "   • SQL Editor → Run: SELECT COUNT(*) FROM projects;"
echo "   • Storage → See 3 buckets (project-images, team-photos, service-assets)"
echo ""
echo "🔌 To use in your React app:"
echo ""
echo "   1. Install: npm install @supabase/supabase-js"
echo "   2. Add to .env.local:"
echo "      VITE_SUPABASE_URL=https://zenpcuwtvdetqpncwlmm.supabase.co"
echo "      VITE_SUPABASE_ANON_KEY=<your_anon_key>"
echo ""
echo "   3. See SUPABASE_INTEGRATION.md for code examples"
echo ""
echo "📚 Documentation files created:"
echo "   • supabase/migrations/0001_*.sql  → Core tables"
echo "   • supabase/migrations/0002_*.sql  → Storage buckets"
echo "   • supabase/migrations/0003_*.sql  → Seed data"
echo "   • SUPABASE_INTEGRATION.md         → Integration guide"
echo ""
echo "🎉 You're all set! Your Supabase backend is ready to use."
