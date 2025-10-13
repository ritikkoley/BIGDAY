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
  Users,
  Building2,
  GraduationCap,
  ChevronLeft,
  Briefcase,
  Clock,
  Star
} from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';
import { useAuthStore } from '../../stores/authStore';

export const TeacherProfileView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { profile: currentUserProfile } = useDataStore();
  const { user } = useAuthStore();
  const [teacherData, setTeacherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeacherProfile = async () => {
      setLoading(true);

      setTimeout(() => {
        setTeacherData({
          id: userId,
          full_name: 'Dr. Priya Mehta',
          email: 'priya.mehta@dpsb.edu',
          employee_id: 'EMP0042',
          designation: 'Senior Teacher',
          department: 'Mathematics',
          date_of_birth: '1985-03-20',
          gender: 'female',
          blood_group: 'B+',
          contact_number: '9123456789',
          residential_address: '456, Civil Lines, Bhilai, Chhattisgarh, India',
          emergency_contact: '9988112233',
          nationality: 'Indian',
          religion: 'Hindu',
          status: 'active',
          date_of_joining: '2010-07-15',
          qualifications: [
            { degree: 'Ph.D. in Mathematics', institution: 'IIT Delhi', year: 2010 },
            { degree: 'M.Sc. Mathematics', institution: 'Delhi University', year: 2007 },
            { degree: 'B.Sc. Mathematics', institution: 'Delhi University', year: 2005 }
          ],
          experience_years: 14,
          subjects_taught: ['Advanced Mathematics', 'Algebra', 'Calculus', 'Geometry'],
          classes_handled: ['9A', '9B', '10A', '11 Science', '12 Science'],
          total_students: 245,
          average_class_performance: 82.5,
          teaching_load: {
            weekly_hours: 28,
            classes_per_week: 32
          },
          achievements: [
            { title: 'Best Teacher Award 2023', organization: 'School Board', date: '2023-08-15' },
            { title: 'Excellence in Teaching - Mathematics', organization: 'State Education Department', date: '2022-01-20' },
            { title: 'Innovation in Education Award', organization: 'National Teaching Council', date: '2021-09-10' }
          ],
          specializations: ['Advanced Calculus', 'Linear Algebra', 'Differential Equations', 'Statistics'],
          responsibilities: [
            'Head of Mathematics Department',
            'Coordinator - Science Olympiad',
            'Member - Academic Council',
            'Mentor - Student Research Projects'
          ]
        });
        setLoading(false);
      }, 500);
    };

    if (userId) {
      loadTeacherProfile();
    }
  }, [userId]);

  const canViewProfile = () => {
    if (!currentUserProfile || !user) return false;

    if (currentUserProfile.role === 'admin') return true;

    if (currentUserProfile.role === 'teacher' && currentUserProfile.id === userId) return true;

    if (currentUserProfile.role === 'teacher') return true;

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

  if (!teacherData) {
    return (
      <div className="min-h-screen apple-gradient flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Teacher not found</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    }
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
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-semibold mb-4 shadow-lg">
                  {teacherData.full_name.split(' ').map((n: string) => n[0]).join('')}
                </div>

                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {teacherData.full_name}
                </h1>

                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(teacherData.status)} mb-2`}>
                  {teacherData.status}
                </span>

                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  {teacherData.designation}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                  {teacherData.department} Department
                </p>

                <div className="w-full space-y-3 mt-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Employee ID</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{teacherData.employee_id}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Experience</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{teacherData.experience_years} years</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="apple-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Teaching Stats</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Students</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{teacherData.total_students}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Weekly Hours</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{teacherData.teaching_load.weekly_hours}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Classes/Week</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{teacherData.teaching_load.classes_per_week}</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Performance</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{teacherData.average_class_performance}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${teacherData.average_class_performance}%` }}
                    />
                  </div>
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
                  <p className="text-gray-900 dark:text-white">{teacherData.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Contact Number</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">{teacherData.contact_number}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Date of Birth</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(teacherData.date_of_birth).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Gender</span>
                  </div>
                  <p className="text-gray-900 dark:text-white capitalize">{teacherData.gender}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Joining Date</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(teacherData.date_of_joining).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Emergency Contact</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">{teacherData.emergency_contact}</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Address</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">{teacherData.residential_address}</p>
                </div>
              </div>
            </div>

            <div className="apple-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Educational Qualifications</h2>

              <div className="space-y-4">
                {teacherData.qualifications.map((qual: any, index: number) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{qual.degree}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{qual.institution}</p>
                      <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{qual.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="apple-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Teaching Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Subjects Taught</h3>
                  <div className="flex flex-wrap gap-2">
                    {teacherData.subjects_taught.map((subject: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Classes Handled</h3>
                  <div className="flex flex-wrap gap-2">
                    {teacherData.classes_handled.map((cls: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                      >
                        Class {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {teacherData.specializations && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {teacherData.specializations.map((spec: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {teacherData.responsibilities && teacherData.responsibilities.length > 0 && (
              <div className="apple-card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Responsibilities</h2>

                <div className="space-y-3">
                  {teacherData.responsibilities.map((resp: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-900 dark:text-white">{resp}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {teacherData.achievements && teacherData.achievements.length > 0 && (
              <div className="apple-card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Awards & Achievements</h2>

                <div className="space-y-4">
                  {teacherData.achievements.map((achievement: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                      <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{achievement.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{achievement.organization}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
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

            {currentUserProfile?.role === 'admin' && (
              <div className="apple-card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Classes Teaching</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'class-1', name: '10-A', subject: 'Mathematics', studentsCount: 45, schedule: 'Mon, Wed, Fri - 9:00 AM' },
                    { id: 'class-2', name: '10-B', subject: 'Mathematics', studentsCount: 42, schedule: 'Tue, Thu - 10:00 AM' },
                    { id: 'class-3', name: '11-Science', subject: 'Advanced Mathematics', studentsCount: 38, schedule: 'Mon, Wed - 11:00 AM' },
                    { id: 'class-4', name: '12-Science', subject: 'Calculus', studentsCount: 35, schedule: 'Tue, Thu, Fri - 2:00 PM' },
                    { id: 'class-5', name: '9-A', subject: 'Mathematics', studentsCount: 48, schedule: 'Mon, Wed, Fri - 3:00 PM' },
                    { id: 'class-6', name: '9-B', subject: 'Mathematics', studentsCount: 47, schedule: 'Tue, Thu - 3:00 PM' }
                  ].map((classItem) => (
                    <div
                      key={classItem.id}
                      className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                            {classItem.name.split('-')[0]}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Class {classItem.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {classItem.subject}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{classItem.studentsCount} students</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{classItem.schedule}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Teaching Load Summary
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Total: {teacherData.teaching_load.classes_per_week} classes per week ({teacherData.teaching_load.weekly_hours} hours) |
                        Total Students: {teacherData.total_students}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileView;
