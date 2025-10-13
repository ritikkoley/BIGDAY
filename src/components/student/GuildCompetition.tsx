import React, { useState } from 'react';
import { Trophy, Users, TrendingUp, Award, Crown, Star, Medal, Zap, Target, ChevronRight } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  gradeAverage: number;
  avatar: string;
}

interface Guild {
  id: string;
  name: string;
  badge: string;
  colorClass: string;
  strokeColor: string;
  members: Student[];
  guildAverage: number;
  rank: number;
  weeklyProgress: number;
  achievements: number;
}

const mockGuilds: Guild[] = [
  {
    id: 'guild-1',
    name: 'Phoenix Scholars',
    badge: '🔥',
    colorClass: 'from-orange-500 to-red-500',
    strokeColor: '#f97316',
    members: [
      { id: 's1', name: 'Emma Chen', gradeAverage: 94.2, avatar: 'EC' },
      { id: 's2', name: 'Marcus Johnson', gradeAverage: 92.8, avatar: 'MJ' },
      { id: 's3', name: 'Sofia Rodriguez', gradeAverage: 93.5, avatar: 'SR' },
      { id: 's4', name: 'James Park', gradeAverage: 91.7, avatar: 'JP' }
    ],
    guildAverage: 93.05,
    rank: 1,
    weeklyProgress: 2.3,
    achievements: 12
  },
  {
    id: 'guild-2',
    name: 'Quantum Minds',
    badge: '⚡',
    colorClass: 'from-blue-500 to-cyan-500',
    strokeColor: '#3b82f6',
    members: [
      { id: 's5', name: 'Aisha Patel', gradeAverage: 91.5, avatar: 'AP' },
      { id: 's6', name: 'Ryan Foster', gradeAverage: 90.2, avatar: 'RF' },
      { id: 's7', name: 'Maya Santos', gradeAverage: 92.1, avatar: 'MS' },
      { id: 's8', name: 'Leo Kim', gradeAverage: 89.8, avatar: 'LK' }
    ],
    guildAverage: 90.9,
    rank: 2,
    weeklyProgress: 1.8,
    achievements: 10
  },
  {
    id: 'guild-3',
    name: 'Stellar Innovators',
    badge: '⭐',
    colorClass: 'from-yellow-500 to-orange-400',
    strokeColor: '#eab308',
    members: [
      { id: 's9', name: 'Olivia Martinez', gradeAverage: 89.7, avatar: 'OM' },
      { id: 's10', name: 'Ethan Wong', gradeAverage: 91.2, avatar: 'EW' },
      { id: 's11', name: 'Isabella Brown', gradeAverage: 88.5, avatar: 'IB' }
    ],
    guildAverage: 89.8,
    rank: 3,
    weeklyProgress: 1.5,
    achievements: 9
  },
  {
    id: 'guild-4',
    name: 'Titan Achievers',
    badge: '💎',
    colorClass: 'from-purple-500 to-pink-500',
    strokeColor: '#a855f7',
    members: [
      { id: 's12', name: 'Noah Anderson', gradeAverage: 88.3, avatar: 'NA' },
      { id: 's13', name: 'Chloe Williams', gradeAverage: 89.9, avatar: 'CW' },
      { id: 's14', name: 'Liam Thompson', gradeAverage: 87.1, avatar: 'LT' },
      { id: 's15', name: 'Ava Davis', gradeAverage: 90.2, avatar: 'AD' }
    ],
    guildAverage: 88.875,
    rank: 4,
    weeklyProgress: 1.2,
    achievements: 8
  },
  {
    id: 'guild-5',
    name: 'Olympus Rising',
    badge: '🏆',
    colorClass: 'from-green-500 to-emerald-500',
    strokeColor: '#22c55e',
    members: [
      { id: 's16', name: 'Lucas Miller', gradeAverage: 86.8, avatar: 'LM' },
      { id: 's17', name: 'Mia Garcia', gradeAverage: 88.4, avatar: 'MG' },
      { id: 's18', name: 'Jackson Lee', gradeAverage: 87.9, avatar: 'JL' }
    ],
    guildAverage: 87.7,
    rank: 5,
    weeklyProgress: 1.9,
    achievements: 7
  },
  {
    id: 'guild-6',
    name: 'Nebula Collective',
    badge: '🌟',
    colorClass: 'from-indigo-500 to-blue-500',
    strokeColor: '#6366f1',
    members: [
      { id: 's19', name: 'Sophie Turner', gradeAverage: 85.6, avatar: 'ST' },
      { id: 's20', name: 'Benjamin Harris', gradeAverage: 86.9, avatar: 'BH' },
      { id: 's21', name: 'Zoe White', gradeAverage: 87.5, avatar: 'ZW' },
      { id: 's22', name: 'Dylan Scott', gradeAverage: 84.2, avatar: 'DS' }
    ],
    guildAverage: 86.05,
    rank: 6,
    weeklyProgress: 2.1,
    achievements: 6
  }
];

