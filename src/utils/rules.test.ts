import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLessonCost,
  checkDoubleBooking,
  isWithinTeacherAvailability,
  filterTeachers,
  sortTeachers,
  canReviewLesson,
  calculateTeacherRating,
} from './rules';
import { LessonRequest, Review, TeacherProfile } from '../types';

test('calculateLessonCost handles standard rates and durations', () => {
  // Test prompt example: Teacher charges $8/hr for a 2-hour lesson = $16
  assert.equal(calculateLessonCost(8, 2), 16);
  // Fractional hours: 1.5 hours at $10/hr = $15
  assert.equal(calculateLessonCost(10, 1.5), 15);
  // Zero duration or negative
  assert.equal(calculateLessonCost(15, 0), 0);
  assert.equal(calculateLessonCost(-5, 2), 0);
});

test('checkDoubleBooking detects overlapping lessons for the same teacher and date', () => {
  const existingBookings: LessonRequest[] = [
    {
      id: 'req-1',
      studentId: 'stud-1',
      studentName: 'Chipo Moyo',
      studentEmail: 'chipo@example.com',
      teacherId: 'teach-1',
      teacherName: 'Mr. Tendai Mutasa',
      teacherEmail: 'tendai@example.com',
      subject: 'Mathematics',
      educationLevel: 'O Level',
      form: 'Form 4',
      preferredDate: '2026-11-02',
      startTime: '14:00',
      durationHours: 2, // 14:00 - 16:00
      lessonFormat: 'online',
      learningGoals: ['Pass Zimsec with A'],
      hourlyRate: 10,
      estimatedCost: 20,
      status: 'confirmed',
      createdAt: '2026-10-20',
      updatedAt: '2026-10-20',
    },
  ];

  // Exactly overlapping (14:30 - 15:30)
  const isOverlapping = checkDoubleBooking(
    existingBookings,
    'teach-1',
    '2026-11-02',
    '14:30',
    1
  );
  assert.equal(isOverlapping, true);

  // Partial overlap at start (13:30 - 14:30)
  assert.equal(
    checkDoubleBooking(existingBookings, 'teach-1', '2026-11-02', '13:30', 1),
    true
  );

  // Directly adjacent after (16:00 - 17:00) should NOT overlap
  assert.equal(
    checkDoubleBooking(existingBookings, 'teach-1', '2026-11-02', '16:00', 1),
    false
  );

  // Different date (2026-11-03) should NOT overlap
  assert.equal(
    checkDoubleBooking(existingBookings, 'teach-1', '2026-11-03', '14:00', 2),
    false
  );

  // Different teacher should NOT overlap
  assert.equal(
    checkDoubleBooking(existingBookings, 'teach-2', '2026-11-02', '14:00', 2),
    false
  );
});

test('isWithinTeacherAvailability verifies day of week and slot bounds', () => {
  // Monday 2026-11-02
  const availability = [
    { dayOfWeek: 'Monday' as const, startTime: '13:00', endTime: '18:00' },
  ];

  // Inside slot: 14:00 to 16:00
  assert.equal(isWithinTeacherAvailability(availability, '2026-11-02', '14:00', 2), true);

  // Outside slot: 17:00 for 2 hours (finishes at 19:00 > 18:00)
  assert.equal(isWithinTeacherAvailability(availability, '2026-11-02', '17:00', 2), false);

  // Tuesday 2026-11-03 (teacher has no slots on Tuesday)
  assert.equal(isWithinTeacherAvailability(availability, '2026-11-03', '14:00', 2), false);
});

