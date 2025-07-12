# 🎓 BIG DAY User Management & Role-Based Access Guide

## 🏗️ System Architecture Overview

### **Role-Based Access Control (RBAC)**

Our system implements a comprehensive 3-tier role system:

1. **👨‍🎓 Students**: Can view their own grades, attendance, and performance
2. **👨‍🏫 Teachers**: Can manage their classes, enter grades, view student data for their subjects
3. **👨‍💼 Admins**: Full system access, user management, system-wide analytics

### **Data Security & Privacy**

- **JWT Authentication** with role-based permissions
- **Resource Ownership** validation (students can only see their data)
- **Subject-based Authorization** (teachers only access their subjects)
- **Encrypted passwords** with bcrypt
- **Input validation** and sanitization

---

## 🚀 Getting Started

### **1. Database Setup**

```bash
# Install MongoDB
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Or use MongoDB Atlas (cloud)
# Get connection string from: https://cloud.mongodb.com
```

### **2. Environment Configuration**

```bash
# Backend .env file
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://localhost:27017/bigday
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRATION=24h
FRONTEND_URL=https://your-frontend-domain.com
```

### **3. Install Dependencies**

```bash
cd backend
npm install
```

### **4. Start the Server**

```bash
# Development
npm run dev

# Production
npm start
```

---

## 👥 User Management

### **Creating Users (Admin Only)**

**API Endpoint**: `POST /api/users`

```javascript
// Example: Create a student
const studentData = {
  email: "john.doe@dpsb.edu",
  password: "student123",
  firstName: "John",
  lastName: "Doe",
  role: "student",
  department: "Science",
  class: "10A",
  subjects: ["Mathematics", "Physics", "Chemistry"],
  enrollmentYear: 2024,
  parentInfo: {
    fatherName: "Robert Doe",
    motherName: "Jane Doe",
    guardianPhone: "+91-9876543210",
    guardianEmail: "parent@email.com"
  }
};

// Example: Create a teacher
const teacherData = {
  email: "sarah.smith@dpsb.edu",
  password: "teacher123",
  firstName: "Sarah",
  lastName: "Smith",
  role: "teacher",
  department: "Mathematics",
  subjects: ["Mathematics", "Statistics"],
  phoneNumber: "+91-9876543210"
};
```

### **User ID Generation**

- **Students**: Auto-generated format `S24XXXX` (S + year + 4 digits)
- **Teachers**: Auto-generated format `TXXX` (T + 3 digits)
- **Admins**: Manual assignment

### **User Status Management**

```javascript
// Update user status (Admin only)
PUT /api/users/:id
{
  "status": "active" | "inactive" | "suspended"
}
```

---

## 📊 Grade Management System

### **Grade Entry (Teachers)**

**API Endpoint**: `POST /api/grades`

```javascript
// Single grade entry
const gradeData = {
  studentId: "507f1f77bcf86cd799439011",
  subject: "Mathematics",
  class: "10A",
  term: "Term 1",
  academicYear: "2024-25",
  assessmentType: "test",
  assessmentName: "Unit Test 1",
  assessmentDate: "2024-03-15",
  maxMarks: 100,
  marksObtained: 85,
  weightage: 1,
  remarks: "Good performance",
  feedback: "Keep up the good work!"
};
```

### **Bulk Grade Entry**

```javascript
// Bulk grade entry for multiple students
POST /api/grades/bulk
{
  "commonData": {
    "subject": "Mathematics",
    "class": "10A",
    "term": "Term 1",
    "academicYear": "2024-25",
    "assessmentType": "test",
    "assessmentName": "Unit Test 1",
    "assessmentDate": "2024-03-15",
    "maxMarks": 100
  },
  "grades": [
    { "studentId": "507f1f77bcf86cd799439011", "marksObtained": 85 },
    { "studentId": "507f1f77bcf86cd799439012", "marksObtained": 92 },
    { "studentId": "507f1f77bcf86cd799439013", "marksObtained": 78 }
  ]
}
```

### **Grade Calculation**

Grades are automatically calculated based on percentage:

- **A+**: 95-100%
- **A**: 90-94%
- **B+**: 85-89%
- **B**: 80-84%
- **C+**: 75-79%
- **C**: 70-74%
- **D**: 60-69%
- **F**: Below 60%

---

## 🔐 Role-Based Access Examples

### **Student Access**

```javascript
// Students can only access their own data
GET /api/grades/student/:studentId  // Only their own ID
GET /api/users/:id                  // Only their own profile

// Example: Student trying to access another student's grades
// ❌ 403 Forbidden: "Access denied: You can only access your own data"
```

### **Teacher Access**

