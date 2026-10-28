import {
  AvailabilitySlot,
  EducationLevel,
  LessonPreference,
  LessonRequest,
  Review,
  SchoolForm,
  TeacherProfile,
} from '../types';

/**
 * Calculates estimated lesson cost according to Zim Tutor formula:
 * Estimated cost = Teacher's hourly rate × Lesson duration in hours
 */
export function calculateLessonCost(hourlyRate: number, durationHours: number): number {
  if (hourlyRate < 0 || durationHours <= 0) return 0;
  return Math.round(hourlyRate * durationHours * 100) / 100;
}

/**
 * Parses time string (e.g. "14:30") into minutes since midnight
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, mins] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (mins || 0);
}

/**
 * Converts minutes since midnight back into "HH:mm"
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Returns day of week for a given date string (YYYY-MM-DD)
 */
export function getDayOfWeekFromDate(dateStr: string): AvailabilitySlot['dayOfWeek'] {
  const days: AvailabilitySlot['dayOfWeek'][] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  // Parse with UTC or local date parts to prevent timezone drift
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return days[date.getDay()];
}

/**
 * Checks if a requested lesson overlaps with any existing confirmed or active bookings
 */
export function checkDoubleBooking(
  existingBookings: LessonRequest[],
  teacherId: string,
  date: string,
  startTime: string,
  durationHours: number,
  ignoreRequestId?: string
): boolean {
  const reqStart = timeToMinutes(startTime);
  const reqEnd = reqStart + Math.round(durationHours * 60);

  const activeStatuses = ['confirmed', 'accepted'];

  return existingBookings.some((booking) => {
    if (booking.teacherId !== teacherId) return false;
    if (ignoreRequestId && booking.id === ignoreRequestId) return false;
    if (!activeStatuses.includes(booking.status)) return false;
    if (booking.preferredDate !== date) return false;

    const bStart = timeToMinutes(booking.startTime);
    const bEnd = bStart + Math.round(booking.durationHours * 60);

    // Overlap condition: startA < endB && endA > startB
    return reqStart < bEnd && reqEnd > bStart;
  });
}

/**
 * Checks if the requested lesson fits within the teacher's configured weekly availability
 */
export function isWithinTeacherAvailability(
  availabilitySlots: AvailabilitySlot[],
  date: string,
  startTime: string,
  durationHours: number
): boolean {
  if (!availabilitySlots || availabilitySlots.length === 0) {
    return true; // No strict restrictions configured
  }

  const dayOfWeek = getDayOfWeekFromDate(date);
  const reqStart = timeToMinutes(startTime);
  const reqEnd = reqStart + Math.round(durationHours * 60);

  const matchingSlots = availabilitySlots.filter((slot) => slot.dayOfWeek === dayOfWeek);
  if (matchingSlots.length === 0) return false;

  return matchingSlots.some((slot) => {
    const slotStart = timeToMinutes(slot.startTime);
    const slotEnd = timeToMinutes(slot.endTime);
    return reqStart >= slotStart && reqEnd <= slotEnd;
  });
}

export interface TeacherFilterCriteria {
  subject?: string;
  educationLevel?: EducationLevel | '';
  form?: SchoolForm | '';
  maxPrice?: number;
  lessonFormat?: LessonPreference | 'all';
  town?: string;
  minExperience?: number;
  verifiedOnly?: boolean;
  minRating?: number;
  searchQuery?: string;
}

/**
 * Filters teacher profiles based on student criteria
 */
