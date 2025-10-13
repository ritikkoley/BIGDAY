import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  TrendingUp,
  Users,
  Home,
  Heart,
  GraduationCap,
  ChevronLeft,
  BarChart3,
  Target,
  Clock
} from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';
import { useAuthStore } from '../../stores/authStore';

export const StudentProfileView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { profile: currentUserProfile } = useDataStore();
  const { user } = useAuthStore();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentProfile = async () => {
      setLoading(true);

      setTimeout(() => {
        setStudentData({
          id: userId,
          full_name: 'Aarav Sharma',
          email: 'aarav.sharma@student.dpsb.edu',
          admission_number: 'ADM0125',
          current_standard: '10',
          section: 'A',
          date_of_birth: '2008-05-15',
          gender: 'male',
          blood_group: 'A+',
          contact_number: '9876543210',
          residential_address: '123, Nehru Nagar, Bhilai, Chhattisgarh, India',
          parent_guardian_name: 'Rajesh Sharma',
          parent_contact_number: '9988776655',
          emergency_contact: '9988776655',
          accommodation_type: 'day_boarder',
          peer_group: 'secondary',
          nationality: 'Indian',
          religion: 'Hindu',
          caste_category: 'General',
          status: 'active',
          date_of_admission: '2018-04-01',
          grade_average: 87.5,
          attendance_percentage: 92,
          total_classes: 180,
          attended_classes: 166,
          rank: 5,
          total_students: 120,
          subjects: [
            { name: 'Mathematics', grade: 'A', marks: 92 },
            { name: 'Science', grade: 'A', marks: 89 },
            { name: 'English', grade: 'B+', marks: 85 },
            { name: 'Hindi', grade: 'A', marks: 91 },
            { name: 'Social Studies', grade: 'B+', marks: 84 }
          ],
          achievements: [
            { title: 'Science Olympiad - Gold Medal', date: '2024-03-15' },
            { title: 'Inter-School Debate Competition - 2nd Place', date: '2024-05-20' },
            { title: 'Mathematics Quiz - 1st Place', date: '2024-08-10' }
          ],
          extracurricular: [
            { activity: 'Basketball Team', role: 'Captain' },
            { activity: 'Debate Club', role: 'Member' },
            { activity: 'Science Club', role: 'Secretary' }
          ]
        });
        setLoading(false);
      }, 500);
    };

    if (userId) {
      loadStudentProfile();
    }
  }, [userId]);

  const canViewProfile = () => {
    if (!currentUserProfile || !user) return false;

    if (currentUserProfile.role === 'admin') return true;

    if (currentUserProfile.role === 'teacher') return true;

    if (currentUserProfile.role === 'student' && currentUserProfile.id === userId) return true;

    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen apple-gradient flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (!canViewProfile()) {
    return (
      <div className="min-h-screen apple-gradient flex items-center justify-center">
        <div className="apple-card p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to view this profile.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen apple-gradient flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Student not found</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
      case 'suspended': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  const getGradeColor = (marks: number) => {
    if (marks >= 90) return 'text-green-600 dark:text-green-400';
    if (marks >= 75) return 'text-blue-600 dark:text-blue-400';
    if (marks >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  return (
    <div className="min-h-screen apple-gradient">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="apple-card p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-semibold mb-4 shadow-lg">
                  {studentData.full_name.split(' ').map((n: string) => n[0]).join('')}
                </div>

                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {studentData.full_name}
                </h1>

                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(studentData.status)} mb-2`}>
                  {studentData.status}
                </span>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Class {studentData.current_standard} - Section {studentData.section}
                </p>

                <div className="w-full space-y-3 mt-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Admission No.</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{studentData.admission_number}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Class Rank</span>
                    <span className="font-semibold text-gray-900 dark:text-white">#{studentData.rank}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="apple-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Grade Average</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{studentData.grade_average}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                      style={{ width: `${studentData.grade_average}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Attendance</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{studentData.attendance_percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${studentData.attendance_percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {studentData.attended_classes} / {studentData.total_classes} classes
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="apple-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">{studentData.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Contact Number</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">{studentData.contact_number}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Date of Birth</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(studentData.date_of_birth).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Blood Group</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">{studentData.blood_group}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Gender</span>
                  </div>
                  <p className="text-gray-900 dark:text-white capitalize">{studentData.gender}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Home className="w-4 h-4" />
                    <span className="text-sm">Accommodation</span>
                  </div>
                  <p className="text-gray-900 dark:text-white capitalize">{studentData.accommodation_type.replace('_', ' ')}</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Address</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">{studentData.residential_address}</p>
                </div>
              </div>
            </div>

            <div className="apple-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Parent/Guardian Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Parent/Guardian Name</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">{studentData.parent_guardian_name}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Parent Contact</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">{studentData.parent_contact_number}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Emergency Contact</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">{studentData.emergency_contact}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Admission Date</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(studentData.date_of_admission).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="apple-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Academic Performance</h2>

              <div className="space-y-4">
                {studentData.subjects.map((subject: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{subject.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`text-lg font-bold ${getGradeColor(subject.marks)}`}>
                        {subject.marks}%
                      </span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                        {subject.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {studentData.achievements && studentData.achievements.length > 0 && (
              <div className="apple-card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Achievements</h2>

                <div className="space-y-3">
                  {studentData.achievements.map((achievement: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                      <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{achievement.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {new Date(achievement.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {studentData.extracurricular && studentData.extracurricular.length > 0 && (
              <div className="apple-card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Extracurricular Activities</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentData.extracurricular.map((activity: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{activity.activity}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileView;
