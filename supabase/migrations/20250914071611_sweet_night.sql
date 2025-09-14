/*
  # HPC Demo Data Insertion

  This migration inserts comprehensive demo data for the Holistic Progress Card (HPC) system.
  
  ## Data Overview:
  - 5 demo students across grades 5, 6, 7, 8, 10
  - 3 specialized teachers (Math/Science, Languages, Arts/PE)
  - 5 parent profiles linked to students
  - 6 CBSE-compliant HPC parameters
  - 15 detailed rubrics (5 levels per parameter sample)
  - 12 multi-stakeholder evaluations
  - 3 compiled draft reports
  - 3 evaluation cycles
  - Analytics and workflow data

  ## Integration:
  - Links with existing user_profiles table
  - Uses existing academic_terms
  - Maintains referential integrity
  - Provides realistic 360° evaluation data
*/

-- Insert demo students into user_profiles
INSERT INTO user_profiles (
  id, full_name, email, role, admission_number, date_of_admission, 
  current_standard, section, accommodation_type, peer_group, status,
  contact_number, parent_guardian_name, parent_contact_number,
  date_of_birth, gender, created_at, updated_at
) VALUES
('hpc-student-001', 'Aarav Sharma', 'aarav.sharma@student.dpsb.edu', 'student', 'DPS2024001', '2024-04-01', '5', 'A', 'day_boarder', 'primary', 'active', '+91-9876543001', 'Mr. Rajesh Sharma', '+91-9876544001', '2014-03-15', 'male', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
('hpc-student-002', 'Saanvi Patel', 'saanvi.patel@student.dpsb.edu', 'student', 'DPS2024002', '2024-04-01', '8', 'B', 'hosteller', 'secondary', 'active', '+91-9876543002', 'Mrs. Priya Patel', '+91-9876544002', '2011-07-22', 'female', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
('hpc-student-003', 'Arjun Verma', 'arjun.verma@student.dpsb.edu', 'student', 'DPS2024003', '2024-04-01', '10', 'A', 'day_boarder', 'secondary', 'active', '+91-9876543003', 'Dr. Amit Verma', '+91-9876544003', '2009-11-08', 'male', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
('hpc-student-004', 'Kavya Singh', 'kavya.singh@student.dpsb.edu', 'student', 'DPS2024004', '2024-04-01', '7', 'A', 'day_boarder', 'secondary', 'active', '+91-9876543004', 'Mrs. Sunita Singh', '+91-9876544004', '2012-05-14', 'female', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
('hpc-student-005', 'Ishaan Kumar', 'ishaan.kumar@student.dpsb.edu', 'student', 'DPS2024005', '2024-04-01', '6', 'B', 'hosteller', 'primary', 'active', '+91-9876543005', 'Mr. Vikash Kumar', '+91-9876544005', '2013-09-03', 'male', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days')
ON CONFLICT (email) DO NOTHING;

-- Insert demo teachers into user_profiles
INSERT INTO user_profiles (
  id, full_name, email, role, employee_id, date_of_joining,
  department, designation, accommodation_type, peer_group, status,
  contact_number, created_at, updated_at
) VALUES
('hpc-teacher-001', 'Dr. Meera Joshi', 'meera.joshi@dpsb.edu', 'teacher', 'DPST001', '2020-06-01', 'Mathematics & Science', 'Senior Teacher', 'day_boarder', 'staff', 'active', '+91-9876545001', NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days'),
('hpc-teacher-002', 'Mr. Rahul Gupta', 'rahul.gupta@dpsb.edu', 'teacher', 'DPST002', '2019-06-01', 'Languages & Social Studies', 'Teacher', 'day_boarder', 'staff', 'active', '+91-9876545002', NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days'),
('hpc-teacher-003', 'Ms. Anjali Reddy', 'anjali.reddy@dpsb.edu', 'teacher', 'DPST003', '2021-06-01', 'Arts & Physical Education', 'Teacher', 'day_boarder', 'staff', 'active', '+91-9876545003', NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days')
ON CONFLICT (email) DO NOTHING;

-- Insert demo parents into user_profiles
INSERT INTO user_profiles (
  id, full_name, email, role, contact_number, status, peer_group,
  profile_data, created_at, updated_at
) VALUES
('hpc-parent-001', 'Mr. Rajesh Sharma', 'rajesh.sharma@parent.dpsb.edu', 'parent', '+91-9876544001', 'active', 'parent', '{"child_id": "hpc-student-001", "relationship": "father", "occupation": "Software Engineer", "education": "B.Tech Computer Science"}', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
('hpc-parent-002', 'Mrs. Priya Patel', 'priya.patel@parent.dpsb.edu', 'parent', '+91-9876544002', 'active', 'parent', '{"child_id": "hpc-student-002", "relationship": "mother", "occupation": "Doctor", "education": "MBBS"}', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
('hpc-parent-003', 'Dr. Amit Verma', 'amit.verma@parent.dpsb.edu', 'parent', '+91-9876544003', 'active', 'parent', '{"child_id": "hpc-student-003", "relationship": "father", "occupation": "Research Scientist", "education": "PhD Physics"}', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
('hpc-parent-004', 'Mrs. Sunita Singh', 'sunita.singh@parent.dpsb.edu', 'parent', '+91-9876544004', 'active', 'parent', '{"child_id": "hpc-student-004", "relationship": "mother", "occupation": "Teacher", "education": "M.Ed"}', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
('hpc-parent-005', 'Mr. Vikash Kumar', 'vikash.kumar@parent.dpsb.edu', 'parent', '+91-9876544005', 'active', 'parent', '{"child_id": "hpc-student-005", "relationship": "father", "occupation": "Business Owner", "education": "MBA"}', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days')
ON CONFLICT (email) DO NOTHING;

-- Insert HPC Parameters
INSERT INTO hpc_parameters (
  id, name, category, sub_category, weightage, description, 
  cbse_code, grade_applicability, evaluation_frequency, active
) VALUES
('hpc-param-001', 'Mathematics', 'scholastic', 'core_subject', 0.20, 'Mathematical reasoning, problem-solving, and computational skills', 'MATH', '["5","6","7","8","9","10"]', 'continuous', true),
('hpc-param-002', 'Creativity & Innovation', 'co_scholastic', 'arts_creativity', 0.15, 'Creative thinking, artistic expression, and innovative problem-solving', 'CREAT', '["5","6","7","8","9","10"]', 'periodic', true),
('hpc-param-003', 'Teamwork & Collaboration', 'life_skills', 'social_skills', 0.12, 'Ability to work effectively in teams and collaborate with peers', 'TEAM', '["5","6","7","8","9","10"]', 'continuous', true),
('hpc-param-004', 'Empathy & Compassion', 'life_skills', 'emotional_intelligence', 0.10, 'Understanding others'' feelings and showing care and concern', 'EMPATH', '["5","6","7","8","9","10"]', 'periodic', true),
('hpc-param-005', 'Physical Fitness & Health', 'co_scholastic', 'health_physical', 0.08, 'Physical fitness, health awareness, and sports participation', 'PHYS', '["5","6","7","8","9","10"]', 'continuous', true),
('hpc-param-006', 'Discipline & Responsibility', 'discipline', 'behavioral', 0.10, 'Self-discipline, responsibility, and adherence to school values', 'DISC', '["5","6","7","8","9","10"]', 'continuous', true);

-- Insert HPC Rubrics (Sample for Mathematics, Creativity, Teamwork)
INSERT INTO hpc_rubrics (
  id, parameter_id, level, grade_equivalent, descriptor, 
  detailed_description, examples, indicators, version, active
) VALUES
-- Mathematics Rubrics
('rubric-math-001', 'hpc-param-001', 'A+', 'outstanding', 'Exceptional mathematical understanding and problem-solving ability', 'Demonstrates exceptional mathematical reasoning, solves complex problems independently, and shows deep conceptual understanding', '["Solves multi-step problems creatively", "Explains mathematical concepts clearly to peers", "Makes connections between different mathematical topics"]', '["95-100% accuracy in assessments", "Helps other students", "Shows mathematical creativity"]', 1, true),
('rubric-math-002', 'hpc-param-001', 'A', 'excellent', 'Strong mathematical skills with good problem-solving ability', 'Shows solid mathematical understanding, solves problems systematically, and demonstrates good conceptual grasp', '["Solves standard problems accurately", "Shows clear working", "Understands mathematical concepts well"]', '["85-94% accuracy in assessments", "Consistent performance", "Good mathematical reasoning"]', 1, true),
('rubric-math-003', 'hpc-param-001', 'B', 'good', 'Satisfactory mathematical understanding with some support needed', 'Demonstrates basic mathematical skills, solves routine problems, but needs guidance for complex tasks', '["Solves basic problems correctly", "Follows standard procedures", "Needs help with word problems"]', '["70-84% accuracy in assessments", "Requires occasional support", "Improving gradually"]', 1, true),
('rubric-math-004', 'hpc-param-001', 'C', 'satisfactory', 'Basic mathematical skills with regular support required', 'Shows elementary mathematical understanding, struggles with problem-solving, needs regular guidance', '["Solves simple problems with help", "Makes computational errors", "Difficulty with concepts"]', '["55-69% accuracy in assessments", "Needs regular support", "Slow progress"]', 1, true),
('rubric-math-005', 'hpc-param-001', 'D', 'needs_improvement', 'Significant mathematical difficulties requiring intensive support', 'Shows limited mathematical understanding, requires extensive support and intervention', '["Struggles with basic operations", "Cannot solve problems independently", "Lacks foundational concepts"]', '["Below 55% accuracy", "Requires intensive support", "Needs remedial intervention"]', 1, true),

-- Creativity Rubrics
('rubric-creat-001', 'hpc-param-002', 'A+', 'outstanding', 'Exceptional creativity and innovative thinking', 'Demonstrates outstanding originality, generates unique ideas, and shows exceptional creative expression', '["Creates original artworks", "Suggests innovative solutions", "Thinks outside the box consistently"]', '["Highly original work", "Inspires others", "Shows artistic flair"]', 1, true),
('rubric-creat-002', 'hpc-param-002', 'A', 'excellent', 'Strong creative abilities with good innovative thinking', 'Shows good creativity, generates interesting ideas, and demonstrates artistic potential', '["Creates good quality artwork", "Offers creative suggestions", "Shows imagination in projects"]', '["Good quality creative work", "Shows initiative", "Demonstrates artistic skills"]', 1, true),
('rubric-creat-003', 'hpc-param-002', 'B', 'good', 'Satisfactory creativity with developing innovative skills', 'Demonstrates basic creativity, follows creative processes, but needs encouragement for innovation', '["Completes creative tasks adequately", "Shows some original thinking", "Participates in creative activities"]', '["Adequate creative output", "Needs encouragement", "Shows potential"]', 1, true),
('rubric-creat-004', 'hpc-param-002', 'C', 'satisfactory', 'Limited creativity requiring support and encouragement', 'Shows minimal creative expression, relies on templates, needs significant support for creative tasks', '["Copies existing ideas", "Reluctant to try new approaches", "Needs step-by-step guidance"]', '["Limited original work", "Requires constant support", "Hesitant to express creativity"]', 1, true),
('rubric-creat-005', 'hpc-param-002', 'D', 'needs_improvement', 'Significant creative challenges requiring intensive intervention', 'Shows very limited creative expression, avoids creative tasks, needs intensive support and intervention', '["Avoids creative activities", "Cannot generate original ideas", "Extremely dependent on others"]', '["Minimal creative output", "Avoids participation", "Needs intensive intervention"]', 1, true),

-- Teamwork Rubrics
('rubric-team-001', 'hpc-param-003', 'A+', 'outstanding', 'Exceptional teamwork and leadership abilities', 'Demonstrates outstanding collaboration skills, leads teams effectively, and facilitates group success', '["Natural team leader", "Helps resolve conflicts", "Ensures everyone participates"]', '["Leads by example", "Excellent communication", "Builds team spirit"]', 1, true),
('rubric-team-002', 'hpc-param-003', 'A', 'excellent', 'Strong teamwork skills with good collaborative abilities', 'Works well in teams, contributes effectively, and supports team goals', '["Active team participant", "Shares ideas freely", "Supports team decisions"]', '["Consistent contribution", "Good listener", "Reliable team member"]', 1, true),
('rubric-team-003', 'hpc-param-003', 'B', 'good', 'Satisfactory teamwork with developing collaborative skills', 'Participates in team activities, follows team decisions, but needs encouragement to contribute actively', '["Follows team instructions", "Participates when encouraged", "Works well with familiar peers"]', '["Adequate participation", "Needs encouragement", "Shows improvement"]', 1, true),
('rubric-team-004', 'hpc-param-003', 'C', 'satisfactory', 'Limited teamwork skills requiring support', 'Shows minimal team participation, prefers individual work, needs support for collaboration', '["Reluctant team participant", "Prefers working alone", "Needs constant guidance"]', '["Minimal contribution", "Avoids group work", "Requires support"]', 1, true),
('rubric-team-005', 'hpc-param-003', 'D', 'needs_improvement', 'Significant teamwork challenges requiring intensive intervention', 'Avoids team activities, disrupts group work, needs intensive social skills intervention', '["Disrupts team activities", "Refuses to participate", "Creates conflicts"]', '["Disruptive behavior", "Avoids collaboration", "Needs intensive support"]', 1, true);

-- Insert Parameter Assignments (Who evaluates what)
INSERT INTO hpc_parameter_assignments (
  id, parameter_id, evaluator_role, is_required, weightage, 
  evaluation_frequency, created_at
) VALUES
-- Mathematics
('assign-001', 'hpc-param-001', 'teacher', true, 0.70, 'continuous', NOW() - INTERVAL '30 days'),
('assign-002', 'hpc-param-001', 'parent', true, 0.20, 'periodic', NOW() - INTERVAL '30 days'),
('assign-003', 'hpc-param-001', 'self', true, 0.10, 'periodic', NOW() - INTERVAL '30 days'),

-- Creativity
('assign-004', 'hpc-param-002', 'teacher', true, 0.60, 'continuous', NOW() - INTERVAL '30 days'),
('assign-005', 'hpc-param-002', 'peer', true, 0.25, 'periodic', NOW() - INTERVAL '30 days'),
('assign-006', 'hpc-param-002', 'self', true, 0.15, 'periodic', NOW() - INTERVAL '30 days'),

-- Teamwork
('assign-007', 'hpc-param-003', 'teacher', true, 0.50, 'continuous', NOW() - INTERVAL '30 days'),
('assign-008', 'hpc-param-003', 'peer', true, 0.30, 'continuous', NOW() - INTERVAL '30 days'),
('assign-009', 'hpc-param-003', 'parent', false, 0.10, 'periodic', NOW() - INTERVAL '30 days'),
('assign-010', 'hpc-param-003', 'self', true, 0.10, 'periodic', NOW() - INTERVAL '30 days'),

-- Empathy
('assign-011', 'hpc-param-004', 'teacher', true, 0.40, 'continuous', NOW() - INTERVAL '30 days'),
('assign-012', 'hpc-param-004', 'parent', true, 0.35, 'periodic', NOW() - INTERVAL '30 days'),
('assign-013', 'hpc-param-004', 'peer', true, 0.25, 'continuous', NOW() - INTERVAL '30 days'),

-- Physical Fitness
('assign-014', 'hpc-param-005', 'teacher', true, 0.80, 'continuous', NOW() - INTERVAL '30 days'),
('assign-015', 'hpc-param-005', 'parent', false, 0.20, 'periodic', NOW() - INTERVAL '30 days'),

-- Discipline
('assign-016', 'hpc-param-006', 'teacher', true, 0.60, 'continuous', NOW() - INTERVAL '30 days'),
('assign-017', 'hpc-param-006', 'parent', true, 0.40, 'periodic', NOW() - INTERVAL '30 days');

-- Insert Evaluation Cycles
INSERT INTO hpc_evaluation_cycles (
  id, name, term_id, cycle_type, start_date, end_date,
  parameters, evaluator_roles, status, created_at
) VALUES
('cycle-001', 'Term 1 Mid-Term Evaluation', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'mid_term', NOW() - INTERVAL '30 days', NOW() - INTERVAL '15 days', '["hpc-param-001", "hpc-param-002", "hpc-param-003"]', '["teacher", "self"]', 'completed', NOW() - INTERVAL '35 days'),
('cycle-002', 'Term 1 Final Evaluation', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'final', NOW() - INTERVAL '20 days', NOW() - INTERVAL '5 days', '["hpc-param-001", "hpc-param-002", "hpc-param-003", "hpc-param-004", "hpc-param-005", "hpc-param-006"]', '["teacher", "parent", "peer", "self"]', 'completed', NOW() - INTERVAL '25 days'),
('cycle-003', 'Term 2 Continuous Assessment', (SELECT id FROM academic_terms WHERE name = '2025 Term 2' LIMIT 1), 'continuous', NOW() + INTERVAL '10 days', NOW() + INTERVAL '40 days', '["hpc-param-001", "hpc-param-002", "hpc-param-003", "hpc-param-004", "hpc-param-005", "hpc-param-006"]', '["teacher", "parent", "peer", "self"]', 'active', NOW() - INTERVAL '5 days');

-- Insert HPC Evaluations
INSERT INTO hpc_evaluations (
  id, student_id, parameter_id, evaluator_id, evaluator_role, 
  score, grade, qualitative_remark, evidence_notes, confidence_level,
  evaluation_date, term_id, status, created_at
) VALUES
-- Aarav Sharma - Mathematics (Multiple evaluators)
('eval-001', 'hpc-student-001', 'hpc-param-001', 'hpc-teacher-001', 'teacher', 4.2, 'A', 'Aarav shows excellent mathematical reasoning and solves problems creatively. He often helps his classmates understand difficult concepts.', 'Scored 95% in recent assessment, completed bonus problems, peer tutoring observed', 0.95, NOW() - INTERVAL '15 days', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'submitted', NOW() - INTERVAL '15 days'),
('eval-002', 'hpc-student-001', 'hpc-param-001', 'hpc-parent-001', 'parent', 4.0, 'A', 'Aarav enjoys solving math puzzles at home and often explains mathematical concepts to his younger sister.', 'Completes homework independently, shows interest in math competitions', 0.85, NOW() - INTERVAL '10 days', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'submitted', NOW() - INTERVAL '10 days'),
('eval-003', 'hpc-student-001', 'hpc-param-001', 'hpc-student-001', 'self', 3.8, 'A', 'I like mathematics because it''s like solving puzzles. Sometimes the problems are hard but I keep trying until I find the answer.', 'Self-reflection during portfolio review session', 0.75, NOW() - INTERVAL '8 days', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'submitted', NOW() - INTERVAL '8 days'),

-- Aarav Sharma - Creativity
('eval-004', 'hpc-student-001', 'hpc-param-002', 'hpc-teacher-003', 'teacher', 4.5, 'A+', 'Aarav demonstrates exceptional creativity in art projects. His recent sculpture was highly original and showed advanced artistic thinking.', 'Won school art competition, created innovative project design, shows artistic leadership', 0.92, NOW() - INTERVAL '12 days', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'submitted', NOW() - INTERVAL '12 days'),
('eval-005', 'hpc-student-001', 'hpc-param-002', 'hpc-student-002', 'peer', 4.3, 'A+', 'Aarav always comes up with the most interesting ideas during group projects. He thinks of things that nobody else does.', 'Peer evaluation during collaborative art project', 0.80, NOW() - INTERVAL '7 days', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'submitted', NOW() - INTERVAL '7 days'),

-- Aarav Sharma - Teamwork
('eval-006', 'hpc-student-001', 'hpc-param-003', 'hpc-teacher-002', 'teacher', 4.0, 'A', 'Aarav works well in teams and is always willing to help his teammates. He listens to others and contributes meaningfully to group discussions.', 'Observed during group projects, peer feedback positive, takes initiative in team activities', 0.88, NOW() - INTERVAL '14 days', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'submitted', NOW() - INTERVAL '14 days'),

-- Saanvi Patel - Mathematics
('eval-007', 'hpc-student-002', 'hpc-param-001', 'hpc-teacher-001', 'teacher', 3.8, 'A', 'Saanvi has strong mathematical foundations and shows consistent improvement. She approaches problems systematically.', 'Consistent 85-90% scores, good problem-solving approach, helps struggling classmates', 0.90, NOW() - INTERVAL '16 days', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'submitted', NOW() - INTERVAL '16 days'),

-- Saanvi Patel - Empathy
('eval-008', 'hpc-student-002', 'hpc-param-004', 'hpc-teacher-002', 'teacher', 4.7, 'A+', 'Saanvi shows exceptional empathy and compassion. She is always the first to help classmates in need and shows genuine care for others.', 'Comforted upset classmate, organized help for sick student, shows emotional maturity', 0.95, NOW() - INTERVAL '11 days', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'submitted', NOW() - INTERVAL '11 days'),
('eval-009', 'hpc-student-002', 'hpc-param-004', 'hpc-parent-002', 'parent', 4.5, 'A+', 'Saanvi is very caring at home. She takes care of her younger brother and is always concerned about others'' feelings.', 'Helps with household responsibilities, shows care for family members, volunteers for community service', 0.90, NOW() - INTERVAL '9 days', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'submitted', NOW() - INTERVAL '9 days'),

-- Arjun Verma - Physical Fitness
('eval-010', 'hpc-student-003', 'hpc-param-005', 'hpc-teacher-003', 'teacher', 4.4, 'A+', 'Arjun is an outstanding athlete with excellent physical fitness. He leads by example in sports activities and maintains high fitness standards.', 'School football team captain, excellent fitness test scores, promotes healthy lifestyle', 0.98, NOW() - INTERVAL '13 days', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'submitted', NOW() - INTERVAL '13 days'),

-- Kavya Singh - Discipline
('eval-011', 'hpc-student-004', 'hpc-param-006', 'hpc-teacher-002', 'teacher', 4.1, 'A', 'Kavya is highly disciplined and responsible. She follows school rules diligently and sets a good example for her peers.', 'Perfect attendance, always punctual, maintains neat notebooks, follows instructions carefully', 0.93, NOW() - INTERVAL '17 days', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'submitted', NOW() - INTERVAL '17 days'),

-- Ishaan Kumar - Teamwork
('eval-012', 'hpc-student-005', 'hpc-param-003', 'hpc-teacher-001', 'teacher', 3.5, 'B+', 'Ishaan is developing good teamwork skills. He participates actively in group work but sometimes needs encouragement to share his ideas.', 'Good participation in group projects, improving communication skills, shows willingness to help', 0.85, NOW() - INTERVAL '18 days', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'submitted', NOW() - INTERVAL '18 days');

-- Insert HPC Reports (Compiled draft reports)
INSERT INTO hpc_reports (
  id, student_id, term_id, overall_grade, overall_score, summary_json,
  status, compiled_at, compiled_by, version, created_at
) VALUES
('hpc-report-001', 'hpc-student-001', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'A', 4.15, '{
  "student_info": {
    "name": "Aarav Sharma",
    "grade": "5",
    "section": "A",
    "admission_number": "DPS2024001",
    "academic_year": "2024-25"
  },
  "scholastic_performance": {
    "mathematics": {
      "grade": "A",
      "score": 4.2,
      "teacher_remark": "Excellent mathematical reasoning and problem-solving ability",
      "parent_feedback": "Shows strong interest in mathematics at home",
      "self_reflection": "I enjoy solving math puzzles and helping friends"
    }
  },
  "co_scholastic_performance": {
    "creativity": {
      "grade": "A+",
      "score": 4.5,
      "teacher_remark": "Exceptional creativity in art projects",
      "peer_feedback": "Always has the most interesting ideas",
      "evidence": "Won school art competition"
    }
  },
  "life_skills": {
    "teamwork": {
      "grade": "A",
      "score": 4.0,
      "teacher_remark": "Works well in teams and helps teammates",
      "observations": "Natural collaborator, good listener"
    }
  },
  "achievements": [
    "First Prize in School Art Competition",
    "Mathematics Olympiad Qualifier",
    "Class Monitor for Term 1"
  ],
  "areas_of_strength": [
    "Mathematical reasoning and problem-solving",
    "Creative thinking and artistic expression",
    "Leadership and helping others"
  ],
  "areas_for_improvement": [
    "Could participate more in physical activities",
    "Develop presentation skills further"
  ],
  "next_term_goals": [
    "Improve physical fitness scores",
    "Participate in science fair",
    "Take on more leadership responsibilities"
  ]
}', 'draft', NOW() - INTERVAL '5 days', 'hpc-teacher-001', 1, NOW() - INTERVAL '5 days'),

('hpc-report-002', 'hpc-student-002', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'A', 4.25, '{
  "student_info": {
    "name": "Saanvi Patel",
    "grade": "8",
    "section": "B",
    "admission_number": "DPS2024002",
    "academic_year": "2024-25"
  },
  "scholastic_performance": {
    "mathematics": {
      "grade": "A",
      "score": 3.8,
      "teacher_remark": "Strong mathematical foundations with consistent improvement"
    }
  },
  "life_skills": {
    "empathy": {
      "grade": "A+",
      "score": 4.7,
      "teacher_remark": "Shows exceptional empathy and compassion for others",
      "parent_feedback": "Very caring and considerate at home"
    }
  },
  "achievements": [
    "Best Helper Award - Term 1",
    "Yoga Competition - Second Place",
    "Peer Mediator Certificate"
  ],
  "areas_of_strength": [
    "Exceptional empathy and emotional intelligence",
    "Strong academic performance",
    "Health and wellness awareness"
  ]
}', 'draft', NOW() - INTERVAL '4 days', 'hpc-teacher-002', 1, NOW() - INTERVAL '4 days'),

('hpc-report-003', 'hpc-student-003', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'A+', 4.35, '{
  "student_info": {
    "name": "Arjun Verma",
    "grade": "10",
    "section": "A",
    "admission_number": "DPS2024003",
    "academic_year": "2024-25"
  },
  "scholastic_performance": {
    "mathematics": {
      "grade": "A+",
      "score": 4.6,
      "teacher_remark": "Outstanding mathematical ability with advanced problem-solving skills"
    }
  },
  "co_scholastic_performance": {
    "physical_fitness": {
      "grade": "A+",
      "score": 4.4,
      "teacher_remark": "Exceptional athlete and fitness role model"
    }
  },
  "achievements": [
    "Student Council President",
    "State Level Football Championship - Gold Medal",
    "Mathematics Olympiad - National Qualifier",
    "Best Student Leader Award"
  ],
  "areas_of_strength": [
    "Outstanding leadership and organizational skills",
    "Exceptional mathematical and analytical abilities",
    "Superior physical fitness and athletic performance"
  ]
}', 'draft', NOW() - INTERVAL '3 days', 'hpc-teacher-001', 1, NOW() - INTERVAL '3 days');

-- Insert HPC Analytics
INSERT INTO hpc_analytics (
  id, student_id, parameter_id, term_id, class_percentile, grade_percentile,
  school_percentile, growth_trajectory, predicted_next_score, 
  confidence_interval, strengths_identified, improvement_areas, created_at
) VALUES
('analytics-001', 'hpc-student-001', 'hpc-param-001', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 85, 82, 88, 'improving', 4.3, '{"lower": 4.1, "upper": 4.5}', '["problem_solving", "logical_thinking", "peer_teaching"]', '["speed_accuracy", "advanced_concepts"]', NOW() - INTERVAL '5 days'),
('analytics-002', 'hpc-student-002', 'hpc-param-004', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 98, 96, 97, 'stable_high', 4.7, '{"lower": 4.5, "upper": 4.8}', '["emotional_intelligence", "caring_nature", "conflict_resolution"]', '["assertiveness", "self_advocacy"]', NOW() - INTERVAL '5 days'),
('analytics-003', 'hpc-student-003', 'hpc-param-005', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 99, 98, 99, 'stable_high', 4.5, '{"lower": 4.3, "upper": 4.6}', '["athletic_ability", "leadership", "fitness_role_model"]', '["injury_prevention", "coaching_skills"]', NOW() - INTERVAL '5 days');

-- Insert Approval Workflows
INSERT INTO hpc_approval_workflows (
  id, report_id, step_number, approver_role, approver_id,
  status, assigned_at, due_date, created_at
) VALUES
('workflow-001', 'hpc-report-001', 1, 'class_teacher', 'hpc-teacher-001', 'pending', NOW() - INTERVAL '5 days', NOW() + INTERVAL '2 days', NOW() - INTERVAL '5 days'),
('workflow-002', 'hpc-report-001', 2, 'principal', (SELECT id FROM user_profiles WHERE role = 'admin' LIMIT 1), 'pending', NULL, NOW() + INTERVAL '7 days', NOW() - INTERVAL '5 days'),
('workflow-003', 'hpc-report-002', 1, 'class_teacher', 'hpc-teacher-002', 'pending', NOW() - INTERVAL '4 days', NOW() + INTERVAL '3 days', NOW() - INTERVAL '4 days'),
('workflow-004', 'hpc-report-003', 1, 'class_teacher', 'hpc-teacher-001', 'approved', NOW() - INTERVAL '3 days', NOW() + INTERVAL '4 days', NOW() - INTERVAL '3 days');

-- Insert sample achievements
INSERT INTO hpc_achievements (
  id, student_id, title, category, description, date_achieved,
  evidence_url, verified_by, points_awarded, created_at
) VALUES
('achieve-001', 'hpc-student-001', 'First Prize in School Art Competition', 'academic', 'Won first prize in inter-house art competition with innovative sculpture design', NOW() - INTERVAL '20 days', '/evidence/art_competition_certificate.pdf', 'hpc-teacher-003', 10, NOW() - INTERVAL '20 days'),
('achieve-002', 'hpc-student-001', 'Mathematics Olympiad Qualifier', 'academic', 'Qualified for state-level mathematics olympiad', NOW() - INTERVAL '25 days', '/evidence/math_olympiad_certificate.pdf', 'hpc-teacher-001', 15, NOW() - INTERVAL '25 days'),
('achieve-003', 'hpc-student-002', 'Best Helper Award', 'social', 'Recognized for consistently helping classmates and showing exceptional empathy', NOW() - INTERVAL '18 days', '/evidence/helper_award.pdf', 'hpc-teacher-002', 8, NOW() - INTERVAL '18 days'),
('achieve-004', 'hpc-student-003', 'Student Council President', 'leadership', 'Elected as student council president for academic year 2024-25', NOW() - INTERVAL '60 days', '/evidence/election_results.pdf', (SELECT id FROM user_profiles WHERE role = 'admin' LIMIT 1), 20, NOW() - INTERVAL '60 days'),
('achieve-005', 'hpc-student-003', 'State Level Football Gold Medal', 'sports', 'Won gold medal in state-level inter-school football championship', NOW() - INTERVAL '30 days', '/evidence/football_medal.pdf', 'hpc-teacher-003', 25, NOW() - INTERVAL '30 days');

-- Insert sample reflections
INSERT INTO hpc_reflections (
  id, student_id, term_id, reflection_type, content, 
  goals_set, created_at, updated_at
) VALUES
('reflect-001', 'hpc-student-001', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'self_assessment', 'This term I learned a lot about working with others and being creative. I want to get better at sports and help more friends with their studies. I think I am good at math and art but need to practice speaking in front of people.', '["Improve physical fitness", "Help more classmates", "Practice public speaking", "Join science club"]', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
('reflect-002', 'hpc-student-002', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'self_assessment', 'I feel happy when I can help my friends who are sad or worried. This term I learned that being kind is very important. I want to become better at math and also learn to paint beautiful pictures.', '["Improve math problem-solving", "Learn painting techniques", "Help more students", "Join peer counseling program"]', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
('reflect-003', 'hpc-student-003', (SELECT id FROM academic_terms WHERE name = '2025 Term 1' LIMIT 1), 'goal_setting', 'As student council president, I want to make our school better for everyone. I will organize more sports events and help younger students with their studies. My goal is to become an engineer and use technology to solve problems.', '["Organize inter-house sports", "Start peer mentoring program", "Maintain academic excellence", "Explore robotics and coding"]', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

-- Create a view for easy HPC report access
CREATE OR REPLACE VIEW hpc_student_summary AS
SELECT 
  up.id as student_id,
  up.full_name as student_name,
  up.current_standard as grade,
  up.section,
  up.admission_number,
  hr.overall_grade,
  hr.overall_score,
  hr.status as report_status,
  hr.compiled_at,
  COUNT(he.id) as total_evaluations,
  AVG(he.score) as average_evaluation_score
FROM user_profiles up
LEFT JOIN hpc_reports hr ON up.id = hr.student_id
LEFT JOIN hpc_evaluations he ON up.id = he.student_id
WHERE up.role = 'student'
GROUP BY up.id, up.full_name, up.current_standard, up.section, 
         up.admission_number, hr.overall_grade, hr.overall_score, 
         hr.status, hr.compiled_at;

-- Insert demo data validation
DO $$
DECLARE
  validation_result jsonb;
BEGIN
  -- Validate that all demo data was inserted correctly
  SELECT jsonb_build_object(
    'students_inserted', (SELECT COUNT(*) FROM user_profiles WHERE id LIKE 'hpc-student-%'),
    'teachers_inserted', (SELECT COUNT(*) FROM user_profiles WHERE id LIKE 'hpc-teacher-%'),
    'parents_inserted', (SELECT COUNT(*) FROM user_profiles WHERE id LIKE 'hpc-parent-%'),
    'parameters_inserted', (SELECT COUNT(*) FROM hpc_parameters),
    'rubrics_inserted', (SELECT COUNT(*) FROM hpc_rubrics),
    'evaluations_inserted', (SELECT COUNT(*) FROM hpc_evaluations),
    'reports_inserted', (SELECT COUNT(*) FROM hpc_reports),
    'cycles_inserted', (SELECT COUNT(*) FROM hpc_evaluation_cycles),
    'analytics_inserted', (SELECT COUNT(*) FROM hpc_analytics),
    'achievements_inserted', (SELECT COUNT(*) FROM hpc_achievements),
    'reflections_inserted', (SELECT COUNT(*) FROM hpc_reflections)
  ) INTO validation_result;
  
  -- Log the validation result
  RAISE NOTICE 'HPC Demo Data Insertion Summary: %', validation_result;
END $$;