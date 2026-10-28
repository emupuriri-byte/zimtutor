import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  StudentProfile,
  TeacherProfile,
  SubjectItem,
  LessonRequest,
  Review,
  TransactionalEmail,
  PlatformReport,
  UserRole,
  EducationLevel,
  SchoolForm,
  LessonPreference,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_TEACHERS,
  INITIAL_SUBJECTS,
  INITIAL_LESSON_REQUESTS,
  INITIAL_REVIEWS,
} from '../data/initialData';
import {
  calculateLessonCost,
  checkDoubleBooking,
  calculateTeacherRating,
  canReviewLesson,
} from '../utils/rules';

interface RegisterData {
  fullName: string;
  email: string;
  role: 'student' | 'teacher';
  phoneNumber?: string;
  password?: string;
}

interface AppContextType {
  currentUser: User | null;
  studentProfile: StudentProfile | null;
  teacherProfile: TeacherProfile | null;
  allTeachers: TeacherProfile[];
  subjects: SubjectItem[];
  lessonRequests: LessonRequest[];
  reviews: Review[];
  emails: TransactionalEmail[];
  reports: PlatformReport[];
  unreadEmailCount: number;

  // Auth & Roles
  login: (email: string) => { success: boolean; message?: string };
  register: (data: RegisterData) => { success: boolean; message?: string };
  logout: () => void;
  switchPersona: (role: UserRole, userId?: string) => void;
  verifyCurrentEmail: () => void;

  // Student Profile Actions
  updateStudentProfile: (data: Partial<StudentProfile>) => void;
  toggleSaveTeacher: (teacherId: string) => void;

  // Teacher Profile Actions
  updateTeacherProfile: (data: Partial<TeacherProfile>) => void;

  // Lesson Requests & Bookings
  createLessonRequest: (params: {
    teacherId: string;
    subject: string;
    educationLevel: EducationLevel;
    form: SchoolForm;
    preferredDate: string;
    startTime: string;
    durationHours: number;
    lessonFormat: 'online' | 'physical';
    studentTown?: string;
    learningGoals: string[];
    studentMessage?: string;
  }) => { success: boolean; error?: string; request?: LessonRequest };

  acceptRequest: (requestId: string) => void;
  declineRequest: (requestId: string, reason?: string) => void;
  suggestAlternateTime: (requestId: string, date: string, time: string, note?: string) => void;
  studentAcceptRescheduled: (requestId: string) => void;
  studentRejectRescheduled: (requestId: string) => void;
  cancelRequest: (requestId: string, reason?: string) => void;
  markLessonCompleted: (requestId: string) => void;

  // Reviews
  addReview: (
    lessonId: string,
    rating: number,
    feedback: string
  ) => { success: boolean; error?: string };

  // Email / Notifications
  markEmailAsRead: (emailId: string) => void;
  markAllEmailsAsRead: () => void;
  clearEmails: () => void;

  // Admin Actions
  adminApproveTeacher: (teacherId: string) => void;
  adminRejectTeacher: (teacherId: string, reason: string) => void;
  adminModerateReview: (reviewId: string, status: 'published' | 'flagged' | 'hidden') => void;
  adminAddSubject: (subject: Omit<SubjectItem, 'id'>) => void;
  adminToggleUserSuspension: (userId: string) => void;

  // Reset
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'zim_learning_users_v1',
  TEACHERS: 'zim_learning_teachers_v1',
  STUDENT_PROFILE: 'zim_learning_student_profile_v1',
  SUBJECTS: 'zim_learning_subjects_v1',
  REQUESTS: 'zim_learning_requests_v1',
  REVIEWS: 'zim_learning_reviews_v1',
  EMAILS: 'zim_learning_emails_v1',
  CURRENT_USER_ID: 'zim_learning_current_uid_v1',
};

