# HPC Demo Pages Specification

## Overview

This document defines the demo pages and sample data for the HPC system, providing reviewers and stakeholders with interactive examples of the complete evaluation workflow.

## 🎯 Demo Routes & Sample Data

### 1. Admin HPC Configuration
**Route**: `/admin/hpc/config`
**Purpose**: Demonstrate parameter and rubric management

**Sample Data**:
```json
{
  "institution": {
    "id": "inst-dps-bhilai",
    "name": "Delhi Public School, Bhilai",
    "settings": {
      "academic_year": "2024-25",
      "hpc_enabled": true,
      "default_language": "english"
    }
  },
  "statistics": {
    "total_parameters": 17,
    "active_parameters": 15,
    "total_rubrics": 85,
    "last_updated": "2025-01-24T10:30:00Z",
    "evaluation_cycles": 3,
    "completed_reports": 245
  },
  "parameters": [
    {
      "id": "hpc-param-001",
      "name": "Mathematics",
      "category": "scholastic",
      "sub_category": "core_subject",
      "weightage": 0.20,
      "description": "Mathematical reasoning, problem-solving, and computational skills",
      "cbse_code": "MATH",
      "grade_applicability": ["5", "6", "7", "8", "9", "10"],
      "evaluation_frequency": "continuous",
      "active": true,
      "assignments": [
        {
          "evaluator_role": "teacher",
          "weightage": 0.70,
          "is_required": true
        },
        {
          "evaluator_role": "parent",
          "weightage": 0.20,
          "is_required": true
        },
        {
          "evaluator_role": "self",
          "weightage": 0.10,
          "is_required": true
        }
      ]
    },
    {
      "id": "hpc-param-002",
      "name": "Creativity & Innovation",
      "category": "co_scholastic",
      "sub_category": "arts_creativity",
      "weightage": 0.15,
      "description": "Creative thinking, artistic expression, and innovative problem-solving",
      "cbse_code": "CREAT",
      "grade_applicability": ["5", "6", "7", "8", "9", "10"],
      "evaluation_frequency": "periodic",
      "active": true,
      "assignments": [
        {
          "evaluator_role": "teacher",
          "weightage": 0.60,
          "is_required": true
        },
        {
          "evaluator_role": "peer",
          "weightage": 0.25,
          "is_required": true
        },
        {
          "evaluator_role": "self",
          "weightage": 0.15,
          "is_required": true
        }
      ]
    }
  ],
  "rubrics": {
    "hpc-param-001": [
      {
        "level": "A+",
        "grade_equivalent": "outstanding",
        "descriptor": "Exceptional mathematical understanding and problem-solving ability",
        "detailed_description": "Demonstrates exceptional mathematical reasoning, solves complex problems independently, and shows deep conceptual understanding",
        "examples": [
          "Solves multi-step problems creatively",
          "Explains mathematical concepts clearly to peers",
          "Makes connections between different mathematical topics"
        ],
        "indicators": [
          "95-100% accuracy in assessments",
          "Helps other students",
          "Shows mathematical creativity"
        ]
      },
      {
        "level": "A",
        "grade_equivalent": "excellent",
        "descriptor": "Strong mathematical skills with good problem-solving ability",
        "detailed_description": "Shows solid mathematical understanding, solves problems systematically, and demonstrates good conceptual grasp",
        "examples": [
          "Solves standard problems accurately",
          "Shows clear working",
          "Understands mathematical concepts well"
        ],
        "indicators": [
          "85-94% accuracy in assessments",
          "Consistent performance",
          "Good mathematical reasoning"
        ]
      }
    ]
  }
}
```

### 2. Teacher Evaluation Input
**Route**: `/teacher/hpc/input/hpc-student-001`
**Purpose**: Show teacher evaluation workflow

