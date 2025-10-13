import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Download,
  Save,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  FileQuestion
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  subject: string;
  chapter: string;
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cognitiveLevel: string;
  contributor: string;
  usageCount: number;
}

const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Explain the principle of total internal reflection and its applications in optical fibers.',
    subject: 'Physics',
    chapter: 'Optics',
    marks: 5,
    difficulty: 'Medium',
    cognitiveLevel: 'Understanding',
    contributor: 'Dr. Sharma',
    usageCount: 3
  },
  {
    id: 'q2',
    text: 'Define the SI unit of luminous intensity and explain its significance.',
    subject: 'Physics',
    chapter: 'Optics',
    marks: 2,
    difficulty: 'Easy',
    cognitiveLevel: 'Remembering',
    contributor: 'Prof. Mehta',
    usageCount: 5
  },
  {
    id: 'q3',
    text: 'Derive the lens formula and explain the sign convention used in lens calculations.',
    subject: 'Physics',
    chapter: 'Optics',
    marks: 10,
    difficulty: 'Hard',
    cognitiveLevel: 'Analyzing',
    contributor: 'Dr. Sharma',
    usageCount: 2
  },
  {
    id: 'q4',
    text: 'State and explain Newton\'s second law of motion with practical examples.',
    subject: 'Physics',
    chapter: 'Mechanics',
    marks: 5,
    difficulty: 'Medium',
    cognitiveLevel: 'Understanding',
    contributor: 'Prof. Kumar',
    usageCount: 4
  },
  {
    id: 'q5',
    text: 'Calculate the work done by a force of 50N acting at 30° to the horizontal over 10m.',
    subject: 'Physics',
    chapter: 'Mechanics',
    marks: 2,
    difficulty: 'Easy',
    cognitiveLevel: 'Applying',
    contributor: 'Prof. Kumar',
    usageCount: 6
  },
  {
    id: 'q6',
    text: 'Analyze the collision between two bodies and derive the conservation equations.',
    subject: 'Physics',
    chapter: 'Mechanics',
    marks: 10,
    difficulty: 'Hard',
    cognitiveLevel: 'Analyzing',
    contributor: 'Dr. Sharma',
    usageCount: 1
  },
  {
    id: 'q7',
    text: 'Define entropy and explain its significance in the second law of thermodynamics.',
    subject: 'Physics',
    chapter: 'Thermodynamics',
    marks: 5,
    difficulty: 'Medium',
    cognitiveLevel: 'Understanding',
    contributor: 'Prof. Mehta',
    usageCount: 3
  },
  {
    id: 'q8',
    text: 'What is the ideal gas equation? State its assumptions.',
    subject: 'Physics',
    chapter: 'Thermodynamics',
    marks: 2,
    difficulty: 'Easy',
    cognitiveLevel: 'Remembering',
    contributor: 'Prof. Kumar',
    usageCount: 7
  },
  {
    id: 'q9',
    text: 'Prove that efficiency of a Carnot engine depends only on the temperatures of reservoirs.',
    subject: 'Physics',
    chapter: 'Thermodynamics',
    marks: 10,
    difficulty: 'Hard',
    cognitiveLevel: 'Evaluating',
    contributor: 'Dr. Sharma',
    usageCount: 2
  },
  {
    id: 'q10',
    text: 'Describe the working principle of a compound microscope with a ray diagram.',
    subject: 'Physics',
    chapter: 'Optics',
    marks: 5,
    difficulty: 'Medium',
    cognitiveLevel: 'Understanding',
    contributor: 'Prof. Mehta',
    usageCount: 4
  }
];

