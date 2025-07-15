import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Clock, AlertTriangle } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  group_id: string | null;
  subject: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_read: boolean;
  message_type: 'direct' | 'announcement' | 'reminder' | 'alert';
  created_at: string;
  sender: {
    name: string;
    role: string;
  };
}

export const StudentMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      // Mock data instead of fetching from Supabase
      const mockMessages: Message[] = [
        {
          id: 'm1',
          sender_id: 't1',
          recipient_id: 's1',
          group_id: null,
          subject: 'Upcoming Quiz',
          content: 'Please be prepared for the upcoming quiz on neural networks. Focus on activation functions and gradient descent.',
          priority: 'high',
          is_read: false,
          message_type: 'direct',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          sender: {
            name: 'Professor Jagdeep Singh Sokhey',
            role: 'teacher'
          }
        },
        {
          id: 'm2',
          sender_id: 't1',
          recipient_id: 's1',
          group_id: null,
          subject: 'Office Hours',
          content: 'Office hours extended today until 5 PM for Linear Algebra consultation.',
          priority: 'medium',
          is_read: true,
          message_type: 'direct',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          sender: {
            name: 'Professor Jagdeep Singh Sokhey',
            role: 'teacher'
          }
        }
      ];
      setMessages(mockMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'normal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return '📢';
      case 'reminder':
        return '⏰';
      case 'alert':
        return '🚨';
      default:
        return '💬';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="apple-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="apple-card p-6">
        <div className="flex items-center space-x-2 text-red-500">
          <AlertTriangle className="w-5 h-5" />
          <span>Error loading messages: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <MessageSquare className="w-6 h-6 text-apple-blue-500" />
          <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
            Messages
          </h2>
          {messages.filter(m => !m.is_read).length > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
              {messages.filter(m => !m.is_read).length} unread
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 space-y-3 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <button
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.is_read) {
                    markAsRead(message.id);
                  }
                }}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  selectedMessage?.id === message.id
                    ? 'bg-apple-blue-50 dark:bg-apple-blue-900/20 border border-apple-blue-200 dark:border-apple-blue-800'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                } ${!message.is_read ? 'border-l-4 border-l-apple-blue-500' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      {getMessageTypeIcon(message.message_type)}
                    </span>
                    <span className="font-medium text-apple-gray-600 dark:text-white text-sm">
                      {message.sender.name}
                    </span>
                    <span className="text-xs text-apple-gray-400 dark:text-apple-gray-300 capitalize">
                      ({message.sender.role})
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                    {message.priority}
                  </span>
                </div>
                <h4 className="font-medium text-apple-gray-600 dark:text-white mb-1 line-clamp-1">
                  {message.subject}
                </h4>
                <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 line-clamp-2">
                  {message.content}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Clock className="w-3 h-3 text-apple-gray-400" />
                  <span className="text-xs text-apple-gray-400 dark:text-apple-gray-300">
                    {formatDate(message.created_at)}
                  </span>
                </div>
              </button>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-8 text-apple-gray-400 dark:text-apple-gray-300">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-8 h-8 text-apple-blue-500" />
                    <div>
                      <h3 className="font-medium text-apple-gray-600 dark:text-white">
                        {selectedMessage.sender.name}
                      </h3>
                      <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 capitalize">
                        {selectedMessage.sender.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority} priority
                    </span>
                    <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      {formatDate(selectedMessage.created_at)}
                    </span>
                  </div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                  <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                    {selectedMessage.subject}
                  </h2>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-apple-gray-600 dark:text-apple-gray-300 whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                </div>

                {selectedMessage.message_type === 'direct' && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors">
                      <Send className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                <MessageSquare className="w-12 h-12 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
                  Select a Message
                </h3>
                <p className="text-apple-gray-400 dark:text-apple-gray-300">
                  Choose a message from the list to view its contents
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};