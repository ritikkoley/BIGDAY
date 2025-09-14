import React, { useState, useEffect } from 'react';
import { PostComposer } from './PostComposer';
import { FeedList } from './FeedList';
import { 
  Plus, 
  Filter, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  BarChart3,
  Download,
  Megaphone
} from 'lucide-react';

interface FeedManagementProps {
  userRole: 'teacher' | 'admin';
  userName: string;
}

export const FeedManagement: React.FC<FeedManagementProps> = ({
  userRole,
  userName
}) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced demo data with management capabilities
  const demoFeedPosts = [
    {
      id: 'post-1',
      title: 'Drama Competition 2024 - Spectacular Performances!',
      body: 'Our talented students delivered breathtaking performances at the Annual Inter-House Drama Competition. From Shakespearean classics to contemporary plays, each house showcased exceptional acting, direction, and stage presence.',
      category: {
        name: 'Cultural Events',
        color: '#8B5CF6',
        icon: 'Music'
      },
      media: [
        {
          type: 'image',
          path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop',
          alt_text: 'Students performing on stage during drama competition'
        },
        {
          type: 'image', 
          path: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=500&fit=crop',
          alt_text: 'Theater setup with dramatic lighting'
        }
      ],
      tags: ['drama', 'competition', 'arts', 'performance'],
      event_date: '2024-01-25',
      likes_count: 73,
      comments_count: 18,
      is_liked: false,
      created_at: '2024-01-26T10:30:00Z',
      author: {
        name: 'Ms. Sarah Johnson',
        role: 'Drama Teacher'
      },
      status: 'published',
      visibility: 'public',
      views_count: 245
    },
    {
      id: 'post-2',
      title: 'Quiz Bowl Championship - Regional Success!',
      body: 'Congratulations to our Quiz Bowl team for securing 2nd place in the Regional Championship! Our mental athletes competed against 50+ schools, demonstrating exceptional knowledge across science, literature, history, and current affairs.',
      category: {
        name: 'Academics',
        color: '#3B82F6',
        icon: 'GraduationCap'
      },
      media: [
        {
          type: 'image',
          path: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=500&fit=crop',
          alt_text: 'Students in academic competition setting'
        }
      ],
      tags: ['quiz', 'competition', 'academics', 'achievement'],
      event_date: '2024-01-20',
      likes_count: 56,
      comments_count: 14,
      is_liked: true,
      created_at: '2024-01-21T14:15:00Z',
      author: {
        name: 'Dr. Michael Chen',
        role: 'Academic Coordinator'
      },
      status: 'published',
      visibility: 'public',
      views_count: 189
    },
    {
      id: 'post-3',
      title: 'Term 1 Examination Results - Outstanding Performance',
      body: 'We are proud to announce that our students have achieved a remarkable 95% pass rate in Term 1 examinations. Special congratulations to our top performers and appreciation to all teachers for their dedicated guidance.',
      category: {
        name: 'Announcements',
        color: '#EF4444',
        icon: 'Megaphone'
      },
      media: [
        {
          type: 'image',
          path: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=500&fit=crop',
          alt_text: 'Students celebrating academic success'
        }
      ],
      tags: ['results', 'examinations', 'achievement', 'academics'],
      event_date: '2024-01-18',
      likes_count: 89,
      comments_count: 25,
      is_liked: true,
      created_at: '2024-01-19T09:00:00Z',
      author: {
        name: 'Principal Dr. Rajesh Kumar',
        role: 'Principal'
      },
      status: 'published',
      visibility: 'public',
      views_count: 412
    },
    {
      id: 'post-4',
      title: 'Swimming Championship Victory - Making Waves!',
      body: 'Our swimming team has made us incredibly proud by winning the District Swimming Championship! With victories in multiple events including freestyle, backstroke, and relay races, our aquatic athletes have set new standards of excellence.',
      category: {
        name: 'Sports',
        color: '#10B981',
        icon: 'Zap'
      },
      media: [
        {
          type: 'image',
          path: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=500&fit=crop',
          alt_text: 'Swimming team celebrating victory'
        },
        {
          type: 'image',
          path: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
          alt_text: 'Swimming pool competition scene'
        }
      ],
      tags: ['swimming', 'championship', 'sports', 'victory'],
      event_date: '2024-01-15',
      likes_count: 67,
      comments_count: 22,
      is_liked: false,
      created_at: '2024-01-16T16:45:00Z',
      author: {
        name: 'Coach Amanda Williams',
        role: 'Sports Coordinator'
      },
      status: 'published',
      visibility: 'public',
      views_count: 298
    },
    {
      id: 'post-5',
      title: 'DRAFT: Upcoming Science Fair - Call for Participation',
      body: 'Get ready for our Annual Science Fair! Students from grades 6-12 are invited to showcase their innovative projects. Registration deadline is February 15th. Prizes await the most creative and scientifically sound projects.',
      category: {
        name: 'Academics',
        color: '#3B82F6',
        icon: 'GraduationCap'
      },
      media: [],
      tags: ['science', 'fair', 'innovation', 'projects'],
      event_date: '2024-02-28',
      likes_count: 0,
      comments_count: 0,
      is_liked: false,
      created_at: '2024-01-28T11:20:00Z',
      author: {
        name: 'Dr. Lisa Thompson',
        role: 'Science Department Head'
      },
      status: 'draft',
      visibility: 'public',
      views_count: 0
    }
  ];

  useEffect(() => {
    // Simulate loading posts
    setIsLoading(true);
    setTimeout(() => {
      setPosts(demoFeedPosts);
      setIsLoading(false);
    }, 500);
  }, []);

  const categories = [
    { id: 'all', name: 'All Posts', icon: '📋' },
    { id: 'achievements', name: 'Achievements', icon: '🏆' },
    { id: 'sports', name: 'Sports', icon: '⚡' },
    { id: 'cultural', name: 'Cultural Events', icon: '🎵' },
    { id: 'academics', name: 'Academics', icon: '🎓' },
    { id: 'announcements', name: 'Announcements', icon: '📢' },
    { id: 'community', name: 'Community', icon: '❤️' }
  ];

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

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || 
      post.category.name.toLowerCase().includes(selectedCategory);
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    
    return matchesCategory && matchesSearch && matchesStatus;
  });

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((sum, p) => sum + p.views_count, 0),
    totalLikes: posts.reduce((sum, p) => sum + p.likes_count, 0)
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-apple-gray-600 dark:text-white mb-2">
              School Feed Management
            </h1>
            <p className="text-apple-gray-500 dark:text-apple-gray-300">
              Create, manage, and monitor school posts and announcements
            </p>
          </div>
          <button
            onClick={() => setShowComposer(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Create Post</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-apple-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              placeholder="Search posts, tags, or content..."
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
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
        </div>
      </div>

      {/* Posts List with Management Actions */}
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
                <FeedList posts={[post]} showLoadMore={false} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Composer Modal */}
      <PostComposer
        isOpen={showComposer}
        onSave={handleCreatePost}
        onCancel={() => setShowComposer(false)}
      />
    </div>
  );
};