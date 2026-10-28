import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { FindTeacherPage } from './pages/FindTeacherPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { StudentOnboardingModal } from './components/StudentOnboardingModal';
import { TeacherProfileModal } from './components/TeacherProfileModal';
import { LessonRequestModal } from './components/LessonRequestModal';
import { LeaveReviewModal } from './components/LeaveReviewModal';
import { TeacherRescheduleModal } from './components/TeacherRescheduleModal';
import { EmailCenterModal } from './components/EmailCenterModal';
import { TeacherProfile, LessonRequest } from './types';
import { Logo } from './components/Logo';
import {
  ShieldCheck,
  Mail,
  Heart,
  CheckCircle2,
  Lock,
  Phone,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

function AppContent() {
  const { currentUser, emails } = useApp();

  // Navigation state
  const [currentTab, setCurrentTab] = useState<
    'home' | 'find_tutors' | 'student_dash' | 'teacher_dash' | 'admin_dash'
  >('home');
  const [searchFilterSubject, setSearchFilterSubject] = useState<string>('');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<'student' | 'teacher'>('student');

  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [emailCenterOpen, setEmailCenterOpen] = useState(false);

  const [viewingTeacher, setViewingTeacher] = useState<TeacherProfile | null>(null);
  const [requestingTeacher, setRequestingTeacher] = useState<TeacherProfile | null>(null);
  const [reviewingLesson, setReviewingLesson] = useState<LessonRequest | null>(null);
  const [reschedulingLesson, setReschedulingLesson] = useState<LessonRequest | null>(null);

  // Success toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login', role: 'student' | 'teacher' = 'student') => {
    setAuthMode(mode);
    setAuthRole(role);
    setAuthModalOpen(true);
  };

  const handleNavigateFind = (subject?: string) => {
    setSearchFilterSubject(subject || '');
    setCurrentTab('find_tutors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-black antialiased selection:bg-black selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-3 rounded-2xl shadow-xl border border-zinc-800 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setEmailCenterOpen(true)}
            className="ml-2 text-zinc-300 underline font-bold"
          >
            View Email
          </button>
        </div>
      )}

      {/* Main Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={handleOpenAuth}
        onOpenEmailCenter={() => setEmailCenterOpen(true)}
        onOpenOnboarding={() => setOnboardingOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onNavigateFind={handleNavigateFind}
            onNavigateTeacherDash={() => setCurrentTab('teacher_dash')}
            onOpenAuth={handleOpenAuth}
            onViewTeacher={(t) => setViewingTeacher(t)}
            onRequestLesson={(t) => setRequestingTeacher(t)}
            onOpenOnboarding={() => setOnboardingOpen(true)}
          />
        )}

        {currentTab === 'find_tutors' && (
          <FindTeacherPage
            initialSubject={searchFilterSubject}
            onViewTeacher={(t) => setViewingTeacher(t)}
            onRequestLesson={(t) => setRequestingTeacher(t)}
          />
        )}

        {currentTab === 'student_dash' && (
          <StudentDashboard
            onNavigateFind={handleNavigateFind}
            onOpenOnboarding={() => setOnboardingOpen(true)}
            onViewTeacher={(t) => setViewingTeacher(t)}
            onRequestLesson={(t) => setRequestingTeacher(t)}
            onOpenLeaveReview={(l) => setReviewingLesson(l)}
          />
        )}

        {currentTab === 'teacher_dash' && (
          <TeacherDashboard
            onOpenReschedule={(l) => setReschedulingLesson(l)}
          />
        )}

        {currentTab === 'admin_dash' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-black text-zinc-400 text-xs border-t border-zinc-900 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="space-y-3">
              <Logo size="md" showTagline={false} />
              <p className="text-zinc-400 text-xs leading-relaxed">
                "Your Future Starts With the Right Teacher."
              </p>
              <p className="text-[11px] text-zinc-500">
                Connecting students across Zimbabwe with certified, passionate educators for Zimsec and Cambridge examinations.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Curriculum Focus
              </h4>
              <ul className="space-y-1.5 text-zinc-400">
                <li>
                  <button onClick={() => handleNavigateFind('Mathematics')} className="hover:text-white transition">
                    O Level & Cambridge IGCSE
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigateFind('Physics')} className="hover:text-white transition">
                    AS & A Level (A2)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigateFind('Biology')} className="hover:text-white transition">
                    Natural Sciences (Biology, Chemistry, Physics)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigateFind('Accounting')} className="hover:text-white transition">
                    Commercials & Humanities
                  </button>
                </li>
              </ul>
            </div>

            {/* Safety & Trust */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Trust & Safeguarding
              </h4>
              <ul className="space-y-1.5 text-zinc-400">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span>Verified Qualifications Audit</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-white" />
                  <span>Private Phone & Address Protection</span>
                </li>
                <li>
                  <span>Direct & Transparent Lesson Payments</span>
                </li>
                <li>
                  <button onClick={() => setEmailCenterOpen(true)} className="hover:text-white flex items-center gap-1 transition">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Transactional Email Center</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Locations in Zimbabwe */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Tutoring Areas
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Online tutoring throughout Zimbabwe, plus physical lessons in Harare, Bulawayo, Chitungwiza, Mutare, Gweru, Kwekwe, and Masvingo.
              </p>
              <div className="pt-3">
                <span className="text-[10px] text-zinc-500 block">
                  Current User Role: <strong className="text-zinc-300">{currentUser?.role || 'Guest'}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
            <div>
              © 2026 Zim Tutor Marketplace. All rights reserved. Built for Zimbabwean learners and educators.
            </div>
            <div className="flex gap-4">
              <span>Terms of Service</span>
              <span>•</span>
              <span>Child Safety Policy</span>
              <span>•</span>
              <span>Privacy Guarantee</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        initialRole={authRole}
      />

      <StudentOnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />

      <TeacherProfileModal
        teacher={viewingTeacher}
        isOpen={!!viewingTeacher}
        onClose={() => setViewingTeacher(null)}
        onRequestLesson={(teacher) => {
          setViewingTeacher(null);
          setRequestingTeacher(teacher);
        }}
      />

      <LessonRequestModal
        teacher={requestingTeacher}
        isOpen={!!requestingTeacher}
        onClose={() => setRequestingTeacher(null)}
        onSuccess={() => {
          triggerToast('Lesson request submitted! Email confirmation sent to teacher & student.');
          setCurrentTab('student_dash');
        }}
      />

      <LeaveReviewModal
        lesson={reviewingLesson}
        isOpen={!!reviewingLesson}
        onClose={() => setReviewingLesson(null)}
      />

      <TeacherRescheduleModal
        lesson={reschedulingLesson}
        isOpen={!!reschedulingLesson}
        onClose={() => setReschedulingLesson(null)}
      />

      <EmailCenterModal
        isOpen={emailCenterOpen}
        onClose={() => setEmailCenterOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
