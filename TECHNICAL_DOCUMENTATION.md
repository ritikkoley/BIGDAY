# BIG DAY - Technical Documentation

## System Overview

BIG DAY is a comprehensive educational management system built for Delhi Public School, Bhilai. It provides role-based dashboards for students, teachers, and administrators with real-time data synchronization and advanced analytics.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   Edge          │
│   (React/TS)    │◄──►│   Database      │◄──►│   Functions     │
│                 │    │   + Auth        │    │   (Deno)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **State Management**: Zustand with persistence
- **Database & Auth**: Supabase (PostgreSQL + Row Level Security)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Bolt Hosting

## Frontend Architecture

### 1. Project Structure

```
src/
├── components/           # React components
│   ├── admin/           # Admin-specific components
│   │   ├── allocation/  # Timetable allocation system
│   │   ├── AdminOverview.tsx
│   │   ├── PerformanceView.tsx
│   │   ├── DepartmentsView.tsx
│   │   ├── ReportsView.tsx
│   │   └── SettingsView.tsx
│   ├── teacher/         # Teacher-specific components
│   │   ├── TeacherDashboard.tsx
│   │   ├── TeacherAttendance.tsx
│   │   ├── TeacherGrading.tsx
│   │   ├── TeacherResources.tsx
│   │   ├── TeacherMessages.tsx
│   │   └── TeacherQuizzes.tsx
│   ├── student/         # Student-specific components
│   │   ├── Home.tsx
│   │   ├── StudentProgress.tsx
│   │   ├── StudentMessages.tsx
│   │   └── AttendanceWarnings.tsx
│   ├── auth/            # Authentication components
│   │   ├── LoginPage.tsx
│   │   └── ForgotPasswordPage.tsx
│   ├── search/          # Global search functionality
│   │   ├── SearchBar.tsx
│   │   ├── SearchResults.tsx
│   │   └── SearchResultCard.tsx
│   ├── performance/     # Performance analytics
│   │   ├── TeacherPerformanceView.tsx
│   │   ├── HistoricPerformance.tsx
│   │   └── tabs/        # Performance analysis tabs
│   └── portals/         # Main portal components
│       ├── StudentPortal.tsx
│       ├── TeacherPortal.tsx
│       └── AdminPortal.tsx
├── hooks/               # Custom React hooks
│   ├── useDebounce.ts
│   ├── useAnalytics.ts
│   └── useOnClickOutside.ts
├── lib/                 # Utility functions
│   └── supabase.ts      # Supabase client configuration
├── stores/              # Zustand state stores
│   ├── authStore.ts     # Authentication state
│   ├── dataStore.ts     # Application data state
│   ├── searchStore.ts   # Search functionality state
│   └── userStore.ts     # User management state
├── types/               # TypeScript type definitions
│   ├── admin.ts         # Admin-specific types
│   ├── teacher.ts       # Teacher-specific types
│   ├── performance.ts   # Performance metrics types
│   ├── timetable.ts     # Timetable system types
│   └── allocation.ts    # Allocation system types
├── context/             # React context providers
│   └── ThemeContext.tsx # Dark/light theme management
├── data/                # Sample and demo data
│   ├── sampleData.ts    # Student sample data
│   ├── sampleTeacherData.ts
│   ├── sampleAdminData.ts
│   ├── demoData.ts      # Demo accounts and data
│   ├── generateDemoData.ts # Comprehensive demo data generator
│   └── mockUserData.ts  # Mock user records (500 users)
├── services/            # API service layers
│   ├── api.ts           # Mock API service
│   ├── timetableApi.ts  # Timetable management API
│   └── allocationApi.ts # Allocation system API
├── config/              # Configuration files
│   └── branding.ts      # Application branding
└── styles/              # CSS files
    └── index.css        # Global styles with Apple design system
```

### 2. Component Architecture

#### Portal System
The application uses a portal-based architecture with three main entry points:

```typescript
// App.tsx - Main routing logic
<Routes>
  <Route path="/student/*" element={<StudentPortal />} />
  <Route path="/teacher/*" element={<TeacherPortal />} />
  <Route path="/admin/*" element={<AdminPortal />} />
</Routes>
```

