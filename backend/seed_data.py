from app import app, db, User, Grade, Attendance
from datetime import datetime, date
import random

def seed_database():
    with app.app_context():
        # Drop all tables and recreate
        db.drop_all()
        db.create_all()
        
        print("🗑️ Cleared existing data")
        
        # Create sample users
        users_data = [
            # Admin
            {
                'email': 'admin@dpsb.edu',
                'password': 'admin123',
                'first_name': 'Dr. Priya',
                'last_name': 'Sharma',
                'role': 'admin',
                'department': 'Administration'
            },
            
            # Teachers
            {
                'email': 'jagdeep@dpsb.edu',
                'password': 'teacher123',
                'first_name': 'Jagdeep Singh',
                'last_name': 'Sokhey',
                'role': 'teacher',
                'department': 'Computer Science',
                'subjects': 'Computer Science,Data Structures,Programming'
            },
            {
                'email': 'priya.math@dpsb.edu',
                'password': 'teacher123',
                'first_name': 'Priya',
                'last_name': 'Gupta',
                'role': 'teacher',
                'department': 'Mathematics',
                'subjects': 'Mathematics,Statistics,Calculus'
            },
            {
                'email': 'rajesh.physics@dpsb.edu',
                'password': 'teacher123',
                'first_name': 'Rajesh',
                'last_name': 'Kumar',
                'role': 'teacher',
                'department': 'Physics',
                'subjects': 'Physics,Applied Physics'
            },
            
            # Students
            {
                'email': 'ritik@dpsb.edu',
                'password': 'student123',
                'first_name': 'Ritik',
                'last_name': 'Koley',
                'role': 'student',
                'department': 'Science',
                'class_name': '12A',
                'subjects': 'Mathematics,Physics,Computer Science,Chemistry',
                'enrollment_year': 2023
            },
            {
                'email': 'ananya@dpsb.edu',
                'password': 'student123',
                'first_name': 'Ananya',
                'last_name': 'Sharma',
                'role': 'student',
                'department': 'Science',
                'class_name': '12A',
                'subjects': 'Mathematics,Physics,Computer Science,Chemistry',
                'enrollment_year': 2023
            },
            {
                'email': 'arjun@dpsb.edu',
                'password': 'student123',
                'first_name': 'Arjun',
                'last_name': 'Patel',
                'role': 'student',
                'department': 'Science',
                'class_name': '12B',
                'subjects': 'Mathematics,Physics,Computer Science,Chemistry',
                'enrollment_year': 2023
            },
            {
                'email': 'sneha@dpsb.edu',
                'password': 'student123',
                'first_name': 'Sneha',
                'last_name': 'Singh',
                'role': 'student',
                'department': 'Commerce',
                'class_name': '11A',
                'subjects': 'Mathematics,Economics,Business Studies,Accountancy',
                'enrollment_year': 2024
            }
        ]
        
        created_users = []
        for user_data in users_data:
            user = User(
                email=user_data['email'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                role=user_data['role'],
                department=user_data.get('department'),
                class_name=user_data.get('class_name'),
                subjects=user_data.get('subjects'),
                enrollment_year=user_data.get('enrollment_year')
            )
            
            user.set_password(user_data['password'])
            
            # Generate student/teacher ID
            if user.role == 'student':
                year = str(datetime.now().year)[-2:]
                count = len([u for u in created_users if u.role == 'student']) + 1
                user.student_id = f"S{year}{count:04d}"
            elif user.role == 'teacher':
                count = len([u for u in created_users if u.role == 'teacher']) + 1
                user.teacher_id = f"T{count:03d}"
            
            db.session.add(user)
            created_users.append(user)
            print(f"✅ Created {user.role}: {user.first_name} {user.last_name}")
        
        db.session.commit()
        
        # Create sample grades
        teachers = [u for u in created_users if u.role == 'teacher']
        students = [u for u in created_users if u.role == 'student']
        
        grade_count = 0
        for student in students:
            if student.subjects:
                student_subjects = student.subjects.split(',')
                for subject in student_subjects:
                    # Find teacher for this subject
                    teacher = None
                    for t in teachers:
                        if t.subjects and subject in t.subjects.split(','):
                            teacher = t
                            break
                    
                    if not teacher:
                        continue
                    
                    # Create multiple assessments
                    assessments = [
                        {'type': 'assignment', 'name': 'Assignment 1', 'max_marks': 20},
                        {'type': 'quiz', 'name': 'Quiz 1', 'max_marks': 10},
                        {'type': 'test', 'name': 'Unit Test 1', 'max_marks': 50},
                        {'type': 'assignment', 'name': 'Assignment 2', 'max_marks': 20},
                        {'type': 'midterm', 'name': 'Mid Term Exam', 'max_marks': 100}
                    ]
                    
                    for assessment in assessments:
                        # Generate realistic marks (70-95% range)
                        percentage = random.uniform(70, 95)
                        marks_obtained = round((percentage / 100) * assessment['max_marks'], 1)
                        
                        grade = Grade(
                            student_id=student.id,
                            teacher_id=teacher.id,
                            subject=subject,
                            class_name=student.class_name,
                            term='Term 1',
                            academic_year='2024-25',
                            assessment_type=assessment['type'],
                            assessment_name=assessment['name'],
                            assessment_date=date(2024, 3, random.randint(1, 28)),
                            max_marks=assessment['max_marks'],
                            marks_obtained=marks_obtained,
                            weightage=1.0,
                            status='published'
                        )
                        
                        grade.calculate_grade()
                        db.session.add(grade)
                        grade_count += 1
        
        db.session.commit()
        print(f"✅ Created {grade_count} sample grades")
        
        # Create sample attendance
        attendance_count = 0
        for student in students:
            if student.subjects:
                student_subjects = student.subjects.split(',')
                for subject in student_subjects:
                    teacher = None
                    for t in teachers:
                        if t.subjects and subject in t.subjects.split(','):
                            teacher = t
                            break
                    
                    if not teacher:
                        continue
                    
                    # Create attendance for last 30 days
                    for day in range(1, 31):
                        if random.random() > 0.1:  # 90% attendance rate
                            attendance = Attendance(
                                student_id=student.id,
                                teacher_id=teacher.id,
                                subject=subject,
                                class_name=student.class_name,
                                date=date(2024, 3, day),
                                status='present'
                            )
                            db.session.add(attendance)
                            attendance_count += 1
        
        db.session.commit()
        print(f"✅ Created {attendance_count} attendance records")
        
        print('\n🎉 Database seeded successfully!')
        print('\n📋 Login Credentials:')
        print('👨‍💼 Admin: admin@dpsb.edu / admin123')
        print('👨‍🏫 Teacher: jagdeep@dpsb.edu / teacher123')
        print('👨‍🎓 Student: ritik@dpsb.edu / student123')

if __name__ == '__main__':
    seed_database()