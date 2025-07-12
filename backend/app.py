from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from functools import wraps

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-this')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://user:password@localhost/bigday')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app, origins=["http://localhost:3000"])

# Models
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # student, teacher, admin
    department = db.Column(db.String(100))
    student_id = db.Column(db.String(20), unique=True)
    teacher_id = db.Column(db.String(20), unique=True)
    class_name = db.Column(db.String(10))  # For students
    subjects = db.Column(db.Text)  # JSON string of subjects
    status = db.Column(db.String(20), default='active')
    enrollment_year = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'department': self.department,
            'student_id': self.student_id,
            'teacher_id': self.teacher_id,
            'class_name': self.class_name,
            'subjects': self.subjects.split(',') if self.subjects else [],
            'status': self.status,
            'enrollment_year': self.enrollment_year,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Grade(db.Model):
    __tablename__ = 'grades'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    class_name = db.Column(db.String(10), nullable=False)
    term = db.Column(db.String(20), nullable=False)
    academic_year = db.Column(db.String(10), nullable=False)
    assessment_type = db.Column(db.String(50), nullable=False)
    assessment_name = db.Column(db.String(200), nullable=False)
    assessment_date = db.Column(db.Date, nullable=False)
    max_marks = db.Column(db.Float, nullable=False)
    marks_obtained = db.Column(db.Float, nullable=False)
    percentage = db.Column(db.Float)
    grade = db.Column(db.String(5))
    weightage = db.Column(db.Float, default=1.0)
    remarks = db.Column(db.Text)
    feedback = db.Column(db.Text)
    status = db.Column(db.String(20), default='published')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    student = db.relationship('User', foreign_keys=[student_id], backref='student_grades')
    teacher = db.relationship('User', foreign_keys=[teacher_id], backref='teacher_grades')
    
    def calculate_grade(self):
        if self.max_marks and self.marks_obtained is not None:
            self.percentage = round((self.marks_obtained / self.max_marks) * 100, 2)
            
            if self.percentage >= 95:
                self.grade = 'A+'
            elif self.percentage >= 90:
                self.grade = 'A'
            elif self.percentage >= 85:
                self.grade = 'B+'
            elif self.percentage >= 80:
                self.grade = 'B'
            elif self.percentage >= 75:
                self.grade = 'C+'
            elif self.percentage >= 70:
                self.grade = 'C'
            elif self.percentage >= 60:
                self.grade = 'D'
            else:
                self.grade = 'F'
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'teacher_id': self.teacher_id,
            'subject': self.subject,
            'class_name': self.class_name,
            'term': self.term,
            'academic_year': self.academic_year,
            'assessment_type': self.assessment_type,
            'assessment_name': self.assessment_name,
            'assessment_date': self.assessment_date.isoformat() if self.assessment_date else None,
            'max_marks': self.max_marks,
            'marks_obtained': self.marks_obtained,
            'percentage': self.percentage,
            'grade': self.grade,
            'weightage': self.weightage,
            'remarks': self.remarks,
            'feedback': self.feedback,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Attendance(db.Model):
    __tablename__ = 'attendance'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    class_name = db.Column(db.String(10), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)  # present, absent, late
    remarks = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    student = db.relationship('User', foreign_keys=[student_id], backref='attendance_records')
    teacher = db.relationship('User', foreign_keys=[teacher_id], backref='attendance_taken')
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'teacher_id': self.teacher_id,
            'subject': self.subject,
            'class_name': self.class_name,
            'date': self.date.isoformat() if self.date else None,
            'status': self.status,
            'remarks': self.remarks,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# Role-based authorization decorator
def role_required(*roles):
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user or user.role not in roles:
                return jsonify({'error': 'Insufficient permissions'}), 403
            
            return f(user, *args, **kwargs)
        return decorated_function
    return decorator

# Routes

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'timestamp': datetime.utcnow().isoformat(),
        'database': 'connected' if db.engine.execute('SELECT 1').fetchone() else 'disconnected'
    })

