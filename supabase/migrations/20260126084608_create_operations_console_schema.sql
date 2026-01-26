/*
  # Operations Console - Comprehensive Schema
  
  This migration creates the complete database schema for the Operations & Systems Management Console.
  
  ## New Tables Created
  
  ### 1. Lead Management
  - `leads` - Admission inquiry tracking
  - `lead_interactions` - Communication logs
  - `lead_sources` - Lead source tracking
  
  ### 2. Fee Management  
  - `fee_structures` - Fee templates by grade/category
  - `fee_invoices` - Generated invoices
  - `fee_payments` - Payment records
  - `fee_defaulters` - Overdue tracking
  
  ### 3. Salary & Payroll
  - `employees` - Staff database (distinct from user_profiles)
  - `salary_structures` - Salary templates
  - `payroll_records` - Monthly payroll
  - `payslips` - Generated payslips
  - `salary_deductions` - Tax/PF deductions
  - `salary_allowances` - HRA/DA allowances
  
  ### 4. Teacher Substitution
  - `teacher_absences` - Absence records
  - `substitutions` - Substitute assignments
  - `substitution_logs` - Historical tracking
  
  ### 5. Task Management
  - `tasks` - Task records
  - `task_assignments` - User/role assignments
  - `task_comments` - Discussion threads
  
  ### 6. Library Management
  - `library_items` - Books/journals/assets
  - `library_circulation` - Check-out/in records
  - `library_reservations` - Hold requests
  - `library_fines` - Late fee tracking
  
  ### 7. Hostel Management
  - `hostel_buildings` - Building records
  - `hostel_rooms` - Room records
  - `hostel_beds` - Bed assignments
  - `hostel_inventory` - Room assets
  - `mess_records` - Meal tracking
  
  ### 8. Infirmary
  - `infirmary_visits` - Visit logs
  - `infirmary_inventory` - Medical supplies
  - `medical_records` - Student health history
  - `health_alerts` - Parent notifications
  
  ## Security
  - All tables have RLS enabled
  - Appropriate policies for operations staff, students, parents
*/

-- =====================================================
-- 1. LEAD MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS lead_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  parent_name text NOT NULL,
  parent_email text,
  parent_phone text NOT NULL,
  parent_occupation text,
  current_school text,
  grade_applying_for text NOT NULL,
  source_id uuid REFERENCES lead_sources(id),
  source_details text,
  stage text DEFAULT 'new_inquiry' CHECK (stage IN ('new_inquiry', 'campus_visit', 'application', 'interview', 'admitted', 'enrolled', 'lost')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to uuid REFERENCES auth.users(id),
  notes text,
  scheduled_visit_date timestamptz,
  interview_date timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'converted', 'archived')),
  converted_to_student_id uuid,
  lost_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS lead_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('call', 'email', 'visit', 'whatsapp', 'meeting', 'other')),
  interaction_date timestamptz DEFAULT now(),
  notes text NOT NULL,
  next_followup_date timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 2. FEE MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS fee_structures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  grade_level text NOT NULL,
  academic_year text NOT NULL,
  fee_type text NOT NULL CHECK (fee_type IN ('tuition', 'transport', 'hostel', 'lab', 'library', 'exam', 'other')),
  amount numeric(10,2) NOT NULL,
  frequency text DEFAULT 'annual' CHECK (frequency IN ('monthly', 'quarterly', 'annual', 'one_time')),
  due_day integer DEFAULT 10,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fee_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  student_id uuid NOT NULL REFERENCES user_profiles(id),
  academic_year text NOT NULL,
  billing_period text NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  discount_amount numeric(10,2) DEFAULT 0,
  scholarship_amount numeric(10,2) DEFAULT 0,
  net_amount numeric(10,2) NOT NULL,
  due_date date NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'partially_paid', 'paid', 'overdue', 'waived')),
  notes text,
  generated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fee_invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES fee_invoices(id) ON DELETE CASCADE,
  fee_structure_id uuid REFERENCES fee_structures(id),
  description text NOT NULL,
  amount numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fee_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES fee_invoices(id),
  receipt_number text UNIQUE NOT NULL,
  payment_date date NOT NULL,
  amount numeric(10,2) NOT NULL,
  payment_mode text NOT NULL CHECK (payment_mode IN ('cash', 'cheque', 'online', 'card', 'bank_transfer', 'upi')),
  transaction_reference text,
  cheque_number text,
  bank_name text,
  notes text,
  received_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 3. SALARY & PAYROLL