const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  userId: 'user-stud-1',
  primaryLevel: 'O Level',
  levels: ['O Level'],
  form: 'Form 4',
  subjects: ['Mathematics', 'Biology', 'English Language', 'Computer Science'],
  lessonPreference: 'both',
  town: 'Harare (Mount Pleasant)',
  maxBudgetUsd: 15,
  learningGoals: ['Understand difficult topics', 'Prepare for examinations', 'Achieve an A or A*'],
  notes: 'Preparing for Zimsec and Cambridge O Level sitting in November.',
  savedTeacherIds: ['user-teach-1', 'user-teach-2'],
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or fallback
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      return saved || 'user-stud-1'; // Default to sample student
    } catch {
      return 'user-stud-1';
    }
  });

  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_STUDENT_PROFILE;
    } catch {
      return DEFAULT_STUDENT_PROFILE;
    }
  });

  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [lessonRequests, setLessonRequests] = useState<LessonRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_LESSON_REQUESTS;
    } catch {
      return INITIAL_LESSON_REQUESTS;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [emails, setEmails] = useState<TransactionalEmail[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMAILS);
      if (saved) return JSON.parse(saved);
      // Pre-seed an initial email for realism
      return [
        {
          id: 'email-init-1',
          toEmail: 'tendai.mutasa@zimtutor.co.zw',
          toName: 'Mr. Tendai Mutasa',
          subject: 'New Lesson Request — Zim Tutor',
          timestamp: new Date().toISOString(),
          type: 'lesson_request',
          isRead: false,
          bodyText: `Hello Mr. Tendai Mutasa,

You have received a new lesson request through Zim Tutor.

Student: Tawanda Gumbo
Subject: Mathematics
Education Level: O Level
Form: Form 4
Lesson Format: Online
Requested Date: 2026-11-04
Requested Time: 14:00
Duration: 2 hours
Your Hourly Rate: $10.00
Estimated Lesson Cost: $20.00

Student's Learning Goals:
- Understand difficult topics
- Prepare for examinations
- Achieve an A or A*

Additional Message:
I am preparing for Zimsec November exams and struggling with quadratic equations and circle geometry theorems.

Please log in to your Zim Tutor dashboard to accept, decline, or suggest another time.

Thank you for teaching with Zim Tutor.

Your Future Starts With the Right Teacher.`,
          bodyHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #18181b; background-color: #fafafa; padding: 20px;">
  <div style="max-width: 580px; margin: 0 auto; background: white; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <div style="background-color: #000000; padding: 20px 24px; color: white;">
      <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">ZIM TUTOR</h2>
      <p style="margin: 4px 0 0; font-size: 12px; color: #a1a1aa;">Your Future Starts With the Right Teacher.</p>
    </div>
    <div style="padding: 24px;">
      <h3 style="margin-top: 0; color: #09090b; font-size: 18px; font-weight: 700;">New Lesson Request</h3>
      <p style="color: #3f3f46;">Hello <strong>Mr. Tendai Mutasa</strong>,</p>
      <p style="color: #3f3f46;">You have received a new lesson request through Zim Tutor.</p>
      <div style="background-color: #f4f4f5; padding: 16px; border-left: 4px solid #000000; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 4px 0; font-size: 13px;"><strong>Student:</strong> Tawanda Gumbo</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Subject:</strong> Mathematics</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Education Level:</strong> O Level (Form 4)</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Lesson Format:</strong> Online</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Requested Date & Time:</strong> 2026-11-04 at 14:00 (2 hours)</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Your Hourly Rate:</strong> $10.00/hr</p>
        <p style="margin: 8px 0 0; font-size: 16px; color: #000000; font-weight: 800;">Estimated Lesson Cost: $20.00 USD</p>
      </div>
      <p style="font-size: 13px; color: #3f3f46;"><strong>Student's Learning Goals:</strong> Understand difficult topics, Prepare for examinations, Achieve an A or A*</p>
      <p style="font-size: 13px; color: #3f3f46;"><strong>Student's Note:</strong> "I am preparing for Zimsec November exams and struggling with quadratic equations and circle geometry theorems."</p>
      <p style="margin-top: 24px; font-size: 13px; color: #71717a;">Please log in to your Zim Tutor dashboard to review and respond.</p>
    </div>
  </div>
</div>`,
        },
      ];
    } catch {
      return [];
    }
  });

  const [reports] = useState<PlatformReport[]>([
    {
      id: 'rep-1',
      reporterId: 'user-stud-2',
      reporterName: 'Rufaro Moyo',
      targetId: 'user-teach-4',
      targetType: 'user',
      reason: 'Unverified credentials query',
      details: 'Please expedite certificate review for Mr. Shumba.',
      status: 'pending',
      createdAt: '2026-10-24T10:00:00Z',
    },
  ]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(lessonRequests));
  }, [lessonRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(emails));
  }, [emails]);

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const teacherProfile =
    currentUser?.role === 'teacher'
      ? teachers.find((t) => t.userId === currentUser.id) || null
      : null;

  const unreadEmailCount = emails.filter((e) => !e.isRead).length;

  // Helper to send transactional email (Server-side simulation matching prompt template)
  const sendEmail = (params: {
    toEmail: string;
    toName: string;
    subject: string;
    bodyText: string;
    bodyHtml: string;
    type: TransactionalEmail['type'];
  }) => {
    const newEmail: TransactionalEmail = {
      id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      toEmail: params.toEmail,
      toName: params.toName,
      subject: params.subject,
      bodyText: params.bodyText,
      bodyHtml: params.bodyHtml,
      timestamp: new Date().toISOString(),
      type: params.type,
      isRead: false,
    };
    setEmails((prev) => [newEmail, ...prev]);
  };

  // Auth functions
  const login = (email: string) => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: 'Account not found with this email. Please check or register.' };
    }
    if (user.isSuspended) {
      return { success: false, message: 'This account has been suspended by administration.' };
    }
    setCurrentUserId(user.id);
    return { success: true };
  };

  const register = (data: RegisterData) => {
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUserId = `user-${data.role}-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      phoneNumber: data.phoneNumber || '',
      isEmailVerified: true, // Mark verified for clean onboarding UX
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        data.fullName
      )}`,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUserId);

    if (data.role === 'teacher') {
      const newTeacherProfile: TeacherProfile = {
        userId: newUserId,
        fullName: data.fullName,
        avatarUrl: newUser.avatarUrl,
        email: data.email,
        phoneNumber: data.phoneNumber,
        town: 'Harare',
        headline: 'Passionate Educator on Zim Tutor',
        bio: 'Welcome! I am setting up my subjects, qualifications, and lesson availability.',
        subjects: [
          {
            subjectId: 'mathematics',
            subjectName: 'Mathematics',
            levels: ['O Level', 'IGCSE'],
            hourlyRateUsd: 8,
            lessonFormat: 'both',
          },
        ],
        educationLevels: ['O Level', 'IGCSE'],
        forms: ['Form 3', 'Form 4'],
        yearsExperience: 2,
        qualifications: [],
        preferredMethods: ['Concept walkthroughs', 'Past paper practice'],
        offersOnline: true,
        offersPhysical: true,
        hourlyRateUsd: 8,
        availability: [
          { dayOfWeek: 'Monday', startTime: '14:00', endTime: '18:00' },
          { dayOfWeek: 'Wednesday', startTime: '14:00', endTime: '18:00' },
          { dayOfWeek: 'Saturday', startTime: '10:00', endTime: '14:00' },
        ],
        languages: ['English', 'Shona'],
        verified: false,
        verificationStatus: 'unverified',
        rating: 0,
        totalReviews: 0,
        completedLessonsCount: 0,
      };
      setTeachers((prev) => [...prev, newTeacherProfile]);
    } else {
      // Student profile
      setStudentProfile((prev) => ({
        ...prev,
        userId: newUserId,
      }));
    }

    return { success: true };
  };

  const logout = () => {
    setCurrentUserId('');
  };

  const switchPersona = (role: UserRole, targetId?: string) => {
    if (targetId) {
      setCurrentUserId(targetId);
      return;
    }
    if (role === 'admin') {
      setCurrentUserId('user-admin-1');
    } else if (role === 'teacher') {
      setCurrentUserId('user-teach-1');
    } else {
      setCurrentUserId('user-stud-1');
    }
  };

  const verifyCurrentEmail = () => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, isEmailVerified: true } : u))
    );
  };

  const updateStudentProfile = (data: Partial<StudentProfile>) => {
    setStudentProfile((prev) => ({ ...prev, ...data }));
  };

  const toggleSaveTeacher = (teacherId: string) => {
    setStudentProfile((prev) => {
      const exists = prev.savedTeacherIds.includes(teacherId);
      const updated = exists
        ? prev.savedTeacherIds.filter((id) => id !== teacherId)
        : [...prev.savedTeacherIds, teacherId];
      return { ...prev, savedTeacherIds: updated };
    });
  };

  const updateTeacherProfile = (data: Partial<TeacherProfile>) => {
    if (!teacherProfile) return;
    setTeachers((prev) =>
      prev.map((t) => (t.userId === teacherProfile.userId ? { ...t, ...data } : t))
    );
  };

  // Lesson Booking flow
  const createLessonRequest = (params: {
    teacherId: string;
    subject: string;
    educationLevel: EducationLevel;
    form: SchoolForm;
    preferredDate: string;
    startTime: string;
    durationHours: number;
    lessonFormat: 'online' | 'physical';
    studentTown?: string;
    learningGoals: string[];
    studentMessage?: string;
  }) => {
    const targetTeacher = teachers.find((t) => t.userId === params.teacherId);
    if (!targetTeacher) {
      return { success: false, error: 'Teacher profile not found.' };
    }

    // Double-booking check
    const isDoubleBooked = checkDoubleBooking(
      lessonRequests,
      params.teacherId,
      params.preferredDate,
      params.startTime,
      params.durationHours
    );

    if (isDoubleBooked) {
      return {
        success: false,
        error:
          'The teacher already has a confirmed lesson booked at this exact time. Please select another slot.',
      };
    }

    // Determine hourly rate
    const subMatch = targetTeacher.subjects.find(
      (s) => s.subjectName.toLowerCase() === params.subject.toLowerCase()
    );
    const hourlyRate = subMatch ? subMatch.hourlyRateUsd : targetTeacher.hourlyRateUsd;
    const estimatedCost = calculateLessonCost(hourlyRate, params.durationHours);

    const sName = currentUser?.fullName || 'Tawanda Gumbo';
    const sEmail = currentUser?.email || 'tawanda.gumbo@student.zw';

    const newRequest: LessonRequest = {
      id: `req-${Date.now()}`,
      studentId: currentUser?.id || 'user-stud-1',
      studentName: sName,
      studentEmail: sEmail,
      teacherId: targetTeacher.userId,
      teacherName: targetTeacher.fullName,
      teacherEmail: targetTeacher.email,
      subject: params.subject,
      educationLevel: params.educationLevel,
      form: params.form,
      preferredDate: params.preferredDate,
      startTime: params.startTime,
      durationHours: params.durationHours,
      lessonFormat: params.lessonFormat,
      studentTown: params.studentTown,
      learningGoals: params.learningGoals,
      studentMessage: params.studentMessage,
      hourlyRate,
      estimatedCost,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLessonRequests((prev) => [newRequest, ...prev]);

    // Send Section 9 Email to Teacher
    const teacherEmailBody = `Subject: New Lesson Request — Zim Tutor

Hello ${targetTeacher.fullName},

You have received a new lesson request through Zim Tutor.

Student: ${sName}
Subject: ${params.subject}
Education Level: ${params.educationLevel}
Form: ${params.form}
Lesson Format: ${params.lessonFormat === 'online' ? 'Online' : 'Physical'}
Requested Date: ${params.preferredDate}
Requested Time: ${params.startTime}
Duration: ${params.durationHours} ${params.durationHours === 1 ? 'hour' : 'hours'}
Your Hourly Rate: $${hourlyRate.toFixed(2)}
Estimated Lesson Cost: $${estimatedCost.toFixed(2)}

Student's Learning Goals:
${params.learningGoals.map((g) => `- ${g}`).join('\n')}

Additional Message:
${params.studentMessage || 'None provided.'}

Please log in to your Zim Tutor dashboard to accept, decline, or suggest another time.

Thank you for teaching with Zim Tutor.

Your Future Starts With the Right Teacher.`;

    const teacherEmailHtml = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #18181b; background-color: #fafafa; padding: 20px;">
  <div style="max-width: 580px; margin: 0 auto; background: white; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden;">
    <div style="background-color: #000000; padding: 20px 24px; color: white;">
      <h2 style="margin: 0; font-size: 20px; font-weight: 800;">ZIM TUTOR</h2>
      <p style="margin: 4px 0 0; font-size: 12px; color: #a1a1aa;">Your Future Starts With the Right Teacher.</p>
    </div>
    <div style="padding: 24px;">
      <h3 style="margin-top: 0; color: #09090b; font-size: 18px;">New Lesson Request</h3>
      <p>Hello <strong>${targetTeacher.fullName}</strong>,</p>
      <p>You have received a new lesson request through Zim Tutor.</p>
      <div style="background-color: #f4f4f5; padding: 16px; border-left: 4px solid #000000; margin: 16px 0; border-radius: 6px;">
        <p style="margin: 4px 0; font-size: 13px;"><strong>Student:</strong> ${sName}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Subject:</strong> ${params.subject}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Education Level:</strong> ${params.educationLevel} (${params.form})</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Lesson Format:</strong> ${params.lessonFormat === 'online' ? 'Online' : 'Physical'}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Requested Date & Time:</strong> ${params.preferredDate} at ${params.startTime} (${params.durationHours} hr)</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Your Hourly Rate:</strong> $${hourlyRate.toFixed(2)}/hr</p>
        <p style="margin: 8px 0 0; font-size: 16px; color: #000000; font-weight: 800;">Estimated Lesson Cost: $${estimatedCost.toFixed(2)} USD</p>
      </div>
      <p style="font-size: 13px;"><strong>Student's Learning Goals:</strong> ${params.learningGoals.join(', ')}</p>
      ${params.studentMessage ? `<p style="font-size: 13px;"><strong>Message:</strong> "${params.studentMessage}"</p>` : ''}
      <p style="margin-top: 24px; font-size: 13px; color: #71717a;">Please log in to your Zim Tutor dashboard to review and respond.</p>
    </div>
  </div>
</div>`;

    sendEmail({
      toEmail: targetTeacher.email,
      toName: targetTeacher.fullName,
      subject: `New Lesson Request — Zim Tutor (${params.subject})`,
      bodyText: teacherEmailBody,
      bodyHtml: teacherEmailHtml,
      type: 'lesson_request',
    });

    // Send Confirmation Email to Student (Section 9 Requirement)
    const studentEmailBody = `Subject: Lesson Request Submitted — Zim Tutor

Hello ${sName},

Your lesson request has been submitted to ${targetTeacher.fullName}.

Details:
Subject: ${params.subject}
Teacher: ${targetTeacher.fullName}
Date: ${params.preferredDate} at ${params.startTime}
Duration: ${params.durationHours} hour(s)
Estimated Total: $${estimatedCost.toFixed(2)}

Please note: Submitting a request does not mean the lesson is confirmed. You will receive an update once the teacher reviews your request. Teachers and students arrange lesson payments directly.

Thank you for choosing Zim Tutor.
Your Future Starts With the Right Teacher.`;

    const studentEmailHtml = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #18181b; background-color: #fafafa; padding: 20px;">
  <div style="max-width: 580px; margin: 0 auto; background: white; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden;">
    <div style="background-color: #000000; padding: 20px 24px; color: white;">
      <h2 style="margin: 0; font-size: 20px; font-weight: 800;">ZIM TUTOR</h2>
      <p style="margin: 4px 0 0; font-size: 12px; color: #a1a1aa;">Your Future Starts With the Right Teacher.</p>
    </div>
    <div style="padding: 24px;">
      <h3 style="margin-top: 0; color: #09090b; font-size: 18px;">Lesson Request Submitted</h3>
      <p>Hello <strong>${sName}</strong>,</p>
      <p>Your lesson request has been sent to <strong>${targetTeacher.fullName}</strong>.</p>
      <div style="background-color: #f4f4f5; padding: 16px; border-left: 4px solid #000000; margin: 16px 0; border-radius: 6px;">
        <p style="margin: 4px 0; font-size: 13px;"><strong>Teacher:</strong> ${targetTeacher.fullName}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Subject:</strong> ${params.subject}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Date:</strong> ${params.preferredDate} at ${params.startTime} (${params.durationHours} hr)</p>
        <p style="margin: 8px 0 0; font-size: 16px; color: #000000; font-weight: 800;">Estimated Total: $${estimatedCost.toFixed(2)} USD</p>
      </div>
      <p style="font-size: 12px; color: #71717a;">Notice: Submitting a request does not mean the lesson is confirmed. The teacher will accept or propose an alternative time shortly. Teachers and students arrange lesson payments directly.</p>
    </div>
  </div>
</div>`;

    sendEmail({
      toEmail: sEmail,
      toName: sName,
      subject: `Lesson Request Submitted to ${targetTeacher.fullName} — Zim Tutor`,
      bodyText: studentEmailBody,
      bodyHtml: studentEmailHtml,
      type: 'lesson_request',
    });

    return { success: true, request: newRequest };
  };

  const acceptRequest = (requestId: string) => {
    setLessonRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const meetingLink =
          req.lessonFormat === 'online'
            ? `https://meet.google.com/zim-${req.subject.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(
                1000 + Math.random() * 9000
              )}`
            : undefined;

        // Send confirmation email to student
        sendEmail({
          toEmail: req.studentEmail,
          toName: req.studentName,
          subject: `Lesson Confirmed! ${req.teacherName} accepted your request — Zim Tutor`,
          bodyText: `Hello ${req.studentName},\n\nGreat news! ${req.teacherName} has accepted your lesson request for ${req.subject} on ${req.preferredDate} at ${req.startTime}.\n\nFormat: ${req.lessonFormat === 'online' ? `Online (Google Meet link: ${meetingLink})` : `Physical lesson in ${req.studentTown || 'agreed area'}`}\nEstimated cost: $${req.estimatedCost.toFixed(2)} USD.\n\nYour Future Starts With the Right Teacher.`,
          bodyHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #18181b; background-color: #fafafa; padding: 20px;">
            <div style="max-width: 580px; margin: 0 auto; background: white; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #000000; padding: 20px 24px; color: white;">
                <h2 style="margin: 0; font-size: 20px; font-weight: 800;">ZIM TUTOR</h2>
              </div>
              <div style="padding: 24px;">
                <h3 style="color: #09090b; margin-top: 0;">Lesson Confirmed!</h3>
                <p>Hello <strong>${req.studentName}</strong>,</p>
                <p><strong>${req.teacherName}</strong> has confirmed your lesson request.</p>
                <div style="background-color: #f4f4f5; padding: 16px; border: 1px solid #e4e4e7; border-radius: 6px; margin: 16px 0;">
                  <p style="margin: 4px 0;"><strong>Subject:</strong> ${req.subject}</p>
                  <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${req.preferredDate} at ${req.startTime} (${req.durationHours} hr)</p>
                  ${meetingLink ? `<p style="margin: 4px 0;"><strong>Join Link:</strong> <a href="${meetingLink}" style="color: #000000; font-weight: bold;">${meetingLink}</a></p>` : ''}
                  <p style="margin: 4px 0;"><strong>Estimated Total:</strong> $${req.estimatedCost.toFixed(2)} USD</p>
                </div>
              </div>
            </div>
          </div>`,
          type: 'lesson_confirmed',
        });

        return {
          ...req,
          status: 'confirmed',
          meetingLink,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const declineRequest = (requestId: string, reason?: string) => {
    setLessonRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        sendEmail({
          toEmail: req.studentEmail,
          toName: req.studentName,
          subject: `Lesson Request Update — Zim Tutor`,
          bodyText: `Hello ${req.studentName},\n\nUnfortunately, ${req.teacherName} was unable to accept your lesson request for ${req.subject} on ${req.preferredDate} at ${req.startTime}.\nReason: ${reason || 'Schedule conflict'}.\n\nPlease feel free to search for other qualified tutors on Zim Tutor.`,
          bodyHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #18181b; background-color: #fafafa; padding: 20px;">
            <div style="max-width: 580px; margin: 0 auto; background: white; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #000000; padding: 20px 24px; color: white;">
                <h2 style="margin: 0; font-size: 20px; font-weight: 800;">ZIM TUTOR</h2>
              </div>
              <div style="padding: 24px;">
                <h3 style="color: #09090b; margin-top: 0;">Lesson Request Declined</h3>
                <p>Hello <strong>${req.studentName}</strong>,</p>
                <p>Unfortunately, <strong>${req.teacherName}</strong> is unavailable for the requested slot on ${req.preferredDate} at ${req.startTime}.</p>
                ${reason ? `<p><strong>Note from teacher:</strong> ${reason}</p>` : ''}
                <p>You can search for other top-rated teachers on Zim Tutor anytime.</p>
              </div>
            </div>
          </div>`,
          type: 'request_declined',
        });
        return {
          ...req,
          status: 'declined',
          teacherNote: reason,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const suggestAlternateTime = (
    requestId: string,
    date: string,
    time: string,
    note?: string
  ) => {
    setLessonRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        sendEmail({
          toEmail: req.studentEmail,
          toName: req.studentName,
          subject: `Alternative Time Proposed by ${req.teacherName} — Zim Tutor`,
          bodyText: `Hello ${req.studentName},\n\n${req.teacherName} has suggested an alternative time for your ${req.subject} lesson:\nProposed Date: ${date}\nProposed Time: ${time}\nNote: ${note || 'Better fits my schedule'}.\n\nPlease log in to accept or decline this new time.`,
          bodyHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #18181b; background-color: #fafafa; padding: 20px;">
            <div style="max-width: 580px; margin: 0 auto; background: white; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #000000; padding: 20px 24px; color: white;">
                <h2 style="margin: 0; font-size: 20px; font-weight: 800;">ZIM TUTOR</h2>
              </div>
              <div style="padding: 24px;">
                <h3 style="color: #09090b; margin-top: 0;">Alternative Lesson Time Proposed</h3>
                <p>Hello <strong>${req.studentName}</strong>,</p>
                <p><strong>${req.teacherName}</strong> cannot make the original time, but proposed:</p>
                <div style="background-color: #f4f4f5; padding: 16px; border: 1px solid #e4e4e7; border-radius: 6px; margin: 16px 0;">
                  <p style="margin: 4px 0;"><strong>New Date:</strong> ${date}</p>
                  <p style="margin: 4px 0;"><strong>New Time:</strong> ${time}</p>
                  ${note ? `<p style="margin: 4px 0;"><strong>Message:</strong> "${note}"</p>` : ''}
                </div>
                <p>Please log in to your student dashboard to accept or decline.</p>
              </div>
            </div>
          </div>`,
          type: 'reschedule_proposed',
        });
        return {
          ...req,
          status: 'rescheduled',
          suggestedDate: date,
          suggestedTime: time,
          teacherNote: note,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const studentAcceptRescheduled = (requestId: string) => {
    setLessonRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const finalDate = req.suggestedDate || req.preferredDate;
        const finalTime = req.suggestedTime || req.startTime;
        const meetingLink =
          req.lessonFormat === 'online'
            ? `https://meet.google.com/zim-${req.subject.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(
                1000 + Math.random() * 9000
              )}`
            : undefined;

        sendEmail({
          toEmail: req.teacherEmail,
          toName: req.teacherName,
          subject: `Rescheduled Lesson Accepted by ${req.studentName} — Zim Tutor`,
          bodyText: `Hello ${req.teacherName},\n\n${req.studentName} has accepted your proposed time: ${finalDate} at ${finalTime} for ${req.subject}.\nThe lesson is now confirmed on both your calendars.`,
          bodyHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #18181b; background-color: #fafafa; padding: 20px;">
            <div style="max-width: 580px; margin: 0 auto; background: white; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #000000; padding: 20px 24px; color: white;">
                <h2 style="margin: 0; font-size: 20px; font-weight: 800;">ZIM TUTOR</h2>
              </div>
              <div style="padding: 24px;">
                <h3 style="color: #09090b; margin-top: 0;">Rescheduled Time Accepted!</h3>
                <p>Hello <strong>${req.teacherName}</strong>,</p>
                <p><strong>${req.studentName}</strong> accepted your proposed time of <strong>${finalDate} at ${finalTime}</strong>.</p>
              </div>
            </div>
          </div>`,
          type: 'lesson_confirmed',
        });

        return {
          ...req,
          preferredDate: finalDate,
          startTime: finalTime,
          status: 'confirmed',
          meetingLink,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const studentRejectRescheduled = (requestId: string) => {
    setLessonRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'cancelled' } : req))
    );
  };

  const cancelRequest = (requestId: string, reason?: string) => {
    setLessonRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        // Notify the counterpart
        const targetEmail =
          currentUser?.id === req.studentId ? req.teacherEmail : req.studentEmail;
        const targetName =
          currentUser?.id === req.studentId ? req.teacherName : req.studentName;

        sendEmail({
          toEmail: targetEmail,
          toName: targetName,
          subject: `Lesson Cancelled — Zim Tutor`,
          bodyText: `Hello ${targetName},\n\nThe lesson for ${req.subject} scheduled for ${req.preferredDate} at ${req.startTime} has been cancelled.\nReason: ${reason || 'Cancelled by user'}.`,
          bodyHtml: `<p>The lesson for <strong>${req.subject}</strong> on ${req.preferredDate} was cancelled.</p>`,
          type: 'lesson_cancelled',
        });

        return {
          ...req,
          status: 'cancelled',
          teacherNote: reason,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const markLessonCompleted = (requestId: string) => {
    setLessonRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          status: 'completed',
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Reviews
  const addReview = (lessonId: string, rating: number, feedback: string) => {
    const lesson = lessonRequests.find((l) => l.id === lessonId);
    if (!lesson) {
      return { success: false, error: 'Lesson not found.' };
    }

    const check = canReviewLesson(lesson, currentUser?.id || 'user-stud-1', reviews);
    if (!check.allowed) {
      return { success: false, error: check.reason };
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      lessonId,
      teacherId: lesson.teacherId,
      studentId: currentUser?.id || 'user-stud-1',
      studentName: currentUser?.fullName || 'Tawanda Gumbo',
      rating,
      feedback,
      createdAt: new Date().toISOString(),
      status: 'published',
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Update teacher rating
    const teacherReviews = updatedReviews.filter((r) => r.teacherId === lesson.teacherId);
    const { averageRating, totalReviews } = calculateTeacherRating(teacherReviews);

    setTeachers((prev) =>
      prev.map((t) =>
        t.userId === lesson.teacherId
          ? {
              ...t,
              rating: averageRating,
              totalReviews,
              completedLessonsCount: t.completedLessonsCount + 1,
            }
          : t
      )
    );

    // Send email to teacher about review
    sendEmail({
      toEmail: lesson.teacherEmail,
      toName: lesson.teacherName,
      subject: `New Student Review Received (${rating} Stars) — Zim Tutor`,
      bodyText: `Hello ${lesson.teacherName},\n\n${currentUser?.fullName || 'A student'} left a ${rating}-star review for your ${lesson.subject} lesson:\n\n"${feedback}"\n\nThank you for teaching with Zim Tutor!`,
      bodyHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #18181b; background-color: #fafafa; padding: 20px;">
        <div style="max-width: 580px; margin: 0 auto; background: white; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #000000; padding: 20px 24px; color: white;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 800;">ZIM TUTOR</h2>
          </div>
          <div style="padding: 24px;">
            <p>You received a new <strong>${rating}-star review</strong> from <strong>${currentUser?.fullName || 'a student'}</strong>:</p>
            <blockquote style="margin: 16px 0; padding: 12px 16px; background: #f4f4f5; border-left: 4px solid #000000; font-style: italic;">
              "${feedback}"
            </blockquote>
          </div>
        </div>
      </div>`,
      type: 'review_received',
    });

    return { success: true };
  };

  // Email notifications
  const markEmailAsRead = (emailId: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, isRead: true } : e))
    );
  };

  const markAllEmailsAsRead = () => {
    setEmails((prev) => prev.map((e) => ({ ...e, isRead: true })));
  };

  const clearEmails = () => {
    setEmails([]);
  };

  // Admin Actions
  const adminApproveTeacher = (teacherId: string) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.userId !== teacherId) return t;
        const updatedQuals = t.qualifications.map((q) => ({ ...q, verified: true }));
        return {
          ...t,
          verified: true,
          verificationStatus: 'verified',
          verificationNotes: 'Approved by Zim Tutor Administrator.',
          qualifications: updatedQuals,
        };
      })
    );
  };

  const adminRejectTeacher = (teacherId: string, reason: string) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.userId !== teacherId) return t;
        return {
          ...t,
          verified: false,
          verificationStatus: 'rejected',
          verificationNotes: reason || 'Application rejected by Administrator.',
        };
      })
    );
  };

  const adminModerateReview = (
    reviewId: string,
    status: 'published' | 'flagged' | 'hidden'
  ) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    );
  };

  const adminAddSubject = (newSubject: Omit<SubjectItem, 'id'>) => {
    const id = newSubject.name.toLowerCase().replace(/\s+/g, '-');
    setSubjects((prev) => [...prev, { ...newSubject, id }]);
  };

  const adminToggleUserSuspension = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isSuspended: !u.isSuspended } : u))
    );
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.TEACHERS);
    localStorage.removeItem(STORAGE_KEYS.STUDENT_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.EMAILS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);

    setUsers(INITIAL_USERS);
    setTeachers(INITIAL_TEACHERS);
    setSubjects(INITIAL_SUBJECTS);
    setLessonRequests(INITIAL_LESSON_REQUESTS);
    setReviews(INITIAL_REVIEWS);
    setStudentProfile(DEFAULT_STUDENT_PROFILE);
    setCurrentUserId('user-stud-1');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        studentProfile,
        teacherProfile,
        allTeachers: teachers,
        subjects,
        lessonRequests,
        reviews,
        emails,
        reports,
        unreadEmailCount,
        login,
        register,
        logout,
        switchPersona,
        verifyCurrentEmail,
        updateStudentProfile,
        toggleSaveTeacher,
        updateTeacherProfile,
        createLessonRequest,
        acceptRequest,
        declineRequest,
        suggestAlternateTime,
        studentAcceptRescheduled,
        studentRejectRescheduled,
        cancelRequest,
        markLessonCompleted,
        addReview,
        markEmailAsRead,
        markAllEmailsAsRead,
        clearEmails,
        adminApproveTeacher,
        adminRejectTeacher,
        adminModerateReview,
        adminAddSubject,
        adminToggleUserSuspension,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
