/*
  # Populate Demo Data

  1. New Data
    - Demo users (students, teachers, admin)
    - Groups (classes and departments)
    - Courses with subtopics, timetable, and holidays
    - Assessments with various types
    - Grades with performance data
    - Attendance records
    - Messages between users
    - Resources for courses
    - Extracurricular activities
    - Conversations with AI

  2. Security
    - No changes to security policies
*/

-- Clear existing demo data if any exists
DELETE FROM conversations WHERE user_id IN (SELECT id FROM user_profiles WHERE email LIKE '%@dpsb.edu');
DELETE FROM extracurricular WHERE user_id IN (SELECT id FROM user_profiles WHERE email LIKE '%@dpsb.edu');
DELETE FROM resources WHERE uploaded_by IN (SELECT id FROM user_profiles WHERE email LIKE '%@dpsb.edu');
DELETE FROM messages WHERE sender_id IN (SELECT id FROM user_profiles WHERE email LIKE '%@dpsb.edu');
DELETE FROM attendance WHERE student_id IN (SELECT id FROM user_profiles WHERE email LIKE '%@dpsb.edu');
DELETE FROM grades WHERE student_id IN (SELECT id FROM user_profiles WHERE email LIKE '%@dpsb.edu');
DELETE FROM assessments WHERE course_id IN (SELECT id FROM courses WHERE teacher_id IN (SELECT id FROM user_profiles WHERE email LIKE '%@dpsb.edu'));
DELETE FROM courses WHERE teacher_id IN (SELECT id FROM user_profiles WHERE email LIKE '%@dpsb.edu');
DELETE FROM user_profiles WHERE email LIKE '%@dpsb.edu';
DELETE FROM groups WHERE name LIKE 'Class%' OR name LIKE 'Department%';

-- Insert groups
INSERT INTO groups (id, name, type, description) VALUES
('c10a', 'Class 10-A', 'class', 'Section A of 10th grade'),
('c10b', 'Class 10-B', 'class', 'Section B of 10th grade'),
('c11a', 'Class 11-A', 'class', 'Section A of 11th grade'),
('dcs', 'Department of Computer Science', 'department', 'Computer Science Department'),
('dmath', 'Department of Mathematics', 'department', 'Mathematics Department'),
('dphy', 'Department of Physics', 'department', 'Physics Department');

-- Insert users (admin, teachers, students)
INSERT INTO user_profiles (id, name, role, group_id, department, profile_data, status) VALUES
-- Admin
('admin-1', 'Admin User', 'admin', NULL, NULL, '{"baseline": 0, "strengths": ["Management", "Leadership"], "psycho_test": {"analytical": 90, "creative": 85, "practical": 88}}', 'active'),

-- Teachers
('teacher-1', 'Jagdeep Singh Sokhey', 'teacher', NULL, 'Computer Science', '{"baseline": 0, "strengths": ["Programming", "AI"], "psycho_test": {"analytical": 95, "creative": 80, "practical": 90}}', 'active'),
('teacher-2', 'Michael Zhang', 'teacher', NULL, 'Mathematics', '{"baseline": 0, "strengths": ["Calculus", "Statistics"], "psycho_test": {"analytical": 92, "creative": 75, "practical": 85}}', 'active'),
('teacher-3', 'Emily Brown', 'teacher', NULL, 'Physics', '{"baseline": 0, "strengths": ["Mechanics", "Quantum Physics"], "psycho_test": {"analytical": 90, "creative": 82, "practical": 88}}', 'active'),