**Sample Data**:
```json
{
  "student": {
    "id": "hpc-student-001",
    "full_name": "Aarav Sharma",
    "admission_number": "DPS2024001",
    "current_standard": "5",
    "section": "A",
    "photo_url": "/photos/students/aarav_sharma.jpg",
    "accommodation_type": "day_boarder"
  },
  "teacher": {
    "id": "hpc-teacher-001",
    "full_name": "Dr. Meera Joshi",
    "department": "Mathematics & Science",
    "assigned_parameters": [
      "hpc-param-001",
      "hpc-param-003",
      "hpc-param-005"
    ]
  },
  "evaluation_progress": {
    "total_parameters": 6,
    "completed_parameters": 2,
    "required_parameters": 5,
    "last_saved": "2025-01-24T14:30:00Z"
  },
  "existing_evaluations": [
    {
      "id": "eval-001",
      "parameter_id": "hpc-param-001",
      "score": 4.2,
      "grade": "A",
      "qualitative_remark": "Aarav shows excellent mathematical reasoning and solves problems creatively. He often helps his classmates understand difficult concepts.",
      "evidence_notes": "Scored 95% in recent assessment, completed bonus problems, peer tutoring observed",
      "confidence_level": 0.95,
      "status": "draft",
      "evaluation_date": "2025-01-24T14:30:00Z"
    }
  ],
  "parameters_to_evaluate": [
    {
      "id": "hpc-param-001",
      "name": "Mathematics",
      "category": "scholastic",
      "description": "Mathematical reasoning, problem-solving, and computational skills",
      "current_evaluation": {
        "score": 4.2,
        "grade": "A",
        "status": "draft"
      }
    },
    {
      "id": "hpc-param-002",
      "name": "Creativity & Innovation",
      "category": "co_scholastic",
      "description": "Creative thinking, artistic expression, and innovative problem-solving",
      "current_evaluation": null
    }
  ],
  "evidence_files": [
    {
      "id": "evidence-001",
      "filename": "math_assessment_jan24.pdf",
      "url": "/storage/evidence/math_assessment_jan24.pdf",
      "type": "application/pdf",
      "size": 245760,
      "uploaded_at": "2025-01-24T14:30:00Z"
    }
  ]
}
```

### 3. Student Self-Assessment
**Route**: `/student/hpc/self`
**Purpose**: Demonstrate student self-evaluation interface

**Sample Data**:
```json
{
  "student": {
    "id": "hpc-student-001",
    "full_name": "Aarav Sharma",
    "current_standard": "5",
    "section": "A"
  },
  "reflection_prompts": [
    {
      "id": "mood",
      "question": "How do you feel about your learning this term?",
      "type": "emoji",
      "required": true,
      "options": [
        { "emoji": "😊", "label": "Happy", "value": 5 },
        { "emoji": "😐", "label": "Okay", "value": 3 },
        { "emoji": "😔", "label": "Sad", "value": 2 },
        { "emoji": "🤔", "label": "Confused", "value": 2.5 },
        { "emoji": "💪", "label": "Confident", "value": 4.5 }
      ]
    },
    {
      "id": "strengths",
      "question": "What are you most proud of this term?",
      "type": "text",
      "required": true,
      "placeholder": "Tell us about your achievements and what you did well..."
    },
    {
      "id": "improvements",
      "question": "What would you like to improve next term?",
      "type": "text",
      "required": false,
      "placeholder": "What skills or subjects would you like to work on?"
    },
    {
      "id": "goals",
      "question": "What are your goals for next term?",
      "type": "goals",
      "required": false,
      "suggestions": [
        "Improve in mathematics",
        "Make new friends",
        "Join sports activities",
        "Help classmates more",
        "Read more books",
        "Learn new skills"
      ]
    }
  ],
  "existing_reflection": {
    "mood_rating": 4.5,
    "mood_emoji": "💪",
    "strengths_text": "I am good at solving math puzzles and helping my friends when they don't understand something. I also like drawing and making art projects.",
    "improvements_text": "I want to get better at sports and speaking in front of the class without feeling nervous.",
    "goals": [
      "Improve physical fitness",
      "Help more classmates",
      "Practice public speaking",
      "Join science club"
    ],
    "last_saved": "2025-01-22T16:45:00Z"
  },
  "parameters_for_self_evaluation": [
    {
      "id": "hpc-param-001",
      "name": "Mathematics",
      "student_friendly_description": "How good are you at math and solving number problems?"
    },
    {
      "id": "hpc-param-003",
      "name": "Teamwork & Collaboration",
      "student_friendly_description": "How well do you work with your classmates in groups?"
    }
  ]
}
```

