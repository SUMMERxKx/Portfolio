-- Migration for Daily Tasks feature
-- Run this in your Supabase SQL editor
-- This creates SEPARATE tables from your existing kanban_items table
-- Tables created: daily_tasks, daily_activity (separate from kanban_items)

-- Create daily_tasks table (separate from kanban_items)
CREATE TABLE IF NOT EXISTS daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'default-user',
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- If table already exists with UUID user_id, alter it to TEXT
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'daily_tasks' 
    AND column_name = 'user_id' 
    AND data_type = 'uuid'
  ) THEN
    ALTER TABLE daily_tasks ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
    ALTER TABLE daily_tasks ALTER COLUMN user_id SET DEFAULT 'default-user';
  END IF;
END $$;

-- Create daily_activity table (optional - can be computed from daily_tasks)
CREATE TABLE IF NOT EXISTS daily_activity (
  user_id TEXT NOT NULL DEFAULT 'default-user',
  date DATE NOT NULL,
  tasks_completed INT DEFAULT 0,
  PRIMARY KEY (user_id, date)
);

-- If daily_activity already exists with UUID user_id, alter it to TEXT
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'daily_activity' 
    AND column_name = 'user_id' 
    AND data_type = 'uuid'
  ) THEN
    ALTER TABLE daily_activity ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
    ALTER TABLE daily_activity ALTER COLUMN user_id SET DEFAULT 'default-user';
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_id ON daily_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_date ON daily_tasks(date);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_date ON daily_tasks(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON daily_activity(user_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup)
-- For now, allow all operations if you're using access code system
-- You can restrict these based on auth.users if needed

-- Drop existing policies if they exist (safe to run multiple times)
DROP POLICY IF EXISTS "Allow all operations on daily_tasks" ON daily_tasks;
DROP POLICY IF EXISTS "Allow all operations on daily_activity" ON daily_activity;

-- Allow all operations on daily_tasks (since we're using access code)
CREATE POLICY "Allow all operations on daily_tasks" ON daily_tasks
  FOR ALL USING (true) WITH CHECK (true);

-- Allow all operations on daily_activity
CREATE POLICY "Allow all operations on daily_activity" ON daily_activity
  FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for daily_tasks (only if not already added)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'daily_tasks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE daily_tasks;
  END IF;
END $$;

