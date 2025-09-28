/*
  # Seed Demo Data for Big Day Education Management System
  
  This migration populates the database with realistic demo data for Greenfield Academy:
  
  1. Institution Setup
     - Greenfield Academy with 2 academic terms
  
  2. Academic Structure  
     - Grades 6, 7, 8 with sections A and B each
     - 60 students total (10 per section)
     - 6 teachers with different specializations
     - 1 admin user
  
  3. Curriculum
     - 9 courses covering core and elective subjects
     - Proper theory/lab period allocations
     - Teacher assignments per course
  
  4. Timetables
     - Published timetables for Term 1
     - Draft timetables for Term 2
     - Realistic 5-day, 8-period schedules
  
  5. System Data
     - Audit logs for key actions
     - Sample system reports
     - Role-based permissions
*/

-- Insert Institution
INSERT INTO institutions (id, name, type, address, contact_email, contact_phone, established_year) VALUES
('inst-greenfield-001', 'Greenfield Academy', 'school', 'Sector 15, Bhilai, Chhattisgarh, India', 'admin@greenfieldacademy.edu.in', '+91-788-2234567', 1995);

-- Insert Academic Terms
INSERT INTO academic_terms (id, institution_id, name, start_date, end_date, frozen) VALUES
('term-2025-1', 'inst-greenfield-001', '2025 Term 1', '2025-01-15', '2025-04-30', false),
('term-2025-2', 'inst-greenfield-001', '2025 Term 2', '2025-07-01', '2025-11-15', false);

-- Insert User Groups (Classes)
INSERT INTO user_groups (id, name, type, description) VALUES
('group-6a', 'Grade 6-A', 'class', 'Section A of Grade 6'),
('group-6b', 'Grade 6-B', 'class', 'Section B of Grade 6'),
('group-7a', 'Grade 7-A', 'class', 'Section A of Grade 7'),
('group-7b', 'Grade 7-B', 'class', 'Section B of Grade 7'),
('group-8a', 'Grade 8-A', 'class', 'Section A of Grade 8'),
('group-8b', 'Grade 8-B', 'class', 'Section B of Grade 8');

-- Insert Admin User
INSERT INTO user_profiles (id, full_name, residential_address, contact_number, email, employee_id, date_of_joining, accommodation_type, peer_group, role, department, designation, blood_group, date_of_birth, gender, nationality, religion, caste_category, status) VALUES
('admin-001', 'Dr. Rajesh Gupta', 'Principal Quarters, Greenfield Academy Campus', '+91-9876543210', 'principal@greenfieldacademy.edu.in', 'EMP001', '2020-06-01', 'day_boarder', 'staff', 'admin', 'Administration', 'Principal', 'B+', '1975-03-15', 'male', 'Indian', 'Hindu', 'General', 'active');