### 4. Parent Feedback Form
**Route**: `/hpc/feedback/hpc-student-001`
**Purpose**: Show parent evaluation interface

**Sample Data**:
```json
{
  "student": {
    "id": "hpc-student-001",
    "full_name": "Aarav Sharma",
    "current_standard": "5",
    "section": "A",
    "relationship": "son"
  },
  "parent": {
    "id": "hpc-parent-001",
    "full_name": "Mr. Rajesh Sharma",
    "relationship": "father",
    "verified": true
  },
  "feedback_parameters": [
    {
      "id": "hpc-param-001",
      "name": "Mathematics",
      "parent_context": "How does your child approach math homework and problem-solving at home?",
      "current_feedback": {
        "score": 4.0,
        "comment": "Aarav enjoys solving math puzzles at home and often explains mathematical concepts to his younger sister."
      }
    },
    {
      "id": "hpc-param-004",
      "name": "Empathy & Compassion",
      "parent_context": "How does your child show care and understanding for family members and others?",
      "current_feedback": null
    },
    {
      "id": "hpc-param-006",
      "name": "Discipline & Responsibility",
      "parent_context": "How responsible is your child with chores, homework, and family duties?",
      "current_feedback": null
    }
  ],
  "submission_status": {
    "completed_parameters": 1,
    "total_parameters": 3,
    "last_updated": "2025-01-20T18:15:00Z",
    "deadline": "2025-01-30T23:59:59Z"
  }
}
```

### 5. Peer Feedback Form
**Route**: `/hpc/feedback/hpc-student-001?evaluator=peer`
**Purpose**: Demonstrate peer evaluation

**Sample Data**:
```json
{
  "student": {
    "id": "hpc-student-001",
    "full_name": "Aarav Sharma",
    "current_standard": "5",
    "section": "A"
  },
  "peer_evaluator": {
    "id": "hpc-student-002",
    "full_name": "Saanvi Patel",
    "current_standard": "5",
    "section": "A",
    "verified_peer": true
  },
  "peer_parameters": [
    {
      "id": "hpc-param-002",
      "name": "Creativity & Innovation",
      "peer_context": "How creative is your classmate in group projects and activities?",
      "simple_description": "Does your friend come up with new and interesting ideas?"
    },
    {
      "id": "hpc-param-003",
      "name": "Teamwork & Collaboration",
      "peer_context": "How well does your classmate work with others in group activities?",
      "simple_description": "Is your friend a good team player who helps everyone?"
    }
  ],
  "existing_feedback": [
    {
      "parameter_id": "hpc-param-002",
      "score": 4.3,
      "comment": "Aarav always comes up with the most interesting ideas during group projects. He thinks of things that nobody else does.",
      "submitted_at": "2025-01-23T11:20:00Z"
    }
  ]
}
```

### 6. Review & Approval Console
**Route**: `/admin/hpc/review/hpc-student-001`
**Purpose**: Show approval workflow interface

