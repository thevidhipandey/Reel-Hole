# ReelVault
1. `npm install`
2. Create `.env.local` with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (Supabase: Project Settings, API).
3. `npm run dev`
Data and login use Supabase (tables + Row Level Security were created from the SQL script). Never commit `.env.local` or the service_role key.