Each portal provides:
- **Navigation**: Tab-based navigation with mobile-responsive bottom nav
- **Search**: Global search functionality with role-based permissions
- **Theme**: Dark/light mode toggle
- **Real-time Updates**: Supabase subscriptions for live data

#### State Management Pattern

```typescript
// Zustand stores with persistence
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      role: null,
      signIn: async (email, password) => { /* ... */ },
      signOut: async () => { /* ... */ }
    }),
    { name: 'auth-storage' }
  )
);
```

### 3. Design System

#### Apple-Inspired Design Language
- **Colors**: Custom Apple-inspired color palette with dark mode support
- **Typography**: System fonts (-apple-system, BlinkMacSystemFont)
- **Components**: Consistent design tokens and spacing (8px grid)
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Proper contrast ratios and ARIA labels

#### Key Design Classes
```css
.apple-card {
  @apply bg-white/80 dark:bg-apple-gray-600/80 backdrop-blur-apple 
         rounded-2xl shadow-lg border border-white/20 dark:border-white/10 
         transition-all duration-300 hover:shadow-xl;
}

.apple-button {
  @apply px-4 py-2 bg-apple-blue-500 hover:bg-apple-blue-600 text-white 
         rounded-full font-medium transition-all transform hover:scale-105 
         active:scale-95;
}
```

### 4. Data Flow Architecture

```
User Action → Component → Store → API Service → Supabase → Real-time Updates
     ↑                                                            ↓
     └────────────── UI Update ←── Store Update ←─────────────────┘
```

## Backend Architecture (Supabase)

### 1. Database Schema

#### Core Tables

**User Management**
```sql
user_profiles (
  id uuid PRIMARY KEY,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text CHECK (role IN ('student', 'teacher', 'admin')),
  -- Personal info, academic details, family info
  -- Accommodation & classification
  -- System fields with audit trail
)
```

**Academic Structure**
```sql
academic_terms (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  frozen boolean DEFAULT false
)

cohorts (
  id uuid PRIMARY KEY,
  academic_term_id uuid REFERENCES academic_terms(id),
  stream text NOT NULL,
  grade text NOT NULL,
  boarding_type text CHECK (boarding_type IN ('hosteller', 'day_scholar'))
)

sections (
  id uuid PRIMARY KEY,
  cohort_id uuid REFERENCES cohorts(id),
  name text NOT NULL
)
```

**Course Management**
```sql
courses (
  id uuid PRIMARY KEY,
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  subject_type text CHECK (subject_type IN ('theory', 'lab', 'mixed')),
  weekly_theory_periods int DEFAULT 0,
  weekly_lab_periods int DEFAULT 0,
  lab_block_size int DEFAULT 2
)

section_courses (
  id uuid PRIMARY KEY,
  section_id uuid REFERENCES sections(id),
  course_id uuid REFERENCES courses(id),
  teacher_id uuid REFERENCES user_profiles(id),
  priority int DEFAULT 1
)
```

**Timetable System**
```sql
timetables (
  id uuid PRIMARY KEY,
  section_id uuid REFERENCES sections(id),
  academic_term_id uuid REFERENCES academic_terms(id),
  status text CHECK (status IN ('draft', 'published', 'archived')),
  version int DEFAULT 1
)

timetable_sessions (
  id uuid PRIMARY KEY,
  timetable_id uuid REFERENCES timetables(id),
  section_id uuid REFERENCES sections(id),
  course_id uuid REFERENCES courses(id),
  teacher_id uuid REFERENCES user_profiles(id),
  day_of_week int CHECK (day_of_week BETWEEN 1 AND 7),
  period_index int CHECK (period_index >= 1),
  duration_periods int DEFAULT 1,
  session_type text CHECK (session_type IN ('theory', 'lab')),
  locked boolean DEFAULT false
)
```

#### Advanced Tables

**Teacher Eligibility System**
```sql
teacher_subject_eligibility (
  teacher_id uuid REFERENCES user_profiles(id),
  course_id uuid REFERENCES courses(id),
  UNIQUE(teacher_id, course_id)
)

teacher_grade_eligibility (
  teacher_id uuid REFERENCES user_profiles(id),
  grade text NOT NULL,
  UNIQUE(teacher_id, grade)
)

teacher_load_rules (
  teacher_id uuid REFERENCES user_profiles(id),
  max_periods_per_day int DEFAULT 6,
  max_periods_per_week int DEFAULT 30,
  availability jsonb DEFAULT '{}'
)
```

