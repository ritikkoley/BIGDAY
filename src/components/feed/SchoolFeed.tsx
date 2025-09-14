import React, { useState, useEffect } from 'react';
import { FeedList } from './FeedList';
import { PostComposer } from './PostComposer';
import { Megaphone, Filter, Search, Plus, BarChart3, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';

interface SchoolFeedProps {
  studentName?: string;
  userRole?: 'student' | 'teacher' | 'admin';
  userName?: string;
  showManagement?: boolean;
}

export const SchoolFeed: React.FC<SchoolFeedProps> = ({ 
  studentName, 
  userRole = 'student',
  userName = '',
  showManagement = false 
}) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'feed' | 'manage'>('feed');
  const [showComposer, setShowComposer] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  // Demo data for the feed
  const demoFeedPosts = [
    {
      id: 'post-1',
      title: 'Drama Competition 2024 - Spectacular Performances!',
      body: 'Our talented students delivered breathtaking performances at the Annual Inter-House Drama Competition. From Shakespearean classics to contemporary plays, each house showcased exceptional acting, direction, and stage presence. The creativity and dedication of our young artists truly shone through every performance.',
      category: {
        name: 'Cultural Events',
        icon: 'Music',
        color: '#8B5CF6'
      },
      tags: ['drama', 'competition', 'theater', 'arts'],
      event_date: '2024-12-18',
      media: [
        {
          id: 'media-1',
          type: 'image' as const,
          filename: 'drama_performance.jpg',
          path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop',
          alt_text: 'Students performing in school drama competition'
        },
        {
          id: 'media-2',
          type: 'image' as const,
          filename: 'stage_setup.jpg',
          path: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=500&fit=crop',
          alt_text: 'Beautifully decorated stage for drama performances'
        }
      ],
      author: {
        name: 'Drama Club',
        role: 'staff'
      },
      likes_count: 73,
      comments_count: 18,
      is_liked: true,
      created_at: '2024-12-19T11:30:00Z'
    },
    {
      id: 'post-2',
      title: 'Quiz Bowl Championship - Mental Athletes Shine!',
      body: 'Congratulations to our Quiz Bowl team for their outstanding performance in the Regional Championship! Our students demonstrated exceptional knowledge across subjects including history, science, literature, and current affairs. Their quick thinking and teamwork secured us the second position among 50 participating schools.',
      category: {
        name: 'Academics',
        icon: 'GraduationCap',
        color: '#3B82F6'
      },
      tags: ['quiz', 'competition', 'knowledge', 'championship'],
      event_date: '2024-12-14',
      media: [
        {
          id: 'media-3',
          type: 'image' as const,
          filename: 'quiz_team.jpg',
          path: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop',
          alt_text: 'Students participating in quiz bowl competition'
        }
      ],
      author: {
        name: 'Academic Coordinator',
        role: 'teacher'
      },
      likes_count: 56,
      comments_count: 14,
      is_liked: false,
      created_at: '2024-12-15T14:45:00Z'
    },
    {
      id: 'post-3',
      title: 'Term 1 Examination Results Announced',
      body: 'We are pleased to announce that the Term 1 examination results are now available on the student portal. Overall, our students have shown remarkable improvement with 95% pass rate and excellent performance across all subjects. Individual result sheets and detailed feedback reports can be accessed through your accounts.',
      category: {
        name: 'Announcements',
        icon: 'Megaphone',
        color: '#EF4444'
      },
      tags: ['results', 'examinations', 'academic', 'term1'],
      media: [
        {
          id: 'media-4',
          type: 'image' as const,
          filename: 'exam_results.jpg',
          path: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop',
          alt_text: 'Students celebrating good exam results'
        }
      ],
      author: {
        name: 'Examination Department',
        role: 'admin'
      },
      likes_count: 89,
      comments_count: 25,
      is_liked: true,
      created_at: '2024-12-12T09:00:00Z'
    },
    {
      id: 'post-4',
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
          path: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
          alt_text: 'Students celebrating with medals and trophies'
        },
        {
          id: 'media-2',
          type: 'image' as const,
          filename: 'relay_race.jpg',
          path: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=500&fit=crop',
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
      created_at: '2024-12-10T10:30:00Z'
    },
    {
      id: 'post-5',
      title: 'Swimming Championship Victory - Making Waves!',
      body: 'Our swimming team has made us incredibly proud by winning the District Swimming Championship! With outstanding performances in freestyle, backstroke, and relay events, our athletes demonstrated months of dedicated training and teamwork. Special recognition to our coaches for their excellent guidance.',
      category: {
        name: 'Sports',
        icon: 'Zap',
        color: '#10B981'
      },
      tags: ['swimming', 'championship', 'victory', 'district'],
      event_date: '2024-12-08',
      media: [
        {
          id: 'media-5',
          type: 'image' as const,
          filename: 'swimming_team.jpg',
          path: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=500&fit=crop',
          alt_text: 'Swimming team celebrating championship victory'
        },
        {
          id: 'media-6',
          type: 'image' as const,
          filename: 'swimming_pool.jpg',
          path: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=500&fit=crop',
          alt_text: 'Students competing in swimming pool'
        }
      ],
      author: {
        name: 'Sports Department',
        role: 'staff'
      },
      likes_count: 67,
      comments_count: 22,
      is_liked: true,
      created_at: '2024-12-09T15:20:00Z'
    },
    {
      id: 'post-6',
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
          path: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=500&fit=crop',
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
      created_at: '2024-12-05T14:20:00Z'
    },
    {
      id: 'post-7',
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
          path: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=500&fit=crop',
          alt_text: 'Students performing traditional dance'
        },
        {
          id: 'media-5',
          type: 'image' as const,
          filename: 'music_performance.jpg',
          path: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop',
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
      created_at: '2024-12-02T09:15:00Z'
    },
    {
      id: 'post-8',
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
          path: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&h=500&fit=crop',
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
      created_at: '2024-11-28T16:45:00Z'
    },
    {
      id: 'post-9',
      title: 'Teacher Excellence: National Award Recognition',
      body: 'We are immensely proud to announce that our Mathematics teacher, Dr. Priya Sharma, has been awarded the National Excellence in Teaching Award by the Ministry of Education. Her innovative teaching methods and dedication to student success have been recognized at the highest level. This achievement reflects the quality of education we strive to provide.',
      category: {
        name: 'Achievements',
        icon: 'Trophy',
        color: '#F59E0B'
      },
      tags: ['teacher', 'national-award', 'excellence', 'recognition'],
      media: [
        {
          id: 'media-7',
          type: 'image' as const,
          filename: 'teacher_award.jpg',
          path: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=500&fit=crop',
          alt_text: 'Teacher receiving national excellence award'
        }
      ],
      author: {
        name: 'Principal Office',
        role: 'admin'
      },
      likes_count: 94,
      comments_count: 31,
      is_liked: true,
      created_at: '2024-11-25T12:00:00Z'
    },
    {
      id: 'post-10',
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
      created_at: '2024-11-20T11:00:00Z'
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

  const handleCreatePost = async (postData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPost = {
        id: `post-${Date.now()}`,
        ...postData,
        created_at: new Date().toISOString(),
        author: {
          name: userName,
          role: userRole === 'admin' ? 'Administrator' : 'Teacher'
        },
        likes_count: 0,
        comments_count: 0,
        is_liked: false,
        views_count: 0,
        category: categories.find(c => c.id === postData.category_id) || categories[0]
      };

      setPosts(prev => [newPost, ...prev]);
      setShowComposer(false);
      
      // Show success message (in real app, use toast notification)
      alert(`Post ${postData.status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
    } catch (error) {
      throw new Error('Failed to save post. Please try again.');
    }
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(prev => prev.filter(p => p.id !== postId));
    }
  };

  const handleToggleStatus = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            status: post.status === 'published' ? 'archived' : 'published' 
          }
        : post
    ));
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
    const matchesStatus = activeView === 'feed' || statusFilter === 'all' || post.status === statusFilter;
    
    return matchesCategory && matchesSearch && matchesStatus;
  });

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((sum, p) => sum + p.views_count, 0),
    totalLikes: posts.reduce((sum, p) => sum + p.likes_count, 0)
  };
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
                <Megaphone className="w-6 h-6 text-apple-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                  School Feed
                </h1>
                <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                  {activeView === 'feed' ? 'Stay updated with school events and achievements' : 'Create, manage, and monitor school posts'}
                </p>
              </div>
            </div>
            
            {/* View Toggle for Teachers/Admins */}
          {/* Status Filter (Management View Only) */}
          {activeView === 'manage' && showManagement && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="archived">Archived</option>
            </select>
          )}
            {showManagement && (
              <div className="flex space-x-2 bg-apple-gray-100 dark:bg-apple-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('feed')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'feed'
                      ? 'bg-white dark:bg-gray-800 text-apple-blue-500 shadow-sm'
                      : 'text-apple-gray-600 dark:text-apple-gray-300'
                  }`}
                >
                  View Feed
                </button>
                <button
                  onClick={() => setActiveView('manage')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'manage'
                      ? 'bg-white dark:bg-gray-800 text-apple-blue-500 shadow-sm'
                      : 'text-apple-gray-600 dark:text-apple-gray-300'
                  }`}
                >
                  Manage Posts
                </button>
              </div>
            )}
          </div>
          
          {activeView === 'manage' && showManagement && (
            <button
              onClick={() => setShowComposer(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Create Post</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards (Management View Only) */}
      {activeView === 'manage' && showManagement && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-apple-gray-200 dark:border-apple-gray-600">
            <div className="text-2xl font-bold text-apple-blue-500">{stats.total}</div>
            <div className="text-sm text-apple-gray-500 dark:text-apple-gray-400">Total Posts</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-apple-gray-200 dark:border-apple-gray-600">
            <div className="text-2xl font-bold text-green-500">{stats.published}</div>
            <div className="text-sm text-apple-gray-500 dark:text-apple-gray-400">Published</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-apple-gray-200 dark:border-apple-gray-600">
            <div className="text-2xl font-bold text-yellow-500">{stats.drafts}</div>
            <div className="text-sm text-apple-gray-500 dark:text-apple-gray-400">Drafts</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-apple-gray-200 dark:border-apple-gray-600">
            <div className="text-2xl font-bold text-purple-500">{stats.totalViews}</div>
            <div className="text-sm text-apple-gray-500 dark:text-apple-gray-400">Total Views</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-apple-gray-200 dark:border-apple-gray-600">
            <div className="text-2xl font-bold text-red-500">{stats.totalLikes}</div>
            <div className="text-sm text-apple-gray-500 dark:text-apple-gray-400">Total Likes</div>
          </div>
        </div>
      )}

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

      {/* Content Based on Active View */}
      {activeView === 'feed' || !showManagement ? (
        <FeedList
          posts={filteredPosts}
          onLike={handleLike}
          onShare={handleShare}
          onPostClick={handlePostClick}
          isLoading={isLoading}
          hasMore={false}
        />
      ) : (
        /* Management View */
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-apple-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-apple-gray-500 dark:text-apple-gray-400">Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone className="w-16 h-16 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
                No posts found
              </h3>
              <p className="text-apple-gray-500 dark:text-apple-gray-400 mb-4">
                {searchTerm || selectedCategory !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'Create your first post to get started!'}
              </p>
              {(!searchTerm && selectedCategory === 'all' && statusFilter === 'all') && (
                <button
                  onClick={() => setShowComposer(true)}
                  className="px-6 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors"
                >
                  Create First Post
                </button>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg border border-apple-gray-200 dark:border-apple-gray-600 overflow-hidden">
                {/* Management Header */}
                <div className="px-6 py-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 border-b border-apple-gray-200 dark:border-apple-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : post.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                      <div className="flex items-center space-x-4 text-sm text-apple-gray-500 dark:text-apple-gray-400">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views_count} views</span>
                        </span>
                        <span>•</span>
                        <span>by {post.author.name}</span>
                        <span>•</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleStatus(post.id)}
                        className="p-2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200 transition-colors"
                        title={post.status === 'published' ? 'Archive post' : 'Publish post'}
                      >
                        {post.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        className="p-2 text-apple-gray-400 hover:text-apple-blue-500 transition-colors"
                        title="Edit post"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-apple-gray-400 hover:text-red-500 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Post Content */}
                <div className="p-6">
                  <FeedList posts={[post]} onLike={handleLike} onShare={handleShare} onPostClick={handlePostClick} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Post Composer Modal */}
      <PostComposer
        isOpen={showComposer}
        onSave={handleCreatePost}
        onCancel={() => setShowComposer(false)}
      />
    </div>
  );
};