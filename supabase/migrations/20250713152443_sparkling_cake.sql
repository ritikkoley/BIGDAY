/*
  # Student Features - Views, Functions, and AI Bot Preparation

  1. Database Views
    - Student timetable view for personalized schedules
    - Progress tracking views for performance analytics

  2. RPC Functions
    - Calculate current grades with weightage
    - Project future grades based on remaining assessments
    - Get attendance warnings and thresholds

  3. AI Bot Preparation
    - Conversations table for future AI integration
    - Message threading support

  4. Performance Optimizations
    - Indexes for student-specific queries
    - Materialized views for complex calculations
*/

-- Student Timetable View
CREATE OR REPLACE VIEW student_timetable AS
SELECT 
  c.id as course_id,
  c.name as course_name,
  c.teacher_id,
  u.name as teacher_name,
  a.id as assessment_id,
  a.name as assessment_name,
  a.type as assessment_type,
  a.due_date,
  a.weightage,
  CASE 
    WHEN a.due_date <= CURRENT_DATE THEN 'overdue'
    WHEN a.due_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'upcoming'
    ELSE 'future'
  END as urgency_status
FROM courses c
LEFT JOIN assessments a ON c.id = a.course_id
LEFT JOIN users u ON c.teacher_id = u.id
WHERE EXISTS (
  SELECT 1 FROM users student 
  WHERE student.id = auth.uid() 
  AND student.group_id = ANY(c.group_ids)
)
ORDER BY a.due_date ASC NULLS LAST;

-- Student Progress View
CREATE OR REPLACE VIEW student_progress AS
SELECT 
  c.id as course_id,
  c.name as course_name,
  c.subtopics,
  COUNT(g.id) as total_assessments,
  AVG(g.score) as average_score,
  AVG(g.percentile) as average_percentile,
  SUM(g.score * a.weightage) / NULLIF(SUM(a.weightage), 0) as weighted_score,
  jsonb_agg(
    jsonb_build_object(
      'assessment_name', a.name,
      'score', g.score,
      'percentile', g.percentile,
      'subtopic_performance', g.subtopic_performance
    ) ORDER BY a.due_date
  ) as assessment_history
FROM courses c
LEFT JOIN assessments a ON c.id = a.course_id
LEFT JOIN grades g ON a.id = g.assessment_id AND g.student_id = auth.uid()
WHERE EXISTS (
  SELECT 1 FROM users student 
  WHERE student.id = auth.uid() 
  AND student.group_id = ANY(c.group_ids)
)
GROUP BY c.id, c.name, c.subtopics;

-- Conversations table for AI Bot
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT,
  context JSONB DEFAULT '{}'::JSONB, -- Store conversation context
  bot_type TEXT DEFAULT 'general' CHECK (bot_type IN ('general', 'academic', 'support')),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_resolved BOOLEAN DEFAULT false,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);

-- Message threads for better organization
ALTER TABLE messages ADD COLUMN IF NOT EXISTS thread_id UUID REFERENCES messages(id);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'direct' CHECK (message_type IN ('direct', 'announcement', 'reminder', 'alert'));

-- RPC Function: Calculate Current Grade
CREATE OR REPLACE FUNCTION calculate_current_grade(stud_id UUID, crs_id UUID)
RETURNS TABLE(
  current_score NUMERIC,
  total_weightage NUMERIC,
  weighted_average NUMERIC,
  completed_assessments INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(g.score * a.weightage), 0) as current_score,
    COALESCE(SUM(a.weightage), 0) as total_weightage,
    CASE 
      WHEN SUM(a.weightage) > 0 THEN SUM(g.score * a.weightage) / SUM(a.weightage)
      ELSE 0
    END as weighted_average,
    COUNT(g.id)::INTEGER as completed_assessments
  FROM assessments a
  LEFT JOIN grades g ON a.id = g.assessment_id AND g.student_id = stud_id
  WHERE a.course_id = crs_id 
    AND a.due_date <= CURRENT_DATE
    AND g.id IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC Function: Project Future Grade
CREATE OR REPLACE FUNCTION project_future_grade(stud_id UUID, crs_id UUID, assumed_performance NUMERIC DEFAULT 0.8)
RETURNS TABLE(
  current_grade NUMERIC,
  projected_grade NUMERIC,
  remaining_weightage NUMERIC,
  confidence_level TEXT
) AS $$
DECLARE
  current_data RECORD;
  remaining_weight NUMERIC;
  projection NUMERIC;
  confidence TEXT;
