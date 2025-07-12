# 🐍 Python Flask Backend Setup Guide

## 🚀 Quick Start

### 1. Install Python and PostgreSQL

**Ubuntu/Debian:**
```bash
# Install Python 3.9+
sudo apt update
sudo apt install python3 python3-pip python3-venv

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
# Install Python (if not already installed)
brew install python

# Install PostgreSQL
brew install postgresql
brew services start postgresql
```

**Windows:**
- Download Python from [python.org](https://python.org)
- Download PostgreSQL from [postgresql.org](https://postgresql.org)

### 2. Setup PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE bigday;
CREATE USER bigday_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE bigday TO bigday_user;
\q
```

### 3. Setup Python Environment

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# Linux/macOS:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
nano .env
```

**Example .env configuration:**
```bash
SECRET_KEY=your-super-secret-key-change-this
JWT_SECRET_KEY=your-jwt-secret-key-change-this
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=postgresql://bigday_user:your_password@localhost:5432/bigday
FRONTEND_URL=http://localhost:3000
```

### 5. Initialize Database

```bash
# Seed the database with sample data
python seed_data.py
```

### 6. Start the Server

```bash
# Development server
python run.py

# Or using Flask directly
flask run --host=0.0.0.0 --port=5000
```

Your backend will be running at `http://localhost:5000`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Grades
- `GET /api/grades/student/:id` - Get student grades
- `POST /api/grades` - Create grade (Teacher/Admin)
- `PUT /api/grades/:id` - Update grade
- `DELETE /api/grades/:id` - Delete grade

### Dashboard
- `GET /api/students/dashboard` - Student dashboard
- `GET /api/teachers/dashboard` - Teacher dashboard
- `GET /api/admin/dashboard` - Admin dashboard

### Search
- `GET /api/search?q=query` - Universal search

## 🔐 Default Login Credentials

- **Admin**: `admin@dpsb.edu` / `admin123`
- **Teacher**: `jagdeep@dpsb.edu` / `teacher123`
- **Student**: `ritik@dpsb.edu` / `student123`

## 🛠️ Development Commands

```bash
# Install new package
pip install package_name
pip freeze > requirements.txt

# Database operations
python seed_data.py  # Reset and seed database

# Run tests (if you add them)
python -m pytest

# Check code style
flake8 app.py
```

## 🚀 Production Deployment

### Using Gunicorn

```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

### Using Docker

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]
```

### Environment Variables for Production

```bash
SECRET_KEY=your-production-secret-key
JWT_SECRET_KEY=your-production-jwt-key
FLASK_ENV=production
FLASK_DEBUG=False
DATABASE_URL=postgresql://user:pass@your-db-host:5432/bigday
FRONTEND_URL=https://your-frontend-domain.com
```

## 🔧 Frontend Integration

Update your frontend to use the Python backend:

```javascript
// Frontend .env
VITE_API_BASE_URL=http://localhost:5000/api
```

The authentication flow remains the same - just update the API base URL.

## 📈 Features Included

✅ **User Management** - Create, read, update, delete users
✅ **Role-Based Access** - Student, Teacher, Admin roles
✅ **Grade Management** - CRUD operations for grades
✅ **Attendance Tracking** - Record and view attendance
✅ **Dashboard APIs** - Role-specific dashboard data
✅ **Search Functionality** - Universal search with role permissions
✅ **JWT Authentication** - Secure token-based auth
✅ **Database Models** - PostgreSQL with SQLAlchemy ORM
✅ **Sample Data** - Pre-populated with test data

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Error**
   ```bash
   # Check PostgreSQL is running
   sudo systemctl status postgresql
   
   # Check database exists
   sudo -u postgres psql -l
   ```

2. **Module Not Found**
   ```bash
   # Ensure virtual environment is activated
   source venv/bin/activate
   
   # Reinstall dependencies
   pip install -r requirements.txt
   ```

3. **Permission Denied**
   ```bash
   # Check database permissions
   sudo -u postgres psql
   \du  # List users and permissions
   ```

4. **Port Already in Use**
   ```bash
   # Kill process on port 5000
   sudo lsof -ti:5000 | xargs kill -9
   ```

Your Python Flask backend is now ready! 🎉