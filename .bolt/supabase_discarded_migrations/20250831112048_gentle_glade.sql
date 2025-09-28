/*
  # Demo Data for Big Day Timetable Allocation System

  This migration inserts comprehensive demo data for Greenfield Academy including:
  
  1. Institution Setup
     - Academic term for 2025 Term 1
     - Allocation settings (6 periods/day for teachers, 8 for classes)
  
  2. Academic Structure
     - 3 cohorts (Grades 6, 7, 8) with day_scholar/hosteller mix
     - 6 sections (A & B for each grade)
     - 60 students (10 per section) with realistic Indian names
  
  3. Staff & Courses
     - 6 teachers with subject specializations
     - 8 courses with appropriate theory/lab period allocations
     - Teacher eligibility for grades and subjects
     - Teacher load rules and availability
  
  4. Timetabling
     - Slot template with 5 days, 8 periods, bell schedule
     - Sample timetables for Grade 6A & 6B with realistic sessions
     - Intentional conflicts for demonstration
  
  5. System Data
     - User permissions based on roles
     - Sample audit logs and system reports
*/

-- Variables for consistent IDs
DO $$
DECLARE
    institution_id uuid := gen_random_uuid();
    term_id uuid := gen_random_uuid();
    
    -- Cohort IDs
    cohort_6_id uuid := gen_random_uuid();
    cohort_7_id uuid := gen_random_uuid();
    cohort_8_id uuid := gen_random_uuid();
    
    -- Section IDs
    section_6a_id uuid := gen_random_uuid();
    section_6b_id uuid := gen_random_uuid();
    section_7a_id uuid := gen_random_uuid();
    section_7b_id uuid := gen_random_uuid();
    section_8a_id uuid := gen_random_uuid();
    section_8b_id uuid := gen_random_uuid();
    
    -- Teacher IDs
    teacher_rao_id uuid := gen_random_uuid();
    teacher_kapoor_id uuid := gen_random_uuid();
    teacher_sharma_id uuid := gen_random_uuid();
    teacher_iyer_id uuid := gen_random_uuid();
    teacher_fernandes_id uuid := gen_random_uuid();
    teacher_das_id uuid := gen_random_uuid();
    admin_id uuid := gen_random_uuid();
    
    -- Course IDs
    course_math_id uuid := gen_random_uuid();
    course_science_id uuid := gen_random_uuid();
    course_english_id uuid := gen_random_uuid();
    course_history_id uuid := gen_random_uuid();
    course_civics_id uuid := gen_random_uuid();
    course_cs_id uuid := gen_random_uuid();
    course_art_id uuid := gen_random_uuid();
    course_pe_id uuid := gen_random_uuid();
    
    -- Slot template ID
    slot_template_id uuid := gen_random_uuid();
    
    -- Timetable IDs
    timetable_6a_id uuid := gen_random_uuid();
    timetable_6b_id uuid := gen_random_uuid();
    
BEGIN

-- 1. Academic Terms
INSERT INTO academic_terms (id, institution_id, name, start_date, end_date, frozen) VALUES
(term_id, institution_id, '2025 Term 1', '2025-01-01', '2025-04-30', false);

-- 2. Allocation Settings
INSERT INTO allocation_settings (id, institution_id, teacher_max_periods_per_day, class_periods_per_day, days_per_week) VALUES
(gen_random_uuid(), institution_id, 6, 8, 5);

-- 3. Cohorts
INSERT INTO cohorts (id, institution_id, academic_term_id, stream, grade, boarding_type, periods_per_day, days_per_week) VALUES
(cohort_6_id, institution_id, term_id, 'General', '6', 'day_scholar', 8, 5),
(cohort_7_id, institution_id, term_id, 'General', '7', 'day_scholar', 8, 5),
(cohort_8_id, institution_id, term_id, 'General', '8', 'day_scholar', 8, 5);

-- 4. Sections
INSERT INTO sections (id, cohort_id, name) VALUES
(section_6a_id, cohort_6_id, 'A'),
(section_6b_id, cohort_6_id, 'B'),
(section_7a_id, cohort_7_id, 'A'),
(section_7b_id, cohort_7_id, 'B'),
(section_8a_id, cohort_8_id, 'A'),
(section_8b_id, cohort_8_id, 'B');

-- 5. User Profiles - Admin
INSERT INTO user_profiles (id, full_name, email, role, employee_id, date_of_joining, accommodation_type, peer_group, department, designation, status) VALUES
(admin_id, 'Dr. Rajesh Gupta', 'principal@greenfieldacademy.edu.in', 'admin', 'EMP001', '2020-06-01', 'day_boarder', 'staff', 'Administration', 'Principal', 'active');

-- 6. User Profiles - Teachers
INSERT INTO user_profiles (id, full_name, email, role, employee_id, date_of_joining, accommodation_type, peer_group, department, designation, status) VALUES
(teacher_rao_id, 'Mr. Suresh Rao', 'suresh.rao@greenfieldacademy.edu.in', 'teacher', 'EMP002', '2022-06-01', 'day_boarder', 'staff', 'Mathematics', 'Teacher', 'active'),
(teacher_kapoor_id, 'Dr. Amit Kapoor', 'amit.kapoor@greenfieldacademy.edu.in', 'teacher', 'EMP003', '2021-06-01', 'day_boarder', 'staff', 'Science', 'Senior Teacher', 'active'),
(teacher_sharma_id, 'Ms. Priya Sharma', 'priya.sharma@greenfieldacademy.edu.in', 'teacher', 'EMP004', '2022-06-01', 'day_boarder', 'staff', 'English', 'Teacher', 'active'),
(teacher_iyer_id, 'Mr. Ravi Iyer', 'ravi.iyer@greenfieldacademy.edu.in', 'teacher', 'EMP005', '2023-06-01', 'day_boarder', 'staff', 'Social Studies', 'Teacher', 'active'),
(teacher_fernandes_id, 'Ms. Maria Fernandes', 'maria.fernandes@greenfieldacademy.edu.in', 'teacher', 'EMP006', '2022-06-01', 'day_boarder', 'staff', 'Computer Science', 'Teacher', 'active'),
(teacher_das_id, 'Mr. Neha Das', 'neha.das@greenfieldacademy.edu.in', 'teacher', 'EMP007', '2023-06-01', 'day_boarder', 'staff', 'Arts', 'Teacher', 'active');

