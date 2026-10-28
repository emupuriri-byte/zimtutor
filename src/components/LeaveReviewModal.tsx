import React, { useState } from 'react';
import { LessonRequest } from '../types';
import { useApp } from '../context/AppContext';
import { X, Star, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LeaveReviewModalProps {
  lesson: LessonRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({
  lesson,
  isOpen,
  onClose,
}) => {
  const { addReview } = useApp();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !lesson) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!feedback.trim()) {
      setError('Please provide written feedback about how the lesson went.');
      return;
    }

    const res = addReview(lesson.id, rating, feedback.trim());
    if (!res.success) {
      setError(res.error || 'Failed to submit review.');
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-zinc-300">
        <div className="px-6 py-4 bg-black text-white flex items-center justify-between border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold">Review Your Completed Lesson</h2>
            <p className="text-xs text-zinc-400">
              {lesson.subject} with {lesson.teacherName} — Zim Tutor
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

          {/* Rating stars (Monochrome) */}
          <div className="text-center py-2">
            <label className="block text-xs font-bold text-black mb-2">
              How would you rate {lesson.teacherName}?
            </label>
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 text-black hover:scale-110 transition focus:outline-hidden"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating !== null ? hoverRating >= star : rating >= star)
                        ? 'fill-black text-black'
                        : 'text-zinc-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-bold text-zinc-600 mt-2">
              {rating === 5 && 'Outstanding teacher (5/5)'}
              {rating === 4 && 'Very good lesson (4/5)'}
              {rating === 3 && 'Average (3/5)'}
              {rating === 2 && 'Needs improvement (2/5)'}
              {rating === 1 && 'Unsatisfactory (1/5)'}
            </div>
          </div>

          {/* Written feedback */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">
              Your Written Feedback
            </label>
            <textarea
              rows={4}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe your learning experience, what concepts the teacher helped you understand, and whether you recommend them to other students..."
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black"
            ></textarea>
          </div>

          <div className="p-2.5 bg-zinc-100 rounded-xl text-[11px] text-zinc-700 flex items-start gap-2 border border-zinc-200">
            <ShieldCheck className="w-4 h-4 text-black shrink-0 mt-0.5" />
            <span>
              Reviews are verified and moderated on Zim Tutor. Duplicate reviews for the same lesson are prevented.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-[0.99]"
          >
            Submit Genuine Review
          </button>
        </form>
      </div>
    </div>
  );
};
