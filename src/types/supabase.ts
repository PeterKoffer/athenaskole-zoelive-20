
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      curriculum_standards: {
        Row: {
          id: string
          subject: string
          grade_level: number
          standard: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          subject: string
          grade_level: number
          standard: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          subject?: string
          grade_level?: number
          standard?: string
          description?: string | null
          created_at?: string
        }
      }
      adaptive_content: {
        Row: {
          id: string
          subject: string
          skill_area: string
          difficulty_level: number
          content: Json
          created_at: string
        }
        Insert: {
          id?: string
          subject: string
          skill_area: string
          difficulty_level: number
          content: Json
          created_at?: string
        }
        Update: {
          id?: string
          subject?: string
          skill_area?: string
          difficulty_level?: number
          content?: Json
          created_at?: string
        }
      }
      school_preferences: {
        Row: {
          id: string
          school_id: string
          subject_weights: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          subject_weights?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          subject_weights?: Json
          created_at?: string
          updated_at?: string
        }
      }
      teacher_preferences: {
        Row: {
          id: string
          teacher_id: string
          school_id: string
          subject_weights: Json
          weekly_emphasis: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          school_id: string
          subject_weights?: Json
          weekly_emphasis?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          school_id?: string
          subject_weights?: Json
          weekly_emphasis?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: string
          layer: Database["public"]["Enums"]["calendar_layer"]
          title: string
          description: string | null
          start_date: string
          end_date: string
          keywords: string[] | null
          scope_type: 'school' | 'year' | 'class' | 'custom'
          scope_target: string[] | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          layer: Database["public"]["Enums"]["calendar_layer"]
          title: string
          description?: string | null
          start_date: string
          end_date: string
          keywords?: string[] | null
          scope_type?: 'school' | 'year' | 'class' | 'custom'
          scope_target?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          layer?: Database["public"]["Enums"]["calendar_layer"]
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          keywords?: string[] | null
          scope_type?: 'school' | 'year' | 'class' | 'custom'
          scope_target?: string[] | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      calendar_layer: 'birthday' | 'holiday' | 'general' | 'league' | 'internal' | 'keyword'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
