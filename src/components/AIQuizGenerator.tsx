import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Zap,
  BookOpen,
  Award,
  ChevronRight,
  Brain,
  Check,
} from 'lucide-react';
import { QuizDeck, QuizQuestion, UserProfile } from '../types';
import confetti from 'canvas-confetti';

interface AIQuizGeneratorProps {
  user: UserProfile;
  onAddXP?: (xp: number) => void;
  onOpenPrimeModal?: () => void;
}

export const AIQuizGenerator: React.FC<AIQuizGeneratorProps> = ({
  user,
  onAddXP,
  onOpenPrimeModal,
}) => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState(user.examDetails?.subjects[0] || 'Physics');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);

  const [isLoading, setIsLoading] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizDeck | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Pre-loaded quick starter quizzes
  const sampleQuizzes: QuizDeck[] = [
    {
      id: 'quiz-sample-1',
      title: 'Physics Mechanics & Newton Laws',
      subject: 'Physics',
      difficulty: 'Medium',
      createdAt: 'Today',
      questions: [
        {
          id: 'sq-1',
          question: 'What is the net force acting on a car moving at constant velocity on a straight road?',
          options: ['Equal to its mass times speed', 'Zero Net Force', 'Greater than friction force', 'Directly proportional to time elapsed'],
          correctAnswerIndex: 1,
          explanation: 'Newton’s First Law states that an object moving at constant velocity has zero acceleration, hence Net Force = 0.'
        },
        {
          id: 'sq-2',
          question: 'If momentum of a body is doubled, what happens to its Kinetic Energy?',
          options: ['It doubles', 'It quadruples (4x)', 'It remains constant', 'It is halved'],
          correctAnswerIndex: 1,
          explanation: 'Kinetic Energy KE = p^2 / 2m. If momentum p is doubled, KE becomes (2p)^2 / 2m = 4 times.'
        },
        {
          id: 'sq-3',
          question: 'Which of the following forces does NO work on a circular satellite orbit?',
          options: ['Frictional atmospheric force', 'Centripetal Gravitational Force', 'Engine thrust force', 'Electromagnetic solar radiation'],
          correctAnswerIndex: 1,
          explanation: 'Centripetal force is always perpendicular to velocity displacement vector (θ = 90°), so Work = F·d·cos(90°) = 0.'
        }
      ]
    },
    {
      id: 'quiz-sample-2',
      title: 'Chemistry Organic Reactions & Bonding',
      subject: 'Chemistry',
      difficulty: 'Hard',
      createdAt: 'Today',
      questions: [
        {
          id: 'cq-1',
          question: 'Which reaction mechanism is favored by tertiary alkyl halides in polar protic solvents?',
          options: ['SN2 Mechanism', 'SN1 Mechanism', 'E2 Elimination only', 'Electrophilic Addition'],
          correctAnswerIndex: 1,
          explanation: 'Tertiary carbocations are highly stabilized by hyperconjugation and inductive effects in polar protic solvents, favoring SN1.'
        },
        {
          id: 'cq-2',
          question: 'What is the hybridisation of carbon atoms in benzene (C6H6)?',
          options: ['sp3', 'sp2', 'sp', 'dsp2'],
          correctAnswerIndex: 1,
          explanation: 'Each carbon in planar aromatic benzene forms 3 sigma bonds with sp2 hybridisation and 1 unhybridized p-orbital for delocalized pi bonding.'
        }
      ]
    }
  ];

  const handleGenerateQuiz = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setIsCompleted(false);
    setActiveQuestionIndex(0);
    setSelectedAnswers({});

    const targetTopic = topic || `${subject} Core Concepts`;

    const fallbackQuiz: QuizDeck = {
      id: 'quiz-' + Date.now(),
      title: `${targetTopic} Quiz (${difficulty})`,
      subject: subject || 'Science',
      difficulty: difficulty || 'Medium',
      createdAt: 'Just now',
      questions: [
        {
          id: 'q-1',
          question: `Which fundamental principle is central to understanding ${targetTopic}?`,
          options: [
            'Conservation Laws & Fundamental Equations',
            'Random Disorientation without Boundary Conditions',
            'Constant Value under Zero Acceleration',
            'Thermal Disruption in Vacuum'
          ],
          correctAnswerIndex: 0,
          explanation: 'Conservation laws state that total quantity remains constant in closed systems, forming the core foundation.'
        },
        {
          id: 'q-2',
          question: `When solving numerical questions in ${subject}, what is the recommended first step?`,
          options: [
            'Guess coefficients without checking units',
            'Identify given/unknown variables and write down standard formulas',
            'Skip theoretical definitions completely',
            'Calculate raw numbers without converting to SI units'
          ],
          correctAnswerIndex: 1,
          explanation: 'Systematic problem solving starts with listing known values, converting to SI units, and identifying the target equation.'
        },
        {
          id: 'q-3',
          question: `How does active retrieval testing improve retention for ${targetTopic}?`,
          options: [
            'It has zero impact on long-term memory',
            'It forces the brain to rebuild neural memory pathways, boosting recall up to 300%',
            'It causes mental exhaustion without learning benefits',
            'It only works if done passively late at night'
          ],
          correctAnswerIndex: 1,
          explanation: 'Retrieval practice forces cognitive effort, which significantly strengthens long-term memory consolidation.'
        },
        {
          id: 'q-4',
          question: `What is a common trap in ${subject} board exam questions?`,
          options: [
            'Forgetting unit conversions (e.g., minutes to seconds or cm to meters)',
            'Drawing clean diagrams',
            'Writing clear step-by-step working',
            'Checking final answer magnitude'
          ],
          correctAnswerIndex: 0,
          explanation: 'Unit mismatch errors account for over 30% of avoidable calculation mistakes in competitive exams.'
        },
        {
          id: 'q-5',
          question: `Which study strategy yields highest exam score improvements for ${targetTopic}?`,
          options: [
            'Passive highlighting of textbooks',
            'Solving past-year practice questions and reviewing error explanations',
            'Cramming 10 hours continuously without breaks',
            'Reading notes without self-testing'
          ],
          correctAnswerIndex: 1,
          explanation: 'Analyzing past paper questions helps identify exam patterns and clarifies frequent conceptual traps.'
        }
      ]
    };

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          subject,
          difficulty,
          questionCount,
        }),
      });
      const data = await res.json();
      if (data && data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setCurrentQuiz(data);
      } else {
        setCurrentQuiz(fallbackQuiz);
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
      setCurrentQuiz(fallbackQuiz);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (selectedAnswers[questionIndex] !== undefined) return; // prevent changing answer after submission
    const updated = { ...selectedAnswers, [questionIndex]: optionIndex };
    setSelectedAnswers(updated);

    // If last question answered, trigger completion check after small delay
    if (currentQuiz && Object.keys(updated).length === currentQuiz.questions.length) {
      setTimeout(() => {
        setIsCompleted(true);
        // Calculate score
        let score = 0;
        currentQuiz.questions.forEach((q, idx) => {
          if (updated[idx] === q.correctAnswerIndex) score++;
        });

        // Award XP
        const earnedXP = Math.round((score / currentQuiz.questions.length) * 50) + 20;
        if (onAddXP) onAddXP(earnedXP);

        // Trigger confetti if perfect score or >80%
        if (score / currentQuiz.questions.length >= 0.8) {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
      }, 800);
    }
  };

  const calculateScore = () => {
    if (!currentQuiz) return { score: 0, total: 0, percentage: 0 };
    let score = 0;
    currentQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) score++;
    });
    return {
      score,
      total: currentQuiz.questions.length,
      percentage: Math.round((score / currentQuiz.questions.length) * 100),
    };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white overflow-hidden shadow-xl border border-purple-800/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>AI Practice & Active Recall</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            AI Quiz Generator 🎯
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/90 max-w-2xl font-medium leading-relaxed">
            Generate instant multiple-choice practice quizzes tailored to your exam topics. Test your recall, analyze explanations & earn XP points!
          </p>
        </div>
      </div>

      {/* Main Generator Form */}
      {!currentQuiz && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
          <form onSubmit={handleGenerateQuiz} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject Input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Subject Name
                </label>
                <input
                  type="text"
                  placeholder="Type any subject (e.g. Physics, Law, Economics, Microanatomy...)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  required
                />
                {user.examDetails?.subjects && user.examDetails.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-600 font-bold self-center">Your subjects:</span>
                    {user.examDetails.subjects.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setSubject(sub)}
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold transition-all ${
                          subject === sub
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Topic / Chapter Input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  Topic / Chapter Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thermodynamics, Organic Nomenclature, Electrostatics..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-semibold text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              {/* Difficulty Level */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Easy', 'Medium', 'Hard'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-2.5 rounded-xl text-xs font-black transition-all border ${
                        difficulty === lvl
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-600" />
                  Question Count
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[3, 5, 8].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`py-2.5 rounded-xl text-xs font-black transition-all border ${
                        questionCount === count
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {count} MCQs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin text-purple-200" />
                  <span>Generating AI Quiz...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Quiz Now (+50 XP)</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Starter Quizzes */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              ⚡ Or Try Quick Starter Quizzes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sampleQuizzes.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => {
                    setCurrentQuiz(sample);
                    setActiveQuestionIndex(0);
                    setSelectedAnswers({});
                    setIsCompleted(false);
                  }}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-400 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      {sample.subject}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {sample.questions.length} Questions
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {sample.title}
                  </h4>
                  <div className="mt-3 flex items-center text-xs font-bold text-indigo-600 gap-1">
                    <span>Start Practice</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Quiz Player Screen */}
      {currentQuiz && !isCompleted && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
          {/* Quiz Top Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-black text-[11px] uppercase">
                  {currentQuiz.subject}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px]">
                  {currentQuiz.difficulty}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                {currentQuiz.title}
              </h2>
            </div>

            <button
              onClick={() => setCurrentQuiz(null)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Change Quiz</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-extrabold text-slate-500">
              <span>Question {activeQuestionIndex + 1} of {currentQuiz.questions.length}</span>
              <span>Answered: {Object.keys(selectedAnswers).length}/{currentQuiz.questions.length}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{
                  width: `${((activeQuestionIndex + 1) / currentQuiz.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Card */}
          {currentQuiz.questions[activeQuestionIndex] && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {currentQuiz.questions[activeQuestionIndex].question}
                </h3>
              </div>

              {/* Options List */}
              <div className="space-y-3">
                {currentQuiz.questions[activeQuestionIndex].options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[activeQuestionIndex] === optIdx;
                  const isAnswered = selectedAnswers[activeQuestionIndex] !== undefined;
                  const isCorrect = currentQuiz.questions[activeQuestionIndex].correctAnswerIndex === optIdx;

                  let optionStyle = 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-slate-50 text-slate-800';
                  if (isAnswered) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-500/20';
                    } else {
                      optionStyle = 'bg-slate-50 border-slate-200 opacity-60 text-slate-600';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(activeQuestionIndex, optIdx)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center font-black text-xs shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation section if answered */}
              {selectedAnswers[activeQuestionIndex] !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 space-y-1"
                >
                  <p className="font-black flex items-center gap-1.5 text-purple-900">
                    <Brain className="w-4 h-4 text-purple-600" />
                    Detailed AI Explanation:
                  </p>
                  <p className="font-medium leading-relaxed">
                    {currentQuiz.questions[activeQuestionIndex].explanation}
                  </p>
                </motion.div>
              )}

              {/* Navigation Controls */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activeQuestionIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 disabled:opacity-40 transition-all"
                >
                  Previous
                </button>

                {activeQuestionIndex < currentQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => setActiveQuestionIndex((prev) => Math.min(currentQuiz.questions.length - 1, prev + 1))}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsCompleted(true)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <span>Finish & See Results</span>
                    <Trophy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completed Results Screen */}
      {currentQuiz && isCompleted && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Quiz Completed! 🎉</h2>
            <p className="text-xs text-slate-500 font-medium">
              Great active recall effort! You earned <strong className="text-amber-600">+50 XP</strong> for your daily streak.
            </p>
          </div>

          {/* Score Card */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 inline-block w-full max-w-sm">
            <div className="text-4xl font-black text-indigo-600">
              {calculateScore().percentage}%
            </div>
            <p className="text-xs font-bold text-slate-500 mt-1">
              Score: {calculateScore().score} / {calculateScore().total} Correct
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedAnswers({});
                setActiveQuestionIndex(0);
                setIsCompleted(false);
              }}
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry This Quiz</span>
            </button>
            <button
              onClick={() => {
                setCurrentQuiz(null);
                setIsCompleted(false);
              }}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create New AI Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
