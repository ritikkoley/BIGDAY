// Types for Operations Console

// =====================================================
// 1. LEAD MANAGEMENT
// =====================================================

export interface LeadSource {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  student_name: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  parent_name: string;
  parent_email?: string;
  parent_phone: string;
  parent_occupation?: string;
  current_school?: string;
  grade_applying_for: string;
  source_id?: string;
  source_details?: string;
  stage: 'new_inquiry' | 'campus_visit' | 'application' | 'interview' | 'admitted' | 'enrolled' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  notes?: string;
  scheduled_visit_date?: string;
  interview_date?: string;
  status: 'active' | 'converted' | 'archived';
  converted_to_student_id?: string;
  lost_reason?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface LeadInteraction {
  id: string;
  lead_id: string;
  interaction_type: 'call' | 'email' | 'visit' | 'whatsapp' | 'meeting' | 'other';
  interaction_date: string;
  notes: string;
  next_followup_date?: string;
  created_by?: string;
  created_at: string;
}

export interface LeadAnalytics {
  total_leads: number;
  by_stage: Record<string, number>;
  by_source: Record<string, number>;
  conversion_rate: number;
  this_month: number;
  last_month: number;
}

// =====================================================
// 2. FEE MANAGEMENT
// =====================================================

export interface FeeStructure {
  id: string;
  name: string;
  description?: string;
  grade_level: string;
  academic_year: string;
  fee_type: 'tuition' | 'transport' | 'hostel' | 'lab' | 'library' | 'exam' | 'other';
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annual' | 'one_time';
  due_day: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeeInvoice {
  id: string;
  invoice_number: string;
  student_id: string;
  student_name?: string;
  academic_year: string;
  billing_period: string;
  total_amount: number;
  discount_amount: number;
  scholarship_amount: number;
  net_amount: number;
  due_date: string;
  status: 'pending' | 'partially_paid' | 'paid' | 'overdue' | 'waived';
  notes?: string;
  generated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FeeInvoiceItem {
  id: string;
  invoice_id: string;
  fee_structure_id?: string;
  description: string;
  amount: number;
  created_at: string;
}

export interface FeePayment {
  id: string;
  invoice_id: string;
  receipt_number: string;
  payment_date: string;
  amount: number;
  payment_mode: 'cash' | 'cheque' | 'online' | 'card' | 'bank_transfer' | 'upi';
  transaction_reference?: string;
  cheque_number?: string;
  bank_name?: string;
  notes?: string;
  received_by?: string;
  created_at: string;
}

// =====================================================
// 3. SALARY & PAYROLL
// =====================================================

export interface Employee {
  id: string;
  user_profile_id?: string;
  employee_id: string;
  employee_type: 'teaching' | 'non_teaching' | 'administrative' | 'support';
  basic_salary: number;
  bank_account_number?: string;
  bank_name?: string;
  ifsc_code?: string;
  pan_number?: string;
  pf_number?: string;
  esi_number?: string;
  joining_date: string;
  probation_end_date?: string;
  confirmation_date?: string;
  employment_status: 'active' | 'probation' | 'notice_period' | 'resigned' | 'terminated';
  created_at: string;
  updated_at: string;
}

export interface SalaryAllowance {
  id: string;
  name: string;
  code: string;
  description?: string;
  calculation_type: 'fixed' | 'percentage';
  default_value: number;
  is_taxable: boolean;
  active: boolean;
  created_at: string;
}

export interface SalaryDeduction {
  id: string;
  name: string;
  code: string;
  description?: string;
  calculation_type: 'fixed' | 'percentage';
  default_value: number;
  active: boolean;
  created_at: string;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  employee_name?: string;
  month: number;
  year: number;
  basic_salary: number;
  gross_salary: number;
  total_allowances: number;
  total_deductions: number;
  net_salary: number;
  working_days: number;
  present_days: number;
  leave_days: number;
  overtime_hours: number;
  overtime_amount: number;
  status: 'draft' | 'processed' | 'paid';
  payment_date?: string;
  payment_mode?: 'bank_transfer' | 'cheque' | 'cash';
  notes?: string;
  processed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PayrollAllowanceItem {
  id: string;
  payroll_id: string;
  allowance_id?: string;
  name: string;
  amount: number;
  created_at: string;
}

export interface PayrollDeductionItem {
  id: string;
  payroll_id: string;
  deduction_id?: string;
  name: string;
  amount: number;
  created_at: string;
}

// =====================================================
// 4. TEACHER SUBSTITUTION
// =====================================================

export interface TeacherAbsence {
  id: string;
  teacher_id: string;
  teacher_name?: string;
  absence_date: string;
  period_start: number;
  period_end: number;
  reason: string;
  absence_type: 'sick_leave' | 'casual_leave' | 'emergency' | 'official_duty' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Substitution {
  id: string;
  absence_id: string;
  original_teacher_id: string;
  original_teacher_name?: string;
  substitute_teacher_id?: string;
  substitute_teacher_name?: string;
  class_section: string;
  subject: string;
  period_number: number;
  date: string;
  status: 'pending' | 'assigned' | 'accepted' | 'declined' | 'completed';
  notification_sent: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// 5. TASK MANAGEMENT
// =====================================================

export interface Task {
  id: string;
  title: string;
  description?: string;
  task_type: 'academic' | 'administrative' | 'compliance' | 'maintenance' | 'event' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  due_date?: string;
  start_date?: string;
  completion_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskAssignment {
  id: string;
  task_id: string;
  assigned_to_user_id?: string;
  assigned_to_role?: string;
  assignment_type: 'individual' | 'role';
  status: 'assigned' | 'accepted' | 'declined' | 'completed';
  created_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  user_name?: string;
  comment: string;
  created_at: string;
}

// =====================================================
// 6. LIBRARY MANAGEMENT
// =====================================================

export interface LibraryItem {
  id: string;
  item_type: 'book' | 'journal' | 'magazine' | 'digital' | 'reference' | 'other';
  title: string;
  author?: string;
  isbn?: string;
  barcode?: string;
  publisher?: string;
  publication_year?: number;
  edition?: string;
  category?: string;
  subject?: string;
  language: string;
  total_copies: number;
  available_copies: number;
  location?: string;
  shelf_number?: string;
  price?: number;
  acquisition_date?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  status: 'available' | 'issued' | 'reserved' | 'maintenance' | 'lost';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LibraryCirculation {
  id: string;
  item_id: string;
  item_title?: string;
  user_id: string;
  user_name?: string;
  checkout_date: string;
  due_date: string;
  return_date?: string;
  renewed_count: number;
  status: 'checked_out' | 'returned' | 'overdue' | 'lost';
  fine_amount: number;
  fine_paid: boolean;
  issued_by?: string;
  returned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LibraryReservation {
  id: string;
  item_id: string;
  item_title?: string;
  user_id: string;
  user_name?: string;
  reservation_date: string;
  expiry_date?: string;
  status: 'active' | 'fulfilled' | 'cancelled' | 'expired';
  notified: boolean;
  created_at: string;
  updated_at: string;
}

export interface LibraryFine {
  id: string;
  circulation_id?: string;
  user_id: string;
  user_name?: string;
  fine_type: 'late_return' | 'damage' | 'loss' | 'other';
  amount: number;
  reason?: string;
  status: 'pending' | 'paid' | 'waived';
  payment_date?: string;
  waived_by?: string;
  waiver_reason?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// 7. HOSTEL MANAGEMENT
// =====================================================

export interface HostelBuilding {
  id: string;
  name: string;
  building_type: 'boys' | 'girls' | 'staff' | 'mixed';
  total_floors: number;
  warden_id?: string;
  warden_name?: string;
  capacity: number;
  occupied: number;
  address?: string;
  contact_number?: string;
  amenities?: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HostelRoom {
  id: string;
  building_id: string;
  room_number: string;
  floor_number: number;
  room_type: 'single' | 'double' | 'triple' | 'quad' | 'dormitory';
  capacity: number;
  occupied: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  amenities?: string[];
  created_at: string;
  updated_at: string;
}

export interface HostelBed {
  id: string;
  room_id: string;
  bed_number: string;
  student_id?: string;
  student_name?: string;
  allocation_date?: string;
  checkout_date?: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface HostelInventory {
  id: string;
  room_id: string;
  item_name: string;
  item_type?: string;
  quantity: number;
  condition: 'new' | 'good' | 'fair' | 'poor' | 'damaged';
  last_checked_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MessRecord {
  id: string;
  student_id: string;
  student_name?: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  consumed: boolean;
  special_diet?: string;
  notes?: string;
  created_at: string;
}

// =====================================================
// 8. INFIRMARY
// =====================================================

export interface MedicalRecord {
  id: string;
  user_id: string;
  user_name?: string;
  blood_group?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  medications?: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  medical_insurance_number?: string;
  insurance_provider?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InfirmaryVisit {
  id: string;
  user_id: string;
  user_name?: string;
  visit_date: string;
  symptoms: string;
  temperature?: number;
  blood_pressure?: string;
  diagnosis?: string;
  treatment_given?: string;
  medicines_dispensed?: string[];
  severity: 'minor' | 'moderate' | 'serious' | 'critical';
  referred_to_doctor: boolean;
  doctor_name?: string;
  followup_required: boolean;
  followup_date?: string;
  parent_notified: boolean;
  notification_sent_at?: string;
  attended_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InfirmaryInventory {
  id: string;
  item_name: string;
  item_type: 'medicine' | 'equipment' | 'consumable' | 'first_aid';
  quantity: number;
  unit?: string;
  reorder_level: number;
  expiry_date?: string;
  batch_number?: string;
  supplier?: string;
  last_restocked_date?: string;
  last_restocked_quantity?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface HealthAlert {
  id: string;
  visit_id?: string;
  user_id: string;
  user_name?: string;
  alert_type: 'serious_visit' | 'chronic_condition' | 'allergy' | 'emergency' | 'followup';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  parent_notified: boolean;
  notification_method?: 'dashboard' | 'email' | 'sms' | 'call';
  acknowledged: boolean;
  acknowledged_at?: string;
  acknowledged_by?: string;
  created_at: string;
}

// =====================================================
// DASHBOARD & ANALYTICS
// =====================================================

export interface OperationsDashboardStats {
  leads: {
    total: number;
    this_month: number;
    conversion_rate: number;
  };
  fees: {
    total_pending: number;
    total_collected_this_month: number;
    defaulters_count: number;
  };
  tasks: {
    pending: number;
    overdue: number;
    completed_this_week: number;
  };
  library: {
    total_books: number;
    checked_out: number;
    overdue: number;
  };
  hostel: {
    total_capacity: number;
    occupied: number;
    occupancy_rate: number;
  };
  infirmary: {
    visits_today: number;
    serious_cases: number;
    pending_alerts: number;
  };
}
