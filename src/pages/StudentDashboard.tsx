import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LessonRequest, TeacherProfile } from '../types';
import { formatDate } from '../utils/rules';
import {
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  Laptop,
  Users,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  SlidersHorizontal,
  Bookmark,
  Video,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigateFind: (subject?: string) => void;
  onOpenOnboarding: () => void;
  onViewTeacher: (teacher: TeacherProfile) => void;
  onRequestLesson: (teacher: TeacherProfile) => void;
  onOpenLeaveReview: (lesson: LessonRequest) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigateFind,
  onOpenOnboarding,
  onViewTeacher,
  onRequestLesson,
  onOpenLeaveReview,
}) => {
  const {
    currentUser,
    studentProfile,
    lessonRequests,
    allTeachers,
    reviews,
    studentAcceptRescheduled,
    studentRejectRescheduled,
    cancelRequest,
    markLessonCompleted,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'upcoming' | 'history' | 'saved'>(
    'overview'
  );

  // Student's requests
  const studentRequests = lessonRequests.filter(
    (req) => req.studentId === (currentUser?.id || 'user-stud-1')
  );

  const pendingRequests = studentRequests.filter(
    (req) => req.status === 'pending' || req.status === 'rescheduled'
  );

  const upcomingLessons = studentRequests.filter(
    (req) => req.status === 'confirmed'
  );

  const completedLessons = studentRequests.filter(
    (req) => req.status === 'completed'
  );

  // Saved teachers
  const savedTeachers = allTeachers.filter((t) =>
    studentProfile?.savedTeacherIds.includes(t.userId)
  );

  // Recommended teachers (teachers who teach student's primary subjects)
  const recommendedTeachers = allTeachers
    .filter((t) =>
      t.subjects.some((s) => studentProfile?.subjects.includes(s.subjectName))
    )
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white min-h-[80vh]">
      {/* Welcome Banner (Black & White) */}
      <div className="bg-black text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden border border-zinc-800">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-bold">
            <GraduationCap className="w-4 h-4 text-white" />
            <span>Student Learning Portal — Zim Tutor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {currentUser?.fullName || 'Tawanda'}!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
            Curriculum: <strong className="text-white">{studentProfile?.primaryLevel}</strong> ({studentProfile?.form}) • Active Subjects:{' '}
            <strong className="text-white">{studentProfile?.subjects.join(', ')}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => onNavigateFind()}
            className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Find a Teacher</span>
          </button>

          <button
            onClick={onOpenOnboarding}
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl border border-zinc-700 transition flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Edit Learning Profile</span>
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2 rounded-xl transition ${
            activeTab === 'overview'
              ? 'bg-black text-white'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
          }`}
        >
          Overview & Recommendations
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-black text-white'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
          }`}
        >
          <span>Pending Requests</span>
          {pendingRequests.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-zinc-200 text-black text-[10px] flex items-center justify-center font-black">
              {pendingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'upcoming'
              ? 'bg-black text-white'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
          }`}
        >
          <span>Upcoming Lessons</span>
          {upcomingLessons.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-zinc-200 text-black text-[10px] flex items-center justify-center font-black">
              {upcomingLessons.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-2 rounded-xl transition ${
            activeTab === 'history'
              ? 'bg-black text-white'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
          }`}
        >
          Lesson History & Reviews ({completedLessons.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-3 py-2 rounded-xl transition ${
            activeTab === 'saved'
              ? 'bg-black text-white'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
          }`}
        >
          Saved Teachers ({savedTeachers.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-zinc-300">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Pending Requests
              </span>
              <div className="text-2xl font-black text-black mt-1">
                {pendingRequests.length}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-zinc-300">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Confirmed Lessons
              </span>
              <div className="text-2xl font-black text-black mt-1">
                {upcomingLessons.length}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-zinc-300">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Lessons Completed
              </span>
              <div className="text-2xl font-black text-black mt-1">
                {completedLessons.length}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-zinc-300">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Saved Teachers
              </span>
              <div className="text-2xl font-black text-black mt-1">
                {savedTeachers.length}
              </div>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-300 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h2 className="text-sm font-black text-black uppercase tracking-wider">
                My Learning Configuration
              </h2>
              <button
                onClick={onOpenOnboarding}
                className="text-xs font-bold text-black underline hover:text-zinc-600"
              >
                Change Preferences
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-zinc-500 font-semibold block mb-1">Education Level & Form:</span>
                <span className="font-bold text-black">
                  {studentProfile?.primaryLevel} ({studentProfile?.form})
                </span>
              </div>
              <div>
                <span className="text-zinc-500 font-semibold block mb-1">Target Hourly Budget:</span>
                <span className="font-bold text-black">
                  Up to ${studentProfile?.maxBudgetUsd} USD/hr
                </span>
              </div>
              <div>
                <span className="text-zinc-500 font-semibold block mb-1">Teaching Preference:</span>
                <span className="font-bold text-black capitalize">
                  {studentProfile?.lessonPreference}
                  {studentProfile?.town ? ` in ${studentProfile.town}` : ''}
                </span>
              </div>
            </div>

            <div>
              <span className="text-zinc-500 font-bold text-xs block mb-1.5 uppercase tracking-wider">
                Target Subjects:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {studentProfile?.subjects.map((sub) => (
                  <span
                    key={sub}
                    className="text-xs font-bold px-2.5 py-1 bg-zinc-100 text-black border border-zinc-300 rounded-lg"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-zinc-500 font-bold text-xs block mb-1.5 uppercase tracking-wider">
                Learning Goals:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {studentProfile?.learningGoals.map((goal) => (
                  <span
                    key={goal}
                    className="text-[11px] font-medium px-2 py-0.5 bg-zinc-100 text-black rounded-md border border-zinc-200"
                  >
                    ✓ {goal}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Teachers for this Student */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-black">
                  Recommended Teachers for Your Subjects
                </h2>
                <p className="text-xs text-zinc-500">
                  Curated based on your level ({studentProfile?.primaryLevel}) and subjects on Zim Tutor.
                </p>
              </div>
              <button
                onClick={() => onNavigateFind()}
                className="text-xs font-bold text-black hover:underline flex items-center gap-1"
              >
                <span>Browse All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedTeachers.map((teacher) => (
                <div
                  key={teacher.userId}
                  className="bg-white p-5 rounded-2xl border border-zinc-300 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={teacher.avatarUrl}
                        alt={teacher.fullName}
                        className="w-12 h-12 rounded-xl object-cover border border-zinc-300"
                      />
                      <div>
                        <h3 className="font-black text-sm text-black">
                          {teacher.fullName}
                        </h3>
                        <div className="text-[11px] text-zinc-500">{teacher.town}</div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 line-clamp-2">{teacher.headline}</p>

                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((s) => (
                        <span
                          key={s.subjectId}
                          className="text-[10px] font-bold px-2 py-0.5 bg-zinc-100 text-black border border-zinc-300 rounded-md"
                        >
                          {s.subjectName} (${s.hourlyRateUsd}/hr)
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-zinc-200 flex items-center justify-between">
                    <button
                      onClick={() => onViewTeacher(teacher)}
                      className="text-xs font-bold text-zinc-600 hover:text-black"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onRequestLesson(teacher)}
                      className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-2xs transition"
                    >
                      Request Lesson
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Pending Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-black">Pending Lesson Requests</h2>
            <span className="text-xs text-zinc-500">
              Teachers usually respond within 24 hours.
            </span>
          </div>

          {pendingRequests.length > 0 ? (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-5 rounded-2xl border border-zinc-300 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-black text-base">
                          {req.subject} ({req.educationLevel})
                        </h3>
                        {req.status === 'rescheduled' ? (
                          <span className="text-xs font-bold text-black bg-zinc-200 px-2 py-0.5 rounded-full border border-zinc-300">
                            Alternative Time Suggested by Teacher
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-black bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-300">
                            Awaiting Teacher Confirmation
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        Tutor: <strong className="text-black">{req.teacherName}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-black">
                        ${req.estimatedCost.toFixed(2)} USD
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        ${req.hourlyRate}/hr • {req.durationHours} hr
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-zinc-50 p-3 rounded-xl text-xs text-zinc-700 border border-zinc-200">
                    <div>
                      <span className="text-zinc-500 block font-semibold">Requested Date & Time:</span>
                      <strong>
                        {formatDate(req.preferredDate)} at {req.startTime}
                      </strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block font-semibold">Lesson Format:</span>
                      <strong className="capitalize">{req.lessonFormat}</strong>
                      {req.studentTown && ` (${req.studentTown})`}
                    </div>
                    <div>
                      <span className="text-zinc-500 block font-semibold">Learning Goals:</span>
                      <span className="line-clamp-1">{req.learningGoals.join(', ')}</span>
                    </div>
                  </div>

                  {/* Reschedule alert box if teacher suggested new time */}
                  {req.status === 'rescheduled' && (
                    <div className="p-3.5 bg-zinc-100 rounded-xl border border-zinc-300 text-xs space-y-2">
                      <div className="font-bold text-black flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-black" />
                        <span>Teacher proposed alternative time:</span>
                      </div>
                      <div className="text-black">
                        <strong>
                          {formatDate(req.suggestedDate || req.preferredDate)} at{' '}
                          {req.suggestedTime || req.startTime}
                        </strong>
                      </div>
                      {req.teacherNote && (
                        <p className="text-xs text-zinc-700 italic">"{req.teacherNote}"</p>
                      )}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => studentAcceptRescheduled(req.id)}
                          className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-lg transition"
                        >
                          Accept New Time
                        </button>
                        <button
                          type="button"
                          onClick={() => studentRejectRescheduled(req.id)}
                          className="px-3 py-1.5 bg-white border border-zinc-300 hover:bg-zinc-100 text-black font-bold text-xs rounded-lg transition"
                        >
                          Decline & Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-xs">
                    <span className="text-zinc-500">
                      Payment is arranged directly between you and {req.teacherName}.
                    </span>
                    <button
                      type="button"
                      onClick={() => cancelRequest(req.id, 'Cancelled by student')}
                      className="text-black hover:underline font-bold"
                    >
                      Cancel Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 bg-white rounded-2xl border border-zinc-300 text-center text-zinc-500 text-xs">
              No pending lesson requests. Search for a teacher to book a session!
            </div>
          )}
        </div>
      )}

      {/* Tab: Upcoming Lessons */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-black">Confirmed Upcoming Lessons</h2>
            <span className="text-xs text-zinc-500">
              Calendar & attendance details
            </span>
          </div>

          {upcomingLessons.length > 0 ? (
            <div className="space-y-3">
              {upcomingLessons.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-5 rounded-2xl border-2 border-black shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-black text-base">
                          {req.subject} with {req.teacherName}
                        </h3>
                        <p className="text-xs text-zinc-600 font-bold">
                          Confirmed for {formatDate(req.preferredDate)} at {req.startTime} ({req.durationHours} hr)
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-black">
                        ${req.estimatedCost.toFixed(2)} USD
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Arranged directly with teacher
                      </div>
                    </div>
                  </div>

                  {req.lessonFormat === 'online' && req.meetingLink && (
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-300 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-black font-bold">
                        <Video className="w-4 h-4 text-black" />
                        <span>Google Meet Class Link:</span>
                        <code className="font-mono text-black underline">{req.meetingLink}</code>
                      </div>
                      <a
                        href={req.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-black text-white font-bold rounded-lg hover:bg-zinc-800 flex items-center gap-1 transition"
                      >
                        Join Room <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {req.lessonFormat === 'physical' && (
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-800 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-black" />
                      <span>
                        In-person meeting area: <strong>{req.studentTown || 'Agreed meeting area'}</strong>
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-xs">
                    <button
                      type="button"
                      onClick={() => markLessonCompleted(req.id)}
                      className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition"
                    >
                      Mark Lesson as Finished
                    </button>
                    <button
                      type="button"
                      onClick={() => cancelRequest(req.id, 'Student cancellation')}
                      className="text-xs text-zinc-600 hover:text-black font-bold"
                    >
                      Cancel Lesson
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 bg-white rounded-2xl border border-zinc-300 text-center text-zinc-500 text-xs">
              No upcoming confirmed lessons at the moment.
            </div>
          )}
        </div>
      )}

      {/* Tab: History & Reviews */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-black">Completed Lessons & Reviews</h2>
            <span className="text-xs text-zinc-500">
              Only completed lessons can be reviewed
            </span>
          </div>

          {completedLessons.length > 0 ? (
            <div className="space-y-3">
              {completedLessons.map((req) => {
                const existingReview = reviews.find((r) => r.lessonId === req.id);
                return (
                  <div
                    key={req.id}
                    className="bg-white p-5 rounded-2xl border border-zinc-300 shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-black text-black text-base">
                          {req.subject} with {req.teacherName}
                        </h3>
                        <p className="text-xs text-zinc-500">
                          Completed on {formatDate(req.preferredDate)} • Duration: {req.durationHours} hr
                        </p>
                      </div>

                      {existingReview ? (
                        <div className="flex items-center gap-1.5 bg-zinc-100 px-3 py-1.5 rounded-xl border border-zinc-300">
                          <Star className="w-4 h-4 fill-black text-black" />
                          <span className="font-black text-xs text-black">
                            You rated {existingReview.rating}/5
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOpenLeaveReview(req)}
                          className="px-4 py-2 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                        >
                          ★ Leave a Review
                        </button>
                      )}
                    </div>

                    {existingReview && (
                      <p className="p-3 bg-zinc-50 rounded-xl text-xs text-zinc-700 italic border border-zinc-200">
                        "{existingReview.feedback}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 bg-white rounded-2xl border border-zinc-300 text-center text-zinc-500 text-xs">
              No completed lessons yet. Once a lesson finishes, you can leave a verified review here!
            </div>
          )}
        </div>
      )}

      {/* Tab: Saved Teachers */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-black">Saved Teachers ({savedTeachers.length})</h2>
            <button
              onClick={() => onNavigateFind()}
              className="text-xs font-bold text-black underline"
            >
              Search more tutors
            </button>
          </div>

          {savedTeachers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedTeachers.map((teacher) => (
                <div
                  key={teacher.userId}
                  className="bg-white p-5 rounded-2xl border border-zinc-300 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={teacher.avatarUrl}
                      alt={teacher.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-300"
                    />
                    <div>
                      <h3 className="font-black text-sm text-black">{teacher.fullName}</h3>
                      <div className="text-[11px] text-zinc-500">{teacher.town}</div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 line-clamp-2">{teacher.headline}</p>

                  <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
                    <button
                      onClick={() => onViewTeacher(teacher)}
                      className="text-xs font-bold text-zinc-600 hover:text-black"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onRequestLesson(teacher)}
                      className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition"
                    >
                      Request Lesson
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 bg-white rounded-2xl border border-zinc-300 text-center text-zinc-500 text-xs">
              You haven't bookmarked any teachers yet. Click the bookmark icon on any teacher card to save them!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