test('filterTeachers filters by subject, price, and verification accurately', () => {
  const sampleTeachers: TeacherProfile[] = [
    {
      userId: 't1',
      fullName: 'Blessing Sibanda',
      avatarUrl: '',
      email: 'blessing@zim.co.zw',
      town: 'Harare',
      headline: 'A Level Physics Specialist',
      bio: 'Experienced educator',
      subjects: [
        {
          subjectId: 'physics',
          subjectName: 'Physics',
          levels: ['A Level (A2)'],
          hourlyRateUsd: 12,
          lessonFormat: 'online',
        },
      ],
      educationLevels: ['A Level (A2)'],
      forms: ['Lower Sixth', 'Upper Sixth'],
      yearsExperience: 8,
      qualifications: [],
      preferredMethods: ['Interactive experiments'],
      offersOnline: true,
      offersPhysical: false,
      hourlyRateUsd: 12,
      availability: [],
      languages: ['English', 'Shona'],
      verified: true,
      verificationStatus: 'verified',
      rating: 4.9,
      totalReviews: 14,
      completedLessonsCount: 30,
    },
    {
      userId: 't2',
      fullName: 'Tafadzwa Ncube',
      avatarUrl: '',
      email: 'tafadzwa@zim.co.zw',
      town: 'Bulawayo',
      headline: 'O Level & IGCSE Mathematics',
      bio: 'Patience & structured practice',
      subjects: [
        {
          subjectId: 'maths',
          subjectName: 'Mathematics',
          levels: ['O Level', 'IGCSE'],
          hourlyRateUsd: 8,
          lessonFormat: 'both',
        },
      ],
      educationLevels: ['O Level', 'IGCSE'],
      forms: ['Form 3', 'Form 4'],
      yearsExperience: 4,
      qualifications: [],
      preferredMethods: ['Past papers'],
      offersOnline: true,
      offersPhysical: true,
      hourlyRateUsd: 8,
      availability: [],
      languages: ['English', 'Ndebele'],
      verified: false,
      verificationStatus: 'pending',
      rating: 4.5,
      totalReviews: 6,
      completedLessonsCount: 10,
    },
  ];

  // Filter for Mathematics
  const mathTeachers = filterTeachers(sampleTeachers, { subject: 'Mathematics' });
  assert.equal(mathTeachers.length, 1);
  assert.equal(mathTeachers[0].fullName, 'Tafadzwa Ncube');

  // Filter for verified only
  const verifiedOnly = filterTeachers(sampleTeachers, { verifiedOnly: true });
  assert.equal(verifiedOnly.length, 1);
  assert.equal(verifiedOnly[0].fullName, 'Blessing Sibanda');

  // Filter max price <= $10
  const budgetTeachers = filterTeachers(sampleTeachers, { maxPrice: 10 });
  assert.equal(budgetTeachers.length, 1);
  assert.equal(budgetTeachers[0].hourlyRateUsd, 8);
});

test('canReviewLesson ensures only completed lessons can be reviewed once', () => {
  const lesson: LessonRequest = {
    id: 'les-99',
    studentId: 'student-abc',
    studentName: 'Farai',
    studentEmail: 'farai@test.com',
    teacherId: 'teacher-xyz',
    teacherName: 'Mrs. Dube',
    teacherEmail: 'dube@test.com',
    subject: 'Chemistry',
    educationLevel: 'O Level',
    form: 'Form 4',
    preferredDate: '2026-10-15',
    startTime: '10:00',
    durationHours: 1,
    lessonFormat: 'online',
    learningGoals: ['Exam prep'],
    hourlyRate: 10,
    estimatedCost: 10,
    status: 'pending',
    createdAt: '2026-10-10',
    updatedAt: '2026-10-10',
  };

  const reviews: Review[] = [];

  // Cannot review pending lesson
  const pendingCheck = canReviewLesson(lesson, 'student-abc', reviews);
  assert.equal(pendingCheck.allowed, false);

  // Once marked completed
  lesson.status = 'completed';
  const completedCheck = canReviewLesson(lesson, 'student-abc', reviews);
  assert.equal(completedCheck.allowed, true);

  // Different student cannot review
  const impostorCheck = canReviewLesson(lesson, 'student-other', reviews);
  assert.equal(impostorCheck.allowed, false);

  // Cannot review twice
  reviews.push({
    id: 'rev-1',
    lessonId: 'les-99',
    teacherId: 'teacher-xyz',
    studentId: 'student-abc',
    studentName: 'Farai',
    rating: 5,
    feedback: 'Excellent explanation of organic chemistry.',
    createdAt: '2026-10-16',
    status: 'published',
  });
  const duplicateCheck = canReviewLesson(lesson, 'student-abc', reviews);
  assert.equal(duplicateCheck.allowed, false);
});

test('calculateTeacherRating calculates average from published reviews', () => {
  const reviews: Review[] = [
    {
      id: 'r1',
      lessonId: 'l1',
      teacherId: 't1',
      studentId: 's1',
      studentName: 'Sipho',
      rating: 5,
      feedback: 'Great!',
      createdAt: '',
      status: 'published',
    },
    {
      id: 'r2',
      lessonId: 'l2',
      teacherId: 't1',
      studentId: 's2',
      studentName: 'Rudo',
      rating: 4,
      feedback: 'Very helpful.',
      createdAt: '',
      status: 'published',
    },
    {
      id: 'r3',
      lessonId: 'l3',
      teacherId: 't1',
      studentId: 's3',
      studentName: 'Tariro',
      rating: 1,
      feedback: 'Spam review',
      createdAt: '',
      status: 'hidden', // Flagged/hidden by admin moderation
    },
  ];

  const ratingSummary = calculateTeacherRating(reviews);
  // (5 + 4) / 2 = 4.5
  assert.equal(ratingSummary.averageRating, 4.5);
  assert.equal(ratingSummary.totalReviews, 2);
});
