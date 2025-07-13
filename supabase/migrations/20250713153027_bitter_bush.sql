/*
  # Teacher Features - RPC Functions and Views

  1. Dashboard Metrics
    - At-risk students identification
    - Top performers calculation
    - Class performance analytics

  2. Grading Functions
    - Bulk grade processing
    - Performance distribution calculations
    - Grade trend analysis

  3. Resource Management
    - File metadata tracking
    - Download analytics

  4. Quiz/Assessment Management
    - Quiz creation and scheduling
    - Question bank management
*/

-- RPC Function: Get At-Risk Students
CREATE OR REPLACE FUNCTION get_at_risk_students(teacher_uuid UUID, threshold NUMERIC DEFAULT 60)
RETURNS TABLE(
  student_id UUID,
  student_name TEXT,
  course_id UUID,
  course_name TEXT,
  average_score NUMERIC,
  attendance_rate NUMERIC,
  risk_factors JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH student_courses AS (
    -- Get courses taught by this teacher
    SELECT 
      c.id as course_id,
      c.name as course_name,
      u.id as student_id,
      u.name as student_name
    FROM courses c
    JOIN users u ON u.group_id = ANY(c.group_ids)
    WHERE c.teacher_id = teacher_uuid
      AND u.role = 'student'
  ),
  grade_data AS (
    -- Calculate average grades
    SELECT 
      sc.student_id,
      sc.course_id,
      COALESCE(AVG(g.score), 0) as avg_score
    FROM student_courses sc
    LEFT JOIN assessments a ON a.course_id = sc.course_id
    LEFT JOIN grades g ON g.assessment_id = a.id AND g.student_id = sc.student_id
    GROUP BY sc.student_id, sc.course_id
  ),
  attendance_data AS (
    -- Calculate attendance rates
    SELECT 
      sc.student_id,
      sc.course_id,
      CASE 
        WHEN COUNT(a.*) > 0 THEN 
          COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END)::NUMERIC / COUNT(a.*)::NUMERIC
        ELSE 1.0 
      END as attendance_rate
    FROM student_courses sc
    LEFT JOIN attendance a ON a.course_id = sc.course_id AND a.student_id = sc.student_id
    GROUP BY sc.student_id, sc.course_id
  )
  SELECT 
    sc.student_id,
    sc.student_name,
    sc.course_id,
    sc.course_name,
    gd.avg_score,
    ad.attendance_rate,
    jsonb_build_object(
      'low_grades', gd.avg_score < threshold,
      'poor_attendance', ad.attendance_rate < 0.75,
      'missing_submissions', EXISTS (
        SELECT 1 FROM assessments a
        LEFT JOIN grades g ON g.assessment_id = a.id AND g.student_id = sc.student_id
        WHERE a.course_id = sc.course_id
          AND a.due_date < CURRENT_DATE
          AND g.id IS NULL
      )
    ) as risk_factors
  FROM student_courses sc
  JOIN grade_data gd ON gd.student_id = sc.student_id AND gd.course_id = sc.course_id
  JOIN attendance_data ad ON ad.student_id = sc.student_id AND ad.course_id = sc.course_id
  WHERE gd.avg_score < threshold
    OR ad.attendance_rate < 0.75
    OR EXISTS (
      SELECT 1 FROM assessments a
      LEFT JOIN grades g ON g.assessment_id = a.id AND g.student_id = sc.student_id
      WHERE a.course_id = sc.course_id
        AND a.due_date < CURRENT_DATE
        AND g.id IS NULL
    )
  ORDER BY gd.avg_score ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC Function: Get Top Performers
