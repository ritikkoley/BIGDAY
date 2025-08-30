export interface UserProfile {
  id: string;
  // Personal Information
  full_name: string;
  residential_address: string;
  contact_number: string;
  email: string;
  
  // Academic Details
  admission_number?: string;
  employee_id?: string;
  date_of_admission?: string;
  date_of_joining?: string;
  current_standard?: string;
  section?: string;
  
  // Family Information
  parent_guardian_name?: string;
  parent_contact_number?: string;
  emergency_contact?: string;
  
  // Accommodation & Classification
  accommodation_type: 'day_boarder' | 'hosteller';
  peer_group: 'pre_primary' | 'primary' | 'secondary' | 'higher_secondary' | 'staff';
  role: 'student' | 'teacher' | 'admin' | 'staff';
  
  // Additional Information
  department?: string;
  designation?: string;
  blood_group?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  religion?: string;
  caste_category?: string;
  
  // System Fields
  status: 'active' | 'inactive' | 'suspended' | 'graduated' | 'transferred';
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface FilterCriteria {
  role?: string[];
  peer_group?: string[];
  accommodation_type?: string[];
  status?: string[];
  department?: string[];
  current_standard?: string[];
  section?: string[];
  date_range?: {
    field: 'date_of_admission' | 'date_of_joining' | 'created_at';
    start: string;
    end: string;
  };
  search_term?: string;
}

export interface BulkOperation {
  type: 'create' | 'update' | 'delete' | 'export';
  user_ids?: string[];
  data?: Partial<UserProfile>[];
  format?: 'csv' | 'excel' | 'pdf';
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'export';
  table_name: string;
  record_id: string;
  old_values?: any;
  new_values?: any;
  performed_by: string;
  performed_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface SystemReport {
  id: string;
  name: string;
  type: 'user_summary' | 'academic_report' | 'attendance_summary' | 'performance_analysis';
  filters: FilterCriteria;
  generated_at: string;
  generated_by: string;
  file_path?: string;
  status: 'generating' | 'completed' | 'failed';
}