const QGenView: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'question-bank' | 'create-paper'>('dashboard');
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [generatedPaper, setGeneratedPaper] = useState<Question[] | null>(null);

  const [paperDetails, setPaperDetails] = useState({
    title: '',
    subject: 'Physics',
    totalMarks: 100,
    duration: '3'
  });

  const [difficultyMix, setDifficultyMix] = useState({
    easy: 20,
    medium: 50,
    hard: 30
  });

  const [questionDistribution, setQuestionDistribution] = useState([
    { marks: 2, count: 10 },
    { marks: 5, count: 6 },
    { marks: 10, count: 5 }
  ]);

  const [chapterWeightage, setChapterWeightage] = useState([
    { chapter: 'Optics', marks: 30 },
    { chapter: 'Mechanics', marks: 40 },
    { chapter: 'Thermodynamics', marks: 30 }
  ]);

  const handleDifficultyChange = (level: 'easy' | 'medium' | 'hard', value: number) => {
    const others = Object.keys(difficultyMix).filter(k => k !== level);
    const remaining = 100 - value;
    const ratio = difficultyMix[others[0] as keyof typeof difficultyMix] /
                  (difficultyMix[others[0] as keyof typeof difficultyMix] +
                   difficultyMix[others[1] as keyof typeof difficultyMix]);

    setDifficultyMix({
      ...difficultyMix,
      [level]: value,
      [others[0]]: Math.round(remaining * ratio),
      [others[1]]: remaining - Math.round(remaining * ratio)
    });
  };

  const generatePaper = () => {
    const selectedQuestions: Question[] = [];

    questionDistribution.forEach(({ marks, count }) => {
      const questionsOfMarks = mockQuestions.filter(q => q.marks === marks);
      for (let i = 0; i < count && i < questionsOfMarks.length; i++) {
        selectedQuestions.push(questionsOfMarks[i]);
      }
    });

    setGeneratedPaper(selectedQuestions);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Welcome to Q-Gen</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Intelligent Question Paper Generator for Educational Institutions
          </p>
        </div>
        <button
          onClick={() => setCurrentScreen('create-paper')}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Paper</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FileQuestion className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {mockQuestions.length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Questions
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">In question bank</p>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">3</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Subjects Covered
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Active subjects</p>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">24</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Papers Generated
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">This semester</p>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">5</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Pending Reviews
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Awaiting approval</p>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Papers</h2>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Mid-Term Examination - Physics', date: '2025-10-08', marks: 100 },
            { name: 'Unit Test 2 - Mechanics', date: '2025-10-05', marks: 50 },
            { name: 'Final Exam - Physics', date: '2025-10-01', marks: 100 },
            { name: 'Quiz - Optics', date: '2025-09-28', marks: 25 }
          ].map((paper, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{paper.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{paper.date}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {paper.marks} marks
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuestionBank = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Question Bank</h1>
        <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg">
          <Plus className="w-5 h-5" />
          <span>Add New Question</span>
        </button>
      </div>

      <div className="apple-card p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Filters</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Question</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Chapter</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Marks</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Difficulty</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Usage</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockQuestions.filter(q =>
                q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.chapter.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((question) => (
                <tr key={question.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{question.text}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{question.chapter}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {question.marks}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{question.usageCount}x</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCreatePaper = () => {
    if (generatedPaper) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setGeneratedPaper(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Generated Paper Preview</h1>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all">
                <Save className="w-5 h-5" />
                <span>Save Template</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all">
                <Download className="w-5 h-5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          <div className="apple-card p-8">
            <div className="text-center mb-8 border-b-2 border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                ST. XAVIER'S COLLEGE
              </h2>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {paperDetails.title}
              </h3>
              <div className="flex justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400 mt-4">
                <span>Subject: {paperDetails.subject}</span>
                <span>Total Marks: {paperDetails.totalMarks}</span>
                <span>Duration: {paperDetails.duration} Hours</span>
              </div>
            </div>

            <div className="space-y-6">
              {generatedPaper.map((question, index) => (
                <div key={question.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex-shrink-0 font-bold text-gray-700 dark:text-gray-300">
                    Q{index + 1}.
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white mb-2">{question.text}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                      <span>{question.chapter}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {question.marks} marks
                    </span>
                    <button
                      className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Swap question"
                    >
                      <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setCurrentScreen('dashboard');
                setCurrentStep(1);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Create New Question Paper</h1>
          </div>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                  currentStep === step
                    ? 'bg-blue-600 text-white'
                    : currentStep > step
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 rounded ${
                    currentStep > step ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <div className="apple-card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Step 1: Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Paper Title
                </label>
                <input
                  type="text"
                  value={paperDetails.title}
                  onChange={(e) => setPaperDetails({ ...paperDetails, title: e.target.value })}
                  placeholder="e.g., Mid-Term Examination"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  value={paperDetails.subject}
                  onChange={(e) => setPaperDetails({ ...paperDetails, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                >
                  <option>Physics</option>
                  <option>Mathematics</option>
                  <option>Chemistry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Marks
                </label>
                <input
                  type="number"
                  value={paperDetails.totalMarks}
                  onChange={(e) => setPaperDetails({ ...paperDetails, totalMarks: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (Hours)
                </label>
                <input
                  type="text"
                  value={paperDetails.duration}
                  onChange={(e) => setPaperDetails({ ...paperDetails, duration: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="apple-card p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Step 2: Define Structure & Constraints</h2>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Difficulty Mix</h3>
                <div className="space-y-4">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <div key={level}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {level}
                        </label>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {difficultyMix[level]}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={difficultyMix[level]}
                        onChange={(e) => handleDifficultyChange(level, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Question Type Distribution</h3>
                <div className="space-y-4">
                  {questionDistribution.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="number"
                        value={item.count}
                        onChange={(e) => {
                          const newDist = [...questionDistribution];
                          newDist[index].count = parseInt(e.target.value);
                          setQuestionDistribution(newDist);
                        }}
                        className="w-24 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        questions of
                      </span>
                      <span className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl font-semibold">
                        {item.marks} marks
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Chapter Weightage</h3>
                <div className="space-y-3">
                  {chapterWeightage.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{item.chapter}</span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={item.marks}
                          onChange={(e) => {
                            const newWeightage = [...chapterWeightage];
                            newWeightage[index].marks = parseInt(e.target.value);
                            setChapterWeightage(newWeightage);
                          }}
                          className="w-20 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-center"
                        />
                        <span className="text-gray-600 dark:text-gray-400">marks</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="apple-card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Step 3: Generate & Review</h2>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Ready to Generate Your Question Paper
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Click the button below to generate a balanced question paper based on your specifications.
              </p>
              <button
                onClick={generatePaper}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FileText className="w-6 h-6" />
                <span>Generate Paper</span>
              </button>
            </div>
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentScreen === 'dashboard'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentScreen('question-bank')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentScreen === 'question-bank'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Question Bank
        </button>
        <button
          onClick={() => setCurrentScreen('create-paper')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentScreen === 'create-paper'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Create Paper
        </button>
      </div>

      {currentScreen === 'dashboard' && renderDashboard()}
      {currentScreen === 'question-bank' && renderQuestionBank()}
      {currentScreen === 'create-paper' && renderCreatePaper()}
    </div>
  );
};

export default QGenView;