-- Students
('student-1', 'Ritik Koley', 'student', 'c10a', NULL, '{"baseline": 85, "strengths": ["Programming", "Mathematics"], "weaknesses": ["Physics"], "psycho_test": {"analytical": 88, "creative": 92, "practical": 85}}', 'active'),
('student-2', 'Alex Johnson', 'student', 'c10a', NULL, '{"baseline": 82, "strengths": ["Physics", "Chemistry"], "weaknesses": ["Mathematics"], "psycho_test": {"analytical": 85, "creative": 80, "practical": 90}}', 'active'),
('student-3', 'Sarah Williams', 'student', 'c10a', NULL, '{"baseline": 90, "strengths": ["Mathematics", "Biology"], "weaknesses": ["Chemistry"], "psycho_test": {"analytical": 92, "creative": 88, "practical": 85}}', 'active'),
('student-4', 'Raj Patel', 'student', 'c10b', NULL, '{"baseline": 78, "strengths": ["History", "Geography"], "weaknesses": ["Mathematics"], "psycho_test": {"analytical": 75, "creative": 90, "practical": 88}}', 'active'),
('student-5', 'Priya Sharma', 'student', 'c10b', NULL, '{"baseline": 88, "strengths": ["Literature", "Arts"], "weaknesses": ["Physics"], "psycho_test": {"analytical": 82, "creative": 95, "practical": 80}}', 'active'),
('student-6', 'David Chen', 'student', 'c11a', NULL, '{"baseline": 92, "strengths": ["Computer Science", "Mathematics"], "weaknesses": ["Literature"], "psycho_test": {"analytical": 95, "creative": 85, "practical": 88}}', 'active'),
('student-7', 'Emma Wilson', 'student', 'c11a', NULL, '{"baseline": 85, "strengths": ["Biology", "Chemistry"], "weaknesses": ["Physics"], "psycho_test": {"analytical": 88, "creative": 90, "practical": 85}}', 'active'),
('student-8', 'Mohammed Ali', 'student', 'c11a', NULL, '{"baseline": 80, "strengths": ["Physics", "Mathematics"], "weaknesses": ["Literature"], "psycho_test": {"analytical": 85, "creative": 75, "practical": 92}}', 'active'),
('student-9', 'Sophia Garcia', 'student', 'c10b', NULL, '{"baseline": 87, "strengths": ["Arts", "Literature"], "weaknesses": ["Mathematics"], "psycho_test": {"analytical": 80, "creative": 95, "practical": 85}}', 'active'),
('student-10', 'James Wilson', 'student', 'c10a', NULL, '{"baseline": 83, "strengths": ["Geography", "History"], "weaknesses": ["Computer Science"], "psycho_test": {"analytical": 82, "creative": 88, "practical": 90}}', 'active');

-- Insert courses with subtopics, timetable, and holidays
INSERT INTO courses (id, name, code, teacher_id, group_ids, subtopics, timetable, holidays, type, semester, academic_year, allow_quizzes) VALUES
-- Computer Science courses
('cs101', 'Computer Science Fundamentals', 'CS101', 'teacher-1', ARRAY['c10a', 'c10b'], 
  '[
    {"name": "Programming Basics", "weight": 0.2},
    {"name": "Data Structures", "weight": 0.3},
    {"name": "Algorithms", "weight": 0.3},
    {"name": "Object-Oriented Programming", "weight": 0.2}
  ]'::jsonb,
  '[
    {"day": "Monday", "time": "10:30 AM - 11:45 AM", "room": "CS-301"},
    {"day": "Wednesday", "time": "10:30 AM - 11:45 AM", "room": "CS-301"}
  ]'::jsonb,
  '[
    {"date": "2024-08-15", "name": "Independence Day"},
    {"date": "2024-10-02", "name": "Gandhi Jayanti"},
    {"date": "2024-12-25", "name": "Christmas"}
  ]'::jsonb,
  'theory', 1, '2024-25', true),

('cs102', 'Advanced Programming', 'CS102', 'teacher-1', ARRAY['c11a'], 
  '[
    {"name": "Neural Networks", "weight": 0.25},
    {"name": "Machine Learning", "weight": 0.25},
    {"name": "Web Development", "weight": 0.25},
    {"name": "Database Systems", "weight": 0.25}
  ]'::jsonb,
  '[
    {"day": "Tuesday", "time": "2:00 PM - 3:15 PM", "room": "CS-302"},
    {"day": "Thursday", "time": "2:00 PM - 3:15 PM", "room": "CS-302"}
  ]'::jsonb,
  '[
    {"date": "2024-08-15", "name": "Independence Day"},
    {"date": "2024-10-02", "name": "Gandhi Jayanti"},
    {"date": "2024-12-25", "name": "Christmas"}
  ]'::jsonb,
  'theory', 1, '2024-25', true),

