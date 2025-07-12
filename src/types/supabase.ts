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
      users: {
        Row: {
          id: string
          role: 'student' | 'teacher' | 'admin'
          identifier: string
          email: string
          profile_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          role: 'student' | 'teacher' | 'admin'
          identifier: string
          email: string
          profile_data?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'student' | 'teacher' | 'admin'
          identifier?: string
          email?: string
          profile_data?: Json
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          semester: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          semester: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          semester?: number
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          enrollment_date: string
          status: 'active' | 'completed' | 'dropped'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          enrollment_date?: string
          status?: 'active' | 'completed' | 'dropped'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          enrollment_date?: string
          status?: 'active' | 'completed' | 'dropped'
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          course_id: string
          date: string
          status: 'present' | 'absent' | 'late'
          duration: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          date: string
          status: 'present' | 'absent' | 'late'
          duration: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          date?: string
          status?: 'present' | 'absent' | 'late'
          duration?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      grades: {
        Row: {
          id: string
          student_id: string
          course_id: string
          type: 'assignment' | 'quiz' | 'midterm' | 'final'
          score: number
          max_score: number
          weight: number
          date: string
          feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          type: 'assignment' | 'quiz' | 'midterm' | 'final'
          score: number
          max_score: number
          weight: number
          date: string
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          type?: 'assignment' | 'quiz' | 'midterm' | 'final'
          score?: number
          max_score?: number
          weight?: number
          date?: string
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          from_id: string
          to_id: string
          course_id: string
          comment: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          from_id: string
          to_id: string
          course_id: string
          comment: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          from_id?: string
          to_id?: string
          course_id?: string
          comment?: string
          created_at?: string
          updated_at?: string
        }
      }
      student_historic_data: {
        Row: {
          id: string
          student_id: string
          year: number
          percentile: number
          cgpa: number
          strengths: string | null
          weaknesses: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          year: number
          percentile: number
          cgpa: number
          strengths?: string | null
          weaknesses?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          year?: number
          percentile?: number
          cgpa?: number
          strengths?: string | null
          weaknesses?: string | null
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
      user_role: 'student' | 'teacher' | 'admin'
      enrollment_status: 'active' | 'completed' | 'dropped'
      attendance_status: 'present' | 'absent' | 'late'
      grade_type: 'assignment' | 'quiz' | 'midterm' | 'final'
    }
  }
}