**Sample Data**:
```json
{
  "student": {
    "id": "hpc-student-001",
    "full_name": "Aarav Sharma",
    "admission_number": "DPS2024001",
    "current_standard": "5",
    "section": "A",
    "photo_url": "/photos/students/aarav_sharma.jpg"
  },
  "draft_report": {
    "id": "hpc-report-001",
    "version": 1,
    "status": "under_review",
    "overall_grade": "A",
    "overall_score": 4.15,
    "compiled_at": "2025-01-25T09:15:00Z",
    "compiled_by": "Dr. Meera Joshi"
  },
  "raw_evaluations": [
    {
      "parameter_name": "Mathematics",
      "evaluations": [
        {
          "evaluator_role": "teacher",
          "evaluator_name": "Dr. Meera Joshi",
          "score": 4.2,
          "grade": "A",
          "remark": "Excellent mathematical reasoning and problem-solving ability",
          "confidence": 0.95,
          "evidence": "Scored 95% in assessment, completed bonus problems"
        },
        {
          "evaluator_role": "parent",
          "evaluator_name": "Mr. Rajesh Sharma",
          "score": 4.0,
          "grade": "A",
          "remark": "Shows strong interest in mathematics at home",
          "confidence": 0.85,
          "evidence": "Completes homework independently"
        },
        {
          "evaluator_role": "self",
          "evaluator_name": "Aarav Sharma",
          "score": 3.8,
          "grade": "A",
          "remark": "I like mathematics because it's like solving puzzles",
          "confidence": 0.75,
          "evidence": "Self-reflection during portfolio review"
        }
      ],
      "aggregated_score": 4.12,
      "aggregated_grade": "A"
    },
    {
      "parameter_name": "Creativity & Innovation",
      "evaluations": [
        {
          "evaluator_role": "teacher",
          "evaluator_name": "Ms. Anjali Reddy",
          "score": 4.5,
          "grade": "A+",
          "remark": "Exceptional creativity in art projects",
          "confidence": 0.92,
          "evidence": "Won school art competition"
        },
        {
          "evaluator_role": "peer",
          "evaluator_name": "Saanvi Patel",
          "score": 4.3,
          "grade": "A+",
          "remark": "Always has the most interesting ideas",
          "confidence": 0.80,
          "evidence": "Peer evaluation during collaborative project"
        }
      ],
      "aggregated_score": 4.42,
      "aggregated_grade": "A+"
    }
  ],
  "approval_workflow": {
    "current_step": 1,
    "steps": [
      {
        "step_number": 1,
        "approver_role": "class_teacher",
        "approver_name": "Dr. Meera Joshi",
        "status": "pending",
        "assigned_at": "2025-01-25T09:15:00Z",
        "due_date": "2025-01-28T17:00:00Z"
      },
      {
        "step_number": 2,
        "approver_role": "principal",
        "approver_name": "Dr. Rajesh Gupta",
        "status": "waiting",
        "due_date": "2025-02-02T17:00:00Z"
      }
    ]
  },
  "reviewer_permissions": {
    "can_approve": true,
    "can_reject": true,
    "can_request_revision": true,
    "can_edit": false
  },
  "quality_indicators": {
    "completeness": 95,
    "stakeholder_coverage": 85,
    "evidence_richness": 78,
    "confidence_average": 0.87
  }
}
```

### 7. Report Viewer & Export
**Route**: `/reports/hpc/hpc-student-001/hpc-report-001`
**Purpose**: Display final HPC report with export options