-- Mathematics courses
('math101', 'Mathematics', 'MATH101', 'teacher-2', ARRAY['c10a', 'c10b'], 
  '[
    {"name": "Algebra", "weight": 0.25},
    {"name": "Calculus", "weight": 0.25},
    {"name": "Geometry", "weight": 0.25},
    {"name": "Trigonometry", "weight": 0.25}
  ]'::jsonb,
  '[
    {"day": "Monday", "time": "9:00 AM - 10:15 AM", "room": "M-201"},
    {"day": "Wednesday", "time": "9:00 AM - 10:15 AM", "room": "M-201"}
  ]'::jsonb,
  '[
    {"date": "2024-08-15", "name": "Independence Day"},
    {"date": "2024-10-02", "name": "Gandhi Jayanti"},
    {"date": "2024-12-25", "name": "Christmas"}
  ]'::jsonb,
  'theory', 1, '2024-25', true),

('math201', 'Advanced Mathematics', 'MATH201', 'teacher-2', ARRAY['c11a'], 
  '[
    {"name": "Linear Algebra", "weight": 0.25},
    {"name": "Differential Equations", "weight": 0.25},
    {"name": "Statistics", "weight": 0.25},
    {"name": "Numerical Methods", "weight": 0.25}
  ]'::jsonb,
  '[
    {"day": "Tuesday", "time": "9:00 AM - 10:15 AM", "room": "M-202"},
    {"day": "Thursday", "time": "9:00 AM - 10:15 AM", "room": "M-202"}
  ]'::jsonb,
  '[
    {"date": "2024-08-15", "name": "Independence Day"},
    {"date": "2024-10-02", "name": "Gandhi Jayanti"},
    {"date": "2024-12-25", "name": "Christmas"}
  ]'::jsonb,
  'theory', 1, '2024-25', true),

-- Physics courses
('phy101', 'Physics', 'PHY101', 'teacher-3', ARRAY['c10a', 'c10b'], 
  '[
    {"name": "Mechanics", "weight": 0.25},
    {"name": "Electricity", "weight": 0.25},
    {"name": "Magnetism", "weight": 0.25},
    {"name": "Optics", "weight": 0.25}
  ]'::jsonb,
  '[
    {"day": "Monday", "time": "1:00 PM - 2:15 PM", "room": "P-101"},
    {"day": "Wednesday", "time": "1:00 PM - 2:15 PM", "room": "P-101"}
  ]'::jsonb,
  '[
    {"date": "2024-08-15", "name": "Independence Day"},
    {"date": "2024-10-02", "name": "Gandhi Jayanti"},
    {"date": "2024-12-25", "name": "Christmas"}
  ]'::jsonb,
  'theory', 1, '2024-25', true),

('phy201', 'Advanced Physics', 'PHY201', 'teacher-3', ARRAY['c11a'], 
  '[
    {"name": "Quantum Mechanics", "weight": 0.25},
    {"name": "Thermodynamics", "weight": 0.25},
    {"name": "Relativity", "weight": 0.25},
    {"name": "Nuclear Physics", "weight": 0.25}
  ]'::jsonb,
  '[
    {"day": "Tuesday", "time": "1:00 PM - 2:15 PM", "room": "P-102"},
    {"day": "Thursday", "time": "1:00 PM - 2:15 PM", "room": "P-102"}
  ]'::jsonb,
  '[
    {"date": "2024-08-15", "name": "Independence Day"},
    {"date": "2024-10-02", "name": "Gandhi Jayanti"},
    {"date": "2024-12-25", "name": "Christmas"}
  ]'::jsonb,
  'theory', 1, '2024-25', true);

-- Insert assessments
INSERT INTO assessments (id, course_id, name, type, total_marks, weightage, due_date, subtopics_covered, status) VALUES
-- Computer Science assessments
('cs101-q1', 'cs101', 'Programming Basics Quiz', 'quiz', 20, 0.1, '2024-04-10', '["Programming Basics"]', 'completed'),
('cs101-a1', 'cs101', 'Data Structures Assignment', 'assignment', 50, 0.2, '2024-04-20', '["Data Structures"]', 'completed'),
('cs101-m1', 'cs101', 'Midterm Examination', 'midterm', 100, 0.3, '2024-05-15', '["Programming Basics", "Data Structures", "Algorithms"]', 'completed'),
('cs101-q2', 'cs101', 'OOP Quiz', 'quiz', 20, 0.1, '2024-06-10', '["Object-Oriented Programming"]', 'published'),
('cs101-f1', 'cs101', 'Final Examination', 'final', 100, 0.3, '2024-07-15', '["Programming Basics", "Data Structures", "Algorithms", "Object-Oriented Programming"]', 'draft'),

