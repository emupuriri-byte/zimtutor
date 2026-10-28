import React, { useState } from 'react';
import { LessonRequest } from '../types';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, MessageSquare, AlertCircle } from 'lucide-react';

interface TeacherRescheduleModalProps {
  lesson: LessonRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherRescheduleModal: React.FC<TeacherRescheduleModalProps> = ({
  lesson,
  isOpen,
  onClose,
}) => {
  const { suggestAlternateTime } = useApp();
  const [proposedDate, setProposedDate] = useState<string>(
    lesson?.preferredDate || '2026-11-05'
  );
  const [proposedTime, setProposedTime] = useState<string>(
    lesson?.startTime || '16:00'
  );
  const [note, setNote] = useState<string>(
    'I have a timetable conflict at that time, but I am free at this proposed time. Please let me know if this works!'
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !lesson) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!proposedDate || !proposedTime) {
      setError('Please provide both a new proposed date and time.');
      return;
    }

    suggestAlternateTime(lesson.id, proposedDate, proposedTime, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-zinc-300">
        <div className="px-6 py-4 bg-black text-white flex items-center justify-between border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold">Propose Alternative Time</h2>
            <p className="text-xs text-zinc-400">
              For {lesson.studentName} • {lesson.subject} — Zim Tutor
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-zinc-100 border border-zinc-400 rounded-xl text-black text-xs flex items-start gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-black" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-700">
            <div>
              <strong>Original Requested Time:</strong> {lesson.preferredDate} at {lesson.startTime}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-black mb-1">New Date</label>
              <input
                type="date"
                required
                value={proposedDate}
                onChange={(e) => setProposedDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">New Start Time</label>
              <input
                type="time"
                required
                value={proposedTime}
                onChange={(e) => setProposedTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">
              Note to Student explaining change
            </label>
            <textarea
              rows={3}
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black"
            ></textarea>
          </div>

          <div className="text-[11px] text-zinc-500">
            An email notification will be immediately dispatched to {lesson.studentName} with this alternative time.
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-[0.99]"
          >
            Send Alternative Time Proposal
          </button>
        </form>
      </div>
    </div>
  );
};