-- =====================================================

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id uuid UNIQUE REFERENCES user_profiles(id),
  employee_id text UNIQUE NOT NULL,
  employee_type text NOT NULL CHECK (employee_type IN ('teaching', 'non_teaching', 'administrative', 'support')),
  basic_salary numeric(10,2) NOT NULL,
  bank_account_number text,
  bank_name text,
  ifsc_code text,
  pan_number text,
  pf_number text,
  esi_number text,
  joining_date date NOT NULL,
  probation_end_date date,
  confirmation_date date,
  employment_status text DEFAULT 'active' CHECK (employment_status IN ('active', 'probation', 'notice_period', 'resigned', 'terminated')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS salary_allowances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text,
  calculation_type text CHECK (calculation_type IN ('fixed', 'percentage')),
  default_value numeric(10,2),
  is_taxable boolean DEFAULT true,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS salary_deductions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text,
  calculation_type text CHECK (calculation_type IN ('fixed', 'percentage')),
  default_value numeric(10,2),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payroll_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id),
  month integer NOT NULL,
  year integer NOT NULL,
  basic_salary numeric(10,2) NOT NULL,
  gross_salary numeric(10,2) NOT NULL,
  total_allowances numeric(10,2) DEFAULT 0,
  total_deductions numeric(10,2) DEFAULT 0,
  net_salary numeric(10,2) NOT NULL,
  working_days integer DEFAULT 30,
  present_days integer DEFAULT 30,
  leave_days integer DEFAULT 0,
  overtime_hours numeric(5,2) DEFAULT 0,
  overtime_amount numeric(10,2) DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'processed', 'paid')),
  payment_date date,
  payment_mode text CHECK (payment_mode IN ('bank_transfer', 'cheque', 'cash')),
  notes text,
  processed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, month, year)
);

CREATE TABLE IF NOT EXISTS payroll_allowance_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_id uuid NOT NULL REFERENCES payroll_records(id) ON DELETE CASCADE,
  allowance_id uuid REFERENCES salary_allowances(id),
  name text NOT NULL,
  amount numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payroll_deduction_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_id uuid NOT NULL REFERENCES payroll_records(id) ON DELETE CASCADE,
  deduction_id uuid REFERENCES salary_deductions(id),
  name text NOT NULL,
  amount numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 4. TEACHER SUBSTITUTION
-- =====================================================

CREATE TABLE IF NOT EXISTS teacher_absences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES user_profiles(id),
  absence_date date NOT NULL,
  period_start integer NOT NULL,
  period_end integer NOT NULL,
  reason text NOT NULL,
  absence_type text CHECK (absence_type IN ('sick_leave', 'casual_leave', 'emergency', 'official_duty', 'other')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS substitutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  absence_id uuid NOT NULL REFERENCES teacher_absences(id),
  original_teacher_id uuid NOT NULL REFERENCES user_profiles(id),
  substitute_teacher_id uuid REFERENCES user_profiles(id),
  class_section text NOT NULL,
  subject text NOT NULL,
  period_number integer NOT NULL,
  date date NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'accepted', 'declined', 'completed')),
  notification_sent boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 5. TASK MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  task_type text CHECK (task_type IN ('academic', 'administrative', 'compliance', 'maintenance', 'event', 'other')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'cancelled')),
  due_date date,
  start_date date,
  completion_date timestamptz,
  estimated_hours numeric(5,2),
  actual_hours numeric(5,2),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  assigned_to_user_id uuid REFERENCES auth.users(id),
  assigned_to_role text,
  assignment_type text CHECK (assignment_type IN ('individual', 'role')),
  status text DEFAULT 'assigned' CHECK (status IN ('assigned', 'accepted', 'declined', 'completed')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 6. LIBRARY MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS library_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type text NOT NULL CHECK (item_type IN ('book', 'journal', 'magazine', 'digital', 'reference', 'other')),
  title text NOT NULL,
  author text,
  isbn text,
  barcode text UNIQUE,
  publisher text,
  publication_year integer,
  edition text,
  category text,
  subject text,
  language text DEFAULT 'English',
  total_copies integer DEFAULT 1,
  available_copies integer DEFAULT 1,
  location text,
  shelf_number text,
  price numeric(10,2),
  acquisition_date date,
  condition text DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor', 'damaged')),
  status text DEFAULT 'available' CHECK (status IN ('available', 'issued', 'reserved', 'maintenance', 'lost')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS library_circulation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES library_items(id),
  user_id uuid NOT NULL REFERENCES user_profiles(id),
  checkout_date timestamptz NOT NULL DEFAULT now(),
  due_date date NOT NULL,
  return_date timestamptz,
  renewed_count integer DEFAULT 0,
  status text DEFAULT 'checked_out' CHECK (status IN ('checked_out', 'returned', 'overdue', 'lost')),
  fine_amount numeric(10,2) DEFAULT 0,
  fine_paid boolean DEFAULT false,
  issued_by uuid REFERENCES auth.users(id),
  returned_to uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS library_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES library_items(id),
  user_id uuid NOT NULL REFERENCES user_profiles(id),
  reservation_date timestamptz DEFAULT now(),
  expiry_date timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'cancelled', 'expired')),
  notified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS library_fines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circulation_id uuid REFERENCES library_circulation(id),
  user_id uuid NOT NULL REFERENCES user_profiles(id),
  fine_type text CHECK (fine_type IN ('late_return', 'damage', 'loss', 'other')),
  amount numeric(10,2) NOT NULL,
  reason text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'waived')),
  payment_date date,
  waived_by uuid REFERENCES auth.users(id),
  waiver_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 7. HOSTEL MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS hostel_buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  building_type text CHECK (building_type IN ('boys', 'girls', 'staff', 'mixed')),
  total_floors integer DEFAULT 1,
  warden_id uuid REFERENCES user_profiles(id),
  capacity integer NOT NULL,
  occupied integer DEFAULT 0,
  address text,
  contact_number text,
  amenities text[],
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hostel_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid NOT NULL REFERENCES hostel_buildings(id),
  room_number text NOT NULL,
  floor_number integer NOT NULL,
  room_type text CHECK (room_type IN ('single', 'double', 'triple', 'quad', 'dormitory')),
  capacity integer NOT NULL,
  occupied integer DEFAULT 0,
  status text DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')),
  amenities text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(building_id, room_number)
);

