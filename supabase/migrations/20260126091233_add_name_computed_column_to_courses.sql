/*
  # Add name computed column to courses

  This adds a `name` column to courses that is computed from `title`
  for backward compatibility with frontend code that references `name`.

  ## Changes
  - Adds `name` generated column to courses table (stored, computed from title)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'name'
  ) THEN
    ALTER TABLE courses ADD COLUMN name text GENERATED ALWAYS AS (title) STORED;
  END IF;
END $$;