export function filterTeachers(
  teachers: TeacherProfile[],
  filters: TeacherFilterCriteria
): TeacherProfile[] {
  return teachers.filter((teacher) => {
    // Subject filter
    if (filters.subject) {
      const teachesSubject = teacher.subjects.some(
        (s) => s.subjectName.toLowerCase() === filters.subject!.toLowerCase()
      );
      if (!teachesSubject) return false;
    }

    // Education Level
    if (filters.educationLevel) {
      const teachesLevel = teacher.educationLevels.includes(filters.educationLevel);
      if (!teachesLevel) return false;
    }

    // Form
    if (filters.form) {
      if (teacher.forms && teacher.forms.length > 0 && !teacher.forms.includes(filters.form)) {
        return false;
      }
    }

    // Max hourly price
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      if (teacher.hourlyRateUsd > filters.maxPrice) {
        return false;
      }
    }

    // Lesson format: online vs physical
    if (filters.lessonFormat && filters.lessonFormat !== 'all') {
      if (filters.lessonFormat === 'online' && !teacher.offersOnline) return false;
      if (filters.lessonFormat === 'physical' && !teacher.offersPhysical) return false;
    }

    // Town
    if (filters.town && filters.town.trim() !== '') {
      const normalizedTown = filters.town.trim().toLowerCase();
      if (!teacher.town.toLowerCase().includes(normalizedTown)) return false;
    }

    // Experience
    if (filters.minExperience !== undefined && filters.minExperience > 0) {
      if (teacher.yearsExperience < filters.minExperience) return false;
    }

    // Verification status
    if (filters.verifiedOnly) {
      if (!teacher.verified) return false;
    }

    // Minimum rating
    if (filters.minRating !== undefined && filters.minRating > 0) {
      if (teacher.rating < filters.minRating) return false;
    }

    // General text search query (name, headline, bio, subjects, town)
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      const matchName = teacher.fullName.toLowerCase().includes(q);
      const matchHeadline = teacher.headline.toLowerCase().includes(q);
      const matchTown = teacher.town.toLowerCase().includes(q);
      const matchSubjects = teacher.subjects.some((s) => s.subjectName.toLowerCase().includes(q));
      if (!matchName && !matchHeadline && !matchTown && !matchSubjects) {
        return false;
      }
    }

    return true;
  });
}

export type TeacherSortOption = 'price_asc' | 'rating_desc' | 'experience_desc' | 'soonest';

/**
 * Sorts teachers according to requested order
 */
export function sortTeachers(
  teachers: TeacherProfile[],
  sortBy: TeacherSortOption
): TeacherProfile[] {
  const list = [...teachers];
  switch (sortBy) {
    case 'price_asc':
      return list.sort((a, b) => a.hourlyRateUsd - b.hourlyRateUsd);
    case 'rating_desc':
      return list.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.totalReviews - a.totalReviews;
      });
    case 'experience_desc':
      return list.sort((a, b) => b.yearsExperience - a.yearsExperience);
    case 'soonest':
      // Tutors with more availability slots take precedence
      return list.sort((a, b) => b.availability.length - a.availability.length);
    default:
      return list;
  }
}

/**
 * Validates whether a student can leave a review for a specific lesson
 */
export function canReviewLesson(
  lesson: LessonRequest,
  studentId: string,
  existingReviews: Review[]
): { allowed: boolean; reason?: string } {
  if (lesson.studentId !== studentId) {
    return { allowed: false, reason: 'You can only review lessons you booked.' };
  }
  if (lesson.status !== 'completed') {
    return {
      allowed: false,
      reason: 'Reviews can only be submitted after a lesson is marked as completed.',
    };
  }
  const alreadyReviewed = existingReviews.some((r) => r.lessonId === lesson.id);
  if (alreadyReviewed) {
    return { allowed: false, reason: 'You have already reviewed this completed lesson.' };
  }
  return { allowed: true };
}

/**
 * Recalculates average rating and review count from published reviews
 */
export function calculateTeacherRating(reviews: Review[]): {
  averageRating: number;
  totalReviews: number;
} {
  const published = reviews.filter((r) => r.status === 'published');
  if (published.length === 0) {
    return { averageRating: 0, totalReviews: 0 };
  }
  const sum = published.reduce((acc, r) => acc + r.rating, 0);
  const avg = Math.round((sum / published.length) * 10) / 10;
  return {
    averageRating: avg,
    totalReviews: published.length,
  };
}

/**
 * Formats a clean date string (YYYY-MM-DD) into human-readable format
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