**Assessment & Grading**
```sql
assessments (
  id uuid PRIMARY KEY,
  course_id uuid REFERENCES courses(id),
  name text NOT NULL,
  type text CHECK (type IN ('quiz', 'midterm', 'final', 'assignment')),
  total_marks int NOT NULL,
  weightage decimal DEFAULT 0.1,
  due_date timestamptz,
  status text CHECK (status IN ('draft', 'published', 'completed'))
)

grades (
  id uuid PRIMARY KEY,
  student_id uuid REFERENCES user_profiles(id),
  assessment_id uuid REFERENCES assessments(id),
  score decimal NOT NULL,
  max_score decimal NOT NULL,
  percentile decimal,
  subtopic_performance jsonb,
  feedback text
)
```

### 2. Row Level Security (RLS)

#### Security Model
```sql
-- Admin can access everything
CREATE POLICY "Admins can manage all data"
  ON table_name FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Teachers can access their students and courses
CREATE POLICY "Teachers can view their students"
  ON user_profiles FOR SELECT TO authenticated
  USING (
    role = 'student' AND EXISTS (
      SELECT 1 FROM section_courses sc
      WHERE sc.teacher_id = auth.uid()
    )
  );

-- Students can only access their own data
CREATE POLICY "Students can view own data"
  ON user_profiles FOR SELECT TO authenticated
  USING (id = auth.uid());
```

### 3. Edge Functions (Serverless)

#### AI Bot Function
```typescript
// supabase/functions/ai_bot/index.ts
Deno.serve(async (req) => {
  const { user_id, message } = await req.json();
  
  // Get conversation history
  const { data: context } = await supabase
    .from('conversations')
    .select('message, response')
    .eq('user_id', user_id)
    .order('timestamp', { ascending: false })
    .limit(5);
  
  // Generate AI response based on context
  let response = generateResponse(message, context);
  
  // Save conversation
  await supabase.from('conversations').insert({
    user_id, message, response
  });
  
  return new Response(JSON.stringify({ response }));
});
```

#### Bulk Operations
```typescript
// supabase/functions/bulk_grading/index.ts
Deno.serve(async (req) => {
  const { assessment_id, grades } = await req.json();
  
  // Insert grades in bulk
  const gradeInserts = grades.map(g => ({
    student_id: g.student_id,
    assessment_id,
    score: g.score,
    max_score: 100
  }));
  
  await supabase.from('grades').insert(gradeInserts);
  
  // Update percentiles using database function
  await supabase.rpc('update_percentiles', { assess_id: assessment_id });
  
  return new Response(JSON.stringify({ success: true }));
});
```

#### Timetable Generation
```typescript
// supabase/functions/generate_timetable/index.ts
Deno.serve(async (req) => {
  const { academic_term_id, section_ids, constraints } = await req.json();
  
  // Complex scheduling algorithm
  const results = [];
  for (const sectionId of section_ids) {
    const result = await generateSectionTimetable(
      supabase, sectionId, academic_term_id, constraints
    );
    results.push(result);
  }
  
  return new Response(JSON.stringify({ 
    status: 'ok', 
    section_results: results 
  }));
});
```

## Frontend Deep Dive

### 1. Authentication System

#### Auth Store (Zustand)
```typescript
interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  role: 'student' | 'teacher' | 'admin' | null;
  
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

// Demo account support
const demoAccounts = {
  'student@dpsb.edu': { role: 'student', name: 'Ritik Koley' },
  'teacher@dpsb.edu': { role: 'teacher', name: 'Anil Kumar Jangir' },
  'admin@dpsb.edu': { role: 'admin', name: 'Admin User' }
};
```

#### Route Protection
```typescript
// App.tsx
<Route 
  path="/student/*" 
  element={
    user && role === 'student' ? 
    <StudentPortal /> : 
    <Navigate to="/login" replace />
  } 
/>
```

### 2. Data Management

