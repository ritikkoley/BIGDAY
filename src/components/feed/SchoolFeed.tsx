import React, { useState, useEffect } from 'react';
import { FeedList } from './FeedList';
import { Megaphone, Filter, Search } from 'lucide-react';

interface SchoolFeedProps {
  studentName?: string;
}

export const SchoolFeed: React.FC<SchoolFeedProps> = ({ studentName }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Demo data for the feed
  const demoFeedPosts = [
    {
      id: 'post-1',
      title: 'Annual Sports Day 2024 - Outstanding Performances!',
      body: 'Our students showcased incredible talent and sportsmanship during the Annual Sports Day. From track and field events to team sports, every participant gave their best effort. Special congratulations to all medal winners and participants who embodied the true spirit of healthy competition.',
      category: {
        name: 'Sports',
        icon: 'Zap',
        color: '#10B981'
      },
      tags: ['sports', 'annual-event', 'achievements'],
      event_date: '2024-12-15',
      media: [
        {
          id: 'media-1',
          type: 'image' as const,
          filename: 'sports_day_winners.jpg',
          path: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
          alt_text: 'Students celebrating with medals and trophies'
        },
        {
          id: 'media-2',
          type: 'image' as const,
          filename: 'relay_race.jpg',
          path: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop',
          alt_text: 'Students participating in relay race'
        }
      ],
      author: {
        name: 'Sports Department',
        role: 'staff'
      },
      likes_count: 45,
      comments_count: 12,
      is_liked: false,
      created_at: '2024-12-16T10:30:00Z'
    },
    {
      id: 'post-2',
      title: 'Science Exhibition 2024 - Innovation at its Best',
      body: 'Students from grades 6-12 presented amazing science projects at our annual exhibition. From robotics to environmental solutions, our young scientists demonstrated creativity and scientific thinking. Thank you to all parents and guests who attended!',
      category: {
        name: 'Academics',
        icon: 'GraduationCap',
        color: '#3B82F6'
      },
      tags: ['science', 'exhibition', 'innovation'],
      event_date: '2024-12-10',
      media: [
        {
          id: 'media-3',
          type: 'image' as const,
          filename: 'science_exhibition.jpg',
          path: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
          alt_text: 'Students presenting science projects'
        }
      ],
      author: {
        name: 'Science Department',
        role: 'teacher'
      },
      likes_count: 38,
      comments_count: 8,
      is_liked: true,
      created_at: '2024-12-11T14:20:00Z'
    },
    {
      id: 'post-3',
      title: 'Cultural Festival Celebration',
      body: 'Our annual cultural festival was a vibrant celebration of diversity and talent. Students performed traditional dances, music, and drama from various cultures. The event promoted cultural understanding and showcased our students\' artistic abilities.',
      category: {
        name: 'Cultural Events',
        icon: 'Music',
        color: '#8B5CF6'
      },
      tags: ['cultural', 'festival', 'diversity', 'arts'],
      event_date: '2024-12-05',
      media: [
        {
          id: 'media-4',
          type: 'image' as const,
          filename: 'cultural_dance.jpg',
          path: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=600&fit=crop',
          alt_text: 'Students performing traditional dance'
        },
        {
          id: 'media-5',
          type: 'image' as const,
          filename: 'music_performance.jpg',
          path: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
          alt_text: 'Students playing musical instruments'
        }
      ],
      author: {
        name: 'Cultural Committee',
        role: 'staff'
      },
      likes_count: 52,
      comments_count: 15,
      is_liked: false,
      created_at: '2024-12-06T09:15:00Z'
    },
    {
      id: 'post-4',
      title: 'Mathematics Olympiad Winners',
      body: 'Congratulations to our brilliant mathematicians who excelled in the Regional Mathematics Olympiad! Their dedication to problem-solving and mathematical thinking has brought honor to our school. We are proud of their achievements.',
      category: {
        name: 'Achievements',
        icon: 'Trophy',
        color: '#F59E0B'
      },
      tags: ['mathematics', 'olympiad', 'winners'],
      media: [
        {
          id: 'media-6',
          type: 'image' as const,
          filename: 'math_winners.jpg',
          path: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&h=600&fit=crop',
          alt_text: 'Students with mathematics competition certificates'
        }
      ],
      author: {
        name: 'Mathematics Department',
        role: 'teacher'
      },
      likes_count: 67,
      comments_count: 20,
      is_liked: true,
      created_at: '2024-12-01T16:45:00Z'
    },
    {
      id: 'post-5',
      title: 'Important: Parent-Teacher Meeting Schedule',
      body: 'Dear parents, we are pleased to invite you to our quarterly parent-teacher meetings. This is an excellent opportunity to discuss your child\'s progress and collaborate on their educational journey. Please check the schedule and book your preferred time slots.',
      category: {
        name: 'Announcements',
        icon: 'Megaphone',
        color: '#EF4444'
      },
      tags: ['parents', 'meeting', 'schedule'],
      event_date: '2024-12-20',
      media: [],
      author: {
        name: 'Administration',
        role: 'admin'
      },
      likes_count: 23,
      comments_count: 5,
      is_liked: false,
      created_at: '2024-11-28T11:00:00Z'
    }
  ];

  useEffect(() => {
    // Load demo posts
    setPosts(demoFeedPosts);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              is_liked: !post.is_liked,
              likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1
            }
          : post
      )
    );
  };

  const handleShare = (postId: string) => {
    // In a real implementation, this would open a share dialog
    console.log('Sharing post:', postId);
  };

  const handlePostClick = (postId: string) => {
    // In a real implementation, this would navigate to the full post view
    console.log('Opening post:', postId);
  };

  const categories = [
    { id: 'all', name: 'All Posts', color: '#6B7280' },
    { id: 'achievements', name: 'Achievements', color: '#F59E0B' },
    { id: 'sports', name: 'Sports', color: '#10B981' },
    { id: 'cultural', name: 'Cultural', color: '#8B5CF6' },
    { id: 'academics', name: 'Academics', color: '#3B82F6' },
    { id: 'announcements', name: 'Announcements', color: '#EF4444' }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || 
      post.category.name.toLowerCase().includes(selectedCategory);
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <Megaphone className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              School Feed
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Stay updated with school events and achievements
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="apple-card p-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-apple-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-apple-gray-400 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
                }`}
                style={{
                  backgroundColor: selectedCategory === category.id ? category.color : undefined
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed Posts */}
      <FeedList
        posts={filteredPosts}
        onLike={handleLike}
        onShare={handleShare}
        onPostClick={handlePostClick}
        isLoading={isLoading}
        hasMore={false}
      />
    </div>
  );
};