-- 7. User Profiles - Students (10 per section = 60 total)
-- Grade 6A Students
INSERT INTO user_profiles (id, full_name, email, role, admission_number, date_of_admission, current_standard, section, accommodation_type, peer_group, status, group_id) VALUES
(gen_random_uuid(), 'Aarav Sharma', 'adm6a001@student.greenfieldacademy.edu.in', 'student', 'ADM6A001', '2023-04-01', '6', 'A', 'day_boarder', 'secondary', 'active', section_6a_id),
(gen_random_uuid(), 'Saanvi Verma', 'adm6a002@student.greenfieldacademy.edu.in', 'student', 'ADM6A002', '2023-04-01', '6', 'A', 'hosteller', 'secondary', 'active', section_6a_id),
(gen_random_uuid(), 'Vivaan Singh', 'adm6a003@student.greenfieldacademy.edu.in', 'student', 'ADM6A003', '2023-04-01', '6', 'A', 'day_boarder', 'secondary', 'active', section_6a_id),
(gen_random_uuid(), 'Aadhya Kumar', 'adm6a004@student.greenfieldacademy.edu.in', 'student', 'ADM6A004', '2023-04-01', '6', 'A', 'day_boarder', 'secondary', 'active', section_6a_id),
(gen_random_uuid(), 'Aditya Gupta', 'adm6a005@student.greenfieldacademy.edu.in', 'student', 'ADM6A005', '2023-04-01', '6', 'A', 'hosteller', 'secondary', 'active', section_6a_id),
(gen_random_uuid(), 'Kiara Agarwal', 'adm6a006@student.greenfieldacademy.edu.in', 'student', 'ADM6A006', '2023-04-01', '6', 'A', 'day_boarder', 'secondary', 'active', section_6a_id),
(gen_random_uuid(), 'Vihaan Jain', 'adm6a007@student.greenfieldacademy.edu.in', 'student', 'ADM6A007', '2023-04-01', '6', 'A', 'day_boarder', 'secondary', 'active', section_6a_id),
(gen_random_uuid(), 'Diya Bansal', 'adm6a008@student.greenfieldacademy.edu.in', 'student', 'ADM6A008', '2023-04-01', '6', 'A', 'hosteller', 'secondary', 'active', section_6a_id),
(gen_random_uuid(), 'Arjun Srivastava', 'adm6a009@student.greenfieldacademy.edu.in', 'student', 'ADM6A009', '2023-04-01', '6', 'A', 'day_boarder', 'secondary', 'active', section_6a_id),
(gen_random_uuid(), 'Pihu Tiwari', 'adm6a010@student.greenfieldacademy.edu.in', 'student', 'ADM6A010', '2023-04-01', '6', 'A', 'day_boarder', 'secondary', 'active', section_6a_id);

-- Grade 6B Students
INSERT INTO user_profiles (id, full_name, email, role, admission_number, date_of_admission, current_standard, section, accommodation_type, peer_group, status, group_id) VALUES
(gen_random_uuid(), 'Sai Mishra', 'adm6b001@student.greenfieldacademy.edu.in', 'student', 'ADM6B001', '2023-04-01', '6', 'B', 'day_boarder', 'secondary', 'active', section_6b_id),
(gen_random_uuid(), 'Prisha Pandey', 'adm6b002@student.greenfieldacademy.edu.in', 'student', 'ADM6B002', '2023-04-01', '6', 'B', 'hosteller', 'secondary', 'active', section_6b_id),
(gen_random_uuid(), 'Reyansh Yadav', 'adm6b003@student.greenfieldacademy.edu.in', 'student', 'ADM6B003', '2023-04-01', '6', 'B', 'day_boarder', 'secondary', 'active', section_6b_id),
(gen_random_uuid(), 'Ananya Saxena', 'adm6b004@student.greenfieldacademy.edu.in', 'student', 'ADM6B004', '2023-04-01', '6', 'B', 'day_boarder', 'secondary', 'active', section_6b_id),
(gen_random_uuid(), 'Ayaan Arora', 'adm6b005@student.greenfieldacademy.edu.in', 'student', 'ADM6B005', '2023-04-01', '6', 'B', 'hosteller', 'secondary', 'active', section_6b_id),
(gen_random_uuid(), 'Fatima Malhotra', 'adm6b006@student.greenfieldacademy.edu.in', 'student', 'ADM6B006', '2023-04-01', '6', 'B', 'day_boarder', 'secondary', 'active', section_6b_id),
(gen_random_uuid(), 'Krishna Kapoor', 'adm6b007@student.greenfieldacademy.edu.in', 'student', 'ADM6B007', '2023-04-01', '6', 'B', 'day_boarder', 'secondary', 'active', section_6b_id),
(gen_random_uuid(), 'Anika Chopra', 'adm6b008@student.greenfieldacademy.edu.in', 'student', 'ADM6B008', '2023-04-01', '6', 'B', 'hosteller', 'secondary', 'active', section_6b_id),
(gen_random_uuid(), 'Ishaan Bhatia', 'adm6b009@student.greenfieldacademy.edu.in', 'student', 'ADM6B009', '2023-04-01', '6', 'B', 'day_boarder', 'secondary', 'active', section_6b_id),
(gen_random_uuid(), 'Kavya Sethi', 'adm6b010@student.greenfieldacademy.edu.in', 'student', 'ADM6B010', '2023-04-01', '6', 'B', 'day_boarder', 'secondary', 'active', section_6b_id);

