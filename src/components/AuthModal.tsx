import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot_password';
  initialRole?: 'student' | 'teacher';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  initialRole = 'student',
}) => {
  const { login, register, switchPersona } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>(initialMode);
  const [role, setRole] = useState<'student' | 'teacher'>(initialRole);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status feedback
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === 'forgot_password') {
      if (!email.trim()) {
        setError('Please enter your email address to receive password reset instructions.');
        return;
      }
      setSuccessMessage(`Password reset link sent to ${email}. Check your inbox!`);
      return;
    }

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setError('Please enter both your email address and password.');
        return;
      }
      const res = login(email);
      if (!res.success) {
        setError(res.message || 'Invalid credentials.');
        return;
      }
      onClose();
      return;
    }

    // Register mode
    if (!fullName.trim()) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    const regRes = register({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      role,
      phoneNumber: phone.trim(),
      password,
    });

    if (!regRes.success) {
      setError(regRes.message || 'Could not complete registration.');
      return;
    }

    setSuccessMessage('Account registered successfully! Welcome to Zim Tutor.');
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleQuickDemoLogin = (userRole: 'student' | 'teacher' | 'admin') => {
    switchPersona(userRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-zinc-300 my-8">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-zinc-200 flex items-center justify-between">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector (Black & White) */}
        {mode !== 'forgot_password' && (
          <div className="grid grid-cols-2 p-1.5 mx-6 mt-4 bg-zinc-100 rounded-xl text-xs font-bold border border-zinc-200">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 rounded-lg transition ${
                mode === 'login'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`py-2 rounded-lg transition ${
                mode === 'register'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-zinc-100 border border-zinc-400 rounded-xl text-black text-xs flex items-start gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-black" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-zinc-100 border border-black rounded-xl text-black text-xs flex items-start gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-black" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'register' && (
            <>
              {/* Account Type Selector */}
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">
                  I want to join Zim Tutor as a:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left text-xs font-bold transition ${
                      role === 'student'
                        ? 'border-black bg-zinc-100 text-black ring-2 ring-black/20'
                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-black shrink-0" />
                    <div>
                      <div>Student</div>
                      <div className="text-[10px] font-normal text-zinc-500">Find qualified tutors</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left text-xs font-bold transition ${
                      role === 'teacher'
                        ? 'border-black bg-zinc-100 text-black ring-2 ring-black/20'
                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-black shrink-0" />
                    <div>
                      <div>Teacher</div>
                      <div className="text-[10px] font-normal text-zinc-500">Offer lessons & earn</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-black mb-1">Full Legal Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder={role === 'teacher' ? 'e.g. Tendai Mutasa' : 'e.g. Tawanda Gumbo'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                Phone Number (Private, for lesson coordination)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="+263 77 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>
          )}

          {mode !== 'forgot_password' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-black">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_password');
                      setError(null);
                    }}
                    className="text-[11px] font-bold text-zinc-700 hover:text-black underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-black mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-zinc-700">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-300 text-black focus:ring-black"
                />
                <span>
                  I agree to the <strong className="text-black">Terms of Service</strong> and{' '}
                  <strong className="text-black">Privacy Policy</strong>.
                </span>
              </label>

              {role === 'student' && (
                <div className="p-2.5 bg-zinc-100 rounded-xl text-[11px] text-zinc-800 border border-zinc-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span>
                    <strong>Child Safety Notice:</strong> Students under 18 must have parental/guardian consent. Home addresses and personal contact details are never made public.
                  </span>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white font-extrabold text-sm rounded-xl shadow-md transition active:scale-[0.99]"
          >
            {mode === 'login'
              ? 'Sign In to Zim Tutor'
              : mode === 'register'
              ? 'Complete Free Registration'
              : 'Send Password Reset Link'}
          </button>

          {mode === 'forgot_password' && (
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMessage(null);
              }}
              className="w-full text-center text-xs text-zinc-600 hover:text-black font-bold"
            >
              Back to Sign In
            </button>
          )}
        </form>

        {/* Quick Demo Logins for Testing */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2 text-center">
            Instant Demo Sign-In (For Testing)
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('student')}
              className="px-2 py-1.5 bg-white border border-zinc-300 hover:border-black rounded-lg text-xs font-bold text-black shadow-2xs text-center transition"
            >
              👨‍🎓 Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('teacher')}
              className="px-2 py-1.5 bg-white border border-zinc-300 hover:border-black rounded-lg text-xs font-bold text-black shadow-2xs text-center transition"
            >
              👨‍🏫 Teacher
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="px-2 py-1.5 bg-white border border-zinc-300 hover:border-black rounded-lg text-xs font-bold text-black shadow-2xs text-center transition"
            >
              🛡️ Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