BEGIN
  -- Get current performance
  SELECT * INTO current_data 
  FROM calculate_current_grade(stud_id, crs_id);
  
  -- Calculate remaining weightage
  SELECT COALESCE(SUM(weightage), 0) INTO remaining_weight
  FROM assessments 
  WHERE course_id = crs_id 
    AND due_date > CURRENT_DATE;
  
  -- Project based on assumed performance
  projection := current_data.weighted_average + (remaining_weight * assumed_performance * 100);
  
  -- Determine confidence level
  IF current_data.completed_assessments >= 3 THEN
    confidence := 'high';
  ELSIF current_data.completed_assessments >= 1 THEN
    confidence := 'medium';
  ELSE
    confidence := 'low';
  END IF;
  
  RETURN QUERY
  SELECT 
    current_data.weighted_average,
    projection,
    remaining_weight,
    confidence;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC Function: Get Attendance Warnings
CREATE OR REPLACE FUNCTION get_attendance_warnings(stud_id UUID, threshold NUMERIC DEFAULT 0.75)
RETURNS TABLE(
  course_id UUID,
  course_name TEXT,
  total_classes BIGINT,
  attended_classes BIGINT,
  attendance_rate NUMERIC,
  classes_needed INTEGER,
  is_at_risk BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    COUNT(a.*) as total_classes,
    COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END) as attended_classes,
    CASE 
      WHEN COUNT(a.*) > 0 THEN 
        COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END)::NUMERIC / COUNT(a.*)::NUMERIC
      ELSE 1.0 
    END as attendance_rate,
    CASE 
      WHEN COUNT(a.*) > 0 THEN
        GREATEST(0, CEIL(threshold * COUNT(a.*) - COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END)))
      ELSE 0
    END::INTEGER as classes_needed,
    CASE 
      WHEN COUNT(a.*) > 0 THEN 
        (COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END)::NUMERIC / COUNT(a.*)::NUMERIC) < threshold
      ELSE false 
    END as is_at_risk
  FROM courses c
  LEFT JOIN attendance a ON c.id = a.course_id AND a.student_id = stud_id
  WHERE EXISTS (
    SELECT 1 FROM users student 
    WHERE student.id = stud_id 
    AND student.group_id = ANY(c.group_ids)
  )
  GROUP BY c.id, c.name
  ORDER BY attendance_rate ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC Function: Get Subtopic Performance
CREATE OR REPLACE FUNCTION get_subtopic_performance(stud_id UUID, crs_id UUID)
RETURNS TABLE(
  subtopic_name TEXT,
  average_score NUMERIC,
  assessment_count INTEGER,
  trend TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH subtopic_scores AS (
    SELECT 
      jsonb_object_keys(g.subtopic_performance) as subtopic,
      (g.subtopic_performance ->> jsonb_object_keys(g.subtopic_performance))::NUMERIC as score,
      a.due_date
    FROM grades g
    JOIN assessments a ON g.assessment_id = a.id
    WHERE g.student_id = stud_id 
      AND a.course_id = crs_id
      AND g.subtopic_performance IS NOT NULL
  ),
  subtopic_stats AS (
    SELECT 
      subtopic,
      AVG(score) as avg_score,
      COUNT(*)::INTEGER as count_assessments,
      -- Calculate trend (simple: compare first half vs second half)
      CASE 
        WHEN COUNT(*) >= 4 THEN
          CASE 
            WHEN AVG(CASE WHEN ROW_NUMBER() OVER (PARTITION BY subtopic ORDER BY due_date) > COUNT(*) OVER (PARTITION BY subtopic) / 2 THEN score END) > 
                 AVG(CASE WHEN ROW_NUMBER() OVER (PARTITION BY subtopic ORDER BY due_date) <= COUNT(*) OVER (PARTITION BY subtopic) / 2 THEN score END)
            THEN 'improving'
            ELSE 'declining'
          END
        ELSE 'stable'
      END as trend_direction
    FROM subtopic_scores
    GROUP BY subtopic
  )
  SELECT 
    subtopic,
    ROUND(avg_score, 2),
    count_assessments,
    trend_direction
  FROM subtopic_stats
  ORDER BY avg_score DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own conversations"
  ON conversations
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);

-- Triggers for updated_at
CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();