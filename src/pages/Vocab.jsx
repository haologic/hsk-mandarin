import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Table2,
  Layers,
  Search,
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Home,
  BookOpen,
  X,
  Filter,
} from 'lucide-react'
import { hskData, getProgress, saveProgress } from '../data'

// ─── Theme config ──────────────────────────────────────────────────────────────
const levelTheme = {
  vermillion: {
    accent: 'text-vermillion',
    bg: 'bg-vermillion',
    bgLight: 'bg-vermillion/10',
    border: 'border-vermillion/30',
    badgeBg: 'bg-vermillion/10',
    badgeText: 'text-vermillion',
    ring: 'ring-vermillion/40',
    gradFrom: 'from-vermillion/20',
  },
  gold: {
    accent: 'text-gold',
    bg: 'bg-gold',
    bgLight: 'bg-gold/10',
    border: 'border-gold/30',
    badgeBg: 'bg-gold/10',
    badgeText: 'text-gold',
    ring: 'ring-gold/40',
    gradFrom: 'from-gold/20',
  },
  jade: {
    accent: 'text-jade',
    bg: 'bg-jade',
    bgLight: 'bg-jade/10',
    border: 'border-jade/30',
    badgeBg: 'bg-jade/10',
    badgeText: 'text-jade',
    ring: 'ring-jade/40',
    gradFrom: 'from-jade/20',
  },
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Flashcard subcomponent ────────────────────────────────────────────────────
function Flashcard({ word, flipped, onFlip, theme }) {
  return (
    <div
      className="w-full max-w-md mx-auto cursor-pointer select-none"
      style={{ perspective: '1000px' }}
      onClick={onFlip}
    >
      <motion.div
        className="relative w-full"
        style={{
          transformStyle: 'preserve-3d',
          height: '320px',
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center bg-white shadow-2xl border border-ink/8 px-8"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div
            className={`absolute top-4 right-4 text-xs font-medium px-2.5 py-1 rounded-full ${theme.badgeBg} ${theme.badgeText}`}
          >
            Tap untuk balik
          </div>
          <span
            className="text-ink/20 text-xs absolute top-4 left-4 font-medium tracking-widest uppercase"
          >
            Hanzi
          </span>
          <p
            className="text-ink leading-none text-center"
            style={{ fontSize: '96px', fontFamily: '"Noto Serif SC", "Source Han Serif SC", serif', lineHeight: 1.1 }}
          >
            {word.hanzi}
          </p>
          <div className="absolute bottom-5 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? theme.bg : 'bg-ink/15'}`} />
            ))}
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center bg-paper shadow-2xl border border-ink/8 px-8 gap-3"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <p
            className="text-ink/50 text-xl tracking-widest font-medium"
            style={{ fontFamily: 'serif' }}
          >
            {word.pinyin}
          </p>
          <p className="text-ink text-2xl font-bold text-center leading-tight">
            {word.arti}
          </p>
          {word.contoh && (
            <div className={`w-full mt-2 rounded-xl px-4 py-3 ${theme.bgLight} border ${theme.border}`}>
              <p
                className="text-ink text-base text-center leading-snug"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                {word.contoh.zh}
              </p>
              <p className="text-ink/60 text-xs text-center mt-1 italic">{word.contoh.id}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Table Row ─────────────────────────────────────────────────────────────────
function VocabRow({ word, index, isLearned, onToggleLearn, theme }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <motion.tr
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.02, 0.4), duration: 0.3 }}
        className={`group border-b border-ink/6 hover:bg-ink/3 transition-colors cursor-pointer ${
          isLearned ? 'bg-jade/3' : ''
        }`}
        onClick={() => setExpanded((v) => !v)}
      >
        {/* No. */}
        <td className="pl-5 pr-2 py-3.5 text-ink/30 text-sm w-10">{index + 1}</td>

        {/* Hanzi */}
        <td className="px-3 py-3.5 w-24">
          <div className="flex items-center gap-2">
            {isLearned && (
              <CheckCircle2 size={14} className="text-jade shrink-0" />
            )}
            <span
              className="text-ink text-2xl"
              style={{ fontFamily: '"Noto Serif SC", "Source Han Serif SC", serif' }}
            >
              {word.hanzi}
            </span>
          </div>
        </td>

        {/* Pinyin */}
        <td className="px-3 py-3.5 text-ink/60 text-sm italic w-28">{word.pinyin}</td>

        {/* Arti */}
        <td className="px-3 py-3.5 text-ink text-sm font-medium">{word.arti}</td>

        {/* Example preview */}
        <td className="px-3 py-3.5 text-ink/40 text-xs hidden md:table-cell max-w-xs truncate">
          {word.contoh?.zh}
        </td>

        {/* Star */}
        <td
          className="pr-5 py-3.5 w-10"
          onClick={(e) => {
            e.stopPropagation()
            onToggleLearn(word.hanzi)
          }}
        >
          <button
            className={`p-1.5 rounded-full transition-all hover:scale-110 active:scale-95 ${
              isLearned
                ? 'text-jade bg-jade/10'
                : 'text-ink/20 hover:text-gold hover:bg-gold/10'
            }`}
            aria-label={isLearned ? 'Tandai belum hafal' : 'Tandai sudah hafal'}
          >
            <Star size={16} fill={isLearned ? 'currentColor' : 'none'} />
          </button>
        </td>
      </motion.tr>

      {/* Expanded example row */}
      <AnimatePresence>
        {expanded && word.contoh && (
          <motion.tr
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <td colSpan={6} className={`px-5 pb-4 pt-0`}>
              <div className={`rounded-xl px-4 py-3 ${theme.bgLight} border ${theme.border} ml-6`}>
                <p
                  className="text-ink text-base"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  {word.contoh.zh}
                </p>
                <p className="text-ink/50 text-sm mt-0.5 italic">{word.contoh.id}</p>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Mobile Card ───────────────────────────────────────────────────────────────
function VocabCard({ word, index, isLearned, onToggleLearn, theme }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.3 }}
      className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${
        isLearned ? 'border-jade/40' : 'border-ink/8'
      }`}
    >
      <div
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="text-ink/25 text-xs w-6 shrink-0">{index + 1}</span>
        <span
          className="text-2xl text-ink"
          style={{ fontFamily: '"Noto Serif SC", serif' }}
        >
          {word.hanzi}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-ink/50 text-xs italic">{word.pinyin}</p>
          <p className="text-ink text-sm font-medium truncate">{word.arti}</p>
        </div>
        {isLearned && <CheckCircle2 size={16} className="text-jade shrink-0" />}
        <button
          className={`p-2 rounded-full transition-all shrink-0 ${
            isLearned
              ? 'text-jade bg-jade/10'
              : 'text-ink/20 hover:text-gold hover:bg-gold/10'
          }`}
          onClick={(e) => {
            e.stopPropagation()
            onToggleLearn(word.hanzi)
          }}
        >
          <Star size={15} fill={isLearned ? 'currentColor' : 'none'} />
        </button>
      </div>

      <AnimatePresence>
        {expanded && word.contoh && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className={`mx-4 mb-3 rounded-xl px-4 py-3 ${theme.bgLight} border ${theme.border}`}>
              <p
                className="text-ink text-base"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                {word.contoh.zh}
              </p>
              <p className="text-ink/50 text-sm mt-0.5 italic">{word.contoh.id}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Vocab() {
  const { level } = useParams()
  const data = hskData[level]
  const vocab = data?.vocab ?? []
  const theme = levelTheme[data?.color] ?? levelTheme.vermillion

  // ── State ──
  const [mode, setMode] = useState('table') // 'table' | 'flashcard'
  const [search, setSearch] = useState('')
  const [learnedVocab, setLearnedVocab] = useState([])
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [flashFilter, setFlashFilter] = useState('all') // 'all' | 'unlearned' | 'learned'
  const [flashDeck, setFlashDeck] = useState([])
  const [isShuffled, setIsShuffled] = useState(false)
  const touchStartX = useRef(null)

  // ── Load progress ──
  useEffect(() => {
    const progress = getProgress(level)
    setLearnedVocab(progress.learnedVocab || [])
  }, [level])

  // ── Persist progress ──
  const persistLearnedVocab = useCallback(
    (newLearned) => {
      const progress = getProgress(level)
      saveProgress(level, { ...progress, learnedVocab: newLearned })
    },
    [level]
  )

  // ── Toggle learned ──
  const toggleLearn = useCallback(
    (hanzi) => {
      setLearnedVocab((prev) => {
        const next = prev.includes(hanzi)
          ? prev.filter((h) => h !== hanzi)
          : [...prev, hanzi]
        persistLearnedVocab(next)
        return next
      })
    },
    [persistLearnedVocab]
  )

  // ── Build flash deck based on filter ──
  useEffect(() => {
    let base = [...vocab]
    if (flashFilter === 'unlearned') base = base.filter((w) => !learnedVocab.includes(w.hanzi))
    if (flashFilter === 'learned') base = base.filter((w) => learnedVocab.includes(w.hanzi))
    const deck = isShuffled ? shuffle(base) : base
    setFlashDeck(deck)
    setCardIndex(0)
    setFlipped(false)
  }, [vocab, flashFilter, isShuffled, learnedVocab.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Filtered vocab for table ──
  const filteredVocab = useMemo(() => {
    if (!search.trim()) return vocab
    const q = search.toLowerCase()
    return vocab.filter(
      (w) =>
        w.hanzi.includes(q) ||
        w.pinyin.toLowerCase().includes(q) ||
        w.arti.toLowerCase().includes(q)
    )
  }, [vocab, search])

  // ── Flashcard navigation ──
  const goNext = useCallback(() => {
    setFlipped(false)
    setTimeout(() => setCardIndex((i) => Math.min(i + 1, flashDeck.length - 1)), 50)
  }, [flashDeck.length])

  const goPrev = useCallback(() => {
    setFlipped(false)
    setTimeout(() => setCardIndex((i) => Math.max(i - 1, 0)), 50)
  }, [])

  const markAndNext = useCallback(
    (learned) => {
      if (learned && flashDeck[cardIndex]) {
        const hanzi = flashDeck[cardIndex].hanzi
        if (!learnedVocab.includes(hanzi)) {
          const next = [...learnedVocab, hanzi]
          setLearnedVocab(next)
          persistLearnedVocab(next)
        }
      }
      goNext()
    },
    [flashDeck, cardIndex, learnedVocab, persistLearnedVocab, goNext]
  )

  // ── Swipe support ──
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
  }

  // ── Keyboard nav ──
  useEffect(() => {
    if (mode !== 'flashcard') return
    const handler = (e) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === ' ') {
        e.preventDefault()
        setFlipped((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mode, goNext, goPrev])

  if (!data) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-ink/50">Level tidak ditemukan.</p>
      </div>
    )
  }

  const currentWord = flashDeck[cardIndex]
  const learnedCount = learnedVocab.length
  const totalCount = vocab.length

  // ── Render ──
  return (
    <div className="min-h-screen bg-cream">
      {/* ── Header ── */}
      <div className={`bg-white border-b border-ink/8 sticky top-0 z-30`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-ink/40 mb-3">
            <Link to="/" className="hover:text-ink/70 transition-colors flex items-center gap-1">
              <Home size={12} />
              Dashboard
            </Link>
            <ChevronRight size={12} />
            <Link to={`/hsk/${level}`} className="hover:text-ink/70 transition-colors">
              HSK {level}
            </Link>
            <ChevronRight size={12} />
            <span className={theme.accent}>Kosakata</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Title */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={`w-11 h-11 rounded-xl ${theme.bg} flex items-center justify-center shrink-0 shadow-lg`}
              >
                <span
                  className="text-white text-xl"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  {data.hanzi}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-ink font-bold text-lg leading-tight">
                    Kosakata {data.label}
                  </h1>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText}`}
                  >
                    {data.sublabel}
                  </span>
                </div>
                <p className="text-ink/40 text-xs mt-0.5 truncate hidden sm:block">
                  {data.description}
                </p>
              </div>
            </div>

            {/* Stats pill */}
            <div className="flex items-center gap-3 shrink-0">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.bgLight} border ${theme.border}`}>
                <CheckCircle2 size={13} className="text-jade" />
                <span className="text-ink text-xs font-semibold">
                  {learnedCount}
                  <span className="text-ink/40 font-normal"> / {totalCount} dipelajari</span>
                </span>
              </div>

              {/* Mode toggle */}
              <div className="flex items-center bg-ink/6 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    mode === 'table'
                      ? `bg-white text-ink shadow-sm`
                      : 'text-ink/40 hover:text-ink/70'
                  }`}
                >
                  <Table2 size={14} />
                  <span className="hidden sm:inline">Tabel</span>
                </button>
                <button
                  onClick={() => setMode('flashcard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    mode === 'flashcard'
                      ? `bg-white text-ink shadow-sm`
                      : 'text-ink/40 hover:text-ink/70'
                  }`}
                >
                  <Layers size={14} />
                  <span className="hidden sm:inline">Flashcard</span>
                </button>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-ink/8 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${theme.bg}`}
              initial={{ width: 0 }}
              animate={{ width: `${totalCount ? (learnedCount / totalCount) * 100 : 0}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* ── Table Mode ── */}
      <AnimatePresence mode="wait">
        {mode === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="max-w-5xl mx-auto px-4 sm:px-6 py-6"
          >
            {/* Search */}
            <div className="relative mb-6">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30"
              />
              <input
                type="text"
                placeholder="Cari hanzi, pinyin, atau arti..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-ink/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-transparent transition-shadow"
                style={{ '--tw-ring-color': 'var(--color-vermillion, #c23a22)' }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition-colors"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {filteredVocab.length === 0 ? (
              <div className="text-center py-16 text-ink/30">
                <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">Tidak ada kata yang cocok.</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block bg-white rounded-2xl border border-ink/8 shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-ink/8 bg-ink/2">
                        <th className="pl-5 pr-2 py-3 text-left text-xs font-semibold text-ink/40 uppercase tracking-wider w-10">
                          #
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-ink/40 uppercase tracking-wider w-24">
                          Hanzi
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-ink/40 uppercase tracking-wider w-28">
                          Pinyin
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-ink/40 uppercase tracking-wider">
                          Arti
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-ink/40 uppercase tracking-wider hidden md:table-cell">
                          Contoh
                        </th>
                        <th className="pr-5 py-3 w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVocab.map((word, i) => (
                        <VocabRow
                          key={`${word.hanzi}-${i}`}
                          word={word}
                          index={i}
                          isLearned={learnedVocab.includes(word.hanzi)}
                          onToggleLearn={toggleLearn}
                          theme={theme}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden flex flex-col gap-2.5">
                  {filteredVocab.map((word, i) => (
                    <VocabCard
                      key={`${word.hanzi}-${i}`}
                      word={word}
                      index={i}
                      isLearned={learnedVocab.includes(word.hanzi)}
                      onToggleLearn={toggleLearn}
                      theme={theme}
                    />
                  ))}
                </div>

                {search && (
                  <p className="text-center text-ink/30 text-xs mt-6">
                    {filteredVocab.length} hasil untuk &quot;{search}&quot;
                  </p>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* ── Flashcard Mode ── */}
        {mode === 'flashcard' && (
          <motion.div
            key="flashcard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="max-w-lg mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6"
          >
            {/* Controls row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              {/* Filter */}
              <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-ink/8 shadow-sm">
                {[
                  { key: 'all', label: 'Semua' },
                  { key: 'unlearned', label: 'Belum' },
                  { key: 'learned', label: 'Sudah' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFlashFilter(f.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      flashFilter === f.key
                        ? `${theme.bg} text-white shadow-sm`
                        : 'text-ink/40 hover:text-ink/70'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Shuffle */}
              <button
                onClick={() => setIsShuffled((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  isShuffled
                    ? `${theme.bgLight} ${theme.accent} ${theme.border}`
                    : 'bg-white border-ink/10 text-ink/40 hover:text-ink/70'
                }`}
              >
                <Shuffle size={13} />
                Acak
              </button>
            </div>

            {/* Progress indicator */}
            {flashDeck.length > 0 ? (
              <>
                <div className="flex items-center justify-between text-xs text-ink/40">
                  <span className="font-medium text-ink/60">
                    <span className={`text-base font-bold ${theme.accent}`}>{cardIndex + 1}</span>
                    {' '}/{' '}{flashDeck.length}
                  </span>
                  <span>
                    {learnedCount} dipelajari
                  </span>
                </div>

                {/* Progress dots */}
                <div className="w-full h-1 bg-ink/8 rounded-full overflow-hidden -mt-3">
                  <motion.div
                    className={`h-full rounded-full ${theme.bg}`}
                    animate={{ width: `${((cardIndex + 1) / flashDeck.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Card */}
                <div
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <Flashcard
                    word={currentWord}
                    flipped={flipped}
                    onFlip={() => setFlipped((v) => !v)}
                    theme={theme}
                  />
                </div>

                {/* Hint */}
                <p className="text-center text-ink/25 text-xs -mt-2">
                  {flipped ? 'Swipe atau gunakan tombol panah' : 'Tap kartu untuk melihat jawaban'}
                </p>

                {/* Action buttons after flip */}
                <AnimatePresence>
                  {flipped ? (
                    <motion.div
                      key="actions"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-3"
                    >
                      <button
                        onClick={() => markAndNext(false)}
                        className="flex-1 py-3.5 rounded-2xl bg-vermillion/10 text-vermillion font-semibold text-sm hover:bg-vermillion hover:text-white active:scale-95 transition-all border border-vermillion/20"
                      >
                        Belum Hafal
                      </button>
                      <button
                        onClick={() => markAndNext(true)}
                        className="flex-1 py-3.5 rounded-2xl bg-jade/10 text-jade font-semibold text-sm hover:bg-jade hover:text-white active:scale-95 transition-all border border-jade/20"
                      >
                        Sudah Hafal
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="nav"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between gap-3"
                    >
                      <button
                        onClick={goPrev}
                        disabled={cardIndex === 0}
                        className="flex items-center gap-1.5 px-5 py-3 rounded-2xl border border-ink/10 bg-white text-ink/60 text-sm font-medium disabled:opacity-25 hover:bg-ink/5 active:scale-95 transition-all"
                      >
                        <ChevronLeft size={16} />
                        Prev
                      </button>
                      <button
                        onClick={() => setFlipped(true)}
                        className={`flex-1 py-3 rounded-2xl ${theme.bg} text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md`}
                      >
                        Balik Kartu
                      </button>
                      <button
                        onClick={goNext}
                        disabled={cardIndex === flashDeck.length - 1}
                        className="flex items-center gap-1.5 px-5 py-3 rounded-2xl border border-ink/10 bg-white text-ink/60 text-sm font-medium disabled:opacity-25 hover:bg-ink/5 active:scale-95 transition-all"
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="text-center py-16">
                <div className={`w-16 h-16 rounded-2xl ${theme.bgLight} flex items-center justify-center mx-auto mb-4`}>
                  <Layers size={28} className={theme.accent} />
                </div>
                <p className="text-ink font-semibold mb-1">Tidak ada kartu</p>
                <p className="text-ink/40 text-sm">
                  {flashFilter === 'unlearned'
                    ? 'Semua kata sudah dipelajari!'
                    : flashFilter === 'learned'
                    ? 'Belum ada kata yang dipelajari.'
                    : 'Tidak ada kosakata tersedia.'}
                </p>
                {flashFilter !== 'all' && (
                  <button
                    onClick={() => setFlashFilter('all')}
                    className={`mt-4 px-4 py-2 rounded-xl text-sm font-medium ${theme.bgLight} ${theme.accent} border ${theme.border}`}
                  >
                    Tampilkan Semua
                  </button>
                )}
              </div>
            )}

            {/* Reset progress */}
            {learnedCount > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Reset semua progress kosakata di level ini?')) {
                    setLearnedVocab([])
                    persistLearnedVocab([])
                  }
                }}
                className="flex items-center gap-1.5 mx-auto text-xs text-ink/25 hover:text-vermillion transition-colors py-1"
              >
                <RotateCcw size={11} />
                Reset progress
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