# Authentication Routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if user.status != 'active':
            return jsonify({'error': 'Account is not active'}), 401
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'success': True,
            'token': access_token,
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': 'Login failed'}), 500

@app.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'success': True, 'message': 'Logged out successfully'})

# User Management Routes
@app.route('/api/users', methods=['GET'])
@role_required('admin')
def get_users(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('limit', 10, type=int)
        role = request.args.get('role')
        department = request.args.get('department')
        
        query = User.query
        
        if role:
            query = query.filter_by(role=role)
        if department:
            query = query.filter_by(department=department)
        
        users = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': [user.to_dict() for user in users.items],
            'pagination': {
                'page': page,
                'pages': users.pages,
                'per_page': per_page,
                'total': users.total
            }
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch users'}), 500

@app.route('/api/users', methods=['POST'])
@role_required('admin')
def create_user(current_user):
    try:
        data = request.get_json()
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 400
        
        user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=data['role'],
            department=data.get('department'),
            class_name=data.get('class_name'),
            subjects=','.join(data.get('subjects', [])),
            enrollment_year=data.get('enrollment_year')
        )
        
        user.set_password(data['password'])
        
        # Generate student/teacher ID
        if user.role == 'student':
            year = str(datetime.now().year)[-2:]
            count = User.query.filter_by(role='student').count() + 1
            user.student_id = f"S{year}{count:04d}"
        elif user.role == 'teacher':
            count = User.query.filter_by(role='teacher').count() + 1
            user.teacher_id = f"T{count:03d}"
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'data': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create user'}), 500