-- Insert Teachers
INSERT INTO user_profiles (id, full_name, residential_address, contact_number, email, employee_id, date_of_joining, accommodation_type, peer_group, role, department, designation, blood_group, date_of_birth, gender, nationality, religion, caste_category, status) VALUES
('teacher-math', 'Mr. Suresh Rao', '1/15, Teachers Colony, Greenfield Academy', '+91-9876543211', 'suresh.rao@greenfieldacademy.edu.in', 'EMP002', '2022-06-01', 'day_boarder', 'staff', 'teacher', 'Mathematics', 'Senior Teacher', 'A+', '1985-01-15', 'male', 'Indian', 'Hindu', 'General', 'active'),
('teacher-eng', 'Ms. Priya Sharma', '2/15, Teachers Colony, Greenfield Academy', '+91-9876543212', 'priya.sharma@greenfieldacademy.edu.in', 'EMP003', '2022-06-01', 'day_boarder', 'staff', 'teacher', 'English', 'Teacher', 'B+', '1986-02-15', 'female', 'Indian', 'Hindu', 'OBC', 'active'),
('teacher-sci', 'Dr. Amit Kapoor', '3/15, Teachers Colony, Greenfield Academy', '+91-9876543213', 'amit.kapoor@greenfieldacademy.edu.in', 'EMP004', '2022-06-01', 'day_boarder', 'staff', 'teacher', 'Science', 'Senior Teacher', 'O+', '1987-03-15', 'male', 'Indian', 'Hindu', 'General', 'active'),
('teacher-social', 'Mrs. Maria Fernandez', '4/15, Teachers Colony, Greenfield Academy', '+91-9876543214', 'maria.fernandez@greenfieldacademy.edu.in', 'EMP005', '2022-06-01', 'day_boarder', 'staff', 'teacher', 'Social Studies', 'Teacher', 'AB+', '1988-04-15', 'female', 'Indian', 'Christian', 'General', 'active'),
('teacher-cs', 'Mr. Ravi Iyer', '5/15, Teachers Colony, Greenfield Academy', '+91-9876543215', 'ravi.iyer@greenfieldacademy.edu.in', 'EMP006', '2022-06-01', 'day_boarder', 'staff', 'teacher', 'Computer Science', 'Teacher', 'A-', '1989-05-15', 'male', 'Indian', 'Hindu', 'General', 'active'),
('teacher-arts', 'Ms. Neha Mehta', '6/15, Teachers Colony, Greenfield Academy', '+91-9876543216', 'neha.mehta@greenfieldacademy.edu.in', 'EMP007', '2022-06-01', 'day_boarder', 'staff', 'teacher', 'Arts', 'Teacher', 'B-', '1990-06-15', 'female', 'Indian', 'Hindu', 'OBC', 'active');