-- Grade 7A Students
INSERT INTO user_profiles (id, full_name, email, role, admission_number, date_of_admission, current_standard, section, accommodation_type, peer_group, status, group_id) VALUES
(gen_random_uuid(), 'Shaurya Khanna', 'adm7a001@student.greenfieldacademy.edu.in', 'student', 'ADM7A001', '2023-04-01', '7', 'A', 'day_boarder', 'secondary', 'active', section_7a_id),
(gen_random_uuid(), 'Aradhya Goel', 'adm7a002@student.greenfieldacademy.edu.in', 'student', 'ADM7A002', '2023-04-01', '7', 'A', 'hosteller', 'secondary', 'active', section_7a_id),
(gen_random_uuid(), 'Atharv Mittal', 'adm7a003@student.greenfieldacademy.edu.in', 'student', 'ADM7A003', '2023-04-01', '7', 'A', 'day_boarder', 'secondary', 'active', section_7a_id),
(gen_random_uuid(), 'Ira Joshi', 'adm7a004@student.greenfieldacademy.edu.in', 'student', 'ADM7A004', '2023-04-01', '7', 'A', 'day_boarder', 'secondary', 'active', section_7a_id),
(gen_random_uuid(), 'Advik Nair', 'adm7a005@student.greenfieldacademy.edu.in', 'student', 'ADM7A005', '2023-04-01', '7', 'A', 'hosteller', 'secondary', 'active', section_7a_id),
(gen_random_uuid(), 'Myra Iyer', 'adm7a006@student.greenfieldacademy.edu.in', 'student', 'ADM7A006', '2023-04-01', '7', 'A', 'day_boarder', 'secondary', 'active', section_7a_id),
(gen_random_uuid(), 'Pranav Reddy', 'adm7a007@student.greenfieldacademy.edu.in', 'student', 'ADM7A007', '2023-04-01', '7', 'A', 'day_boarder', 'secondary', 'active', section_7a_id),
(gen_random_uuid(), 'Sara Rao', 'adm7a008@student.greenfieldacademy.edu.in', 'student', 'ADM7A008', '2023-04-01', '7', 'A', 'hosteller', 'secondary', 'active', section_7a_id),
(gen_random_uuid(), 'Rishabh Patel', 'adm7a009@student.greenfieldacademy.edu.in', 'student', 'ADM7A009', '2023-04-01', '7', 'A', 'day_boarder', 'secondary', 'active', section_7a_id),
(gen_random_uuid(), 'Pari Shah', 'adm7a010@student.greenfieldacademy.edu.in', 'student', 'ADM7A010', '2023-04-01', '7', 'A', 'day_boarder', 'secondary', 'active', section_7a_id);

-- Grade 7B Students
INSERT INTO user_profiles (id, full_name, email, role, admission_number, date_of_admission, current_standard, section, accommodation_type, peer_group, status, group_id) VALUES
(gen_random_uuid(), 'Aryan Mehta', 'adm7b001@student.greenfieldacademy.edu.in', 'student', 'ADM7B001', '2023-04-01', '7', 'B', 'day_boarder', 'secondary', 'active', section_7b_id),
(gen_random_uuid(), 'Avni Desai', 'adm7b002@student.greenfieldacademy.edu.in', 'student', 'ADM7B002', '2023-04-01', '7', 'B', 'hosteller', 'secondary', 'active', section_7b_id),
(gen_random_uuid(), 'Kabir Modi', 'adm7b003@student.greenfieldacademy.edu.in', 'student', 'ADM7B003', '2023-04-01', '7', 'B', 'day_boarder', 'secondary', 'active', section_7b_id),
(gen_random_uuid(), 'Riya Thakur', 'adm7b004@student.greenfieldacademy.edu.in', 'student', 'ADM7B004', '2023-04-01', '7', 'B', 'day_boarder', 'secondary', 'active', section_7b_id),
(gen_random_uuid(), 'Ansh Chauhan', 'adm7b005@student.greenfieldacademy.edu.in', 'student', 'ADM7B005', '2023-04-01', '7', 'B', 'hosteller', 'secondary', 'active', section_7b_id),
(gen_random_uuid(), 'Siya Rajput', 'adm7b006@student.greenfieldacademy.edu.in', 'student', 'ADM7B006', '2023-04-01', '7', 'B', 'day_boarder', 'secondary', 'active', section_7b_id),
(gen_random_uuid(), 'Kiaan Bisht', 'adm7b007@student.greenfieldacademy.edu.in', 'student', 'ADM7B007', '2023-04-01', '7', 'B', 'day_boarder', 'secondary', 'active', section_7b_id),
(gen_random_uuid(), 'Nisha Rawat', 'adm7b008@student.greenfieldacademy.edu.in', 'student', 'ADM7B008', '2023-04-01', '7', 'B', 'hosteller', 'secondary', 'active', section_7b_id),
(gen_random_uuid(), 'Rudra Negi', 'adm7b009@student.greenfieldacademy.edu.in', 'student', 'ADM7B009', '2023-04-01', '7', 'B', 'day_boarder', 'secondary', 'active', section_7b_id),
(gen_random_uuid(), 'Khushi Bhatt', 'adm7b010@student.greenfieldacademy.edu.in', 'student', 'ADM7B010', '2023-04-01', '7', 'B', 'day_boarder', 'secondary', 'active', section_7b_id);