# Grade Management Routes
@app.route('/api/grades/student/<int:student_id>', methods=['GET'])
@jwt_required()
def get_student_grades(student_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Check permissions
        if current_user.role == 'student' and current_user.id != student_id:
            return jsonify({'error': 'Access denied'}), 403
        
        subject = request.args.get('subject')
        term = request.args.get('term')
        
        query = Grade.query.filter_by(student_id=student_id)
        
        if subject:
            query = query.filter_by(subject=subject)
        if term:
            query = query.filter_by(term=term)
        
        grades = query.order_by(Grade.assessment_date.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [grade.to_dict() for grade in grades]
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch grades'}), 500

@app.route('/api/grades', methods=['POST'])
@role_required('teacher', 'admin')
def create_grade(current_user):
    try:
        data = request.get_json()
        
        # Verify student exists
        student = User.query.get(data['student_id'])
        if not student or student.role != 'student':
            return jsonify({'error': 'Student not found'}), 404
        
        # Check if teacher teaches this subject
        if current_user.role == 'teacher':
            teacher_subjects = current_user.subjects.split(',') if current_user.subjects else []
            if data['subject'] not in teacher_subjects:
                return jsonify({'error': 'You do not teach this subject'}), 403
        
        grade = Grade(
            student_id=data['student_id'],
            teacher_id=current_user.id,
            subject=data['subject'],
            class_name=data['class_name'],
            term=data['term'],
            academic_year=data['academic_year'],
            assessment_type=data['assessment_type'],
            assessment_name=data['assessment_name'],
            assessment_date=datetime.strptime(data['assessment_date'], '%Y-%m-%d').date(),
            max_marks=data['max_marks'],
            marks_obtained=data['marks_obtained'],
            weightage=data.get('weightage', 1.0),
            remarks=data.get('remarks'),
            feedback=data.get('feedback')
        )
        
        grade.calculate_grade()
        
        db.session.add(grade)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Grade created successfully',
            'data': grade.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create grade'}), 500

# Search Route
@app.route('/api/search', methods=['GET'])
@jwt_required()
def search():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        query = request.args.get('q', '').strip()
        if not query:
            return jsonify({'success': True, 'data': [], 'total': 0})
        
        results = []
        
        # Search based on user role
        if current_user.role == 'admin':
            # Admin can search everything
            users = User.query.filter(
                db.or_(
                    User.first_name.ilike(f'%{query}%'),
                    User.last_name.ilike(f'%{query}%'),
                    User.email.ilike(f'%{query}%'),
                    User.student_id.ilike(f'%{query}%'),
                    User.teacher_id.ilike(f'%{query}%')
                )
            ).limit(10).all()
            
            for user in users:
                results.append({
                    'id': user.id,
                    'name': f"{user.first_name} {user.last_name}",
                    'identifier': user.student_id or user.teacher_id or user.email,
                    'type': user.role
                })
                
        elif current_user.role == 'teacher':
            # Teacher can search students
            students = User.query.filter(
                User.role == 'student',
                db.or_(
                    User.first_name.ilike(f'%{query}%'),
                    User.last_name.ilike(f'%{query}%'),
                    User.student_id.ilike(f'%{query}%')
                )
            ).limit(10).all()
            
            for student in students:
                results.append({
                    'id': student.id,
                    'name': f"{student.first_name} {student.last_name}",
                    'identifier': student.student_id,
                    'type': 'student'
                })
        
        return jsonify({
            'success': True,
            'data': results,
            'total': len(results)
        })
        
    except Exception as e:
        return jsonify({'error': 'Search failed'}), 500

# Student Dashboard Routes
@app.route('/api/students/dashboard', methods=['GET'])
@role_required('student')
def student_dashboard(current_user):
    try:
        # Get recent grades
        recent_grades = Grade.query.filter_by(student_id=current_user.id)\
            .order_by(Grade.created_at.desc()).limit(5).all()
        
        # Get attendance summary
        total_classes = Attendance.query.filter_by(student_id=current_user.id).count()
        present_classes = Attendance.query.filter_by(
            student_id=current_user.id, 
            status='present'
        ).count()
        
        attendance_percentage = (present_classes / total_classes * 100) if total_classes > 0 else 0
        
        return jsonify({
            'success': True,
            'data': {
                'recent_grades': [grade.to_dict() for grade in recent_grades],
                'attendance': {
                    'total_classes': total_classes,
                    'present_classes': present_classes,
                    'percentage': round(attendance_percentage, 2)
                },
                'profile': current_user.to_dict()
            }
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch dashboard data'}), 500

# Teacher Dashboard Routes
@app.route('/api/teachers/dashboard', methods=['GET'])
@role_required('teacher')
def teacher_dashboard(current_user):
    try:
        # Get classes taught
        teacher_subjects = current_user.subjects.split(',') if current_user.subjects else []
        
        # Get recent grades entered
        recent_grades = Grade.query.filter_by(teacher_id=current_user.id)\
            .order_by(Grade.created_at.desc()).limit(10).all()
        
        # Get class performance summary
        class_performance = []
        for subject in teacher_subjects:
            grades = Grade.query.filter_by(teacher_id=current_user.id, subject=subject).all()
            if grades:
                avg_percentage = sum(g.percentage for g in grades if g.percentage) / len(grades)
                class_performance.append({
                    'subject': subject,
                    'average_score': round(avg_percentage, 2),
                    'total_assessments': len(grades)
                })
        
        return jsonify({
            'success': True,
            'data': {
                'profile': current_user.to_dict(),
                'subjects': teacher_subjects,
                'recent_grades': [grade.to_dict() for grade in recent_grades],
                'class_performance': class_performance
            }
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch dashboard data'}), 500

# Admin Dashboard Routes
@app.route('/api/admin/dashboard', methods=['GET'])
@role_required('admin')
def admin_dashboard(current_user):
    try:
        # Get system statistics
        total_students = User.query.filter_by(role='student').count()
        total_teachers = User.query.filter_by(role='teacher').count()
        total_grades = Grade.query.count()
        
        # Get recent activity
        recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()
        recent_grades = Grade.query.order_by(Grade.created_at.desc()).limit(5).all()
        
        return jsonify({
            'success': True,
            'data': {
                'statistics': {
                    'total_students': total_students,
                    'total_teachers': total_teachers,
                    'total_grades': total_grades
                },
                'recent_users': [user.to_dict() for user in recent_users],
                'recent_grades': [grade.to_dict() for grade in recent_grades]
            }
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch dashboard data'}), 500

# Initialize database
@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)