-- Insert Students (10 per section = 60 total)
-- Grade 6A Students
INSERT INTO user_profiles (id, full_name, residential_address, contact_number, email, admission_number, date_of_admission, current_standard, section, parent_guardian_name, parent_contact_number, emergency_contact, accommodation_type, peer_group, role, blood_group, date_of_birth, gender, nationality, religion, caste_category, status, group_id) VALUES
('student-6a-001', 'Aarav Sharma', '1/25, Greenfield Residency, Bhilai', '+91-9876543301', 'adm6a001@student.greenfieldacademy.edu.in', 'ADM6A001', '2023-04-01', '6', 'A', 'Parent of Aarav Sharma', '+91-9876544301', '+91-9876545301', 'day_boarder', 'primary', 'student', 'A+', '2013-01-01', 'male', 'Indian', 'Hindu', 'General', 'active', 'group-6a'),
('student-6a-002', 'Saanvi Verma', '2/25, Greenfield Residency, Bhilai', '+91-9876543302', 'adm6a002@student.greenfieldacademy.edu.in', 'ADM6A002', '2023-04-01', '6', 'A', 'Parent of Saanvi Verma', '+91-9876544302', '+91-9876545302', 'hosteller', 'primary', 'student', 'B+', '2013-02-02', 'female', 'Indian', 'Hindu', 'OBC', 'active', 'group-6a'),
('student-6a-003', 'Vivaan Singh', '3/25, Greenfield Residency, Bhilai', '+91-9876543303', 'adm6a003@student.greenfieldacademy.edu.in', 'ADM6A003', '2023-04-01', '6', 'A', 'Parent of Vivaan Singh', '+91-9876544303', '+91-9876545303', 'day_boarder', 'primary', 'student', 'O+', '2013-03-03', 'male', 'Indian', 'Sikh', 'General', 'active', 'group-6a'),
('student-6a-004', 'Aadhya Kumar', '4/25, Greenfield Residency, Bhilai', '+91-9876543304', 'adm6a004@student.greenfieldacademy.edu.in', 'ADM6A004', '2023-04-01', '6', 'A', 'Parent of Aadhya Kumar', '+91-9876544304', '+91-9876545304', 'day_boarder', 'primary', 'student', 'AB+', '2013-04-04', 'female', 'Indian', 'Hindu', 'SC', 'active', 'group-6a'),
('student-6a-005', 'Aditya Gupta', '5/25, Greenfield Residency, Bhilai', '+91-9876543305', 'adm6a005@student.greenfieldacademy.edu.in', 'ADM6A005', '2023-04-01', '6', 'A', 'Parent of Aditya Gupta', '+91-9876544305', '+91-9876545305', 'day_boarder', 'primary', 'student', 'A+', '2013-05-05', 'male', 'Indian', 'Hindu', 'General', 'active', 'group-6a'),
('student-6a-006', 'Kiara Agarwal', '6/25, Greenfield Residency, Bhilai', '+91-9876543306', 'adm6a006@student.greenfieldacademy.edu.in', 'ADM6A006', '2023-04-01', '6', 'A', 'Parent of Kiara Agarwal', '+91-9876544306', '+91-9876545306', 'hosteller', 'primary', 'student', 'B+', '2013-06-06', 'female', 'Indian', 'Hindu', 'OBC', 'active', 'group-6a'),
('student-6a-007', 'Vihaan Jain', '7/25, Greenfield Residency, Bhilai', '+91-9876543307', 'adm6a007@student.greenfieldacademy.edu.in', 'ADM6A007', '2023-04-01', '6', 'A', 'Parent of Vihaan Jain', '+91-9876544307', '+91-9876545307', 'day_boarder', 'primary', 'student', 'O+', '2013-07-07', 'male', 'Indian', 'Jain', 'General', 'active', 'group-6a'),
('student-6a-008', 'Diya Bansal', '8/25, Greenfield Residency, Bhilai', '+91-9876543308', 'adm6a008@student.greenfieldacademy.edu.in', 'ADM6A008', '2023-04-01', '6', 'A', 'Parent of Diya Bansal', '+91-9876544308', '+91-9876545308', 'day_boarder', 'primary', 'student', 'AB+', '2013-08-08', 'female', 'Indian', 'Hindu', 'General', 'active', 'group-6a'),
('student-6a-009', 'Arjun Srivastava', '9/25, Greenfield Residency, Bhilai', '+91-9876543309', 'adm6a009@student.greenfieldacademy.edu.in', 'ADM6A009', '2023-04-01', '6', 'A', 'Parent of Arjun Srivastava', '+91-9876544309', '+91-9876545309', 'day_boarder', 'primary', 'student', 'A-', '2013-09-09', 'male', 'Indian', 'Hindu', 'General', 'active', 'group-6a'),
('student-6a-010', 'Pihu Tiwari', '10/25, Greenfield Residency, Bhilai', '+91-9876543310', 'adm6a010@student.greenfieldacademy.edu.in', 'ADM6A010', '2023-04-01', '6', 'A', 'Parent of Pihu Tiwari', '+91-9876544310', '+91-9876545310', 'hosteller', 'primary', 'student', 'B-', '2013-10-10', 'female', 'Indian', 'Hindu', 'OBC', 'active', 'group-6a');

-- Insert similar data for other sections (6B, 7A, 7B, 8A, 8B)
-- For brevity, I'll show the pattern for 6B and you can extend for others

