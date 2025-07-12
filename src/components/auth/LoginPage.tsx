import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signInWithOAuth, isLoading, loginAttempts, lockoutUntil } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    try {
      setError(null);
      await signInWithOAuth(provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to sign in with ${provider}`);
    }
  };

  const isLocked = lockoutUntil && Date.now() < lockoutUntil;
  const remainingTime = isLocked ? Math.ceil((lockoutUntil - Date.now()) / 1000 / 60) : 0;

  const demoAccounts = [
    { role: 'Student', email: 'student@dpsb.edu', password: 'student123' },
    { role: 'Teacher', email: 'teacher@dpsb.edu', password: 'teacher123' },
    { role: 'Admin', email: 'admin@dpsb.edu', password: 'admin123' }
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Background - Brand/Welcome (75% left side, centered) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="w-2/3 h-full flex items-center justify-center">
          <div className="max-w-2xl text-center px-8">
            <div className="mb-12">
              <h1 className="text-8xl font-extralight text-gray-900 mb-8 tracking-tight" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                BIG DAY
              </h1>
              <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
              <p className="text-2xl font-light text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                Delhi Public School
              </p>
              <p className="text-lg font-light text-gray-500 mb-12" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                Let's make today big
              </p>
            </div>
            
            {/* Demo Accounts */}
            <div className="max-w-md mx-auto">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-6" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                Demo Access
              </p>
              <div className="grid grid-cols-1 gap-3">
                {demoAccounts.map((account) => (
                  <button
                    key={account.role}
                    onClick={() => fillDemoCredentials(account.email, account.password)}
                    className="text-left px-6 py-4 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl hover:bg-white/90 hover:border-white/70 transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    <div className="text-sm font-medium text-gray-900">{account.role}</div>
                    <div className="text-xs text-gray-500 mt-1">{account.email}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Container - Right 25% area, centered vertically */}
      <div className="absolute right-0 top-0 w-1/3 h-full flex items-center justify-center p-8">
        <div className="w-full max-w-sm bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-3xl">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-extralight text-gray-900 mb-3 tracking-tight" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                Sign In
              </h2>
              <p className="text-sm font-light text-gray-600" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                Welcome back to your portal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-start space-x-3 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-700 leading-relaxed" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    {error}
                  </span>
                </div>
              )}

              {isLocked && (
                <div className="flex items-start space-x-3 p-4 bg-yellow-50/80 backdrop-blur-sm border border-yellow-200/50 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-yellow-700 leading-relaxed" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    Too many attempts. Try again in {remainingTime} minutes.
                  </span>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:bg-white/80 transition-all duration-200"
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      placeholder="Enter your email"
                      disabled={isSubmitting || isLocked}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:bg-white/80 transition-all duration-200"
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      placeholder="Enter your password"
                      disabled={isSubmitting || isLocked}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-400"
                  />
                  <span className="ml-3 text-sm font-light text-gray-600" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLocked || !email || !password}
                className="w-full flex items-center justify-center space-x-3 bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-xl font-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99]"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* OAuth Options */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/95 text-gray-500 font-light" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleOAuthSignIn('google')}
                  className="flex justify-center items-center px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl text-sm font-light text-gray-700 hover:bg-white/80 hover:border-gray-300/50 transition-all duration-200"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  Google
                </button>
                <button
                  onClick={() => handleOAuthSignIn('apple')}
                  className="flex justify-center items-center px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl text-sm font-light text-gray-700 hover:bg-white/80 hover:border-gray-300/50 transition-all duration-200"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  Apple
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs font-light text-gray-500" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                Need help?{' '}
                <a href="mailto:support@dpsb.edu" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};