('cs102-q1', 'cs102', 'Neural Networks Quiz', 'quiz', 20, 0.1, '2024-04-12', '["Neural Networks"]', 'completed'),
('cs102-a1', 'cs102', 'Machine Learning Project', 'assignment', 50, 0.2, '2024-04-25', '["Machine Learning"]', 'completed'),
('cs102-m1', 'cs102', 'Midterm Examination', 'midterm', 100, 0.3, '2024-05-18', '["Neural Networks", "Machine Learning", "Web Development"]', 'completed'),
('cs102-q2', 'cs102', 'Database Systems Quiz', 'quiz', 20, 0.1, '2024-06-12', '["Database Systems"]', 'published'),
('cs102-f1', 'cs102', 'Final Examination', 'final', 100, 0.3, '2024-07-18', '["Neural Networks", "Machine Learning", "Web Development", "Database Systems"]', 'draft'),

-- Mathematics assessments
('math101-q1', 'math101', 'Algebra Quiz', 'quiz', 20, 0.1, '2024-04-08', '["Algebra"]', 'completed'),
('math101-a1', 'math101', 'Calculus Assignment', 'assignment', 50, 0.2, '2024-04-18', '["Calculus"]', 'completed'),
('math101-m1', 'math101', 'Midterm Examination', 'midterm', 100, 0.3, '2024-05-12', '["Algebra", "Calculus", "Geometry"]', 'completed'),
('math101-q2', 'math101', 'Trigonometry Quiz', 'quiz', 20, 0.1, '2024-06-08', '["Trigonometry"]', 'published'),
('math101-f1', 'math101', 'Final Examination', 'final', 100, 0.3, '2024-07-12', '["Algebra", "Calculus", "Geometry", "Trigonometry"]', 'draft'),

-- Physics assessments
('phy101-q1', 'phy101', 'Mechanics Quiz', 'quiz', 20, 0.1, '2024-04-09', '["Mechanics"]', 'completed'),
('phy101-a1', 'phy101', 'Electricity Assignment', 'assignment', 50, 0.2, '2024-04-19', '["Electricity"]', 'completed'),
('phy101-m1', 'phy101', 'Midterm Examination', 'midterm', 100, 0.3, '2024-05-14', '["Mechanics", "Electricity", "Magnetism"]', 'completed'),
('phy101-q2', 'phy101', 'Optics Quiz', 'quiz', 20, 0.1, '2024-06-09', '["Optics"]', 'published'),
('phy101-f1', 'phy101', 'Final Examination', 'final', 100, 0.3, '2024-07-14', '["Mechanics", "Electricity", "Magnetism", "Optics"]', 'draft');

-- Insert grades with subtopic performance data
INSERT INTO grades (student_id, assessment_id, score, max_score, percentile, subtopic_performance, feedback) VALUES
-- Ritik's grades (CS101)
('student-1', 'cs101-q1', 18, 20, 90, '{"Programming Basics": 90}', 'Excellent understanding of programming concepts.'),
('student-1', 'cs101-a1', 45, 50, 92, '{"Data Structures": 90}', 'Great implementation of data structures.'),
('student-1', 'cs101-m1', 92, 100, 95, '{"Programming Basics": 92, "Data Structures": 90, "Algorithms": 94}', 'Outstanding performance across all topics.'),

-- Ritik's grades (MATH101)
('student-1', 'math101-q1', 16, 20, 85, '{"Algebra": 80}', 'Good understanding of algebraic concepts.'),
('student-1', 'math101-a1', 42, 50, 88, '{"Calculus": 84}', 'Well-done on the calculus problems.'),
('student-1', 'math101-m1', 85, 100, 90, '{"Algebra": 80, "Calculus": 84, "Geometry": 90}', 'Strong performance, especially in geometry.'),

