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
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          role: 'student' | 'teacher' | 'admin'
          identifier: string
          email: string
          profile_data?: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          role?: 'student' | 'teacher' | 'admin'
          identifier?: string
          email?: string
          profile_data?: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          semester: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          semester: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          semester?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          id: string
          student_id: string | null
          course_id: string | null
          enrollment_date: string | null
          status: 'active' | 'completed' | 'dropped' | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          student_id?: string | null
          course_id?: string | null
          enrollment_date?: string | null
          status?: 'active' | 'completed' | 'dropped' | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string | null
          course_id?: string | null
          enrollment_date?: string | null
          status?: 'active' | 'completed' | 'dropped' | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      grades: {
        Row: {
          id: string
          student_id: string | null
          course_id: string | null
          type: 'assignment' | 'quiz' | 'midterm' | 'final'
          score: number
          max_score: number
          weight: number
          date: string
          feedback: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          student_id?: string | null
          course_id?: string | null
          type: 'assignment' | 'quiz' | 'midterm' | 'final'
          score: number
          max_score: number
          weight: number
          date: string
          feedback?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string | null
          course_id?: string | null
          type?: 'assignment' | 'quiz' | 'midterm' | 'final'
          score?: number
          max_score?: number
          weight?: number
          date?: string
          feedback?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grades_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      attendance: {
        Row: {
          id: string
          student_id: string | null
          course_id: string | null
          date: string
          status: 'present' | 'absent' | 'late'
          duration: number
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          student_id?: string | null
          course_id?: string | null
          date: string
          status?: 'present' | 'absent' | 'late'
          duration: number
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string | null
          course_id?: string | null
          date?: string
          status?: 'present' | 'absent' | 'late'
          duration?: number
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          id: string
          from_id: string | null
          to_id: string | null
          course_id: string | null
          comment: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          from_id?: string | null
          to_id?: string | null
          course_id?: string | null
          comment: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          from_id?: string | null
          to_id?: string | null
          course_id?: string | null
          comment?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_from_id_fkey"
            columns: ["from_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_to_id_fkey"
            columns: ["to_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      student_historic_data: {
        Row: {
          id: string
          student_id: string | null
          year: number
          percentile: number
          cgpa: number
          strengths: string | null
          weaknesses: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          student_id?: string | null
          year: number
          percentile: number
          cgpa: number
          strengths?: string | null
          weaknesses?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string | null
          year?: number
          percentile?: number
          cgpa?: number
          strengths?: string | null
          weaknesses?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_historic_data_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          message: string
          response: string | null
          bot_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          response?: string | null
          bot_type?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          response?: string | null
          bot_type?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      resources: {
        Row: {
          id: string
          course_id: string
          name: string
          description: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          resource_type: string | null
          uploaded_by: string | null
          is_public: boolean
          download_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          name: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          resource_type?: string | null
          uploaded_by?: string | null
          is_public?: boolean
          download_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          name?: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          resource_type?: string | null
          uploaded_by?: string | null
          is_public?: boolean
          download_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_uploaded_by_fkey"
            columns: ["uploaded_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string | null
          group_id: string | null
          course_id: string | null
          subject: string
          content: string
          priority: string | null
          message_type: string | null
          is_read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id?: string | null
          group_id?: string | null
          course_id?: string | null
          subject: string
          content: string
          priority?: string | null
          message_type?: string | null
          is_read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string | null
          group_id?: string | null
          course_id?: string | null
          subject?: string
          content?: string
          priority?: string | null
          message_type?: string | null
          is_read?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      assessments: {
        Row: {
          id: string
          course_id: string
          name: string
          description: string | null
          type: string
          due_date: string | null
          total_marks: number
          weightage: number
          status: string
          subtopics_covered: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          name: string
          description?: string | null
          type: string
          due_date?: string | null
          total_marks: number
          weightage: number
          status?: string
          subtopics_covered?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          name?: string
          description?: string | null
          type?: string
          due_date?: string | null
          total_marks?: number
          weightage?: number
          status?: string
          subtopics_covered?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      student_timetable: {
        Row: {
          course_id: string | null
          course_name: string | null
          teacher_id: string | null
          teacher_name: string | null
          assessment_id: string | null
          assessment_name: string | null
          assessment_type: string | null
          due_date: string | null
          weightage: number | null
          urgency_status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      teacher_schedule: {
        Row: {
          course_id: string | null
          course_name: string | null
          semester: number | null
          student_count: number | null
          has_quiz_today: boolean | null
          attendance_rate: number | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      calculate_current_grade: {
        Args: {
          stud_id: string
          crs_id: string
        }
        Returns: {
          current_grade: number
          completed_assessments: number
          total_weightage: number
        }[]
      }
      project_future_grade: {
        Args: {
          stud_id: string
          crs_id: string
          assumed_performance?: number
        }
        Returns: {
          current_grade: number
          projected_grade: number
          remaining_weightage: number
          confidence_level: string
        }[]
      }
      get_attendance_warnings: {
        Args: {
          stud_id: string
          threshold?: number
        }
        Returns: {
          course_id: string
          course_name: string
          total_classes: number
          attended_classes: number
          attendance_rate: number
          classes_needed: number
          is_at_risk: boolean
        }[]
      }
      get_subtopic_performance: {
        Args: {
          stud_id: string
          crs_id: string
        }
        Returns: {
          subtopic_name: string
          average_score: number
          assessment_count: number
          trend: string
        }[]
      }
      get_pending_tasks: {
        Args: {
          teacher_uuid: string
        }
        Returns: {
          task_type: string
          course_id: string
          course_name: string
          title: string
          due_date: string
          priority: string
        }[]
      }
      get_recent_submissions: {
        Args: {
          teacher_uuid: string
        }
        Returns: {
          student_id: string
          student_name: string
          course_id: string
          course_name: string
          assessment_id: string
          assessment_name: string
          submitted_at: string
          status: string
        }[]
      }
      get_class_performance: {
        Args: {
          teacher_uuid: string
        }
        Returns: {
          course_id: string
          course_name: string
          average_score: number
          attendance_rate: number
          risk_students: number
          top_performers: number
        }[]
      }
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      user_role: "student" | "teacher" | "admin"
      enrollment_status: "active" | "completed" | "dropped"
      attendance_status: "present" | "absent" | "late"
      grade_type: "assignment" | "quiz" | "midterm" | "final"
      assignment_type: "homework" | "quiz" | "project" | "exam"
    }
  }
}