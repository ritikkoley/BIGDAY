import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { Calendar, Clock, MessageSquare, AlertTriangle, BookOpen, User } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore'; 
import { demoUpcoming, demoTimetable, demoMessages } from '../../data/demoData';
import { format } from 'date-fns';
import { sampleHomeData } from '../../data/sampleData';

interface UpcomingAssessment {
  id: string;
  assessment: string;
  due_date: string;
  course: string;
}

interface TimetableEntry {
  day: string;
  time: string;
  subject: string;
  room: string;
}

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: {
    name: string;
    role: string;
  };
  priority: string;
  is_read: boolean;
  created_at: string;
}

const UpcomingListComponent: React.FC<{ items: UpcomingAssessment[] }> = ({ items }) => (
  <div className="apple-card p-6">
    <div className="flex items-center space-x-3 mb-4">
      <AlertTriangle className="w-5 h-5 text-apple-blue-500" />
      <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
        Upcoming Assessments
      </h3>
    </div>
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-apple-gray-600 dark:text-white">
                {item.assessment}
              </h4>
              <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                {item.course}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-apple-blue-500">
                {format(new Date(item.due_date), 'MMM d')}
              </p>
              <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300">
                {format(new Date(item.due_date), 'h:mm a')}
              </p>
            </div>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-apple-gray-400 dark:text-apple-gray-300 text-center py-4">
          No upcoming assessments
        </p>
      )}
    </div>
  </div>
);

const TimetableGridComponent: React.FC<{ schedule: TimetableEntry[] }> = ({ schedule }) => (
  <div className="apple-card p-6">
    <div className="flex items-center space-x-3 mb-4">
      <Calendar className="w-5 h-5 text-apple-blue-500"  />
      <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
        Weekly Schedule
      </h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-apple-gray-200 dark:border-apple-gray-700">
            <th className="px-4 py-2 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">Day</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">Time</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">Subject</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-apple-gray-400 dark:text-apple-gray-300">Room</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-apple-gray-200 dark:divide-apple-gray-700">
          {schedule.map((entry, index) => (
            <tr key={index}>
              <td className="px-4 py-3 text-sm text-apple-gray-600 dark:text-apple-gray-300 capitalize">
                {entry.day}
              </td>
              <td className="px-4 py-3 text-sm text-apple-gray-600 dark:text-apple-gray-300">
                {entry.time}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-apple-gray-600 dark:text-white">
                {entry.subject}
              </td>
              <td className="px-4 py-3 text-sm text-apple-gray-600 dark:text-apple-gray-300">
                {entry.room}
              </td>
            </tr>
          ))}
          {schedule.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-4 text-center text-apple-gray-400 dark:text-apple-gray-300">
                No scheduled classes
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const MessagesChatComponent: React.FC<{ 
  messages: Message[]; 
  markRead: (id: string) => void;
}> = ({ messages, markRead }) => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markRead(message.id);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      normal: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      high: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      urgent: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[priority as keyof typeof colors] || colors.normal;
  };

  return (
    <div className="apple-card p-6">
      <div className="flex items-center space-x-3 mb-4">
        <MessageSquare className="w-5 h-5 text-apple-blue-500" />
        <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
          Messages
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {messages.map((message) => (
            <button
              key={message.id}
              onClick={() => handleSelectMessage(message)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedMessage?.id === message.id
                  ? 'bg-apple-blue-50 dark:bg-apple-blue-900/20'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${!message.is_read ? 'border-l-4 border-apple-blue-500' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-apple-gray-400" />
                  <span className="text-sm font-medium text-apple-gray-600 dark:text-white">
                    {message.sender.name}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(message.priority)}`}>
                  {message.priority}
                </span>
              </div>
              <h4 className="font-medium text-apple-gray-600 dark:text-white text-sm truncate">
                {message.subject}
              </h4>
              <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mt-1 truncate">
                {message.content}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <Clock className="w-3 h-3 text-apple-gray-400" />
                <span className="text-xs text-apple-gray-400 dark:text-apple-gray-300">
                  {format(new Date(message.created_at), 'MMM d, h:mm a')}
                </span>
              </div>
            </button>
          ))}
          {messages.length === 0 && (
            <p className="text-apple-gray-400 dark:text-apple-gray-300 text-center py-4">
              No messages
            </p>
          )}
        </div>
        <div>
          {selectedMessage ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-apple-blue-500" />
                  <div>
                    <h4 className="font-medium text-apple-gray-600 dark:text-white">
                      {selectedMessage.sender.name}
                    </h4>
                    <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300">
                      {selectedMessage.sender.role}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-apple-gray-400 dark:text-apple-gray-300">
                  {format(new Date(selectedMessage.created_at), 'MMM d, h:mm a')}
                </span>
              </div>
              <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
                {selectedMessage.subject}
              </h3>
              <p className="text-sm text-apple-gray-600 dark:text-apple-gray-300 whitespace-pre-wrap">
                {selectedMessage.content}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <MessageSquare className="w-12 h-12 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-3" />
              <p className="text-apple-gray-400 dark:text-apple-gray-300">
                Select a message to view
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    fetchMessages, 
    messages, 
    subscribeToMessages, 
    unsubscribeAll,
    isLoading: messagesLoading, 
    error: messagesError 
  } = useDataStore();
  const [upcoming, setUpcoming] = useState<UpcomingAssessment[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(messagesError);

  useEffect(() => {
    if (user) {
      fetchData();
      fetchMessages(user.id); 
      // Subscribe to real-time updates for messages
      subscribeToMessages(user.id);
      
      // Cleanup subscription on unmount
      return () => {
        unsubscribeAll();
      };
    }
  }, [user, fetchMessages, subscribeToMessages, unsubscribeAll]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch upcoming assessments
      const { data: upcomingData, error: upcomingError } = await supabase
        .from('student_upcoming')
        .select('*');
      
      if (upcomingError) throw upcomingError;
      setUpcoming(upcomingData || []);
      
      // Fetch courses to get timetable
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('name, timetable')
        .contains('group_ids', [
          (await supabase
            .from('user_profiles')
            .select('group_id')
            .eq('id', user?.id)
            .single()
          ).data?.group_id
        ]);
      
      if (coursesError) throw coursesError;
      
      // Process timetable data
      const timetableEntries: TimetableEntry[] = [];
      coursesData?.forEach(course => {
        if (course.timetable && Array.isArray(course.timetable)) {
          course.timetable.forEach((entry: any) => {
            timetableEntries.push({
              day: entry.day,
              time: entry.time,
              subject: course.name,
              room: entry.room || 'TBD'
            });
          });
        }
      });
      
      setTimetable(timetableEntries);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const markMessageAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      fetchMessages(user?.id || '');
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="apple-card p-6">
        <div className="flex items-center space-x-2 text-red-500">
          <AlertTriangle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Welcome back
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingListComponent items={upcoming} />
        <TimetableGridComponent schedule={timetable} />
      </div>

      <MessagesChatComponent 
        messages={messages as Message[]} 
        markRead={markMessageAsRead} 
      />
    </div>
  );
};

export default Home;