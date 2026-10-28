import React from 'react';
import { TeacherProfile } from '../types';
import { useApp } from '../context/AppContext';
import {
  BadgeCheck,
  Star,
  Clock,
  MapPin,
  Laptop,
  Users,
  Bookmark,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface TeacherCardProps {
  teacher: TeacherProfile;
  onViewProfile: (teacher: TeacherProfile) => void;
  onRequestLesson: (teacher: TeacherProfile) => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  onViewProfile,
  onRequestLesson,
}) => {
  const { studentProfile, toggleSaveTeacher } = useApp();

  const isSaved = studentProfile?.savedTeacherIds.includes(teacher.userId) || false;

  return (
    <div className="bg-white rounded-2xl border border-zinc-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Top Header Card Info */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={teacher.avatarUrl}
                alt={teacher.fullName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-zinc-900 shadow-xs"
              />
              {teacher.verified ? (
                <span
                  title="Verified Tutor: Qualifications and National ID reviewed"
                  className="absolute -bottom-1 -right-1 bg-black text-white rounded-full p-0.5 shadow-xs border border-white"
                >
                  <BadgeCheck className="w-4 h-4" />
                </span>
              ) : (
                <span
                  title="Verification in progress"
                  className="absolute -bottom-1 -right-1 bg-zinc-600 text-white rounded-full p-0.5 shadow-xs border border-white"
                >
                  <Clock className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-black text-black text-base group-hover:underline transition">
                  {teacher.fullName}
                </h3>
                {teacher.verified ? (
                  <span className="text-[10px] font-black uppercase tracking-wider text-white bg-black px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                    <BadgeCheck className="w-3 h-3 text-white" /> Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-zinc-700 bg-zinc-100 border border-zinc-300 px-2 py-0.5 rounded-full">
                    Review Pending
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-600 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="truncate max-w-[160px]">{teacher.town}</span>
                </span>
                <span>•</span>
                <span>{teacher.yearsExperience} yrs exp</span>
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={() => toggleSaveTeacher(teacher.userId)}
            className={`p-2 rounded-xl transition ${
              isSaved
                ? 'text-black bg-zinc-200 hover:bg-zinc-300'
                : 'text-zinc-400 hover:text-black hover:bg-zinc-100'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save teacher'}
            aria-label="Save teacher"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Headline */}
        <p className="text-xs font-semibold text-zinc-700 line-clamp-2 leading-relaxed mb-3">
          {teacher.headline}
        </p>

        {/* Subjects Pills (Monochrome) */}
        <div className="mb-3">
          <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
            Subjects Taught
          </div>
          <div className="flex flex-wrap gap-1.5">
            {teacher.subjects.map((s) => (
              <span
                key={s.subjectId}
                className="text-xs font-bold px-2.5 py-1 bg-zinc-100 text-black border border-zinc-300 rounded-lg"
              >
                {s.subjectName}
              </span>
            ))}
          </div>
        </div>

        {/* Education Levels */}
        <div className="mb-3">
          <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
            Curriculum & Levels
          </div>
          <div className="flex flex-wrap gap-1">
            {teacher.educationLevels.map((lvl) => (
              <span
                key={lvl}
                className="text-[11px] font-medium px-2 py-0.5 bg-zinc-100 text-zinc-800 rounded-md border border-zinc-200"
              >
                {lvl}
              </span>
            ))}
          </div>
        </div>

        {/* Availability summary */}
        <div className="mt-auto pt-2 text-xs text-zinc-600 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="truncate">
            Available: {teacher.availability.map((a) => a.dayOfWeek.slice(0, 3)).join(', ')}
          </span>
        </div>
      </div>

      {/* Card Footer with Price, Rating and Actions */}
      <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Hourly Rate</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-black">
                ${teacher.hourlyRateUsd}
              </span>
              <span className="text-xs font-bold text-zinc-600">USD/hr</span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-black font-black text-sm">
              <Star className="w-4 h-4 fill-black text-black" />
              <span>{teacher.rating > 0 ? teacher.rating.toFixed(1) : 'New'}</span>
            </div>
            <div className="text-[11px] text-zinc-500 font-medium">
              {teacher.totalReviews > 0
                ? `${teacher.totalReviews} ${teacher.totalReviews === 1 ? 'review' : 'reviews'}`
                : 'No reviews yet'}
            </div>
          </div>
        </div>

        {/* Lesson format indicators */}
        <div className="flex items-center gap-2 text-[11px] text-black font-bold">
          {teacher.offersOnline && (
            <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-zinc-300">
              <Laptop className="w-3 h-3 text-black" /> Online
            </span>
          )}
          {teacher.offersPhysical && (
            <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-zinc-300">
              <Users className="w-3 h-3 text-black" /> Physical
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onViewProfile(teacher)}
            className="py-2 px-3 text-xs font-bold text-black bg-white hover:bg-zinc-100 border border-zinc-300 rounded-xl transition text-center shadow-2xs"
          >
            View Profile
          </button>
          <button
            type="button"
            onClick={() => onRequestLesson(teacher)}
            className="py-2 px-3 text-xs font-black text-white bg-black hover:bg-zinc-800 rounded-xl transition text-center shadow-xs active:scale-[0.98]"
          >
            Request Lesson
          </button>
        </div>
      </div>
    </div>
  );
};
