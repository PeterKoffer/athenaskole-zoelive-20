export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      adaptive_content: {
        Row: {
          content: Json
          content_type: string
          created_at: string
          difficulty_level: number
          estimated_time: number | null
          id: string
          learning_objectives: string[] | null
          prerequisites: string[] | null
          skill_area: string
          subject: string
          success_criteria: Json | null
          title: string
        }
        Insert: {
          content: Json
          content_type: string
          created_at?: string
          difficulty_level: number
          estimated_time?: number | null
          id?: string
          learning_objectives?: string[] | null
          prerequisites?: string[] | null
          skill_area: string
          subject: string
          success_criteria?: Json | null
          title: string
        }
        Update: {
          content?: Json
          content_type?: string
          created_at?: string
          difficulty_level?: number
          estimated_time?: number | null
          id?: string
          learning_objectives?: string[] | null
          prerequisites?: string[] | null
          skill_area?: string
          subject?: string
          success_criteria?: Json | null
          title?: string
        }
        Relationships: []
      }
      ai_interactions: {
        Row: {
          ai_service: string
          cost_estimate: number | null
          created_at: string
          error_message: string | null
          id: string
          interaction_type: string
          processing_time_ms: number | null
          prompt_text: string | null
          response_data: Json | null
          success: boolean
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          ai_service: string
          cost_estimate?: number | null
          created_at?: string
          error_message?: string | null
          id?: string
          interaction_type: string
          processing_time_ms?: number | null
          prompt_text?: string | null
          response_data?: Json | null
          success?: boolean
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          ai_service?: string
          cost_estimate?: number | null
          created_at?: string
          error_message?: string | null
          id?: string
          interaction_type?: string
          processing_time_ms?: number | null
          prompt_text?: string | null
          response_data?: Json | null
          success?: boolean
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
      daily_analytics: {
        Row: {
          achievements_earned: Json | null
          ai_interactions_count: number
          created_at: string
          date: string
          engagement_score: number | null
          id: string
          subjects_studied: Json | null
          total_session_time: number
          user_id: string
        }
        Insert: {
          achievements_earned?: Json | null
          ai_interactions_count?: number
          created_at?: string
          date: string
          engagement_score?: number | null
          id?: string
          subjects_studied?: Json | null
          total_session_time?: number
          user_id: string
        }
        Update: {
          achievements_earned?: Json | null
          ai_interactions_count?: number
          created_at?: string
          date?: string
          engagement_score?: number | null
          id?: string
          subjects_studied?: Json | null
          total_session_time?: number
          user_id?: string
        }
        Relationships: []
      }
      learning_paths: {
        Row: {
          completion_percentage: number | null
          created_at: string
          current_step: number
          difficulty_progression: Json
          id: string
          is_active: boolean | null
          path_name: string
          recommended_content: string[]
          subject: string
          total_steps: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string
          current_step?: number
          difficulty_progression: Json
          id?: string
          is_active?: boolean | null
          path_name: string
          recommended_content: string[]
          subject: string
          total_steps: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string
          current_step?: number
          difficulty_progression?: Json
          id?: string
          is_active?: boolean | null
          path_name?: string
          recommended_content?: string[]
          subject?: string
          total_steps?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learning_sessions: {
        Row: {
          ai_adjustments: Json | null
          completed: boolean | null
          content_id: string | null
          created_at: string
          difficulty_level: number
          end_time: string | null
          id: string
          score: number | null
          skill_area: string
          start_time: string
          subject: string
          time_spent: number | null
          user_feedback: Json | null
          user_id: string
        }
        Insert: {
          ai_adjustments?: Json | null
          completed?: boolean | null
          content_id?: string | null
          created_at?: string
          difficulty_level: number
          end_time?: string | null
          id?: string
          score?: number | null
          skill_area: string
          start_time?: string
          subject: string
          time_spent?: number | null
          user_feedback?: Json | null
          user_id: string
        }
        Update: {
          ai_adjustments?: Json | null
          completed?: boolean | null
          content_id?: string | null
          created_at?: string
          difficulty_level?: number
          end_time?: string | null
          id?: string
          score?: number | null
          skill_area?: string
          start_time?: string
          subject?: string
          time_spent?: number | null
          user_feedback?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_sessions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "adaptive_content"
            referencedColumns: ["id"]
          },
        ]
      }
      music_projects: {
        Row: {
          collaboration_users: Json | null
          created_at: string
          generated_audio_url: string | null
          id: string
          metadata: Json | null
          music_style: string | null
          project_name: string
          project_type: string
          prompt_used: string | null
          soundtrap_project_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          collaboration_users?: Json | null
          created_at?: string
          generated_audio_url?: string | null
          id?: string
          metadata?: Json | null
          music_style?: string | null
          project_name: string
          project_type: string
          prompt_used?: string | null
          soundtrap_project_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          collaboration_users?: Json | null
          created_at?: string
          generated_audio_url?: string | null
          id?: string
          metadata?: Json | null
          music_style?: string | null
          project_name?: string
          project_type?: string
          prompt_used?: string | null
          soundtrap_project_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      Nelie: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          email: string | null
          grade: string | null
          id: string
          name: string | null
          school: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          grade?: string | null
          id?: string
          name?: string | null
          school?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          grade?: string | null
          id?: string
          name?: string | null
          school?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      real_time_progress: {
        Row: {
          achievements: Json | null
          id: string
          last_activity: string
          progress_percentage: number
          skill_area: string
          streak_count: number
          subject: string
          total_time_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements?: Json | null
          id?: string
          last_activity?: string
          progress_percentage?: number
          skill_area: string
          streak_count?: number
          subject: string
          total_time_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements?: Json | null
          id?: string
          last_activity?: string
          progress_percentage?: number
          skill_area?: string
          streak_count?: number
          subject?: string
          total_time_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activity_sessions: {
        Row: {
          completion_status: string
          created_at: string
          duration_minutes: number | null
          end_time: string | null
          engagement_score: number | null
          id: string
          metadata: Json | null
          session_type: string
          start_time: string
          subject: string | null
          user_id: string
        }
        Insert: {
          completion_status?: string
          created_at?: string
          duration_minutes?: number | null
          end_time?: string | null
          engagement_score?: number | null
          id?: string
          metadata?: Json | null
          session_type: string
          start_time?: string
          subject?: string | null
          user_id: string
        }
        Update: {
          completion_status?: string
          created_at?: string
          duration_minutes?: number | null
          end_time?: string | null
          engagement_score?: number | null
          id?: string
          metadata?: Json | null
          session_type?: string
          start_time?: string
          subject?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_performance: {
        Row: {
          accuracy_rate: number
          attempts_count: number
          completion_time_avg: number | null
          correct_answers: number
          created_at: string
          current_level: number
          id: string
          last_assessment: string | null
          skill_area: string
          subject: string
          total_questions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_rate?: number
          attempts_count?: number
          completion_time_avg?: number | null
          correct_answers?: number
          created_at?: string
          current_level?: number
          id?: string
          last_assessment?: string | null
          skill_area: string
          subject: string
          total_questions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_rate?: number
          attempts_count?: number
          completion_time_avg?: number | null
          correct_answers?: number
          created_at?: string
          current_level?: number
          id?: string
          last_assessment?: string | null
          skill_area?: string
          subject?: string
          total_questions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_real_time_progress: {
        Args: {
          p_user_id: string
          p_subject: string
          p_skill_area: string
          p_time_spent: number
          p_progress_delta: number
        }
        Returns: undefined
      }
      update_user_performance: {
        Args: {
          p_user_id: string
          p_subject: string
          p_skill_area: string
          p_is_correct: boolean
          p_completion_time: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
