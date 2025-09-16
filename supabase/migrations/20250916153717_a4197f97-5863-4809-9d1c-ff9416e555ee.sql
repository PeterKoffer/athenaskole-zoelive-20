-- Create storage bucket for adventure backstories
INSERT INTO storage.buckets (id, name, public) 
VALUES ('universe-backstories', 'universe-backstories', true);

-- Create RLS policies for backstory bucket
CREATE POLICY "Universe backstories are publicly viewable" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'universe-backstories');

CREATE POLICY "Service role can manage backstories" 
ON storage.objects FOR ALL 
USING (bucket_id = 'universe-backstories');