-- Grade 8A Students
INSERT INTO user_profiles (id, full_name, email, role, admission_number, date_of_admission, current_standard, section, accommodation_type, peer_group, status, group_id) VALUES
(gen_random_uuid(), 'Priyanshu Jangir', 'adm8a001@student.greenfieldacademy.edu.in', 'student', 'ADM8A001', '2023-04-01', '8', 'A', 'day_boarder', 'secondary', 'active', section_8a_id),
(gen_random_uuid(), 'Ishita Sokhey', 'adm8a002@student.greenfieldacademy.edu.in', 'student', 'ADM8A002', '2023-04-01', '8', 'A', 'hosteller', 'secondary', 'active', section_8a_id),
(gen_random_uuid(), 'Shivansh Koley', 'adm8a003@student.greenfieldacademy.edu.in', 'student', 'ADM8A003', '2023-04-01', '8', 'A', 'day_boarder', 'secondary', 'active', section_8a_id),
(gen_random_uuid(), 'Tara Dubey', 'adm8a004@student.greenfieldacademy.edu.in', 'student', 'ADM8A004', '2023-04-01', '8', 'A', 'day_boarder', 'secondary', 'active', section_8a_id),
(gen_random_uuid(), 'Yuvraj Tripathi', 'adm8a005@student.greenfieldacademy.edu.in', 'student', 'ADM8A005', '2023-04-01', '8', 'A', 'hosteller', 'secondary', 'active', section_8a_id),
(gen_random_uuid(), 'Zara Shukla', 'adm8a006@student.greenfieldacademy.edu.in', 'student', 'ADM8A006', '2023-04-01', '8', 'A', 'day_boarder', 'secondary', 'active', section_8a_id),
(gen_random_uuid(), 'Daksh Chandra', 'adm8a007@student.greenfieldacademy.edu.in', 'student', 'ADM8A007', '2023-04-01', '8', 'A', 'day_boarder', 'secondary', 'active', section_8a_id),
(gen_random_uuid(), 'Aditi Bhardwaj', 'adm8a008@student.greenfieldacademy.edu.in', 'student', 'ADM8A008', '2023-04-01', '8', 'A', 'hosteller', 'secondary', 'active', section_8a_id),
(gen_random_uuid(), 'Om Agnihotri', 'adm8a009@student.greenfieldacademy.edu.in', 'student', 'ADM8A009', '2023-04-01', '8', 'A', 'day_boarder', 'secondary', 'active', section_8a_id),
(gen_random_uuid(), 'Ahana Dixit', 'adm8a010@student.greenfieldacademy.edu.in', 'student', 'ADM8A010', '2023-04-01', '8', 'A', 'day_boarder', 'secondary', 'active', section_8a_id);

-- Grade 8B Students
INSERT INTO user_profiles (id, full_name, email, role, admission_number, date_of_admission, current_standard, section, accommodation_type, peer_group, status, group_id) VALUES
(gen_random_uuid(), 'Divyansh Kumar', 'adm8b001@student.greenfieldacademy.edu.in', 'student', 'ADM8B001', '2023-04-01', '8', 'B', 'day_boarder', 'secondary', 'active', section_8b_id),
(gen_random_uuid(), 'Kashvi Sharma', 'adm8b002@student.greenfieldacademy.edu.in', 'student', 'ADM8B002', '2023-04-01', '8', 'B', 'hosteller', 'secondary', 'active', section_8b_id),
(gen_random_uuid(), 'Harsh Verma', 'adm8b003@student.greenfieldacademy.edu.in', 'student', 'ADM8B003', '2023-04-01', '8', 'B', 'day_boarder', 'secondary', 'active', section_8b_id),
(gen_random_uuid(), 'Shanaya Singh', 'adm8b004@student.greenfieldacademy.edu.in', 'student', 'ADM8B004', '2023-04-01', '8', 'B', 'day_boarder', 'secondary', 'active', section_8b_id),
(gen_random_uuid(), 'Karthik Gupta', 'adm8b005@student.greenfieldacademy.edu.in', 'student', 'ADM8B005', '2023-04-01', '8', 'B', 'hosteller', 'secondary', 'active', section_8b_id),
(gen_random_uuid(), 'Navya Agarwal', 'adm8b006@student.greenfieldacademy.edu.in', 'student', 'ADM8B006', '2023-04-01', '8', 'B', 'day_boarder', 'secondary', 'active', section_8b_id),
(gen_random_uuid(), 'Arnav Jain', 'adm8b007@student.greenfieldacademy.edu.in', 'student', 'ADM8B007', '2023-04-01', '8', 'B', 'day_boarder', 'secondary', 'active', section_8b_id),
(gen_random_uuid(), 'Drishti Bansal', 'adm8b008@student.greenfieldacademy.edu.in', 'student', 'ADM8B008', '2023-04-01', '8', 'B', 'hosteller', 'secondary', 'active', section_8b_id),
(gen_random_uuid(), 'Ryan Srivastava', 'adm8b009@student.greenfieldacademy.edu.in', 'student', 'ADM8B009', '2023-04-01', '8', 'B', 'day_boarder', 'secondary', 'active', section_8b_id),
(gen_random_uuid(), 'Vanya Tiwari', 'adm8b010@student.greenfieldacademy.edu.in', 'student', 'ADM8B010', '2023-04-01', '8', 'B', 'day_boarder', 'secondary', 'active', section_8b_id);