CREATE OR REPLACE FUNCTION get_top_performers(teacher_uuid UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
  student_id UUID,
  student_name TEXT,
  course_id UUID,
  course_name TEXT,
  average_score NUMERIC,
  attendance_rate NUMERIC,
  percentile NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH student_courses AS (
    -- Get courses taught by this teacher
    SELECT 
      c.id as course_id,
      c.name as course_name,
      u.id as student_id,
      u.name as student_name
    FROM courses c
    JOIN users u ON u.group_id = ANY(c.group_ids)
    WHERE c.teacher_id = teacher_uuid
      AND u.role = 'student'
  ),
  grade_data AS (
    -- Calculate average grades with percentile
    SELECT 
      sc.student_id,
      sc.course_id,
      COALESCE(AVG(g.score), 0) as avg_score,
      PERCENT_RANK() OVER (PARTITION BY sc.course_id ORDER BY AVG(g.score)) * 100 as percentile
    FROM student_courses sc
    LEFT JOIN assessments a ON a.course_id = sc.course_id
    LEFT JOIN grades g ON g.assessment_id = a.id AND g.student_id = sc.student_id
    GROUP BY sc.student_id, sc.course_id
  ),
  attendance_data AS (
    -- Calculate attendance rates
    SELECT 
      sc.student_id,
      sc.course_id,
      CASE 
        WHEN COUNT(a.*) > 0 THEN 
          COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END)::NUMERIC / COUNT(a.*)::NUMERIC
        ELSE 1.0 
      END as attendance_rate
    FROM student_courses sc
    LEFT JOIN attendance a ON a.course_id = sc.course_id AND a.student_id = sc.student_id
    GROUP BY sc.student_id, sc.course_id
  )
  SELECT 
    sc.student_id,
    sc.student_name,
    sc.course_id,
    sc.course_name,
    gd.avg_score,
    ad.attendance_rate,
    gd.percentile
  FROM student_courses sc
  JOIN grade_data gd ON gd.student_id = sc.student_id AND gd.course_id = sc.course_id
  JOIN attendance_data ad ON ad.student_id = sc.student_id AND ad.course_id = sc.course_id
  WHERE gd.avg_score > 0  -- Only include students with grades
  ORDER BY gd.avg_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC Function: Get Class Performance Metrics
CREATE OR REPLACE FUNCTION get_class_performance(teacher_uuid UUID)
RETURNS TABLE(
  course_id UUID,
  course_name TEXT,
  student_count INTEGER,
  average_score NUMERIC,
  attendance_rate NUMERIC,
  grade_distribution JSONB,
  assessment_completion NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH teacher_courses AS (
    -- Get courses taught by this teacher
    SELECT 
      c.id as course_id,
      c.name as course_name
    FROM courses c
    WHERE c.teacher_id = teacher_uuid
  ),
  course_students AS (
    -- Get students in each course
    SELECT 
      tc.course_id,
      tc.course_name,
      COUNT(DISTINCT u.id) as student_count
    FROM teacher_courses tc
    JOIN users u ON u.group_id = ANY((SELECT group_ids FROM courses WHERE id = tc.course_id))
    WHERE u.role = 'student'
    GROUP BY tc.course_id, tc.course_name
  ),
  grade_metrics AS (
    -- Calculate grade metrics
    SELECT 
      tc.course_id,
      COALESCE(AVG(g.score), 0) as avg_score,
      jsonb_build_object(
        'A', COUNT(CASE WHEN g.score >= 90 THEN 1 END),
        'B', COUNT(CASE WHEN g.score >= 80 AND g.score < 90 THEN 1 END),
        'C', COUNT(CASE WHEN g.score >= 70 AND g.score < 80 THEN 1 END),
        'D', COUNT(CASE WHEN g.score >= 60 AND g.score < 70 THEN 1 END),
        'F', COUNT(CASE WHEN g.score < 60 THEN 1 END)
      ) as grade_dist,
      COUNT(g.id)::NUMERIC / NULLIF(COUNT(DISTINCT a.id) * cs.student_count, 0) as completion_rate
    FROM teacher_courses tc
    JOIN course_students cs ON cs.course_id = tc.course_id
    LEFT JOIN assessments a ON a.course_id = tc.course_id
    LEFT JOIN grades g ON g.assessment_id = a.id
    GROUP BY tc.course_id, cs.student_count
  ),
  attendance_metrics AS (
    -- Calculate attendance metrics
    SELECT 
      tc.course_id,
      CASE 
        WHEN COUNT(a.*) > 0 THEN 
          COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END)::NUMERIC / COUNT(a.*)::NUMERIC
        ELSE 1.0 
      END as attendance_rate
    FROM teacher_courses tc
    LEFT JOIN attendance a ON a.course_id = tc.course_id
    GROUP BY tc.course_id
  )
  SELECT 
    cs.course_id,
    cs.course_name,
    cs.student_count,
    gm.avg_score,
    am.attendance_rate,
    gm.grade_dist,
    gm.completion_rate
  FROM course_students cs
  LEFT JOIN grade_metrics gm ON gm.course_id = cs.course_id
  LEFT JOIN attendance_metrics am ON am.course_id = cs.course_id
  ORDER BY cs.course_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC Function: Get Pending Tasks
