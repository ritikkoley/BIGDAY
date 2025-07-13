/*
  # RPC Functions for Analytics and Calculations

  1. Percentile Calculation
    - Calculate percentiles for grades within an assessment
    - Update grades table with calculated percentiles

  2. Attendance Analytics
    - Calculate attendance rates and trends
    - Generate attendance summaries

  3. Performance Analytics
    - Student performance across courses
    - Course performance analytics
*/

-- Function to calculate percentiles for an assessment
CREATE OR REPLACE FUNCTION calculate_percentiles(assess_id UUID)
RETURNS void AS $$
BEGIN
  -- Update percentiles based on scores within the assessment
  UPDATE grades 
  SET percentile = subquery.percentile
  FROM (
    SELECT 
      id,
      PERCENT_RANK() OVER (ORDER BY score) * 100 as percentile
    FROM grades 
    WHERE assessment_id = assess_id
  ) AS subquery
  WHERE grades.id = subquery.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get student attendance summary
CREATE OR REPLACE FUNCTION get_attendance_summary(student_uuid UUID, course_uuid UUID DEFAULT NULL)
RETURNS TABLE(
  course_id UUID,
  course_name TEXT,
  total_classes BIGINT,
  present_count BIGINT,
  absent_count BIGINT,
  late_count BIGINT,
  attendance_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as course_id,
    c.name as course_name,
    COUNT(a.*) as total_classes,
    COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count,
    COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_count,
    COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late_count,
    CASE 
      WHEN COUNT(a.*) > 0 THEN 
        ROUND((COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END)::NUMERIC / COUNT(a.*)::NUMERIC) * 100, 2)
      ELSE 0 
    END as attendance_rate
  FROM courses c
  LEFT JOIN attendance a ON c.id = a.course_id AND a.student_id = student_uuid
  WHERE (course_uuid IS NULL OR c.id = course_uuid)
    AND (course_uuid IS NOT NULL OR EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = student_uuid 
      AND u.group_id = ANY(c.group_ids)
    ))
  GROUP BY c.id, c.name
  ORDER BY c.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get student grade summary
CREATE OR REPLACE FUNCTION get_grade_summary(student_uuid UUID, course_uuid UUID DEFAULT NULL)
RETURNS TABLE(
  course_id UUID,
  course_name TEXT,
  total_assessments BIGINT,
  average_score NUMERIC,
  average_percentile NUMERIC,
  weighted_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as course_id,
    c.name as course_name,
    COUNT(g.*) as total_assessments,
    ROUND(AVG(g.score), 2) as average_score,
    ROUND(AVG(g.percentile), 2) as average_percentile,
    ROUND(SUM(g.score * a.weightage) / NULLIF(SUM(a.weightage), 0), 2) as weighted_score
  FROM courses c
  LEFT JOIN assessments a ON c.id = a.course_id
  LEFT JOIN grades g ON a.id = g.assessment_id AND g.student_id = student_uuid
  WHERE (course_uuid IS NULL OR c.id = course_uuid)
    AND (course_uuid IS NOT NULL OR EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = student_uuid 
      AND u.group_id = ANY(c.group_ids)
    ))
  GROUP BY c.id, c.name
  ORDER BY c.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get course performance analytics (for teachers)
CREATE OR REPLACE FUNCTION get_course_analytics(course_uuid UUID)
RETURNS TABLE(
  total_students BIGINT,
  average_attendance_rate NUMERIC,
  average_grade NUMERIC,
  grade_distribution JSONB,
  at_risk_students BIGINT
) AS $$
DECLARE
  grade_dist JSONB;
BEGIN
  -- Calculate grade distribution
  SELECT jsonb_object_agg(grade_range, student_count)
  INTO grade_dist
  FROM (
    SELECT 
      CASE 
        WHEN avg_score >= 90 THEN 'A'
        WHEN avg_score >= 80 THEN 'B'
        WHEN avg_score >= 70 THEN 'C'
        WHEN avg_score >= 60 THEN 'D'
        ELSE 'F'
      END as grade_range,
      COUNT(*) as student_count
    FROM (
      SELECT 
        g.student_id,
        AVG(g.score) as avg_score
      FROM grades g
      JOIN assessments a ON g.assessment_id = a.id
      WHERE a.course_id = course_uuid
      GROUP BY g.student_id
    ) student_averages
    GROUP BY grade_range
  ) grade_ranges;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(DISTINCT u.id)
     FROM users u 
     WHERE u.group_id = ANY(
       SELECT c.group_ids FROM courses c WHERE c.id = course_uuid
     ) AND u.role = 'student') as total_students,
    
    (SELECT ROUND(AVG(attendance_rate), 2)
     FROM (
       SELECT 
         (COUNT(CASE WHEN att.status IN ('present', 'late') THEN 1 END)::NUMERIC / 
          NULLIF(COUNT(att.*), 0)::NUMERIC) * 100 as attendance_rate
       FROM users u
       LEFT JOIN attendance att ON u.id = att.student_id AND att.course_id = course_uuid
       WHERE u.group_id = ANY(
         SELECT c.group_ids FROM courses c WHERE c.id = course_uuid
       ) AND u.role = 'student'
       GROUP BY u.id
     ) rates) as average_attendance_rate,
    
    (SELECT ROUND(AVG(g.score), 2)
     FROM grades g
     JOIN assessments a ON g.assessment_id = a.id
     WHERE a.course_id = course_uuid) as average_grade,
    
    COALESCE(grade_dist, '{}'::jsonb) as grade_distribution,
    
    (SELECT COUNT(DISTINCT g.student_id)
     FROM grades g
     JOIN assessments a ON g.assessment_id = a.id
     WHERE a.course_id = course_uuid
     GROUP BY g.student_id
     HAVING AVG(g.score) < 60) as at_risk_students;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent messages for a user
CREATE OR REPLACE FUNCTION get_recent_messages(user_uuid UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
  id UUID,
  sender_name TEXT,
  subject TEXT,
  content TEXT,
  priority TEXT,
  read_at TIMESTAMP,
  created_at TIMESTAMP,
  is_group_message BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    u.name as sender_name,
    m.subject,
    m.content,
    m.priority,
    m.read_at,
    m.created_at,
    (m.group_id IS NOT NULL) as is_group_message
  FROM messages m
  JOIN users u ON m.sender_id = u.id
  WHERE m.recipient_id = user_uuid 
    OR (m.group_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM users recipient 
      WHERE recipient.id = user_uuid 
      AND recipient.group_id = m.group_id
    ))
  ORDER BY m.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;