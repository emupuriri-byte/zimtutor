import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TeacherProfile } from '../types';
import { TeacherCard } from '../components/TeacherCard';
import {
  Search,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  Star,
  Users,
  Laptop,
  ArrowRight,
  BookOpen,
  Sparkles,
  MapPin,
  HelpCircle,
} from 'lucide-react';

interface HomePageProps {
  onNavigateFind: (subject?: string) => void;
  onNavigateTeacherDash: () => void;
  onOpenAuth: (mode?: 'login' | 'register', role?: 'student' | 'teacher') => void;
  onViewTeacher: (teacher: TeacherProfile) => void;
  onRequestLesson: (teacher: TeacherProfile) => void;
  onOpenOnboarding: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateFind,
  onNavigateTeacherDash,
  onOpenAuth,
  onViewTeacher,
  onRequestLesson,
  onOpenOnboarding,
}) => {
  const { allTeachers, subjects, currentUser } = useApp();
  const [searchSubject, setSearchSubject] = useState('');

  const verifiedTeachers = allTeachers.filter((t) => t.verified).slice(0, 3);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateFind(searchSubject || undefined);
  };

  return (
    <div className="space-y-16 pb-16 bg-white">
      {/* Hero Section (Black & White Editorial Design) */}
      <section className="relative overflow-hidden bg-black text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Zimbabwe's Premier Educational Tutoring Marketplace — Zim Tutor</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Your Future Starts With the{' '}
            <span className="underline decoration-zinc-400 decoration-wavy underline-offset-8">
              Right Teacher.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Connect with qualified, verified teachers across Zimbabwe for{' '}
            <span className="text-white font-bold">O Level</span>,{' '}
            <span className="text-white font-bold">IGCSE</span>,{' '}
            <span className="text-white font-bold">AS</span>, and{' '}
            <span className="text-white font-bold">A Level</span> on Zim Tutor. Learn online or face-to-face in Harare, Bulawayo, Mutare and beyond.
          </p>

          {/* Dual Primary Choice */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateFind()}
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-zinc-200 text-black font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <Search className="w-4 h-4 text-black" />
              <span>1. Find a Teacher</span>
            </button>

            <button
              onClick={() => {
                if (currentUser?.role === 'teacher') {
                  onNavigateTeacherDash();
                } else {
                  onOpenAuth('register', 'teacher');
                }
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <Briefcase className="w-4 h-4 text-zinc-400" />
              <span>2. Become a Teacher</span>
            </button>
          </div>

          {/* Quick Subject Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-xl mx-auto pt-4 flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchSubject}
                onChange={(e) => setSearchSubject(e.target.value)}
                placeholder="Search subject (e.g. Mathematics, Chemistry, Biology)..."
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 focus:bg-white text-white focus:text-black placeholder:text-zinc-500 text-sm rounded-xl border border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-white transition font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-white hover:bg-zinc-200 text-black font-black text-sm rounded-xl transition shrink-0"
            >
              Search Tutors
            </button>
          </form>

          {/* Student Profile Setup Quick Banner */}
          <div className="pt-2">
            <button
              onClick={onOpenOnboarding}
              className="inline-flex items-center gap-2 text-xs text-zinc-300 hover:text-white underline decoration-zinc-500 underline-offset-4 font-bold"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student? Customize your Education Level & Learning Goals</span>
            </button>
          </div>
        </div>
      </section>

      {/* Popular Subjects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-black">
              Curriculum Specialties
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black mt-1">
              Explore Tutors by Subject
            </h2>
          </div>
          <button
            onClick={() => onNavigateFind()}
            className="text-xs font-black text-black hover:underline flex items-center gap-1 group"
          >
            <span>View All Subjects</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {subjects.map((sub) => {
            const tutorCount = allTeachers.filter((t) =>
              t.subjects.some((s) => s.subjectName.toLowerCase() === sub.name.toLowerCase())
            ).length;

            return (
              <div
                key={sub.id}
                onClick={() => onNavigateFind(sub.name)}
                className="p-4 bg-white rounded-2xl border border-zinc-300 hover:border-black hover:shadow-md cursor-pointer transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                      {sub.category}
                    </span>
                    <span className="text-xs font-bold text-black bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                      {tutorCount} {tutorCount === 1 ? 'tutor' : 'tutors'}
                    </span>
                  </div>
                  <h3 className="font-black text-black group-hover:underline transition text-sm">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-zinc-600 line-clamp-2 mt-1 leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-black font-black">
                  <span>Browse Tutors</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Verified Teachers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-black">
              Verified Excellence
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black mt-1">
              Top Rated Zimbabwean Teachers
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Qualified tutors with degrees verified by Zim Tutor administrators.
            </p>
          </div>
          <button
            onClick={() => onNavigateFind()}
            className="text-xs font-black text-black hover:underline flex items-center gap-1 group"
          >
            <span>Browse All {allTeachers.length} Teachers</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.userId}
              teacher={teacher}
              onViewProfile={onViewTeacher}
              onRequestLesson={onRequestLesson}
            />
          ))}
        </div>
      </section>

      {/* How It Works Section (Monochrome) */}
      <section className="bg-zinc-50 py-16 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-black uppercase tracking-wider text-black">
              Simple & Transparent
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-black mt-1">
              How Zim Tutor Works
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Easy to use on mobile phones, tablets, or computers for students, parents, and teachers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Students */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-300 shadow-xs space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-black">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-black text-lg">For Students & Parents</h3>
                  <p className="text-xs text-zinc-500">Achieve your target examination grades</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-black">Search & Compare Rates</h4>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      Filter by O Level, Cambridge IGCSE, or A Level subjects. Compare hourly prices from $5/hr with zero booking fees on Zim Tutor.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-black">Send a Lesson Request</h4>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      Select date, time, and whether you prefer online (Google Meet) or physical tutoring in your town.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-black">Learn & Leave a Review</h4>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      Get email notifications on confirmation. Arrange lesson payment directly with your teacher, and review them once complete.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateFind()}
                className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition"
              >
                Start Browsing Tutors
              </button>
            </div>

            {/* For Teachers */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-300 shadow-xs space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-zinc-200 text-black flex items-center justify-center font-black border border-zinc-300">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-black text-lg">For Teachers & Tutors</h3>
                  <p className="text-xs text-zinc-500">Reach motivated students across Zimbabwe</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-black">Create Your Profile</h4>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      List your subjects, curriculum experience, weekly availability, and set your own hourly rates in USD.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-black">Get Verified</h4>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      Submit your university qualifications or Zimsec examiner credentials for admin review to earn the Verified badge.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-black">Accept Lessons & Earn</h4>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      Receive instant email notifications when students book. Accept, decline, or propose alternative times easily.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (currentUser?.role === 'teacher') onNavigateTeacherDash();
                  else onOpenAuth('register', 'teacher');
                }}
                className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-black font-bold text-xs rounded-xl border border-zinc-300 transition"
              >
                Register as a Teacher (Free)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Child Safety & Trust Standards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-zinc-800">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Trust, Safety & Privacy Guarantee</span>
            </div>
            <h3 className="text-2xl font-black text-white">
              Safe & Trustworthy Educational Community
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We protect both students and teachers. Residential addresses and private phone numbers are never published openly. Qualifications are independently audited by platform administrators.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigateFind()}
              className="px-6 py-3 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl shadow-md transition"
            >
              Browse Verified Tutors
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
