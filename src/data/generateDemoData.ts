// Demo Data Generator for Big Day Education Management System
// Generates realistic data following the database schema

export interface DemoDataSet {
  institutions: any[];
  academic_terms: any[];
  user_groups: any[];
  cohorts: any[];
  sections: any[];
  user_profiles: any[];
  courses: any[];
  group_courses: any[];
  timetables: any[];
  timetable_sessions: any[];
  audit_logs: any[];
  system_reports: any[];
  user_permissions: any[];
}

// Helper function to generate UUIDs (mock)
const generateId = () => crypto.randomUUID();

// Helper function to generate dates
const getDate = (offset: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString();
};

// Generate realistic Indian names
const generateStudentName = (index: number) => {
  const firstNames = [
    'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
    'Saanvi', 'Aadhya', 'Kiara', 'Diya', 'Pihu', 'Prisha', 'Ananya', 'Fatima', 'Anika', 'Kavya',
    'Aryan', 'Kabir', 'Ansh', 'Kiaan', 'Rudra', 'Priyanshu', 'Shivansh', 'Yuvraj', 'Daksh', 'Om',
    'Aradhya', 'Ira', 'Myra', 'Sara', 'Pari', 'Avni', 'Riya', 'Siya', 'Nisha', 'Khushi'
  ];
  
  const lastNames = [
    'Sharma', 'Verma', 'Singh', 'Kumar', 'Gupta', 'Agarwal', 'Jain', 'Bansal', 'Srivastava', 'Tiwari',
    'Mishra', 'Pandey', 'Yadav', 'Saxena', 'Arora', 'Malhotra', 'Kapoor', 'Chopra', 'Bhatia', 'Sethi'
  ];
  
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
  return `${firstName} ${lastName}`;
};

