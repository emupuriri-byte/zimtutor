import React from 'react';
import { TeacherProfile } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  BadgeCheck,
  Star,
  Clock,
  MapPin,
  Laptop,
  Users,
  GraduationCap,
  Calendar,
  Languages,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  DollarSign,
  Send,
} from 'lucide-react';

interface TeacherProfileModalProps {
  teacher: TeacherProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestLesson: (teacher: TeacherProfile) => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  teacher,
  isOpen,
  onClose,
  onRequestLesson,
}) => {
  const { reviews } = useApp();

  if (!isOpen || !teacher) return null;

  const teacherReviews = reviews.filter(
    (r) => r.teacherId === teacher.userId && r.status === 'published'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-zinc-300 my-8 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-black text-white flex items-center justify-between shrink-0 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
            <GraduationCap className="w-4 h-4" />
            <span>Teacher Profile & Dossier — Zim Tutor</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Hero teacher overview */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-zinc-50 rounded-2xl border border-zinc-300">
            <div className="relative shrink-0">
              <img
                src={teacher.avatarUrl}
                alt={teacher.fullName}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md"
              />
              {teacher.verified && (
                <span className="absolute -bottom-1 -right-1 bg-black text-white p-1 rounded-full shadow-xs border border-white">
                  <BadgeCheck className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-black">{teacher.fullName}</h2>
                {teacher.verified ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-black px-2.5 py-0.5 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" /> Qualifications Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-black bg-zinc-200 px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3.5 h-3.5" /> Identity / Degree Pending Admin Review
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-zinc-700 mt-1">{teacher.headline}</p>

              <div className="flex items-center gap-3 text-xs text-zinc-600 mt-2 flex-wrap">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-black" />
                  <span>{teacher.town}</span>
                </span>
                <span>•</span>
                <span>{teacher.yearsExperience} years teaching experience</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-black font-bold">
                  <Star className="w-3.5 h-3.5 fill-black text-black" />
                  <span>{teacher.rating > 0 ? teacher.rating.toFixed(1) : 'New'}</span>
                  <span className="font-normal text-zinc-500">
                    ({teacher.totalReviews} reviews)
                  </span>
                </span>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Starting from</div>
              <div className="text-2xl font-black text-black">${teacher.hourlyRateUsd}</div>
              <div className="text-[11px] text-zinc-500 font-bold">USD per hour</div>
            </div>
          </div>

          {/* Biography */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
              About the Educator
            </h3>
            <p className="text-sm text-zinc-800 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              {teacher.bio}
            </p>
          </div>

          {/* Subjects & Rates Grid */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2.5">
              Subjects Taught & Curriculum Rates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teacher.subjects.map((sub) => (
                <div
                  key={sub.subjectId}
                  className="p-4 rounded-xl border border-zinc-300 bg-white flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-black text-sm">
                        {sub.subjectName}
                      </span>
                      <span className="font-black text-black text-sm">
                        ${sub.hourlyRateUsd}/hr
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {sub.levels.map((lvl) => (
                        <span
                          key={lvl}
                          className="text-[10px] font-bold px-2 py-0.5 bg-zinc-100 text-black border border-zinc-200 rounded-md"
                        >
                          {lvl}
                        </span>
                      ))}
                    </div>

                    {sub.qualificationNote && (
                      <p className="text-[11px] text-zinc-500 mt-2 italic">
                        "{sub.qualificationNote}"
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                    <span>Format:</span>
                    <span className="font-bold text-black capitalize">
                      {sub.lessonFormat === 'both' ? 'Online & Physical' : sub.lessonFormat}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Qualifications */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2.5">
              Academic Qualifications & Accreditations
            </h3>
            {teacher.qualifications.length > 0 ? (
              <div className="space-y-2">
                {teacher.qualifications.map((q) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl border border-zinc-300 bg-white flex items-center justify-between"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 text-black flex items-center justify-center shrink-0 mt-0.5 border border-zinc-300">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-black">{q.title}</div>
                        <div className="text-[11px] text-zinc-500">
                          {q.institution} • {q.year}
                        </div>
                      </div>
                    </div>

                    {q.verified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-white bg-black px-2.5 py-1 rounded-full border border-black">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Document
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-300">
                        Verification Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">No credentials uploaded yet.</p>
            )}
          </div>

          {/* Weekly Availability & Teaching Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
                Weekly Available Days & Times
              </h3>
              <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-300 space-y-2">
                {teacher.availability.length > 0 ? (
                  teacher.availability.map((slot, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs py-1 border-b border-zinc-200 last:border-none"
                    >
                      <span className="font-bold text-black">{slot.dayOfWeek}</span>
                      <span className="text-zinc-700 font-mono font-semibold">
                        {slot.startTime} – {slot.endTime}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500">Contact tutor for flexible times.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
                Languages Spoken & Methods
              </h3>
              <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-300 space-y-3">
                <div>
                  <div className="text-[11px] font-bold text-zinc-500 mb-1 flex items-center gap-1">
                    <Languages className="w-3.5 h-3.5 text-black" /> Languages:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {teacher.languages.map((lang) => (
                      <span
                        key={lang}
                        className="text-xs font-bold px-2 py-0.5 bg-white border border-zinc-300 rounded-md text-black"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-zinc-500 mb-1">
                    Preferred Teaching Methods:
                  </div>
                  <ul className="text-xs text-zinc-700 list-disc list-inside space-y-0.5">
                    {teacher.preferredMethods.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Student Reviews */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Verified Student Reviews ({teacherReviews.length})
              </h3>
              <div className="text-xs text-zinc-600 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>Only students with completed lessons can review</span>
              </div>
            </div>

            {teacherReviews.length > 0 ? (
              <div className="space-y-3">
                {teacherReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-black">{rev.studentName}</span>
                      <div className="flex items-center text-black text-xs font-bold">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'fill-black text-black'
                                : 'text-zinc-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-700 leading-relaxed italic">
                      "{rev.feedback}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 text-center bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-500">
                No reviews published yet for this teacher.
              </div>
            )}
          </div>

          {/* Privacy and Direct Payment Disclaimer */}
          <div className="p-3.5 bg-zinc-100 border border-zinc-300 rounded-xl text-xs text-black flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-black shrink-0 mt-0.5" />
            <div>
              <strong>Privacy & Payments:</strong> For safety, direct email addresses and phone numbers are hidden until lessons are confirmed. Teachers and students arrange lesson payments directly.
            </div>
          </div>
        </div>

        {/* Footer with Lesson Request Button */}
        <div className="p-4 sm:p-6 bg-zinc-50 border-t border-zinc-300 flex items-center justify-between shrink-0">
          <div>
            <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Selected Tutor</div>
            <div className="text-sm font-black text-black">{teacher.fullName}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-black transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onRequestLesson(teacher);
              }}
              className="px-6 py-2.5 bg-black hover:bg-zinc-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5" /> Request a Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
