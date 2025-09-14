import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Calendar, Tag, User } from 'lucide-react';
import { format } from 'date-fns';

interface FeedPost {
  id: string;
  title: string;
  body: string;
  category: {
    name: string;
    icon: string;
    color: string;
  };
  tags: string[];
  event_date?: string;
  media: Array<{
    id: string;
    type: 'image' | 'video' | 'document';
    filename: string;
    path: string;
    thumbnail_path?: string;
    alt_text?: string;
  }>;
  author: {
    name: string;
    role: string;
  };
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
}

interface FeedListProps {
  posts: FeedPost[];
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onPostClick: (postId: string) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export const FeedList: React.FC<FeedListProps> = ({
  posts,
  onLike,
  onShare,
  onPostClick,
  isLoading = false,
  hasMore = false,
  onLoadMore
}) => {
  const getCategoryIcon = (iconName: string) => {
    // Map icon names to actual icons
    const iconMap: Record<string, React.ReactNode> = {
      'Trophy': '🏆',
      'Zap': '⚡',
      'Music': '🎵',
      'GraduationCap': '🎓',
      'Megaphone': '📢',
      'Heart': '❤️'
    };
    return iconMap[iconName] || '📝';
  };

  const renderMedia = (media: FeedPost['media']) => {
    if (!media || media.length === 0) return null;

    return (
      <div className="mt-4">
        {media.length === 1 ? (
          <div className="rounded-lg overflow-hidden">
            {media[0].type === 'image' && (
              <img
                src={media[0].path}
                alt={media[0].alt_text || media[0].filename}
                className="w-full h-64 object-cover"
              />
            )}
            {media[0].type === 'video' && (
              <video
                src={media[0].path}
                poster={media[0].thumbnail_path}
                controls
                className="w-full h-64"
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {media.slice(0, 4).map((item, index) => (
              <div key={item.id} className="relative rounded-lg overflow-hidden">
                {item.type === 'image' && (
                  <img
                    src={item.thumbnail_path || item.path}
                    alt={item.alt_text || item.filename}
                    className="w-full h-32 object-cover"
                  />
                )}
                {index === 3 && media.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-medium">
                      +{media.length - 4} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="apple-card p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onPostClick(post.id)}
        >
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
              >
                <span className="text-lg">{getCategoryIcon(post.category.icon)}</span>
              </div>
              <div>
                <h3 className="font-semibold text-apple-gray-600 dark:text-white">
                  {post.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                  <User className="w-4 h-4" />
                  <span>{post.author.name}</span>
                  <span>•</span>
                  <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${post.category.color}20`, 
                  color: post.category.color 
                }}
              >
                {post.category.name}
              </span>
            </div>
          </div>

          {/* Event Date */}
          {post.event_date && (
            <div className="flex items-center space-x-2 mb-3 text-sm text-apple-gray-500 dark:text-apple-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Event: {format(new Date(post.event_date), 'MMMM d, yyyy')}</span>
            </div>
          )}

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-apple-gray-600 dark:text-apple-gray-300 leading-relaxed">
              {post.body}
            </p>
          </div>

          {/* Media */}
          {renderMedia(post.media)}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center space-x-2 mt-4 mb-4">
              <Tag className="w-4 h-4 text-apple-gray-400" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Engagement Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-apple-gray-200/50 dark:border-apple-gray-500/20">
            <div className="flex items-center space-x-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(post.id);
                }}
                className={`flex items-center space-x-2 transition-colors ${
                  post.is_liked
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-apple-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{post.likes_count}</span>
              </button>
              
              <div className="flex items-center space-x-2 text-apple-gray-400">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{post.comments_count}</span>
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(post.id);
              }}
              className="flex items-center space-x-2 text-apple-gray-400 hover:text-apple-blue-500 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      ))}

      {/* Load More */}
      {hasMore && (
        <div className="text-center py-6">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-6 py-3 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More Posts'}
          </button>
        </div>
      )}

      {/* Empty State */}
      {posts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📢</div>
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
            No Posts Yet
          </h3>
          <p className="text-apple-gray-400 dark:text-apple-gray-300">
            Check back later for school updates and announcements
          </p>
        </div>
      )}
    </div>
  );
};