const CircularProgress: React.FC<{
  value: number;
  size: number;
  strokeWidth: number;
  color: string;
}> = ({ value, size, strokeWidth, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-200 dark:text-gray-700"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
};

const GuildCard: React.FC<{ guild: Guild; expanded: boolean; onToggle: () => void }> = ({
  guild,
  expanded,
  onToggle
}) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <Trophy className="w-6 h-6 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500 to-amber-500';
      case 2:
        return 'from-gray-400 to-gray-500';
      case 3:
        return 'from-orange-600 to-orange-700';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div
      className={`apple-card overflow-hidden transition-all duration-500 ${
        guild.rank === 1 ? 'ring-2 ring-yellow-500 ring-opacity-50' : ''
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full p-6 text-left transition-all hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${guild.colorClass} flex items-center justify-center text-3xl shadow-lg`}>
                {guild.badge}
              </div>
              <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${getRankColor(guild.rank)} flex items-center justify-center shadow-lg`}>
                {getRankIcon(guild.rank)}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {guild.name}
                </h3>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rank #{guild.rank}
                </span>
              </div>

              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {guild.members.length} members
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {guild.achievements} achievements
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    +{guild.weeklyProgress}% this week
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <CircularProgress
                  value={guild.guildAverage}
                  size={80}
                  strokeWidth={6}
                  color={guild.strokeColor}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {guild.guildAverage.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">
                      AVG
                    </div>
                  </div>
                </div>
              </div>

              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                expanded ? 'rotate-90' : ''
              }`} />
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {guild.members.map((member) => (
              <div
                key={member.id}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${guild.colorClass} flex items-center justify-center text-white font-semibold text-sm shadow-md`}>
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {member.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Grade Average
                    </span>
                    <span className={`text-sm font-bold ${
                      member.gradeAverage >= 90 ? 'text-green-600 dark:text-green-400' :
                      member.gradeAverage >= 80 ? 'text-blue-600 dark:text-blue-400' :
                      'text-orange-600 dark:text-orange-400'
                    }`}>
                      {member.gradeAverage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="relative h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${guild.colorClass} transition-all duration-500`}
                      style={{ width: `${member.gradeAverage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const GuildCompetition: React.FC = () => {
  const [expandedGuild, setExpandedGuild] = useState<string | null>(mockGuilds[0].id);

  const topGuild = mockGuilds[0];
  const userGuild = mockGuilds[1];

  return (
    <div className="space-y-6">
      <div className="apple-card p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Guild Competition
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Team up and compete for the top spot
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 dark:bg-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Leading Guild
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{topGuild.badge}</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {topGuild.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {topGuild.guildAverage.toFixed(1)}% average
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Guild
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{userGuild.badge}</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {userGuild.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Rank #{userGuild.rank}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Points to Lead
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(topGuild.guildAverage - userGuild.guildAverage).toFixed(1)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  points needed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Guild Leaderboard
          </h3>
        </div>

        {mockGuilds.map((guild) => (
          <GuildCard
            key={guild.id}
            guild={guild}
            expanded={expandedGuild === guild.id}
            onToggle={() => setExpandedGuild(expandedGuild === guild.id ? null : guild.id)}
          />
        ))}
      </div>

      <div className="apple-card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              How Guild Competition Works
            </h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <span>Guild rankings are based on the average of all member grade averages</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <span>Work together with your guild members to improve everyone's grades</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <span>Earn achievements as a team for consistent improvement</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <span>Rankings update weekly based on collective performance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuildCompetition;