**Sample Data**:
```json
{
  "report": {
    "id": "hpc-report-001",
    "student_id": "hpc-student-001",
    "term_id": "term-2025-1",
    "overall_grade": "A",
    "overall_score": 4.15,
    "status": "published",
    "published_at": "2025-01-30T10:00:00Z",
    "version": 1
  },
  "student_info": {
    "full_name": "Aarav Sharma",
    "admission_number": "DPS2024001",
    "current_standard": "5",
    "section": "A",
    "photo_url": "/photos/students/aarav_sharma.jpg",
    "parent_name": "Mr. Rajesh Sharma",
    "class_teacher": "Dr. Meera Joshi"
  },
  "school_info": {
    "name": "Delhi Public School, Bhilai",
    "logo_url": "/assets/school_logo.png",
    "address": "Bhilai, Chhattisgarh, India",
    "affiliation": "CBSE Affiliation No: 3630008"
  },
  "term_info": {
    "name": "Term 1",
    "academic_year": "2024-25",
    "start_date": "2025-01-01",
    "end_date": "2025-04-30"
  },
  "scholastic_performance": [
    {
      "parameter": "Mathematics",
      "score": 4.12,
      "grade": "A",
      "teacher_remark": "Excellent mathematical reasoning and problem-solving ability",
      "parent_feedback": "Shows strong interest in mathematics at home",
      "rubric_level": "Exceptional mathematical understanding"
    },
    {
      "parameter": "Science",
      "score": 3.95,
      "grade": "A",
      "teacher_remark": "Strong understanding of scientific concepts",
      "parent_feedback": "Curious about nature and experiments",
      "rubric_level": "Strong scientific inquiry skills"
    }
  ],
  "co_scholastic_performance": [
    {
      "parameter": "Creativity & Innovation",
      "score": 4.42,
      "grade": "A+",
      "teacher_remark": "Exceptional creativity in art projects",
      "peer_feedback": "Always has the most interesting ideas",
      "evidence": "Won school art competition, innovative project designs"
    },
    {
      "parameter": "Physical Fitness & Health",
      "score": 3.2,
      "grade": "B",
      "teacher_remark": "Needs improvement in physical activities",
      "parent_feedback": "Prefers indoor activities, needs encouragement for sports"
    }
  ],
  "life_skills_assessment": [
    {
      "parameter": "Teamwork & Collaboration",
      "score": 4.03,
      "grade": "A",
      "multi_stakeholder_input": {
        "teacher": "Works well in teams and helps teammates",
        "parent": "Helps siblings with homework and chores",
        "peer": "Good team player, listens to others",
        "self": "I like working with friends on projects"
      }
    },
    {
      "parameter": "Empathy & Compassion",
      "score": 3.8,
      "grade": "A",
      "multi_stakeholder_input": {
        "teacher": "Shows care for classmates who are struggling",
        "parent": "Very caring with younger family members",
        "peer": "Always helps when someone is upset",
        "self": "I try to help friends when they are sad"
      }
    }
  ],
  "achievements": [
    {
      "title": "First Prize in School Art Competition",
      "category": "academic",
      "date": "2025-01-05",
      "points": 10,
      "evidence_url": "/certificates/art_competition_2025.pdf"
    },
    {
      "title": "Mathematics Olympiad Qualifier",
      "category": "academic",
      "date": "2024-12-30",
      "points": 15,
      "evidence_url": "/certificates/math_olympiad_qualifier.pdf"
    },
    {
      "title": "Class Monitor - Term 1",
      "category": "leadership",
      "date": "2025-01-01",
      "points": 8,
      "evidence_url": null
    }
  ],
  "student_reflections": [
    {
      "type": "self_assessment",
      "content": "This term I learned a lot about working with others and being creative. I want to get better at sports and help more friends with their studies. I think I am good at math and art but need to practice speaking in front of people.",
      "goals_set": [
        "Improve physical fitness",
        "Help more classmates",
        "Practice public speaking",
        "Join science club"
      ],
      "date": "2025-01-22T16:45:00Z"
    }
  ],
  "stakeholder_summary": {
    "teacher_highlights": [
      "Exceptional mathematical reasoning and creativity",
      "Natural helper and peer tutor",
      "Shows leadership potential in group activities"
    ],
    "parent_observations": [
      "Strong academic interest and self-motivation",
      "Caring and helpful with family members",
      "Needs encouragement for physical activities"
    ],
    "peer_feedback": [
      "Creative and innovative in group projects",
      "Good friend who helps others",
      "Fun to work with in teams"
    ],
    "self_awareness": [
      "Recognizes strengths in math and art",
      "Aware of need to improve in sports",
      "Sets realistic goals for improvement"
    ]
  },
  "recommendations": [
    "Consider advanced mathematics programs or competitions",
    "Explore art exhibitions or creative writing opportunities",
    "Encourage participation in sports and physical activities",
    "Provide opportunities for public speaking practice"
  ],
  "next_term_focus": [
    "Improve physical fitness scores",
    "Participate in science fair",
    "Take on more leadership responsibilities",
    "Join extracurricular activities"
  ],
  "export_options": {
    "available_formats": ["pdf", "json"],
    "available_languages": ["english", "hindi"],
    "include_charts": true,
    "include_signatures": true,
    "watermark": "CONFIDENTIAL - FOR ACADEMIC USE ONLY"
  }
}
```

### 8. HPC Dashboard (Teacher)
**Route**: `/teacher/hpc/dashboard`
**Purpose**: Teacher overview of HPC activities

