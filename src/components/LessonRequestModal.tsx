import React, { useState } from 'react';
import { TeacherProfile, EducationLevel, SchoolForm } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Laptop,
  Users,
  Send,
  Info,
} from 'lucide-react';
import { calculateLessonCost } from '../utils/rules';

interface LessonRequestModalProps {
  teacher: TeacherProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LessonRequestModal: React.FC<LessonRequestModalProps> = ({
  teacher,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createLessonRequest, studentProfile, currentUser } = useApp();

  const [subject, setSubject] = useState<string>(
    teacher?.subjects[0]?.subjectName || 'Mathematics'
  );
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    studentProfile?.primaryLevel || 'O Level'
  );
  const [form, setForm] = useState<SchoolForm>(studentProfile?.form || 'Form 4');
  const [preferredDate, setPreferredDate] = useState<string>('2026-11-04');
  const [startTime, setStartTime] = useState<string>('14:00');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [lessonFormat, setLessonFormat] = useState<'online' | 'physical'>('online');
  const [studentTown, setStudentTown] = useState<string>(studentProfile?.town || 'Harare');
  const [learningGoals, setLearningGoals] = useState<string[]>(
    studentProfile?.learningGoals || ['Prepare for examinations', 'Understand difficult topics']
  );
  const [studentMessage, setStudentMessage] = useState<string>(
    'I would appreciate assistance with past papers and difficult exam questions.'
  );

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !teacher) return null;

  // Rate based on selected subject
  const subMatch = teacher.subjects.find(
    (s) => s.subjectName.toLowerCase() === subject.toLowerCase()
  );
  const hourlyRate = subMatch ? subMatch.hourlyRateUsd : teacher.hourlyRateUsd;
  const estimatedCost = calculateLessonCost(hourlyRate, durationHours);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!preferredDate) {
      setError('Please select a lesson date.');
      setSubmitting(false);
      return;
    }

    if (!startTime) {
      setError('Please choose a start time.');
      setSubmitting(false);
      return;
    }

    const res = createLessonRequest({
      teacherId: teacher.userId,
      subject,
      educationLevel,
      form,
      preferredDate,
      startTime,
      durationHours,
      lessonFormat,
      studentTown: lessonFormat === 'physical' ? studentTown : undefined,
      learningGoals,
      studentMessage,
    });

    setSubmitting(false);

    if (!res.success) {
      setError(res.error || 'Failed to submit lesson request.');
      return;
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-zinc-300 my-8 flex flex-col">
        {/* Header (Black & White) */}
        <div className="px-6 py-4 bg-black text-white flex items-center justify-between shrink-0 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold">Request a Lesson with {teacher.fullName}</h2>
            <p className="text-xs text-zinc-400">
              Submit request • Teacher reviews & confirms • Direct payment on Zim Tutor
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          {error && (
            <div className="p-3 bg-zinc-100 border border-zinc-400 rounded-xl text-black text-xs flex items-start gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-black" />
              <span>{error}</span>
            </div>
          )}

          {/* Subject and Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-black mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-black"
              >
                {teacher.subjects.map((s) => (
                  <option key={s.subjectId} value={s.subjectName}>
                    {s.subjectName} (${s.hourlyRateUsd}/hr)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-black"
              >
                {teacher.educationLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form / Year */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">Form / Year</label>
            <select
              value={form}
              onChange={(e) => setForm(e.target.value as SchoolForm)}
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-black"
            >
              {['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Lower Sixth', 'Upper Sixth', 'Other'].map(
                (f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Lesson Format */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">Lesson Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLessonFormat('online')}
                disabled={!teacher.offersOnline}
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold transition ${
                  lessonFormat === 'online'
                    ? 'border-black bg-zinc-100 text-black ring-2 ring-black/20'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                } ${!teacher.offersOnline ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <Laptop className="w-4 h-4 text-black shrink-0" />
                <div className="text-left">
                  <div>Online Video</div>
                  <div className="text-[10px] font-normal text-zinc-500">Google Meet</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLessonFormat('physical')}
                disabled={!teacher.offersPhysical}
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold transition ${
                  lessonFormat === 'physical'
                    ? 'border-black bg-zinc-100 text-black ring-2 ring-black/20'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                } ${!teacher.offersPhysical ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <Users className="w-4 h-4 text-black shrink-0" />
                <div className="text-left">
                  <div>Face-to-Face</div>
                  <div className="text-[10px] font-normal text-zinc-500">In {teacher.town}</div>
                </div>
              </button>
            </div>
          </div>

          {lessonFormat === 'physical' && (
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                Preferred Area / Suburb in {teacher.town}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={studentTown}
                  onChange={(e) => setStudentTown(e.target.value)}
                  placeholder="e.g. Mount Pleasant library, Avondale, or home"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          )}

          {/* Date, Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-black mb-1">Date</label>
              <input
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Duration</label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-black"
              >
                <option value={1}>1 hour</option>
                <option value={1.5}>1.5 hours</option>
                <option value={2}>2 hours</option>
                <option value={3}>3 hours</option>
              </select>
            </div>
          </div>

          {/* Additional Message */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">
              Message to Teacher (topics needing help, exam board)
            </label>
            <textarea
              rows={2}
              value={studentMessage}
              onChange={(e) => setStudentMessage(e.target.value)}
              placeholder="e.g. Preparing for Zimsec exams, need help with specific theorems..."
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black"
            ></textarea>
          </div>

          {/* Price Calculation Box (Monochrome) */}
          <div className="p-4 bg-zinc-50 border border-zinc-300 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-600">
              <span>Teacher Hourly Rate:</span>
              <span className="font-bold text-black">${hourlyRate.toFixed(2)} USD / hr</span>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-600">
              <span>Duration:</span>
              <span className="font-bold text-black">{durationHours} hr</span>
            </div>
            <div className="pt-2 border-t border-zinc-200 flex items-center justify-between">
              <div>
                <span className="text-sm font-black text-black">Estimated Total Cost:</span>
                <div className="text-[11px] text-zinc-500 font-medium">
                  Rate (${hourlyRate}) × Duration ({durationHours} hrs)
                </div>
              </div>
              <div className="text-xl font-black text-black">
                ${estimatedCost.toFixed(2)} USD
              </div>
            </div>
          </div>

          {/* Important business rules notice */}
          <div className="p-3 bg-zinc-100 border border-zinc-300 rounded-xl text-xs text-black flex items-start gap-2">
            <Info className="w-4 h-4 text-black shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Notice:</strong> Submitting a request does <strong>not</strong> mean the lesson is confirmed. The teacher will accept, decline, or propose an alternative time. Teachers and students arrange lesson payments directly.
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-black hover:bg-zinc-800 text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Submit Lesson Request (${estimatedCost.toFixed(2)} USD)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