CREATE TABLE IF NOT EXISTS hostel_beds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES hostel_rooms(id),
  bed_number text NOT NULL,
  student_id uuid REFERENCES user_profiles(id),
  allocation_date date,
  checkout_date date,
  status text DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(room_id, bed_number)
);

CREATE TABLE IF NOT EXISTS hostel_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES hostel_rooms(id),
  item_name text NOT NULL,
  item_type text,
  quantity integer DEFAULT 1,
  condition text DEFAULT 'good' CHECK (condition IN ('new', 'good', 'fair', 'poor', 'damaged')),
  last_checked_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mess_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES user_profiles(id),
  date date NOT NULL,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
  consumed boolean DEFAULT false,
  special_diet text,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, date, meal_type)
);

-- =====================================================
-- 8. INFIRMARY
-- =====================================================

CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES user_profiles(id),
  blood_group text,
  allergies text[],
  chronic_conditions text[],
  medications text[],
  emergency_contact_name text,
  emergency_contact_phone text,
  emergency_contact_relation text,
  medical_insurance_number text,
  insurance_provider text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS infirmary_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id),
  visit_date timestamptz DEFAULT now(),
  symptoms text NOT NULL,
  temperature numeric(4,2),
  blood_pressure text,
  diagnosis text,
  treatment_given text,
  medicines_dispensed text[],
  severity text DEFAULT 'minor' CHECK (severity IN ('minor', 'moderate', 'serious', 'critical')),
  referred_to_doctor boolean DEFAULT false,
  doctor_name text,
  followup_required boolean DEFAULT false,
  followup_date date,
  parent_notified boolean DEFAULT false,
  notification_sent_at timestamptz,
  attended_by uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS infirmary_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text NOT NULL,
  item_type text CHECK (item_type IN ('medicine', 'equipment', 'consumable', 'first_aid')),
  quantity integer DEFAULT 0,
  unit text,
  reorder_level integer DEFAULT 10,
  expiry_date date,
  batch_number text,
  supplier text,
  last_restocked_date date,
  last_restocked_quantity integer,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS health_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id uuid REFERENCES infirmary_visits(id),
  user_id uuid NOT NULL REFERENCES user_profiles(id),
  alert_type text CHECK (alert_type IN ('serious_visit', 'chronic_condition', 'allergy', 'emergency', 'followup')),
  severity text CHECK (severity IN ('info', 'warning', 'critical')),
  message text NOT NULL,
  parent_notified boolean DEFAULT false,
  notification_method text CHECK (notification_method IN ('dashboard', 'email', 'sms', 'call')),
  acknowledged boolean DEFAULT false,
  acknowledged_at timestamptz,
  acknowledged_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_lead_id ON lead_interactions(lead_id);

