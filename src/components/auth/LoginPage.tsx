import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useBrandingStore } from '../../stores/brandingStore';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signInWithOAuth, isLoading, loginAttempts, lockoutUntil } = useAuthStore();
  const { institutionName, productName, fetchBranding } = useBrandingStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordField, setShowPasswordField] = useState(false);

  useEffect(() => {
    fetchBranding();
  }, [fetchBranding]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setShowPasswordField(true);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(email, password);
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? 
        err.message : 
        'Failed to sign in. Please check your network connection and try again.');
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
    setShowPasswordField(true);
    setError(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/thanos-pal-vb-hPUzfpBo-unsplash (8).jpg')`
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/60 via-slate-800/50 to-gray-900/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Branding */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-white">
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-tight">
                {productName}
              </h1>
              <div className="w-16 h-0.5 bg-white/60 mx-auto mb-6"></div>
              <p className="text-xl md:text-2xl font-light opacity-90 mb-2">
                {institutionName}
              </p>
              <p className="text-lg font-light opacity-75">
                Let's make today big
              </p>
            </div>
            
            {/* Demo Accounts */}
            <div className="max-w-sm mx-auto">
              <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-4">
                Demo Access
              </p>
              <div className="space-y-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.role}
                    onClick={() => fillDemoCredentials(account.email, account.password)}
                    className="w-full text-left px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                  >
                    <div className="text-sm font-medium text-white">{account.role}</div>
                    <div className="text-xs text-white/70 mt-1">{account.email}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md flex items-center justify-center p-8">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Sign in
              </h2>
              <p className="text-sm text-gray-600">
                New user? <Link to="/signup" className="text-blue-600 hover:text-blue-700">Create an account</Link>
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-700 leading-relaxed">
                  {error}
                </span>
              </div>
            )}

            {isLocked && (
              <div className="mb-6 flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-yellow-700 leading-relaxed">
                  Too many attempts. Try again in {remainingTime} minutes.
                </span>
              </div>
            )}

            {!showPasswordField ? (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                    disabled={isSubmitting || isLocked}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!email || isLocked}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </form>
            ) : (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="email"
                      value={email}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                      disabled
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordField(false);
                        setPassword('');
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                      disabled={isSubmitting || isLocked}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isLocked || !email || !password}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or
                  </span>
                </div>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleOAuthSignIn('google')}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => handleOAuthSignIn('apple')}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>Continue with Apple</span>
              </button>
            </div>

            {/* More sign-in options */}
            <div className="mt-6 text-center">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                More sign-in options
              </button>
            </div>

            {/* Help */}
            <div className="mt-8 text-center">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Get help signing in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};