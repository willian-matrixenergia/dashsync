-- Create dashboards table
CREATE TABLE IF NOT EXISTS dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;

-- Allow public read access (adjust as needed)
CREATE POLICY "Allow public read" ON dashboards
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update (adjust as needed)
CREATE POLICY "Allow authenticated insert" ON dashboards
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON dashboards
  FOR UPDATE USING (true) WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dashboards_updated_at_trigger
BEFORE UPDATE ON dashboards
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