-- 8. Courses
INSERT INTO courses (id, institution_id, title, code, active, weekly_theory_periods, weekly_lab_periods, lab_block_size) VALUES
(course_math_id, institution_id, 'Mathematics', 'MATH', true, 5, 0, 1),
(course_science_id, institution_id, 'Science', 'SCI', true, 3, 1, 2),
(course_english_id, institution_id, 'English', 'ENG', true, 4, 0, 1),
(course_history_id, institution_id, 'History', 'HIST', true, 2, 0, 1),
(course_civics_id, institution_id, 'Civics', 'CIV', true, 2, 0, 1),
(course_cs_id, institution_id, 'Computer Science', 'CS', true, 2, 1, 2),
(course_art_id, institution_id, 'Art', 'ART', true, 1, 0, 1),
(course_pe_id, institution_id, 'Physical Education', 'PE', true, 2, 0, 1);

-- 9. Section Courses (Assign all courses to all sections with teachers)
-- Grade 6A
INSERT INTO section_courses (id, section_id, course_id, teacher_id, weekly_theory_periods, weekly_lab_periods, lab_block_size, priority) VALUES
(gen_random_uuid(), section_6a_id, course_math_id, teacher_rao_id, 5, 0, 1, 10),
(gen_random_uuid(), section_6a_id, course_science_id, teacher_kapoor_id, 3, 1, 2, 9),
(gen_random_uuid(), section_6a_id, course_english_id, teacher_sharma_id, 4, 0, 1, 8),
(gen_random_uuid(), section_6a_id, course_cs_id, teacher_fernandes_id, 2, 1, 2, 7),
(gen_random_uuid(), section_6a_id, course_art_id, teacher_das_id, 1, 0, 1, 6),
(gen_random_uuid(), section_6a_id, course_pe_id, teacher_das_id, 2, 0, 1, 5);

-- Grade 6B
INSERT INTO section_courses (id, section_id, course_id, teacher_id, weekly_theory_periods, weekly_lab_periods, lab_block_size, priority) VALUES
(gen_random_uuid(), section_6b_id, course_math_id, teacher_rao_id, 5, 0, 1, 10),
(gen_random_uuid(), section_6b_id, course_science_id, teacher_kapoor_id, 3, 1, 2, 9),
(gen_random_uuid(), section_6b_id, course_english_id, teacher_sharma_id, 4, 0, 1, 8),
(gen_random_uuid(), section_6b_id, course_cs_id, teacher_fernandes_id, 2, 1, 2, 7),
(gen_random_uuid(), section_6b_id, course_art_id, teacher_das_id, 1, 0, 1, 6),
(gen_random_uuid(), section_6b_id, course_pe_id, teacher_das_id, 2, 0, 1, 5);

-- Grade 7A
INSERT INTO section_courses (id, section_id, course_id, teacher_id, weekly_theory_periods, weekly_lab_periods, lab_block_size, priority) VALUES
(gen_random_uuid(), section_7a_id, course_math_id, teacher_rao_id, 5, 0, 1, 10),
(gen_random_uuid(), section_7a_id, course_science_id, teacher_kapoor_id, 3, 1, 2, 9),
(gen_random_uuid(), section_7a_id, course_english_id, teacher_sharma_id, 4, 0, 1, 8),
(gen_random_uuid(), section_7a_id, course_history_id, teacher_iyer_id, 2, 0, 1, 7),
(gen_random_uuid(), section_7a_id, course_civics_id, teacher_iyer_id, 2, 0, 1, 6),
(gen_random_uuid(), section_7a_id, course_cs_id, teacher_fernandes_id, 2, 1, 2, 5),
(gen_random_uuid(), section_7a_id, course_art_id, teacher_das_id, 1, 0, 1, 4),
(gen_random_uuid(), section_7a_id, course_pe_id, teacher_das_id, 2, 0, 1, 3);

-- Grade 7B
INSERT INTO section_courses (id, section_id, course_id, teacher_id, weekly_theory_periods, weekly_lab_periods, lab_block_size, priority) VALUES
(gen_random_uuid(), section_7b_id, course_math_id, teacher_rao_id, 5, 0, 1, 10),
(gen_random_uuid(), section_7b_id, course_science_id, teacher_kapoor_id, 3, 1, 2, 9),
(gen_random_uuid(), section_7b_id, course_english_id, teacher_sharma_id, 4, 0, 1, 8),
(gen_random_uuid(), section_7b_id, course_history_id, teacher_iyer_id, 2, 0, 1, 7),
(gen_random_uuid(), section_7b_id, course_civics_id, teacher_iyer_id, 2, 0, 1, 6),
(gen_random_uuid(), section_7b_id, course_cs_id, teacher_fernandes_id, 2, 1, 2, 5),
(gen_random_uuid(), section_7b_id, course_art_id, teacher_das_id, 1, 0, 1, 4),
(gen_random_uuid(), section_7b_id, course_pe_id, teacher_das_id, 2, 0, 1, 3);

