import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Sparkles,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  HelpCircle,
  Shuffle,
  BookOpen,
  Brain,
  PlusCircle,
  Award,
} from 'lucide-react';
import { FlashcardDeck, Flashcard, UserProfile } from '../types';

interface AIFlashcardsProps {
  user: UserProfile;
  onAddXP?: (xp: number) => void;
}

export const AIFlashcards: React.FC<AIFlashcardsProps> = ({ user, onAddXP }) => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState(user.examDetails?.subjects[0] || 'Physics');
  const [cardCount, setCardCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const [currentDeck, setCurrentDeck] = useState<FlashcardDeck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  // Pre-loaded sample decks
  const sampleDecks: FlashcardDeck[] = [
    {
      id: 'deck-sample-1',
      title: 'Physics High-Yield Formulas',
      subject: 'Physics',
      createdAt: 'Today',
      cards: [
        {
          id: 'sfc-1',
          front: 'What is the formula for Centripetal Acceleration?',
          back: 'a_c = v² / r  or  a_c = ω² · r',
          mnemonic: '💡 "v-squared over r" keep it in orbit!'
        },
        {
          id: 'sfc-2',
          front: 'What is De Broglie Wavelength equation?',
          back: 'λ = h / p = h / (m · v)',
          mnemonic: '🌊 Wavelength equals Planck constant divided by momentum!'
        },
        {
          id: 'sfc-3',
          front: 'What is Snell’s Law of Refraction?',
          back: 'n₁ · sin(θ₁) = n₂ · sin(θ₂)',
          mnemonic: '📐 Refractive index times angle sine stays equal across boundary.'
        }
      ]
    },
    {
      id: 'deck-sample-2',
      title: 'Chemistry Organic Reactions Cheatsheet',
      subject: 'Chemistry',
      createdAt: 'Today',
      cards: [
        {
          id: 'sfc-4',
          front: 'What reagent converts Alcohols into Alkyl Chlorides rapidly?',
          back: 'Thionyl Chloride (SOCl₂) or Phosphorus Pentachloride (PCl₅)',
          mnemonic: '🧪 SOCl₂ gives gaseous SO₂ and HCl byproducts!'
        },
        {
          id: 'sfc-5',
          front: 'What is Markovnikov’s Rule in Hydrohalogenation?',
          back: 'Electrophilic H+ adds to the alkene carbon with MORE hydrogen atoms (Rich gets richer!).',
          mnemonic: '👑 "The H goes where H already is!"'
        }
      ]
    }
  ];

  const handleGenerateDeck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setMasteredCards({});

    const targetTopic = topic || `${subject} Essential Flashcards`;

    const fallbackDeck: FlashcardDeck = {
      id: 'deck-' + Date.now(),
      title: `${targetTopic}`,
      subject: subject || 'General',
      createdAt: 'Just now',
      cards: [
        {
          id: 'fc-1',
          front: `What is the core definition of ${targetTopic}?`,
          back: `The fundamental concept governing ${targetTopic}, establishing how inputs transform into predictable outcomes.`,
          mnemonic: '💡 Keep cause and effect in balance!'
        },
        {
          id: 'fc-2',
          front: `What key formula or principle is required for ${targetTopic}?`,
          back: `Primary Relation: Result = (Variable A × Factor B) / Delta. Always verify SI unit alignment.`,
          mnemonic: '🔢 Double check standard units!'
        },
        {
          id: 'fc-3',
          front: `What is the most frequent exam trap in ${subject}?`,
          back: `Ignoring boundary conditions or unit conversions. Always check sign conventions and initial states.`,
          mnemonic: '⚠️ Watch for negative signs and unit mismatches!'
        },
        {
          id: 'fc-4',
          front: `3-Step Method to solve numerical problems in ${targetTopic}?`,
          back: `1. Identify Given & Target values\n2. Write governing formula\n3. Substitute SI values cleanly.`,
          mnemonic: '🎯 Given → Formula → Calculate'
        },
        {
          id: 'fc-5',
          front: `Quick Recall: Summary of ${targetTopic} in 1 Sentence`,
          back: `${targetTopic} coordinates system variables to maintain balance while adhering to fundamental conservation laws.`,
          mnemonic: '⚡ 1-Sentence Master Summary'
        }
      ]
    };

    try {
      const res = await fetch('/api/flashcards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          subject,
          cardCount,
        }),
      });
      const data = await res.json();
      if (data && data.cards && Array.isArray(data.cards) && data.cards.length > 0) {
        setCurrentDeck(data);
      } else {
        setCurrentDeck(fallbackDeck);
      }
      if (onAddXP) onAddXP(30);
    } catch (err) {
      console.error('Flashcard deck generation error:', err);
      setCurrentDeck(fallbackDeck);
      if (onAddXP) onAddXP(30);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMastered = (cardId: string) => {
    setMasteredCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const handleShuffle = () => {
    if (!currentDeck) return;
    const shuffledCards = [...currentDeck.cards].sort(() => Math.random() - 0.5);
    setCurrentDeck({ ...currentDeck, cards: shuffledCards });
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const activeCard: Flashcard | undefined = currentDeck?.cards[currentCardIndex];
  const masteredCount = Object.values(masteredCards).filter(Boolean).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white overflow-hidden shadow-xl border border-teal-800/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-black uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-emerald-300" />
            <span>Active Recall & Spaced Repetition</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            AI Study Flashcards 🎴
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl font-medium leading-relaxed">
            Turn complex formulas, definitions & exam concepts into bite-sized 3D flip cards with built-in memory hooks!
          </p>
        </div>
      </div>

      {/* Generator Form if no deck active */}
      {!currentDeck && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
          <form onSubmit={handleGenerateDeck} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Subject Name
                </label>
                <input
                  type="text"
                  placeholder="Type any subject (e.g. Organic Chemistry, Calculus, History...)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
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
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Topic */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-emerald-600" />
                  Topic / Chapter (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electromagnetic Waves, Periodic Trends, Derivatives..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-semibold text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin text-emerald-200" />
                  <span>Generating AI Flashcard Deck...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Deck (+30 XP)</span>
                </>
              )}
            </button>
          </form>

          {/* Sample Decks */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              ⚡ Or Study Quick Starter Decks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sampleDecks.map((deck) => (
                <div
                  key={deck.id}
                  onClick={() => {
                    setCurrentDeck(deck);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                    setMasteredCards({});
                  }}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-400 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {deck.subject}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {deck.cards.length} Cards
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {deck.title}
                  </h4>
                  <div className="mt-3 flex items-center text-xs font-bold text-emerald-700 gap-1">
                    <span>Open Deck</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Deck Player */}
      {currentDeck && activeCard && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
          {/* Deck Top Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] uppercase">
                {currentDeck.subject}
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                {currentDeck.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
                title="Shuffle Deck"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Shuffle</span>
              </button>
              <button
                onClick={() => setCurrentDeck(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Close Deck
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Card {currentCardIndex + 1} of {currentDeck.cards.length}</span>
            <span className="text-emerald-700 font-extrabold">
              Mastered: {masteredCount} / {currentDeck.cards.length}
            </span>
          </div>

          {/* 3D Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-[320px] sm:h-[300px] cursor-pointer select-none"
            style={{ perspective: 1000 }}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full h-full rounded-3xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* FRONT FACE */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white hover:border-emerald-400 shadow-sm flex flex-col justify-between"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                {/* Card Badge & Hint */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="uppercase tracking-wider font-extrabold text-emerald-600 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    Question / Prompt
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                    <RotateCw className="w-3.5 h-3.5 text-slate-400" /> Click card to flip
                  </span>
                </div>

                {/* Card Center Content */}
                <div className="py-4 text-center my-auto">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug max-w-xl mx-auto">
                    {activeCard.front}
                  </h3>
                </div>

                {/* Card Bottom Status */}
                <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <span>RiseBuddy AI Flashcard</span>
                  <span className="text-emerald-600 font-black">Front Side</span>
                </div>
              </div>

              {/* BACK FACE */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white shadow-md flex flex-col justify-between"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                {/* Card Badge & Hint */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="uppercase tracking-wider font-extrabold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Answer & Breakdown
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                    <RotateCw className="w-3.5 h-3.5 text-slate-400" /> Click card to flip
                  </span>
                </div>

                {/* Card Center Content */}
                <div className="py-2 text-center space-y-3 my-auto">
                  <p className="text-base sm:text-lg font-black text-slate-900 leading-relaxed max-w-xl mx-auto">
                    {activeCard.back}
                  </p>
                  {activeCard.mnemonic && (
                    <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-300/80 text-xs font-bold text-amber-900 inline-flex items-center gap-2 max-w-xl text-left shadow-sm">
                      <span className="text-base shrink-0">💡</span>
                      <span>{activeCard.mnemonic}</span>
                    </div>
                  )}
                </div>

                {/* Card Bottom Status */}
                <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <span>RiseBuddy AI Flashcard</span>
                  <span className="text-emerald-700 font-black">Back Side</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Deck Player Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex((prev) => Math.max(0, prev - 1));
              }}
              disabled={currentCardIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 disabled:opacity-40 transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Mastered Toggle Button */}
            <button
              onClick={() => handleToggleMastered(activeCard.id)}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
                masteredCards[activeCard.id]
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{masteredCards[activeCard.id] ? 'Mastered ✓' : 'Mark as Mastered'}</span>
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex((prev) => Math.min(currentDeck.cards.length - 1, prev + 1));
              }}
              disabled={currentCardIndex === currentDeck.cards.length - 1}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm disabled:opacity-40 transition-all flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
