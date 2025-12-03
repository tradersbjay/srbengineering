MCP Supabase Deployment Guide

This guide shows how to apply the SQL migration using the Supabase MCP HTTP endpoint.

Prerequisites:
- MCP server URL configured in `mcp.config.json`
- SUPABASE_MCP_TOKEN set in your environment (do NOT commit this token)

Apply migration using curl:

```bash
export SUPABASE_MCP_TOKEN=sbp_REDACTED
curl -X POST \
  -H "Authorization: Bearer $SUPABASE_MCP_TOKEN" \
  -H "Content-Type: application/sql" \
  --data-binary @./supabase/migrations/0001_create_tables_and_functions.sql \
  "https://mcp.supabase.com/mcp?project_ref=zenpcuwtvdetqpncwlmm&features=database,functions,branching,storage"
```

If successful, the migration will create the tables and functions in your Supabase project.
