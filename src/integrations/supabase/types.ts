export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      calendar_context: {
        Row: {
          active_themes: string[] | null
          created_at: string | null
          current_unit_duration: string | null
          end_date: string | null
          id: string
          school_id: string | null
          seasonal_keywords: string[] | null
          start_date: string | null
          unit_timeframe: string | null
          updated_at: string | null
        }
        Insert: {
          active_themes?: string[] | null
          created_at?: string | null
          current_unit_duration?: string | null
          end_date?: string | null
          id?: string
          school_id?: string | null
          seasonal_keywords?: string[] | null
          start_date?: string | null
          unit_timeframe?: string | null
          updated_at?: string | null
        }
        Update: {
          active_themes?: string[] | null
          created_at?: string | null
          current_unit_duration?: string | null
          end_date?: string | null
          id?: string
          school_id?: string | null
          seasonal_keywords?: string[] | null
          start_date?: string | null
          unit_timeframe?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_context_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      concept_mastery: {
        Row: {
          concept_name: string
          correct_attempts: number
          created_at: string
          id: string
          last_practice: string
          mastery_level: number
          practice_count: number
          subject: string
          total_attempts: number
          updated_at: string
          user_id: string
        }
        Insert: {
          concept_name: string
          correct_attempts?: number
          created_at?: string
          id?: string
          last_practice?: string
          mastery_level?: number
          practice_count?: number
          subject: string
          total_attempts?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          concept_name?: string
          correct_attempts?: number
          created_at?: string
          id?: string
          last_practice?: string
          mastery_level?: number
          practice_count?: number
          subject?: string
          total_attempts?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      curriculum_standards: {
        Row: {
          code: string
          created_at: string
          description: string | null
          grade_level: number
          id: string
          name: string
          subject: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          grade_level: number
          id?: string
          name: string
          subject: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          grade_level?: number
          id?: string
          name?: string
          subject?: string
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
      enhanced_student_profiles: {
        Row: {
          abilities_assessment: string | null
          created_at: string | null
          engagement_level: string | null
          grade_level: number | null
          id: string
          interests: string[] | null
          learning_style_preference: string | null
          performance_accuracy: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          abilities_assessment?: string | null
          created_at?: string | null
          engagement_level?: string | null
          grade_level?: number | null
          id?: string
          interests?: string[] | null
          learning_style_preference?: string | null
          performance_accuracy?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          abilities_assessment?: string | null
          created_at?: string | null
          engagement_level?: string | null
          grade_level?: number | null
          id?: string
          interests?: string[] | null
          learning_style_preference?: string | null
          performance_accuracy?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      knowledge_component_mastery: {
        Row: {
          attempts: number | null
          correct_attempts: number | null
          created_at: string | null
          history: Json | null
          id: string
          kc_id: string
          last_attempt_timestamp: string | null
          mastery_level: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attempts?: number | null
          correct_attempts?: number | null
          created_at?: string | null
          history?: Json | null
          id?: string
          kc_id: string
          last_attempt_timestamp?: string | null
          mastery_level?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attempts?: number | null
          correct_attempts?: number | null
          created_at?: string | null
          history?: Json | null
          id?: string
          kc_id?: string
          last_attempt_timestamp?: string | null
          mastery_level?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_component_mastery_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      learning_objectives: {
        Row: {
          created_at: string
          curriculum_standard_id: string | null
          description: string | null
          difficulty_level: number
          estimated_time_minutes: number | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          curriculum_standard_id?: string | null
          description?: string | null
          difficulty_level?: number
          estimated_time_minutes?: number | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          curriculum_standard_id?: string | null
          description?: string | null
          difficulty_level?: number
          estimated_time_minutes?: number | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_objectives_curriculum_standard_id_fkey"
            columns: ["curriculum_standard_id"]
            isOneToOne: false
            referencedRelation: "curriculum_standards"
            referencedColumns: ["id"]
          },
        ]
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
          overall_mastery: number | null
          preferences: Json | null
          recent_performance: Json | null
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
          overall_mastery?: number | null
          preferences?: Json | null
          recent_performance?: Json | null
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
          overall_mastery?: number | null
          preferences?: Json | null
          recent_performance?: Json | null
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
      school_preferences: {
        Row: {
          created_at: string
          id: string
          school_id: string
          subject_weights: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          school_id: string
          subject_weights?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          school_id?: string
          subject_weights?: Json
          updated_at?: string
        }
        Relationships: []
      }
      school_settings: {
        Row: {
          created_at: string | null
          curriculum_standards: string | null
          default_lesson_duration: number | null
          id: string
          pedagogy: string | null
          school_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          curriculum_standards?: string | null
          default_lesson_duration?: number | null
          id?: string
          pedagogy?: string | null
          school_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          curriculum_standards?: string | null
          default_lesson_duration?: number | null
          id?: string
          pedagogy?: string | null
          school_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          created_at: string | null
          grade_level: number
          id: string
          interests: string[] | null
          learning_style: string
          name: string
          progress: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          grade_level: number
          id?: string
          interests?: string[] | null
          learning_style: string
          name: string
          progress?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          grade_level?: number
          id?: string
          interests?: string[] | null
          learning_style?: string
          name?: string
          progress?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      teacher_preferences: {
        Row: {
          created_at: string
          id: string
          school_id: string
          subject_weights: Json
          teacher_id: string
          updated_at: string
          weekly_emphasis: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          school_id: string
          subject_weights?: Json
          teacher_id: string
          updated_at?: string
          weekly_emphasis?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          school_id?: string
          subject_weights?: Json
          teacher_id?: string
          updated_at?: string
          weekly_emphasis?: Json | null
        }
        Relationships: []
      }
      teacher_settings: {
        Row: {
          created_at: string | null
          curriculum_alignment: string | null
          id: string
          lesson_duration_minutes: number | null
          school_id: string | null
          subject_priorities: Json | null
          teacher_id: string | null
          teaching_approach: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          curriculum_alignment?: string | null
          id?: string
          lesson_duration_minutes?: number | null
          school_id?: string | null
          subject_priorities?: Json | null
          teacher_id?: string | null
          teaching_approach?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          curriculum_alignment?: string | null
          id?: string
          lesson_duration_minutes?: number | null
          school_id?: string | null
          subject_priorities?: Json | null
          teacher_id?: string | null
          teaching_approach?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_settings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      training_ground_content: {
        Row: {
          completion_time_seconds: number | null
          context_parameters: Json
          generated_content: Json
          generation_timestamp: string | null
          grade_level: number
          id: string
          student_id: string | null
          student_rating: number | null
          subject: string
          was_completed: boolean | null
        }
        Insert: {
          completion_time_seconds?: number | null
          context_parameters: Json
          generated_content: Json
          generation_timestamp?: string | null
          grade_level: number
          id?: string
          student_id?: string | null
          student_rating?: number | null
          subject: string
          was_completed?: boolean | null
        }
        Update: {
          completion_time_seconds?: number | null
          context_parameters?: Json
          generated_content?: Json
          generation_timestamp?: string | null
          grade_level?: number
          id?: string
          student_id?: string | null
          student_rating?: number | null
          subject?: string
          was_completed?: boolean | null
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
      update_concept_mastery: {
        Args: {
          p_user_id: string
          p_concept_name: string
          p_subject: string
          p_is_correct: boolean
        }
        Returns: undefined
      }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
