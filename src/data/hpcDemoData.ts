// Demo Data for Holistic Progress Card (HPC) System
// Comprehensive demo data that integrates with existing BIG DAY architecture

import { format } from 'date-fns';

// Helper function to get dates relative to today
const getRelativeDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

// Generate consistent UUIDs for demo data
const generateDemoId = (prefix: string, index: number) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${index}-${random}`;
};

// 1. DEMO STUDENTS (5 students across different grades)
export const demoStudents = [
  {
    id: 'hpc-student-001',
    full_name: 'Aarav Sharma',
    email: 'aarav.sharma@student.dpsb.edu',
    role: 'student',
    admission_number: 'DPS2024001',
    date_of_admission: '2024-04-01',
    current_standard: '5',
    section: 'A',
    accommodation_type: 'day_boarder',
    peer_group: 'primary',
    status: 'active',
    contact_number: '+91-9876543001',
    parent_guardian_name: 'Mr. Rajesh Sharma',
    parent_contact_number: '+91-9876544001',
    date_of_birth: '2014-03-15',
    gender: 'male',
    cohort_info: { grade: '5', stream: 'General', section: 'A' }
  },
  {
    id: 'hpc-student-002',
    full_name: 'Saanvi Patel',
    email: 'saanvi.patel@student.dpsb.edu',
    role: 'student',
    admission_number: 'DPS2024002',
    date_of_admission: '2024-04-01',
    current_standard: '8',
    section: 'B',
    accommodation_type: 'hosteller',
    peer_group: 'secondary',
    status: 'active',
    contact_number: '+91-9876543002',
    parent_guardian_name: 'Mrs. Priya Patel',
    parent_contact_number: '+91-9876544002',
    date_of_birth: '2011-07-22',
    gender: 'female',
    cohort_info: { grade: '8', stream: 'General', section: 'B' }
  },
  {
    id: 'hpc-student-003',
    full_name: 'Arjun Verma',
    email: 'arjun.verma@student.dpsb.edu',
    role: 'student',
    admission_number: 'DPS2024003',
    date_of_admission: '2024-04-01',
    current_standard: '10',
    section: 'A',
    accommodation_type: 'day_boarder',
    peer_group: 'secondary',
    status: 'active',
    contact_number: '+91-9876543003',
    parent_guardian_name: 'Dr. Amit Verma',
    parent_contact_number: '+91-9876544003',
    date_of_birth: '2009-11-08',
    gender: 'male',
    cohort_info: { grade: '10', stream: 'Science', section: 'A' }
  },
  {
    id: 'hpc-student-004',
    full_name: 'Kavya Singh',
    email: 'kavya.singh@student.dpsb.edu',
    role: 'student',
    admission_number: 'DPS2024004',
    date_of_admission: '2024-04-01',
    current_standard: '7',
    section: 'A',
    accommodation_type: 'day_boarder',
    peer_group: 'secondary',
    status: 'active',
    contact_number: '+91-9876543004',
    parent_guardian_name: 'Mrs. Sunita Singh',
    parent_contact_number: '+91-9876544004',
    date_of_birth: '2012-05-14',
    gender: 'female',
    cohort_info: { grade: '7', stream: 'General', section: 'A' }
  },
  {
    id: 'hpc-student-005',
    full_name: 'Ishaan Kumar',
    email: 'ishaan.kumar@student.dpsb.edu',
    role: 'student',
    admission_number: 'DPS2024005',
    date_of_admission: '2024-04-01',
    current_standard: '6',
    section: 'B',
    accommodation_type: 'hosteller',
    peer_group: 'primary',
    status: 'active',
    contact_number: '+91-9876543005',
    parent_guardian_name: 'Mr. Vikash Kumar',
    parent_contact_number: '+91-9876544005',
    date_of_birth: '2013-09-03',
    gender: 'male',
    cohort_info: { grade: '6', stream: 'General', section: 'B' }
  }
];

// 2. DEMO TEACHERS (3 teachers with different specializations)
export const demoTeachers = [
  {
    id: 'hpc-teacher-001',
    full_name: 'Dr. Meera Joshi',
    email: 'meera.joshi@dpsb.edu',
    role: 'teacher',
    employee_id: 'DPST001',
    date_of_joining: '2020-06-01',
    department: 'Mathematics & Science',
    designation: 'Senior Teacher',
    accommodation_type: 'day_boarder',
    peer_group: 'staff',
    status: 'active',
    contact_number: '+91-9876545001',
    specializations: ['Mathematics', 'Science', 'Critical Thinking'],
    grades_taught: ['5', '6', '7', '8'],
    hpc_evaluator_for: ['scholastic', 'life_skills']
  },
  {
    id: 'hpc-teacher-002',
    full_name: 'Mr. Rahul Gupta',
    email: 'rahul.gupta@dpsb.edu',
    role: 'teacher',
    employee_id: 'DPST002',
    date_of_joining: '2019-06-01',
    department: 'Languages & Social Studies',
    designation: 'Teacher',
    accommodation_type: 'day_boarder',
    peer_group: 'staff',
    status: 'active',
    contact_number: '+91-9876545002',
    specializations: ['English', 'Hindi', 'Social Studies', 'Communication'],
    grades_taught: ['7', '8', '9', '10'],
    hpc_evaluator_for: ['scholastic', 'co_scholastic', 'life_skills']
  },
  {
    id: 'hpc-teacher-003',
    full_name: 'Ms. Anjali Reddy',
    email: 'anjali.reddy@dpsb.edu',
    role: 'teacher',
    employee_id: 'DPST003',
    date_of_joining: '2021-06-01',
    department: 'Arts & Physical Education',
    designation: 'Teacher',
    accommodation_type: 'day_boarder',
    peer_group: 'staff',
    status: 'active',
    contact_number: '+91-9876545003',
    specializations: ['Arts', 'Physical Education', 'Health & Wellness', 'Creativity'],
    grades_taught: ['5', '6', '7', '8', '9', '10'],
    hpc_evaluator_for: ['co_scholastic', 'life_skills', 'discipline']
  }
];

// 3. DEMO PARENTS (1 per student)
export const demoParents = [
  {
    id: 'hpc-parent-001',
    full_name: 'Mr. Rajesh Sharma',
    email: 'rajesh.sharma@parent.dpsb.edu',
    role: 'parent',
    contact_number: '+91-9876544001',
    child_id: 'hpc-student-001',
    relationship: 'father',
    occupation: 'Software Engineer',
    education: 'B.Tech Computer Science',
    hpc_evaluator_for: ['life_skills', 'discipline', 'home_environment']
  },
  {
    id: 'hpc-parent-002',
    full_name: 'Mrs. Priya Patel',
    email: 'priya.patel@parent.dpsb.edu',
    role: 'parent',
    contact_number: '+91-9876544002',
    child_id: 'hpc-student-002',
    relationship: 'mother',
    occupation: 'Doctor',
    education: 'MBBS',
    hpc_evaluator_for: ['life_skills', 'discipline', 'health_wellness']
  },
  {
    id: 'hpc-parent-003',
    full_name: 'Dr. Amit Verma',
    email: 'amit.verma@parent.dpsb.edu',
    role: 'parent',
    contact_number: '+91-9876544003',
    child_id: 'hpc-student-003',
    relationship: 'father',
    occupation: 'Research Scientist',
    education: 'PhD Physics',
    hpc_evaluator_for: ['scholastic', 'life_skills', 'critical_thinking']
  },
  {
    id: 'hpc-parent-004',
    full_name: 'Mrs. Sunita Singh',
    email: 'sunita.singh@parent.dpsb.edu',
    role: 'parent',
    contact_number: '+91-9876544004',
    child_id: 'hpc-student-004',
    relationship: 'mother',
    occupation: 'Teacher',
    education: 'M.Ed',
    hpc_evaluator_for: ['scholastic', 'life_skills', 'communication']
  },
  {
    id: 'hpc-parent-005',
    full_name: 'Mr. Vikash Kumar',
    email: 'vikash.kumar@parent.dpsb.edu',
    role: 'parent',
    contact_number: '+91-9876544005',
    child_id: 'hpc-student-005',
    relationship: 'father',
    occupation: 'Business Owner',
    education: 'MBA',
    hpc_evaluator_for: ['life_skills', 'discipline', 'leadership']
  }
];

// 4. HPC PARAMETERS (6 comprehensive parameters covering all CBSE areas)
export const demoHpcParameters = [
  {
    id: 'hpc-param-001',
    name: 'Mathematics',
    category: 'scholastic',
    sub_category: 'core_subject',
    weightage: 0.20,
    description: 'Mathematical reasoning, problem-solving, and computational skills',
    cbse_code: 'MATH',
    grade_applicability: ['5', '6', '7', '8', '9', '10'],
    evaluation_frequency: 'continuous',
    active: true,
    created_at: getRelativeDate(-30)
  },
  {
    id: 'hpc-param-002',
    name: 'Creativity & Innovation',
    category: 'co_scholastic',
    sub_category: 'arts_creativity',
    weightage: 0.15,
    description: 'Creative thinking, artistic expression, and innovative problem-solving',
    cbse_code: 'CREAT',
    grade_applicability: ['5', '6', '7', '8', '9', '10'],
    evaluation_frequency: 'periodic',
    active: true,
    created_at: getRelativeDate(-30)
  },
  {
    id: 'hpc-param-003',
    name: 'Teamwork & Collaboration',
    category: 'life_skills',
    sub_category: 'social_skills',
    weightage: 0.12,
    description: 'Ability to work effectively in teams and collaborate with peers',
    cbse_code: 'TEAM',
    grade_applicability: ['5', '6', '7', '8', '9', '10'],
    evaluation_frequency: 'continuous',
    active: true,
    created_at: getRelativeDate(-30)
  },
  {
    id: 'hpc-param-004',
    name: 'Empathy & Compassion',
    category: 'life_skills',
    sub_category: 'emotional_intelligence',
    weightage: 0.10,
    description: 'Understanding others\' feelings and showing care and concern',
    cbse_code: 'EMPATH',
    grade_applicability: ['5', '6', '7', '8', '9', '10'],
    evaluation_frequency: 'periodic',
    active: true,
    created_at: getRelativeDate(-30)
  },
  {
    id: 'hpc-param-005',
    name: 'Physical Fitness & Health',
    category: 'co_scholastic',
    sub_category: 'health_physical',
    weightage: 0.08,
    description: 'Physical fitness, health awareness, and sports participation',
    cbse_code: 'PHYS',
    grade_applicability: ['5', '6', '7', '8', '9', '10'],
    evaluation_frequency: 'continuous',
    active: true,
    created_at: getRelativeDate(-30)
  },
  {
    id: 'hpc-param-006',
    name: 'Discipline & Responsibility',
    category: 'discipline',
    sub_category: 'behavioral',
    weightage: 0.10,
    description: 'Self-discipline, responsibility, and adherence to school values',
    cbse_code: 'DISC',
    grade_applicability: ['5', '6', '7', '8', '9', '10'],
    evaluation_frequency: 'continuous',
    active: true,
    created_at: getRelativeDate(-30)
  }
];

// 5. HPC RUBRICS (5-level descriptors for each parameter)
export const demoHpcRubrics = [
  // Mathematics Rubrics
  {
    id: 'rubric-math-001',
    parameter_id: 'hpc-param-001',
    level: 'A+',
    grade_equivalent: 'outstanding',
    descriptor: 'Exceptional mathematical understanding and problem-solving ability',
    detailed_description: 'Demonstrates exceptional mathematical reasoning, solves complex problems independently, and shows deep conceptual understanding',
    examples: ['Solves multi-step problems creatively', 'Explains mathematical concepts clearly to peers', 'Makes connections between different mathematical topics'],
    indicators: ['95-100% accuracy in assessments', 'Helps other students', 'Shows mathematical creativity'],
    version: 1,
    active: true
  },
  {
    id: 'rubric-math-002',
    parameter_id: 'hpc-param-001',
    level: 'A',
    grade_equivalent: 'excellent',
    descriptor: 'Strong mathematical skills with good problem-solving ability',
    detailed_description: 'Shows solid mathematical understanding, solves problems systematically, and demonstrates good conceptual grasp',
    examples: ['Solves standard problems accurately', 'Shows clear working', 'Understands mathematical concepts well'],
    indicators: ['85-94% accuracy in assessments', 'Consistent performance', 'Good mathematical reasoning'],
    version: 1,
    active: true
  },
  {
    id: 'rubric-math-003',
    parameter_id: 'hpc-param-001',
    level: 'B',
    grade_equivalent: 'good',
    descriptor: 'Satisfactory mathematical understanding with some support needed',
    detailed_description: 'Demonstrates basic mathematical skills, solves routine problems, but needs guidance for complex tasks',
    examples: ['Solves basic problems correctly', 'Follows standard procedures', 'Needs help with word problems'],
    indicators: ['70-84% accuracy in assessments', 'Requires occasional support', 'Improving gradually'],
    version: 1,
    active: true
  },
  {
    id: 'rubric-math-004',
    parameter_id: 'hpc-param-001',
    level: 'C',
    grade_equivalent: 'satisfactory',
    descriptor: 'Basic mathematical skills with regular support required',
    detailed_description: 'Shows elementary mathematical understanding, struggles with problem-solving, needs regular guidance',
    examples: ['Solves simple problems with help', 'Makes computational errors', 'Difficulty with concepts'],
    indicators: ['55-69% accuracy in assessments', 'Needs regular support', 'Slow progress'],
    version: 1,
    active: true
  },
  {
    id: 'rubric-math-005',
    parameter_id: 'hpc-param-001',
    level: 'D',
    grade_equivalent: 'needs_improvement',
    descriptor: 'Significant mathematical difficulties requiring intensive support',
    detailed_description: 'Shows limited mathematical understanding, requires extensive support and intervention',
    examples: ['Struggles with basic operations', 'Cannot solve problems independently', 'Lacks foundational concepts'],
    indicators: ['Below 55% accuracy', 'Requires intensive support', 'Needs remedial intervention'],
    version: 1,
    active: true
  },

  // Creativity Rubrics
  {
    id: 'rubric-creat-001',
    parameter_id: 'hpc-param-002',
    level: 'A+',
    grade_equivalent: 'outstanding',
    descriptor: 'Exceptional creativity and innovative thinking',
    detailed_description: 'Demonstrates outstanding originality, generates unique ideas, and shows exceptional creative expression',
    examples: ['Creates original artworks', 'Suggests innovative solutions', 'Thinks outside the box consistently'],
    indicators: ['Highly original work', 'Inspires others', 'Shows artistic flair'],
    version: 1,
    active: true
  },
  {
    id: 'rubric-creat-002',
    parameter_id: 'hpc-param-002',
    level: 'A',
    grade_equivalent: 'excellent',
    descriptor: 'Strong creative abilities with good innovative thinking',
    detailed_description: 'Shows good creativity, generates interesting ideas, and demonstrates artistic potential',
    examples: ['Creates good quality artwork', 'Offers creative suggestions', 'Shows imagination in projects'],
    indicators: ['Good quality creative work', 'Shows initiative', 'Demonstrates artistic skills'],
    version: 1,
    active: true
  },
  {
    id: 'rubric-creat-003',
    parameter_id: 'hpc-param-002',
    level: 'B',
    grade_equivalent: 'good',
    descriptor: 'Satisfactory creativity with developing innovative skills',
    detailed_description: 'Demonstrates basic creativity, follows creative processes, but needs encouragement for innovation',
    examples: ['Completes creative tasks adequately', 'Shows some original thinking', 'Participates in creative activities'],
    indicators: ['Adequate creative output', 'Needs encouragement', 'Shows potential'],
    version: 1,
    active: true
  },
  {
    id: 'rubric-creat-004',
    parameter_id: 'hpc-param-002',
    level: 'C',
    grade_equivalent: 'satisfactory',
    descriptor: 'Limited creativity requiring support and encouragement',
    detailed_description: 'Shows minimal creative expression, relies on templates, needs significant support for creative tasks',
    examples: ['Copies existing ideas', 'Reluctant to try new approaches', 'Needs step-by-step guidance'],
    indicators: ['Limited original work', 'Requires constant support', 'Hesitant to express creativity'],
    version: 1,
    active: true
  },
  {
    id: 'rubric-creat-005',
    parameter_id: 'hpc-param-002',
    level: 'D',
    grade_equivalent: 'needs_improvement',
    descriptor: 'Significant creative challenges requiring intensive intervention',
    detailed_description: 'Shows very limited creative expression, avoids creative tasks, needs intensive support and intervention',
    examples: ['Avoids creative activities', 'Cannot generate original ideas', 'Extremely dependent on others'],
    indicators: ['Minimal creative output', 'Avoids participation', 'Needs intensive intervention'],
    version: 1,
    active: true
  },

  // Teamwork Rubrics
  {
    id: 'rubric-team-001',
    parameter_id: 'hpc-param-003',
    level: 'A+',
    grade_equivalent: 'outstanding',
    descriptor: 'Exceptional teamwork and leadership abilities',
    detailed_description: 'Demonstrates outstanding collaboration skills, leads teams effectively, and facilitates group success',
    examples: ['Natural team leader', 'Helps resolve conflicts', 'Ensures everyone participates'],
    indicators: ['Leads by example', 'Excellent communication', 'Builds team spirit'],
    version: 1,
    active: true
  },
  {
    id: 'rubric-team-002',
    parameter_id: 'hpc-param-003',
    level: 'A',
    grade_equivalent: 'excellent',
    descriptor: 'Strong teamwork skills with good collaborative abilities',
    detailed_description: 'Works well in teams, contributes effectively, and supports team goals',
    examples: ['Active team participant', 'Shares ideas freely', 'Supports team decisions'],
    indicators: ['Consistent contribution', 'Good listener', 'Reliable team member'],
    version: 1,
    active: true
  },
  {
    id: 'rubric-team-003',
    parameter_id: 'hpc-param-003',
    level: 'B',
    grade_equivalent: 'good',
    descriptor: 'Satisfactory teamwork with developing collaborative skills',
    detailed_description: 'Participates in team activities, follows team decisions, but needs encouragement to contribute actively',
    examples: ['Follows team instructions', 'Participates when encouraged', 'Works well with familiar peers'],
    indicators: ['Adequate participation', 'Needs encouragement', 'Shows improvement'],
    version: 1,
    active: true
  },
  {
    id: 'rubric-team-004',
    parameter_id: 'hpc-param-003',
    level: 'C',
    grade_equivalent: 'satisfactory',
    descriptor: 'Limited teamwork skills requiring support',
    detailed_description: 'Shows minimal team participation, prefers individual work, needs support for collaboration',
    examples: ['Reluctant team participant', 'Prefers working alone', 'Needs constant guidance'],
    indicators: ['Minimal contribution', 'Avoids group work', 'Requires support'],
    version: 1,
    active: true
  },
  {
    id: 'rubric-team-005',
    parameter_id: 'hpc-param-003',
    level: 'D',
    grade_equivalent: 'needs_improvement',
    descriptor: 'Significant teamwork challenges requiring intensive intervention',
    detailed_description: 'Avoids team activities, disrupts group work, needs intensive social skills intervention',
    examples: ['Disrupts team activities', 'Refuses to participate', 'Creates conflicts'],
    indicators: ['Disruptive behavior', 'Avoids collaboration', 'Needs intensive support'],
    version: 1,
    active: true
  }

  // Similar rubrics would be created for other parameters (Empathy, Physical Fitness, Discipline)
  // For brevity, I'm showing the pattern for 3 parameters
];

// 6. DEMO EVALUATIONS (Multiple evaluators per student per parameter)
export const demoHpcEvaluations = [
  // Aarav Sharma (Grade 5) - Mathematics
  {
    id: 'eval-001',
    student_id: 'hpc-student-001',
    parameter_id: 'hpc-param-001',
    evaluator_id: 'hpc-teacher-001',
    evaluator_role: 'teacher',
    score: 4.2,
    grade: 'A',
    qualitative_remark: 'Aarav shows excellent mathematical reasoning and solves problems creatively. He often helps his classmates understand difficult concepts.',
    evidence_notes: 'Scored 95% in recent assessment, completed bonus problems, peer tutoring observed',
    confidence_level: 0.95,
    evaluation_date: getRelativeDate(-15),
    term_id: 'term-2025-1',
    status: 'submitted',
    created_at: getRelativeDate(-15)
  },
  {
    id: 'eval-002',
    student_id: 'hpc-student-001',
    parameter_id: 'hpc-param-001',
    evaluator_id: 'hpc-parent-001',
    evaluator_role: 'parent',
    score: 4.0,
    grade: 'A',
    qualitative_remark: 'Aarav enjoys solving math puzzles at home and often explains mathematical concepts to his younger sister.',
    evidence_notes: 'Completes homework independently, shows interest in math competitions',
    confidence_level: 0.85,
    evaluation_date: getRelativeDate(-10),
    term_id: 'term-2025-1',
    status: 'submitted',
    created_at: getRelativeDate(-10)
  },
  {
    id: 'eval-003',
    student_id: 'hpc-student-001',
    parameter_id: 'hpc-param-001',
    evaluator_id: 'hpc-student-001',
    evaluator_role: 'self',
    score: 3.8,
    grade: 'A',
    qualitative_remark: 'I like mathematics because it\'s like solving puzzles. Sometimes the problems are hard but I keep trying until I find the answer.',
    evidence_notes: 'Self-reflection during portfolio review session',
    confidence_level: 0.75,
    evaluation_date: getRelativeDate(-8),
    term_id: 'term-2025-1',
    status: 'submitted',
    created_at: getRelativeDate(-8)
  },

  // Aarav Sharma - Creativity
  {
    id: 'eval-004',
    student_id: 'hpc-student-001',
    parameter_id: 'hpc-param-002',
    evaluator_id: 'hpc-teacher-003',
    evaluator_role: 'teacher',
    score: 4.5,
    grade: 'A+',
    qualitative_remark: 'Aarav demonstrates exceptional creativity in art projects. His recent sculpture was highly original and showed advanced artistic thinking.',
    evidence_notes: 'Won school art competition, created innovative project design, shows artistic leadership',
    confidence_level: 0.92,
    evaluation_date: getRelativeDate(-12),
    term_id: 'term-2025-1',
    status: 'submitted',
    created_at: getRelativeDate(-12)
  },
  {
    id: 'eval-005',
    student_id: 'hpc-student-001',
    parameter_id: 'hpc-param-002',
    evaluator_id: 'hpc-student-002',
    evaluator_role: 'peer',
    score: 4.3,
    grade: 'A+',
    qualitative_remark: 'Aarav always comes up with the most interesting ideas during group projects. He thinks of things that nobody else does.',
    evidence_notes: 'Peer evaluation during collaborative art project',
    confidence_level: 0.80,
    evaluation_date: getRelativeDate(-7),
    term_id: 'term-2025-1',
    status: 'submitted',
    created_at: getRelativeDate(-7)
  },

  // Aarav Sharma - Teamwork
  {
    id: 'eval-006',
    student_id: 'hpc-student-001',
    parameter_id: 'hpc-param-003',
    evaluator_id: 'hpc-teacher-002',
    evaluator_role: 'teacher',
    score: 4.0,
    grade: 'A',
    qualitative_remark: 'Aarav works well in teams and is always willing to help his teammates. He listens to others and contributes meaningfully to group discussions.',
    evidence_notes: 'Observed during group projects, peer feedback positive, takes initiative in team activities',
    confidence_level: 0.88,
    evaluation_date: getRelativeDate(-14),
    term_id: 'term-2025-1',
    status: 'submitted',
    created_at: getRelativeDate(-14)
  },

  // Saanvi Patel (Grade 8) - Mathematics
  {
    id: 'eval-007',
    student_id: 'hpc-student-002',
    parameter_id: 'hpc-param-001',
    evaluator_id: 'hpc-teacher-001',
    evaluator_role: 'teacher',
    score: 3.8,
    grade: 'A',
    qualitative_remark: 'Saanvi has strong mathematical foundations and shows consistent improvement. She approaches problems systematically.',
    evidence_notes: 'Consistent 85-90% scores, good problem-solving approach, helps struggling classmates',
    confidence_level: 0.90,
    evaluation_date: getRelativeDate(-16),
    term_id: 'term-2025-1',
    status: 'submitted',
    created_at: getRelativeDate(-16)
  },

  // Saanvi Patel - Empathy
  {
    id: 'eval-008',
    student_id: 'hpc-student-002',
    parameter_id: 'hpc-param-004',
    evaluator_id: 'hpc-teacher-002',
    evaluator_role: 'teacher',
    score: 4.7,
    grade: 'A+',
    qualitative_remark: 'Saanvi shows exceptional empathy and compassion. She is always the first to help classmates in need and shows genuine care for others.',
    evidence_notes: 'Comforted upset classmate, organized help for sick student, shows emotional maturity',
    confidence_level: 0.95,
    evaluation_date: getRelativeDate(-11),
    term_id: 'term-2025-1',
    status: 'submitted',
    created_at: getRelativeDate(-11)
  },
  {
    id: 'eval-009',
    student_id: 'hpc-student-002',
    parameter_id: 'hpc-param-004',
    evaluator_id: 'hpc-parent-002',
    evaluator_role: 'parent',
    score: 4.5,
    grade: 'A+',
    qualitative_remark: 'Saanvi is very caring at home. She takes care of her younger brother and is always concerned about others\' feelings.',
    evidence_notes: 'Helps with household responsibilities, shows care for family members, volunteers for community service',
    confidence_level: 0.90,
    evaluation_date: getRelativeDate(-9),
    term_id: 'term-2025-1',
    status: 'submitted',
    created_at: getRelativeDate(-9)
  },

  // Arjun Verma (Grade 10) - Physical Fitness
  {
    id: 'eval-010',
    student_id: 'hpc-student-003',
    parameter_id: 'hpc-param-005',
    evaluator_id: 'hpc-teacher-003',
    evaluator_role: 'teacher',
    score: 4.4,
    grade: 'A+',
    qualitative_remark: 'Arjun is an outstanding athlete with excellent physical fitness. He leads by example in sports activities and maintains high fitness standards.',
    evidence_notes: 'School football team captain, excellent fitness test scores, promotes healthy lifestyle',
    confidence_level: 0.98,
    evaluation_date: getRelativeDate(-13),
    term_id: 'term-2025-1',
    status: 'submitted',
    created_at: getRelativeDate(-13)
  },

  // Kavya Singh (Grade 7) - Discipline
  {
    id: 'eval-011',
    student_id: 'hpc-student-004',
    parameter_id: 'hpc-param-006',
    evaluator_id: 'hpc-teacher-002',
    evaluator_role: 'teacher',
    score: 4.1,
    grade: 'A',
    qualitative_remark: 'Kavya is highly disciplined and responsible. She follows school rules diligently and sets a good example for her peers.',
    evidence_notes: 'Perfect attendance, always punctual, maintains neat notebooks, follows instructions carefully',
    confidence_level: 0.93,
    evaluation_date: getRelativeDate(-17),
    term_id: 'term-2025-1',
    status: 'submitted',
    created_at: getRelativeDate(-17)
  },

  // Ishaan Kumar (Grade 6) - Teamwork
  {
    id: 'eval-012',
    student_id: 'hpc-student-005',
    parameter_id: 'hpc-param-003',
    evaluator_id: 'hpc-teacher-001',
    evaluator_role: 'teacher',
    score: 3.5,
    grade: 'B+',
    qualitative_remark: 'Ishaan is developing good teamwork skills. He participates actively in group work but sometimes needs encouragement to share his ideas.',
    evidence_notes: 'Good participation in group projects, improving communication skills, shows willingness to help',
    confidence_level: 0.85,
    evaluation_date: getRelativeDate(-18),
    term_id: 'term-2025-1',
    status: 'submitted',
    created_at: getRelativeDate(-18)
  }
];

// 7. DEMO COMPILED REPORTS (1 draft report per student)
export const demoHpcReports = [
  {
    id: 'hpc-report-001',
    student_id: 'hpc-student-001',
    term_id: 'term-2025-1',
    overall_grade: 'A',
    overall_score: 4.15,
    summary_json: {
      student_info: {
        name: 'Aarav Sharma',
        grade: '5',
        section: 'A',
        admission_number: 'DPS2024001',
        academic_year: '2024-25'
      },
      scholastic_performance: {
        mathematics: {
          grade: 'A',
          score: 4.2,
          teacher_remark: 'Excellent mathematical reasoning and problem-solving ability',
          parent_feedback: 'Shows strong interest in mathematics at home',
          self_reflection: 'I enjoy solving math puzzles and helping friends'
        }
      },
      co_scholastic_performance: {
        creativity: {
          grade: 'A+',
          score: 4.5,
          teacher_remark: 'Exceptional creativity in art projects',
          peer_feedback: 'Always has the most interesting ideas',
          evidence: 'Won school art competition'
        }
      },
      life_skills: {
        teamwork: {
          grade: 'A',
          score: 4.0,
          teacher_remark: 'Works well in teams and helps teammates',
          observations: 'Natural collaborator, good listener'
        }
      },
      discipline_markers: {
        attendance: '98%',
        punctuality: 'Excellent',
        behavior: 'Exemplary',
        uniform_compliance: 'Always proper'
      },
      achievements: [
        'First Prize in School Art Competition',
        'Mathematics Olympiad Qualifier',
        'Class Monitor for Term 1'
      ],
      areas_of_strength: [
        'Mathematical reasoning and problem-solving',
        'Creative thinking and artistic expression',
        'Leadership and helping others'
      ],
      areas_for_improvement: [
        'Could participate more in physical activities',
        'Develop presentation skills further'
      ],
      teacher_recommendations: [
        'Encourage participation in math competitions',
        'Provide advanced creative projects',
        'Consider leadership roles in student council'
      ],
      parent_observations: 'Aarav is a well-rounded child who shows curiosity and creativity. He is helpful at home and shows good values.',
      student_reflection: 'I want to become better at sports and learn more about science. I like helping my friends with their studies.',
      next_term_goals: [
        'Improve physical fitness scores',
        'Participate in science fair',
        'Take on more leadership responsibilities'
      ]
    },
    status: 'draft',
    compiled_at: getRelativeDate(-5),
    compiled_by: 'hpc-teacher-001',
    approved_by: null,
    published_at: null,
    version: 1,
    created_at: getRelativeDate(-5)
  },
  {
    id: 'hpc-report-002',
    student_id: 'hpc-student-002',
    term_id: 'term-2025-1',
    overall_grade: 'A',
    overall_score: 4.25,
    summary_json: {
      student_info: {
        name: 'Saanvi Patel',
        grade: '8',
        section: 'B',
        admission_number: 'DPS2024002',
        academic_year: '2024-25'
      },
      scholastic_performance: {
        mathematics: {
          grade: 'A',
          score: 3.8,
          teacher_remark: 'Strong mathematical foundations with consistent improvement',
          parent_feedback: 'Studies regularly and asks good questions',
          self_reflection: 'Math is challenging but I like solving problems step by step'
        }
      },
      co_scholastic_performance: {
        health_wellness: {
          grade: 'A',
          score: 4.0,
          teacher_remark: 'Maintains good health habits and participates actively in wellness programs',
          evidence: 'Regular participation in yoga sessions, good fitness scores'
        }
      },
      life_skills: {
        empathy: {
          grade: 'A+',
          score: 4.7,
          teacher_remark: 'Shows exceptional empathy and compassion for others',
          parent_feedback: 'Very caring and considerate at home',
          peer_observations: 'Always helps when someone is upset'
        }
      },
      discipline_markers: {
        attendance: '96%',
        punctuality: 'Very Good',
        behavior: 'Excellent',
        uniform_compliance: 'Always proper'
      },
      achievements: [
        'Best Helper Award - Term 1',
        'Yoga Competition - Second Place',
        'Peer Mediator Certificate'
      ],
      areas_of_strength: [
        'Exceptional empathy and emotional intelligence',
        'Strong academic performance',
        'Health and wellness awareness'
      ],
      areas_for_improvement: [
        'Build confidence in public speaking',
        'Explore more creative outlets'
      ],
      teacher_recommendations: [
        'Encourage leadership in peer support programs',
        'Provide opportunities for creative expression',
        'Consider counselor training programs'
      ],
      parent_observations: 'Saanvi is a compassionate child who cares deeply about others. She maintains good study habits and health practices.',
      student_reflection: 'I want to help more students who feel sad or lonely. I also want to try painting and music.',
      next_term_goals: [
        'Join student counseling program',
        'Participate in creative arts activities',
        'Improve public speaking skills'
      ]
    },
    status: 'draft',
    compiled_at: getRelativeDate(-4),
    compiled_by: 'hpc-teacher-002',
    approved_by: null,
    published_at: null,
    version: 1,
    created_at: getRelativeDate(-4)
  },
  {
    id: 'hpc-report-003',
    student_id: 'hpc-student-003',
    term_id: 'term-2025-1',
    overall_grade: 'A+',
    overall_score: 4.35,
    summary_json: {
      student_info: {
        name: 'Arjun Verma',
        grade: '10',
        section: 'A',
        admission_number: 'DPS2024003',
        academic_year: '2024-25'
      },
      scholastic_performance: {
        mathematics: {
          grade: 'A+',
          score: 4.6,
          teacher_remark: 'Outstanding mathematical ability with advanced problem-solving skills',
          parent_feedback: 'Excels in mathematics and helps others understand concepts',
          self_reflection: 'Mathematics is my favorite subject. I enjoy challenging problems and want to pursue engineering.'
        }
      },
      co_scholastic_performance: {
        physical_fitness: {
          grade: 'A+',
          score: 4.4,
          teacher_remark: 'Exceptional athlete and fitness role model',
          evidence: 'Football team captain, state-level athlete, promotes fitness among peers'
        }
      },
      life_skills: {
        leadership: {
          grade: 'A+',
          score: 4.5,
          teacher_remark: 'Natural leader who inspires and motivates others',
          peer_feedback: 'Great captain who brings out the best in everyone',
          evidence: 'Student council president, sports team captain, organizes school events'
        }
      },
      discipline_markers: {
        attendance: '99%',
        punctuality: 'Excellent',
        behavior: 'Exemplary',
        uniform_compliance: 'Always proper'
      },
      achievements: [
        'Student Council President',
        'State Level Football Championship - Gold Medal',
        'Mathematics Olympiad - National Qualifier',
        'Best Student Leader Award',
        'Community Service Excellence Certificate'
      ],
      areas_of_strength: [
        'Outstanding leadership and organizational skills',
        'Exceptional mathematical and analytical abilities',
        'Superior physical fitness and athletic performance',
        'Strong moral values and ethical behavior'
      ],
      areas_for_improvement: [
        'Could explore more creative and artistic pursuits',
        'Develop skills in other languages'
      ],
      teacher_recommendations: [
        'Consider advanced mathematics programs',
        'Explore engineering and technology fields',
        'Take on mentoring roles for junior students',
        'Participate in national level competitions'
      ],
      parent_observations: 'Arjun is a dedicated and disciplined student who balances academics and sports excellently. He shows strong leadership qualities and helps others.',
      student_reflection: 'I want to become an engineer and use my skills to solve real-world problems. I also want to continue playing football and maybe coach younger students.',
      next_term_goals: [
        'Maintain academic excellence',
        'Lead school to inter-school championships',
        'Start peer mentoring program',
        'Explore robotics and coding'
      ]
    },
    status: 'draft',
    compiled_at: getRelativeDate(-3),
    compiled_by: 'hpc-teacher-001',
    approved_by: null,
    published_at: null,
    version: 1,
    created_at: getRelativeDate(-3)
  }
];

// 8. DEMO EVALUATION CYCLES
export const demoEvaluationCycles = [
  {
    id: 'cycle-001',
    name: 'Term 1 Mid-Term Evaluation',
    term_id: 'term-2025-1',
    cycle_type: 'mid_term',
    start_date: getRelativeDate(-30),
    end_date: getRelativeDate(-15),
    parameters: ['hpc-param-001', 'hpc-param-002', 'hpc-param-003'],
    evaluator_roles: ['teacher', 'self'],
    status: 'completed',
    created_at: getRelativeDate(-35)
  },
  {
    id: 'cycle-002',
    name: 'Term 1 Final Evaluation',
    term_id: 'term-2025-1',
    cycle_type: 'final',
    start_date: getRelativeDate(-20),
    end_date: getRelativeDate(-5),
    parameters: ['hpc-param-001', 'hpc-param-002', 'hpc-param-003', 'hpc-param-004', 'hpc-param-005', 'hpc-param-006'],
    evaluator_roles: ['teacher', 'parent', 'peer', 'self'],
    status: 'completed',
    created_at: getRelativeDate(-25)
  },
  {
    id: 'cycle-003',
    name: 'Term 2 Continuous Assessment',
    term_id: 'term-2025-2',
    cycle_type: 'continuous',
    start_date: getRelativeDate(10),
    end_date: getRelativeDate(40),
    parameters: ['hpc-param-001', 'hpc-param-002', 'hpc-param-003', 'hpc-param-004', 'hpc-param-005', 'hpc-param-006'],
    evaluator_roles: ['teacher', 'parent', 'peer', 'self'],
    status: 'active',
    created_at: getRelativeDate(-5)
  }
];

// 9. DEMO ANALYTICS DATA
export const demoHpcAnalytics = [
  {
    id: 'analytics-001',
    student_id: 'hpc-student-001',
    parameter_id: 'hpc-param-001',
    term_id: 'term-2025-1',
    class_percentile: 85,
    grade_percentile: 82,
    school_percentile: 88,
    growth_trajectory: 'improving',
    predicted_next_score: 4.3,
    confidence_interval: { lower: 4.1, upper: 4.5 },
    risk_indicators: [],
    strengths_identified: ['problem_solving', 'logical_thinking', 'peer_teaching'],
    improvement_areas: ['speed_accuracy', 'advanced_concepts'],
    created_at: getRelativeDate(-5)
  },
  {
    id: 'analytics-002',
    student_id: 'hpc-student-002',
    parameter_id: 'hpc-param-004',
    term_id: 'term-2025-1',
    class_percentile: 98,
    grade_percentile: 96,
    school_percentile: 97,
    growth_trajectory: 'stable_high',
    predicted_next_score: 4.7,
    confidence_interval: { lower: 4.5, upper: 4.8 },
    risk_indicators: [],
    strengths_identified: ['emotional_intelligence', 'caring_nature', 'conflict_resolution'],
    improvement_areas: ['assertiveness', 'self_advocacy'],
    created_at: getRelativeDate(-5)
  }
];

// 10. DEMO PARAMETER ASSIGNMENTS (Which evaluators assess which parameters)
export const demoParameterAssignments = [
  // Mathematics - Teachers and Parents
  {
    id: 'assign-001',
    parameter_id: 'hpc-param-001',
    evaluator_role: 'teacher',
    is_required: true,
    weightage: 0.70,
    evaluation_frequency: 'continuous',
    created_at: getRelativeDate(-30)
  },
  {
    id: 'assign-002',
    parameter_id: 'hpc-param-001',
    evaluator_role: 'parent',
    is_required: true,
    weightage: 0.20,
    evaluation_frequency: 'periodic',
    created_at: getRelativeDate(-30)
  },
  {
    id: 'assign-003',
    parameter_id: 'hpc-param-001',
    evaluator_role: 'self',
    is_required: true,
    weightage: 0.10,
    evaluation_frequency: 'periodic',
    created_at: getRelativeDate(-30)
  },

  // Creativity - Teachers, Peers, Self
  {
    id: 'assign-004',
    parameter_id: 'hpc-param-002',
    evaluator_role: 'teacher',
    is_required: true,
    weightage: 0.60,
    evaluation_frequency: 'continuous',
    created_at: getRelativeDate(-30)
  },
  {
    id: 'assign-005',
    parameter_id: 'hpc-param-002',
    evaluator_role: 'peer',
    is_required: true,
    weightage: 0.25,
    evaluation_frequency: 'periodic',
    created_at: getRelativeDate(-30)
  },
  {
    id: 'assign-006',
    parameter_id: 'hpc-param-002',
    evaluator_role: 'self',
    is_required: true,
    weightage: 0.15,
    evaluation_frequency: 'periodic',
    created_at: getRelativeDate(-30)
  },

  // Teamwork - All evaluators
  {
    id: 'assign-007',
    parameter_id: 'hpc-param-003',
    evaluator_role: 'teacher',
    is_required: true,
    weightage: 0.50,
    evaluation_frequency: 'continuous',
    created_at: getRelativeDate(-30)
  },
  {
    id: 'assign-008',
    parameter_id: 'hpc-param-003',
    evaluator_role: 'peer',
    is_required: true,
    weightage: 0.30,
    evaluation_frequency: 'continuous',
    created_at: getRelativeDate(-30)
  },
  {
    id: 'assign-009',
    parameter_id: 'hpc-param-003',
    evaluator_role: 'parent',
    is_required: false,
    weightage: 0.10,
    evaluation_frequency: 'periodic',
    created_at: getRelativeDate(-30)
  },
  {
    id: 'assign-010',
    parameter_id: 'hpc-param-003',
    evaluator_role: 'self',
    is_required: true,
    weightage: 0.10,
    evaluation_frequency: 'periodic',
    created_at: getRelativeDate(-30)
  }
];

// 11. DEMO APPROVAL WORKFLOWS
export const demoApprovalWorkflows = [
  {
    id: 'workflow-001',
    report_id: 'hpc-report-001',
    step_number: 1,
    approver_role: 'class_teacher',
    approver_id: 'hpc-teacher-001',
    status: 'pending',
    assigned_at: getRelativeDate(-5),
    due_date: getRelativeDate(2),
    comments: null,
    created_at: getRelativeDate(-5)
  },
  {
    id: 'workflow-002',
    report_id: 'hpc-report-001',
    step_number: 2,
    approver_role: 'principal',
    approver_id: 'admin-001',
    status: 'pending',
    assigned_at: null,
    due_date: getRelativeDate(7),
    comments: null,
    created_at: getRelativeDate(-5)
  }
];

// 12. COMPREHENSIVE DEMO DATA EXPORT
export const hpcDemoDataSet = {
  students: demoStudents,
  teachers: demoTeachers,
  parents: demoParents,
  parameters: demoHpcParameters,
  rubrics: demoHpcRubrics,
  evaluations: demoHpcEvaluations,
  reports: demoHpcReports,
  evaluation_cycles: demoEvaluationCycles,
  analytics: demoHpcAnalytics,
  parameter_assignments: demoParameterAssignments,
  approval_workflows: demoApprovalWorkflows
};

// 13. UTILITY FUNCTIONS FOR DEMO DATA
export const hpcDemoUtils = {
  // Get student's complete HPC profile
  getStudentHpcProfile: (studentId: string) => {
    const student = demoStudents.find(s => s.id === studentId);
    const evaluations = demoHpcEvaluations.filter(e => e.student_id === studentId);
    const reports = demoHpcReports.filter(r => r.student_id === studentId);
    const analytics = demoHpcAnalytics.filter(a => a.student_id === studentId);
    
    return {
      student,
      evaluations,
      reports,
      analytics,
      total_evaluations: evaluations.length,
      latest_report: reports[0],
      overall_performance: reports[0]?.overall_score || 0
    };
  },

  // Get parameter evaluation summary
  getParameterSummary: (parameterId: string) => {
    const parameter = demoHpcParameters.find(p => p.id === parameterId);
    const evaluations = demoHpcEvaluations.filter(e => e.parameter_id === parameterId);
    const rubrics = demoHpcRubrics.filter(r => r.parameter_id === parameterId);
    
    const averageScore = evaluations.length > 0 
      ? evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length 
      : 0;
    
    return {
      parameter,
      evaluations,
      rubrics,
      total_evaluations: evaluations.length,
      average_score: averageScore,
      grade_distribution: evaluations.reduce((acc, e) => {
        acc[e.grade] = (acc[e.grade] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  },

  // Get evaluator's assessment load
  getEvaluatorLoad: (evaluatorId: string) => {
    const evaluations = demoHpcEvaluations.filter(e => e.evaluator_id === evaluatorId);
    const uniqueStudents = [...new Set(evaluations.map(e => e.student_id))];
    const uniqueParameters = [...new Set(evaluations.map(e => e.parameter_id))];
    
    return {
      total_evaluations: evaluations.length,
      students_evaluated: uniqueStudents.length,
      parameters_assessed: uniqueParameters.length,
      completion_rate: evaluations.filter(e => e.status === 'submitted').length / evaluations.length,
      average_score_given: evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length
    };
  },

  // Generate report summary statistics
  getReportStatistics: () => {
    return {
      total_reports: demoHpcReports.length,
      draft_reports: demoHpcReports.filter(r => r.status === 'draft').length,
      published_reports: demoHpcReports.filter(r => r.status === 'published').length,
      average_overall_score: demoHpcReports.reduce((sum, r) => sum + r.overall_score, 0) / demoHpcReports.length,
      grade_distribution: demoHpcReports.reduce((acc, r) => {
        acc[r.overall_grade] = (acc[r.overall_grade] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
};

// 14. SAMPLE QUERIES FOR TESTING
export const hpcSampleQueries = {
  // Get all evaluations for a student
  getStudentEvaluations: (studentId: string) => 
    demoHpcEvaluations.filter(e => e.student_id === studentId),

  // Get evaluations by parameter
  getParameterEvaluations: (parameterId: string) => 
    demoHpcEvaluations.filter(e => e.parameter_id === parameterId),

  // Get evaluations by evaluator
  getEvaluatorAssessments: (evaluatorId: string) => 
    demoHpcEvaluations.filter(e => e.evaluator_id === evaluatorId),

  // Get multi-stakeholder view for a student-parameter combination
  getMultiStakeholderView: (studentId: string, parameterId: string) => {
    const evaluations = demoHpcEvaluations.filter(e => 
      e.student_id === studentId && e.parameter_id === parameterId
    );
    
    return {
      parameter: demoHpcParameters.find(p => p.id === parameterId),
      teacher_evaluation: evaluations.find(e => e.evaluator_role === 'teacher'),
      parent_evaluation: evaluations.find(e => e.evaluator_role === 'parent'),
      peer_evaluation: evaluations.find(e => e.evaluator_role === 'peer'),
      self_evaluation: evaluations.find(e => e.evaluator_role === 'self'),
      average_score: evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length,
      consensus_level: calculateConsensusLevel(evaluations)
    };
  }
};

// Helper function to calculate consensus level among evaluators
function calculateConsensusLevel(evaluations: any[]): number {
  if (evaluations.length < 2) return 1.0;
  
  const scores = evaluations.map(e => e.score);
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Convert to consensus level (0-1, where 1 is perfect consensus)
  return Math.max(0, 1 - (standardDeviation / 2));
}

// 15. INTEGRATION HELPERS
export const hpcIntegrationHelpers = {
  // Map demo data to existing BIG DAY structure
  mapToExistingStructure: () => {
    return {
      // Add HPC students to existing user_profiles
      user_profiles_additions: [
        ...demoStudents.map(student => ({
          id: student.id,
          full_name: student.full_name,
          email: student.email,
          role: student.role,
          admission_number: student.admission_number,
          current_standard: student.current_standard,
          section: student.section,
          accommodation_type: student.accommodation_type,
          peer_group: student.peer_group,
          status: student.status,
          date_of_admission: student.date_of_admission,
          contact_number: student.contact_number,
          parent_guardian_name: student.parent_guardian_name,
          parent_contact_number: student.parent_contact_number,
          date_of_birth: student.date_of_birth,
          gender: student.gender,
          created_at: getRelativeDate(-60),
          updated_at: getRelativeDate(-60)
        })),
        ...demoTeachers.map(teacher => ({
          id: teacher.id,
          full_name: teacher.full_name,
          email: teacher.email,
          role: teacher.role,
          employee_id: teacher.employee_id,
          department: teacher.department,
          designation: teacher.designation,
          accommodation_type: teacher.accommodation_type,
          peer_group: teacher.peer_group,
          status: teacher.status,
          date_of_joining: teacher.date_of_joining,
          contact_number: teacher.contact_number,
          created_at: getRelativeDate(-90),
          updated_at: getRelativeDate(-90)
        })),
        ...demoParents.map(parent => ({
          id: parent.id,
          full_name: parent.full_name,
          email: parent.email,
          role: parent.role,
          contact_number: parent.contact_number,
          status: 'active',
          peer_group: 'parent',
          profile_data: {
            child_id: parent.child_id,
            relationship: parent.relationship,
            occupation: parent.occupation,
            education: parent.education
          },
          created_at: getRelativeDate(-60),
          updated_at: getRelativeDate(-60)
        }))
      ],

      // Academic terms integration
      academic_terms_integration: {
        'term-2025-1': {
          hpc_evaluation_cycles: 2,
          hpc_reports_generated: 3,
          hpc_parameters_active: 6
        }
      }
    };
  },

  // Validate data consistency
  validateDataConsistency: () => {
    const issues = [];
    
    // Check if all students have parents
    demoStudents.forEach(student => {
      const hasParent = demoParents.some(parent => parent.child_id === student.id);
      if (!hasParent) {
        issues.push(`Student ${student.full_name} has no parent record`);
      }
    });
    
    // Check if all evaluations reference valid entities
    demoHpcEvaluations.forEach(evaluation => {
      const hasStudent = demoStudents.some(s => s.id === evaluation.student_id);
      const hasParameter = demoHpcParameters.some(p => p.id === evaluation.parameter_id);
      
      if (!hasStudent) issues.push(`Evaluation ${evaluation.id} references invalid student`);
      if (!hasParameter) issues.push(`Evaluation ${evaluation.id} references invalid parameter`);
    });
    
    return {
      is_valid: issues.length === 0,
      issues,
      summary: {
        students: demoStudents.length,
        teachers: demoTeachers.length,
        parents: demoParents.length,
        parameters: demoHpcParameters.length,
        evaluations: demoHpcEvaluations.length,
        reports: demoHpcReports.length
      }
    };
  }
};

// Export everything for easy access
export default hpcDemoDataSet;