```javascript
// Teachers can access data for subjects they teach
GET /api/grades/teacher/my-grades?subject=Mathematics
POST /api/grades  // Only for subjects they teach

// Example: Teacher trying to enter grades for a subject they don't teach
// ❌ 403 Forbidden: "You do not teach this subject"
```

### **Admin Access**

```javascript
// Admins have full system access
GET /api/users                     // All users
GET /api/grades/class/10A/summary  // Any class
POST /api/users                    // Create users
DELETE /api/users/:id              // Delete users
```

---

## 📱 Frontend Integration

### **User Creation Form (Admin)**

```javascript
// Admin user creation component
const CreateUserForm = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student',
    department: '',
    class: '',
    subjects: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        // User created successfully
        const newUser = await response.json();
        console.log('User created:', newUser.data);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### **Grade Entry Form (Teacher)**

```javascript
// Teacher grade entry component
const GradeEntryForm = () => {
  const [gradeData, setGradeData] = useState({
    studentId: '',
    subject: '',
    assessmentType: 'test',
    assessmentName: '',
    maxMarks: 100,
    marksObtained: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/grades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gradeData)
      });

      if (response.ok) {
        // Grade entered successfully
        const newGrade = await response.json();
        console.log('Grade created:', newGrade.data);
      }
    } catch (error) {
      console.error('Error creating grade:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### **Student Grade View**

```javascript
// Student grade viewing component
const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch(`/api/grades/student/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setGrades(data.data);
        }
      } catch (error) {
        console.error('Error fetching grades:', error);
      }
    };

    fetchGrades();
  }, [user.id]);

  return (
    <div>
      {grades.map(grade => (
        <div key={grade._id}>
          <h3>{grade.subject}</h3>
          <p>Assessment: {grade.assessmentName}</p>
          <p>Score: {grade.marksObtained}/{grade.maxMarks}</p>
          <p>Grade: {grade.grade}</p>
          <p>Percentage: {grade.percentage}%</p>
        </div>
      ))}
    </div>
  );
};
```

---

## 🔒 Security Best Practices

### **Authentication Flow**

1. **Login** → Backend validates credentials
2. **JWT Token** → Issued with user role and permissions
3. **Request Authorization** → Token validated on each API call
4. **Role Check** → Middleware verifies user permissions
5. **Resource Access** → Data filtered based on role

### **Data Protection**

- **Password Hashing**: bcrypt with 12 rounds
- **Input Validation**: express-validator for all inputs
- **SQL Injection Prevention**: MongoDB ODM (Mongoose)
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for specific frontend domain

### **Permission Matrix**

| Action | Student | Teacher | Admin |
|--------|---------|---------|-------|
| View own grades | ✅ | ❌ | ✅ |
| View all grades | ❌ | ✅ (own subjects) | ✅ |
| Create grades | ❌ | ✅ (own subjects) | ✅ |
| Create users | ❌ | ❌ | ✅ |
| Delete users | ❌ | ❌ | ✅ |
| View user list | ❌ | ✅ (limited) | ✅ |

---

## 📈 Performance & Scalability

### **Database Optimization**

- **Indexes** on frequently queried fields
- **Pagination** for large data sets
- **Aggregation pipelines** for complex queries
- **Connection pooling** for better performance

### **Caching Strategy**

```javascript
// Redis caching for frequently accessed data
const redis = require('redis');
const client = redis.createClient();

// Cache user permissions
const getUserPermissions = async (userId) => {
  const cached = await client.get(`permissions:${userId}`);
  if (cached) return JSON.parse(cached);
  
  const permissions = await User.findById(userId).select('role permissions');
  await client.setex(`permissions:${userId}`, 3600, JSON.stringify(permissions));
  
  return permissions;
};
```

---

## 🚀 Deployment Checklist

### **Production Setup**

- [ ] MongoDB Atlas or dedicated MongoDB server
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Rate limiting configured
- [ ] Logging and monitoring setup
- [ ] Backup strategy implemented
- [ ] Load balancer configured (if needed)

### **Security Checklist**

- [ ] Strong JWT secret (32+ characters)
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Rate limiting enabled
- [ ] Error messages don't leak sensitive info
- [ ] Database connection secured
- [ ] Regular security updates

Your comprehensive user management and role-based access system is now ready for production! 🎉

## 🆘 Troubleshooting

### **Common Issues**

1. **403 Forbidden**: Check user role and permissions
2. **401 Unauthorized**: Verify JWT token is valid
3. **Validation Errors**: Check required fields and data types
4. **Database Connection**: Verify MongoDB is running and connection string is correct

### **Debug Commands**

```bash
# Check MongoDB status
sudo systemctl status mongod

# View application logs
pm2 logs bigday-backend

# Test API endpoints
curl -X GET http://localhost:3001/health
```