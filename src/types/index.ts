export type UserRole = 'student' | 'teacher' | 'admin';

export type EducationLevel = 'O Level' | 'IGCSE' | 'AS Level' | 'A Level (A2)';

export type SchoolForm =
  | 'Form 1'
  | 'Form 2'
  | 'Form 3'
  | 'Form 4'
  | 'Lower Sixth'
  | 'Upper Sixth'
  | 'Other';

export type LessonPreference = 'online' | 'physical' | 'both';

export interface SubjectItem {
  id: string;
  name: string;
  category: 'Sciences' | 'Commercials' | 'Languages' | 'Humanities' | 'Technology';
  iconName: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phoneNumber?: string;
  isEmailVerified: boolean;
  avatarUrl: string;
  createdAt: string;
  isSuspended?: boolean;
}

export interface StudentProfile {
  userId: string;
  primaryLevel: EducationLevel;
  levels: EducationLevel[];
  form: SchoolForm;
  customForm?: string;
  subjects: string[];
  lessonPreference: LessonPreference;
  town?: string;
  maxBudgetUsd: number;
  learningGoals: string[];
  notes?: string;
  savedTeacherIds: string[];
}

export interface TeacherSubject {
  subjectId: string;
  subjectName: string;
  levels: EducationLevel[];
  hourlyRateUsd: number;
  lessonFormat: LessonPreference;
  qualificationNote?: string;
}

export interface TeacherQualification {
  id: string;
  title: string;
  institution: string;
  year: number;
  verified: boolean;
  docUrl?: string;
}

export interface AvailabilitySlot {
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // "14:00"
  endTime: string;   // "18:00"
}

export interface TeacherProfile {
  userId: string;
  fullName: string;
  avatarUrl: string;
  email: string;
  phoneNumber?: string;
  town: string;
  headline: string;
  bio: string;
  subjects: TeacherSubject[];
  educationLevels: EducationLevel[];
  forms: SchoolForm[];
  yearsExperience: number;
  qualifications: TeacherQualification[];
  preferredMethods: string[];
  offersOnline: boolean;
  offersPhysical: boolean;
  hourlyRateUsd: number;
  availability: AvailabilitySlot[];
  languages: string[];
  verified: boolean;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
  rating: number;
  totalReviews: number;
  completedLessonsCount: number;
}

export type LessonStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'rescheduled'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

export interface LessonRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  subject: string;
  educationLevel: EducationLevel;
  form: SchoolForm;
  preferredDate: string; // YYYY-MM-DD
  startTime: string;     // HH:mm
  durationHours: number;
  lessonFormat: 'online' | 'physical';
  studentTown?: string;
  learningGoals: string[];
  studentMessage?: string;
  hourlyRate: number;
  estimatedCost: number;
  status: LessonStatus;
  suggestedDate?: string;
  suggestedTime?: string;
  teacherNote?: string;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  lessonId: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  rating: number; // 1-5
  feedback: string;
  createdAt: string;
  status: 'published' | 'flagged' | 'hidden';
}

export interface TransactionalEmail {
  id: string;
  toEmail: string;
  toName: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
  timestamp: string;
  type:
    | 'lesson_request'
    | 'request_accepted'
    | 'request_declined'
    | 'reschedule_proposed'
    | 'lesson_confirmed'
    | 'lesson_cancelled'
    | 'review_received';
  isRead: boolean;
}

export interface PlatformReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetId: string;
  targetType: 'user' | 'review';
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}
