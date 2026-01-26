import React, { useState } from 'react';
import { CheckSquare, Plus, Calendar, AlertTriangle, X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  dueDate: string;
  createdAt: string;
}

export const TaskManagement: React.FC = () => {
  const [view, setView] = useState<'pending' | 'in_progress' | 'completed' | 'overdue'>('pending');
  const [showForm, setShowForm] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Update Admission Forms',
      description: 'Add new fields to admission forms',
      priority: 'high',
      status: 'pending',
      dueDate: '2024-02-01',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Conduct Staff Meeting',
      description: 'Monthly staff meeting and updates',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2024-01-25',
      createdAt: '2024-01-15'
    }
  ]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: ''
  });

  const handleCreateTask = () => {
    if (form.title && form.dueDate) {
      const newTask: Task = {
        id: String(tasks.length + 1),
        title: form.title,
        description: form.description,
        priority: form.priority,
        status: 'pending',
        dueDate: form.dueDate,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTasks([...tasks, newTask]);
      setForm({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowForm(false);
    }
  };

  const filteredTasks = tasks.filter(t => t.status === view);
  const allCounts = {
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <CheckSquare className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Task Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Assign, track, and complete institutional tasks
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending', value: allCounts.pending, color: 'blue' },
          { label: 'In Progress', value: allCounts.in_progress, color: 'yellow' },
          { label: 'Completed', value: allCounts.completed, color: 'green' },
          { label: 'Overdue', value: allCounts.overdue, color: 'red' }
        ].map((item) => (
          <div key={item.label} className="apple-card p-6">
            <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">{item.label}</p>
            <p className={`text-2xl font-bold text-${item.color}-500`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="apple-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          {['pending', 'in_progress', 'completed', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setView(status as any)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                view === status
                  ? 'bg-apple-blue-500 text-white'
                  : 'bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task.id} className="p-4 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-apple-gray-600 dark:text-white">{task.title}</p>
                    <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">{task.description}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-apple-gray-400 dark:text-apple-gray-300">
                        <Calendar className="w-3 h-3" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-apple-gray-400">No tasks in this category</p>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="apple-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-apple-gray-600 dark:text-white">Create Task</h2>
              <button onClick={() => setShowForm(false)} className="text-apple-gray-400 hover:text-apple-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white resize-none"
                rows={3}
              />
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleCreateTask}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-apple-gray-200 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
