// @ts-nocheck
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { supabase } from '@/lib/supabaseClient';

const testTimeout = 10000; // 10 seconds

describe('Supabase Integration', () => {
  it('should connect to Supabase', async () => {
    const { data, error } = await supabase.from('curriculum_standards').select('*').limit(1);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  }, testTimeout);

  it('should perform basic database operations', async () => {
    // Use an actual table from the schema instead of 'test_table'
    const { data, error } = await supabase
      .from('adaptive_content')
      .select('*')
      .limit(1);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  }, testTimeout);
});
