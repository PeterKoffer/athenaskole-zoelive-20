
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
