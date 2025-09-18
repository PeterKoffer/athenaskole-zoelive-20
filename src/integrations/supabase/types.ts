export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
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
      adventure_image_cache: {
        Row: {
          adventure_title: string
          created_at: string | null
          id: string
          image_data: string | null
          image_url: string
          prompt: string
          prompt_hash: string
        }
        Insert: {
          adventure_title: string
          created_at?: string | null
          id?: string
          image_data?: string | null
          image_url: string
          prompt: string
          prompt_hash: string
        }
        Update: {
          adventure_title?: string
          created_at?: string | null
          id?: string
          image_data?: string | null
          image_url?: string
          prompt?: string
          prompt_hash?: string
        }
        Relationships: []
      }
      adventure_lesson_cache: {
        Row: {
          adventure_title: string
          content_hash: string
          created_at: string | null
          grade_level: string
          id: string
          lesson_data: Json
          subject: string
          updated_at: string | null
        }
        Insert: {
          adventure_title: string
          content_hash: string
          created_at?: string | null
          grade_level: string
          id?: string
          lesson_data: Json
          subject: string
          updated_at?: string | null
        }
        Update: {
          adventure_title?: string
          content_hash?: string
          created_at?: string | null
          grade_level?: string
          id?: string
          lesson_data?: Json
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      adventure_settings: {
        Row: {
          adventure_id: string
          class_id: string
          id: string
          settings: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          adventure_id: string
          class_id: string
          id?: string
          settings: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          adventure_id?: string
          class_id?: string
          id?: string
          settings?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      adventures: {
        Row: {
          created_at: string
          description: string | null
          grade_int: number
          id: string
          image_generated: boolean | null
          image_generated_adult: boolean | null
          image_generated_child: boolean | null
          image_generated_teen: boolean | null
          image_url: string | null
          image_url_adult: string | null
          image_url_child: string | null
          image_url_teen: string | null
          prompt: string | null
          subject: string | null
          title: string
          universe_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          grade_int: number
          id?: string
          image_generated?: boolean | null
          image_generated_adult?: boolean | null
          image_generated_child?: boolean | null
          image_generated_teen?: boolean | null
          image_url?: string | null
          image_url_adult?: string | null
          image_url_child?: string | null
          image_url_teen?: string | null
          prompt?: string | null
          subject?: string | null
          title: string
          universe_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          grade_int?: number
          id?: string
          image_generated?: boolean | null
          image_generated_adult?: boolean | null
          image_generated_child?: boolean | null
          image_generated_teen?: boolean | null
          image_url?: string | null
          image_url_adult?: string | null
          image_url_child?: string | null
          image_url_teen?: string | null
          prompt?: string | null
          subject?: string | null
          title?: string
          universe_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_cache: {
        Row: {
          created_at: string
          id: string
          json: Json
          key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          json: Json
          key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          json?: Json
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_images: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error: string | null
          height: number
          id: string
          model_version: string
          prompt: string
          provider: string
          replicate_prediction_id: string | null
          seed: number | null
          status: string
          storage_path: string | null
          universe_id: string
          width: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          height: number
          id?: string
          model_version: string
          prompt: string
          provider?: string
          replicate_prediction_id?: string | null
          seed?: number | null
          status: string
          storage_path?: string | null
          universe_id: string
          width: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          height?: number
          id?: string
          model_version?: string
          prompt?: string
          provider?: string
          replicate_prediction_id?: string | null
          seed?: number | null
          status?: string
          storage_path?: string | null
          universe_id?: string
          width?: number
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
      ai_metrics: {
        Row: {
          created_at: string | null
          duration_ms: number | null
          error_message: string | null
          id: string
          key: string
          model: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          key: string
          model?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          key?: string
          model?: string | null
          status?: string | null
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
      calendar_events: {
        Row: {
          all_day: boolean
          audiences: string[]
          class_id: string | null
          color: string | null
          created_at: string
          created_by: string
          details: string | null
          ends_at: string
          id: string
          location: string | null
          org_id: string
          rrule: string | null
          starts_at: string
          title: string
          updated_at: string
        }
        Insert: {
          all_day?: boolean
          audiences?: string[]
          class_id?: string | null
          color?: string | null
          created_at?: string
          created_by: string
          details?: string | null
          ends_at: string
          id?: string
          location?: string | null
          org_id: string
          rrule?: string | null
          starts_at: string
          title: string
          updated_at?: string
        }
        Update: {
          all_day?: boolean
          audiences?: string[]
          class_id?: string | null
          color?: string | null
          created_at?: string
          created_by?: string
          details?: string | null
          ends_at?: string
          id?: string
          location?: string | null
          org_id?: string
          rrule?: string | null
          starts_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      class_overrides: {
        Row: {
          class_id: string
          country_code: string | null
          currency_code: string | null
          curriculum_code: string | null
          locale: string | null
          measurement_system: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          class_id: string
          country_code?: string | null
          currency_code?: string | null
          curriculum_code?: string | null
          locale?: string | null
          measurement_system?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          class_id?: string
          country_code?: string | null
          currency_code?: string | null
          curriculum_code?: string | null
          locale?: string | null
          measurement_system?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
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
      cover_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          metadata: Json | null
          prompt: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          metadata?: Json | null
          prompt: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          metadata?: Json | null
          prompt?: string
          status?: string
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
      events: {
        Row: {
          created_at: string
          id: string
          name: string
          payload: Json
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          payload?: Json
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          payload?: Json
          session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      image_assets: {
        Row: {
          adventure_id: string | null
          ahash: string
          alt_text: string | null
          attribution_required: boolean | null
          bytes: number
          consistency_tag: string | null
          created_at: string | null
          created_by: string | null
          height: number
          id: string
          mime: string
          model: string | null
          moderation: Json | null
          negative_prompt: string | null
          palette: Json | null
          phase_id: string | null
          prompt: string | null
          provider: string | null
          provider_terms_url: string | null
          reusable: boolean | null
          seed: string | null
          storage_path: string
          style_pack: string | null
          subjects: string[] | null
          tags: string[] | null
          usage_count: number | null
          variant_of: string | null
          width: number
        }
        Insert: {
          adventure_id?: string | null
          ahash: string
          alt_text?: string | null
          attribution_required?: boolean | null
          bytes: number
          consistency_tag?: string | null
          created_at?: string | null
          created_by?: string | null
          height: number
          id?: string
          mime: string
          model?: string | null
          moderation?: Json | null
          negative_prompt?: string | null
          palette?: Json | null
          phase_id?: string | null
          prompt?: string | null
          provider?: string | null
          provider_terms_url?: string | null
          reusable?: boolean | null
          seed?: string | null
          storage_path: string
          style_pack?: string | null
          subjects?: string[] | null
          tags?: string[] | null
          usage_count?: number | null
          variant_of?: string | null
          width: number
        }
        Update: {
          adventure_id?: string | null
          ahash?: string
          alt_text?: string | null
          attribution_required?: boolean | null
          bytes?: number
          consistency_tag?: string | null
          created_at?: string | null
          created_by?: string | null
          height?: number
          id?: string
          mime?: string
          model?: string | null
          moderation?: Json | null
          negative_prompt?: string | null
          palette?: Json | null
          phase_id?: string | null
          prompt?: string | null
          provider?: string | null
          provider_terms_url?: string | null
          reusable?: boolean | null
          seed?: string | null
          storage_path?: string
          style_pack?: string | null
          subjects?: string[] | null
          tags?: string[] | null
          usage_count?: number | null
          variant_of?: string | null
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "image_assets_variant_of_fkey"
            columns: ["variant_of"]
            isOneToOne: false
            referencedRelation: "image_assets"
            referencedColumns: ["id"]
          },
        ]
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
      lesson_plans: {
        Row: {
          class_id: string | null
          created_at: string | null
          id: string
          lesson_data: Json
          org_id: string
          plan_date: string
          status: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          id?: string
          lesson_data: Json
          org_id: string
          plan_date: string
          status?: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          id?: string
          lesson_data?: Json
          org_id?: string
          plan_date?: string
          status?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lesson_snapshots: {
        Row: {
          created_at: string
          date: string
          frozen_config: Json
          id: string
          is_locked: boolean
          student_id: string
          universe_id: string | null
        }
        Insert: {
          created_at?: string
          date: string
          frozen_config: Json
          id?: string
          is_locked?: boolean
          student_id: string
          universe_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          frozen_config?: Json
          id?: string
          is_locked?: boolean
          student_id?: string
          universe_id?: string | null
        }
        Relationships: []
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
          country_code: string | null
          created_at: string
          currency_code: string | null
          curriculum_code: string | null
          email: string | null
          full_name: string | null
          grade: string | null
          id: string
          locale: string | null
          measurement_system: string | null
          name: string | null
          overall_mastery: number | null
          preferences: Json | null
          recent_performance: Json | null
          school: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          country_code?: string | null
          created_at?: string
          currency_code?: string | null
          curriculum_code?: string | null
          email?: string | null
          full_name?: string | null
          grade?: string | null
          id?: string
          locale?: string | null
          measurement_system?: string | null
          name?: string | null
          overall_mastery?: number | null
          preferences?: Json | null
          recent_performance?: Json | null
          school?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          country_code?: string | null
          created_at?: string
          currency_code?: string | null
          curriculum_code?: string | null
          email?: string | null
          full_name?: string | null
          grade?: string | null
          id?: string
          locale?: string | null
          measurement_system?: string | null
          name?: string | null
          overall_mastery?: number | null
          preferences?: Json | null
          recent_performance?: Json | null
          school?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          prompt_text: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          prompt_text: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          prompt_text?: string
          updated_at?: string
          version?: number
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
      scores: {
        Row: {
          country: string | null
          created_at: string
          game_id: string
          meta: Json
          period: string
          school_id: string | null
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          game_id: string
          meta?: Json
          period?: string
          school_id?: string | null
          score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          country?: string | null
          created_at?: string
          game_id?: string
          meta?: Json
          period?: string
          school_id?: string | null
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_adventures: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          is_recap: boolean
          performance_score: number | null
          student_id: string
          universe_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          is_recap?: boolean
          performance_score?: number | null
          student_id: string
          universe_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          is_recap?: boolean
          performance_score?: number | null
          student_id?: string
          universe_id?: string
          updated_at?: string
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
      universe_arcs: {
        Row: {
          class_id: string
          created_at: string
          date: string
          pack_id: string
          state: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          date: string
          pack_id: string
          state?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          date?: string
          pack_id?: string
          state?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      universe_content: {
        Row: {
          activities: Json
          created_at: string
          id: string
          objectives: string[]
          summary: string
          universe_id: string
          updated_at: string
        }
        Insert: {
          activities?: Json
          created_at?: string
          id?: string
          objectives?: string[]
          summary: string
          universe_id: string
          updated_at?: string
        }
        Update: {
          activities?: Json
          created_at?: string
          id?: string
          objectives?: string[]
          summary?: string
          universe_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      universe_image_jobs: {
        Row: {
          created_at: string
          failed: number
          finished_at: string | null
          id: string
          notes: string | null
          skipped: number
          started_at: string
          success: number
          total: number
        }
        Insert: {
          created_at?: string
          failed?: number
          finished_at?: string | null
          id?: string
          notes?: string | null
          skipped?: number
          started_at?: string
          success?: number
          total?: number
        }
        Update: {
          created_at?: string
          failed?: number
          finished_at?: string | null
          id?: string
          notes?: string | null
          skipped?: number
          started_at?: string
          success?: number
          total?: number
        }
        Relationships: []
      }
      universe_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_ai_generated: boolean
          lang: string
          source: string
          universe_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_ai_generated?: boolean
          lang?: string
          source?: string
          universe_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_ai_generated?: boolean
          lang?: string
          source?: string
          universe_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      universes: {
        Row: {
          content_hash: string | null
          created_at: string
          description: string | null
          goals: Json | null
          grade_level: string
          id: string
          image_status: string
          image_url: string | null
          lang: string
          metadata: Json
          owner_id: string
          slug: string
          subject: string
          title: string
          updated_at: string
          visibility: string
        }
        Insert: {
          content_hash?: string | null
          created_at?: string
          description?: string | null
          goals?: Json | null
          grade_level: string
          id?: string
          image_status?: string
          image_url?: string | null
          lang?: string
          metadata?: Json
          owner_id: string
          slug: string
          subject: string
          title: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          content_hash?: string | null
          created_at?: string
          description?: string | null
          goals?: Json | null
          grade_level?: string
          id?: string
          image_status?: string
          image_url?: string | null
          lang?: string
          metadata?: Json
          owner_id?: string
          slug?: string
          subject?: string
          title?: string
          updated_at?: string
          visibility?: string
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
      keyword_event: {
        Row: {
          created_at: string | null
          date_end: string | null
          date_start: string | null
          id: string | null
          name: string | null
          payload: Json | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date_end?: never
          date_start?: never
          id?: string | null
          name?: string | null
          payload?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date_end?: never
          date_start?: never
          id?: string | null
          name?: string | null
          payload?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_recent_cover_images: {
        Args: { _limit?: number }
        Returns: {
          created_at: string | null
          id: string
          image_url: string
          metadata: Json | null
          prompt: string
          status: string
          user_id: string
        }[]
      }
      has_role: {
        Args: { role: string; uid: string }
        Returns: boolean
      }
      jwt_claim: {
        Args: { "": string }
        Returns: string
      }
      purge_old_events: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      search_images: {
        Args: {
          p_consistency?: string
          p_limit?: number
          p_style?: string
          p_subject?: string
          p_tag?: string
          q?: string
        }
        Returns: {
          adventure_id: string | null
          ahash: string
          alt_text: string | null
          attribution_required: boolean | null
          bytes: number
          consistency_tag: string | null
          created_at: string | null
          created_by: string | null
          height: number
          id: string
          mime: string
          model: string | null
          moderation: Json | null
          negative_prompt: string | null
          palette: Json | null
          phase_id: string | null
          prompt: string | null
          provider: string | null
          provider_terms_url: string | null
          reusable: boolean | null
          seed: string | null
          storage_path: string
          style_pack: string | null
          subjects: string[] | null
          tags: string[] | null
          usage_count: number | null
          variant_of: string | null
          width: number
        }[]
      }
      submit_score: {
        Args: { p_game_id: string; p_meta?: Json; p_score: number }
        Returns: undefined
      }
      update_concept_mastery: {
        Args: {
          p_concept_name: string
          p_is_correct: boolean
          p_subject: string
          p_user_id: string
        }
        Returns: undefined
      }
      update_real_time_progress: {
        Args: {
          p_progress_delta: number
          p_skill_area: string
          p_subject: string
          p_time_spent: number
          p_user_id: string
        }
        Returns: undefined
      }
      update_user_performance: {
        Args: {
          p_completion_time: number
          p_is_correct: boolean
          p_skill_area: string
          p_subject: string
          p_user_id: string
        }
        Returns: undefined
      }
      upsert_universes: {
        Args: { _data: Json; _owner_id?: string }
        Returns: {
          attempted: number
          inserted: number
          skipped_slugs: string[]
        }[]
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