-- Ritik's grades (PHY101)
('student-1', 'phy101-q1', 14, 20, 75, '{"Mechanics": 70}', 'Need to improve understanding of force concepts.'),
('student-1', 'phy101-a1', 38, 50, 78, '{"Electricity": 76}', 'Good effort, but review circuit analysis.'),
('student-1', 'phy101-m1', 78, 100, 80, '{"Mechanics": 70, "Electricity": 76, "Magnetism": 85}', 'Showing improvement in magnetism concepts.'),

-- Alex's grades (CS101)
('student-2', 'cs101-q1', 15, 20, 80, '{"Programming Basics": 75}', 'Good understanding, but review loop concepts.'),
('student-2', 'cs101-a1', 40, 50, 85, '{"Data Structures": 80}', 'Well-implemented data structures.'),
('student-2', 'cs101-m1', 82, 100, 85, '{"Programming Basics": 75, "Data Structures": 80, "Algorithms": 88}', 'Strong performance in algorithms.'),

-- Sarah's grades (CS101)
('student-3', 'cs101-q1', 19, 20, 95, '{"Programming Basics": 95}', 'Exceptional understanding of programming concepts.'),
('student-3', 'cs101-a1', 48, 50, 96, '{"Data Structures": 96}', 'Outstanding implementation of data structures.'),
('student-3', 'cs101-m1', 96, 100, 98, '{"Programming Basics": 95, "Data Structures": 96, "Algorithms": 97}', 'Excellent performance across all topics.'),

-- Add more grades for other students and courses
('student-4', 'cs101-q1', 14, 20, 70, '{"Programming Basics": 70}', 'Needs improvement in programming concepts.'),
('student-5', 'cs101-q1', 16, 20, 85, '{"Programming Basics": 80}', 'Good understanding of programming basics.'),
('student-6', 'cs102-q1', 19, 20, 95, '{"Neural Networks": 95}', 'Excellent understanding of neural networks.'),
('student-7', 'cs102-q1', 17, 20, 85, '{"Neural Networks": 85}', 'Good grasp of neural network concepts.'),
('student-8', 'cs102-q1', 15, 20, 75, '{"Neural Networks": 75}', 'Needs to review activation functions.'),
('student-9', 'math101-q1', 18, 20, 90, '{"Algebra": 90}', 'Excellent algebraic problem-solving.'),
('student-10', 'math101-q1', 15, 20, 75, '{"Algebra": 75}', 'Good effort, review quadratic equations.');

-- Insert attendance records
INSERT INTO attendance (student_id, course_id, date, status, notes, marked_by) VALUES
-- Ritik's attendance (CS101)
('student-1', 'cs101', '2024-04-01', 'present', NULL, 'teacher-1'),
('student-1', 'cs101', '2024-04-03', 'present', NULL, 'teacher-1'),
('student-1', 'cs101', '2024-04-08', 'present', NULL, 'teacher-1'),
('student-1', 'cs101', '2024-04-10', 'present', NULL, 'teacher-1'),
('student-1', 'cs101', '2024-04-15', 'absent', 'Sick leave', 'teacher-1'),
('student-1', 'cs101', '2024-04-17', 'present', NULL, 'teacher-1'),
('student-1', 'cs101', '2024-04-22', 'present', NULL, 'teacher-1'),
('student-1', 'cs101', '2024-04-24', 'present', NULL, 'teacher-1'),
('student-1', 'cs101', '2024-04-29', 'present', NULL, 'teacher-1'),

-- Ritik's attendance (MATH101)
('student-1', 'math101', '2024-04-01', 'present', NULL, 'teacher-2'),
('student-1', 'math101', '2024-04-03', 'present', NULL, 'teacher-2'),
('student-1', 'math101', '2024-04-08', 'present', NULL, 'teacher-2'),
('student-1', 'math101', '2024-04-10', 'late', 'Arrived 10 minutes late', 'teacher-2'),
('student-1', 'math101', '2024-04-15', 'absent', 'Sick leave', 'teacher-2'),
('student-1', 'math101', '2024-04-17', 'present', NULL, 'teacher-2'),
('student-1', 'math101', '2024-04-22', 'present', NULL, 'teacher-2'),
('student-1', 'math101', '2024-04-24', 'present', NULL, 'teacher-2'),
('student-1', 'math101', '2024-04-29', 'present', NULL, 'teacher-2'),