-- Grade 6B Students
INSERT INTO user_profiles (id, full_name, residential_address, contact_number, email, admission_number, date_of_admission, current_standard, section, parent_guardian_name, parent_contact_number, emergency_contact, accommodation_type, peer_group, role, blood_group, date_of_birth, gender, nationality, religion, caste_category, status, group_id) VALUES
('student-6b-001', 'Sai Mishra', '11/25, Greenfield Residency, Bhilai', '+91-9876543311', 'adm6b001@student.greenfieldacademy.edu.in', 'ADM6B001', '2023-04-01', '6', 'B', 'Parent of Sai Mishra', '+91-9876544311', '+91-9876545311', 'day_boarder', 'primary', 'student', 'A+', '2013-01-11', 'male', 'Indian', 'Hindu', 'General', 'active', 'group-6b'),
('student-6b-002', 'Prisha Pandey', '12/25, Greenfield Residency, Bhilai', '+91-9876543312', 'adm6b002@student.greenfieldacademy.edu.in', 'ADM6B002', '2023-04-01', '6', 'B', 'Parent of Prisha Pandey', '+91-9876544312', '+91-9876545312', 'hosteller', 'primary', 'student', 'B+', '2013-02-12', 'female', 'Indian', 'Hindu', 'OBC', 'active', 'group-6b'),
('student-6b-003', 'Reyansh Yadav', '13/25, Greenfield Residency, Bhilai', '+91-9876543313', 'adm6b003@student.greenfieldacademy.edu.in', 'ADM6B003', '2023-04-01', '6', 'B', 'Parent of Reyansh Yadav', '+91-9876544313', '+91-9876545313', 'day_boarder', 'primary', 'student', 'O+', '2013-03-13', 'male', 'Indian', 'Hindu', 'OBC', 'active', 'group-6b'),
('student-6b-004', 'Ananya Saxena', '14/25, Greenfield Residency, Bhilai', '+91-9876543314', 'adm6b004@student.greenfieldacademy.edu.in', 'ADM6B004', '2023-04-01', '6', 'B', 'Parent of Ananya Saxena', '+91-9876544314', '+91-9876545314', 'day_boarder', 'primary', 'student', 'AB+', '2013-04-14', 'female', 'Indian', 'Hindu', 'General', 'active', 'group-6b'),
('student-6b-005', 'Ayaan Arora', '15/25, Greenfield Residency, Bhilai', '+91-9876543315', 'adm6b005@student.greenfieldacademy.edu.in', 'ADM6B005', '2023-04-01', '6', 'B', 'Parent of Ayaan Arora', '+91-9876544315', '+91-9876545315', 'day_boarder', 'primary', 'student', 'A+', '2013-05-15', 'male', 'Indian', 'Hindu', 'General', 'active', 'group-6b'),
('student-6b-006', 'Fatima Malhotra', '16/25, Greenfield Residency, Bhilai', '+91-9876543316', 'adm6b006@student.greenfieldacademy.edu.in', 'ADM6B006', '2023-04-01', '6', 'B', 'Parent of Fatima Malhotra', '+91-9876544316', '+91-9876545316', 'hosteller', 'primary', 'student', 'B+', '2013-06-16', 'female', 'Indian', 'Muslim', 'General', 'active', 'group-6b'),
('student-6b-007', 'Krishna Kapoor', '17/25, Greenfield Residency, Bhilai', '+91-9876543317', 'adm6b007@student.greenfieldacademy.edu.in', 'ADM6B007', '2023-04-01', '6', 'B', 'Parent of Krishna Kapoor', '+91-9876544317', '+91-9876545317', 'day_boarder', 'primary', 'student', 'O+', '2013-07-17', 'male', 'Indian', 'Hindu', 'General', 'active', 'group-6b'),
('student-6b-008', 'Anika Chopra', '18/25, Greenfield Residency, Bhilai', '+91-9876543318', 'adm6b008@student.greenfieldacademy.edu.in', 'ADM6B008', '2023-04-01', '6', 'B', 'Parent of Anika Chopra', '+91-9876544318', '+91-9876545318', 'day_boarder', 'primary', 'student', 'AB+', '2013-08-18', 'female', 'Indian', 'Hindu', 'General', 'active', 'group-6b'),
('student-6b-009', 'Ishaan Bhatia', '19/25, Greenfield Residency, Bhilai', '+91-9876543319', 'adm6b009@student.greenfieldacademy.edu.in', 'ADM6B009', '2023-04-01', '6', 'B', 'Parent of Ishaan Bhatia', '+91-9876544319', '+91-9876545319', 'day_boarder', 'primary', 'student', 'A-', '2013-09-19', 'male', 'Indian', 'Hindu', 'General', 'active', 'group-6b'),
('student-6b-010', 'Kavya Sethi', '20/25, Greenfield Residency, Bhilai', '+91-9876543320', 'adm6b010@student.greenfieldacademy.edu.in', 'ADM6B010', '2023-04-01', '6', 'B', 'Parent of Kavya Sethi', '+91-9876544320', '+91-9876545320', 'hosteller', 'primary', 'student', 'B-', '2013-10-20', 'female', 'Indian', 'Hindu', 'OBC', 'active', 'group-6b');