#### Data Store (Zustand)
```typescript
interface DataState {
  // Data entities
  profile: UserProfile | null;
  courses: Course[];
  assessments: Assessment[];
  grades: Grade[];
  attendance: Attendance[];
  messages: Message[];
  resources: Resource[];
  
  // Real-time subscriptions
  subscriptions: {
    messages?: RealtimeChannel;
    grades?: RealtimeChannel;
    attendance?: RealtimeChannel;
  };
  
  // CRUD operations
  fetchUserProfile: (userId: string) => Promise<void>;
  createGrade: (grade: GradeInsert) => Promise<void>;
  subscribeToMessages: (userId: string) => void;
}
```

#### Real-time Subscriptions
```typescript
subscribeToMessages: (userId: string) => {
  const messagesSubscription = supabase
    .channel('messages-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'messages',
      filter: `recipient_id=eq.${userId}`
    }, (payload) => {
      get().fetchMessages(userId);
    })
    .subscribe();
}
```

### 3. Component Patterns

#### Portal Components
Each portal follows a consistent pattern:
```typescript
export const StudentPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen apple-gradient">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-1">
          {tabs.map(tab => (
            <button onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && <MobileMenu />}
      </nav>
      
      {/* Main Content */}
      <main className="pt-16 pb-20 md:pb-8">
        {activeTab === 'home' && <Home />}
        {activeTab === 'progress' && <Progress />}
        {/* ... other tabs */}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0">
        {/* Mobile nav buttons */}
      </nav>
    </div>
  );
};
```

#### Search System
```typescript
// Global search with role-based permissions
const SearchBar: React.FC<{ role: UserRole }> = ({ role }) => {
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery.trim()) {
      search(debouncedQuery, role);
    }
  }, [debouncedQuery, role]);
  
  // Role-based placeholder text
  const getPlaceholder = () => {
    switch (role) {
      case 'student': return 'Search courses (e.g., C-1001)';
      case 'teacher': return 'Search students (e.g., S-123456) or courses';
      case 'admin': return 'Search students, teachers, or courses';
    }
  };
};
```

### 4. Performance Optimizations

#### Code Splitting
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
});
```

#### Lazy Loading & Memoization
```typescript
// Heavy components are memoized
const PerformanceChart = React.memo(({ data }) => {
  return <ResponsiveContainer>...</ResponsiveContainer>;
});

// Debounced search
const debouncedQuery = useDebounce(query, 300);
```

## Backend Deep Dive

### 1. Database Design Principles

#### Normalization Strategy
- **3NF Compliance**: All tables follow third normal form
- **Audit Trail**: Every table has created_at, updated_at, created_by, updated_by
- **Soft Deletes**: Status fields instead of hard deletes where appropriate
- **Flexible JSON**: JSONB fields for extensible data (profile_data, constraints)

#### Indexing Strategy
```sql
-- Performance indexes for common queries
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- Full-text search index
CREATE INDEX idx_user_profiles_search ON user_profiles USING gin(
  to_tsvector('english', 
    coalesce(full_name, '') || ' ' || 
    coalesce(email, '') || ' ' || 
    coalesce(admission_number, '')
  )
);

-- Composite indexes for complex queries
CREATE INDEX idx_timetable_sessions_schedule 
  ON timetable_sessions(day_of_week, period_index);
```

### 2. Advanced Features

#### Timetable Allocation System
The system includes a sophisticated timetable generation engine:

**Core Algorithm**:
1. **Constraint Collection**: Gather teacher availability, room constraints, course requirements
2. **Priority Scheduling**: Schedule high-priority courses first (Math, Science)
3. **Lab Block Enforcement**: Ensure lab sessions get contiguous periods
4. **Conflict Detection**: Identify and resolve scheduling conflicts
5. **Optimization**: Spread courses across days, minimize teacher overload

**Key Tables**:
```sql
-- Teacher constraints
teacher_load_rules (
  teacher_id uuid,
  max_periods_per_day int DEFAULT 6,
  availability jsonb -- {"monday": [1,2,3,4,5,6,7,8]}
)