-- Ritik's attendance (PHY101)
('student-1', 'phy101', '2024-04-01', 'present', NULL, 'teacher-3'),
('student-1', 'phy101', '2024-04-03', 'absent', 'No reason provided', 'teacher-3'),
('student-1', 'phy101', '2024-04-08', 'present', NULL, 'teacher-3'),
('student-1', 'phy101', '2024-04-10', 'present', NULL, 'teacher-3'),
('student-1', 'phy101', '2024-04-15', 'absent', 'Sick leave', 'teacher-3'),
('student-1', 'phy101', '2024-04-17', 'present', NULL, 'teacher-3'),
('student-1', 'phy101', '2024-04-22', 'late', 'Arrived 5 minutes late', 'teacher-3'),
('student-1', 'phy101', '2024-04-24', 'present', NULL, 'teacher-3'),
('student-1', 'phy101', '2024-04-29', 'absent', 'Family emergency', 'teacher-3'),

-- Add attendance for other students
('student-2', 'cs101', '2024-04-01', 'present', NULL, 'teacher-1'),
('student-2', 'cs101', '2024-04-03', 'present', NULL, 'teacher-1'),
('student-3', 'cs101', '2024-04-01', 'present', NULL, 'teacher-1'),
('student-3', 'cs101', '2024-04-03', 'present', NULL, 'teacher-1'),
('student-4', 'cs101', '2024-04-01', 'absent', 'No reason provided', 'teacher-1'),
('student-4', 'cs101', '2024-04-03', 'present', NULL, 'teacher-1'),
('student-5', 'cs101', '2024-04-01', 'present', NULL, 'teacher-1'),
('student-5', 'cs101', '2024-04-03', 'late', 'Arrived 15 minutes late', 'teacher-1');

-- Insert messages
INSERT INTO messages (sender_id, recipient_id, subject, content, priority, message_type, is_read, created_at) VALUES
-- Messages to Ritik
('teacher-1', 'student-1', 'Upcoming Neural Networks Quiz', 'Please be prepared for the upcoming quiz on neural networks. Focus on activation functions and gradient descent.', 'high', 'reminder', false, NOW() - INTERVAL '2 hours'),
('teacher-2', 'student-1', 'Office Hours Extension', 'Office hours extended today until 5 PM for Linear Algebra consultation.', 'normal', 'announcement', true, NOW() - INTERVAL '4 hours'),
('teacher-3', 'student-1', 'Physics Attendance Concern', 'I noticed you have missed several physics classes. Please ensure you maintain at least 75% attendance to be eligible for the final examination.', 'high', 'alert', false, NOW() - INTERVAL '1 day'),
('admin-1', 'student-1', 'School Function Announcement', 'Annual Day celebrations will be held on July 15th. All students are required to participate.', 'normal', 'announcement', true, NOW() - INTERVAL '2 days'),

-- Messages to other students
('teacher-1', 'student-2', 'Programming Assignment Feedback', 'Great job on your recent assignment. I particularly liked your implementation of the sorting algorithm.', 'normal', 'direct', false, NOW() - INTERVAL '3 hours'),
('teacher-1', 'student-3', 'Exceptional Performance', 'Congratulations on your outstanding performance in the midterm examination. Keep up the good work!', 'normal', 'direct', true, NOW() - INTERVAL '1 day'),
('teacher-2', 'student-4', 'Mathematics Improvement Plan', 'Based on your recent performance, I recommend focusing more on algebra and calculus. Let me know if you need additional help.', 'high', 'direct', false, NOW() - INTERVAL '5 hours'),

-- Group messages
('teacher-1', NULL, 'End of Term Project', 'The end of term project details have been uploaded to the resources section. Please review and start working on it.', 'high', 'announcement', false, NOW() - INTERVAL '6 hours'),
('admin-1', NULL, 'Parent-Teacher Meeting', 'Parent-Teacher meeting is scheduled for July 5th. Please inform your parents.', 'high', 'announcement', false, NOW() - INTERVAL '3 days');

