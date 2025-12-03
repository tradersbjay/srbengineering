# Supabase Integration Guide for SRB Engineering

This guide shows how to integrate your React app with the Supabase backend.

## Setup

### 1. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 2. Add Environment Variables

Update `.env.local`:

```bash
VITE_SUPABASE_URL=https://zenpcuwtvdetqpncwlmm.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these values from:
- Supabase Dashboard > Settings > API > Project URL and anon key

### 3. Create Supabase Client

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 4. Update DataContext to Use Supabase

Replace localStorage with Supabase queries in `DataContext.tsx`:

```typescript
import { supabase } from './lib/supabase';

// Fetch projects from Supabase
useEffect(() => {
  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      setProjects(INITIAL_PROJECTS);
    } else {
      setProjects(data || INITIAL_PROJECTS);
    }
  };
  
  fetchProjects();
}, []);

// Add project
const addProject = async (project: Project) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding project:', error);
  } else if (data) {
    setProjects([data, ...projects]);
  }
};

// Update project
const updateProject = async (id: string, updates: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating project:', error);
  } else if (data) {
    setProjects(projects.map(p => p.id === id ? data : p));
  }
};

// Delete project
const deleteProject = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting project:', error);
  } else {
    setProjects(projects.filter(p => p.id !== id));
  }
};
```

### 5. Update Contact Form to Save to Database

In `Contact.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError('');

  try {
    // Validate...
    
    // Save to database
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([{
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        email_address: formData.email_address,
        interested_service: formData.interested_service,
        message: formData.message
      }]);
    
    if (dbError) throw dbError;

    // Send email via EmailJS (existing code)
    await emailjs.send(
      process.env.VITE_EMAILJS_SERVICE_ID!,
      process.env.VITE_EMAILJS_TEMPLATE_ID!,
      {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        email_address: formData.email_address,
        interested_service: formData.interested_service,
        message: formData.message,
        from_email: process.env.VITE_EMAILJS_FROM_EMAIL!,
        to_email: process.env.VITE_EMAILJS_RECIPIENT_EMAIL!,
        reply_to: formData.email_address
      }
    );

    setSubmitted(true);
    // Reset form...
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to submit form');
  } finally {
    setIsSubmitting(false);
  }
};
```

### 6. Upload Images to Storage

Example function to upload project images:

```typescript
const uploadProjectImage = async (file: File): Promise<string> => {
  const fileName = `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('project-images')
    .upload(fileName, file);
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('project-images')
    .getPublicUrl(fileName);
  
  return publicUrl;
};
```

### 7. Real-time Subscriptions (Optional)

Listen for live database changes:

```typescript
useEffect(() => {
  const subscription = supabase
    .from('projects')
    .on('*', payload => {
      console.log('Change received!', payload);
      // Update UI with new data
    })
    .subscribe();
  
  return () => {
    supabase.removeSubscription(subscription);
  };
}, []);
```

## Running Setup Script

From repo root:

```bash
export SUPABASE_MCP_TOKEN=sbp_...
chmod +x supabase/setup.sh
./supabase/setup.sh
```

This will:
1. Create all tables
2. Set up storage buckets
3. Create RLS policies
4. Seed sample data

## Verifying Setup

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** → Run this query:

```sql
select 
  (select count(*) from projects) as projects,
  (select count(*) from services) as services,
  (select count(*) from team_members) as team_members,
  (select count(*) from contact_messages) as messages;
```

Should show: projects=5, services=5, team_members=3, messages=0

4. Check **Storage** section for three buckets:
   - `project-images`
   - `team-photos`
   - `service-assets`

## Troubleshooting

**Issue: SUPABASE_MCP_TOKEN not recognized**
```bash
export SUPABASE_MCP_TOKEN=sbp_your_token_here
echo $SUPABASE_MCP_TOKEN  # Verify it's set
```

**Issue: Database connection fails**
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct
- Check Supabase Dashboard > Settings > API for correct values
- Ensure RLS policies allow public read (already configured)

**Issue: Storage upload fails**
- Verify bucket exists in Supabase Storage
- Check file permissions and MIME type
- Test upload via Supabase Dashboard first

## File Structure

```
supabase/
├── migrations/
│   ├── 0001_create_tables_and_functions.sql
│   ├── 0002_create_storage_buckets.sql
│   └── 0003_seed_initial_data.sql
├── setup.sh
└── MCP_DEPLOY.md

src/
├── lib/
│   └── supabase.ts  (to be created)
├── DataContext.tsx  (to be updated)
├── components/
│   ├── Contact.tsx  (to be updated)
│   └── ...
```

## Next Steps

1. ✅ Run setup script
2. ⏭️ Update DataContext to fetch from Supabase
3. ⏭️ Update Contact form to save messages
4. ⏭️ Add image upload to Admin panel
5. ⏭️ Test live with real data
6. ⏭️ Deploy to production

## Security

- RLS policies ensure public data is readable but only authenticated admins can modify
- Anon key has limited permissions (check Supabase Dashboard)
- For production, set up proper authentication (Magic Links, OAuth, etc.)
- Never commit `.env.local` with real credentials

## Support

- [Supabase Docs](https://supabase.com/docs)
- [React Client Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
- [Storage Guide](https://supabase.com/docs/guides/storage)
