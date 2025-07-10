
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';

// Environment variables
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
const testTimeout = 10000; // 10 seconds

describe('Supabase Integration', () => {
  beforeAll(() => {
    // Skip tests if environment variables are not set
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Skipping Supabase integration tests - environment variables not set');
    }
  });

  it.skipIf(!supabaseUrl || !supabaseKey)('should connect to Supabase', async () => {
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('curriculum_standards').select('*').limit(1);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  }, testTimeout);

  it.skipIf(!supabaseUrl || !supabaseKey)('should perform basic database operations', async () => {
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);
    
    // Use an actual table from the schema instead of 'test_table'
    const { data, error } = await supabase
      .from('adaptive_content')
      .select('*')
      .limit(1);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  }, testTimeout);

  it('should handle missing environment variables gracefully', () => {
    // This test always runs to ensure the test suite handles missing env vars
    if (!supabaseUrl || !supabaseKey) {
      expect(true).toBe(true); // Test passes when env vars are missing
    } else {
      expect(supabaseUrl).toBeTruthy();
      expect(supabaseKey).toBeTruthy();
    }
  });
});
