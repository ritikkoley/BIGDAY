/*
  # Seed Initial Data

  1. Create sample groups (classes and departments)
  2. Create sample users with different roles
  3. Create sample courses
  4. Create sample assessments

  Note: This is for development/demo purposes
*/

-- Insert sample groups
INSERT INTO groups (id, name, type, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Class 10A', 'class', 'Grade 10 Section A'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Class 10B', 'class', 'Grade 10 Section B'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Class 11A', 'class', 'Grade 11 Section A'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Mathematics Department', 'department', 'Mathematics Faculty'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Computer Science Department', 'department', 'Computer Science Faculty'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Physics Department', 'department', 'Physics Faculty')
ON CONFLICT (id) DO NOTHING;

-- Insert sample users (Note: These will be created when users sign up via auth)
-- This is just for reference - actual users are created via the auth trigger

-- Insert sample courses
INSERT INTO courses (id, name, code, teacher_id, group_ids, subtopics, type, semester, academic_year) VALUES
  (
    '660e8400-e29b-41d4-a716-446655440001',
    'Mathematics',
    'MATH101',
    (SELECT id FROM users WHERE role = 'teacher' LIMIT 1),
    ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'],
    '[
      {"name": "Algebra", "description": "Linear equations and quadratic functions"},
      {"name": "Calculus", "description": "Derivatives and integrals"},
      {"name": "Geometry", "description": "Coordinate geometry and trigonometry"},
      {"name": "Statistics", "description": "Probability and data analysis"}
    ]'::jsonb,
    'theory',
    1,
    '2024-25'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    'Computer Science',
    'CS101',
    (SELECT id FROM users WHERE role = 'teacher' LIMIT 1),
    ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'],
    '[
      {"name": "Programming Fundamentals", "description": "Variables, loops, and functions"},
      {"name": "Data Structures", "description": "Arrays, lists, and trees"},
      {"name": "Algorithms", "description": "Sorting and searching algorithms"},
      {"name": "Object-Oriented Programming", "description": "Classes and inheritance"}
    ]'::jsonb,
    'theory',
    1,
    '2024-25'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440003',
    'Physics',
    'PHY101',
    (SELECT id FROM users WHERE role = 'teacher' LIMIT 1),
    ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'],
    '[
      {"name": "Mechanics", "description": "Motion, force, and energy"},
      {"name": "Electricity", "description": "Current, voltage, and circuits"},
      {"name": "Waves", "description": "Sound and light waves"},
      {"name": "Modern Physics", "description": "Quantum mechanics basics"}
    ]'::jsonb,
    'theory',
    1,
    '2024-25'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample assessments
INSERT INTO assessments (id, course_id, name, type, weightage, total_marks, subtopics_covered, due_date, instructions, status) VALUES
  (
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    'Algebra Quiz',
    'quiz',
    0.15,
    20,
    '["Algebra"]'::jsonb,
    '2024-04-15 14:30:00',
    'Complete all questions within 30 minutes. Show your work for partial credit.',
    'published'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440001',
    'Midterm Examination',
    'midterm',
    0.30,
    100,
    '["Algebra", "Calculus"]'::jsonb,
    '2024-04-20 10:00:00',
    'Comprehensive exam covering first half of semester. Calculators allowed.',
    'published'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440002',
    'Programming Assignment 1',
    'assignment',
    0.20,
    50,
    '["Programming Fundamentals"]'::jsonb,
    '2024-04-18 23:59:00',
    'Implement the specified algorithms in Python. Submit source code and documentation.',
    'published'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440004',
    '660e8400-e29b-41d4-a716-446655440003',
    'Mechanics Lab Report',
    'assignment',
    0.25,
    30,
    '["Mechanics"]'::jsonb,
    '2024-04-22 17:00:00',
    'Submit lab report with observations, calculations, and conclusions.',
    'published'
  )
ON CONFLICT (id) DO NOTHING;