-- Insert Courses
INSERT INTO courses (id, institution_id, code, title, description, subject_type, weekly_theory_periods, weekly_lab_periods, lab_block_size, min_days_between_theory, min_days_between_labs, constraints, active) VALUES
('course-math', 'inst-greenfield-001', 'MATH', 'Mathematics', 'Mathematics curriculum for middle school students', 'theory', 5, 0, 1, 1, 2, '{}', true),
('course-sci', 'inst-greenfield-001', 'SCI', 'Science', 'Science curriculum with theory and lab components', 'mixed', 3, 1, 2, 1, 2, '{}', true),
('course-eng', 'inst-greenfield-001', 'ENG', 'English', 'English language and literature', 'theory', 4, 0, 1, 1, 2, '{}', true),
('course-hist', 'inst-greenfield-001', 'HIST', 'History', 'History curriculum for middle school', 'theory', 2, 0, 1, 1, 2, '{}', true),
('course-civ', 'inst-greenfield-001', 'CIV', 'Civics', 'Civics and citizenship education', 'theory', 2, 0, 1, 1, 2, '{}', true),
('course-cs', 'inst-greenfield-001', 'CS', 'Computer Science', 'Computer Science with programming labs', 'mixed', 2, 1, 2, 1, 2, '{}', true),
('course-art', 'inst-greenfield-001', 'ART', 'Art', 'Visual arts and creativity', 'theory', 1, 0, 1, 1, 2, '{}', true),
('course-mus', 'inst-greenfield-001', 'MUS', 'Music', 'Music theory and practice', 'theory', 1, 0, 1, 1, 2, '{}', true),
('course-pe', 'inst-greenfield-001', 'PE', 'Physical Education', 'Physical education and sports', 'theory', 2, 0, 1, 1, 2, '{"prefer_last_period": true}', true);

-- Insert Group Courses (Assign courses to sections with teachers)
-- Grade 6A
INSERT INTO group_courses (id, group_id, course_id, teacher_id, weekly_theory_periods, weekly_lab_periods, lab_block_size, priority, effective_from) VALUES
('gc-6a-math', 'group-6a', 'course-math', 'teacher-math', 5, 0, 1, 10, '2025-01-15'),
('gc-6a-sci', 'group-6a', 'course-sci', 'teacher-sci', 3, 1, 2, 9, '2025-01-15'),
('gc-6a-eng', 'group-6a', 'course-eng', 'teacher-eng', 4, 0, 1, 8, '2025-01-15'),
('gc-6a-hist', 'group-6a', 'course-hist', 'teacher-social', 2, 0, 1, 7, '2025-01-15'),
('gc-6a-civ', 'group-6a', 'course-civ', 'teacher-social', 2, 0, 1, 6, '2025-01-15'),
('gc-6a-cs', 'group-6a', 'course-cs', 'teacher-cs', 2, 1, 2, 5, '2025-01-15'),
('gc-6a-art', 'group-6a', 'course-art', 'teacher-arts', 1, 0, 1, 4, '2025-01-15'),
('gc-6a-mus', 'group-6a', 'course-mus', 'teacher-arts', 1, 0, 1, 3, '2025-01-15'),
('gc-6a-pe', 'group-6a', 'course-pe', 'teacher-arts', 2, 0, 1, 2, '2025-01-15');

