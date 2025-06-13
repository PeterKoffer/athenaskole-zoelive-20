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
          bloom_taxonomy_level: number | null
          cognitive_level: string | null
          content: Json
          content_type: string
          created_at: string
          difficulty_level: number
          estimated_time: number
          id: string
          learning_objectives: string[] | null
          prerequisite_concepts: Json | null
          question_type_id: string | null
          skill_area: string
          subject: string
          tags: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          bloom_taxonomy_level?: number | null
          cognitive_level?: string | null
          content: Json
          content_type?: string
          created_at?: string
          difficulty_level: number
          estimated_time?: number
          id?: string
          learning_objectives?: string[] | null
          prerequisite_concepts?: Json | null
          question_type_id?: string | null
          skill_area: string
          subject: string
          tags?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          bloom_taxonomy_level?: number | null
          cognitive_level?: string | null
          content?: Json
          content_type?: string
          created_at?: string
          difficulty_level?: number
          estimated_time?: number
          id?: string
          learning_objectives?: string[] | null
          prerequisite_concepts?: Json | null
          question_type_id?: string | null
          skill_area?: string
          subject?: string
          tags?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "adaptive_content_question_type_id_fkey"
            columns: ["question_type_id"]
            isOneToOne: false
            referencedRelation: "question_types"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversation_history: {
        Row: {
          ai_confidence_score: number | null
          created_at: string
          id: string
          message_content: string
          message_order: number
          message_type: string | null
          response_time_ms: number | null
          sender: string
          session_id: string | null
        }
        Insert: {
          ai_confidence_score?: number | null
          created_at?: string
          id?: string
          message_content: string
          message_order: number
          message_type?: string | null
          response_time_ms?: number | null
          sender: string
          session_id?: string | null
        }
        Update: {
          ai_confidence_score?: number | null
          created_at?: string
          id?: string
          message_content?: string
          message_order?: number
          message_type?: string | null
          response_time_ms?: number | null
          sender?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversation_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_tutoring_sessions"
            referencedColumns: ["id"]
          },
        ]
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
      ai_tutoring_sessions: {
        Row: {
          ai_model_used: string | null
          created_at: string
          end_time: string | null
          id: string
          session_data: Json | null
          session_type: string
          skill_area: string | null
          start_time: string
          subject: string
          total_interactions: number | null
          user_id: string
          user_satisfaction_score: number | null
        }
        Insert: {
          ai_model_used?: string | null
          created_at?: string
          end_time?: string | null
          id?: string
          session_data?: Json | null
          session_type?: string
          skill_area?: string | null
          start_time?: string
          subject: string
          total_interactions?: number | null
          user_id: string
          user_satisfaction_score?: number | null
        }
        Update: {
          ai_model_used?: string | null
          created_at?: string
          end_time?: string | null
          id?: string
          session_data?: Json | null
          session_type?: string
          skill_area?: string | null
          start_time?: string
          subject?: string
          total_interactions?: number | null
          user_id?: string
          user_satisfaction_score?: number | null
        }
        Relationships: []
      }
      concept_mastery: {
        Row: {
          concept_name: string
          correct_attempts: number | null
          created_at: string
          decay_factor: number | null
          first_exposure: string | null
          id: string
          last_practice: string | null
          mastery_level: number | null
          practice_count: number | null
          subject: string
          total_attempts: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          concept_name: string
          correct_attempts?: number | null
          created_at?: string
          decay_factor?: number | null
          first_exposure?: string | null
          id?: string
          last_practice?: string | null
          mastery_level?: number | null
          practice_count?: number | null
          subject: string
          total_attempts?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          concept_name?: string
          correct_attempts?: number | null
          created_at?: string
          decay_factor?: number | null
          first_exposure?: string | null
          id?: string
          last_practice?: string | null
          mastery_level?: number | null
          practice_count?: number | null
          subject?: string
          total_attempts?: number | null
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
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          grade_level: number
          id?: string
          name: string
          subject: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          grade_level?: number
          id?: string
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      game_assignments: {
        Row: {
          assigned_to_class: string | null
          assigned_to_students: string[] | null
          created_at: string
          due_date: string | null
          game_id: string
          id: string
          is_active: boolean | null
          learning_objective: string | null
          lesson_id: string | null
          skill_area: string | null
          subject: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          assigned_to_class?: string | null
          assigned_to_students?: string[] | null
          created_at?: string
          due_date?: string | null
          game_id: string
          id?: string
          is_active?: boolean | null
          learning_objective?: string | null
          lesson_id?: string | null
          skill_area?: string | null
          subject: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          assigned_to_class?: string | null
          assigned_to_students?: string[] | null
          created_at?: string
          due_date?: string | null
          game_id?: string
          id?: string
          is_active?: boolean | null
          learning_objective?: string | null
          lesson_id?: string | null
          skill_area?: string | null
          subject?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          assignment_id: string | null
          completion_status: string | null
          created_at: string
          duration_seconds: number | null
          end_time: string | null
          engagement_metrics: Json | null
          game_id: string
          id: string
          learning_objectives_met: string[] | null
          performance_data: Json | null
          score: number | null
          skill_area: string | null
          start_time: string
          subject: string
          user_id: string
        }
        Insert: {
          assignment_id?: string | null
          completion_status?: string | null
          created_at?: string
          duration_seconds?: number | null
          end_time?: string | null
          engagement_metrics?: Json | null
          game_id: string
          id?: string
          learning_objectives_met?: string[] | null
          performance_data?: Json | null
          score?: number | null
          skill_area?: string | null
          start_time?: string
          subject: string
          user_id: string
        }
        Update: {
          assignment_id?: string | null
          completion_status?: string | null
          created_at?: string
          duration_seconds?: number | null
          end_time?: string | null
          engagement_metrics?: Json | null
          game_id?: string
          id?: string
          learning_objectives_met?: string[] | null
          performance_data?: Json | null
          score?: number | null
          skill_area?: string | null
          start_time?: string
          subject?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "game_assignments"
            referencedColumns: ["id"]
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
          prerequisites: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          curriculum_standard_id?: string | null
          description?: string | null
          difficulty_level?: number
          estimated_time_minutes?: number | null
          id?: string
          prerequisites?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          curriculum_standard_id?: string | null
          description?: string | null
          difficulty_level?: number
          estimated_time_minutes?: number | null
          id?: string
          prerequisites?: Json | null
          title?: string
          updated_at?: string
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
      learning_pathway_steps: {
        Row: {
          completion_time: string | null
          content_id: string | null
          created_at: string
          id: string
          is_completed: boolean | null
          learning_objective_id: string | null
          pathway_id: string | null
          score: number | null
          step_number: number
        }
        Insert: {
          completion_time?: string | null
          content_id?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          learning_objective_id?: string | null
          pathway_id?: string | null
          score?: number | null
          step_number: number
        }
        Update: {
          completion_time?: string | null
          content_id?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          learning_objective_id?: string | null
          pathway_id?: string | null
          score?: number | null
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_pathway_steps_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "adaptive_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_pathway_steps_learning_objective_id_fkey"
            columns: ["learning_objective_id"]
            isOneToOne: false
            referencedRelation: "learning_objectives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_pathway_steps_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "learning_pathways"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_pathways: {
        Row: {
          created_at: string
          current_step: number | null
          description: string | null
          difficulty_progression: Json | null
          estimated_completion_time: number | null
          id: string
          is_active: boolean | null
          subject: string
          title: string
          total_steps: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_step?: number | null
          description?: string | null
          difficulty_progression?: Json | null
          estimated_completion_time?: number | null
          id?: string
          is_active?: boolean | null
          subject: string
          title: string
          total_steps?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_step?: number | null
          description?: string | null
          difficulty_progression?: Json | null
          estimated_completion_time?: number | null
          id?: string
          is_active?: boolean | null
          subject?: string
          title?: string
          total_steps?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learning_recommendations: {
        Row: {
          based_on: Json | null
          completed_at: string | null
          confidence_score: number | null
          content_suggestion: string | null
          created_at: string
          estimated_time_minutes: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          recommendation_type: string
          skill_area: string
          subject: string
          user_id: string
        }
        Insert: {
          based_on?: Json | null
          completed_at?: string | null
          confidence_score?: number | null
          content_suggestion?: string | null
          created_at?: string
          estimated_time_minutes?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          recommendation_type: string
          skill_area: string
          subject: string
          user_id: string
        }
        Update: {
          based_on?: Json | null
          completed_at?: string | null
          confidence_score?: number | null
          content_suggestion?: string | null
          created_at?: string
          estimated_time_minutes?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          recommendation_type?: string
          skill_area?: string
          subject?: string
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
      lesson_progress: {
        Row: {
          created_at: string
          current_activity_index: number
          id: string
          is_completed: boolean | null
          lesson_data: Json | null
          score: number | null
          skill_area: string
          subject: string
          time_elapsed: number | null
          total_activities: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_activity_index?: number
          id?: string
          is_completed?: boolean | null
          lesson_data?: Json | null
          score?: number | null
          skill_area: string
          subject: string
          time_elapsed?: number | null
          total_activities?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_activity_index?: number
          id?: string
          is_completed?: boolean | null
          lesson_data?: Json | null
          score?: number | null
          skill_area?: string
          subject?: string
          time_elapsed?: number | null
          total_activities?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      question_types: {
        Row: {
          cognitive_level: string
          created_at: string
          description: string | null
          id: string
          interaction_type: string
          name: string
        }
        Insert: {
          cognitive_level?: string
          created_at?: string
          description?: string | null
          id?: string
          interaction_type?: string
          name: string
        }
        Update: {
          cognitive_level?: string
          created_at?: string
          description?: string | null
          id?: string
          interaction_type?: string
          name?: string
        }
        Relationships: []
      }
      subject_question_templates: {
        Row: {
          correct_answer: number
          created_at: string
          difficulty_level: number | null
          explanation_template: string | null
          id: string
          options_template: Json
          question_template: string
          skill_area: string
          subject: string
        }
        Insert: {
          correct_answer: number
          created_at?: string
          difficulty_level?: number | null
          explanation_template?: string | null
          id?: string
          options_template: Json
          question_template: string
          skill_area: string
          subject: string
        }
        Update: {
          correct_answer?: number
          created_at?: string
          difficulty_level?: number | null
          explanation_template?: string | null
          id?: string
          options_template?: Json
          question_template?: string
          skill_area?: string
          subject?: string
        }
        Relationships: []
      }
      user_learning_profiles: {
        Row: {
          attention_span_minutes: number | null
          average_response_time: number | null
          consistency_score: number | null
          created_at: string
          current_difficulty_level: number | null
          difficulty_adjustments: Json | null
          id: string
          last_session_date: string | null
          last_topic_covered: string | null
          learning_gaps: Json | null
          learning_style: string | null
          mastered_concepts: Json | null
          motivation_level: number | null
          overall_accuracy: number | null
          preferred_pace: string | null
          recommended_next_topic: string | null
          skill_area: string
          strengths: Json | null
          subject: string
          total_sessions: number | null
          total_time_spent: number | null
          updated_at: string
          user_id: string
          weaknesses: Json | null
        }
        Insert: {
          attention_span_minutes?: number | null
          average_response_time?: number | null
          consistency_score?: number | null
          created_at?: string
          current_difficulty_level?: number | null
          difficulty_adjustments?: Json | null
          id?: string
          last_session_date?: string | null
          last_topic_covered?: string | null
          learning_gaps?: Json | null
          learning_style?: string | null
          mastered_concepts?: Json | null
          motivation_level?: number | null
          overall_accuracy?: number | null
          preferred_pace?: string | null
          recommended_next_topic?: string | null
          skill_area: string
          strengths?: Json | null
          subject: string
          total_sessions?: number | null
          total_time_spent?: number | null
          updated_at?: string
          user_id: string
          weaknesses?: Json | null
        }
        Update: {
          attention_span_minutes?: number | null
          average_response_time?: number | null
          consistency_score?: number | null
          created_at?: string
          current_difficulty_level?: number | null
          difficulty_adjustments?: Json | null
          id?: string
          last_session_date?: string | null
          last_topic_covered?: string | null
          learning_gaps?: Json | null
          learning_style?: string | null
          mastered_concepts?: Json | null
          motivation_level?: number | null
          overall_accuracy?: number | null
          preferred_pace?: string | null
          recommended_next_topic?: string | null
          skill_area?: string
          strengths?: Json | null
          subject?: string
          total_sessions?: number | null
          total_time_spent?: number | null
          updated_at?: string
          user_id?: string
          weaknesses?: Json | null
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
          engagement_score: number | null
          id: string
          last_assessment: string
          learning_style: string | null
          preferred_pace: string | null
          retention_rate: number | null
          skill_area: string
          strengths: Json | null
          subject: string
          updated_at: string
          user_id: string
          weaknesses: Json | null
        }
        Insert: {
          accuracy_rate?: number
          attempts_count?: number
          completion_time_avg?: number
          created_at?: string
          current_level?: number
          engagement_score?: number | null
          id?: string
          last_assessment?: string
          learning_style?: string | null
          preferred_pace?: string | null
          retention_rate?: number | null
          skill_area: string
          strengths?: Json | null
          subject: string
          updated_at?: string
          user_id: string
          weaknesses?: Json | null
        }
        Update: {
          accuracy_rate?: number
          attempts_count?: number
          completion_time_avg?: number
          created_at?: string
          current_level?: number
          engagement_score?: number | null
          id?: string
          last_assessment?: string
          learning_style?: string | null
          preferred_pace?: string | null
          retention_rate?: number | null
          skill_area?: string
          strengths?: Json | null
          subject?: string
          updated_at?: string
          user_id?: string
          weaknesses?: Json | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          animations_enabled: boolean | null
          auto_read_explanations: boolean | null
          auto_read_questions: boolean | null
          created_at: string
          font_size: string | null
          id: string
          preferred_voice: string | null
          session_reminders: boolean | null
          speech_enabled: boolean | null
          speech_pitch: number | null
          speech_rate: number | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          animations_enabled?: boolean | null
          auto_read_explanations?: boolean | null
          auto_read_questions?: boolean | null
          created_at?: string
          font_size?: string | null
          id?: string
          preferred_voice?: string | null
          session_reminders?: boolean | null
          speech_enabled?: boolean | null
          speech_pitch?: number | null
          speech_rate?: number | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          animations_enabled?: boolean | null
          auto_read_explanations?: boolean | null
          auto_read_questions?: boolean | null
          created_at?: string
          font_size?: string | null
          id?: string
          preferred_voice?: string | null
          session_reminders?: boolean | null
          speech_enabled?: boolean | null
          speech_pitch?: number | null
          speech_rate?: number | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_question_history: {
        Row: {
          asked_at: string
          concepts_covered: Json | null
          correct_answer: string | null
          difficulty_level: number
          id: string
          is_correct: boolean
          mastery_indicators: Json | null
          question_number: number | null
          question_text: string
          question_type: string | null
          response_time_seconds: number | null
          session_id: string | null
          skill_area: string
          struggle_indicators: Json | null
          subject: string
          total_questions_in_session: number | null
          user_answer: string | null
          user_id: string
        }
        Insert: {
          asked_at?: string
          concepts_covered?: Json | null
          correct_answer?: string | null
          difficulty_level: number
          id?: string
          is_correct: boolean
          mastery_indicators?: Json | null
          question_number?: number | null
          question_text: string
          question_type?: string | null
          response_time_seconds?: number | null
          session_id?: string | null
          skill_area: string
          struggle_indicators?: Json | null
          subject: string
          total_questions_in_session?: number | null
          user_answer?: string | null
          user_id: string
        }
        Update: {
          asked_at?: string
          concepts_covered?: Json | null
          correct_answer?: string | null
          difficulty_level?: number
          id?: string
          is_correct?: boolean
          mastery_indicators?: Json | null
          question_number?: number | null
          question_text?: string
          question_type?: string | null
          response_time_seconds?: number | null
          session_id?: string | null
          skill_area?: string
          struggle_indicators?: Json | null
          subject?: string
          total_questions_in_session?: number | null
          user_answer?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_question_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "learning_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analyze_and_update_learning_profile: {
        Args: {
          p_user_id: string
          p_subject: string
          p_skill_area: string
          p_question_data: Json
          p_user_response: Json
        }
        Returns: undefined
      }
      generate_learning_path: {
        Args: {
          p_user_id: string
          p_subject: string
          p_target_concepts?: string[]
        }
        Returns: string
      }
      update_concept_mastery: {
        Args: {
          p_user_id: string
          p_concept_name: string
          p_subject: string
          p_is_correct: boolean
          p_response_time?: number
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
