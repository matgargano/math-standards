import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from "recharts";
import Swal from "sweetalert2";
import questionsData from "./questions.json";

type AnswerKey = "A" | "B" | "C" | "D";
type Subject = "Math" | "Reading";

interface Question {
  question: string;
  answers: Record<AnswerKey, string>;
  correct: AnswerKey;
}

interface Standard {
  name: string;
  description: string;
  questions: Question[];
}

interface SubjectsData {
  Reading: Record<string, Standard>;
  Math: Record<string, Standard>;
}

interface StandardsData {
  "NY-3": SubjectsData;
}

// Parse the nested JSON structure
const data = questionsData as StandardsData[];
const subjectsData = data[0]["NY-3"];

// Get standards as array for easier rendering
const getStandardsList = (subject: Subject) => {
  const standards = subjectsData[subject];
  return Object.entries(standards).map(([code, standard]) => ({
    code,
    ...standard,
    hasQuestions: standard.questions.length > 0,
  }));
};

// Icon components for standards
const StandardIcon = ({ code }: { code: string }) => {
  const icons: Record<string, React.ReactNode> = {
    // Math icons
    OA: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    NBT: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    ),
    NF: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3zm8 0v10m-4-5h8" />
      </svg>
    ),
    MD: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    G: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    ),
    // Reading icons
    R2: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    R3: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    R4: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    R6: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  };
  return icons[code] || icons.OA;
};

// Color schemes for standards
const standardColors: Record<string, { bg: string; text: string; gradient: string; light: string }> = {
  // Math standards
  OA: { bg: "bg-primary-500", text: "text-primary-600", gradient: "from-primary-500 to-primary-600", light: "bg-primary-50" },
  NBT: { bg: "bg-secondary-500", text: "text-secondary-600", gradient: "from-secondary-500 to-secondary-600", light: "bg-secondary-50" },
  NF: { bg: "bg-accent-500", text: "text-accent-600", gradient: "from-accent-500 to-accent-600", light: "bg-accent-50" },
  MD: { bg: "bg-success-500", text: "text-success-600", gradient: "from-success-500 to-success-600", light: "bg-success-50" },
  G: { bg: "bg-error-500", text: "text-error-600", gradient: "from-error-500 to-error-600", light: "bg-error-50" },
  // Reading standards
  R2: { bg: "bg-blue-500", text: "text-blue-600", gradient: "from-blue-500 to-blue-600", light: "bg-blue-50" },
  R3: { bg: "bg-indigo-500", text: "text-indigo-600", gradient: "from-indigo-500 to-indigo-600", light: "bg-indigo-50" },
  R4: { bg: "bg-violet-500", text: "text-violet-600", gradient: "from-violet-500 to-violet-600", light: "bg-violet-50" },
  R6: { bg: "bg-fuchsia-500", text: "text-fuchsia-600", gradient: "from-fuchsia-500 to-fuchsia-600", light: "bg-fuchsia-50" },
};

