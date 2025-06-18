import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';

// Environment variables
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
const testTimeout = 10000; // 10 seconds

// Check if environment variables are set
if (!supabaseUrl) {
  console.warn('Skipping Supabase integration tests because SUPABASE_URL is not set.');
  process.exit();
}

if (!supabaseKey) {
  console.warn('Skipping Supabase integration tests because SUPABASE_ANON_KEY is not set.');
  process.exit();
}

// Initialize Supabase client
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

describe('Supabase Integration', () => {
  beforeAll(() => {
    // Increase timeout for Supabase tests
    vi.setTimeout(testTimeout);
  });

  it('should connect to Supabase', async () => {
    const { data, error } = await supabase.from('curriculum_standards').select('*').limit(1);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should perform basic database operations', async () => {
    // Use an actual table from the schema instead of 'test_table'
    const { data, error } = await supabase
      .from('adaptive_content')
      .select('*')
      .limit(1);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
});
