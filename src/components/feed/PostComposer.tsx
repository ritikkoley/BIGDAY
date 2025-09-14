import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Image, 
  Video, 
  FileText, 
  Calendar, 
  Tag, 
  Eye, 
  EyeOff, 
  Save, 
  Send, 
  X,
  Upload,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface PostComposerProps {
  onSave: (postData: any) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  onSave,
  onCancel,
  isOpen
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'staff_only' | 'grade_specific'>('public');
  const [gradeFilter, setGradeFilter] = useState<string[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<any[]>([]);
  const [isDraft, setIsDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'achievements', name: 'Achievements', icon: '🏆', color: '#F59E0B' },
    { id: 'sports', name: 'Sports', icon: '⚡', color: '#10B981' },
    { id: 'cultural', name: 'Cultural Events', icon: '🎵', color: '#8B5CF6' },
    { id: 'academics', name: 'Academics', icon: '🎓', color: '#3B82F6' },
    { id: 'announcements', name: 'Announcements', icon: '📢', color: '#EF4444' },
    { id: 'community', name: 'Community', icon: '❤️', color: '#EC4899' }
  ];

  const grades = ['5', '6', '7', '8', '9', '10', '11', '12'];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        // In a real implementation, this would upload to storage
        const mockMedia = {
          id: `media-${Date.now()}-${Math.random()}`,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document',
          filename: file.name,
          path: URL.createObjectURL(file), // Temporary URL for preview
          size: file.size,
          mime_type: file.type,
          alt_text: ''
        };
        setUploadedMedia(prev => [...prev, mockMedia]);
      });
    }
  };

  const removeMedia = (mediaId: string) => {
    setUploadedMedia(prev => prev.filter(m => m.id !== mediaId));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addTag();
    }
  };

  const toggleGrade = (grade: string) => {
    setGradeFilter(prev => 
      prev.includes(grade) 
        ? prev.filter(g => g !== grade)
        : [...prev, grade]
    );
  };

  const handleSubmit = async (asDraft: boolean = false) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validation
      if (!title.trim()) {
        throw new Error('Title is required');
      }
      if (!body.trim()) {
        throw new Error('Post content is required');
      }
      if (!selectedCategory) {
        throw new Error('Please select a category');
      }

      const postData = {
        title: title.trim(),
        body: body.trim(),
        category_id: selectedCategory,
        tags,
        event_date: eventDate || null,
        media: uploadedMedia,
        visibility,
        grade_filter: visibility === 'grade_specific' ? gradeFilter : [],
        status: asDraft ? 'draft' : 'published'
      };

      await onSave(postData);
      
      // Reset form
      setTitle('');
      setBody('');
      setSelectedCategory('');
      setTags([]);
      setEventDate('');
      setVisibility('public');
      setGradeFilter([]);
      setUploadedMedia([]);
      setIsDraft(false);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
              Create New Post
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Post Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              placeholder="Enter an engaging title for your post..."
              maxLength={200}
            />
            <div className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              {title.length}/200 characters
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCategory === category.id
                      ? 'border-apple-blue-500 bg-apple-blue-50 dark:bg-apple-blue-900/20'
                      : 'border-apple-gray-200 dark:border-apple-gray-600 hover:border-apple-gray-300 dark:hover:border-apple-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-medium text-apple-gray-600 dark:text-white">
                      {category.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Post Content *
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500 resize-none"
              placeholder="Share details about the event, achievement, or announcement..."
              maxLength={5000}
            />
            <div className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              {body.length}/5000 characters
            </div>
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Event Date (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-apple-gray-400" />
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              />
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Media (Optional)
            </label>
            <div className="border-2 border-dashed border-apple-gray-300 dark:border-apple-gray-600 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-apple-gray-400 mx-auto mb-2" />
              <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mb-2">
                Upload images, videos, or documents
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors"
              >
                Choose Files
              </button>
            </div>

            {/* Uploaded Media Preview */}
            {uploadedMedia.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedMedia.map((media) => (
                  <div key={media.id} className="relative group">
                    <div className="aspect-square bg-apple-gray-100 dark:bg-apple-gray-700 rounded-lg overflow-hidden">
                      {media.type === 'image' && (
                        <img
                          src={media.path}
                          alt={media.filename}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {media.type === 'video' && (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-8 h-8 text-apple-gray-400" />
                        </div>
                      )}
                      {media.type === 'document' && (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-8 h-8 text-apple-gray-400" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeMedia(media.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-xs text-apple-gray-500 dark:text-apple-gray-400 mt-1 truncate">
                      {media.filename}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Tags (Optional)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center space-x-1 px-3 py-1 bg-apple-blue-100 dark:bg-apple-blue-900/30 text-apple-blue-700 dark:text-apple-blue-300 rounded-full text-sm"
                >
                  <span>#{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-apple-blue-500 hover:text-apple-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-apple-gray-400" />
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                placeholder="Add tags (press Enter)"
                maxLength={20}
              />
              <button
                onClick={addTag}
                disabled={!newTag.trim() || tags.length >= 10}
                className="px-3 py-2 bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300 rounded-lg hover:bg-apple-gray-200 dark:hover:bg-apple-gray-600 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>
            <div className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              {tags.length}/10 tags
            </div>
          </div>

          {/* Visibility Settings */}
          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Visibility
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === 'public'}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-4 h-4 text-apple-blue-500 border-apple-gray-300 focus:ring-apple-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-green-500" />
                  <span className="text-apple-gray-600 dark:text-white">Public - Visible to all students and staff</span>
                </div>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="visibility"
                  value="staff_only"
                  checked={visibility === 'staff_only'}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-4 h-4 text-apple-blue-500 border-apple-gray-300 focus:ring-apple-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <EyeOff className="w-4 h-4 text-yellow-500" />
                  <span className="text-apple-gray-600 dark:text-white">Staff Only - Visible to teachers and admin only</span>
                </div>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="visibility"
                  value="grade_specific"
                  checked={visibility === 'grade_specific'}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-4 h-4 text-apple-blue-500 border-apple-gray-300 focus:ring-apple-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-purple-500" />
                  <span className="text-apple-gray-600 dark:text-white">Grade Specific - Visible to selected grades only</span>
                </div>
              </label>
            </div>

            {/* Grade Selection */}
            {visibility === 'grade_specific' && (
              <div className="mt-4 p-4 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-lg">
                <p className="text-sm font-medium text-apple-gray-600 dark:text-white mb-3">
                  Select Grades:
                </p>
                <div className="flex flex-wrap gap-2">
                  {grades.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => toggleGrade(grade)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        gradeFilter.includes(grade)
                          ? 'bg-purple-500 text-white'
                          : 'bg-apple-gray-200 dark:bg-apple-gray-600 text-apple-gray-600 dark:text-apple-gray-300'
                      }`}
                    >
                      Grade {grade}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-apple-gray-200/50 dark:border-apple-gray-500/20">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting || !title.trim() || !body.trim()}
                className="flex items-center space-x-2 px-6 py-2 bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300 rounded-lg hover:bg-apple-gray-200 dark:hover:bg-apple-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting || !title.trim() || !body.trim() || !selectedCategory}
                className="flex items-center space-x-2 px-6 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Publish Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};