// Confetti component for celebration
const Confetti = () => {
  const colors = ["#a855f7", "#14b8a6", "#f97316", "#10b981", "#f43f5e"];
  const confettiPieces = Array.from({ length: 50 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confettiPieces.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            rotate: Math.random() * 720 - 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            delay: Math.random() * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

// Subject selection screen component
const SubjectScreen = ({
  onSelectSubject,
}: {
  onSelectSubject: (subject: Subject) => void;
}) => {
  const subjects: { key: Subject; name: string; emoji: string; description: string; gradient: string; hoverGradient: string }[] = [
    {
      key: "Math",
      name: "Math",
      emoji: "🔢",
      description: "Practice fractions, geometry, measurement, and more!",
      gradient: "from-primary-500 to-secondary-500",
      hoverGradient: "from-primary-600 to-secondary-600",
    },
    {
      key: "Reading",
      name: "Reading",
      emoji: "📖",
      description: "Practice themes, character traits, vocabulary, and point of view!",
      gradient: "from-blue-500 to-violet-500",
      hoverGradient: "from-blue-600 to-violet-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="inline-block mb-4"
        >
          <span className="text-6xl">📚</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-3">
          NY-3 Practice Exams
        </h1>
        <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
          Choose a subject to get started!
        </p>
      </motion.div>

      {/* Subject Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {subjects.map((subject, idx) => (
          <motion.button
            key={subject.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            onClick={() => onSelectSubject(subject.key)}
            className="group relative overflow-hidden rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-glow"
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${subject.gradient} group-hover:${subject.hoverGradient} transition-all duration-300`} />

            {/* Content */}
            <div className="relative z-10">
              <motion.span
                className="text-6xl block mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {subject.emoji}
              </motion.span>
              <h2 className="text-3xl font-display font-bold text-white mb-2">
                {subject.name}
              </h2>
              <p className="text-white/80 text-lg">
                {subject.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-white font-medium">
                <span>Start Learning</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-neutral-500 text-sm"
      >
        <p>
          These practice exams align with New York State 3rd Grade Learning Standards
        </p>
      </motion.div>
    </motion.div>
  );
};

// Home screen component (Standards selection)
const HomeScreen = ({
  subject,
  onSelectStandard,
  onBack,
}: {
  subject: Subject;
  onSelectStandard: (code: string) => void;
  onBack: () => void;
}) => {
  const standardsList = getStandardsList(subject);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors font-medium"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Subjects
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="inline-block mb-4"
        >
          <span className="text-6xl">{subject === "Math" ? "🔢" : "📖"}</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-3">
          {subject} Standards
        </h1>
        <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
          Choose a standard to practice. Master each topic and track your progress!
        </p>
      </motion.div>

      {/* Standards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {standardsList.map((standard, idx) => {
          const colors = standardColors[standard.code] || standardColors.OA;
          const isAvailable = standard.hasQuestions;

          return (
            <motion.button
              key={standard.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              onClick={() => isAvailable && onSelectStandard(standard.code)}
              disabled={!isAvailable}
              className={`card text-left transition-all duration-300 group relative overflow-hidden h-full flex flex-col ${
                isAvailable
                  ? "hover:shadow-glow cursor-pointer hover:scale-[1.02]"
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              {/* Background gradient on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              <div className="relative flex flex-col flex-1">
                {/* Icon and code */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl ${colors.light} ${colors.text} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  >
                    <StandardIcon code={standard.code} />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${colors.bg} text-white`}
                  >
                    3.{standard.code}
                  </span>
                </div>

                {/* Name and description */}
                <h3 className="text-lg font-semibold text-neutral-800 mb-2 group-hover:text-primary-700 transition-colors">
                  {standard.name}
                </h3>
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                  {standard.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto">
                  {isAvailable ? (
                    <>
                      <span className="text-sm text-neutral-500">
                        {standard.questions.length} questions
                      </span>
                      <span
                        className={`text-sm font-medium ${colors.text} flex items-center gap-1 group-hover:gap-2 transition-all`}
                      >
                        Start Practice
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-neutral-400 italic">
                      Coming soon...
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-neutral-500 text-sm"
      >
        <p>
          These practice exams align with New York State 3rd Grade Learning Standards
        </p>
      </motion.div>
    </motion.div>
  );
};

// Progress indicator component
const ProgressIndicator = ({
  total,
  current,
  responses,
  onDotClick,
}: {
  total: number;
  current: number;
  responses: Record<number, AnswerKey>;
  onDotClick: (index: number) => void;
}) => {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {Array.from({ length: total }).map((_, idx) => {
        const isActive = idx === current;
        const isAnswered = responses[idx] !== undefined;

        return (
          <motion.button
            key={idx}
            onClick={() => onDotClick(idx)}
            className={`progress-dot cursor-pointer ${
              isActive
                ? "progress-dot-active"
                : isAnswered
                  ? "progress-dot-answered"
                  : "progress-dot-unanswered"
            }`}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            title={`Question ${idx + 1}${isAnswered ? " (answered)" : ""}`}
          />
        );
      })}
    </div>
  );
};

// Question card component with animations
const QuestionCard = ({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onSelect,
  direction,
}: {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: AnswerKey | undefined;
  onSelect: (answer: AnswerKey) => void;
  direction: number;
}) => {
  const answerKeys = Object.keys(question.answers) as AnswerKey[];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      }}
      className="w-full"
    >
      <div className="card bg-gradient-to-br from-white to-primary-50/30">
        {/* Question number badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full text-sm font-semibold mb-6 shadow-soft"
        >
          <span className="animate-pulse-soft">✨</span>
          Question {questionIndex + 1} of {totalQuestions}
        </motion.div>

        {/* Question text */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-2xl md:text-3xl font-display font-semibold text-neutral-800 mb-8 leading-relaxed"
        >
          {question.question}
        </motion.h2>

        {/* Answer options */}
        <div className="grid gap-4">
          {answerKeys.map((key, idx) => {
            const isSelected = selectedAnswer === key;

            return (
              <motion.label
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={`answer-option group ${isSelected ? "answer-option-selected" : ""}`}
              >
                <input
                  type="radio"
                  name={`question-${questionIndex}`}
                  value={key}
                  checked={isSelected}
                  onChange={() => onSelect(key)}
                  className="sr-only"
                />

                {/* Answer letter badge */}
                <motion.div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-200 ${
                    isSelected
                      ? "bg-primary-500 text-white shadow-glow"
                      : "bg-neutral-100 text-neutral-600 group-hover:bg-primary-100 group-hover:text-primary-600"
                  }`}
                  animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {key}
                </motion.div>

                {/* Answer text */}
                <span
                  className={`text-lg transition-colors duration-200 ${
                    isSelected
                      ? "text-primary-700 font-medium"
                      : "text-neutral-700 group-hover:text-primary-600"
                  }`}
                >
                  {question.answers[key]}
                </span>

                {/* Checkmark for selected */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="ml-auto"
                    >
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.label>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

// Results component with charts
const Results = ({
  responses,
  questions,
  standardCode,
  standardName,
  onRetry,
  onGoHome,
}: {
  responses: Record<number, AnswerKey>;
  questions: Question[];
  standardCode: string;
  standardName: string;
  onRetry: () => void;
  onGoHome: () => void;
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const results = questions.map((q, idx) => ({
    questionNum: idx + 1,
    question: q.question,
    userAnswer: responses[idx],
    userAnswerText: q.answers[responses[idx]],
    correctAnswer: q.correct,
    correctAnswerText: q.answers[q.correct],
    isCorrect: responses[idx] === q.correct,
  }));

  const correctCount = results.filter((r) => r.isCorrect).length;
  const incorrectCount = results.length - correctCount;
  const percentage = Math.round((correctCount / questions.length) * 100);
  const passed = percentage >= 70;

  useEffect(() => {
    if (passed) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [passed]);

  // Chart data
  const pieData = [
    { name: "Correct", value: correctCount, color: "#10b981" },
    { name: "Incorrect", value: incorrectCount, color: "#f43f5e" },
  ];

  const barData = results.map((r) => ({
    name: `Q${r.questionNum}`,
    score: r.isCorrect ? 100 : 0,
    fill: r.isCorrect ? "#10b981" : "#f43f5e",
  }));

  const radialData = [
    {
      name: "Score",
      value: percentage,
      fill: passed ? "#10b981" : "#f43f5e",
    },
  ];

  const getGrade = (pct: number) => {
    if (pct >= 90) return { letter: "A", color: "text-success-500", emoji: "🌟" };
    if (pct >= 80) return { letter: "B", color: "text-success-600", emoji: "✨" };
    if (pct >= 70) return { letter: "C", color: "text-secondary-500", emoji: "👍" };
    if (pct >= 60) return { letter: "D", color: "text-accent-500", emoji: "📚" };
    return { letter: "F", color: "text-error-500", emoji: "💪" };
  };

  const grade = getGrade(percentage);
  const colors = standardColors[standardCode] || standardColors.OA;

  return (
    <>
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="text-6xl">{passed ? "🎉" : "📖"}</span>
          </motion.div>
          <div className="mb-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${colors.bg} text-white`}>
              3.{standardCode} - {standardName}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2">
            {passed ? "Congratulations!" : "Keep Learning!"}
          </h1>
          <p className="text-neutral-600 text-lg">
            {passed
              ? "You've passed this practice exam!"
              : "Practice makes perfect. Try again!"}
          </p>
        </motion.div>

        {/* Score overview cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main score card with radial chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card md:col-span-2 bg-gradient-to-br from-white to-primary-50/50"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Radial chart */}
              <div className="w-48 h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="100%"
                    barSize={15}
                    data={radialData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      background={{ fill: "#e7e5e4" }}
                      dataKey="value"
                      cornerRadius={10}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.5 }}
                    className={`text-5xl font-display font-bold ${grade.color}`}
                  >
                    {percentage}%
                  </motion.span>
                </div>
              </div>

              {/* Score details */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <motion.span
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className={`text-6xl font-display font-bold ${grade.color}`}
                  >
                    {grade.letter}
                  </motion.span>
                  <span className="text-4xl">{grade.emoji}</span>
                </div>
                <p className="text-2xl font-semibold text-neutral-800 mb-2">
                  {correctCount} out of {questions.length} correct
                </p>
                <p
                  className={`text-lg font-medium ${passed ? "text-success-600" : "text-error-600"}`}
                >
                  {passed
                    ? "Great job! You passed!"
                    : "Keep practicing! You need 70% to pass."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Pie chart card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-neutral-700 mb-4 text-center">
              Results Breakdown
            </h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success-500" />
                <span className="text-sm text-neutral-600">
                  Correct ({correctCount})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-error-500" />
                <span className="text-sm text-neutral-600">
                  Incorrect ({incorrectCount})
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bar chart - question by question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-neutral-700 mb-4">
            Question-by-Question Results
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#78716c", fontSize: 12 }}
                  axisLine={{ stroke: "#d6d3d1" }}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  formatter={(value: number) =>
                    value === 100 ? "Correct" : "Incorrect"
                  }
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e7e5e4",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Detailed results table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-neutral-700 mb-6">
            Detailed Review
          </h3>
          <div className="space-y-4">
            {results.map((result, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.05 }}
                className={`p-4 rounded-xl border-2 ${
                  result.isCorrect
                    ? "border-success-200 bg-success-50/50"
                    : "border-error-200 bg-error-50/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      result.isCorrect ? "bg-success-500" : "bg-error-500"
                    }`}
                  >
                    {result.isCorrect ? (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Question content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-neutral-500">
                        Question {result.questionNum}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          result.isCorrect
                            ? "bg-success-100 text-success-700"
                            : "bg-error-100 text-error-700"
                        }`}
                      >
                        {result.isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                    <p className="text-neutral-800 font-medium mb-3">
                      {result.question}
                    </p>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div
                        className={`p-3 rounded-lg ${
                          result.isCorrect ? "bg-success-100" : "bg-error-100"
                        }`}
                      >
                        <span className="text-xs font-semibold text-neutral-500 block mb-1">
                          Your Answer
                        </span>
                        <span
                          className={`font-semibold ${
                            result.isCorrect
                              ? "text-success-700"
                              : "text-error-700"
                          }`}
                        >
                          {result.userAnswer}: {result.userAnswerText}
                        </span>
                      </div>

                      {!result.isCorrect && (
                        <div className="p-3 rounded-lg bg-success-100">
                          <span className="text-xs font-semibold text-neutral-500 block mb-1">
                            Correct Answer
                          </span>
                          <span className="font-semibold text-success-700">
                            {result.correctAnswer}: {result.correctAnswerText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button onClick={onGoHome} className="btn-secondary text-lg px-8 py-4">
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Standards
            </span>
          </button>
          <button onClick={onRetry} className="btn-primary text-lg px-8 py-4">
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </span>
          </button>
        </motion.div>
      </motion.div>
    </>
  );
};

// Test screen component
const TestScreen = ({
  standardCode,
  standard,
  onGoHome,
}: {
  standardCode: string;
  standard: Standard;
  onGoHome: () => void;
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, AnswerKey>>({});
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const questions = standard.questions;
  const colors = standardColors[standardCode] || standardColors.OA;

  const handleSelect = (answer: AnswerKey) => {
    setResponses((prev) => ({ ...prev, [currentQuestion]: answer }));
    setShowWarning(false);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setDirection(1);
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentQuestion ? 1 : -1);
    setCurrentQuestion(index);
  };

  const handleSubmit = () => {
    const unansweredCount = questions.filter(
      (_, idx) => responses[idx] === undefined
    ).length;

    if (unansweredCount > 0) {
      setShowWarning(true);
      return;
    }

    setSubmitted(true);
  };

  const handleRetry = () => {
    setResponses({});
    setSubmitted(false);
    setCurrentQuestion(0);
    setDirection(0);
    setShowWarning(false);
  };

  const handleBackClick = async () => {
    const answeredCount = Object.keys(responses).length;

    if (answeredCount > 0 && !submitted) {
      const result = await Swal.fire({
        title: "Abandon Test?",
        text: "You have unsaved progress. Are you sure you want to leave?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f43f5e",
        cancelButtonColor: "#78716c",
        confirmButtonText: "Yes, leave",
        cancelButtonText: "Continue test",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl",
          cancelButton: "rounded-xl",
        },
      });

      if (result.isConfirmed) {
        onGoHome();
      }
    } else {
      onGoHome();
    }
  };

  const answeredCount = Object.keys(responses).length;
  const canGoNext = currentQuestion < questions.length - 1;
  const canGoPrevious = currentQuestion > 0;
  const isLastQuestion = currentQuestion === questions.length - 1;

  if (submitted) {
    return (
      <Results
        responses={responses}
        questions={questions}
        standardCode={standardCode}
        standardName={standard.name}
        onRetry={handleRetry}
        onGoHome={onGoHome}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors font-medium"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Standards
        </button>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${colors.bg} text-white`}>
          3.{standardCode}
        </span>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2">
          {standard.name}
        </h1>
        <p className="text-neutral-600">
          {standard.description}
        </p>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        className="bg-neutral-200 rounded-full h-2 overflow-hidden"
      >
        <motion.div
          className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full`}
          initial={{ width: 0 }}
          animate={{
            width: `${((currentQuestion + 1) / questions.length) * 100}%`,
          }}
          transition={{ type: "spring", stiffness: 100 }}
        />
      </motion.div>

      {/* Progress dots */}
      <ProgressIndicator
        total={questions.length}
        current={currentQuestion}
        responses={responses}
        onDotClick={handleDotClick}
      />

      {/* Warning message */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-accent-50 border-2 border-accent-200 text-accent-700 px-4 py-3 rounded-xl text-center font-medium"
          >
            <span className="mr-2">⚠️</span>
            Please answer all questions before submitting. You have{" "}
            {questions.length - answeredCount} unanswered question
            {questions.length - answeredCount > 1 ? "s" : ""}.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question card */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <QuestionCard
            key={currentQuestion}
            question={questions[currentQuestion]}
            questionIndex={currentQuestion}
            totalQuestions={questions.length}
            selectedAnswer={responses[currentQuestion]}
            onSelect={handleSelect}
            direction={direction}
          />
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between gap-4"
      >
        <button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className="btn-secondary flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>

        <span className="text-neutral-500 font-medium">
          {answeredCount} / {questions.length} answered
        </span>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            className="btn-success flex items-center gap-2"
          >
            Submit Exam
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className="btn-primary flex items-center gap-2"
          >
            Next
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </motion.div>

      {/* Quick submit option */}
      {!isLastQuestion && answeredCount === questions.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={handleSubmit}
            className="text-primary-600 hover:text-primary-700 font-medium underline-offset-2 hover:underline transition-colors"
          >
            All questions answered! Click here to submit now →
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

// Main App component
function App() {
  const [currentView, setCurrentView] = useState<"subject" | "standards" | "test">("subject");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentView("standards");
  };

  const handleSelectStandard = (code: string) => {
    setSelectedStandard(code);
    setCurrentView("test");
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setCurrentView("subject");
  };

  const handleBackToStandards = () => {
    setSelectedStandard(null);
    setCurrentView("standards");
  };

  const selectedStandardData = selectedSubject && selectedStandard
    ? subjectsData[selectedSubject][selectedStandard]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {currentView === "subject" ? (
              <SubjectScreen
                key="subject"
                onSelectSubject={handleSelectSubject}
              />
            ) : currentView === "standards" && selectedSubject ? (
              <HomeScreen
                key={`standards-${selectedSubject}`}
                subject={selectedSubject}
                onSelectStandard={handleSelectStandard}
                onBack={handleBackToSubjects}
              />
            ) : selectedStandardData ? (
              <TestScreen
                key={`test-${selectedStandard}`}
                standardCode={selectedStandard!}
                standard={selectedStandardData}
                onGoHome={handleBackToStandards}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
