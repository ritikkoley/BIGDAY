/*
  # Authentication Functions

  1. Function to handle user creation after signup
  2. Function to assign roles based on email domain
  3. Trigger to automatically create user profile
*/

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  user_name TEXT;
BEGIN
  -- Determine role based on email domain or default to student
  IF NEW.email LIKE '%@teacher.dpsb.edu' THEN
    user_role := 'teacher';
  ELSIF NEW.email LIKE '%@admin.dpsb.edu' THEN
    user_role := 'admin';
  ELSE
    user_role := 'student';
  END IF;

  -- Extract name from email (before @)
  user_name := split_part(NEW.email, '@', 1);
  user_name := replace(user_name, '.', ' ');
  user_name := initcap(user_name);

  -- Insert user profile
  INSERT INTO public.users (id, name, email, role)
  VALUES (NEW.id, user_name, NEW.email, user_role);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.users
  WHERE id = user_id;
  
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is teacher
CREATE OR REPLACE FUNCTION public.is_teacher(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id AND role = 'teacher'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's group courses
CREATE OR REPLACE FUNCTION public.get_user_courses(user_id UUID)
RETURNS TABLE(
  course_id UUID,
  course_name TEXT,
  course_code TEXT,
  teacher_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.code,
    u.name
  FROM courses c
  JOIN users u ON c.teacher_id = u.id
  WHERE EXISTS (
    SELECT 1 FROM users student
    WHERE student.id = user_id
    AND student.group_id = ANY(c.group_ids)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;