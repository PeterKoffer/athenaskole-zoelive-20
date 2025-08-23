// src/services/universe/arcs.ts
import { supabase } from '@/integrations/supabase/client';

export interface UniverseArcData {
  user_id: string;
  class_id: string;
  pack_id: string;
  date: string;
  state: {
    title: string;
    minutesTotal: number;
    subjectOfDay: string;
    gradeBand: string;
    activities: Array<{
      kind: string;
      title: string;
      minutes: number;
    }>;
    [key: string]: any; // Allow additional state properties
  };
}

export async function saveUniverseArc(arcData: UniverseArcData): Promise<void> {
  try {
    console.log('💾 Saving universe arc:', arcData);
    
    const { error } = await supabase
      .from('universe_arcs')
      .upsert(arcData, { 
        onConflict: 'user_id,class_id,date'
      });

    if (error) {
      console.error('❌ Failed to save universe arc:', error);
      throw error;
    }

    console.log('✅ Universe arc saved successfully');
  } catch (error) {
    console.error('❌ Error saving universe arc:', error);
    // Don't throw - this is supplementary data, don't break the lesson flow
  }
}

export async function getUniverseArc(
  userId: string, 
  classId: string, 
  date: string
): Promise<UniverseArcData | null> {
  try {
    const { data, error } = await supabase
      .from('universe_arcs')
      .select('*')
      .eq('user_id', userId)
      .eq('class_id', classId)
      .eq('date', date)
      .maybeSingle();

    if (error) {
      console.error('❌ Failed to get universe arc:', error);
      return null;
    }

    return data as unknown as UniverseArcData | null;
  } catch (error) {
    console.error('❌ Error getting universe arc:', error);
    return null;
  }
}

export async function getUserUniverseHistory(
  userId: string,
  classId?: string,
  limit: number = 30
): Promise<UniverseArcData[]> {
  try {
    let query = supabase
      .from('universe_arcs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit);

    if (classId) {
      query = query.eq('class_id', classId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Failed to get universe history:', error);
      return [];
    }

    return (data || []) as unknown as UniverseArcData[];
  } catch (error) {
    console.error('❌ Error getting universe history:', error);
    return [];
  }
}