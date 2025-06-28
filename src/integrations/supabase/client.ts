
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tgjudtnjhtumrfthegis.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnanVkdG5qaHR1bXJmdGhlZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NTk4NjEsImV4cCI6MjA2NDQzNTg2MX0.1OexubPIEWxM3sZ4ds3kSeWxNslKXbJo5GzCDOZRHcQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