-- Scheduling conflicts
timetable_conflicts (
  teacher_id uuid,
  section_id uuid,
  day_of_week int,
  period_index int,
  conflict_type text, -- 'teacher_double_booked', 'section_double_booked'
  details jsonb
)
```

#### User Management System
Comprehensive user management with:
- **Bulk Operations**: CSV import/export, bulk updates
- **Advanced Search**: Full-text search with filters
- **Audit Logging**: Complete change tracking
- **Role-based Permissions**: Granular access control

### 3. Security Implementation

#### Row Level Security Policies
```sql
-- Students can only see their own data
CREATE POLICY "Students can view own data"
  ON user_profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Teachers can see students in their sections
CREATE POLICY "Teachers can view their students"
  ON user_profiles FOR SELECT TO authenticated
  USING (
    role = 'student' AND EXISTS (
      SELECT 1 FROM section_courses sc
      JOIN section_students ss ON sc.section_id = ss.section_id
      WHERE sc.teacher_id = auth.uid() AND ss.student_id = user_profiles.id
    )
  );

-- Admins can access everything
CREATE POLICY "Admins can manage all data"
  ON user_profiles FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));
```

#### Audit System
```sql
-- Automatic audit logging
CREATE OR REPLACE FUNCTION log_user_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id, action, table_name, record_id, 
    old_values, new_values, performed_by
  ) VALUES (
    COALESCE(NEW.id, OLD.id), TG_OP, TG_TABLE_NAME, 
    COALESCE(NEW.id, OLD.id)::text,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END,
    auth.uid()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';
```

### 4. Performance Analytics

#### Database Functions
```sql
-- Calculate projected grades
CREATE OR REPLACE FUNCTION calculate_projected_grade(
  stud_id uuid, 
  crs_id uuid
) RETURNS decimal AS $$
DECLARE
  weighted_avg decimal;
BEGIN
  SELECT 
    SUM((g.score / g.max_score * 100) * a.weightage) / SUM(a.weightage)
  INTO weighted_avg
  FROM grades g
  JOIN assessments a ON g.assessment_id = a.id
  WHERE g.student_id = stud_id AND a.course_id = crs_id;
  
  RETURN COALESCE(weighted_avg, 0);
END;
$$ LANGUAGE plpgsql;

-- Get at-risk students
CREATE OR REPLACE FUNCTION get_at_risk(crs_id uuid)
RETURNS TABLE(student_id uuid, avg_score decimal) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    calculate_projected_grade(up.id, crs_id)
  FROM user_profiles up
  WHERE up.role = 'student'
    AND calculate_projected_grade(up.id, crs_id) < 70;
END;
$$ LANGUAGE plpgsql;
```

## API Layer

### 1. Service Architecture

#### Mock API Service
For development and demo purposes, the system includes a comprehensive mock API:

```typescript
// src/services/api.ts
export const userApi = {
  getAll: async (): Promise<User[]> => { /* Mock implementation */ },
  getById: async (id: string): Promise<User> => { /* ... */ },
  create: async (userData: any): Promise<User> => { /* ... */ },
  update: async (id: string, updates: any): Promise<User> => { /* ... */ },
  delete: async (id: string): Promise<void> => { /* ... */ }
};

export const gradeApi = {
  getByStudent: async (studentId: string) => { /* ... */ },
  bulkUpload: async (assessmentId: string, grades: any[]) => { /* ... */ }
};
```

#### Real Supabase Integration
```typescript
// src/stores/dataStore.ts
export const useDataStore = create<DataState>((set, get) => ({
  fetchGrades: async (studentId: string, courseId?: string) => {
    // Check for demo accounts
    if (studentId.startsWith('student-')) {
      set({ grades: mockGrades, isLoading: false });
      return;
    }
    
    // Real Supabase query
    const { data, error } = await supabase
      .from('grades')
      .select(`
        *,
        assessments!inner(name, course_id, type, total_marks)
      `)
      .eq('student_id', studentId);
    
    if (error) throw error;
    set({ grades: data || [], isLoading: false });
  }
}));
```

### 2. Real-time Features

#### Subscription Management
```typescript
// Centralized subscription management
const subscribeToMessages = (userId: string) => {
  const subscription = supabase
    .channel('messages-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'messages',
      filter: `recipient_id=eq.${userId}`
    }, (payload) => {
      // Refresh messages when changes occur
      fetchMessages(userId);
    })
    .subscribe();
    
  // Store subscription for cleanup
  set({ subscriptions: { ...subscriptions, messages: subscription } });
};
```

## Key Features Implementation

### 1. Student Portal Features

#### Progress Tracking
```typescript
// Visual progress representation with circular progress bars
const ProgressDashboard: React.FC = ({ subjects }) => {
  return (
    <div className="grid gap-6">
      {subjects.map(subject => {
        const averageProgress = calculateAverageProgress(subject.pillars);
        return (
          <div className="apple-card">
            <CircularProgress progress={averageProgress}>
              <span className="text-2xl font-bold">{averageProgress}%</span>
            </CircularProgress>
            {/* Detailed pillar breakdown */}
          </div>
        );
      })}
    </div>
  );
};
```

#### Performance Analytics
```typescript
// AI-powered insights and study recommendations
const performanceMetrics: PerformanceMetrics = {
  currentGrade: "A",
  nextGrade: "S",
  requiredScores: { midterm: 92, final: 94 },
  aiInsights: {
    personalizedPlan: {
      recommendedHours: 6.5,
      focusAreas: ["Quantum Mechanics", "Advanced Calculus"],
      studyTechniques: ["Pomodoro Technique", "Active Recall"]
    },
    behavioralInsights: {
      studyPatterns: {
        optimal: ["Early Morning (6 AM - 9 AM)"],
        suboptimal: ["Post-Lunch Hours"]
      }
    }
  }
};
```

### 2. Teacher Portal Features

#### Grading System
```typescript
// Multiple grading methods: manual entry, bulk upload, Excel import
const TeacherGrading: React.FC = () => {
  const [activeView, setActiveView] = useState<
    'sessions' | 'create-exam' | 'manual-entry' | 'bulk-upload'
  >('sessions');
  
  const handleBulkUpload = async (file: File, examData: any) => {
    // Parse Excel file
    const grades = parseExcelFile(file);
    
    // Call bulk grading edge function
    await supabase.functions.invoke('bulk_grading', {
      body: { assessment_id: examData.id, grades }
    });
  };
};
```

#### Attendance Management
```typescript
// Real-time attendance tracking with session management
const TeacherAttendance: React.FC = () => {
  const handleSaveAttendance = async (
    attendance: { studentId: string; status: AttendanceStatus }[]
  ) => {
    const attendanceInserts = attendance.map(a => ({
      student_id: a.studentId,
      course_id: selectedCourse,
      date: new Date().toISOString().split('T')[0],
      status: a.status,
      marked_by: user.id
    }));
    
    await supabase.from('attendance').insert(attendanceInserts);
  };
};
```

### 3. Admin Portal Features

#### User Management
```typescript
// Advanced user management with bulk operations
const UserManagement: React.FC = () => {
  const handleBulkOperation = async (
    operation: 'create' | 'update' | 'delete' | 'export',
    userIds: string[],
    data?: any
  ) => {
    await supabase.functions.invoke('bulk_user_operations', {
      body: { operation_type: operation, user_ids: userIds, data }
    });
  };
  
  // Advanced search with filters
  const searchUsers = async (criteria: FilterCriteria) => {
    const { data } = await supabase.rpc('search_users', {
      search_term: criteria.search_term,
      filter_role: criteria.role,
      filter_status: criteria.status,
      limit_count: 50
    });
  };
};
```

#### Timetable Allocation System
```typescript
// Sophisticated timetable generation with constraint solving
const AllocationView: React.FC = () => {
  const generateTimetables = async (request: TimetableGenerationRequest) => {
    const result = await supabase.functions.invoke('generate_timetable', {
      body: {
        academic_term_id: request.academic_term_id,
        section_ids: request.section_ids,
        constraints: {
          teacher_max_per_day_default: 6,
          enforce_lab_blocks: true,
          spread_course_days: true
        }
      }
    });
    
    return result.data as TimetableGenerationResult;
  };
};
```

## Data Flow Examples

### 1. Student Grade Viewing
```
1. Student logs in → AuthStore.signIn()
2. Navigate to grades → StudentPortal sets activeTab='grades'
3. GradesView component mounts → useEffect triggers
4. DataStore.fetchGrades(userId) called
5. Check if demo account → use sample data OR query Supabase
6. Real-time subscription established → subscribeToGrades(userId)
7. Data rendered with interactive charts and distribution graphs
8. New grades auto-update via real-time subscription
```

### 2. Teacher Bulk Grading
```
1. Teacher creates exam → ExamCreationForm
2. Upload Excel file → BulkGradeUpload component
3. File parsed client-side → extract student IDs and scores
4. Call bulk_grading edge function → Supabase function
5. Function validates data → inserts grades in batch
6. Percentiles calculated → update_percentiles database function
7. Real-time updates sent → all affected students notified
8. UI refreshes automatically → shows updated grades
```

### 3. Admin Timetable Generation
```
1. Admin selects sections → GeneratePage component
2. Configure constraints → teacher limits, lab blocks, etc.
3. Call generate_timetable function → complex scheduling algorithm
4. Algorithm processes:
   - Teacher availability matrices
   - Course period requirements
   - Lab block constraints
   - Conflict detection and resolution