**Sample Data**:
```json
{
  "teacher": {
    "id": "hpc-teacher-001",
    "full_name": "Dr. Meera Joshi",
    "department": "Mathematics & Science",
    "assigned_classes": ["5-A", "6-B", "7-A"]
  },
  "dashboard_stats": {
    "total_students": 90,
    "evaluations_pending": 12,
    "evaluations_completed": 78,
    "reports_to_review": 5,
    "reports_approved": 25
  },
  "pending_evaluations": [
    {
      "student_id": "hpc-student-003",
      "student_name": "Arjun Verma",
      "grade": "10",
      "section": "A",
      "parameter": "Mathematics",
      "due_date": "2025-01-28T17:00:00Z",
      "priority": "high"
    },
    {
      "student_id": "hpc-student-004",
      "student_name": "Kavya Singh",
      "grade": "7",
      "section": "A",
      "parameter": "Science",
      "due_date": "2025-01-30T17:00:00Z",
      "priority": "medium"
    }
  ],
  "recent_submissions": [
    {
      "student_name": "Aarav Sharma",
      "parameter": "Mathematics",
      "score": 4.2,
      "grade": "A",
      "submitted_at": "2025-01-24T14:30:00Z"
    },
    {
      "student_name": "Saanvi Patel",
      "parameter": "Empathy",
      "score": 4.7,
      "grade": "A+",
      "submitted_at": "2025-01-23T16:45:00Z"
    }
  ],
  "class_analytics": [
    {
      "class": "5-A",
      "total_students": 30,
      "completion_rate": 85,
      "average_score": 3.8,
      "grade_distribution": {
        "A+": 8,
        "A": 12,
        "B": 7,
        "C": 3,
        "D": 0
      }
    }
  ]
}
```

### 9. HPC Dashboard (Student)
**Route**: `/student/hpc/dashboard`
**Purpose**: Student view of their HPC progress

**Sample Data**:
```json
{
  "student": {
    "id": "hpc-student-001",
    "full_name": "Aarav Sharma",
    "current_standard": "5",
    "section": "A",
    "admission_number": "DPS2024001"
  },
  "current_term": {
    "id": "term-2025-1",
    "name": "Term 1",
    "end_date": "2025-04-30"
  },
  "my_progress": {
    "overall_grade": "A",
    "overall_score": 4.15,
    "completed_evaluations": 4,
    "pending_evaluations": 2,
    "last_updated": "2025-01-24T14:30:00Z"
  },
  "parameter_scores": [
    {
      "name": "Mathematics",
      "score": 4.12,
      "grade": "A",
      "category": "scholastic",
      "teacher_comment": "Excellent problem-solving skills",
      "my_reflection": "I love solving math puzzles"
    },
    {
      "name": "Creativity",
      "score": 4.42,
      "grade": "A+",
      "category": "co_scholastic",
      "teacher_comment": "Outstanding artistic expression",
      "my_reflection": "Art makes me happy"
    }
  ],
  "my_achievements": [
    {
      "title": "Art Competition Winner",
      "date": "2025-01-05",
      "points": 10,
      "category": "academic"
    },
    {
      "title": "Math Olympiad Qualifier",
      "date": "2024-12-30",
      "points": 15,
      "category": "academic"
    }
  ],
  "my_goals": [
    "Improve physical fitness",
    "Help more classmates",
    "Practice public speaking",
    "Join science club"
  ],
  "pending_tasks": [
    {
      "type": "self_evaluation",
      "parameter": "Physical Fitness",
      "due_date": "2025-01-30T17:00:00Z"
    },
    {
      "type": "peer_feedback",
      "for_student": "Saanvi Patel",
      "parameter": "Teamwork",
      "due_date": "2025-01-28T17:00:00Z"
    }
  ]
}
```

### 10. HPC Dashboard (Parent)
**Route**: `/parent/hpc/dashboard`
**Purpose**: Parent view of child's HPC progress

**Sample Data**:
```json
{
  "parent": {
    "id": "hpc-parent-001",
    "full_name": "Mr. Rajesh Sharma",
    "children": [
      {
        "id": "hpc-student-001",
        "name": "Aarav Sharma",
        "grade": "5",
        "section": "A"
      }
    ]
  },
  "child_progress": {
    "student_id": "hpc-student-001",
    "student_name": "Aarav Sharma",
    "overall_grade": "A",
    "overall_score": 4.15,
    "class_rank": 3,
    "total_students": 30,
    "improvement_trend": "improving"
  },
  "my_feedback_status": {
    "completed_parameters": 3,
    "pending_parameters": 1,
    "last_submission": "2025-01-20T18:15:00Z",
    "next_deadline": "2025-01-30T23:59:59Z"
  },
  "parameter_insights": [
    {
      "name": "Mathematics",
      "child_score": 4.12,
      "my_rating": 4.0,
      "teacher_rating": 4.2,
      "class_average": 3.6,
      "trend": "stable_high"
    },
    {
      "name": "Empathy",
      "child_score": 3.8,
      "my_rating": 4.2,
      "teacher_rating": 3.6,
      "class_average": 3.4,
      "trend": "improving"
    }
  ],
  "teacher_communications": [
    {
      "from": "Dr. Meera Joshi",
      "subject": "Aarav's Mathematics Progress",
      "message": "Aarav is showing exceptional progress in mathematical reasoning...",
      "date": "2025-01-24T10:30:00Z",
      "priority": "normal"
    }
  ],
  "upcoming_events": [
    {
      "type": "parent_teacher_meeting",
      "date": "2025-02-05T15:00:00Z",
      "purpose": "Discuss HPC results and next term goals"
    },
    {
      "type": "evaluation_deadline",
      "date": "2025-01-30T23:59:59Z",
      "purpose": "Complete remaining parameter evaluations"
    }
  ]
}
```