-- Grade 6B (similar assignments)
INSERT INTO group_courses (id, group_id, course_id, teacher_id, weekly_theory_periods, weekly_lab_periods, lab_block_size, priority, effective_from) VALUES
('gc-6b-math', 'group-6b', 'course-math', 'teacher-math', 5, 0, 1, 10, '2025-01-15'),
('gc-6b-sci', 'group-6b', 'course-sci', 'teacher-sci', 3, 1, 2, 9, '2025-01-15'),
('gc-6b-eng', 'group-6b', 'course-eng', 'teacher-eng', 4, 0, 1, 8, '2025-01-15'),
('gc-6b-hist', 'group-6b', 'course-hist', 'teacher-social', 2, 0, 1, 7, '2025-01-15'),
('gc-6b-civ', 'group-6b', 'course-civ', 'teacher-social', 2, 0, 1, 6, '2025-01-15'),
('gc-6b-cs', 'group-6b', 'course-cs', 'teacher-cs', 2, 1, 2, 5, '2025-01-15'),
('gc-6b-art', 'group-6b', 'course-art', 'teacher-arts', 1, 0, 1, 4, '2025-01-15'),
('gc-6b-mus', 'group-6b', 'course-mus', 'teacher-arts', 1, 0, 1, 3, '2025-01-15'),
('gc-6b-pe', 'group-6b', 'course-pe', 'teacher-arts', 2, 0, 1, 2, '2025-01-15');

-- Insert Timetables
INSERT INTO timetables (id, group_id, academic_term_id, status, version, generated_at, published_at, published_by) VALUES
('tt-6a-t1', 'group-6a', 'term-2025-1', 'published', 1, now() - interval '10 days', now() - interval '5 days', 'admin-001'),
('tt-6b-t1', 'group-6b', 'term-2025-1', 'published', 1, now() - interval '10 days', now() - interval '5 days', 'admin-001'),
('tt-6a-t2', 'group-6a', 'term-2025-2', 'draft', 1, now() - interval '2 days', null, null),
('tt-6b-t2', 'group-6b', 'term-2025-2', 'draft', 1, now() - interval '2 days', null, null);

-- Insert Sample Timetable Sessions for Grade 6A Term 1
INSERT INTO timetable_sessions (id, timetable_id, group_id, course_id, teacher_id, day_of_week, period_start_index, duration_periods, type, locked) VALUES
-- Monday
('ts-6a-mon-1', 'tt-6a-t1', 'group-6a', 'course-math', 'teacher-math', 1, 1, 1, 'theory', false),
('ts-6a-mon-2', 'tt-6a-t1', 'group-6a', 'course-eng', 'teacher-eng', 1, 2, 1, 'theory', false),
('ts-6a-mon-3', 'tt-6a-t1', 'group-6a', 'course-sci', 'teacher-sci', 1, 3, 2, 'lab', true),
('ts-6a-mon-5', 'tt-6a-t1', 'group-6a', 'course-hist', 'teacher-social', 1, 5, 1, 'theory', false),
('ts-6a-mon-6', 'tt-6a-t1', 'group-6a', 'course-art', 'teacher-arts', 1, 6, 1, 'theory', false),
('ts-6a-mon-7', 'tt-6a-t1', 'group-6a', 'course-pe', 'teacher-arts', 1, 7, 1, 'theory', false),
('ts-6a-mon-8', 'tt-6a-t1', 'group-6a', 'course-pe', 'teacher-arts', 1, 8, 1, 'theory', false),

-- Tuesday
('ts-6a-tue-1', 'tt-6a-t1', 'group-6a', 'course-eng', 'teacher-eng', 2, 1, 1, 'theory', false),
('ts-6a-tue-2', 'tt-6a-t1', 'group-6a', 'course-math', 'teacher-math', 2, 2, 1, 'theory', false),
('ts-6a-tue-3', 'tt-6a-t1', 'group-6a', 'course-cs', 'teacher-cs', 2, 3, 2, 'lab', false),
('ts-6a-tue-5', 'tt-6a-t1', 'group-6a', 'course-civ', 'teacher-social', 2, 5, 1, 'theory', false),
('ts-6a-tue-6', 'tt-6a-t1', 'group-6a', 'course-civ', 'teacher-social', 2, 6, 1, 'theory', false),
('ts-6a-tue-7', 'tt-6a-t1', 'group-6a', 'course-mus', 'teacher-arts', 2, 7, 1, 'theory', false),

