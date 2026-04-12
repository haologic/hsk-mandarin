import { useState, useEffect, useCallback, useRef } from 'react'
import { hskData, getProgress, saveProgress } from '../data'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  ChevronLeft,
  Trophy,
  BookOpen,
  LayoutGrid,
  RefreshCw,
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const colorMap = {
  vermillion: { accent: '#c23a22', light: '#fdf2f0', ring: 'focus:ring-red-300' },
  gold:       { accent: '#d4a017', light: '#fdf9ec', ring: 'focus:ring-yellow-300' },
  jade:       { accent: '#2d8a56', light: '#edf7f2', ring: 'focus:ring-emerald-300' },
}

// ─── Circular progress SVG ───────────────────────────────────────────────────

function CircularProgress({ pct, score, total, accent }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="136" height="136" className="-rotate-90">
        <circle cx="68" cy="68" r={r} fill="none" stroke="#f5f0eb" strokeWidth="10" />
        <motion.circle
          cx="68"
          cy="68"
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute text-center">
        <motion.p
          className="text-3xl font-bold text-[#1a1a2e]"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          {score}
        </motion.p>
        <p className="text-xs text-gray-400">dari {total}</p>
      </div>
    </div>
  )
}

// ─── Option button ─────────────────────────────────────────────────────────

function OptionButton({ label, index, selected, correct, answered, onClick, accent }) {
  let state = 'idle'
  if (answered) {
    if (index === correct) state = 'correct'
    else if (index === selected) state = 'wrong'
  } else if (index === selected) state = 'selected'

  const styles = {
    idle:     'bg-white border-[#f5f0eb] text-[#1a1a2e] hover:border-gray-300 hover:shadow-sm',
    selected: 'border-2 text-white shadow-md',
    correct:  'bg-[#edf7f2] border-[#2d8a56] text-[#2d8a56] border-2',
    wrong:    'bg-[#fdf2f0] border-[#c23a22]  text-[#c23a22]  border-2',
  }

  const icons = {
    correct: <CheckCircle2 size={18} className="shrink-0 text-[#2d8a56]" />,
    wrong:   <XCircle     size={18} className="shrink-0 text-[#c23a22]"  />,
  }

  return (
    <motion.button
      onClick={() => !answered && onClick(index)}
      disabled={answered}
      whileHover={!answered ? { scale: 1.015 } : {}}
      whileTap={!answered ? { scale: 0.98 } : {}}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all duration-200 disabled:cursor-default ${styles[state]}`}
      style={state === 'selected' ? { backgroundColor: accent, borderColor: accent } : {}}
    >
      <span
        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
          state === 'idle'     ? 'border-gray-300 text-gray-400'            :
          state === 'selected' ? 'border-white/40 text-white bg-white/20'   :
          state === 'correct'  ? 'border-[#2d8a56] text-[#2d8a56]'          :
                                 'border-[#c23a22] text-[#c23a22]'
        }`}
      >
        {String.fromCharCode(65 + index)}
      </span>
      <span className="flex-1 leading-snug">{label}</span>
      {(state === 'correct' || state === 'wrong') && icons[state]}
    </motion.button>
  )
}

// ─── Type C — word arrangement ─────────────────────────────────────────────

