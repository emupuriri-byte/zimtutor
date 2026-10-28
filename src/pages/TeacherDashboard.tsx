import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LessonRequest } from '../types';
import { formatDate } from '../utils/rules';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  Star,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  MapPin,
  Laptop,
  Users,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface TeacherDashboardProps {
  onOpenReschedule: (lesson: LessonRequest) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onOpenReschedule,
}) => {
  const {
    currentUser,
    teacherProfile,
    lessonRequests,
    reviews,
    acceptRequest,
    declineRequest,
    updateTeacherProfile,
    markLessonCompleted,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'schedule' | 'subjects' | 'reviews'>('requests');
  const [declineReason, setDeclineReason] = useState<string>('');
  const [decliningId, setDecliningId] = useState<string | null>(null);

  // Editable bio & town
  const [headline, setHeadline] = useState(teacherProfile?.headline || '');
  const [bio, setBio] = useState(teacherProfile?.bio || '');
  const [town, setTown] = useState(teacherProfile?.town || '');
  const [offersOnline, setOffersOnline] = useState(teacherProfile?.offersOnline ?? true);
  const [offersPhysical, setOffersPhysical] = useState(teacherProfile?.offersPhysical ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New subject form
  const [newSubjectName, setNewSubjectName] = useState('Chemistry');
  const [newSubjectRate, setNewSubjectRate] = useState<number>(10);

  if (!teacherProfile) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Teacher Profile Not Initialized</h2>
        <p className="text-xs text-slate-500">
          Please log in as a teacher account to access this management dashboard.
        </p>
      </div>
    );
  }

  // Teacher's specific incoming requests
  const incomingRequests = lessonRequests.filter(
    (req) => req.teacherId === teacherProfile.userId
  );

  const pendingRequests = incomingRequests.filter(
    (req) => req.status === 'pending' || req.status === 'rescheduled'
  );

  const confirmedLessons = incomingRequests.filter(
    (req) => req.status === 'confirmed'
  );

  const teacherReviews = reviews.filter(
    (r) => r.teacherId === teacherProfile.userId
  );

  // Calculate profile completion percentage
  let completionPoints = 0;
  if (teacherProfile.avatarUrl) completionPoints += 20;
  if (teacherProfile.bio && teacherProfile.bio.length > 30) completionPoints += 20;
  if (teacherProfile.subjects.length > 0) completionPoints += 20;
  if (teacherProfile.qualifications.length > 0) completionPoints += 20;
  if (teacherProfile.availability.length > 0) completionPoints += 20;

  const handleSaveProfileChanges = () => {
    updateTeacherProfile({
      headline,
      bio,
      town,
      offersOnline,
      offersPhysical,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddSubject = () => {
    if (!newSubjectName) return;
    const existing = teacherProfile.subjects.find(
      (s) => s.subjectName.toLowerCase() === newSubjectName.toLowerCase()
    );
    if (existing) return;

    const newSubjectItem = {
      subjectId: newSubjectName.toLowerCase().replace(/\s+/g, '-'),
      subjectName: newSubjectName,
      levels: ['O Level', 'IGCSE'] as any,
      hourlyRateUsd: newSubjectRate,
      lessonFormat: 'both' as any,
    };

    updateTeacherProfile({
      subjects: [...teacherProfile.subjects, newSubjectItem],
    });
  };

  const handleRemoveSubject = (subjectId: string) => {
    if (teacherProfile.subjects.length <= 1) return; // Keep at least one
    const updated = teacherProfile.subjects.filter((s) => s.subjectId !== subjectId);
    updateTeacherProfile({ subjects: updated });
  };

  const handleUpdateSubjectRate = (subjectId: string, newRate: number) => {
    const updated = teacherProfile.subjects.map((s) =>
      s.subjectId === subjectId ? { ...s, hourlyRateUsd: newRate } : s
    );
    updateTeacherProfile({ subjects: updated });
  };

  const handleToggleDayAvailability = (day: string) => {
    const exists = teacherProfile.availability.some((a) => a.dayOfWeek === day);
    let updated;
    if (exists) {
      updated = teacherProfile.availability.filter((a) => a.dayOfWeek !== day);
    } else {
      updated = [
        ...teacherProfile.availability,
        { dayOfWeek: day as any, startTime: '14:00', endTime: '18:00' },
      ];
    }
    updateTeacherProfile({ availability: updated });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-black text-white rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={teacherProfile.avatarUrl}
              alt={teacherProfile.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            {teacherProfile.verified && (
              <span className="absolute -bottom-1 -right-1 bg-black text-white p-0.5 rounded-full border border-zinc-700">
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{teacherProfile.fullName}</h1>
              {teacherProfile.verified ? (
                <span className="text-[11px] font-bold text-white bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-700">
                  Verified Educator
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                  Credentials Pending Review
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-300 mt-0.5">{teacherProfile.headline}</p>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
              <span>{teacherProfile.town}</span>
              <span>•</span>
              <span className="text-white font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                <span>{teacherProfile.rating.toFixed(1)}</span>
                <span className="font-normal text-zinc-400">
                  ({teacherProfile.totalReviews} reviews)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Profile Completion Meter */}
        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 w-full sm:w-64 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-zinc-300">Profile Completion:</span>
            <span className="text-white font-black">{completionPoints}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-300"
              style={{ width: `${completionPoints}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-zinc-400">
            {completionPoints === 100
              ? 'Profile fully optimized for student bookings.'
              : 'Add qualifications and schedule to reach 100%.'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-black text-white'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
          }`}
        >
          <span>Incoming Requests</span>
          {pendingRequests.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] flex items-center justify-center font-black border border-zinc-300">
              {pendingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-3.5 py-2 rounded-xl transition ${
            activeTab === 'schedule'
              ? 'bg-black text-white'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
          }`}
        >
          Weekly Availability
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-3.5 py-2 rounded-xl transition ${
            activeTab === 'subjects'
              ? 'bg-black text-white'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
          }`}
        >
          Subjects & Hourly Pricing ({teacherProfile.subjects.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-3.5 py-2 rounded-xl transition ${
            activeTab === 'reviews'
              ? 'bg-black text-white'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
          }`}
        >
          Student Feedback ({teacherReviews.length})
        </button>
      </div>

      {/* Tab: Requests & Confirmed Lessons */}
      {activeTab === 'requests' && (
        <div className="space-y-8">
          {/* New / Pending Requests */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">
                New Lesson Requests ({pendingRequests.length})
              </h2>
              <span className="text-xs text-slate-500">
                Accept or propose an alternative time for students
              </span>
            </div>

            {pendingRequests.length > 0 ? (
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-black text-base">
                            {req.subject} • {req.educationLevel} ({req.form})
                          </h3>
                          <span className="text-xs font-semibold text-black bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-300">
                            {req.status === 'rescheduled' ? 'Time Proposed' : 'New Request'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 mt-0.5">
                          Student: <strong className="text-black">{req.studentName}</strong> (
                          {req.studentEmail})
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-black text-black">
                          ${req.estimatedCost.toFixed(2)} USD
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          ${req.hourlyRate}/hr • {req.durationHours} hr
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-zinc-50 p-3.5 rounded-xl text-xs text-zinc-600">
                      <div>
                        <span className="text-zinc-400 block font-semibold">Requested Slot:</span>
                        <strong>
                          {formatDate(req.preferredDate)} at {req.startTime}
                        </strong>
                      </div>
                      <div>
                        <span className="text-zinc-400 block font-semibold">Lesson Format:</span>
                        <strong className="capitalize">{req.lessonFormat}</strong>
                        {req.studentTown && ` (${req.studentTown})`}
                      </div>
                      <div>
                        <span className="text-zinc-400 block font-semibold">Student Learning Goals:</span>
                        <span className="line-clamp-1">{req.learningGoals.join(', ')}</span>
                      </div>
                    </div>

                    {req.studentMessage && (
                      <div className="p-3 bg-zinc-50 rounded-xl text-xs text-zinc-700 italic border border-zinc-200">
                        "{req.studentMessage}"
                      </div>
                    )}

                    {decliningId === req.id ? (
                      <div className="p-3.5 bg-zinc-100 rounded-xl border border-zinc-300 space-y-2 text-xs">
                        <label className="block font-bold text-black">
                          Reason for declining (sent to student via email):
                        </label>
                        <input
                          type="text"
                          value={declineReason}
                          onChange={(e) => setDeclineReason(e.target.value)}
                          placeholder="e.g. Schedule fully booked, only taking A Level students..."
                          className="w-full px-3 py-1.5 text-xs border border-zinc-300 rounded-lg bg-white"
                        />
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              declineRequest(req.id, declineReason);
                              setDecliningId(null);
                              setDeclineReason('');
                            }}
                            className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition"
                          >
                            Confirm Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => setDecliningId(null)}
                            className="px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-black font-bold"
                          >
                            Back
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100">
                        <span className="text-[11px] text-zinc-400">
                          Confirming sends an automated email with attendance link/details to student.
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenReschedule(req)}
                            className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-black font-bold text-xs rounded-xl transition"
                          >
                            Suggest Another Time
                          </button>
                          <button
                            type="button"
                            onClick={() => setDecliningId(req.id)}
                            className="px-3.5 py-1.5 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-300 font-bold text-xs rounded-xl transition"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => acceptRequest(req.id)}
                            className="px-4 py-1.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                          >
                            Accept & Confirm Lesson
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-white rounded-2xl border border-zinc-200 text-center text-zinc-500 text-xs">
                No new pending lesson requests right now.
              </div>
            )}
          </div>

          {/* Confirmed Lessons */}
          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-black text-black">
              Confirmed Upcoming Lessons ({confirmedLessons.length})
            </h2>
            {confirmedLessons.length > 0 ? (
              <div className="space-y-3">
                {confirmedLessons.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white p-5 rounded-2xl border border-zinc-300 shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-black" />
                          <h3 className="font-extrabold text-black text-base">
                            {req.subject} with {req.studentName}
                          </h3>
                        </div>
                        <p className="text-xs text-zinc-600 mt-0.5">
                          {formatDate(req.preferredDate)} at {req.startTime} ({req.durationHours} hr) • Total: ${req.estimatedCost.toFixed(2)} USD
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => markLessonCompleted(req.id)}
                        className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition self-start sm:self-auto"
                      >
                        Mark Completed
                      </button>
                    </div>

                    {req.meetingLink && (
                      <div className="p-3 bg-zinc-100 rounded-xl text-xs text-black flex items-center justify-between border border-zinc-200">
                        <span>Google Meet: <strong className="font-mono">{req.meetingLink}</strong></span>
                        <a
                          href={req.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-black text-white font-bold rounded-lg hover:bg-zinc-800 transition"
                        >
                          Launch Room
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-white rounded-2xl border border-zinc-200 text-center text-zinc-500 text-xs">
                No confirmed lessons currently scheduled.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Availability */}
      {activeTab === 'schedule' && (
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-black text-black">Set Weekly Availability</h2>
            <p className="text-xs text-zinc-500 mt-1">
              Toggle the days you are available to take students. This prevents double-booking and informs students when you can teach.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ].map((day) => {
              const activeSlot = teacherProfile.availability.find((a) => a.dayOfWeek === day);
              const isActive = !!activeSlot;
              return (
                <div
                  key={day}
                  onClick={() => handleToggleDayAvailability(day)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                    isActive
                      ? 'border-black bg-zinc-100 text-black'
                      : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">{day}</div>
                    <div className="text-xs font-mono mt-0.5">
                      {isActive ? `${activeSlot.startTime} – ${activeSlot.endTime}` : 'Unavailable'}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                      isActive ? 'bg-black text-white font-bold' : 'border border-zinc-300'
                    }`}
                  >
                    {isActive && '✓'}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl text-xs text-zinc-500 border border-zinc-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-black" />
            <span>Changes update automatically on your public teacher profile.</span>
          </div>
        </div>
      )}

      {/* Tab: Subjects & Rates */}
      {activeTab === 'subjects' && (
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
            <div>
              <h2 className="text-lg font-black text-black">Subjects & Curriculum Pricing</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Manage what you teach and your hourly rate (USD) per subject.
              </p>
            </div>

            {/* Quick Add Subject */}
            <div className="flex items-center gap-2">
              <select
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="px-3 py-1.5 text-xs border border-zinc-300 rounded-xl bg-white text-black"
              >
                <option value="Chemistry">Chemistry</option>
                <option value="Accounting">Accounting</option>
                <option value="English Literature">English Literature</option>
                <option value="French">French</option>
                <option value="Geography">Geography</option>
                <option value="History">History</option>
                <option value="Business Studies">Business Studies</option>
              </select>
              <input
                type="number"
                min="5"
                max="50"
                value={newSubjectRate}
                onChange={(e) => setNewSubjectRate(Number(e.target.value))}
                className="w-16 px-2 py-1.5 text-xs border border-zinc-300 rounded-xl text-center font-bold text-black"
              />
              <button
                type="button"
                onClick={handleAddSubject}
                className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teacherProfile.subjects.map((sub) => (
              <div
                key={sub.subjectId}
                className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-black">{sub.subjectName}</h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(sub.subjectId)}
                    className="text-zinc-400 hover:text-black transition"
                    title="Remove subject"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-semibold">Hourly Rate (USD):</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-zinc-400 font-bold">$</span>
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={sub.hourlyRateUsd}
                      onChange={(e) =>
                        handleUpdateSubjectRate(sub.subjectId, Number(e.target.value))
                      }
                      className="w-16 px-2 py-1 text-xs border border-zinc-300 rounded-lg bg-white text-center font-bold text-black"
                    />
                    <span className="text-xs text-zinc-500 font-medium">/hr</span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <span>Curriculum:</span>
                  <span className="font-semibold text-zinc-800">
                    {sub.levels.join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Profile details editor */}
          <div className="pt-6 border-t border-zinc-200 space-y-4">
            <h3 className="text-sm font-extrabold text-black uppercase tracking-wider">
              Teaching Profile Details & Location
            </h3>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl text-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Biography</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl text-black"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Teaching Area / Town
                </label>
                <input
                  type="text"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl text-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Formats Offered
                </label>
                <div className="flex gap-4 pt-1 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-zinc-700">
                    <input
                      type="checkbox"
                      checked={offersOnline}
                      onChange={(e) => setOffersOnline(e.target.checked)}
                      className="rounded text-black accent-black"
                    />
                    <span>Online (Video)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-zinc-700">
                    <input
                      type="checkbox"
                      checked={offersPhysical}
                      onChange={(e) => setOffersPhysical(e.target.checked)}
                      className="rounded text-black accent-black"
                    />
                    <span>Physical (In-Person)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSuccess ? (
                <span className="text-xs font-bold text-black flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-black" /> Changes saved successfully!
                </span>
              ) : (
                <div></div>
              )}
              <button
                type="button"
                onClick={handleSaveProfileChanges}
                className="px-5 py-2 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Reviews */}
      {activeTab === 'reviews' && (
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-lg font-black text-black">Student Reviews & Rating</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Reviews left by students who completed verified lessons with you.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-black flex items-center justify-end gap-1">
                <Star className="w-5 h-5 fill-black text-black" />
                <span>{teacherProfile.rating.toFixed(1)}</span>
              </div>
              <div className="text-[11px] text-zinc-400">
                {teacherProfile.totalReviews} total verified reviews
              </div>
            </div>
          </div>

          {teacherReviews.length > 0 ? (
            <div className="space-y-3">
              {teacherReviews.map((r) => (
                <div key={r.id} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs text-black">{r.studentName}</strong>
                    <div className="flex items-center gap-1 text-black text-xs font-bold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating ? 'fill-black text-black' : 'text-zinc-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-700 italic">"{r.feedback}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500 text-xs">
              No reviews received yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
