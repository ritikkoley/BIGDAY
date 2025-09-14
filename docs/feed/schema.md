# School Feed Schema Documentation

## Overview

The School Feed / Celebration Wall system provides a social media-style platform for sharing school achievements, events, and announcements. The system supports multi-institutional deployment with proper data isolation.

## Entity Relationship Diagram

```
institutions (1) ──────────── (∞) feed_posts
     │                              │
     │                              ├── (∞) feed_likes
     │                              ├── (∞) feed_comments
     │                              └── (∞) feed_media
     │
     └── (∞) user_profiles ──────────┘
```

## Table Specifications

### feed_categories
**Purpose**: Predefined categories for organizing posts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique identifier |
| name | text | NOT NULL | Category name (e.g., "Achievements") |
| description | text | | Category description |
| icon | text | | Lucide icon name |
| color | text | | Hex color code for UI |
| active | boolean | DEFAULT true | Whether category is active |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

**Default Categories**:
- Achievements (Trophy, #F59E0B)
- Sports (Zap, #10B981)
- Cultural Events (Music, #8B5CF6)
- Academics (GraduationCap, #3B82F6)
- Announcements (Megaphone, #EF4444)
- Community (Heart, #EC4899)

### feed_posts
**Purpose**: Main content posts with media and metadata

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique identifier |
| institution_id | uuid | NOT NULL | Institution reference |
| title | text | 3-200 chars | Post title |
| body | text | ≤5000 chars | Post content |
| category_id | uuid | FK to feed_categories | Post category |
| tags | text[] | | Searchable tags |
| event_date | date | | Date of event (if applicable) |
| media | jsonb | DEFAULT '[]' | Media file references |
| visibility | text | public/staff_only/grade_specific | Who can see the post |
| grade_filter | text[] | | Grades that can see (if grade_specific) |
| featured | boolean | DEFAULT false | Featured on homepage |
| pinned | boolean | DEFAULT false | Pinned to top of feed |
| status | text | draft/published/archived | Post status |
| created_by | uuid | NOT NULL | Author reference |
| updated_by | uuid | | Last editor reference |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Media JSON Structure**:
```json
[
  {
    "id": "media-uuid",
    "type": "image",
    "filename": "sports_day_2024.jpg",
    "path": "feed-media/inst-123/2024/sports_day_2024.jpg",
    "size": 2048576,
    "mime_type": "image/jpeg",
    "thumbnail_path": "feed-media/inst-123/2024/thumbs/sports_day_2024_thumb.jpg",
    "alt_text": "Students participating in sports day activities"
  }
]
```

### feed_likes
**Purpose**: User likes/reactions on posts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique identifier |
| post_id | uuid | FK to feed_posts | Post reference |
| user_id | uuid | NOT NULL | User who liked |
| institution_id | uuid | NOT NULL | Institution reference |
| created_at | timestamptz | DEFAULT now() | Like timestamp |

**Unique Constraint**: (post_id, user_id) - One like per user per post

### feed_comments
**Purpose**: Comments on posts (staff only by default)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique identifier |
| post_id | uuid | FK to feed_posts | Post reference |
| user_id | uuid | NOT NULL | Commenter reference |
| institution_id | uuid | NOT NULL | Institution reference |
| comment | text | 1-1000 chars | Comment content |
| parent_comment_id | uuid | FK to feed_comments | For threaded comments |
| status | text | active/hidden/deleted | Comment status |
| created_by | uuid | NOT NULL | Author reference |
| updated_by | uuid | | Last editor reference |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

### feed_media
**Purpose**: Media file metadata and storage references

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique identifier |
| post_id | uuid | FK to feed_posts | Post reference |
| institution_id | uuid | NOT NULL | Institution reference |
| filename | text | NOT NULL | Original filename |
| file_path | text | NOT NULL | Storage path |
| file_size | bigint | NOT NULL | File size in bytes |
| mime_type | text | NOT NULL | MIME type |
| media_type | text | image/video/document/audio | Media category |
| thumbnail_path | text | | Thumbnail path (for videos/docs) |
| alt_text | text | | Accessibility description |
| uploaded_by | uuid | NOT NULL | Uploader reference |
| created_at | timestamptz | DEFAULT now() | Upload timestamp |

## Performance Indexes

### Primary Indexes
- `idx_feed_posts_institution_created` - Fast feed scrolling
- `idx_feed_posts_category_status` - Category filtering
- `idx_feed_posts_featured_pinned` - Homepage content
- `idx_feed_posts_search` - Full-text search

### Secondary Indexes
- `idx_feed_likes_post_user` - Like status checking
- `idx_feed_comments_post_created` - Comment threading
- `idx_feed_media_post` - Media loading

## Row Level Security Matrix

| Table | Role | SELECT | INSERT | UPDATE | DELETE | Conditions |
|-------|------|--------|--------|--------|--------|------------|
| feed_posts | Student | ✅ | ❌ | ❌ | ❌ | Same institution, published, visibility rules |
| feed_posts | Teacher/Staff | ✅ | ✅ | ✅ | ✅ | Same institution |
| feed_posts | Admin | ✅ | ✅ | ✅ | ✅ | Same institution |
| feed_likes | All Users | ✅ | ✅ | ✅ | ✅ | Same institution, own likes only |
| feed_comments | Student | ✅ | ❌ | ❌ | ❌ | Same institution, active comments |
| feed_comments | Staff | ✅ | ✅ | ✅ | ✅ | Same institution |
| feed_media | All Users | ✅ | ❌ | ❌ | ❌ | Same institution |
| feed_media | Staff | ✅ | ✅ | ✅ | ✅ | Same institution |

## Data Validation Rules

### Post Validation
- Title: 3-200 characters
- Body: Maximum 5000 characters
- Tags: Maximum 10 tags per post
- Media: Maximum 10 files per post
- Event date: Cannot be more than 1 year in the future

### Comment Validation
- Comment: 1-1000 characters
- Threading: Maximum 3 levels deep
- Rate limiting: 10 comments per user per hour

### Media Validation
- File size: Maximum 50MB per file
- Supported types: Images (JPEG, PNG, WebP), Videos (MP4, WebM), Documents (PDF, DOC, DOCX)
- Virus scanning: Required before storage
- Alt text: Required for images (accessibility)

## Storage Policies

### Data Retention
- **Published posts**: Retained indefinitely
- **Draft posts**: Auto-delete after 30 days
- **Deleted posts**: Soft delete with 90-day recovery window
- **Media files**: Retained for post lifetime + 1 year
- **Comments**: Retained with post
- **Likes**: Retained with post

### Storage Optimization
- **Image compression**: Automatic thumbnail generation
- **Video processing**: Thumbnail extraction and compression
- **Document preview**: PDF thumbnail generation
- **CDN integration**: Media served via CDN for performance