## 🎮 Interactive Demo Scenarios

### Scenario 1: Complete Teacher Evaluation
**Steps**:
1. Navigate to `/teacher/hpc/input/hpc-student-001`
2. Select "Mathematics" parameter
3. Rate 4.2/5 stars
4. Add qualitative remark
5. Upload evidence file
6. Set confidence level to 95%
7. Save draft
8. Submit evaluation
9. See real-time progress update

### Scenario 2: Student Self-Assessment
**Steps**:
1. Navigate to `/student/hpc/self`
2. Select mood emoji (💪 Confident)
3. Fill strengths text area
4. Set improvement goals
5. Save reflection
6. Preview how it appears in report
7. Submit final assessment

### Scenario 3: Report Approval Workflow
**Steps**:
1. Navigate to `/admin/hpc/review/hpc-student-001`
2. Review raw evaluations vs compiled summary
3. Check quality indicators
4. Add reviewer comments
5. Approve report
6. See workflow advance to next step
7. Receive notification of approval

### Scenario 4: Report Export
**Steps**:
1. Navigate to `/reports/hpc/hpc-student-001/hpc-report-001`
2. Preview report in web format
3. Select language (English/Hindi)
4. Choose export options (charts, signatures)
5. Generate PDF
6. Download and verify formatting

## 🧪 Testing Data Sets

### Minimal Test Data
```json
{
  "students": 1,
  "teachers": 1,
  "parents": 1,
  "parameters": 3,
  "evaluations": 6,
  "reports": 1
}
```

### Complete Test Data
```json
{
  "students": 5,
  "teachers": 3,
  "parents": 5,
  "parameters": 17,
  "evaluations": 45,
  "reports": 5,
  "rubrics": 85,
  "achievements": 15,
  "reflections": 10
}
```

### Edge Case Data
```json
{
  "incomplete_evaluations": "Missing parent feedback",
  "conflicting_scores": "Teacher: A+, Parent: C",
  "missing_evidence": "No supporting documentation",
  "late_submissions": "Past deadline evaluations",
  "version_conflicts": "Multiple draft versions"
}
```

## 📋 Demo Page Checklist

### Functional Requirements
- [ ] All forms validate input correctly
- [ ] Real-time updates work across browser tabs
- [ ] File uploads handle all supported formats
- [ ] Export generates properly formatted PDFs
- [ ] Approval workflow enforces proper authorization
- [ ] Search and filtering work accurately

### Visual Requirements
- [ ] Consistent with existing BIG DAY design system
- [ ] Responsive design works on all screen sizes
- [ ] Loading states provide clear feedback
- [ ] Error states are informative and actionable
- [ ] Success states confirm user actions

### Accessibility Requirements
- [ ] All interactive elements keyboard accessible
- [ ] Screen readers can navigate all content
- [ ] Color contrast meets WCAG AA standards
- [ ] Form validation errors clearly announced
- [ ] Charts have text alternatives

### Performance Requirements
- [ ] Initial page load under 2 seconds
- [ ] Form submissions under 1 second
- [ ] Real-time updates under 500ms
- [ ] PDF generation under 10 seconds
- [ ] Search results under 1 second

This demo specification provides comprehensive sample data and scenarios for testing and demonstrating the complete HPC system functionality across all user roles and workflows.