-- Insert resources
INSERT INTO resources (course_id, name, description, file_path, file_size, file_type, resource_type, uploaded_by, is_public, download_count) VALUES
-- CS101 resources
('cs101', 'Programming Basics Lecture Notes', 'Comprehensive notes covering variables, loops, and conditionals', 'cs101/programming_basics.pdf', 1024000, 'application/pdf', 'material', 'teacher-1', true, 45),
('cs101', 'Data Structures Assignment', 'Implement a binary search tree with insert, delete, and search operations', 'cs101/data_structures_assignment.pdf', 512000, 'application/pdf', 'assignment', 'teacher-1', true, 38),
('cs101', 'Algorithms Cheat Sheet', 'Quick reference for common algorithms and their complexities', 'cs101/algorithms_cheatsheet.pdf', 256000, 'application/pdf', 'reference', 'teacher-1', true, 62),
('cs101', 'OOP Concepts Video', 'Video lecture explaining object-oriented programming principles', 'cs101/oop_video.mp4', 15000000, 'video/mp4', 'video', 'teacher-1', true, 29),

-- MATH101 resources
('math101', 'Calculus Fundamentals', 'Introduction to limits, derivatives, and integrals', 'math101/calculus_fundamentals.pdf', 1024000, 'application/pdf', 'material', 'teacher-2', true, 52),
('math101', 'Algebra Practice Problems', 'Collection of practice problems for algebraic equations', 'math101/algebra_practice.pdf', 512000, 'application/pdf', 'material', 'teacher-2', true, 48),
('math101', 'Trigonometry Assignment', 'Solve problems related to trigonometric functions and identities', 'math101/trigonometry_assignment.pdf', 384000, 'application/pdf', 'assignment', 'teacher-2', true, 35),

-- PHY101 resources
('phy101', 'Mechanics Lecture Notes', 'Comprehensive notes on Newtonian mechanics', 'phy101/mechanics_notes.pdf', 1024000, 'application/pdf', 'material', 'teacher-3', true, 40),
('phy101', 'Electricity and Magnetism Slides', 'Presentation slides covering electric and magnetic fields', 'phy101/em_slides.pptx', 5120000, 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'material', 'teacher-3', true, 38),
('phy101', 'Optics Lab Report Template', 'Template for writing lab reports on optics experiments', 'phy101/optics_lab_template.docx', 256000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'assignment', 'teacher-3', true, 32);

-- Insert extracurricular activities
INSERT INTO extracurricular (user_id, type, description, date, impact) VALUES
('student-1', 'extracurricular', 'Participated in the National Coding Competition', '2024-03-15', 90),
('student-1', 'extracurricular', 'Organized a workshop on AI for juniors', '2024-04-10', 85),
('student-1', 'disciplinary', 'Late submission of assignment', '2024-02-20', -10),

('student-2', 'extracurricular', 'Won first prize in Science Exhibition', '2024-03-20', 95),
('student-2', 'extracurricular', 'Volunteer for community service', '2024-04-05', 80),

('student-3', 'extracurricular', 'Captain of the school debate team', '2024-03-01', 90),
('student-3', 'extracurricular', 'Represented school in Mathematics Olympiad', '2024-04-15', 95);

-- Insert conversations with AI
INSERT INTO conversations (user_id, message, response, timestamp) VALUES
('student-1', 'How can I improve my physics grades?', 'Based on your performance data, I recommend focusing on mechanics concepts, particularly force and motion. Spend at least 2 hours daily reviewing these topics and solving practice problems. Also, consider joining the physics study group that meets on Thursdays.', NOW() - INTERVAL '2 days'),
('student-1', 'What topics should I focus on for the upcoming CS quiz?', 'For the upcoming Neural Networks quiz, focus on activation functions (particularly ReLU, Sigmoid, and Tanh), backpropagation algorithm, and gradient descent optimization. Your previous assessments show you''re strong in neural network architecture but could improve on optimization techniques.', NOW() - INTERVAL '1 day'),

('student-2', 'Can you help me create a study plan for mathematics?', 'Based on your performance, I recommend focusing on algebra and calculus. Spend 1 hour daily on practice problems, particularly on quadratic equations and limits. Your strengths in physics can help you understand the applications of these mathematical concepts.', NOW() - INTERVAL '3 days'),

('student-3', 'What are my chances of getting an A in Computer Science?', 'Based on your current performance (96% average), you have an excellent chance of achieving an A grade. To maintain this, continue your strong performance in the upcoming OOP quiz and final examination. Your understanding of algorithms and data structures is exceptional.', NOW() - INTERVAL '4 days');