5. Generated sessions inserted → timetable_sessions table
6. Conflicts logged → timetable_conflicts table
7. Results displayed → success rates, conflict reports
8. Manual adjustments possible → ReviewAdjustPage
```

## Development Workflow

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run type-check

# Run tests
npm run test

# Build for production
npm run build
```

### 2. Database Migrations
```bash
# Migrations are in supabase/migrations/
# Applied in chronological order:
20250830114948_mute_bridge.sql      # User management system
20250830125503_young_sound.sql      # Basic timetable tables
20250831095333_morning_meadow.sql   # Allocation system foundation
20250831102836_patient_moon.sql     # Complete allocation schema
20250831103445_holy_cherry.sql      # Demo data seeding
20250831105539_morning_cliff.sql    # Additional allocation tables
20250831112048_gentle_glade.sql     # Comprehensive demo data
```

### 3. Demo Data System
The application includes a sophisticated demo data system:

```typescript
// Realistic demo data generation
export const generateMockUsers = (): MockUserRecord[] => {
  // Generates 500 realistic user records
  // 400 students, 60 teachers, 25 staff, 15 admin
  // Proper distribution across grades, departments, accommodation types
};

// Demo accounts for immediate testing
const demoAccounts = {
  'student@dpsb.edu': 'student123',
  'teacher@dpsb.edu': 'teacher123', 
  'admin@dpsb.edu': 'admin123'
};
```