CREATE OR REPLACE FUNCTION get_pending_tasks(teacher_uuid UUID)
RETURNS TABLE(
  task_id UUID,
  task_type TEXT,
  course_id UUID,
  course_name TEXT,
  title TEXT,
  due_date TIMESTAMP,
  priority TEXT,
  count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  -- Ungraded assignments
  SELECT 
    a.id as task_id,
    'grading'::TEXT as task_type,
    a.course_id,
    c.name as course_name,
    a.name as title,
    a.due_date,
    CASE 
      WHEN a.due_date < CURRENT_DATE - INTERVAL '7 days' THEN 'high'::TEXT
      WHEN a.due_date < CURRENT_DATE THEN 'medium'::TEXT
      ELSE 'low'::TEXT
    END as priority,
    COUNT(DISTINCT u.id) - COUNT(DISTINCT g.id) as count
  FROM assessments a
  JOIN courses c ON a.course_id = c.id
  JOIN users u ON u.group_id = ANY(c.group_ids) AND u.role = 'student'
  LEFT JOIN grades g ON g.assessment_id = a.id AND g.student_id = u.id
  WHERE c.teacher_id = teacher_uuid
    AND a.due_date <= CURRENT_DATE
  GROUP BY a.id, a.course_id, c.name, a.name, a.due_date
  HAVING COUNT(DISTINCT u.id) > COUNT(DISTINCT g.id)
  
  UNION ALL
  
  -- Upcoming quizzes
  SELECT 
    a.id as task_id,
    'quiz'::TEXT as task_type,
    a.course_id,
    c.name as course_name,
    a.name as title,
    a.due_date,
    CASE 
      WHEN a.due_date < CURRENT_DATE + INTERVAL '1 day' THEN 'high'::TEXT
      WHEN a.due_date < CURRENT_DATE + INTERVAL '3 days' THEN 'medium'::TEXT
      ELSE 'low'::TEXT
    END as priority,
    1 as count
  FROM assessments a
  JOIN courses c ON a.course_id = c.id
  WHERE c.teacher_id = teacher_uuid
    AND a.due_date > CURRENT_DATE
    AND a.due_date <= CURRENT_DATE + INTERVAL '7 days'
    AND a.type = 'quiz'
  
  UNION ALL
  
  -- Missing attendance records
  SELECT 
    gen_random_uuid() as task_id,
    'attendance'::TEXT as task_type,
    c.id as course_id,
    c.name as course_name,
    'Take attendance'::TEXT as title,
    CURRENT_DATE::TIMESTAMP as due_date,
    'medium'::TEXT as priority,
    COUNT(DISTINCT u.id) as count
  FROM courses c
  JOIN users u ON u.group_id = ANY(c.group_ids) AND u.role = 'student'
  LEFT JOIN attendance a ON a.course_id = c.id AND a.student_id = u.id AND a.date = CURRENT_DATE
  WHERE c.teacher_id = teacher_uuid
  GROUP BY c.id, c.name
  HAVING COUNT(DISTINCT u.id) > COUNT(a.id)
  
  ORDER BY due_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC Function: Get Recent Submissions
CREATE OR REPLACE FUNCTION get_recent_submissions(teacher_uuid UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
  student_id UUID,
  student_name TEXT,
  course_id UUID,
  course_name TEXT,
  assessment_id UUID,
  assessment_name TEXT,
  submitted_at TIMESTAMP,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.student_id,
    u.name as student_name,
    c.id as course_id,
    c.name as course_name,
    a.id as assessment_id,
    a.name as assessment_name,
    g.created_at as submitted_at,
    CASE WHEN g.graded_at IS NOT NULL THEN 'graded'::TEXT ELSE 'pending'::TEXT END as status
  FROM grades g
  JOIN assessments a ON g.assessment_id = a.id
  JOIN courses c ON a.course_id = c.id
  JOIN users u ON g.student_id = u.id
  WHERE c.teacher_id = teacher_uuid
  ORDER BY g.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View: Teacher Dashboard Overview
CREATE OR REPLACE VIEW teacher_dashboard AS
SELECT 
  c.id as course_id,
  c.name as course_name,
  c.teacher_id,
  COUNT(DISTINCT u.id) as student_count,
  COUNT(DISTINCT a.id) as assessment_count,
  COALESCE(AVG(g.score), 0) as average_score,
  CASE 
    WHEN COUNT(att.*) > 0 THEN 
      COUNT(CASE WHEN att.status IN ('present', 'late') THEN 1 END)::NUMERIC / COUNT(att.*)::NUMERIC * 100
    ELSE 0 
  END as attendance_rate,
  (
    SELECT COUNT(DISTINCT s.id)
    FROM users s
    LEFT JOIN grades sg ON sg.student_id = s.id
    LEFT JOIN assessments sa ON sg.assessment_id = sa.id
    WHERE s.group_id = ANY(c.group_ids)
      AND s.role = 'student'
      AND sa.course_id = c.id
    GROUP BY s.id
    HAVING COALESCE(AVG(sg.score), 0) < 60
  ) as at_risk_count,
  (
    SELECT COUNT(DISTINCT s.id)
    FROM users s
    LEFT JOIN grades sg ON sg.student_id = s.id
    LEFT JOIN assessments sa ON sg.assessment_id = sa.id
    WHERE s.group_id = ANY(c.group_ids)
      AND s.role = 'student'
      AND sa.course_id = c.id
    GROUP BY s.id
    HAVING COALESCE(AVG(sg.score), 0) >= 90
  ) as top_performers_count
FROM courses c
LEFT JOIN users u ON u.group_id = ANY(c.group_ids) AND u.role = 'student'
LEFT JOIN assessments a ON a.course_id = c.id
LEFT JOIN grades g ON g.assessment_id = a.id
LEFT JOIN attendance att ON att.course_id = c.id
GROUP BY c.id, c.name, c.teacher_id;

-- View: Teacher Class Schedule
CREATE OR REPLACE VIEW teacher_schedule AS
SELECT 
  c.id as course_id,
  c.name as course_name,
  g.name as group_name,
  g.id as group_id,
  COUNT(DISTINCT u.id) as student_count,
  (
    SELECT EXISTS (
      SELECT 1 FROM assessments a
      WHERE a.course_id = c.id
        AND a.due_date = CURRENT_DATE
        AND a.type = 'quiz'
    )
  ) as has_quiz_today,
  CASE 
    WHEN COUNT(att.*) > 0 THEN 
      COUNT(CASE WHEN att.status IN ('present', 'late') THEN 1 END)::NUMERIC / COUNT(att.*)::NUMERIC * 100
    ELSE 0 
  END as attendance_rate
FROM courses c
JOIN groups g ON g.id = ANY(c.group_ids)
LEFT JOIN users u ON u.group_id = g.id AND u.role = 'student'
LEFT JOIN attendance att ON att.course_id = c.id AND att.date = CURRENT_DATE
WHERE c.teacher_id = auth.uid()
GROUP BY c.id, c.name, g.id, g.name;

-- Add updated_at trigger to conversations table
CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for teacher queries
CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assessments_due_date ON assessments(due_date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_grades_created_at ON grades(created_at);