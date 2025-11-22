# Supabase Setup Instructions for Daily Tasks

Follow these steps to set up the database tables for the Daily Tasks feature.

## Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (the same one you're using for the kanban board)

## Step 2: Navigate to SQL Editor

1. In the left sidebar, click on **"SQL Editor"** (it has a database icon)
2. You should see a blank SQL editor window

## Step 3: Create a New Query

1. Click the **"New query"** button (usually at the top)
2. Give it a name like "Daily Tasks Migration" (optional)

## Step 4: Copy and Paste the Migration SQL

1. Open the file `supabase_migration.sql` in your project
2. Copy **ALL** the contents of that file
3. Paste it into the SQL Editor in Supabase

## Step 5: Run the Migration

1. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. You should see a success message like "Success. No rows returned"
3. If you see any errors, check the error message and let me know

## Step 6: Verify Tables Were Created

1. In the left sidebar, click on **"Table Editor"**
2. You should now see two new tables:
   - `daily_tasks`
   - `daily_activity`
3. Your existing `kanban_items` table should still be there (unchanged)

## Step 7: Verify Realtime is Enabled (Optional)

1. In the left sidebar, click on **"Database"** → **"Replication"**
2. You should see `daily_tasks` in the list of replicated tables
3. If it's not there, the migration should have added it automatically

## Step 8: Test the Daily Tasks Page

1. Go back to your website
2. Navigate to the `/daily` page
3. Log in with your access code (same as kanban board)
4. Try adding a task - it should work now!

## Troubleshooting

### If you get a "relation already exists" error:
- The tables might already exist - that's okay! The migration uses `IF NOT EXISTS` so it's safe to run multiple times.

### If you get a "policy already exists" error:
- The migration now handles this by dropping existing policies first. If you still see this, you can manually delete the policies and re-run.

### If you get a "permission denied" error:
- Make sure you're running the SQL as the database owner/admin
- Check that you have the correct permissions in your Supabase project

### If tasks still don't add:
- Check the browser console (F12) for error messages
- Verify the table names match: `daily_tasks` (not `daily_task` or `daily_tasks_table`)
- Make sure you're logged in with your access code

## What the Migration Creates

- **`daily_tasks` table**: Stores all your daily tasks
  - Columns: id, user_id, title, description, is_completed, date, created_at
  
- **`daily_activity` table**: Tracks daily completion stats (optional)
  - Columns: user_id, date, tasks_completed
  
- **Indexes**: For faster queries
- **RLS Policies**: Row Level Security policies (currently open for access code system)
- **Realtime**: Enables live updates when tasks change

## Notes

- This migration is **safe** - it won't affect your existing `kanban_items` table
- You can run it multiple times without issues
- The tables are completely separate from your kanban board