## Deployment & Production

### 1. Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
});
```

### 2. Environment Variables
```bash
# Frontend Environment Variables
VITE_APP_NAME="BIG DAY"
VITE_INSTITUTION_NAME="Delhi Public School, Bhilai"

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Production Considerations
- **Performance**: Code splitting, lazy loading, memoization
- **Security**: RLS policies, input validation, audit logging
- **Scalability**: Efficient queries, proper indexing, real-time subscriptions
- **Monitoring**: Error boundaries, logging, analytics integration
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## Testing Strategy

### 1. Demo Accounts
```typescript
// Built-in demo accounts for testing all roles
const demoCredentials = [
  { role: 'Student', email: 'student@dpsb.edu', password: 'student123' },
  { role: 'Teacher', email: 'teacher@dpsb.edu', password: 'teacher123' },
  { role: 'Admin', email: 'admin@dpsb.edu', password: 'admin123' }
];
```

### 2. Mock Data Integration
- **Seamless Fallback**: Real Supabase queries with mock data fallback
- **Realistic Data**: 500+ mock user records with proper relationships
- **Interactive Demos**: All features work with sample data
- **Performance Testing**: Large datasets for stress testing

## Future Enhancements

### 1. Planned Features
- **Mobile App**: React Native version
- **Advanced Analytics**: Machine learning insights
- **Parent Portal**: Parent access and communication
- **Examination System**: Online exam platform
- **Library Management**: Book and resource tracking

### 2. Technical Improvements
- **Caching Layer**: Redis for performance
- **File Storage**: Enhanced document management
- **Notification System**: Push notifications
- **Offline Support**: PWA capabilities
- **API Rate Limiting**: Enhanced security

This comprehensive system provides a solid foundation for educational management with room for extensive customization and scaling.