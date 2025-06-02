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
          estimated_time: number
          id: string
          learning_objectives: string[] | null
          skill_area: string
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          content: Json
          content_type?: string
          created_at?: string
          difficulty_level: number
          estimated_time?: number
          id?: string
          learning_objectives?: string[] | null
          skill_area: string
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          content_type?: string
          created_at?: string
          difficulty_level?: number
          estimated_time?: number
          id?: string
          learning_objectives?: string[] | null
          skill_area?: string
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_interactions: {
        Row: {
          ai_service: string
          created_at: string
          difficulty_level: number | null
          error_message: string | null
          id: string
          interaction_type: string
          prompt_text: string | null
          response_data: Json | null
          skill_area: string | null
          subject: string | null
          success: boolean
          user_id: string
        }
        Insert: {
          ai_service: string
          created_at?: string
          difficulty_level?: number | null
          error_message?: string | null
          id?: string
          interaction_type: string
          prompt_text?: string | null
          response_data?: Json | null
          skill_area?: string | null
          subject?: string | null
          success?: boolean
          user_id: string
        }
        Update: {
          ai_service?: string
          created_at?: string
          difficulty_level?: number | null
          error_message?: string | null
          id?: string
          interaction_type?: string
          prompt_text?: string | null
          response_data?: Json | null
          skill_area?: string | null
          subject?: string | null
          success?: boolean
          user_id?: string
        }
        Relationships: []
      }
      learning_sessions: {
        Row: {
          completed: boolean
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
          completed?: boolean
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
          completed?: boolean
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
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          birth_date: string | null
          created_at: string | null
          email: string | null
          grade: string | null
          id: string
          name: string | null
          school: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          grade?: string | null
          id: string
          name?: string | null
          school?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          grade?: string | null
          id?: string
          name?: string | null
          school?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_performance: {
        Row: {
          accuracy_rate: number
          attempts_count: number
          completion_time_avg: number
          created_at: string
          current_level: number
          id: string
          last_assessment: string
          skill_area: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_rate?: number
          attempts_count?: number
          completion_time_avg?: number
          created_at?: string
          current_level?: number
          id?: string
          last_assessment?: string
          skill_area: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_rate?: number
          attempts_count?: number
          completion_time_avg?: number
          created_at?: string
          current_level?: number
          id?: string
          last_assessment?: string
          skill_area?: string
          subject?: string
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
