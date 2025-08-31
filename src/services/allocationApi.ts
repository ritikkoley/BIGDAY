import { supabase } from '../lib/supabase';
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
      console.warn('Academic terms table not found, using fallback data');
      return [
        {
          id: 'fallback-term-1',
          name: '2025 Term 1',
          start_date: '2025-01-01',
          end_date: '2025-06-30',
          frozen: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
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
      console.warn('Cohorts table not found, using fallback data');
      return [
        {
          id: 'fallback-cohort-1',
          academic_term_id: 'fallback-term-1',
          stream: 'Science',
          grade: '8',
          boarding_type: 'day_scholar',
          periods_per_day: 8,
          days_per_week: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          academic_term: {
            id: 'fallback-term-1',
            name: '2025 Term 1',
            start_date: '2025-01-01',
            end_date: '2025-06-30',
            frozen: false
          },
          sections: [
            {
              id: 'fallback-section-1',
              cohort_id: 'fallback-cohort-1',
              name: '8A',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        }
      ];
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
      // Create mock cohort for demo purposes
      const mockCohort: Cohort = {
        id: `cohort-${Date.now()}`,
        institution_id: cohort.institution_id,
        academic_term_id: cohort.academic_term_id,
        stream: cohort.stream,
        grade: cohort.grade,
        boarding_type: cohort.boarding_type,
        periods_per_day: cohort.periods_per_day || 8,
        days_per_week: cohort.days_per_week || 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return mockCohort;
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
      // Return mock updated cohort when table doesn't exist
      const mockCohort: Cohort = {
        id: id,
        institution_id: 'mock-institution',
        academic_term_id: updates.academic_term_id || 'fallback-term-1',
        stream: updates.stream || 'Mock Stream',
        grade: updates.grade || '8',
        boarding_type: updates.boarding_type || 'day_scholar',
        periods_per_day: updates.periods_per_day || 8,
        days_per_week: updates.days_per_week || 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return mockCohort;
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
      // Silently succeed for demo purposes when table doesn't exist
      console.log('Cohort deletion simulated (table not available)');
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
      console.warn('Sections table not found, using fallback data');
      return [];
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
      console.warn('Courses table not found, using fallback data');
      return [
        {
          id: 'fallback-course-1',
          code: 'MATH101',
          title: 'Mathematics',
          subject_type: 'theory',
          weekly_theory_periods: 4,
          weekly_lab_periods: 0,
          lab_block_size: 2,
          constraints: {},
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'fallback-course-2',
          code: 'PHY101',
          title: 'Physics',
          subject_type: 'mixed',
          weekly_theory_periods: 3,
          weekly_lab_periods: 1,
          lab_block_size: 2,
          constraints: {},
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
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
      // Get institution ID
      const { data: institutions } = await supabase
        .from('institutions')
        .select('id')
        .limit(1);
      
      const institutionId = institutions?.[0]?.id;
      if (!institutionId) {
        // Create mock course for demo purposes
        const mockCourse: Course = {
          id: `course-${Date.now()}`,
          institution_id: 'mock-institution',
          code: course.code,
          title: course.title,
          subject_type: course.subject_type,
          weekly_theory_periods: course.weekly_theory_periods || 0,
          weekly_lab_periods: course.weekly_lab_periods || 0,
          lab_block_size: course.lab_block_size || 2,
          constraints: course.constraints || {},
          active: course.active !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return mockCourse;
      }

      const { data, error } = await supabase
        .from('courses')
        .insert({
          ...course,
          institution_id: institutionId
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      // Create mock course for demo purposes when table doesn't exist
      const mockCourse: Course = {
        id: `course-${Date.now()}`,
        institution_id: 'mock-institution',
        code: course.code,
        title: course.title,
        subject_type: course.subject_type,
        weekly_theory_periods: course.weekly_theory_periods || 0,
        weekly_lab_periods: course.weekly_lab_periods || 0,
        lab_block_size: course.lab_block_size || 2,
        constraints: course.constraints || {},
        active: course.active !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return mockCourse;
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
      // Return mock updated course when table doesn't exist
      const mockCourse: Course = {
        id: id,
        institution_id: 'mock-institution',
        code: updates.code || 'MOCK101',
        title: updates.title || 'Mock Course',
        subject_type: updates.subject_type || 'theory',
        weekly_theory_periods: updates.weekly_theory_periods || 0,
        weekly_lab_periods: updates.weekly_lab_periods || 0,
        lab_block_size: updates.lab_block_size || 2,
        constraints: updates.constraints || {},
        active: updates.active !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return mockCourse;
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
      // Silently succeed for demo purposes when table doesn't exist
      console.log('Course deletion simulated (table not available)');
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
      console.warn('Section courses table not found, using fallback data');
      return [];
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
      console.warn('Teacher eligibility tables not found, using fallback data');
      return [];
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
      console.warn('Slot templates table not found, using fallback data');
      return [
        {
          id: 'fallback-template-1',
          name: 'Standard 8-Period Day',
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
        }
      ];
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
      console.warn('Slot template assignments table not found, using fallback data');
      return [];
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
      console.warn('Timetables table not found, using fallback data');
      return [];
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
      console.warn('Timetable sessions table not found, using fallback data');
      return [];
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
      throw new Error('Timetable generation requires database migration. Please apply the allocation system migration.');
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
      console.warn('Allocation settings table not found, using fallback data');
      return {
        id: 'fallback-settings',
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