-- Grade 8A
INSERT INTO section_courses (id, section_id, course_id, teacher_id, weekly_theory_periods, weekly_lab_periods, lab_block_size, priority) VALUES
(gen_random_uuid(), section_8a_id, course_math_id, teacher_rao_id, 5, 0, 1, 10),
(gen_random_uuid(), section_8a_id, course_science_id, teacher_kapoor_id, 3, 1, 2, 9),
(gen_random_uuid(), section_8a_id, course_english_id, teacher_sharma_id, 4, 0, 1, 8),
(gen_random_uuid(), section_8a_id, course_history_id, teacher_iyer_id, 2, 0, 1, 7),
(gen_random_uuid(), section_8a_id, course_civics_id, teacher_iyer_id, 2, 0, 1, 6),
(gen_random_uuid(), section_8a_id, course_cs_id, teacher_fernandes_id, 2, 1, 2, 5),
(gen_random_uuid(), section_8a_id, course_art_id, teacher_das_id, 1, 0, 1, 4),
(gen_random_uuid(), section_8a_id, course_pe_id, teacher_das_id, 2, 0, 1, 3);

-- Grade 8B
INSERT INTO section_courses (id, section_id, course_id, teacher_id, weekly_theory_periods, weekly_lab_periods, lab_block_size, priority) VALUES
(gen_random_uuid(), section_8b_id, course_math_id, teacher_rao_id, 5, 0, 1, 10),
(gen_random_uuid(), section_8b_id, course_science_id, teacher_kapoor_id, 3, 1, 2, 9),
(gen_random_uuid(), section_8b_id, course_english_id, teacher_sharma_id, 4, 0, 1, 8),
(gen_random_uuid(), section_8b_id, course_history_id, teacher_iyer_id, 2, 0, 1, 7),
(gen_random_uuid(), section_8b_id, course_civics_id, teacher_iyer_id, 2, 0, 1, 6),
(gen_random_uuid(), section_8b_id, course_cs_id, teacher_fernandes_id, 2, 1, 2, 5),
(gen_random_uuid(), section_8b_id, course_art_id, teacher_das_id, 1, 0, 1, 4),
(gen_random_uuid(), section_8b_id, course_pe_id, teacher_das_id, 2, 0, 1, 3);

-- 10. Teacher Subject Eligibility
INSERT INTO teacher_subject_eligibility (id, teacher_id, course_id) VALUES
-- Mr. Rao - Mathematics
(gen_random_uuid(), teacher_rao_id, course_math_id),
-- Dr. Kapoor - Science
(gen_random_uuid(), teacher_kapoor_id, course_science_id),
-- Ms. Sharma - English
(gen_random_uuid(), teacher_sharma_id, course_english_id),
-- Mr. Iyer - History & Civics
(gen_random_uuid(), teacher_iyer_id, course_history_id),
(gen_random_uuid(), teacher_iyer_id, course_civics_id),
-- Ms. Fernandes - Computer Science
(gen_random_uuid(), teacher_fernandes_id, course_cs_id),
-- Mr. Das - Art & PE
(gen_random_uuid(), teacher_das_id, course_art_id),
(gen_random_uuid(), teacher_das_id, course_pe_id);

-- 11. Teacher Grade Eligibility
INSERT INTO teacher_grade_eligibility (id, teacher_id, grade) VALUES
-- Mr. Rao - All grades
(gen_random_uuid(), teacher_rao_id, '6'),
(gen_random_uuid(), teacher_rao_id, '7'),
(gen_random_uuid(), teacher_rao_id, '8'),
-- Dr. Kapoor - All grades
(gen_random_uuid(), teacher_kapoor_id, '6'),
(gen_random_uuid(), teacher_kapoor_id, '7'),
(gen_random_uuid(), teacher_kapoor_id, '8'),
-- Ms. Sharma - All grades
(gen_random_uuid(), teacher_sharma_id, '6'),
(gen_random_uuid(), teacher_sharma_id, '7'),
(gen_random_uuid(), teacher_sharma_id, '8'),
-- Mr. Iyer - Grades 7-8 only
(gen_random_uuid(), teacher_iyer_id, '7'),
(gen_random_uuid(), teacher_iyer_id, '8'),
-- Ms. Fernandes - All grades
(gen_random_uuid(), teacher_fernandes_id, '6'),
(gen_random_uuid(), teacher_fernandes_id, '7'),
(gen_random_uuid(), teacher_fernandes_id, '8'),
-- Mr. Das - All grades
(gen_random_uuid(), teacher_das_id, '6'),
(gen_random_uuid(), teacher_das_id, '7'),
(gen_random_uuid(), teacher_das_id, '8');

-- 12. Teacher Load Rules
INSERT INTO teacher_load_rules (id, teacher_id, max_periods_per_day, max_periods_per_week, availability) VALUES
(gen_random_uuid(), teacher_rao_id, 6, 30, '{"monday": [1,2,3,4,5,6,7,8], "tuesday": [1,2,3,4,5,6,7,8], "wednesday": [1,2,3,4,5,6,7,8], "thursday": [1,2,3,4,5,6,7,8], "friday": [1,2,3,4,5,6,7,8]}'),
(gen_random_uuid(), teacher_kapoor_id, 6, 30, '{"monday": [1,2,3,4,5,6,7,8], "tuesday": [1,2,3,4,5,6,7,8], "wednesday": [1,2,3,4,5,6,7,8], "thursday": [1,2,3,4,5,6,7,8], "friday": [1,2,3,4,5,6,7,8]}'),
(gen_random_uuid(), teacher_sharma_id, 6, 30, '{"monday": [1,2,3,4,5,6,7,8], "tuesday": [1,2,3,4,5,6,7,8], "wednesday": [1,2,3,4,5,6,7,8], "thursday": [1,2,3,4,5,6,7,8], "friday": [1,2,3,4,5,6,7,8]}'),
(gen_random_uuid(), teacher_iyer_id, 6, 30, '{"monday": [1,2,3,4,5,6,7,8], "tuesday": [1,2,3,4,5,6,7,8], "wednesday": [1,2,3,4,5,6,7,8], "thursday": [1,2,3,4,5,6,7,8], "friday": [1,2,3,4,5,6,7,8]}'),
(gen_random_uuid(), teacher_fernandes_id, 6, 30, '{"monday": [1,2,3,4,5,6,7,8], "tuesday": [1,2,3,4,5,6,7,8], "wednesday": [1,2,3,4,5,6,7,8], "thursday": [1,2,3,4,5,6,7,8], "friday": [1,2,3,4,5,6,7,8]}'),
(gen_random_uuid(), teacher_das_id, 6, 30, '{"monday": [1,2,3,4,5,6,7,8], "tuesday": [1,2,3,4,5,6,7,8], "wednesday": [1,2,3,4,5,6,7,8], "thursday": [1,2,3,4,5,6,7,8], "friday": [1,2,3,4,5,6,7,8]}');

