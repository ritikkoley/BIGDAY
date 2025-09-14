import React, { useState } from 'react';
import { Brain, Heart, Users, Target, Star, Save } from 'lucide-react';

export const HPCSelfAssessment: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [goals, setGoals] = useState<string[]>([]);

  const moodOptions = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😐', label: 'Okay', value: 'okay' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '🤔', label: 'Confused', value: 'confused' },
    { emoji: '💪', label: 'Confident', value: 'confident' }
  ];

  const goalSuggestions = [
    'Improve in mathematics',
    'Make new friends',
    'Join sports activities',
    'Help classmates more',
    'Read more books',
    'Learn new skills'
  ];

  const selfEvaluationParameters = [
    { name: 'Mathematics', description: 'How good are you at math and solving problems?' },
    { name: 'Creativity', description: 'How well do you come up with new ideas?' },
    { name: 'Teamwork', description: 'How well do you work with classmates?' },
    { name: 'Empathy', description: 'How well do you understand others\' feelings?' }
  ];

  const toggleGoal = (goal: string) => {
    setGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <Brain className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              My Progress Card
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Tell us about your learning journey this term
            </p>
          </div>
        </div>
      </div>

      {/* Mood Selector */}
      <div className="apple-card p-6">
        <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
          How do you feel about your learning this term?
        </h2>
        <div className="flex justify-center space-x-6">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                selectedMood === mood.value
                  ? 'bg-apple-blue-50 dark:bg-apple-blue-900/20 border-2 border-apple-blue-500'
                  : 'bg-white dark:bg-gray-800 border-2 border-transparent hover:bg-apple-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-4xl mb-2">{mood.emoji}</span>
              <span className="text-sm font-medium text-apple-gray-600 dark:text-white">
                {mood.label}
              </span>
            </button>
          ))}
        </div>
        {selectedMood && (
          <div className="mt-4 text-center">
            <p className="text-apple-blue-500 font-medium">
              {selectedMood === 'happy' && "Great! You're feeling positive about learning!"}
              {selectedMood === 'confident' && "Awesome! Confidence is key to success!"}
              {selectedMood === 'okay' && "That's okay, every day is a new opportunity!"}
              {selectedMood === 'confused' && "It's normal to feel confused sometimes. Ask for help!"}
              {selectedMood === 'sad' && "We're here to support you. Talk to your teacher!"}
            </p>
          </div>
        )}
      </div>

      {/* Self-Evaluation Parameters */}
      <div className="apple-card p-6">
        <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
          Rate Yourself
        </h2>
        <div className="space-y-6">
          {selfEvaluationParameters.map((parameter, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-apple-gray-600 dark:text-white">
                    {parameter.name}
                  </h3>
                  <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    {parameter.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="text-2xl text-yellow-400 hover:text-yellow-500 transition-colors"
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
                <span className="ml-4 text-sm text-apple-gray-500 dark:text-apple-gray-400">
                  Click stars to rate yourself
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="apple-card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              What I'm Good At
            </h2>
          </div>
          <textarea
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500 resize-none"
            placeholder="Tell us about your achievements and what you did well this term..."
            maxLength={200}
          />
          <div className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mt-1">
            {strengths.length}/200 characters
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              What I Want to Improve
            </h2>
          </div>
          <textarea
            value={improvements}
            onChange={(e) => setImprovements(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500 resize-none"
            placeholder="What skills or subjects would you like to work on?"
            maxLength={200}
          />
          <div className="text-xs text-apple-gray-400 dark:text-apple-gray-300 mt-1">
            {improvements.length}/200 characters
          </div>
        </div>
      </div>

      {/* Goals Setting */}
      <div className="apple-card p-6">
        <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
          My Goals for Next Term
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {goalSuggestions.map((goal) => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={`p-3 text-sm rounded-lg transition-colors ${
                goals.includes(goal)
                  ? 'bg-apple-blue-500 text-white'
                  : 'bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-200 dark:hover:bg-apple-gray-600'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
        <div className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
          Selected goals: {goals.length > 0 ? goals.join(', ') : 'None selected'}
        </div>
      </div>

      {/* Submit Actions */}
      <div className="apple-card p-6">
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 px-6 py-3 bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300 rounded-lg hover:bg-apple-gray-200 dark:hover:bg-apple-gray-600 transition-colors">
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors">
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit My Assessment</span>
          </button>
        </div>
      </div>
    </div>
  );
};