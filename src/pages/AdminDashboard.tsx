import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/rules';
import {
  ShieldAlert,
  BadgeCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  Plus,
  Eye,
  Trash2,
  Lock,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    allTeachers,
    subjects,
    lessonRequests,
    reviews,
    reports,
    adminApproveTeacher,
    adminRejectTeacher,
    adminModerateReview,
    adminAddSubject,
    adminToggleUserSuspension,
    resetToDefaults,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'verification' | 'subjects' | 'reviews' | 'lessons' | 'reports'>('verification');
  const [rejectNote, setRejectNote] = useState<string>('');
  const [rejectingTeacherId, setRejectingTeacherId] = useState<string | null>(null);

  // New subject state
  const [subName, setSubName] = useState('');
  const [subCategory, setSubCategory] = useState<'Sciences' | 'Commercials' | 'Languages' | 'Humanities' | 'Technology'>('Commercials');
  const [subDesc, setSubDesc] = useState('');

  // Protect admin dashboard
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Restricted Administrator Area</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          This panel is restricted to authorized platform administrators. You can switch to the Administrator persona via the role switcher in the navigation bar to test this screen.
        </p>
      </div>
    );
  }

  const pendingVerificationTeachers = allTeachers.filter(
    (t) => !t.verified || t.verificationStatus === 'pending'
  );

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;
    adminAddSubject({
      name: subName.trim(),
      category: subCategory,
      iconName: 'BookOpen',
      description: subDesc.trim() || 'Curriculum support for Zimbabwean secondary students.',
    });
    setSubName('');
    setSubDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Banner */}
      <div className="bg-black text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-zinc-800 shadow-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-white text-xs font-bold border border-zinc-700">
            <ShieldAlert className="w-3.5 h-3.5 text-white" />
            <span>Zim Tutor Governance & Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Platform Administration Panel
          </h1>
          <p className="text-xs text-zinc-400">
            Logged in as <strong className="text-white">{currentUser.fullName}</strong> ({currentUser.email})
          </p>
        </div>

        <button
          onClick={resetToDefaults}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold text-xs rounded-xl transition"
        >
          Reset Demo Database
        </button>
      </div>

      {/* Platform Statistics (Section 13 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Active Teachers
          </span>
          <div className="text-2xl font-black text-black mt-1">
            {allTeachers.length}
          </div>
          <span className="text-[11px] text-black font-semibold">
            {allTeachers.filter((t) => t.verified).length} verified
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Pending Audits
          </span>
          <div className="text-2xl font-black text-black mt-1">
            {pendingVerificationTeachers.length}
          </div>
          <span className="text-[11px] text-zinc-500">Requires credential review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Lesson Bookings
          </span>
          <div className="text-2xl font-black text-black mt-1">
            {lessonRequests.length}
          </div>
          <span className="text-[11px] text-zinc-500">
            {lessonRequests.filter((r) => r.status === 'confirmed').length} confirmed
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Subjects Supported
          </span>
          <div className="text-2xl font-black text-black mt-1">
            {subjects.length}
          </div>
          <span className="text-[11px] text-zinc-500">Expandable catalog</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'verification'
              ? 'bg-black text-white'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
          }`}
        >
          <span>Teacher Verification Queue</span>
          {pendingVerificationTeachers.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] flex items-center justify-center font-black border border-zinc-300">
              {pendingVerificationTeachers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-3.5 py-2 rounded-xl transition ${
            activeTab === 'reviews'
              ? 'bg-black text-white'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
          }`}
        >
          Review Moderation ({reviews.length})
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-3.5 py-2 rounded-xl transition ${
            activeTab === 'subjects'
              ? 'bg-black text-white'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
          }`}
        >
          Manage Subjects ({subjects.length})
        </button>

        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-3.5 py-2 rounded-xl transition ${
            activeTab === 'lessons'
              ? 'bg-black text-white'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
          }`}
        >
          Lesson Requests Audit Log ({lessonRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3.5 py-2 rounded-xl transition ${
            activeTab === 'reports'
              ? 'bg-black text-white'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
          }`}
        >
          Safety Reports ({reports.length})
        </button>
      </div>

      {/* Tab: Teacher Verification Queue */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-black">
              Teacher Qualification Verification Applications
            </h2>
            <span className="text-xs text-zinc-500">
              Rule: Never claim verified without evidence audit
            </span>
          </div>

          {pendingVerificationTeachers.length > 0 ? (
            <div className="space-y-4">
              {pendingVerificationTeachers.map((teacher) => (
                <div
                  key={teacher.userId}
                  className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={teacher.avatarUrl}
                        alt={teacher.fullName}
                        className="w-14 h-14 rounded-2xl object-cover border border-zinc-200"
                      />
                      <div>
                        <h3 className="font-extrabold text-black text-base">
                          {teacher.fullName}
                        </h3>
                        <p className="text-xs text-zinc-500">
                          {teacher.email} • {teacher.town} • {teacher.yearsExperience} yrs experience
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-black bg-zinc-100 px-3 py-1 rounded-full border border-zinc-300 self-start sm:self-auto">
                      Status: {teacher.verificationStatus.toUpperCase()}
                    </span>
                  </div>

                  {/* Submitted Qualifications */}
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                    <div className="text-xs font-bold text-zinc-800">
                      Submitted Academic Credentials:
                    </div>
                    {teacher.qualifications.length > 0 ? (
                      teacher.qualifications.map((q) => (
                        <div
                          key={q.id}
                          className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-zinc-200"
                        >
                          <div>
                            <strong>{q.title}</strong> — {q.institution} ({q.year})
                          </div>
                          <span className="font-mono text-[11px] text-zinc-700 font-medium">
                            Doc: {q.docUrl || 'uploaded-certificate.pdf'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-zinc-400 italic">No certificates attached yet.</p>
                    )}
                  </div>

                  {rejectingTeacherId === teacher.userId ? (
                    <div className="p-3.5 bg-zinc-100 rounded-xl border border-zinc-300 space-y-2 text-xs">
                      <label className="block font-bold text-black">
                        Reason for rejection (feedback to applicant):
                      </label>
                      <input
                        type="text"
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        placeholder="e.g. Please provide a clearer scanned copy of your degree transcript..."
                        className="w-full px-3 py-1.5 text-xs border border-zinc-300 rounded-lg bg-white"
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            adminRejectTeacher(teacher.userId, rejectNote);
                            setRejectingTeacherId(null);
                            setRejectNote('');
                          }}
                          className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition"
                        >
                          Reject Application
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectingTeacherId(null)}
                          className="px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-black font-bold"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                      <button
                        type="button"
                        onClick={() => setRejectingTeacherId(teacher.userId)}
                        className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-700 font-bold text-xs rounded-xl border border-zinc-300 transition"
                      >
                        Reject Verification
                      </button>
                      <button
                        type="button"
                        onClick={() => adminApproveTeacher(teacher.userId)}
                        className="px-5 py-2 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        Approve & Grant Verified Badge
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 bg-white rounded-2xl border border-zinc-200 text-center text-zinc-500 text-xs">
              All teacher applications have been audited. No pending verifications!
            </div>
          )}
        </div>
      )}

      {/* Tab: Reviews Moderation */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-black">Student Reviews Moderation</h2>
            <span className="text-xs text-zinc-500">
              Prevent abusive or fraudulent feedback
            </span>
          </div>

          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <strong>{rev.studentName}</strong> reviewed Teacher ID: <code>{rev.teacherId}</code>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      rev.status === 'published'
                        ? 'bg-black text-white'
                        : rev.status === 'flagged'
                        ? 'bg-zinc-200 text-black border border-zinc-400'
                        : 'bg-zinc-100 text-zinc-500 line-through'
                    }`}
                  >
                    {rev.status}
                  </span>
                </div>

                <div className="text-xs text-black font-bold">
                  Rating: {rev.rating}/5 Stars
                </div>

                <p className="text-xs text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-200 italic">
                  "{rev.feedback}"
                </p>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {rev.status !== 'published' && (
                    <button
                      type="button"
                      onClick={() => adminModerateReview(rev.id, 'published')}
                      className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-lg transition"
                    >
                      Publish
                    </button>
                  )}
                  {rev.status !== 'flagged' && (
                    <button
                      type="button"
                      onClick={() => adminModerateReview(rev.id, 'flagged')}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-black font-bold text-xs rounded-lg border border-zinc-300 transition"
                    >
                      Flag for Audit
                    </button>
                  )}
                  {rev.status !== 'hidden' && (
                    <button
                      type="button"
                      onClick={() => adminModerateReview(rev.id, 'hidden')}
                      className="px-3 py-1.5 bg-white hover:bg-zinc-100 text-zinc-600 font-bold text-xs rounded-lg border border-zinc-300 transition"
                    >
                      Hide from Profile
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Subject Management */}
      {activeTab === 'subjects' && (
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-black text-black">Manage Supported Subjects</h2>
            <p className="text-xs text-zinc-500 mt-1">
              Add new subjects to expand Zim Tutor's catalog for Zimbabwean schools.
            </p>
          </div>

          <form
            onSubmit={handleAddSubjectSubmit}
            className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4"
          >
            <div className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
              Add New Subject
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g. Agriculture, Heritage Studies, Commerce"
                  className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Category</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl bg-white text-black"
                >
                  <option value="Sciences">Sciences</option>
                  <option value="Commercials">Commercials</option>
                  <option value="Languages">Languages</option>
                  <option value="Humanities">Humanities</option>
                  <option value="Technology">Technology</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Description & Topics
              </label>
              <input
                type="text"
                value={subDesc}
                onChange={(e) => setSubDesc(e.target.value)}
                placeholder="e.g. Crop production, soil science, farm business management"
                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl bg-white text-black"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Subject to Marketplace
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {subjects.map((s) => (
              <div
                key={s.id}
                className="p-3.5 bg-white rounded-xl border border-zinc-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-black">{s.name}</span>
                    <span className="text-[10px] font-semibold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md">
                      {s.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-2">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Lessons Log */}
      {activeTab === 'lessons' && (
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-black">Lesson Request Transactions Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider text-[10px] border-b border-zinc-200">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Teacher</th>
                  <th className="py-2.5 px-3">Subject & Level</th>
                  <th className="py-2.5 px-3">Cost (USD)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {lessonRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-zinc-50">
                    <td className="py-2.5 px-3">{req.preferredDate}</td>
                    <td className="py-2.5 px-3 font-bold text-black">{req.studentName}</td>
                    <td className="py-2.5 px-3 text-zinc-700">{req.teacherName}</td>
                    <td className="py-2.5 px-3 text-zinc-700">
                      {req.subject} ({req.educationLevel})
                    </td>
                    <td className="py-2.5 px-3 font-black text-black">
                      ${req.estimatedCost.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-black border border-zinc-200">
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-black">Platform Reports & Safe Environment</h2>
          {reports.map((rep) => (
            <div key={rep.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-black">Reporter: {rep.reporterName}</span>
                <span className="text-[10px] uppercase font-bold text-black bg-zinc-200 px-2 py-0.5 rounded-full">
                  {rep.status}
                </span>
              </div>
              <p className="text-zinc-700">{rep.details}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