-- 13. Slot Templates
INSERT INTO slot_templates (id, institution_id, name, days_per_week, periods_per_day, bells) VALUES
(slot_template_id, institution_id, 'Standard 8 Period Schedule', 5, 8, '{"1": "08:30-09:15", "2": "09:15-10:00", "3": "10:00-10:45", "4": "11:00-11:45", "5": "11:45-12:30", "6": "12:30-13:15", "7": "14:00-14:45", "8": "14:45-15:30"}');

-- 14. Slot Template Assignments (Assign to all cohorts)
INSERT INTO slot_template_assignments (id, slot_template_id, cohort_id) VALUES
(gen_random_uuid(), slot_template_id, cohort_6_id),
(gen_random_uuid(), slot_template_id, cohort_7_id),
(gen_random_uuid(), slot_template_id, cohort_8_id);

-- 15. Timetables (Create for all sections, but only populate sessions for 6A & 6B)
INSERT INTO timetables (id, section_id, academic_term_id, status, generated_by) VALUES
(timetable_6a_id, section_6a_id, term_id, 'draft', admin_id),
(timetable_6b_id, section_6b_id, term_id, 'draft', admin_id),
(gen_random_uuid(), section_7a_id, term_id, 'draft', admin_id),
(gen_random_uuid(), section_7b_id, term_id, 'draft', admin_id),
(gen_random_uuid(), section_8a_id, term_id, 'draft', admin_id),
(gen_random_uuid(), section_8b_id, term_id, 'draft', admin_id);

-- 16. Timetable Sessions for Grade 6A (Sample realistic schedule)
INSERT INTO timetable_sessions (id, timetable_id, section_id, course_id, teacher_id, day_of_week, period_index, duration_periods, session_type) VALUES
-- Monday
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_math_id, teacher_rao_id, 1, 1, 1, 'theory'),
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_english_id, teacher_sharma_id, 1, 2, 1, 'theory'),
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_science_id, teacher_kapoor_id, 1, 3, 1, 'theory'),
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_cs_id, teacher_fernandes_id, 1, 5, 2, 'lab'),
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_art_id, teacher_das_id, 1, 7, 1, 'theory'),
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_pe_id, teacher_das_id, 1, 8, 1, 'theory'),

-- Tuesday
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_math_id, teacher_rao_id, 2, 1, 1, 'theory'),
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_english_id, teacher_sharma_id, 2, 2, 1, 'theory'),
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_science_id, teacher_kapoor_id, 2, 3, 1, 'theory'),
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_science_id, teacher_kapoor_id, 2, 5, 2, 'lab'),
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_cs_id, teacher_fernandes_id, 2, 7, 1, 'theory'),

-- Wednesday
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_math_id, teacher_rao_id, 3, 1, 1, 'theory'),
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_english_id, teacher_sharma_id, 3, 2, 1, 'theory'),
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_science_id, teacher_kapoor_id, 3, 3, 1, 'theory'),
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_cs_id, teacher_fernandes_id, 3, 4, 1, 'theory'),
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_pe_id, teacher_das_id, 3, 8, 1, 'theory'),

-- Thursday
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_math_id, teacher_rao_id, 4, 1, 1, 'theory'),
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_english_id, teacher_sharma_id, 4, 2, 1, 'theory'),

-- Friday
(gen_random_uuid(), timetable_6a_id, section_6a_id, course_math_id, teacher_rao_id, 5, 1, 1, 'theory');

-- 17. Timetable Sessions for Grade 6B (Sample realistic schedule)
INSERT INTO timetable_sessions (id, timetable_id, section_id, course_id, teacher_id, day_of_week, period_index, duration_periods, session_type) VALUES
-- Monday
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_english_id, teacher_sharma_id, 1, 1, 1, 'theory'),
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_math_id, teacher_rao_id, 1, 2, 1, 'theory'),
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_science_id, teacher_kapoor_id, 1, 3, 1, 'theory'),
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_cs_id, teacher_fernandes_id, 1, 5, 1, 'theory'),
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_art_id, teacher_das_id, 1, 7, 1, 'theory'),

-- Tuesday
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_english_id, teacher_sharma_id, 2, 1, 1, 'theory'),
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_math_id, teacher_rao_id, 2, 2, 1, 'theory'),
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_science_id, teacher_kapoor_id, 2, 3, 1, 'theory'),
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_cs_id, teacher_fernandes_id, 2, 5, 2, 'lab'),