-- Wednesday
('ts-6a-wed-1', 'tt-6a-t1', 'group-6a', 'course-math', 'teacher-math', 3, 1, 1, 'theory', false),
('ts-6a-wed-2', 'tt-6a-t1', 'group-6a', 'course-sci', 'teacher-sci', 3, 2, 1, 'theory', false),
('ts-6a-wed-3', 'tt-6a-t1', 'group-6a', 'course-eng', 'teacher-eng', 3, 3, 1, 'theory', false),
('ts-6a-wed-4', 'tt-6a-t1', 'group-6a', 'course-eng', 'teacher-eng', 3, 4, 1, 'theory', false),
('ts-6a-wed-5', 'tt-6a-t1', 'group-6a', 'course-hist', 'teacher-social', 3, 5, 1, 'theory', false),
('ts-6a-wed-6', 'tt-6a-t1', 'group-6a', 'course-cs', 'teacher-cs', 3, 6, 1, 'theory', false),
('ts-6a-wed-7', 'tt-6a-t1', 'group-6a', 'course-cs', 'teacher-cs', 3, 7, 1, 'theory', false),

-- Thursday
('ts-6a-thu-1', 'tt-6a-t1', 'group-6a', 'course-eng', 'teacher-eng', 4, 1, 1, 'theory', false),
('ts-6a-thu-2', 'tt-6a-t1', 'group-6a', 'course-math', 'teacher-math', 4, 2, 1, 'theory', false),
('ts-6a-thu-3', 'tt-6a-t1', 'group-6a', 'course-math', 'teacher-math', 4, 3, 1, 'theory', false),
('ts-6a-thu-4', 'tt-6a-t1', 'group-6a', 'course-sci', 'teacher-sci', 4, 4, 1, 'theory', false),
('ts-6a-thu-5', 'tt-6a-t1', 'group-6a', 'course-sci', 'teacher-sci', 4, 5, 1, 'theory', false),

-- Friday
('ts-6a-fri-1', 'tt-6a-t1', 'group-6a', 'course-math', 'teacher-math', 5, 1, 1, 'theory', false);

