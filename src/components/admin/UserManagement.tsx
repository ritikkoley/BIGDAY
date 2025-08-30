import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { UserProfile, FilterCriteria, BulkOperation } from '../../types/admin';
import { mockUserData, getDataStatistics } from '../../data/mockUserData';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Building,
  AlertTriangle,
  CheckCircle2,
  X,
  Save,
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ITEMS_PER_PAGE = 20;

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'admin', label: 'Administrator' },
  { value: 'staff', label: 'Staff' }
];

const PEER_GROUP_OPTIONS = [
  { value: 'pre_primary', label: 'Pre-Primary' },
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'higher_secondary', label: 'Higher Secondary' },
  { value: 'staff', label: 'Staff' }
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'graduated', label: 'Graduated' },
  { value: 'transferred', label: 'Transferred' }
];

const ACCOMMODATION_OPTIONS = [
  { value: 'day_boarder', label: 'Day Boarder' },
  { value: 'hosteller', label: 'Hosteller' }
];

export const UserManagement: React.FC = () => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(true);
  
  // UI State
  const [showUserForm, setShowUserForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof UserProfile>('full_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Form State
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    role: 'student',
    accommodation_type: 'day_boarder',
    peer_group: 'primary',
    status: 'active'
  });
  
  // Filter State
  const [filters, setFilters] = useState<FilterCriteria>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters, searchTerm]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (useMockData) {
        // Use mock data for demonstration
        let filteredUsers = [...mockUserData];
        
        // Apply filters
        if (filters.role && filters.role.length > 0) {
          filteredUsers = filteredUsers.filter(user => filters.role!.includes(user.role));
        }
        
        if (filters.peer_group && filters.peer_group.length > 0) {
          filteredUsers = filteredUsers.filter(user => filters.peer_group!.includes(user.peer_group));
        }
        
        if (filters.status && filters.status.length > 0) {
          filteredUsers = filteredUsers.filter(user => filters.status!.includes(user.status));
        }
        
        if (filters.accommodation_type && filters.accommodation_type.length > 0) {
          filteredUsers = filteredUsers.filter(user => filters.accommodation_type!.includes(user.accommodation_type));
        }
        
        if (filters.search_term) {
          const searchTerm = filters.search_term.toLowerCase();
          filteredUsers = filteredUsers.filter(user =>
            user.full_name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            (user.admission_number && user.admission_number.toLowerCase().includes(searchTerm)) ||
            (user.employee_id && user.employee_id.toLowerCase().includes(searchTerm)) ||
            (user.contact_number && user.contact_number.includes(searchTerm))
          );
        }
        
        // Apply sorting
        if (sortField) {
          filteredUsers.sort((a, b) => {
            const aValue = a[sortField as keyof UserProfile] || '';
            const bValue = b[sortField as keyof UserProfile] || '';
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return sortDirection === 'asc' 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            }
            
            return sortDirection === 'asc' 
              ? (aValue < bValue ? -1 : 1)
              : (aValue > bValue ? -1 : 1);
          });
        }
        
        setTotalUsers(filteredUsers.length);
        
        // Apply pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
        
        setUsers(paginatedUsers as UserProfile[]);
        setIsLoading(false);
        return;
      }
      
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.full_name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.admission_number?.toLowerCase().includes(term) ||
        user.employee_id?.toLowerCase().includes(term) ||
        user.contact_number?.includes(term)
      );
    }

    // Apply filters
    if (filters.role?.length) {
      filtered = filtered.filter(user => filters.role!.includes(user.role));
    }
    
    if (filters.peer_group?.length) {
      filtered = filtered.filter(user => filters.peer_group!.includes(user.peer_group));
    }
    
    if (filters.status?.length) {
      filtered = filtered.filter(user => filters.status!.includes(user.status));
    }
    
    if (filters.accommodation_type?.length) {
      filtered = filtered.filter(user => filters.accommodation_type!.includes(user.accommodation_type));
    }
    
    if (filters.department?.length) {
      filtered = filtered.filter(user => 
        user.department && filters.department!.includes(user.department)
      );
    }

    // Apply date range filter
    if (filters.date_range) {
      const { field, start, end } = filters.date_range;
      filtered = filtered.filter(user => {
        const date = user[field];
        if (!date) return false;
        const userDate = new Date(date);
        return userDate >= new Date(start) && userDate <= new Date(end);
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleCreateUser = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.full_name || !formData.email || !formData.role) {
        throw new Error('Please fill in all required fields');
      }

      const userData = {
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user?.id
      };

      const { data, error: createError } = await supabase
        .from('user_profiles')
        .insert([userData])
        .select()
        .single();

      if (createError) throw createError;

      setUsers(prev => [data, ...prev]);
      resetForm();
      
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      if (!selectedUser) return;
      
      setIsLoading(true);
      setError(null);

      const updateData = {
        ...formData,
        updated_at: new Date().toISOString(),
        updated_by: user?.id
      };

      const { data, error: updateError } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', selectedUser.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setUsers(prev => prev.map(u => u.id === selectedUser.id ? data : u));
      resetForm();
      
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
      }

      setIsLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (deleteError) throw deleteError;

      setUsers(prev => prev.filter(u => u.id !== userId));
      setSelectedUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      if (selectedUsers.size === 0) return;
      
      if (!window.confirm(`Are you sure you want to delete ${selectedUsers.size} users? This action cannot be undone.`)) {
        return;
      }

      setIsLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('user_profiles')
        .delete()
        .in('id', Array.from(selectedUsers));

      if (deleteError) throw deleteError;

      setUsers(prev => prev.filter(u => !selectedUsers.has(u.id)));
      setSelectedUsers(new Set());
      
    } catch (err) {
      console.error('Error bulk deleting users:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportUsers = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      setIsLoading(true);
      
      const exportData = selectedUsers.size > 0 
        ? filteredUsers.filter(u => selectedUsers.has(u.id))
        : filteredUsers;

      // Create CSV content
      const headers = [
        'Full Name', 'Email', 'Role', 'Admission/Employee Number', 
        'Contact Number', 'Department', 'Status', 'Date Created'
      ];
      
      const csvContent = [
        headers.join(','),
        ...exportData.map(user => [
          `"${user.full_name || ''}"`,
          `"${user.email || ''}"`,
          `"${user.role || ''}"`,
          `"${user.admission_number || user.employee_id || ''}"`,
          `"${user.contact_number || ''}"`,
          `"${user.department || ''}"`,
          `"${user.status || ''}"`,
          `"${new Date(user.created_at).toLocaleDateString()}"`
        ].join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Error exporting users:', err);
      setError(err instanceof Error ? err.message : 'Failed to export users');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      role: 'student',
      accommodation_type: 'day_boarder',
      peer_group: 'primary',
      status: 'active'
    });
    setSelectedUser(null);
    setShowUserForm(false);
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setFormData(user);
    setShowUserForm(true);
  };

  const handleSort = (field: keyof UserProfile) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const currentPageUsers = getCurrentPageUsers();
    const allSelected = currentPageUsers.every(user => selectedUsers.has(user.id));
    
    if (allSelected) {
      // Deselect all on current page
      setSelectedUsers(prev => {
        const newSet = new Set(prev);
        currentPageUsers.forEach(user => newSet.delete(user.id));
        return newSet;
      });
    } else {
      // Select all on current page
      setSelectedUsers(prev => {
        const newSet = new Set(prev);
        currentPageUsers.forEach(user => newSet.add(user.id));
        return newSet;
      });
    }
  };

  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      graduated: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      transferred: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      student: <GraduationCap className="w-4 h-4" />,
      teacher: <Users className="w-4 h-4" />,
      admin: <Building className="w-4 h-4" />,
      staff: <FileText className="w-4 h-4" />
    };
    return icons[role as keyof typeof icons] || <Users className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="use-mock-data"
                checked={useMockData}
                onChange={(e) => setUseMockData(e.target.checked)}
                className="w-4 h-4 text-apple-blue-500 border-apple-gray-300 rounded focus:ring-apple-blue-500"
              />
              <label htmlFor="use-mock-data" className="text-sm text-apple-gray-600 dark:text-white">
                Use Demo Data (500 records)
              </label>
            </div>
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <Users className="w-6 h-6 text-apple-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                User Management System
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                {useMockData ? `Demo: ${totalUsers} users loaded` : 'Manage institutional users and their information'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                showFilters 
                  ? 'bg-apple-blue-500 text-white' 
                  : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button
              onClick={() => setShowUserForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-full hover:bg-apple-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>
        
        {useMockData && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              Demo Data Statistics:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-600 dark:text-blue-400">Students:</span>
                <span className="ml-2 font-medium">{getDataStatistics().byRole.student || 0}</span>
              </div>
              <div>
                <span className="text-blue-600 dark:text-blue-400">Teachers:</span>
                <span className="ml-2 font-medium">{getDataStatistics().byRole.teacher || 0}</span>
              </div>
              <div>
                <span className="text-blue-600 dark:text-blue-400">Staff:</span>
                <span className="ml-2 font-medium">{getDataStatistics().byRole.staff || 0}</span>
              </div>
              <div>
                <span className="text-blue-600 dark:text-blue-400">Admin:</span>
                <span className="ml-2 font-medium">{getDataStatistics().byRole.admin || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Advanced Filters
            </h2>
            <button
              onClick={() => {
                setFilters({});
                setSearchTerm('');
              }}
              className="text-apple-blue-500 hover:text-apple-blue-600 text-sm font-medium"
            >
              Clear All Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                Search Users
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-apple-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, ID, or phone..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                Role
              </label>
              <select
                multiple
                value={filters.role || []}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  role: Array.from(e.target.selectedOptions, option => option.value)
                }))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              >
                {ROLE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                Status
              </label>
              <select
                multiple
                value={filters.status || []}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  status: Array.from(e.target.selectedOptions, option => option.value)
                }))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Peer Group Filter */}
            <div>
              <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                Peer Group
              </label>
              <select
                multiple
                value={filters.peer_group || []}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  peer_group: Array.from(e.target.selectedOptions, option => option.value)
                }))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              >
                {PEER_GROUP_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Accommodation Filter */}
            <div>
              <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                Accommodation
              </label>
              <select
                multiple
                value={filters.accommodation_type || []}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  accommodation_type: Array.from(e.target.selectedOptions, option => option.value)
                }))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              >
                {ACCOMMODATION_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                Date Range
              </label>
              <div className="flex space-x-2">
                <select
                  value={filters.date_range?.field || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    date_range: e.target.value ? {
                      field: e.target.value as any,
                      start: prev.date_range?.start || '',
                      end: prev.date_range?.end || ''
                    } : undefined
                  }))}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                >
                  <option value="">Select Field</option>
                  <option value="date_of_admission">Admission Date</option>
                  <option value="date_of_joining">Joining Date</option>
                  <option value="created_at">Created Date</option>
                </select>
                <input
                  type="date"
                  value={filters.date_range?.start || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    date_range: prev.date_range ? {
                      ...prev.date_range,
                      start: e.target.value
                    } : undefined
                  }))}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                />
                <input
                  type="date"
                  value={filters.date_range?.end || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    date_range: prev.date_range ? {
                      ...prev.date_range,
                      end: e.target.value
                    } : undefined
                  }))}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedUsers.size > 0 && (
        <div className="apple-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-apple-gray-600 dark:text-white">
                {selectedUsers.size} user(s) selected
              </span>
              <button
                onClick={() => setSelectedUsers(new Set())}
                className="text-apple-blue-500 hover:text-apple-blue-600 text-sm font-medium"
              >
                Clear Selection
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExportUsers('csv')}
                className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="apple-card overflow-hidden">
        <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Users ({filteredUsers.length})
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExportUsers('csv')}
                className="flex items-center space-x-2 px-3 py-2 bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300 rounded-lg hover:bg-apple-gray-200 dark:hover:bg-apple-gray-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export All</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={getCurrentPageUsers().length > 0 && getCurrentPageUsers().every(user => selectedUsers.has(user.id))}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-apple-blue-500 border-apple-gray-300 rounded focus:ring-apple-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('full_name')}
                    className="flex items-center space-x-1 text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300 hover:text-apple-gray-600 dark:hover:text-apple-gray-100"
                  >
                    <span>Name</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('role')}
                    className="flex items-center space-x-1 text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300 hover:text-apple-gray-600 dark:hover:text-apple-gray-100"
                  >
                    <span>Role</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  Academic Info
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1 text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300 hover:text-apple-gray-600 dark:hover:text-apple-gray-100"
                  >
                    <span>Status</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-gray-200/50 dark:divide-apple-gray-500/20">
              {getCurrentPageUsers().map((user) => (
                <tr key={user.id} className="hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 text-apple-blue-500 border-apple-gray-300 rounded focus:ring-apple-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-apple-gray-100 dark:bg-apple-gray-700 rounded-lg">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <div className="font-medium text-apple-gray-600 dark:text-white">
                          {user.full_name}
                        </div>
                        <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        user.role === 'student' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        user.role === 'teacher' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                        user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                      }`}>
                        {user.role}
                      </span>
                      <span className="text-xs text-apple-gray-400 dark:text-apple-gray-300 capitalize">
                        {user.peer_group?.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {user.contact_number && (
                        <div className="flex items-center space-x-2 text-sm text-apple-gray-600 dark:text-apple-gray-300">
                          <Phone className="w-3 h-3" />
                          <span>{user.contact_number}</span>
                        </div>
                      )}
                      {user.residential_address && (
                        <div className="flex items-center space-x-2 text-sm text-apple-gray-600 dark:text-apple-gray-300">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-32">{user.residential_address}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {(user.admission_number || user.employee_id) && (
                        <div className="text-sm font-medium text-apple-gray-600 dark:text-white">
                          {user.admission_number || user.employee_id}
                        </div>
                      )}
                      {user.current_standard && (
                        <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                          Class {user.current_standard} {user.section && `- ${user.section}`}
                        </div>
                      )}
                      {user.department && (
                        <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                          {user.department}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-apple-gray-400 hover:text-apple-blue-500 transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-apple-gray-400 hover:text-red-500 transition-colors"
                        title="Delete User"
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-apple-gray-200/50 dark:border-apple-gray-500/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-apple-gray-600 dark:text-apple-gray-300">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-apple-gray-100 dark:bg-apple-gray-700 rounded text-sm text-apple-gray-600 dark:text-apple-gray-300">
                {currentPage} of {getTotalPages()}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(getTotalPages(), prev + 1))}
                disabled={currentPage === getTotalPages()}
                className="p-2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
                  {selectedUser ? 'Edit User' : 'Create New User'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-apple-blue-500" />
                  <span>Personal Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.full_name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      value={formData.contact_number || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact_number: e.target.value }))}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.date_of_birth || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                      Residential Address
                    </label>
                    <textarea
                      value={formData.residential_address || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, residential_address: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Role & Classification */}
              <div>
                <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4 flex items-center space-x-2">
                  <Building className="w-5 h-5 text-apple-blue-500" />
                  <span>Role & Classification</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                      Role *
                    </label>
                    <select
                      value={formData.role || 'student'}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                      required
                    >
                      {ROLE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                      Peer Group *
                    </label>
                    <select
                      value={formData.peer_group || 'primary'}
                      onChange={(e) => setFormData(prev => ({ ...prev, peer_group: e.target.value as any }))}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                      required
                    >
                      {PEER_GROUP_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                      required
                    >
                      {STATUS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Academic Details */}
              <div>
                <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4 flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-apple-blue-500" />
                  <span>Academic Details</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.role === 'student' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                          Admission Number
                        </label>
                        <input
                          type="text"
                          value={formData.admission_number || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, admission_number: e.target.value }))}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                          Date of Admission
                        </label>
                        <input
                          type="date"
                          value={formData.date_of_admission || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, date_of_admission: e.target.value }))}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                          Current Standard
                        </label>
                        <input
                          type="text"
                          value={formData.current_standard || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, current_standard: e.target.value }))}
                          placeholder="e.g., 10, 12"
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                          Section
                        </label>
                        <input
                          type="text"
                          value={formData.section || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                          placeholder="e.g., A, B, C"
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                          Accommodation Type
                        </label>
                        <select
                          value={formData.accommodation_type || 'day_boarder'}
                          onChange={(e) => setFormData(prev => ({ ...prev, accommodation_type: e.target.value as any }))}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                        >
                          {ACCOMMODATION_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                          Employee ID
                        </label>
                        <input
                          type="text"
                          value={formData.employee_id || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                          Date of Joining
                        </label>
                        <input
                          type="date"
                          value={formData.date_of_joining || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, date_of_joining: e.target.value }))}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                          Department
                        </label>
                        <input
                          type="text"
                          value={formData.department || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                          Designation
                        </label>
                        <input
                          type="text"
                          value={formData.designation || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Family Information */}
              {formData.role === 'student' && (
                <div>
                  <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4 flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-apple-blue-500" />
                    <span>Family Information</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                        Parent/Guardian Name
                      </label>
                      <input
                        type="text"
                        value={formData.parent_guardian_name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, parent_guardian_name: e.target.value }))}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                        Parent Contact Number
                      </label>
                      <input
                        type="tel"
                        value={formData.parent_contact_number || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, parent_contact_number: e.target.value }))}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                        Emergency Contact
                      </label>
                      <input
                        type="tel"
                        value={formData.emergency_contact || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact: e.target.value }))}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-apple-blue-500" />
                  <span>Additional Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.gender || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                      Blood Group
                    </label>
                    <input
                      type="text"
                      value={formData.blood_group || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, blood_group: e.target.value }))}
                      placeholder="e.g., A+, B-, O+"
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={formData.nationality || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                      Religion
                    </label>
                    <input
                      type="text"
                      value={formData.religion || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, religion: e.target.value }))}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                      Caste Category
                    </label>
                    <input
                      type="text"
                      value={formData.caste_category || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, caste_category: e.target.value }))}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-apple-gray-200/50 dark:border-apple-gray-500/20">
                <button
                  onClick={resetForm}
                  className="px-6 py-2 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedUser ? handleUpdateUser : handleCreateUser}
                  disabled={isLoading || !formData.full_name || !formData.email || !formData.role}
                  className="flex items-center space-x-2 px-6 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>{selectedUser ? 'Update User' : 'Create User'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="apple-card p-4">
          <div className="flex items-center space-x-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-apple-blue-500"></div>
              <span className="text-apple-gray-600 dark:text-white">Processing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};