-- Wednesday
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_english_id, teacher_sharma_id, 3, 1, 1, 'theory'),
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_math_id, teacher_rao_id, 3, 2, 1, 'theory'),
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_science_id, teacher_kapoor_id, 3, 5, 2, 'lab'),
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_pe_id, teacher_das_id, 3, 8, 1, 'theory'),

-- Thursday
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_english_id, teacher_sharma_id, 4, 1, 1, 'theory'),
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_math_id, teacher_rao_id, 4, 2, 1, 'theory'),

-- Friday
(gen_random_uuid(), timetable_6b_id, section_6b_id, course_math_id, teacher_rao_id, 5, 1, 1, 'theory');

-- 18. Timetable Conflicts (Intentional demo conflicts)
INSERT INTO timetable_conflicts (id, teacher_id, section_id, course_id, day_of_week, period_index, conflict_type, details) VALUES
-- Mr. Rao double-booked: 6A Math and 7B Math both at Monday Period 2
(gen_random_uuid(), teacher_rao_id, section_6a_id, course_math_id, 1, 2, 'teacher_double_booked', '{"message": "Mr. Rao is scheduled for both Grade 6A and Grade 7B at Monday Period 2", "conflicting_sections": ["6A", "7B"]}'),
-- Section 6A conflict: Math and Science both at Wednesday Period 3
(gen_random_uuid(), NULL, section_6a_id, course_math_id, 3, 3, 'section_double_booked', '{"message": "Grade 6A has both Mathematics and Science scheduled at Wednesday Period 3", "conflicting_courses": ["Mathematics", "Science"]}');

-- 19. User Permissions
-- Admin permissions (full access)
INSERT INTO user_permissions (id, user_id, permission, resource, granted_by) VALUES
(gen_random_uuid(), admin_id, 'create', 'users', admin_id),
(gen_random_uuid(), admin_id, 'read', 'users', admin_id),
(gen_random_uuid(), admin_id, 'update', 'users', admin_id),
(gen_random_uuid(), admin_id, 'delete', 'users', admin_id),
(gen_random_uuid(), admin_id, 'create', 'courses', admin_id),
(gen_random_uuid(), admin_id, 'read', 'courses', admin_id),
(gen_random_uuid(), admin_id, 'update', 'courses', admin_id),
(gen_random_uuid(), admin_id, 'delete', 'courses', admin_id),
(gen_random_uuid(), admin_id, 'create', 'timetables', admin_id),
(gen_random_uuid(), admin_id, 'read', 'timetables', admin_id),
(gen_random_uuid(), admin_id, 'update', 'timetables', admin_id),
(gen_random_uuid(), admin_id, 'delete', 'timetables', admin_id);

-- Teacher permissions (limited access)
INSERT INTO user_permissions (id, user_id, permission, resource, granted_by) VALUES
(gen_random_uuid(), teacher_rao_id, 'read', 'students', admin_id),
(gen_random_uuid(), teacher_rao_id, 'update', 'grades', admin_id),
(gen_random_uuid(), teacher_rao_id, 'read', 'attendance', admin_id),
(gen_random_uuid(), teacher_kapoor_id, 'read', 'students', admin_id),
(gen_random_uuid(), teacher_kapoor_id, 'update', 'grades', admin_id),
(gen_random_uuid(), teacher_kapoor_id, 'read', 'attendance', admin_id),
(gen_random_uuid(), teacher_sharma_id, 'read', 'students', admin_id),
(gen_random_uuid(), teacher_sharma_id, 'update', 'grades', admin_id),
(gen_random_uuid(), teacher_sharma_id, 'read', 'attendance', admin_id),
(gen_random_uuid(), teacher_iyer_id, 'read', 'students', admin_id),
(gen_random_uuid(), teacher_iyer_id, 'update', 'grades', admin_id),
(gen_random_uuid(), teacher_iyer_id, 'read', 'attendance', admin_id),
(gen_random_uuid(), teacher_fernandes_id, 'read', 'students', admin_id),
(gen_random_uuid(), teacher_fernandes_id, 'update', 'grades', admin_id),
(gen_random_uuid(), teacher_fernandes_id, 'read', 'attendance', admin_id),
(gen_random_uuid(), teacher_das_id, 'read', 'students', admin_id),
(gen_random_uuid(), teacher_das_id, 'update', 'grades', admin_id),
(gen_random_uuid(), teacher_das_id, 'read', 'attendance', admin_id);

-- 20. System Reports
INSERT INTO system_reports (id, name, type, filters, generated_at, generated_by, file_path, status, file_size, download_count) VALUES
(gen_random_uuid(), 'Student Progress Report - March 2025', 'academic_report', '{"peer_group": ["secondary"], "status": ["active"]}', NOW() - INTERVAL '7 days', admin_id, '/reports/student_progress_march_2025.pdf', 'completed', 2500000, 5),
(gen_random_uuid(), 'Attendance Summary - Term 1', 'attendance_summary', '{"role": ["student"], "status": ["active"]}', NOW() - INTERVAL '2 days', admin_id, '/reports/attendance_summary_term1.pdf', 'completed', 1800000, 12);

-- 21. Audit Logs
INSERT INTO audit_logs (id, user_id, action, table_name, record_id, new_values, performed_by, performed_at, ip_address, user_agent) VALUES
(gen_random_uuid(), admin_id, 'create', 'timetables', timetable_6a_id::text, '{"status": "draft"}', admin_id, NOW() - INTERVAL '5 days', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(gen_random_uuid(), teacher_rao_id, 'update', 'section_courses', gen_random_uuid()::text, '{"weekly_theory_periods": 5}', teacher_rao_id, NOW() - INTERVAL '3 days', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

END $$;