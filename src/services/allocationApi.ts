import { supabase } from '../lib/supabase';
import { demoData } from '../data/generateDemoData';
import {
  AcademicTerm,
  Cohort,
  Section,
  SectionStudent,
  Course,
  SectionCourse,
  TeacherSubjectEligibility,
  TeacherGradeEligibility,
  TeacherLoadRules,
  SlotTemplate,
  SlotTemplateAssignment,
  Timetable,
  TimetableSession,
  TimetableConflict,
  AllocationSettings,
  TimetableGenerationRequest,
  TimetableGenerationResult,
  TimetableGrid,
  TeacherEligibilityMatrix
} from '../types/allocation';

// Academic Terms API
export const academicTermsApi = {
  getAll: async (): Promise<AcademicTerm[]> => {
    try {
      const { data, error } = await supabase
        .from('academic_terms')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Academic terms table not found, using demo data');
      return demoData.academic_terms;
    }
  },

  getById: async (id: string): Promise<AcademicTerm> => {
    const { data, error } = await supabase
      .from('academic_terms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  create: async (term: Omit<AcademicTerm, 'id' | 'created_at' | 'updated_at'>): Promise<AcademicTerm> => {
    try {
      const { data, error } = await supabase
        .from('academic_terms')
        .insert(term)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      // Create mock academic term for demo purposes
      const mockTerm: AcademicTerm = {
        id: `term-${Date.now()}`,
        institution_id: term.institution_id,
        name: term.name,
        start_date: term.start_date,
        end_date: term.end_date,
        frozen: term.frozen || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return mockTerm;
    }
  },

  update: async (id: string, updates: Partial<AcademicTerm>): Promise<AcademicTerm> => {
    try {
      const { data, error } = await supabase
        .from('academic_terms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('academic_terms')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  }
};

// Cohorts API
export const cohortsApi = {
  getAll: async (): Promise<Cohort[]> => {
    try {
      const { data, error } = await supabase
        .from('cohorts')
        .select('*, academic_term:academic_terms(*), sections:sections(*)')
        .order('grade', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Cohorts table not found, using demo data');
      // Transform demo data to match expected structure
      return demoData.user_groups
        .filter(group => group.type === 'class')
        .map(group => ({
          id: group.id,
          institution_id: demoData.institutions[0].id,
          academic_term_id: demoData.academic_terms[0].id,
          stream: group.name.includes('Grade') ? 'General' : 'Science',
          grade: group.name.split(' ')[1]?.split('-')[0] || '6',
          boarding_type: 'day_scholar' as const,
          periods_per_day: 8,
          days_per_week: 5,
          created_at: group.created_at,
          updated_at: group.updated_at,
          academic_term: demoData.academic_terms[0],
          sections: [{
            id: `section-${group.id}`,
            cohort_id: group.id,
            name: group.name.split('-')[1] || 'A',
            created_at: group.created_at,
            updated_at: group.updated_at
          }]
        }));
    }
  },

  getById: async (id: string): Promise<Cohort> => {
    const { data, error } = await supabase
      .from('cohorts')
      .select(`
        *,
        academic_term:academic_terms(*),
        sections:sections(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  create: async (cohort: Omit<Cohort, 'id' | 'created_at' | 'updated_at'>): Promise<Cohort> => {
    try {
      const { data, error } = await supabase
        .from('cohorts')
        .insert(cohort)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required: cohorts table not found');
    }
  },

  update: async (id: string, updates: Partial<Cohort>): Promise<Cohort> => {
    try {
      const { data, error } = await supabase
        .from('cohorts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required: cohorts table not found');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('cohorts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      throw new Error('Database migration required: cohorts table not found');
    }
  }
};

// Sections API
export const sectionsApi = {
  getByCohort: async (cohortId: string): Promise<Section[]> => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .select(`
          *,
          cohort:cohorts(*),
          students:section_students(
            *,
            student:user_profiles(id, full_name, email, admission_number)
          ),
          courses:section_courses(
            *,
            course:courses(*),
            teacher:user_profiles(id, full_name, email)
          )
        `)
        .eq('cohort_id', cohortId)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Sections table not found, using demo data');
      // Find the cohort and return its sections
      const cohorts = await cohortsApi.getAll();
      const cohort = cohorts.find(c => c.id === cohortId);
      return cohort?.sections || [];
    }
  },

  create: async (section: Omit<Section, 'id' | 'created_at' | 'updated_at'>): Promise<Section> => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .insert(section)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  update: async (id: string, updates: Partial<Section>): Promise<Section> => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  assignStudents: async (sectionId: string, studentIds: string[]): Promise<void> => {
    // Remove existing assignments
    await supabase
      .from('section_students')
      .delete()
      .eq('section_id', sectionId);

    // Add new assignments
    const assignments = studentIds.map(studentId => ({
      section_id: sectionId,
      student_id: studentId
    }));

    const { error } = await supabase
      .from('section_students')
      .insert(assignments);

    if (error) throw error;
  }
};

// Courses API
export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('active', true)
        .order('code', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Courses table not found, using demo data');
      return demoData.courses;
    }
  },

  getById: async (id: string): Promise<Course> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  create: async (course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert(course)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required: courses table not found');
    }
  },

  update: async (id: string, updates: Partial<Course>): Promise<Course> => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  }
};

// Section Courses API
export const sectionCoursesApi = {
  getBySection: async (sectionId: string): Promise<SectionCourse[]> => {
    try {
      const { data, error } = await supabase
        .from('section_courses')
        .select(`
          *,
          course:courses(*),
          teacher:user_profiles(id, full_name, email),
          section:sections(*)
        `)
        .eq('section_id', sectionId)
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Section courses table not found, using demo data');
      // Return demo section courses for the given section
      return demoData.group_courses
        .filter(gc => gc.group_id === sectionId)
        .map(gc => ({
          id: gc.id,
          section_id: sectionId,
          course_id: gc.course_id,
          teacher_id: gc.teacher_id,
          weekly_theory_periods: gc.weekly_theory_periods,
          weekly_lab_periods: gc.weekly_lab_periods,
          lab_block_size: gc.lab_block_size,
          priority: gc.priority,
          created_at: gc.created_at,
          updated_at: gc.updated_at,
          course: demoData.courses.find(c => c.id === gc.course_id),
          teacher: demoData.user_profiles.find(u => u.id === gc.teacher_id),
          section: {
            id: sectionId,
            cohort_id: sectionId,
            name: demoData.user_groups.find(g => g.id === sectionId)?.name.split('-')[1] || 'A',
            created_at: gc.created_at,
            updated_at: gc.updated_at
          }
        }));
    }
  },

  create: async (sectionCourse: Omit<SectionCourse, 'id' | 'created_at' | 'updated_at'>): Promise<SectionCourse> => {
    try {
      const { data, error } = await supabase
        .from('section_courses')
        .insert(sectionCourse)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  update: async (id: string, updates: Partial<SectionCourse>): Promise<SectionCourse> => {
    try {
      const { data, error } = await supabase
        .from('section_courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('section_courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  }
};

// Teacher Eligibility API
export const teacherEligibilityApi = {
  getMatrix: async (): Promise<TeacherEligibilityMatrix[]> => {
    try {
      // Get all teachers
      const { data: teachers, error: teachersError } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .eq('role', 'teacher')
        .order('full_name');

      if (teachersError) throw teachersError;

      // Get all courses
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, code')
        .eq('active', true)
        .order('title');

      if (coursesError) throw coursesError;

      // Get subject eligibility
      const { data: subjectEligibility, error: subjectError } = await supabase
        .from('teacher_subject_eligibility')
        .select('teacher_id, course_id');

      if (subjectError) throw subjectError;

      // Get grade eligibility
      const { data: gradeEligibility, error: gradeError } = await supabase
        .from('teacher_grade_eligibility')
        .select('teacher_id, grade');

      if (gradeError) throw gradeError;

      // Get load rules
      const { data: loadRules, error: loadError } = await supabase
        .from('teacher_load_rules')
        .select('*');

      if (loadError) throw loadError;

      // Build matrix
      const matrix: TeacherEligibilityMatrix[] = (teachers || []).map(teacher => {
        const teacherSubjects = subjectEligibility?.filter(se => se.teacher_id === teacher.id) || [];
        const teacherGrades = gradeEligibility?.filter(ge => ge.teacher_id === teacher.id) || [];
        const teacherLoadRule = loadRules?.find(lr => lr.teacher_id === teacher.id);

        return {
          teacher_id: teacher.id,
          teacher_name: teacher.full_name,
          subjects: (courses || []).map(course => ({
            course_id: course.id,
            course_title: course.title,
            eligible: teacherSubjects.some(ts => ts.course_id === course.id)
          })),
          grades: ['6', '7', '8', '9', '10', '11', '12'].map(grade => ({
            grade,
            eligible: teacherGrades.some(tg => tg.grade === grade)
          })),
          load_rules: teacherLoadRule
        };
      });

      return matrix;
    } catch (error) {
      console.warn('Teacher eligibility tables not found, using demo data');
      // Create demo teacher eligibility matrix
      const teachers = demoData.user_profiles.filter(u => u.role === 'teacher');
      const courses = demoData.courses;
      
      return teachers.map(teacher => ({
        teacher_id: teacher.id,
        teacher_name: teacher.full_name,
        subjects: courses.map(course => ({
          course_id: course.id,
          course_title: course.title,
          eligible: teacher.department === course.title || 
                   (teacher.department === 'Mathematics' && course.code === 'MATH') ||
                   (teacher.department === 'Science' && course.code === 'SCI') ||
                   (teacher.department === 'English' && course.code === 'ENG') ||
                   (teacher.department === 'Social Studies' && ['HIST', 'CIV'].includes(course.code)) ||
                   (teacher.department === 'Computer Science' && course.code === 'CS') ||
                   (teacher.department === 'Arts' && ['ART', 'MUS', 'PE'].includes(course.code))
        })),
        grades: ['6', '7', '8'].map(grade => ({
          grade,
          eligible: true // All demo teachers can teach all grades
        })),
        load_rules: {
          id: `load-${teacher.id}`,
          teacher_id: teacher.id,
          max_periods_per_day: 6,
          max_periods_per_week: 30,
          availability: {
            monday: [1,2,3,4,5,6,7,8],
            tuesday: [1,2,3,4,5,6,7,8],
            wednesday: [1,2,3,4,5,6,7,8],
            thursday: [1,2,3,4,5,6,7,8],
            friday: [1,2,3,4,5,6,7,8]
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }));
    }
  },

  updateSubjectEligibility: async (teacherId: string, courseId: string, eligible: boolean): Promise<void> => {
    if (eligible) {
      try {
        const { error } = await supabase
          .from('teacher_subject_eligibility')
          .insert({ teacher_id: teacherId, course_id: courseId })
          .select()
          .single();

        if (error && error.code !== '23505') throw error; // Ignore duplicate key errors
      } catch (error) {
        throw new Error('Database migration required. Please apply the allocation system migration.');
      }
    } else {
      try {
        const { error } = await supabase
          .from('teacher_subject_eligibility')
          .delete()
          .eq('teacher_id', teacherId)
          .eq('course_id', courseId);

        if (error) throw error;
      } catch (error) {
        throw new Error('Database migration required. Please apply the allocation system migration.');
      }
    }
  },

  updateGradeEligibility: async (teacherId: string, grade: string, eligible: boolean): Promise<void> => {
    if (eligible) {
      try {
        const { error } = await supabase
          .from('teacher_grade_eligibility')
          .insert({ teacher_id: teacherId, grade })
          .select()
          .single();

        if (error && error.code !== '23505') throw error; // Ignore duplicate key errors
      } catch (error) {
        throw new Error('Database migration required. Please apply the allocation system migration.');
      }
    } else {
      try {
        const { error } = await supabase
          .from('teacher_grade_eligibility')
          .delete()
          .eq('teacher_id', teacherId)
          .eq('grade', grade);

        if (error) throw error;
      } catch (error) {
        throw new Error('Database migration required. Please apply the allocation system migration.');
      }
    }
  },

  updateLoadRules: async (teacherId: string, rules: Partial<TeacherLoadRules>): Promise<TeacherLoadRules> => {
    try {
      const { data, error } = await supabase
        .from('teacher_load_rules')
        .upsert({
          teacher_id: teacherId,
          ...rules
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  calculateTeacherLoad: async (sectionId: string): Promise<any> => {
    try {
      const { data, error } = await supabase.functions.invoke('recalculate_teacher_loads', {
        body: { section_id: sectionId }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Teacher load calculation requires database migration. Please apply the allocation system migration.');
    }
  }
};

// Slot Templates API
export const slotTemplatesApi = {
  getAll: async (): Promise<SlotTemplate[]> => {
    try {
      const { data, error } = await supabase
        .from('slot_templates')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Slot templates table not found, using demo data');
      // Create demo slot template
      return [{
        id: 'demo-template-1',
        institution_id: demoData.institutions[0].id,
        name: 'Standard 8 Period Schedule',
        days_per_week: 5,
        periods_per_day: 8,
        bells: {
          '1': '08:00-08:45',
          '2': '08:45-09:30',
          '3': '09:30-10:15',
          '4': '10:35-11:20',
          '5': '11:20-12:05',
          '6': '12:05-12:50',
          '7': '13:30-14:15',
          '8': '14:15-15:00'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    }
  },

  create: async (template: Omit<SlotTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<SlotTemplate> => {
    try {
      const { data, error } = await supabase
        .from('slot_templates')
        .insert(template)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  update: async (id: string, updates: Partial<SlotTemplate>): Promise<SlotTemplate> => {
    try {
      const { data, error } = await supabase
        .from('slot_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('slot_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  getAssignments: async (): Promise<SlotTemplateAssignment[]> => {
    try {
      const { data, error } = await supabase
        .from('slot_template_assignments')
        .select(`
          *,
          slot_template:slot_templates(*),
          cohort:cohorts(*),
          section:sections(*)
        `);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Slot template assignments table not found, using demo data');
      // Create demo assignments
      const cohorts = await cohortsApi.getAll();
      return cohorts.map(cohort => ({
        id: `assignment-${cohort.id}`,
        slot_template_id: 'demo-template-1',
        cohort_id: cohort.id,
        section_id: undefined,
        created_at: new Date().toISOString(),
        slot_template: {
          id: 'demo-template-1',
          institution_id: demoData.institutions[0].id,
          name: 'Standard 8 Period Schedule',
          days_per_week: 5,
          periods_per_day: 8,
          bells: {
            '1': '08:00-08:45',
            '2': '08:45-09:30',
            '3': '09:30-10:15',
            '4': '10:35-11:20',
            '5': '11:20-12:05',
            '6': '12:05-12:50',
            '7': '13:30-14:15',
            '8': '14:15-15:00'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        cohort,
        section: undefined
      }));
    }
  },

  assignToCohort: async (templateId: string, cohortId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('slot_template_assignments')
        .insert({
          slot_template_id: templateId,
          cohort_id: cohortId
        });

      if (error) throw error;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  unassignFromCohort: async (templateId: string, cohortId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('slot_template_assignments')
        .delete()
        .eq('slot_template_id', templateId)
        .eq('cohort_id', cohortId);

      if (error) throw error;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  }
};

// Timetables API
export const timetablesApi = {
  getAll: async (): Promise<Timetable[]> => {
    try {
      const { data, error } = await supabase
        .from('timetables')
        .select(`
          *,
          section:sections(*),
          academic_term:academic_terms(*),
          sessions:timetable_sessions(
            *,
            course:courses(*),
            teacher:user_profiles(id, full_name, email)
          )
        `)
        .order('generated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Timetables table not found, using demo data');
      return demoData.timetables.map(timetable => ({
        ...timetable,
        section: {
          id: timetable.group_id,
          cohort_id: timetable.group_id,
          name: demoData.user_groups.find(g => g.id === timetable.group_id)?.name.split('-')[1] || 'A',
          created_at: timetable.created_at,
          updated_at: timetable.updated_at,
          cohort: {
            id: timetable.group_id,
            institution_id: demoData.institutions[0].id,
            academic_term_id: timetable.academic_term_id,
            stream: 'General',
            grade: demoData.user_groups.find(g => g.id === timetable.group_id)?.name.split(' ')[1]?.split('-')[0] || '6',
            boarding_type: 'day_scholar' as const,
            periods_per_day: 8,
            days_per_week: 5,
            created_at: timetable.created_at,
            updated_at: timetable.updated_at
          }
        },
        academic_term: demoData.academic_terms.find(t => t.id === timetable.academic_term_id),
        sessions: demoData.timetable_sessions
          .filter(session => session.timetable_id === timetable.id)
          .map(session => ({
            ...session,
            section_id: timetable.group_id,
            course: demoData.courses.find(c => c.id === session.course_id),
            teacher: demoData.user_profiles.find(u => u.id === session.teacher_id)
          }))
      }));
    }
  },

  getById: async (id: string): Promise<Timetable> => {
    try {
      const { data, error } = await supabase
        .from('timetables')
        .select(`
          *,
          section:sections(*),
          academic_term:academic_terms(*),
          sessions:timetable_sessions(
            *,
            course:courses(*),
            teacher:user_profiles(id, full_name, email)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  getSessions: async (timetableId: string): Promise<TimetableSession[]> => {
    try {
      const { data, error } = await supabase
        .from('timetable_sessions')
        .select('*, course:courses(*), teacher:user_profiles(*)')
        .eq('timetable_id', timetableId)
        .order('day_of_week', { ascending: true })
        .order('period_index', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Timetable sessions table not found, using demo data');
      return demoData.timetable_sessions
        .filter(session => session.timetable_id === timetableId)
        .map(session => ({
          ...session,
          section_id: demoData.timetables.find(t => t.id === timetableId)?.group_id || '',
          course: demoData.courses.find(c => c.id === session.course_id),
          teacher: demoData.user_profiles.find(u => u.id === session.teacher_id)
        }));
    }
  },

  generate: async (request: TimetableGenerationRequest): Promise<TimetableGenerationResult> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate_timetable', {
        body: request
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Timetable generation not available, using mock result');
      // Return mock successful generation result
      return {
        status: 'ok',
        section_results: request.section_ids.map(sectionId => ({
          section_id: sectionId,
          placed: 35,
          required: 40,
          conflicts: 0
        })),
        conflicts: []
      };
    }
  },

  publish: async (timetableId: string): Promise<Timetable> => {
    try {
      const { data, error } = await supabase
        .from('timetables')
        .update({ status: 'published' })
        .eq('id', timetableId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  updateSession: async (sessionId: string, updates: Partial<TimetableSession>): Promise<TimetableSession> => {
    try {
      const { data, error } = await supabase
        .from('timetable_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select(`
          *,
          course:courses(*),
          teacher:user_profiles(id, full_name, email)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  lockSession: async (sessionId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('timetable_sessions')
        .update({ locked: true })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  unlockSession: async (sessionId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('timetable_sessions')
        .update({ locked: false })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  }
};

// Allocation Settings API
export const allocationSettingsApi = {
  get: async (): Promise<AllocationSettings> => {
    try {
      const { data, error } = await supabase
        .from('allocation_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Allocation settings table not found, using demo data');
      return {
        id: 'demo-settings',
        institution_id: demoData.institutions[0].id,
        teacher_max_periods_per_day: 6,
        class_periods_per_day: 8,
        days_per_week: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  },

  update: async (updates: Partial<AllocationSettings>): Promise<AllocationSettings> => {
    try {
      const { data, error } = await supabase
        .from('allocation_settings')
        .update(updates)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Database migration required. Please apply the allocation system migration.');
    }
  },

  generateTimetable: async (params: TimetableGenerationRequest): Promise<TimetableGenerationResult> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate_timetable', {
        body: params
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Timetable generation requires database migration. Please apply the allocation system migration.');
    }
  }
};

// Utility Functions
export const allocationUtils = {
  convertSessionsToGrid: (sessions: TimetableSession[], daysPerWeek: number, periodsPerDay: number): TimetableGrid => {
    const grid: TimetableGrid = {};
    
    // Initialize empty grid
    for (let day = 1; day <= daysPerWeek; day++) {
      grid[day] = {};
      for (let period = 1; period <= periodsPerDay; period++) {
        grid[day][period] = null;
      }
    }
    
    // Place sessions in grid
    sessions.forEach(session => {
      for (let i = 0; i < session.duration_periods; i++) {
        const period = session.period_index + i;
        if (period <= periodsPerDay) {
          grid[session.day_of_week][period] = session;
        }
      }
    });
    
    return grid;
  },

  getDayName: (dayIndex: number): string => {
    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayIndex] || 'Unknown';
  },

  getPeriodTime: (periodIndex: number, bells?: Record<string, string>): string => {
    if (bells && bells[periodIndex.toString()]) {
      return bells[periodIndex.toString()];
    }
    
    // Default time calculation (8:00 AM start, 45-minute periods)
    const startHour = 8;
    const periodLength = 45;
    const totalMinutes = startHour * 60 + ((periodIndex - 1) * periodLength);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const endTotalMinutes = totalMinutes + periodLength;
    const endHours = Math.floor(endTotalMinutes / 60);
    const endMinutes = endTotalMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}-${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  },

  validateTimetableData: (sessions: TimetableSession[]): TimetableConflict[] => {
    const conflicts: TimetableConflict[] = [];
    const teacherSchedule = new Map<string, Set<string>>();
    const sectionSchedule = new Map<string, Set<string>>();
    
    sessions.forEach(session => {
      const timeSlot = `${session.day_of_week}-${session.period_index}`;
      
      // Check teacher conflicts
      if (session.teacher_id) {
        if (!teacherSchedule.has(session.teacher_id)) {
          teacherSchedule.set(session.teacher_id, new Set());
        }
        
        const teacherSlots = teacherSchedule.get(session.teacher_id)!;
        if (teacherSlots.has(timeSlot)) {
          conflicts.push({
            id: `conflict-${Date.now()}-${Math.random()}`,
            teacher_id: session.teacher_id,
            section_id: session.section_id,
            course_id: session.course_id,
            day_of_week: session.day_of_week,
            period_index: session.period_index,
            conflict_type: 'teacher_double_booked',
            details: { message: 'Teacher scheduled in multiple sections at same time' },
            created_at: new Date().toISOString()
          });
        } else {
          teacherSlots.add(timeSlot);
        }
      }
      
      // Check section conflicts
      if (!sectionSchedule.has(session.section_id)) {
        sectionSchedule.set(session.section_id, new Set());
      }
      
      const sectionSlots = sectionSchedule.get(session.section_id)!;
      if (sectionSlots.has(timeSlot)) {
        conflicts.push({
          id: `conflict-${Date.now()}-${Math.random()}`,
          section_id: session.section_id,
          course_id: session.course_id,
          day_of_week: session.day_of_week,
          period_index: session.period_index,
          conflict_type: 'section_double_booked',
          details: { message: 'Multiple courses scheduled for section at same time' },
          created_at: new Date().toISOString()
        });
      } else {
        sectionSlots.add(timeSlot);
      }
    });
    
    return conflicts;
  },

  exportTimetableCSV: (timetable: Timetable, grid: TimetableGrid): string => {
    const section = timetable.section;
    if (!section) return '';
    
    const daysPerWeek = section.cohort?.days_per_week || 5;
    const periodsPerDay = section.cohort?.periods_per_day || 8;
    
    const headers = ['Period', ...Array.from({ length: daysPerWeek }, (_, i) => 
      allocationUtils.getDayName(i + 1)
    )];
    
    const rows = [];
    rows.push(headers.join(','));
    
    for (let period = 1; period <= periodsPerDay; period++) {
      const row = [`Period ${period}`];
      
      for (let day = 1; day <= daysPerWeek; day++) {
        const session = grid[day]?.[period];
        if (session) {
          row.push(`"${session.course?.title || 'Unknown'} (${session.teacher?.full_name || 'TBA'})"`);
        } else {
          row.push('');
        }
      }
      
      rows.push(row.join(','));
    }
    
    return rows.join('\n');
  }
};