function TypeCQuestion({ question, onAnswer }) {
  const [pool, setPool]     = useState(() => question.words.map((w, i) => ({ w, id: i })))
  const [arranged, setArr]  = useState([])
  const [checked, setChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // reset when question changes
  useEffect(() => {
    setPool(question.words.map((w, i) => ({ w, id: i })))
    setArr([])
    setChecked(false)
    setIsCorrect(false)
  }, [question])

  const addWord = (item) => {
    if (checked) return
    setPool((p) => p.filter((x) => x.id !== item.id))
    setArr((a) => [...a, item])
  }

  const removeWord = (item) => {
    if (checked) return
    setArr((a) => a.filter((x) => x.id !== item.id))
    setPool((p) => [...p, item])
  }

  const reset = () => {
    if (checked) return
    setPool(question.words.map((w, i) => ({ w, id: i })))
    setArr([])
  }

  const checkAnswer = () => {
    if (arranged.length === 0 || checked) return
    const userSentence = arranged.map((x) => x.w).join('')
    // Compare stripping trailing punctuation for leniency
    const normalize = (s) => s.replace(/[。，！？]/g, '').trim()
    const correct = normalize(userSentence) === normalize(question.answer)
    setIsCorrect(correct)
    setChecked(true)
    onAnswer(correct)
  }

  const full = arranged.length === question.words.length

  return (
    <div className="space-y-5">
      {/* Answer area */}
      <div className="min-h-[56px] rounded-xl border-2 border-dashed border-gray-200 bg-[#faf8f5] px-4 py-3 flex flex-wrap gap-2 items-center">
        {arranged.length === 0 ? (
          <span className="text-sm text-gray-400">Susun kata-kata di sini…</span>
        ) : (
          arranged.map((item, i) => (
            <motion.button
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => removeWord(item)}
              disabled={checked}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-colors
                ${checked
                  ? isCorrect
                    ? 'bg-[#edf7f2] border-[#2d8a56] text-[#2d8a56] cursor-default'
                    : 'bg-[#fdf2f0] border-[#c23a22] text-[#c23a22] cursor-default'
                  : 'bg-white border-gray-200 text-[#1a1a2e] hover:border-red-300 hover:bg-red-50 cursor-pointer'
                }`}
            >
              {item.w}
            </motion.button>
          ))
        )}
      </div>

      {/* Correct answer reveal */}
      {checked && !isCorrect && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-500 bg-[#edf7f2] rounded-xl px-4 py-3 border border-[#2d8a56]/20"
        >
          <span className="font-semibold text-[#2d8a56]">Jawaban yang benar: </span>
          <span className="text-[#1a1a2e]">{question.answer}</span>
        </motion.div>
      )}

      {/* Word pool */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {pool.map((item) => (
            <motion.button
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => addWord(item)}
              disabled={checked}
              className="px-3 py-2 rounded-lg border-2 border-[#f5f0eb] bg-white text-[#1a1a2e] text-sm font-medium shadow-sm hover:border-gray-300 hover:shadow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-default"
            >
              {item.w}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {!checked && (
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} />
            Reset
          </button>
          <button
            onClick={checkAnswer}
            disabled={!full}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: '#1a1a2e' }}
          >
            Periksa Jawaban
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Quiz Screen ──────────────────────────────────────────────────────────

function QuizScreen({ bab, levelData, onFinish, accent }) {
  const questions = bab.questions
  const total     = questions.length

  const [current,   setCurrent]   = useState(0)
  const [selected,  setSelected]  = useState(null)   // for A/B
  const [answered,  setAnswered]  = useState(false)
  const [correct,   setCorrect]   = useState(false)
  const [score,     setScore]     = useState(0)
  const [typeCDone, setTypeCDone] = useState(false)  // for C
  const [typeCOk,   setTypeCOk]   = useState(false)

  const autoRef = useRef(null)

  const q = questions[current]

  // Clear auto-advance timer on unmount
  useEffect(() => () => clearTimeout(autoRef.current), [])

  const handleABAnswer = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const ok = idx === q.correct
    setCorrect(ok)
    if (ok) setScore((s) => s + 1)

    if (ok) {
      autoRef.current = setTimeout(() => advance(), 1500)
    }
  }

  const handleCAnswer = (ok) => {
    setTypeCDone(true)
    setTypeCOk(ok)
    if (ok) {
      setScore((s) => s + 1)
      autoRef.current = setTimeout(() => advance(), 1500)
    }
  }

  const advance = useCallback(() => {
    clearTimeout(autoRef.current)
    const next = current + 1
    if (next >= total) {
      onFinish(score + (answered && correct ? 0 : typeCDone && typeCOk ? 0 : 0), total)
      // score already updated via setScore; pass via callback with latest
    } else {
      setCurrent(next)
      setSelected(null)
      setAnswered(false)
      setCorrect(false)
      setTypeCDone(false)
      setTypeCOk(false)
    }
  }, [current, total, score, answered, correct, typeCDone, typeCOk, onFinish])

  // Finish: pass current score snapshot correctly
  // We use a ref to always have fresh score
  const scoreRef = useRef(0)
  useEffect(() => { scoreRef.current = score }, [score])

  const handleFinish = () => {
    onFinish(scoreRef.current, total)
  }

  const progressPct = ((current) / total) * 100

  const typeLabel = { A: 'Pilihan Ganda', B: 'Pemahaman Bacaan', C: 'Susun Kalimat' }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Soal {current + 1} / {total}</span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div className="h-2 rounded-full bg-[#f5f0eb] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: accent }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-[#f5f0eb] p-5 mb-4">
            {/* Type tag */}
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 text-white"
              style={{ backgroundColor: accent }}
            >
              {typeLabel[q.type]}
            </span>

            {/* Type B paragraph */}
            {q.type === 'B' && (
              <div className="bg-[#faf8f5] border border-[#f5f0eb] rounded-xl px-4 py-3 mb-4">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2 font-semibold text-[10px]">Teks Bacaan</p>
                <p className="text-base text-[#1a1a2e] leading-relaxed">{q.paragraph}</p>
              </div>
            )}

            {/* Type A/B text */}
            {(q.type === 'A' || q.type === 'B') && (
              <>
                <p className="text-xl sm:text-2xl font-bold text-[#1a1a2e] mb-1 leading-snug">{q.type === 'A' ? q.text : q.text}</p>
                <p className="text-sm text-gray-500 mb-5">{q.ask}</p>
              </>
            )}

            {/* Type C instruction */}
            {q.type === 'C' && (
              <p className="text-sm text-gray-600 mb-4 font-medium">
                Susun kata-kata berikut menjadi kalimat yang benar:
              </p>
            )}

            {/* Options: A & B */}
            {(q.type === 'A' || q.type === 'B') && (
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <OptionButton
                    key={i}
                    label={opt}
                    index={i}
                    selected={selected}
                    correct={q.correct}
                    answered={answered}
                    onClick={handleABAnswer}
                    accent={accent}
                  />
                ))}
              </div>
            )}

            {/* Type C */}
            {q.type === 'C' && (
              <TypeCQuestion question={q} onAnswer={handleCAnswer} />
            )}
          </div>

          {/* Feedback banner */}
          <AnimatePresence>
            {(answered && (q.type === 'A' || q.type === 'B')) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`rounded-xl px-4 py-3 mb-4 flex items-center gap-3 text-sm font-medium ${
                  correct
                    ? 'bg-[#edf7f2] border border-[#2d8a56]/30 text-[#2d8a56]'
                    : 'bg-[#fdf2f0] border border-[#c23a22]/30 text-[#c23a22]'
                }`}
              >
                {correct
                  ? <CheckCircle2 size={18} className="shrink-0" />
                  : <XCircle size={18} className="shrink-0" />
                }
                <span>
                  {correct
                    ? 'Benar! '
                    : `Jawaban yang benar: ${q.options[q.correct]}`
                  }
                </span>
              </motion.div>
            )}

            {typeCDone && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl px-4 py-3 mb-4 flex items-center gap-3 text-sm font-medium ${
                  typeCOk
                    ? 'bg-[#edf7f2] border border-[#2d8a56]/30 text-[#2d8a56]'
                    : 'bg-[#fdf2f0] border border-[#c23a22]/30 text-[#c23a22]'
                }`}
              >
                {typeCOk ? <CheckCircle2 size={18} className="shrink-0" /> : <XCircle size={18} className="shrink-0" />}
                <span>{typeCOk ? 'Benar! Susunan kalimat tepat!' : 'Kurang tepat.'}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lanjut button */}
          {((answered && !correct) || (typeCDone && !typeCOk)) && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={current + 1 >= total ? handleFinish : advance}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ backgroundColor: accent }}
            >
              {current + 1 >= total ? 'Lihat Hasil' : 'Lanjut'}
              <ArrowRight size={18} />
            </motion.button>
          )}

          {((answered && correct) || (typeCDone && typeCOk)) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-gray-400 py-1"
            >
              Otomatis lanjut…
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Results Screen ─────────────────────────────────────────────────────────

function ResultsScreen({ score, total, babTitle, onRetry, onBack, accent, level }) {
  const pct = Math.round((score / total) * 100)

  const message =
    pct >= 90 ? 'Luar biasa! Kamu sudah menguasai bab ini!'
    : pct >= 70 ? 'Bagus! Terus berlatih!'
    : 'Jangan menyerah! Coba lagi!'

  const grade =
    pct >= 90 ? 'A'
    : pct >= 80 ? 'B'
    : pct >= 70 ? 'C'
    : pct >= 60 ? 'D'
    : 'E'

  return (
    <div className="max-w-sm mx-auto px-4 py-10 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 150 }}
      >
        {/* Trophy */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex justify-center"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: accent }}
          >
            <Trophy size={32} className="text-white" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold text-[#1a1a2e] mb-1"
        >
          Kuis Selesai!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-400 mb-8"
        >
          {babTitle}
        </motion.p>

        {/* Circular */}
        <div className="flex justify-center mb-4">
          <CircularProgress pct={pct} score={score} total={total} accent={accent} />
        </div>

        {/* Grade + pct */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-2"
        >
          <span
            className="text-4xl font-black"
            style={{ color: accent }}
          >
            {pct}%
          </span>
          <span className="ml-2 text-lg font-bold text-gray-300">Grade {grade}</span>
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="text-sm text-gray-600 mb-10 leading-relaxed"
        >
          {message}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ backgroundColor: accent }}
          >
            <RotateCcw size={17} />
            Coba Lagi
          </button>
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[#1a1a2e] font-semibold bg-white border border-[#f5f0eb] shadow-sm hover:bg-[#faf8f5] active:scale-[0.98] transition-all"
          >
            <LayoutGrid size={17} />
            Pilih Bab Lain
          </button>
          <Link
            to={`/hsk/${level}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            <ChevronLeft size={15} />
            Kembali ke Level
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─── Bab Selector ─────────────────────────────────────────────────────────

function BabCard({ bab, progress, accent, onSelect, index }) {
  const scores   = progress.quizScores   ?? {}
  const completed = progress.completedBabs ?? []
  const isDone   = completed.includes(bab.bab)
  const best     = scores[bab.bab]
  const bestPct  = best != null ? Math.round((best / bab.questions.length) * 100) : null

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(bab)}
      className="relative bg-white rounded-2xl border border-[#f5f0eb] p-4 text-left shadow-sm transition-shadow flex flex-col gap-2"
    >
      {/* Done badge */}
      {isDone && (
        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#edf7f2] flex items-center justify-center">
          <CheckCircle2 size={12} className="text-[#2d8a56]" />
        </span>
      )}

      {/* Bab number */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold mb-1"
        style={{ backgroundColor: accent }}
      >
        {bab.bab}
      </div>

      <p className="text-xs font-semibold text-[#1a1a2e] leading-snug pr-5">{bab.title}</p>
      <p className="text-[10px] text-gray-400">{bab.questions.length} soal</p>

      {bestPct != null && (
        <div className="mt-1">
          <div className="flex justify-between text-[9px] text-gray-400 mb-0.5">
            <span>Skor terbaik</span>
            <span className="font-semibold" style={{ color: accent }}>{bestPct}%</span>
          </div>
          <div className="h-1 rounded-full bg-[#f5f0eb] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${bestPct}%`, backgroundColor: accent }}
            />
          </div>
        </div>
      )}
    </motion.button>
  )
}

// ─── Root component ────────────────────────────────────────────────────────

export default function Quiz() {
  const { level }   = useParams()
  const levelNum    = parseInt(level)
  const levelData   = hskData[levelNum]
  const babs        = levelData?.soal ?? []

  const colorKey = levelData?.color ?? 'vermillion'
  const { accent } = colorMap[colorKey] ?? colorMap.vermillion

  const [screen,       setScreen]       = useState('selector') // 'selector' | 'quiz' | 'results'
  const [activeBab,    setActiveBab]    = useState(null)
  const [lastScore,    setLastScore]    = useState(null)
  const [lastTotal,    setLastTotal]    = useState(null)
  const [progress,     setProgress]     = useState(() => (levelData ? getProgress(levelNum) : {}))

  if (!levelData) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <p className="text-gray-500">Level tidak ditemukan.</p>
      </div>
    )
  }

  const startBab = (bab) => {
    setActiveBab(bab)
    setScreen('quiz')
  }

  const finishQuiz = (score, total) => {
    setLastScore(score)
    setLastTotal(total)

    // Persist progress
    const updated = { ...progress }
    // Update score if better
    if (updated.quizScores == null) updated.quizScores = {}
    const prev = updated.quizScores[activeBab.bab] ?? -1
    if (score > prev) updated.quizScores[activeBab.bab] = score

    // Mark completed
    if (!updated.completedBabs) updated.completedBabs = []
    if (!updated.completedBabs.includes(activeBab.bab)) {
      updated.completedBabs = [...updated.completedBabs, activeBab.bab]
    }

    saveProgress(levelNum, updated)
    setProgress(updated)
    setScreen('results')
  }

  const retryBab = () => {
    setScreen('quiz')
  }

  const backToSelector = () => {
    setActiveBab(null)
    setScreen('selector')
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: accent }} />

      <AnimatePresence mode="wait">
        {screen === 'selector' && (
          <motion.div
            key="selector"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-2xl mx-auto px-4 py-6 sm:py-10"
          >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6 flex-wrap">
              <Link to="/" className="hover:text-gray-600 transition-colors">Dashboard</Link>
              <span>/</span>
              <Link to={`/hsk/${level}`} className="hover:text-gray-600 transition-colors">HSK {level}</Link>
              <span>/</span>
              <span className="text-[#1a1a2e] font-medium">Kuis</span>
            </nav>

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: accent }}
              >
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e]">Kuis</h1>
                <p className="text-sm text-gray-500">{levelData.label} · {levelData.sublabel}</p>
              </div>
            </div>

            {/* Bab grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {babs.map((bab, i) => (
                <BabCard
                  key={bab.bab}
                  bab={bab}
                  progress={progress}
                  accent={accent}
                  onSelect={startBab}
                  index={i}
                />
              ))}
            </div>

            <div className="h-12" />
          </motion.div>
        )}

        {screen === 'quiz' && activeBab && (
          <motion.div
            key={`quiz-${activeBab.bab}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Quiz nav */}
            <div className="max-w-xl mx-auto px-4 pt-5">
              <div className="flex items-center gap-3 mb-1">
                <button
                  onClick={backToSelector}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronLeft size={14} />
                  Pilih Bab
                </button>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs font-semibold text-[#1a1a2e]">{activeBab.title}</span>
              </div>
            </div>

            <QuizScreen
              key={`quizscreen-${activeBab.bab}`}
              bab={activeBab}
              levelData={levelData}
              onFinish={finishQuiz}
              accent={accent}
            />
          </motion.div>
        )}

        {screen === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ResultsScreen
              score={lastScore}
              total={lastTotal}
              babTitle={activeBab?.title ?? ''}
              onRetry={retryBab}
              onBack={backToSelector}
              accent={accent}
              level={level}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
