import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TeacherProfile, EducationLevel, SchoolForm, LessonPreference } from '../types';
import { TeacherCard } from '../components/TeacherCard';
import { filterTeachers, sortTeachers, TeacherSortOption } from '../utils/rules';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  MapPin,
  DollarSign,
  Star,
  CheckCircle2,
  Users,
  Laptop,
} from 'lucide-react';

interface FindTeacherPageProps {
  initialSubject?: string;
  onViewTeacher: (teacher: TeacherProfile) => void;
  onRequestLesson: (teacher: TeacherProfile) => void;
}

export const FindTeacherPage: React.FC<FindTeacherPageProps> = ({
  initialSubject = '',
  onViewTeacher,
  onRequestLesson,
}) => {
  const { allTeachers, subjects, studentProfile } = useApp();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
  const [educationLevel, setEducationLevel] = useState<EducationLevel | ''>('');
  const [form, setForm] = useState<SchoolForm | ''>('');
  const [maxPrice, setMaxPrice] = useState<number>(30);
  const [lessonFormat, setLessonFormat] = useState<LessonPreference | 'all'>('all');
  const [town, setTown] = useState<string>('');
  const [minExperience, setMinExperience] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);

  // Sorting
  const [sortBy, setSortBy] = useState<TeacherSortOption>('rating_desc');

  // Mobile filter accordion toggle
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Apply filters and sorting
  const filteredTeachers = useMemo(() => {
    const list = filterTeachers(allTeachers, {
      subject: selectedSubject || undefined,
      educationLevel: educationLevel || undefined,
      form: form || undefined,
      maxPrice: maxPrice < 40 ? maxPrice : undefined,
      lessonFormat,
      town: town || undefined,
      minExperience: minExperience > 0 ? minExperience : undefined,
      verifiedOnly,
      minRating: minRating > 0 ? minRating : undefined,
      searchQuery: searchQuery || undefined,
    });
    return sortTeachers(list, sortBy);
  }, [
    allTeachers,
    selectedSubject,
    educationLevel,
    form,
    maxPrice,
    lessonFormat,
    town,
    minExperience,
    verifiedOnly,
    minRating,
    searchQuery,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('');
    setEducationLevel('');
    setForm('');
    setMaxPrice(40);
    setLessonFormat('all');
    setTown('');
    setMinExperience(0);
    setVerifiedOnly(false);
    setMinRating(0);
    setSortBy('rating_desc');
  };

  const applyStudentPreferences = () => {
    if (!studentProfile) return;
    if (studentProfile.subjects.length > 0) {
      setSelectedSubject(studentProfile.subjects[0]);
    }
    setEducationLevel(studentProfile.primaryLevel);
    setForm(studentProfile.form);
    if (studentProfile.maxBudgetUsd) {
      setMaxPrice(studentProfile.maxBudgetUsd);
    }
    if (studentProfile.town) {
      setTown(studentProfile.town);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black">
            Find Qualified Teachers in Zimbabwe — Zim Tutor
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Compare verified tutors for Zimsec and Cambridge curricula. Book online or face-to-face lessons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {studentProfile && (
            <button
              onClick={applyStudentPreferences}
              className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Apply My Learning Preferences</span>
            </button>
          )}

          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="md:hidden px-3 py-1.5 bg-zinc-100 border border-zinc-300 text-black text-xs font-bold rounded-xl flex items-center gap-1"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar (Black & White Monochrome) */}
        <div
          className={`lg:block ${
            mobileFiltersOpen ? 'block' : 'hidden'
          } lg:col-span-1 space-y-5 bg-white p-5 rounded-2xl border border-zinc-300 shadow-xs h-fit`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
              <SlidersHorizontal className="w-4 h-4 text-black" />
              <span>Search Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-[11px] font-bold text-zinc-500 hover:text-black flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">Search Keywords</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Teacher name, town..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-black"
            >
              <option value="">All Subjects ({subjects.length})</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Education Level */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">Curriculum Level</label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value as EducationLevel | '')}
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-black"
            >
              <option value="">Any Level</option>
              <option value="O Level">O Level (Zimsec / Cambridge)</option>
              <option value="IGCSE">Cambridge IGCSE</option>
              <option value="AS Level">AS Level</option>
              <option value="A Level (A2)">A Level (A2)</option>
            </select>
          </div>

          {/* Form */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">School Form</label>
            <select
              value={form}
              onChange={(e) => setForm(e.target.value as SchoolForm | '')}
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-black"
            >
              <option value="">Any Form</option>
              <option value="Form 1">Form 1</option>
              <option value="Form 2">Form 2</option>
              <option value="Form 3">Form 3</option>
              <option value="Form 4">Form 4</option>
              <option value="Lower Sixth">Lower Sixth</option>
              <option value="Upper Sixth">Upper Sixth</option>
            </select>
          </div>

          {/* Max Hourly Rate Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-black">Max Hourly Price</label>
              <span className="text-xs font-black text-black">
                {maxPrice >= 40 ? 'Any price' : `$${maxPrice} USD/hr`}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-black h-1.5 bg-zinc-300 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-bold mt-1">
              <span>$5</span>
              <span>$20</span>
              <span>$40+</span>
            </div>
          </div>

          {/* Lesson Format (Online vs Physical) */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">Lesson Format</label>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setLessonFormat('all')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition ${
                  lessonFormat === 'all'
                    ? 'border-black bg-black text-white'
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setLessonFormat('online')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition ${
                  lessonFormat === 'online'
                    ? 'border-black bg-black text-white'
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                Online
              </button>
              <button
                type="button"
                onClick={() => setLessonFormat('physical')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition ${
                  lessonFormat === 'physical'
                    ? 'border-black bg-black text-white'
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                Physical
              </button>
            </div>
          </div>

          {/* Town / City Filter */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">Town / Teaching Area</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={town}
                onChange={(e) => setTown(e.target.value)}
                placeholder="e.g. Harare, Bulawayo..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">Minimum Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-black"
            >
              <option value={0}>Any rating</option>
              <option value={4.5}>4.5★ and above</option>
              <option value={4.8}>4.8★ and above</option>
            </select>
          </div>

          {/* Verified Only Toggle */}
          <div className="pt-2 border-t border-zinc-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-black">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded border-zinc-300 text-black focus:ring-black"
              />
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                <span>Verified Teachers Only</span>
              </span>
            </label>
            <p className="text-[10px] text-zinc-500 mt-1 pl-5">
              Only shows tutors whose degrees and national IDs have been approved on Zim Tutor.
            </p>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header Controls: Count & Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-zinc-300">
            <div className="text-xs text-zinc-600">
              Showing <strong className="text-black">{filteredTeachers.length}</strong> qualified{' '}
              {filteredTeachers.length === 1 ? 'teacher' : 'teachers'}
              {selectedSubject && (
                <span>
                  {' '}
                  for <strong className="text-black">{selectedSubject}</strong>
                </span>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500 font-bold shrink-0">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as TeacherSortOption)}
                className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-300 rounded-xl font-bold text-black text-xs focus:ring-2 focus:ring-black"
              >
                <option value="price_asc">Lowest hourly price ($)</option>
                <option value="rating_desc">Highest-rated teachers (★)</option>
                <option value="experience_desc">Most experienced teachers</option>
                <option value="soonest">Soonest availability</option>
              </select>
            </div>
          </div>

          {/* Teacher Cards Grid */}
          {filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTeachers.map((teacher) => (
                <TeacherCard
                  key={teacher.userId}
                  teacher={teacher}
                  onViewProfile={onViewTeacher}
                  onRequestLesson={onRequestLesson}
                />
              ))}
            </div>
          ) : (
            /* Helpful empty state */
            <div className="p-12 bg-white rounded-3xl border border-zinc-300 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-black">
                  No teachers match your current filters
                </h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1 leading-relaxed">
                  Try broadening your price range, clearing the town filter, or unchecking the "Verified only" toggle to discover more educators on Zim Tutor.
                </p>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
