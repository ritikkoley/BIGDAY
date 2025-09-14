# Feed System RLS Security Matrix

## Overview

This document defines the Row Level Security (RLS) policies for the School Feed system, ensuring proper data isolation and access control across different user roles and institutions.

## Security Principles

### Multi-Tenant Isolation
- All data scoped by `institution_id`
- No cross-institution data access
- Institution-level feature flags

### Role-Based Access Control
- **Students**: Read-only access to published content
- **Staff/Teachers**: Full content management capabilities
- **Admins**: System-wide management and configuration
- **Parents**: Same as students (read-only)

### Content Visibility Rules
- **Public**: Visible to all institution members
- **Staff Only**: Visible only to staff and admin
- **Grade Specific**: Visible only to specified grades

## Detailed RLS Policy Matrix

### feed_posts Table

| User Role | SELECT | INSERT | UPDATE | DELETE | Conditions |
|-----------|--------|--------|--------|--------|------------|
| **Student** | ✅ | ❌ | ❌ | ❌ | Same institution + published + visibility rules |
| **Parent** | ✅ | ❌ | ❌ | ❌ | Same institution + published + visibility rules |
| **Teacher** | ✅ | ✅ | ✅ | ✅ | Same institution + own posts or admin override |
| **Staff** | ✅ | ✅ | ✅ | ✅ | Same institution + own posts or admin override |
| **Admin** | ✅ | ✅ | ✅ | ✅ | Same institution + all posts |

**Visibility Logic**:
```sql
-- Public posts: visible to all institution members
visibility = 'public'

-- Staff-only posts: visible only to staff/admin
visibility = 'staff_only' AND user_role IN ('teacher', 'admin', 'staff')

-- Grade-specific posts: visible to specified grades
visibility = 'grade_specific' AND user_grade IN (grade_filter)
```

### feed_likes Table

| User Role | SELECT | INSERT | UPDATE | DELETE | Conditions |
|-----------|--------|--------|--------|--------|------------|
| **All Users** | ✅ | ✅ | ✅ | ✅ | Same institution + own likes only |

**Business Rules**:
- Users can only like/unlike their own entries
- One like per user per post (enforced by unique constraint)
- Likes are visible to all institution members

### feed_comments Table

| User Role | SELECT | INSERT | UPDATE | DELETE | Conditions |
|-----------|--------|--------|--------|--------|------------|
| **Student** | ✅ | ❌ | ❌ | ❌ | Same institution + active comments |
| **Parent** | ✅ | ❌ | ❌ | ❌ | Same institution + active comments |
| **Staff** | ✅ | ✅ | ✅ | ✅ | Same institution + own comments or admin |
| **Admin** | ✅ | ✅ | ✅ | ✅ | Same institution + all comments |

**Comment Rules**:
- Only staff can create comments by default
- Students can read all active comments
- Threaded comments supported (max 3 levels)
- Soft delete with status field

### feed_media Table

| User Role | SELECT | INSERT | UPDATE | DELETE | Conditions |
|-----------|--------|--------|--------|--------|------------|
| **All Users** | ✅ | ❌ | ❌ | ❌ | Same institution + via signed URLs |
| **Staff** | ✅ | ✅ | ✅ | ✅ | Same institution + own uploads |
| **Admin** | ✅ | ✅ | ✅ | ✅ | Same institution + all media |

**Media Access Rules**:
- Media served via signed URLs only
- 24-hour URL expiration for security
- Virus scanning required before storage
- Alt text required for accessibility

### feed_categories Table

| User Role | SELECT | INSERT | UPDATE | DELETE | Conditions |
|-----------|--------|--------|--------|--------|------------|
| **All Users** | ✅ | ❌ | ❌ | ❌ | Active categories only |
| **Admin** | ✅ | ✅ | ✅ | ✅ | System-wide category management |

## Policy Implementation Examples

### Student/Parent Read Access
```sql
-- Students can view published posts from their institution
CREATE POLICY "Students can view institution posts"
  ON feed_posts FOR SELECT TO authenticated
  USING (
    institution_id = (SELECT institution_id FROM user_profiles WHERE id = auth.uid())
    AND status = 'published'
    AND (
      visibility = 'public' OR
      (visibility = 'grade_specific' AND 
       (SELECT current_standard FROM user_profiles WHERE id = auth.uid()) = ANY(grade_filter))
    )
  );
```

### Staff Content Management
```sql
-- Staff can manage posts in their institution
CREATE POLICY "Staff can manage posts"
  ON feed_posts FOR ALL TO authenticated
  USING (
    institution_id = (SELECT institution_id FROM user_profiles WHERE id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('teacher', 'admin', 'staff')
    )
  );
```

### Like Management
```sql
-- Users can manage their own likes
CREATE POLICY "Users can manage own likes"
  ON feed_likes FOR ALL TO authenticated
  USING (
    user_id = auth.uid()
    AND institution_id = (SELECT institution_id FROM user_profiles WHERE id = auth.uid())
  );
```

## Security Considerations

### Data Isolation
- **Institution Boundary**: All queries filtered by institution_id
- **Role Enforcement**: User roles validated on every operation
- **Content Filtering**: Visibility rules applied at database level

### Privacy Protection
- **Media Access**: Private bucket with signed URLs
- **User Data**: No PII in post content without consent
- **Audit Trail**: All create/update/delete operations logged

### Performance Security
- **Query Limits**: Pagination enforced to prevent large data dumps
- **Rate Limiting**: API rate limits per user role
- **Index Optimization**: Indexes support security-filtered queries

## Testing RLS Policies

### Role Impersonation Tests
```sql
-- Test student access (should only see own institution)
SET ROLE 'student_user';
SELECT COUNT(*) FROM feed_posts; -- Should only see own institution

-- Test cross-institution isolation
SET ROLE 'teacher_user_inst_a';
SELECT COUNT(*) FROM feed_posts WHERE institution_id = 'inst-b'; -- Should return 0

-- Test staff content management
SET ROLE 'staff_user';
INSERT INTO feed_posts (title, body, institution_id, created_by) 
VALUES ('Test Post', 'Test content', 'own-institution', auth.uid()); -- Should succeed
```

### Validation Queries
```sql
-- Verify no orphaned data
SELECT COUNT(*) FROM feed_posts p
LEFT JOIN institutions i ON p.institution_id = i.id
WHERE i.id IS NULL;

-- Verify RLS policy coverage
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE schemaname = 'public' AND tablename LIKE 'feed_%';
```

## Compliance & Audit

### Audit Requirements
- All post create/update/delete operations logged
- Media upload/access events tracked
- User consent for content featuring students
- Data retention compliance with institutional policies

### NAAC Export Considerations
- Posts categorized for accreditation reporting
- Media files included in export packages
- Metadata preserved for compliance verification
- Export audit trail maintained

This RLS matrix ensures secure, multi-tenant operation of the feed system while maintaining performance and usability.