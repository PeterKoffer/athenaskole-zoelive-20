import { supabase } from "@/integrations/supabase/client";
import { LeaderboardEntry } from "../games/types";

export type { LeaderboardEntry };

export async function submitScore(gameId: string, score: number, meta: any = {}): Promise<boolean> {
  try {
    const { error } = await supabase.rpc("submit_score", {
      p_game_id: gameId,
      p_score: score,
      p_meta: meta
    });
    
    if (error) {
      console.error("Failed to submit score:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error submitting score:", error);
    return false;
  }
}

export async function getLeaderboard(
  gameId: string,
  scope: "world" | "country" | "school" = "world",
  limit: number = 100
): Promise<LeaderboardEntry[]> {
  try {
    let query = supabase
      .from("scores")
      .select(`
        user_id,
        score,
        meta,
        created_at,
        school_id,
        country,
        profiles!inner(name)
      `)
      .eq("game_id", gameId)
      .eq("period", new Date().toISOString().split('T')[0]) // today
      .order("score", { ascending: false })
      .limit(limit);

    // Add scope filters
    if (scope === "school") {
      // Get current user's school first
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.school_id) {
        query = query.eq("school_id", user.user_metadata.school_id);
      }
    } else if (scope === "country") {
      // Get current user's country first
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.country) {
        query = query.eq("country", user.user_metadata.country);
      }
    }

    const { data, error } = await query;
    
    if (error) {
      console.error("Failed to fetch leaderboard:", error);
      return [];
    }

    return (data || []).map((entry, index) => ({
      userId: entry.user_id,
      username: (entry.profiles as any)?.name || `Player ${entry.user_id.slice(0, 8)}`,
      score: entry.score,
      rank: index + 1,
      meta: (entry.meta as any) || {},
      createdAt: entry.created_at
    }));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

export async function getUserScore(gameId: string, userId?: string): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from("scores")
      .select("score")
      .eq("game_id", gameId)
      .eq("period", new Date().toISOString().split('T')[0]) // today
      .eq("user_id", userId || (await supabase.auth.getUser()).data.user?.id || '')
      .maybeSingle();
    
    if (error) {
      console.error("Failed to fetch user score:", error);
      return null;
    }
    
    return data?.score || null;
  } catch (error) {
    console.error("Error fetching user score:", error);
    return null;
  }
}