import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Sparkles,
  MapPin,
  DollarSign,
  BookOpen,
  Target,
  ShieldCheck,
} from 'lucide-react';
import { EducationLevel, LessonPreference, SchoolForm } from '../types';

interface StudentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_EDUCATION_LEVELS: EducationLevel[] = [
  'O Level',
  'IGCSE',
  'AS Level',
  'A Level (A2)',
];

const ALL_FORMS: SchoolForm[] = [
  'Form 1',
  'Form 2',
  'Form 3',
  'Form 4',
  'Lower Sixth',
  'Upper Sixth',
  'Other',
];

const LEARNING_GOAL_OPTIONS = [
  'Understand difficult topics',
  'Improve my grades',
  'Prepare for examinations',
  'Practise past papers',
  'Improve practical skills',
  'Catch up on missed lessons',
  'Build confidence in a subject',
  'Get help with homework',
  'Achieve an A or A*',
];

export const StudentOnboardingModal: React.FC<StudentOnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { studentProfile, updateStudentProfile, subjects } = useApp();

  const [step, setStep] = useState<number>(1);

  // Question 1: Education Level
  const [selectedLevels, setSelectedLevels] = useState<EducationLevel[]>(
    studentProfile?.levels || ['O Level']
  );
  const [primaryLevel, setPrimaryLevel] = useState<EducationLevel>(
    studentProfile?.primaryLevel || 'O Level'
  );

  // Question 2: Form
  const [form, setForm] = useState<SchoolForm>(studentProfile?.form || 'Form 4');
  const [customForm, setCustomForm] = useState<string>(studentProfile?.customForm || '');

  // Question 3: Subjects
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    studentProfile?.subjects || ['Mathematics', 'Biology']
  );

  // Question 4: Lesson Preference & Location
  const [lessonPreference, setLessonPreference] = useState<LessonPreference>(
    studentProfile?.lessonPreference || 'both'
  );
  const [town, setTown] = useState<string>(studentProfile?.town || 'Harare');

  // Question 5: Budget
  const [maxBudgetUsd, setMaxBudgetUsd] = useState<number>(
    studentProfile?.maxBudgetUsd || 15
  );

  // Question 6: Learning Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    studentProfile?.learningGoals || ['Understand difficult topics', 'Prepare for examinations']
  );
  const [notes, setNotes] = useState<string>(studentProfile?.notes || '');

  if (!isOpen) return null;

  const toggleLevel = (lvl: EducationLevel) => {
    if (selectedLevels.includes(lvl)) {
      if (selectedLevels.length > 1) {
        const next = selectedLevels.filter((l) => l !== lvl);
        setSelectedLevels(next);
        if (primaryLevel === lvl) {
          setPrimaryLevel(next[0]);
        }
      }
    } else {
      setSelectedLevels([...selectedLevels, lvl]);
    }
  };

  const toggleSubject = (subjName: string) => {
    if (selectedSubjects.includes(subjName)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== subjName));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subjName]);
    }
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleSave = () => {
    updateStudentProfile({
      primaryLevel,
      levels: selectedLevels,
      form,
      customForm: form === 'Other' ? customForm : undefined,
      subjects: selectedSubjects,
      lessonPreference,
      town,
      maxBudgetUsd,
      learningGoals: selectedGoals,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-zinc-300 my-8 flex flex-col">
        {/* Header (Black and White) */}
        <div className="px-6 py-4 bg-black text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Student Education Profile</h2>
              <p className="text-xs text-zinc-400">
                Step {step} of 6 — Tailor your Zimbabwe tutor recommendations on Zim Tutor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (Monochrome) */}
        <div className="w-full bg-zinc-200 h-1.5">
          <div
            className="bg-black h-1.5 transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          ></div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 flex-1 min-h-[360px]">
          {/* Question 1: Education Level */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  Question 1
                </span>
                <h3 className="text-xl font-black text-black mt-0.5">
                  Which education level are you studying?
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  You can select more than one level if revising multiple curricula. Please mark your primary focus.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {ALL_EDUCATION_LEVELS.map((level) => {
                  const isSelected = selectedLevels.includes(level);
                  const isPrimary = primaryLevel === level;
                  return (
                    <div
                      key={level}
                      onClick={() => toggleLevel(level)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-black bg-zinc-100'
                          : 'border-zinc-200 hover:border-zinc-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-black text-sm">{level}</span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                            isSelected
                              ? 'bg-black text-white'
                              : 'border border-zinc-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-3" />}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-3 pt-2 border-t border-zinc-200 flex items-center justify-between">
                          <span className="text-[11px] text-zinc-600">Primary focus:</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrimaryLevel(level);
                            }}
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition ${
                              isPrimary
                                ? 'bg-black text-white'
                                : 'bg-zinc-200 text-black hover:bg-zinc-300'
                            }`}
                          >
                            {isPrimary ? '★ Primary Focus' : 'Set as primary'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question 2: School Form */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  Question 2
                </span>
                <h3 className="text-xl font-black text-black mt-0.5">
                  Which form are you currently in?
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  This helps tutors understand your curriculum milestone and syllabus depth.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                {ALL_FORMS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setForm(f)}
                    className={`p-3.5 rounded-xl border-2 text-center font-bold text-sm transition ${
                      form === f
                        ? 'border-black bg-black text-white shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-400 text-black bg-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {form === 'Other' && (
                <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <label className="block text-xs font-bold text-black mb-1">
                    Please specify your academic level / program:
                  </label>
                  <input
                    type="text"
                    value={customForm}
                    onChange={(e) => setCustomForm(e.target.value)}
                    placeholder="e.g. Adult matriculation, Private Zimsec candidate, Cambridge resit"
                    className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
              )}
            </div>
          )}

          {/* Question 3: Subjects */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  Question 3
                </span>
                <h3 className="text-xl font-black text-black mt-0.5">
                  Which subjects do you need help with?
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Select all subjects where you would like tutor guidance or exam prep.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 max-h-72 overflow-y-auto pr-1">
                {subjects.map((sub) => {
                  const isChecked = selectedSubjects.includes(sub.name);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => toggleSubject(sub.name)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                        isChecked
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-200 hover:border-zinc-400 text-zinc-800 bg-white'
                      }`}
                    >
                      <span className="truncate">{sub.name}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question 4: Lesson Preference */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  Question 4
                </span>
                <h3 className="text-xl font-black text-black mt-0.5">
                  What type of lessons do you prefer?
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Select online (via Google Meet), physical face-to-face, or either.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  {
                    id: 'online',
                    title: 'Online Lessons',
                    desc: 'Live interactive video lessons anywhere in Zimbabwe.',
                  },
                  {
                    id: 'physical',
                    title: 'Physical Lessons',
                    desc: 'Face-to-face in-person tutoring in your local town/area.',
                  },
                  {
                    id: 'both',
                    title: 'Either Online or Physical',
                    desc: 'Flexible depending on teacher proximity and schedule.',
                  },
                ].map((pref) => (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => setLessonPreference(pref.id as LessonPreference)}
                    className={`p-4 rounded-xl border-2 text-left transition flex flex-col justify-between ${
                      lessonPreference === pref.id
                        ? 'border-black bg-zinc-100 shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-400 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-black text-sm mb-1">{pref.title}</div>
                      <div className="text-xs text-zinc-600 leading-relaxed">{pref.desc}</div>
                    </div>
                    {lessonPreference === pref.id && (
                      <span className="text-[11px] font-bold text-black mt-3 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-black" /> Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Town Input */}
              {(lessonPreference === 'physical' || lessonPreference === 'both') && (
                <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-black">
                    <MapPin className="w-4 h-4 text-black" />
                    <span>Your Town or Preferred Teaching Area</span>
                  </div>
                  <input
                    type="text"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    placeholder="e.g. Harare (Mount Pleasant, Avondale), Bulawayo, Mutare, Gweru"
                    className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-lg focus:ring-2 focus:ring-black"
                  />
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-black shrink-0" />
                    <span>Privacy Notice: Your specific residential address is never shown publicly.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Question 5: Budget */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  Question 5
                </span>
                <h3 className="text-xl font-black text-black mt-0.5">
                  What is your budget per hour?
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Specify your target maximum hourly rate in USD. Teachers set their own rates from $5 to $25+/hr.
                </p>
              </div>

              <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-600">Max Target Rate:</span>
                  <div className="text-2xl font-black text-black flex items-center">
                    <DollarSign className="w-6 h-6 stroke-3" />
                    <span>{maxBudgetUsd}</span>
                    <span className="text-xs font-semibold text-zinc-500 ml-1">/ hour (USD)</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={maxBudgetUsd}
                  onChange={(e) => setMaxBudgetUsd(Number(e.target.value))}
                  className="w-full accent-black h-2 bg-zinc-300 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-zinc-500 font-bold">
                  <span>$5/hr (Affordable)</span>
                  <span>$15/hr (Typical O/A Level)</span>
                  <span>$40/hr (Specialist)</span>
                </div>

                <div className="p-3 bg-zinc-100 rounded-xl border border-zinc-300 text-xs text-black flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span>
                    Currency: Rates are initially in <strong>USD</strong>. Teachers and students agree on convenient local payment arrangements directly.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Question 6: Learning Goals */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  Question 6
                </span>
                <h3 className="text-xl font-black text-black mt-0.5">
                  What do you want to achieve with tutoring?
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Choose your learning goals and describe any specific challenges.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-48 overflow-y-auto">
                {LEARNING_GOAL_OPTIONS.map((goal) => {
                  const isChecked = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                        isChecked
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-200 hover:border-zinc-400 text-zinc-800 bg-white'
                      }`}
                    >
                      <span>{goal}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-black mb-1">
                  Optional: Describe any specific topics or difficulties (e.g. "struggling with trigonometry proofs"):
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us what areas you want your tutor to focus on..."
                  className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-xl focus:ring-2 focus:ring-black"
                ></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 border border-zinc-300 text-black font-bold text-xs rounded-xl hover:bg-zinc-200 flex items-center gap-1.5 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
          ) : (
            <div></div>
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-5 py-2 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-black hover:bg-zinc-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition"
            >
              <Check className="w-4 h-4" /> Save Education Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
