import { supabase } from '@/integrations/supabase/client';
import type { AdventureConfig } from '@/types/AdventureSettings';

export async function loadSettings(classId: string, adventureId: string): Promise<AdventureConfig | null> {
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    
    const response = await fetch(
      `https://yphkfkpfdpdmllotpqua.supabase.co/functions/v1/adventure-settings?class_id=${encodeURIComponent(classId)}&adventure_id=${encodeURIComponent(adventureId)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const settings = await response.json();
    return settings;
  } catch (error) {
    console.error('Failed to load adventure settings:', error);
    return null;
  }
}

export async function saveSettings(classId: string, adventureId: string, cfg: AdventureConfig) {
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    
    const response = await fetch(
      'https://yphkfkpfdpdmllotpqua.supabase.co/functions/v1/adventure-settings',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          class_id: classId,
          adventure_id: adventureId,
          settings: cfg
        })
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to save adventure settings:', error);
    throw error;
  }
}