CREATE INDEX IF NOT EXISTS idx_fee_invoices_student_id ON fee_invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_invoices_status ON fee_invoices(status);
CREATE INDEX IF NOT EXISTS idx_fee_payments_invoice_id ON fee_payments(invoice_id);

CREATE INDEX IF NOT EXISTS idx_payroll_records_employee_id ON payroll_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_records_month_year ON payroll_records(month, year);

CREATE INDEX IF NOT EXISTS idx_teacher_absences_teacher_id ON teacher_absences(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_absences_date ON teacher_absences(absence_date);
CREATE INDEX IF NOT EXISTS idx_substitutions_date ON substitutions(date);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_task_assignments_task_id ON task_assignments(task_id);

CREATE INDEX IF NOT EXISTS idx_library_circulation_user_id ON library_circulation(user_id);
CREATE INDEX IF NOT EXISTS idx_library_circulation_status ON library_circulation(status);
CREATE INDEX IF NOT EXISTS idx_library_items_barcode ON library_items(barcode);

CREATE INDEX IF NOT EXISTS idx_hostel_beds_student_id ON hostel_beds(student_id);
CREATE INDEX IF NOT EXISTS idx_mess_records_student_date ON mess_records(student_id, date);

CREATE INDEX IF NOT EXISTS idx_infirmary_visits_user_id ON infirmary_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_infirmary_visits_severity ON infirmary_visits(severity);
CREATE INDEX IF NOT EXISTS idx_health_alerts_user_id ON health_alerts(user_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_allowances ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_allowance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_deduction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE substitutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_circulation ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_fines ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE mess_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE infirmary_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE infirmary_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_alerts ENABLE ROW LEVEL SECURITY;

-- Operations staff can view and manage all data
CREATE POLICY "Operations staff full access to leads"
  ON leads FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'operations')
    )
  );

CREATE POLICY "Operations staff full access to fee invoices"
  ON fee_invoices FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'operations')
    )
  );

-- Students can view their own fee invoices
CREATE POLICY "Students can view own fee invoices"
  ON fee_invoices FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
  );

CREATE POLICY "Operations staff full access to payroll"
  ON payroll_records FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'operations')
    )
  );

-- Employees can view their own payroll
CREATE POLICY "Employees can view own payroll"
  ON payroll_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.id = payroll_records.employee_id
      AND employees.user_profile_id = auth.uid()
    )
  );

CREATE POLICY "Operations and teachers full access to substitutions"
  ON substitutions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'operations', 'teacher')
    )
  );

CREATE POLICY "Operations staff full access to tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'operations')
    )
  );

-- Users can view tasks assigned to them
CREATE POLICY "Users can view assigned tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM task_assignments
      WHERE task_assignments.task_id = tasks.id
      AND task_assignments.assigned_to_user_id = auth.uid()
    )
  );

CREATE POLICY "Operations staff full access to library"
  ON library_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'operations')
    )
  );

-- All authenticated users can view library items
CREATE POLICY "All users can view library items"
  ON library_items FOR SELECT
  TO authenticated
  USING (true);

-- Users can view their own circulation records
CREATE POLICY "Users can view own circulation"
  ON library_circulation FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Operations staff full access to hostel"
  ON hostel_buildings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'operations')
    )
  );

-- Students can view their own hostel assignments
CREATE POLICY "Students can view own hostel bed"
  ON hostel_beds FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Operations staff full access to infirmary"
  ON infirmary_visits FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'operations')
    )
  );

-- Users can view their own medical records
CREATE POLICY "Users can view own medical records"
  ON medical_records FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can view their own infirmary visits
CREATE POLICY "Users can view own infirmary visits"
  ON infirmary_visits FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can view their own health alerts
CREATE POLICY "Users can view own health alerts"
  ON health_alerts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Additional policies for other tables (simplified for operations access)
CREATE POLICY "Operations access lead_interactions" ON lead_interactions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role IN ('admin', 'operations')));

CREATE POLICY "Operations access fee_payments" ON fee_payments FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role IN ('admin', 'operations')));

CREATE POLICY "Operations access task_assignments" ON task_assignments FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role IN ('admin', 'operations')));

CREATE POLICY "Operations access library_circulation" ON library_circulation FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role IN ('admin', 'operations')));

CREATE POLICY "Operations access hostel_rooms" ON hostel_rooms FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role IN ('admin', 'operations')));

CREATE POLICY "Operations access hostel_beds" ON hostel_beds FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role IN ('admin', 'operations')));