export const generateDemoData = (): DemoDataSet => {
  const institutionId = generateId();
  const term1Id = generateId();
  const term2Id = generateId();
  
  // 1. Institutions
  const institutions = [
    {
      id: institutionId,
      name: 'Greenfield Academy',
      type: 'school',
      address: 'Sector 15, Bhilai, Chhattisgarh, India',
      contact_email: 'admin@greenfieldacademy.edu.in',
      contact_phone: '+91-788-2234567',
      established_year: 1995,
      created_at: getDate(-365),
      updated_at: getDate(-365)
    }
  ];

  // 2. Academic Terms
  const academic_terms = [
    {
      id: term1Id,
      institution_id: institutionId,
      name: '2025 Term 1',
      start_date: '2025-01-15',
      end_date: '2025-04-30',
      frozen: false,
      created_at: getDate(-30),
      updated_at: getDate(-30)
    },
    {
      id: term2Id,
      institution_id: institutionId,
      name: '2025 Term 2',
      start_date: '2025-07-01',
      end_date: '2025-11-15',
      frozen: false,
      created_at: getDate(-30),
      updated_at: getDate(-30)
    }
  ];

  // 3. User Groups (Classes)
  const user_groups = [];
  const groupIds: Record<string, string> = {};
  
  ['6', '7', '8'].forEach(grade => {
    ['A', 'B'].forEach(section => {
      const groupId = generateId();
      const groupName = `Grade ${grade}-${section}`;
      groupIds[groupName] = groupId;
      
      user_groups.push({
        id: groupId,
        name: groupName,
        type: 'class',
        description: `Section ${section} of Grade ${grade}`,
        parent_group_id: null,
        created_at: getDate(-20),
        updated_at: getDate(-20)
      });
    });
  });

  // 4. Cohorts (based on user_groups)
  const cohorts = [];
  const cohortIds: Record<string, string> = {};
  
  ['6', '7', '8'].forEach(grade => {
    const cohortId = generateId();
    cohortIds[grade] = cohortId;
    
    cohorts.push({
      id: cohortId,
      institution_id: institutionId,
      academic_term_id: term1Id,
      stream: 'General',
      grade: grade,
      boarding_type: 'day_scholar',
      periods_per_day: 8,
      days_per_week: 5,
      created_at: getDate(-20),
      updated_at: getDate(-20)
    });
  });

  // 5. Sections (based on cohorts)
  const sections = [];
  const sectionIds: Record<string, string> = {};
  
  Object.entries(cohortIds).forEach(([grade, cohortId]) => {
    ['A', 'B'].forEach(sectionName => {
      const sectionId = generateId();
      const sectionKey = `${grade}${sectionName}`;
      sectionIds[sectionKey] = sectionId;
      
      sections.push({
        id: sectionId,
        cohort_id: cohortId,
        name: sectionName,
        created_at: getDate(-20),
        updated_at: getDate(-20)
      });
    });
  });

  // 6. User Profiles
  const user_profiles = [];
  const teacherIds: Record<string, string> = {};
  const adminId = generateId();
  
  // Admin
  user_profiles.push({
    id: adminId,
    full_name: 'Dr. Rajesh Gupta',
    residential_address: 'Principal Quarters, Greenfield Academy Campus',
    contact_number: '+91-9876543210',
    email: 'principal@greenfieldacademy.edu.in',
    employee_id: 'EMP001',
    date_of_joining: '2020-06-01',
    accommodation_type: 'day_boarder',
    peer_group: 'staff',
    role: 'admin',
    department: 'Administration',
    designation: 'Principal',
    blood_group: 'B+',
    date_of_birth: '1975-03-15',
    gender: 'male',
    nationality: 'Indian',
    religion: 'Hindu',
    caste_category: 'General',
    status: 'active',
    created_at: getDate(-100),
    updated_at: getDate(-100),
    created_by: adminId,
    updated_by: adminId
  });

  // Teachers
  const teachers = [
    { name: 'Mr. Suresh Rao', subject: 'Mathematics', email: 'suresh.rao@greenfieldacademy.edu.in', empId: 'EMP002' },
    { name: 'Ms. Priya Sharma', subject: 'English', email: 'priya.sharma@greenfieldacademy.edu.in', empId: 'EMP003' },
    { name: 'Dr. Amit Kapoor', subject: 'Science', email: 'amit.kapoor@greenfieldacademy.edu.in', empId: 'EMP004' },
    { name: 'Mrs. Maria Fernandez', subject: 'Social Studies', email: 'maria.fernandez@greenfieldacademy.edu.in', empId: 'EMP005' },
    { name: 'Mr. Ravi Iyer', subject: 'Computer Science', email: 'ravi.iyer@greenfieldacademy.edu.in', empId: 'EMP006' },
    { name: 'Ms. Neha Mehta', subject: 'Arts', email: 'neha.mehta@greenfieldacademy.edu.in', empId: 'EMP007' }
  ];

  teachers.forEach((teacher, index) => {
    const teacherId = generateId();
    teacherIds[teacher.subject] = teacherId;
    
    user_profiles.push({
      id: teacherId,
      full_name: teacher.name,
      residential_address: `${index + 1}/15, Teachers Colony, Greenfield Academy`,
      contact_number: `+91-98765432${10 + index}`,
      email: teacher.email,
      employee_id: teacher.empId,
      date_of_joining: '2022-06-01',
      accommodation_type: 'day_boarder',
      peer_group: 'staff',
      role: 'teacher',
      department: teacher.subject,
      designation: teacher.subject === 'Science' ? 'Senior Teacher' : 'Teacher',
      blood_group: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-'][index],
      date_of_birth: `198${5 + index}-0${(index % 9) + 1}-15`,
      gender: index % 2 === 0 ? 'male' : 'female',
      nationality: 'Indian',
      religion: ['Hindu', 'Christian', 'Muslim', 'Sikh'][index % 4],
      caste_category: ['General', 'OBC', 'SC'][index % 3],
      status: 'active',
      created_at: getDate(-90),
      updated_at: getDate(-90),
      created_by: adminId,
      updated_by: adminId
    });
  });

  // Students (10 per section = 60 total)
  let studentIndex = 0;
  Object.entries(sectionIds).forEach(([sectionKey, sectionId]) => {
    const grade = sectionKey.charAt(0);
    const section = sectionKey.charAt(1);
    const groupId = Object.values(groupIds).find(id => 
      user_groups.find(g => g.id === id)?.name === `Grade ${grade}-${section}`
    );
    
    for (let i = 0; i < 10; i++) {
      const studentId = generateId();
      const admissionNumber = `ADM${grade}${section}${(i + 1).toString().padStart(3, '0')}`;
      
      user_profiles.push({
        id: studentId,
        full_name: generateStudentName(studentIndex),
        residential_address: `${i + 1}/25, Greenfield Residency, Bhilai`,
        contact_number: `+91-98765${43210 + studentIndex}`,
        email: `${admissionNumber.toLowerCase()}@student.greenfieldacademy.edu.in`,
        admission_number: admissionNumber,
        date_of_admission: '2023-04-01',
        current_standard: grade,
        section: section,
        parent_guardian_name: `Parent of ${generateStudentName(studentIndex)}`,
        parent_contact_number: `+91-98765${54321 + studentIndex}`,
        emergency_contact: `+91-98765${65432 + studentIndex}`,
        accommodation_type: i % 3 === 0 ? 'hosteller' : 'day_boarder',
        peer_group: parseInt(grade) <= 5 ? 'primary' : 'secondary',
        role: 'student',
        blood_group: ['A+', 'B+', 'O+', 'AB+'][i % 4],
        date_of_birth: `201${3 - parseInt(grade) + 6}-0${(i % 9) + 1}-${(i % 28) + 1}`,
        gender: i % 2 === 0 ? 'male' : 'female',
        nationality: 'Indian',
        religion: ['Hindu', 'Christian', 'Muslim'][i % 3],
        caste_category: ['General', 'OBC', 'SC', 'ST'][i % 4],
        status: 'active',
        group_id: groupId,
        created_at: getDate(-60),
        updated_at: getDate(-60),
        created_by: adminId,
        updated_by: adminId
      });
      
      studentIndex++;
    }
  });

  // 7. Courses
  const courses = [];
  const courseIds: Record<string, string> = {};
  
  const courseDefinitions = [
    { code: 'MATH', title: 'Mathematics', type: 'theory', theory: 5, lab: 0, teacher: 'Mathematics' },
    { code: 'SCI', title: 'Science', type: 'mixed', theory: 3, lab: 1, teacher: 'Science' },
    { code: 'ENG', title: 'English', type: 'theory', theory: 4, lab: 0, teacher: 'English' },
    { code: 'HIST', title: 'History', type: 'theory', theory: 2, lab: 0, teacher: 'Social Studies' },
    { code: 'CIV', title: 'Civics', type: 'theory', theory: 2, lab: 0, teacher: 'Social Studies' },
    { code: 'CS', title: 'Computer Science', type: 'mixed', theory: 2, lab: 1, teacher: 'Computer Science' },
    { code: 'ART', title: 'Art', type: 'theory', theory: 1, lab: 0, teacher: 'Arts' },
    { code: 'MUS', title: 'Music', type: 'theory', theory: 1, lab: 0, teacher: 'Arts' },
    { code: 'PE', title: 'Physical Education', type: 'theory', theory: 2, lab: 0, teacher: 'Arts', constraints: { prefer_last_period: true } }
  ];

  courseDefinitions.forEach(course => {
    const courseId = generateId();
    courseIds[course.code] = courseId;
    
    courses.push({
      id: courseId,
      institution_id: institutionId,
      title: course.title,
      code: course.code,
      description: `${course.title} curriculum for middle school students`,
      active: true,
      created_at: getDate(-50),
      updated_at: getDate(-50)
    });
  });

  // 8. Group Courses (Assign courses to sections with teachers)
  const group_courses = [];
  
  Object.entries(groupIds).forEach(([groupName, groupId]) => {
    const grade = parseInt(groupName.split('-')[0].split(' ')[1]);
    
    courseDefinitions.forEach((course, index) => {
      const teacherId = teacherIds[course.teacher];
      if (!teacherId) return;
      
      // Adjust periods based on grade level
      let theoryPeriods = course.theory;
      let labPeriods = course.lab;
      
      // Higher grades get more periods for core subjects
      if (['MATH', 'SCI', 'ENG'].includes(course.code) && grade >= 8) {
        theoryPeriods += 1;
      }
      
      group_courses.push({
        id: generateId(),
        group_id: groupId,
        course_id: courseIds[course.code],
        teacher_id: teacherId,
        weekly_theory_periods: theoryPeriods,
        weekly_lab_periods: labPeriods,
        lab_block_size: course.lab > 0 ? 2 : 1,
        priority: 10 - index, // Math highest priority, PE lowest
        effective_from: '2025-01-15',
        effective_to: null,
        created_at: getDate(-40),
        updated_at: getDate(-40)
      });
    });
  });

  // 9. Timetables (1 per section per term)
  const timetables = [];
  const timetableIds: Record<string, string> = {};
  
  Object.entries(groupIds).forEach(([groupName, groupId]) => {
    [term1Id, term2Id].forEach(termId => {
      const timetableId = generateId();
      const key = `${groupId}-${termId}`;
      timetableIds[key] = timetableId;
      
      timetables.push({
        id: timetableId,
        group_id: groupId,
        academic_term_id: termId,
        status: termId === term1Id ? 'published' : 'draft',
        version: 1,
        generated_at: getDate(-10),
        published_at: termId === term1Id ? getDate(-5) : null,
        published_by: termId === term1Id ? adminId : null,
        created_at: getDate(-10),
        updated_at: getDate(-10)
      });
    });
  });

  // 10. Timetable Sessions (Realistic weekly schedule)
  const timetable_sessions = [];
  
  // Generate sessions for Term 1 (published timetables)
  Object.entries(groupIds).forEach(([groupName, groupId]) => {
    const timetableId = timetableIds[`${groupId}-${term1Id}`];
    if (!timetableId) return;
    
    const groupCourses = group_courses.filter(gc => gc.group_id === groupId);
    const sessionSchedule: Record<string, Record<number, any>> = {};
    
    // Initialize empty schedule (5 days, 8 periods)
    for (let day = 1; day <= 5; day++) {
      sessionSchedule[day] = {};
    }
    
    // Schedule each course
    groupCourses.forEach(groupCourse => {
      const course = courses.find(c => c.id === groupCourse.course_id);
      if (!course) return;
      
      const theoryPeriods = groupCourse.weekly_theory_periods;
      const labPeriods = groupCourse.weekly_lab_periods;
      
      // Schedule theory sessions
      for (let i = 0; i < theoryPeriods; i++) {
        const slot = findAvailableSlot(sessionSchedule, 1);
        if (slot) {
          sessionSchedule[slot.day][slot.period] = {
            course_id: course.id,
            teacher_id: groupCourse.teacher_id,
            session_type: 'theory',
            duration_periods: 1
          };
        }
      }
      
      // Schedule lab sessions (2-period blocks)
      for (let i = 0; i < labPeriods; i++) {
        const slot = findAvailableSlot(sessionSchedule, 2);
        if (slot) {
          for (let j = 0; j < 2; j++) {
            sessionSchedule[slot.day][slot.period + j] = {
              course_id: course.id,
              teacher_id: groupCourse.teacher_id,
              session_type: 'lab',
              duration_periods: 2,
              is_continuation: j > 0
            };
          }
        }
      }
    });
    
    // Convert schedule to timetable_sessions
    Object.entries(sessionSchedule).forEach(([day, periods]) => {
      Object.entries(periods).forEach(([period, session]) => {
        if (session && !session.is_continuation) {
          timetable_sessions.push({
            id: generateId(),
            timetable_id: timetableId,
            group_id: groupId,
            course_id: session.course_id,
            teacher_id: session.teacher_id,
            day_of_week: parseInt(day),
            period_start_index: parseInt(period),
            duration_periods: session.duration_periods,
            type: session.session_type,
            locked: Math.random() > 0.9, // 10% chance of being locked
            created_at: getDate(-5),
            updated_at: getDate(-5)
          });
        }
      });
    });
  });

  // 11. Audit Logs
  const audit_logs = [
    {
      id: generateId(),
      user_id: adminId,
      action: 'create',
      table_name: 'timetables',
      record_id: Object.values(timetableIds)[0],
      new_values: { status: 'published' },
      performed_by: adminId,
      performed_at: getDate(-5),
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: generateId(),
      user_id: teacherIds['Mathematics'],
      action: 'update',
      table_name: 'group_courses',
      record_id: group_courses[0]?.id,
      old_values: { weekly_theory_periods: 4 },
      new_values: { weekly_theory_periods: 5 },
      performed_by: teacherIds['Mathematics'],
      performed_at: getDate(-3),
      ip_address: '192.168.1.101',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  ];

  // 12. System Reports
  const system_reports = [
    {
      id: generateId(),
      name: 'Student Progress Report - March 2025',
      type: 'academic_report',
      filters: { peer_group: ['secondary'], status: ['active'] },
      generated_at: getDate(-7),
      generated_by: adminId,
      file_path: '/reports/student_progress_march_2025.pdf',
      status: 'completed',
      file_size: 2500000,
      download_count: 5
    },
    {
      id: generateId(),
      name: 'Attendance Summary - Term 1',
      type: 'attendance_summary',
      filters: { role: ['student'], status: ['active'] },
      generated_at: getDate(-2),
      generated_by: adminId,
      file_path: '/reports/attendance_summary_term1.pdf',
      status: 'completed',
      file_size: 1800000,
      download_count: 12
    }
  ];

  // 13. User Permissions
  const user_permissions = [];
  
  // Admin permissions
  ['create', 'read', 'update', 'delete'].forEach(permission => {
    ['users', 'courses', 'timetables', 'reports'].forEach(resource => {
      user_permissions.push({
        id: generateId(),
        user_id: adminId,
        permission: permission,
        resource: resource,
        granted_by: adminId,
        granted_at: getDate(-100)
      });
    });
  });
  
  // Teacher permissions
  Object.values(teacherIds).forEach(teacherId => {
    ['read', 'update'].forEach(permission => {
      ['students', 'grades', 'attendance'].forEach(resource => {
        user_permissions.push({
          id: generateId(),
          user_id: teacherId,
          permission: permission,
          resource: resource,
          granted_by: adminId,
          granted_at: getDate(-90)
        });
      });
    });
  });

  return {
    institutions,
    academic_terms,
    user_groups,
    cohorts,
    sections,
    user_profiles,
    courses,
    group_courses,
    timetables,
    timetable_sessions,
    audit_logs,
    system_reports,
    user_permissions
  };
};

// Helper function to find available time slots
function findAvailableSlot(
  schedule: Record<string, Record<number, any>>, 
  duration: number
): { day: number; period: number } | null {
  
  for (let day = 1; day <= 5; day++) {
    for (let period = 1; period <= 8 - duration + 1; period++) {
      let available = true;
      
      // Check if all required periods are free
      for (let i = 0; i < duration; i++) {
        if (schedule[day][period + i]) {
          available = false;
          break;
        }
      }
      
      if (available) {
        return { day, period };
      }
    }
  }
  
  return null;
}

// Create comprehensive demo data with all required tables
const createComprehensiveDemoData = () => {
  const baseData = generateDemoData();
  
  // Add teacher eligibility matrix
  const teacherEligibilityMatrix: TeacherEligibilityMatrix[] = [
    {
      teacher_id: 'teacher-math',
      teacher_name: 'Mr. Suresh Rao',
      subjects: [
        { course_id: 'course-math', course_title: 'Mathematics', eligible: true },
        { course_id: 'course-science', course_title: 'Science', eligible: false },
        { course_id: 'course-english', course_title: 'English', eligible: false },
        { course_id: 'course-history', course_title: 'History', eligible: false },
        { course_id: 'course-civics', course_title: 'Civics', eligible: false },
        { course_id: 'course-cs', course_title: 'Computer Science', eligible: false },
        { course_id: 'course-art', course_title: 'Art', eligible: false },
        { course_id: 'course-pe', course_title: 'Physical Education', eligible: false }
      ],
      grades: [
        { grade: '6', eligible: true },
        { grade: '7', eligible: true },
        { grade: '8', eligible: true }
      ],
      load_rules: {
        id: 'load-math',
        teacher_id: 'teacher-math',
        max_periods_per_day: 6,
        max_periods_per_week: 30,
        availability: {
          monday: [1,2,3,4,5,6,7,8],
          tuesday: [1,2,3,4,5,6,7,8],
          wednesday: [1,2,3,4,5,6,7,8],
          thursday: [1,2,3,4,5,6,7,8],
          friday: [1,2,3,4,5,6,7,8]
        },
        created_at: getDate(-20),
        updated_at: getDate(-20)
      }
    },
    {
      teacher_id: 'teacher-science',
      teacher_name: 'Dr. Amit Kapoor',
      subjects: [
        { course_id: 'course-math', course_title: 'Mathematics', eligible: false },
        { course_id: 'course-science', course_title: 'Science', eligible: true },
        { course_id: 'course-english', course_title: 'English', eligible: false },
        { course_id: 'course-history', course_title: 'History', eligible: false },
        { course_id: 'course-civics', course_title: 'Civics', eligible: false },
        { course_id: 'course-cs', course_title: 'Computer Science', eligible: true },
        { course_id: 'course-art', course_title: 'Art', eligible: false },
        { course_id: 'course-pe', course_title: 'Physical Education', eligible: false }
      ],
      grades: [
        { grade: '6', eligible: true },
        { grade: '7', eligible: true },
        { grade: '8', eligible: true }
      ],
      load_rules: {
        id: 'load-science',
        teacher_id: 'teacher-science',
        max_periods_per_day: 6,
        max_periods_per_week: 30,
        availability: {
          monday: [1,2,3,4,5,6,7,8],
          tuesday: [1,2,3,4,5,6,7,8],
          wednesday: [1,2,3,4,5,6,7,8],
          thursday: [1,2,3,4,5,6,7,8],
          friday: [1,2,3,4,5,6,7,8]
        },
        created_at: getDate(-20),
        updated_at: getDate(-20)
      }
    },
    {
      teacher_id: 'teacher-english',
      teacher_name: 'Ms. Priya Sharma',
      subjects: [
        { course_id: 'course-math', course_title: 'Mathematics', eligible: false },
        { course_id: 'course-science', course_title: 'Science', eligible: false },
        { course_id: 'course-english', course_title: 'English', eligible: true },
        { course_id: 'course-history', course_title: 'History', eligible: true },
        { course_id: 'course-civics', course_title: 'Civics', eligible: true },
        { course_id: 'course-cs', course_title: 'Computer Science', eligible: false },
        { course_id: 'course-art', course_title: 'Art', eligible: false },
        { course_id: 'course-pe', course_title: 'Physical Education', eligible: false }
      ],
      grades: [
        { grade: '6', eligible: true },
        { grade: '7', eligible: true },
        { grade: '8', eligible: false }
      ],
      load_rules: {
        id: 'load-english',
        teacher_id: 'teacher-english',
        max_periods_per_day: 6,
        max_periods_per_week: 30,
        availability: {
          monday: [1,2,3,4,5,6,7,8],
          tuesday: [1,2,3,4,5,6,7,8],
          wednesday: [1,2,3,4,5,6,7,8],
          thursday: [1,2,3,4,5,6,7,8],
          friday: [1,2,3,4,5,6,7,8]
        },
        created_at: getDate(-20),
        updated_at: getDate(-20)
      }
    },
    {
      teacher_id: 'teacher-history',
      teacher_name: 'Mrs. Maria Fernandez',
      subjects: [
        { course_id: 'course-math', course_title: 'Mathematics', eligible: false },
        { course_id: 'course-science', course_title: 'Science', eligible: false },
        { course_id: 'course-english', course_title: 'English', eligible: false },
        { course_id: 'course-history', course_title: 'History', eligible: true },
        { course_id: 'course-civics', course_title: 'Civics', eligible: true },
        { course_id: 'course-cs', course_title: 'Computer Science', eligible: false },
        { course_id: 'course-art', course_title: 'Art', eligible: false },
        { course_id: 'course-pe', course_title: 'Physical Education', eligible: false }
      ],
      grades: [
        { grade: '6', eligible: false },
        { grade: '7', eligible: true },
        { grade: '8', eligible: true }
      ],
      load_rules: {
        id: 'load-history',
        teacher_id: 'teacher-history',
        max_periods_per_day: 6,
        max_periods_per_week: 30,
        availability: {
          monday: [1,2,3,4,5,6,7,8],
          tuesday: [1,2,3,4,5,6,7,8],
          wednesday: [1,2,3,4,5,6,7,8],
          thursday: [1,2,3,4,5,6,7,8],
          friday: [1,2,3,4,5,6,7,8]
        },
        created_at: getDate(-20),
        updated_at: getDate(-20)
      }
    },
    {
      teacher_id: 'teacher-cs',
      teacher_name: 'Mr. Ravi Iyer',
      subjects: [
        { course_id: 'course-math', course_title: 'Mathematics', eligible: false },
        { course_id: 'course-science', course_title: 'Science', eligible: false },
        { course_id: 'course-english', course_title: 'English', eligible: false },
        { course_id: 'course-history', course_title: 'History', eligible: false },
        { course_id: 'course-civics', course_title: 'Civics', eligible: false },
        { course_id: 'course-cs', course_title: 'Computer Science', eligible: true },
        { course_id: 'course-art', course_title: 'Art', eligible: false },
        { course_id: 'course-pe', course_title: 'Physical Education', eligible: false }
      ],
      grades: [
        { grade: '6', eligible: true },
        { grade: '7', eligible: true },
        { grade: '8', eligible: true }
      ],
      load_rules: {
        id: 'load-cs',
        teacher_id: 'teacher-cs',
        max_periods_per_day: 6,
        max_periods_per_week: 30,
        availability: {
          monday: [1,2,3,4,5,6,7,8],
          tuesday: [1,2,3,4,5,6,7,8],
          wednesday: [1,2,3,4,5,6,7,8],
          thursday: [1,2,3,4,5,6,7,8],
          friday: [1,2,3,4,5,6,7,8]
        },
        created_at: getDate(-20),
        updated_at: getDate(-20)
      }
    },
    {
      teacher_id: 'teacher-arts',
      teacher_name: 'Ms. Neha Mehta',
      subjects: [
        { course_id: 'course-math', course_title: 'Mathematics', eligible: false },
        { course_id: 'course-science', course_title: 'Science', eligible: false },
        { course_id: 'course-english', course_title: 'English', eligible: false },
        { course_id: 'course-history', course_title: 'History', eligible: false },
        { course_id: 'course-civics', course_title: 'Civics', eligible: false },
        { course_id: 'course-cs', course_title: 'Computer Science', eligible: false },
        { course_id: 'course-art', course_title: 'Art', eligible: true },
        { course_id: 'course-pe', course_title: 'Physical Education', eligible: true }
      ],
      grades: [
        { grade: '6', eligible: true },
        { grade: '7', eligible: true },
        { grade: '8', eligible: true }
      ],
      load_rules: {
        id: 'load-arts',
        teacher_id: 'teacher-arts',
        max_periods_per_day: 6,
        max_periods_per_week: 30,
        availability: {
          monday: [1,2,3,4,5,6,7,8],
          tuesday: [1,2,3,4,5,6,7,8],
          wednesday: [1,2,3,4,5,6,7,8],
          thursday: [1,2,3,4,5,6,7,8],
          friday: [1,2,3,4,5,6,7,8]
        },
        created_at: getDate(-20),
        updated_at: getDate(-20)
      }
    }
  ];
  
  // Add slot templates
  const slotTemplates: SlotTemplate[] = [
    {
      id: 'template-standard',
      institution_id: baseData.institutions[0].id,
      name: 'Standard 8-Period Schedule',
      days_per_week: 5,
      periods_per_day: 8,
      bells: {
        '1': '08:30-09:15',
        '2': '09:15-10:00',
        '3': '10:00-10:45',
        '4': '11:00-11:45',
        '5': '11:45-12:30',
        '6': '12:30-13:15',
        '7': '14:00-14:45',
        '8': '14:45-15:30'
      },
      created_at: getDate(-25),
      updated_at: getDate(-25)
    }
  ];
  
  // Add slot template assignments
  const slotTemplateAssignments: SlotTemplateAssignment[] = baseData.cohorts.map(cohort => ({
    id: `assignment-${cohort.id}`,
    slot_template_id: 'template-standard',
    cohort_id: cohort.id,
    section_id: null,
    created_at: getDate(-20),
    slot_template: slotTemplates[0],
    cohort: cohort,
    section: null
  }));
  
  // Add timetables
  const timetables: Timetable[] = [];
  baseData.cohorts.forEach(cohort => {
    cohort.sections?.forEach(section => {
      timetables.push({
        id: `timetable-${section.id}`,
        section_id: section.id,
        academic_term_id: baseData.academic_terms[0].id,
        status: 'draft',
        generated_at: getDate(-5),
        generated_by: baseData.user_profiles[0].id,
        published_at: null,
        published_by: null,
        created_at: getDate(-5),
        updated_at: getDate(-5),
        section: section,
        academic_term: baseData.academic_terms[0],
        sessions: []
      });
    });
  });
  
  return {
    ...baseData,
    teacherEligibilityMatrix,
    slotTemplates,
    slotTemplateAssignments,
    timetables
  };
};

// Export the generated data
export const demoData = createComprehensiveDemoData();

// Export individual tables for easy access
export const {
  institutions,
  academic_terms,
  user_groups,
  user_profiles,
  courses,
  group_courses,
  timetables,
  timetable_sessions,
  audit_logs,
  system_reports,
  user_permissions
} = demoData;

// Export the demo teacher eligibility function
export { getDemoTeacherEligibilityMatrix } from '../data/generateDemoData';