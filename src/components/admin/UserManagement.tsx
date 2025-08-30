import React, { useState } from 'react';
import { User, useUserStore } from '../../stores/userStore';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

type UserFormData = Omit<User, 'id'>;

const initialFormData: UserFormData = {
  role: 'student',
  firstName: '',
  lastName: '',
  email: '',
  admissionNumber: '',
  employeeId: '',
  department: '',
  joiningDate: new Date().toISOString().split('T')[0],
  status: 'active',
};

export const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      updateUser(selectedUser, formData);
    } else {
      addUser(formData);
    }
    resetForm();
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user.id);
    setFormData({
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      admissionNumber: user.admissionNumber || '',
      employeeId: user.employeeId || '',
      department: user.department || '',
      joiningDate: user.joiningDate,
      status: user.status,
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
    }
  };

  const resetForm = () => {
    setSelectedUser(null);
    setFormData(initialFormData);
    setIsEditing(false);
  };

  const filteredUsers = users.filter((user) => {
    const searchString = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchString) ||
      user.lastName.toLowerCase().includes(searchString) ||
      user.email.toLowerCase().includes(searchString) ||
      (user.admissionNumber && user.admissionNumber.toLowerCase().includes(searchString)) ||
      (user.employeeId && user.employeeId.toLowerCase().includes(searchString))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
            User Management
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-full hover:bg-apple-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="apple-card p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-apple-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg"
          />
        </div>
      </div>

      {/* User Form */}
      {isEditing && (
        <div className="apple-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg"
                  required
                />
              </div>

              {formData.role === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">
                    Admission Number
                  </label>
                  <input
                    type="text"
                    value={formData.admissionNumber}
                    onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg"
                    required
                  />
                </div>
              )}

              {formData.role === 'teacher' && (
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">
                  Joining Date
                </label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600"
              >
                {selectedUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="apple-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-apple-gray-200 dark:border-apple-gray-700">
                <th className="px-6 py-3 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-gray-200 dark:divide-apple-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm text-apple-gray-600 dark:text-apple-gray-300">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-apple-gray-600 dark:text-apple-gray-300 capitalize">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 text-sm text-apple-gray-600 dark:text-apple-gray-300">
                    {user.role === 'student' ? user.admissionNumber : user.employeeId}
                  </td>
                  <td className="px-6 py-4 text-sm text-apple-gray-600 dark:text-apple-gray-300">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1 text-apple-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};