-- Create adventure_settings table for Teacher Panel configurations
CREATE TABLE IF NOT EXISTS adventure_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id TEXT NOT NULL,
  adventure_id TEXT NOT NULL,
  settings JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (class_id, adventure_id)
);

-- Enable RLS
ALTER TABLE adventure_settings ENABLE ROW LEVEL SECURITY;

-- Allow teachers to read/write their class settings
CREATE POLICY "Teachers can read adventure settings" 
ON adventure_settings FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Teachers can insert adventure settings" 
ON adventure_settings FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Teachers can update adventure settings" 
ON adventure_settings FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_adventure_settings_updated_at
BEFORE UPDATE ON adventure_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();