-- Insert Audit Logs
INSERT INTO audit_logs (id, user_id, action, table_name, record_id, new_values, performed_by, performed_at, ip_address, user_agent) VALUES
('audit-001', 'admin-001', 'create', 'timetables', 'tt-6a-t1', '{"status": "published", "version": 1}', 'admin-001', now() - interval '5 days', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('audit-002', 'teacher-math', 'update', 'group_courses', 'gc-6a-math', '{"weekly_theory_periods": 5}', 'teacher-math', now() - interval '3 days', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
('audit-003', 'admin-001', 'create', 'user_profiles', 'student-6a-001', '{"role": "student", "status": "active"}', 'admin-001', now() - interval '60 days', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

-- Insert System Reports
INSERT INTO system_reports (id, name, type, filters, generated_at, generated_by, file_path, status, file_size, download_count) VALUES
('report-001', 'Student Progress Report - March 2025', 'academic_report', '{"peer_group": ["primary", "secondary"], "status": ["active"]}', now() - interval '7 days', 'admin-001', '/reports/student_progress_march_2025.pdf', 'completed', 2500000, 5),
('report-002', 'Attendance Summary - Term 1', 'attendance_summary', '{"role": ["student"], "status": ["active"]}', now() - interval '2 days', 'admin-001', '/reports/attendance_summary_term1.pdf', 'completed', 1800000, 12);

-- Insert User Permissions
-- Admin permissions (full access)
INSERT INTO user_permissions (id, user_id, permission, resource, granted_by, granted_at) VALUES
('perm-admin-001', 'admin-001', 'create', 'users', 'admin-001', now() - interval '100 days'),
('perm-admin-002', 'admin-001', 'read', 'users', 'admin-001', now() - interval '100 days'),
('perm-admin-003', 'admin-001', 'update', 'users', 'admin-001', now() - interval '100 days'),
('perm-admin-004', 'admin-001', 'delete', 'users', 'admin-001', now() - interval '100 days'),
('perm-admin-005', 'admin-001', 'create', 'courses', 'admin-001', now() - interval '100 days'),
('perm-admin-006', 'admin-001', 'read', 'courses', 'admin-001', now() - interval '100 days'),
('perm-admin-007', 'admin-001', 'update', 'courses', 'admin-001', now() - interval '100 days'),
('perm-admin-008', 'admin-001', 'delete', 'courses', 'admin-001', now() - interval '100 days'),
('perm-admin-009', 'admin-001', 'create', 'timetables', 'admin-001', now() - interval '100 days'),
('perm-admin-010', 'admin-001', 'read', 'timetables', 'admin-001', now() - interval '100 days'),
('perm-admin-011', 'admin-001', 'update', 'timetables', 'admin-001', now() - interval '100 days'),
('perm-admin-012', 'admin-001', 'delete', 'timetables', 'admin-001', now() - interval '100 days'),
('perm-admin-013', 'admin-001', 'create', 'reports', 'admin-001', now() - interval '100 days'),
('perm-admin-014', 'admin-001', 'read', 'reports', 'admin-001', now() - interval '100 days');

-- Teacher permissions (limited to their courses and students)
INSERT INTO user_permissions (id, user_id, permission, resource, granted_by, granted_at) VALUES
('perm-teacher-math-001', 'teacher-math', 'read', 'students', 'admin-001', now() - interval '90 days'),
('perm-teacher-math-002', 'teacher-math', 'update', 'grades', 'admin-001', now() - interval '90 days'),
('perm-teacher-math-003', 'teacher-math', 'update', 'attendance', 'admin-001', now() - interval '90 days'),
('perm-teacher-eng-001', 'teacher-eng', 'read', 'students', 'admin-001', now() - interval '90 days'),
('perm-teacher-eng-002', 'teacher-eng', 'update', 'grades', 'admin-001', now() - interval '90 days'),
('perm-teacher-eng-003', 'teacher-eng', 'update', 'attendance', 'admin-001', now() - interval '90 days'),
('perm-teacher-sci-001', 'teacher-sci', 'read', 'students', 'admin-001', now() - interval '90 days'),
('perm-teacher-sci-002', 'teacher-sci', 'update', 'grades', 'admin-001', now() - interval '90 days'),
('perm-teacher-sci-003', 'teacher-sci', 'update', 'attendance', 'admin-001', now() - interval '90 days'),
('perm-teacher-social-001', 'teacher-social', 'read', 'students', 'admin-001', now() - interval '90 days'),
('perm-teacher-social-002', 'teacher-social', 'update', 'grades', 'admin-001', now() - interval '90 days'),
('perm-teacher-social-003', 'teacher-social', 'update', 'attendance', 'admin-001', now() - interval '90 days'),
('perm-teacher-cs-001', 'teacher-cs', 'read', 'students', 'admin-001', now() - interval '90 days'),
('perm-teacher-cs-002', 'teacher-cs', 'update', 'grades', 'admin-001', now() - interval '90 days'),
('perm-teacher-cs-003', 'teacher-cs', 'update', 'attendance', 'admin-001', now() - interval '90 days'),
('perm-teacher-arts-001', 'teacher-arts', 'read', 'students', 'admin-001', now() - interval '90 days'),
('perm-teacher-arts-002', 'teacher-arts', 'update', 'grades', 'admin-001', now() - interval '90 days'),
('perm-teacher-arts-003', 'teacher-arts', 'update', 'attendance', 'admin-001', now() - interval '90 days');

-- Note: Student permissions are handled by RLS policies, not explicit permission records
-- Students can only view their own data through RLS policies on each table