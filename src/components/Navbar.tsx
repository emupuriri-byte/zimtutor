import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  Mail,
  User as UserIcon,
  Search,
  BookOpen,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: 'home' | 'find_tutors' | 'student_dash' | 'teacher_dash' | 'admin_dash';
  setCurrentTab: (tab: 'home' | 'find_tutors' | 'student_dash' | 'teacher_dash' | 'admin_dash') => void;
  onOpenAuth: (mode?: 'login' | 'register', role?: 'student' | 'teacher') => void;
  onOpenEmailCenter: () => void;
  onOpenOnboarding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuth,
  onOpenEmailCenter,
  onOpenOnboarding,
}) => {
  const { currentUser, logout, switchPersona, unreadEmailCount, emails } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);

  const handleSelectRole = (role: UserRole) => {
    switchPersona(role);
    setPersonaMenuOpen(false);
    if (role === 'student') setCurrentTab('student_dash');
    if (role === 'teacher') setCurrentTab('teacher_dash');
    if (role === 'admin') setCurrentTab('admin_dash');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setCurrentTab('home')}
            className="cursor-pointer flex items-center"
          >
            <Logo size="md" showTagline={false} />
          </div>

          {/* Desktop Nav Links (Clean Black and White) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                currentTab === 'home'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setCurrentTab('find_tutors')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                currentTab === 'find_tutors'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find a Teacher</span>
            </button>

            {currentUser?.role === 'student' && (
              <button
                onClick={() => setCurrentTab('student_dash')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  currentTab === 'student_dash'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Dashboard</span>
              </button>
            )}

            {currentUser?.role === 'teacher' && (
              <button
                onClick={() => setCurrentTab('teacher_dash')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  currentTab === 'teacher_dash'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Teacher Dashboard</span>
              </button>
            )}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setCurrentTab('admin_dash')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  currentTab === 'admin_dash'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}
          </div>

          {/* Right Side Tools & Account Controls */}
          <div className="flex items-center gap-2">
            {/* Email Dispatch Drawer Trigger */}
            <button
              onClick={onOpenEmailCenter}
              className="relative p-2 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-xl transition flex items-center border border-zinc-200"
              title="Transactional Email Delivery Center (Inspect sent notifications)"
              aria-label="Inspect sent transactional emails"
            >
              <Mail className="w-4 h-4" />
              {emails.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                  {unreadEmailCount > 0 ? unreadEmailCount : emails.length}
                </span>
              )}
            </button>

            {/* Quick Demo Persona Switcher */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setPersonaMenuOpen(!personaMenuOpen)}
                className="px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                title="Switch test account roles"
              >
                <span className="w-2 h-2 rounded-full bg-black"></span>
                <span>
                  {currentUser?.role === 'admin'
                    ? 'Admin'
                    : currentUser?.role === 'teacher'
                    ? 'Teacher'
                    : 'Student'}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {personaMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-300 p-2 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Switch Persona (Instant QA)
                  </div>
                  <button
                    onClick={() => handleSelectRole('student')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 hover:text-black font-semibold flex items-center justify-between"
                  >
                    <span>👨‍🎓 Student (Tawanda)</span>
                    {currentUser?.role === 'student' && (
                      <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded-sm font-bold">Active</span>
                    )}
                  </button>
                  <button
                    onClick={() => handleSelectRole('teacher')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 hover:text-black font-semibold flex items-center justify-between"
                  >
                    <span>👨‍🏫 Teacher (Mr. Mutasa)</span>
                    {currentUser?.role === 'teacher' && (
                      <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded-sm font-bold">Active</span>
                    )}
                  </button>
                  <button
                    onClick={() => handleSelectRole('admin')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 hover:text-black font-semibold flex items-center justify-between"
                  >
                    <span>🛡️ Administrator</span>
                    {currentUser?.role === 'admin' && (
                      <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded-sm font-bold">Active</span>
                    )}
                  </button>
                  <div className="border-t border-zinc-100 my-1 pt-1">
                    <button
                      onClick={() => {
                        setPersonaMenuOpen(false);
                        onOpenOnboarding();
                      }}
                      className="w-full text-left px-3 py-1.5 text-zinc-600 hover:text-black font-medium text-[11px] flex items-center gap-1"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      <span>Edit Student Preferences</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Account / Auth Actions */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentUser.role === 'teacher') setCurrentTab('teacher_dash');
                    else if (currentUser.role === 'admin') setCurrentTab('admin_dash');
                    else setCurrentTab('student_dash');
                  }}
                  className="flex items-center gap-2 p-1 pl-2 sm:pr-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-300 rounded-full transition"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-black"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-black truncate max-w-[120px]">
                    {currentUser.fullName}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-bold text-black hover:bg-zinc-100 rounded-xl transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-1.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Join Free
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-black hover:bg-zinc-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Black and White) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => {
              setCurrentTab('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-bold text-black hover:bg-zinc-100 rounded-lg"
          >
            Home
          </button>
          <button
            onClick={() => {
              setCurrentTab('find_tutors');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-bold text-black hover:bg-zinc-100 rounded-lg"
          >
            Find a Teacher
          </button>
          <button
            onClick={() => {
              setCurrentTab('student_dash');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-bold text-black hover:bg-zinc-100 rounded-lg"
          >
            Student Dashboard
          </button>
          <button
            onClick={() => {
              setCurrentTab('teacher_dash');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-bold text-black hover:bg-zinc-100 rounded-lg"
          >
            Teacher Dashboard
          </button>
          <button
            onClick={() => {
              setCurrentTab('admin_dash');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-bold text-black hover:bg-zinc-100 rounded-lg"
          >
            Admin Panel
          </button>

          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500">Quick Persona:</span>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  handleSelectRole('student');
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 text-xs bg-black text-white rounded-md font-bold"
              >
                Student
              </button>
              <button
                onClick={() => {
                  handleSelectRole('teacher');
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 text-xs bg-zinc-200 text-black rounded-md font-bold"
              >
                Teacher
              </button>
              <button
                onClick={() => {
                  handleSelectRole('admin');
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 text-xs bg-zinc-200 text-black rounded-md font-bold"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
