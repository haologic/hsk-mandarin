import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, FileText, PenTool, GraduationCap, Flame, Star } from 'lucide-react'
import { hskData, getProgress, getOverallStats } from '../data'

// Per-level color config
const levelTheme = {
  vermillion: {
    accent: 'text-vermillion',
    bg: 'bg-vermillion',
    bgLight: 'bg-vermillion/10',
    border: 'border-vermillion/20',
    bar: 'bg-vermillion',
    badgeBg: 'bg-vermillion/10',
    badgeText: 'text-vermillion',
    btnHover: 'hover:bg-vermillion hover:text-white',
    shadow: 'hover:shadow-vermillion/20',
  },
  gold: {
    accent: 'text-gold',
    bg: 'bg-gold',
    bgLight: 'bg-gold/10',
    border: 'border-gold/20',
    bar: 'bg-gold',
    badgeBg: 'bg-gold/10',
    badgeText: 'text-gold',
    btnHover: 'hover:bg-gold hover:text-white',
    shadow: 'hover:shadow-gold/20',
  },
  jade: {
    accent: 'text-jade',
    bg: 'bg-jade',
    bgLight: 'bg-jade/10',
    border: 'border-jade/20',
    bar: 'bg-jade',
    badgeBg: 'bg-jade/10',
    badgeText: 'text-jade',
    btnHover: 'hover:bg-jade hover:text-white',
    shadow: 'hover:shadow-jade/20',
  },
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

const headerVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function ProgressBar({ value, max, colorClass }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="w-full h-1.5 bg-ink/8 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${colorClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
      />
    </div>
  )
}

function StatPill({ label, value, colorClass }) {
  return (
    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      <span>{value}</span>
      <span className="opacity-70">{label}</span>
    </div>
  )
}

function LevelCard({ level, data, progress, theme }) {
  const totalVocab = data.vocab.length
  const totalBabs = data.soal.length
  const totalGrammar = data.grammar.length
  const learnedVocab = progress.learnedVocab.length
  const completedBabs = progress.completedBabs.length

  const vocabPct = totalVocab > 0 ? Math.min(100, Math.round((learnedVocab / totalVocab) * 100)) : 0
  const quizPct = totalBabs > 0 ? Math.min(100, Math.round((completedBabs / totalBabs) * 100)) : 0

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5, transition: { duration: 0.22, ease: 'easeOut' } }}
      className={`
        relative overflow-hidden rounded-2xl bg-white border ${theme.border}
        shadow-sm hover:shadow-xl ${theme.shadow}
        transition-shadow duration-300 flex flex-col
      `}
    >
      {/* Big background hanzi */}
      <div
        className={`
          font-chinese absolute -top-4 -right-3 text-[9rem] font-black leading-none
          select-none pointer-events-none ${theme.accent} opacity-[0.06]
        `}
        aria-hidden="true"
      >
        {data.hanzi}
      </div>

      {/* Top accent bar */}
      <div className={`h-1 w-full ${theme.bg} rounded-t-2xl`} />

      <div className="flex flex-col flex-1 p-5 pt-4 gap-4">

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-chinese text-2xl font-bold ${theme.accent}`}>{data.hanzi}</span>
              <div>
                <p className="text-sm font-semibold text-ink leading-tight">{data.label}</p>
                <p className={`text-xs font-medium ${theme.accent} opacity-80`}>{data.sublabel}</p>
              </div>
            </div>
          </div>
          {/* Overall completion badge */}
          <div className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${theme.badgeBg} ${theme.badgeText}`}>
            {vocabPct}%
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-charcoal/70 leading-relaxed line-clamp-2">
          {data.description}
        </p>

        {/* Stat pills */}
        <div className="flex flex-wrap gap-1.5">
          <StatPill label="kosakata" value={totalVocab} colorClass={`${theme.badgeBg} ${theme.badgeText}`} />
          <StatPill label="grammar" value={totalGrammar} colorClass={`${theme.badgeBg} ${theme.badgeText}`} />
          <StatPill label="bab soal" value={totalBabs} colorClass={`${theme.badgeBg} ${theme.badgeText}`} />
        </div>

        {/* Progress section */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-charcoal/60 font-medium">Kosakata</span>
              <span className={`text-xs font-semibold ${theme.accent}`}>
                {learnedVocab} / {totalVocab}
              </span>
            </div>
            <ProgressBar value={learnedVocab} max={totalVocab} colorClass={theme.bar} />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-charcoal/60 font-medium">Latihan Soal</span>
              <span className={`text-xs font-semibold ${theme.accent}`}>
                {completedBabs} / {totalBabs} bab
              </span>
            </div>
            <ProgressBar value={completedBabs} max={totalBabs} colorClass={theme.bar} />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-ink/6" />

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Link
            to={`/hsk/${level}/vocab`}
            className={`
              flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl
              border ${theme.border} text-charcoal/70 text-xs font-medium
              transition-all duration-200 ${theme.btnHover}
              hover:border-transparent hover:shadow-sm
            `}
          >
            <BookOpen size={15} strokeWidth={2} />
            <span>Kosakata</span>
          </Link>
          <Link
            to={`/hsk/${level}/grammar`}
            className={`
              flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl
              border ${theme.border} text-charcoal/70 text-xs font-medium
              transition-all duration-200 ${theme.btnHover}
              hover:border-transparent hover:shadow-sm
            `}
          >
            <FileText size={15} strokeWidth={2} />
            <span>Grammar</span>
          </Link>
          <Link
            to={`/hsk/${level}/quiz`}
            className={`
              flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl
              border ${theme.border} text-charcoal/70 text-xs font-medium
              transition-all duration-200 ${theme.btnHover}
              hover:border-transparent hover:shadow-sm
            `}
          >
            <PenTool size={15} strokeWidth={2} />
            <span>Latihan</span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const stats = useMemo(() => getOverallStats(), [])

  const levels = useMemo(
    () =>
      [1, 2, 3, 4].map((level) => ({
        level,
        data: hskData[level],
        progress: getProgress(level),
        theme: levelTheme[hskData[level].color] ?? levelTheme.vermillion,
      })),
    []
  )

  // Total possible vocab + babs across all levels
  const totalPossibleVocab = useMemo(
    () => Object.values(hskData).reduce((sum, d) => sum + d.vocab.length, 0),
    []
  )
  const totalPossibleBabs = useMemo(
    () => Object.values(hskData).reduce((sum, d) => sum + d.soal.length, 0),
    []
  )

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Welcome Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          {/* Greeting row */}
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-vermillion/10 flex items-center justify-center">
              <GraduationCap size={18} className="text-vermillion" strokeWidth={2} />
            </div>
            <span className="text-sm font-medium text-charcoal/50 tracking-wide uppercase">
              Dasbor Belajar
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-1">
            Selamat Belajar!{' '}
            <span className="font-chinese text-vermillion">加油</span>
          </h1>
          <p className="text-charcoal/60 text-sm sm:text-base mb-7">
            Pilih level HSK dan mulai perjalanan Mandarin kamu hari ini.
          </p>

          {/* Overall stats strip */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2.5 bg-white border border-ink/8 rounded-2xl px-4 py-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-vermillion/10 flex items-center justify-center">
                <BookOpen size={15} className="text-vermillion" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-lg font-bold text-ink leading-none">
                  {stats.totalVocabLearned}
                  <span className="text-xs font-normal text-charcoal/40 ml-1">/ {totalPossibleVocab}</span>
                </p>
                <p className="text-xs text-charcoal/50 mt-0.5">Kosakata dipelajari</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-white border border-ink/8 rounded-2xl px-4 py-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-jade/10 flex items-center justify-center">
                <PenTool size={15} className="text-jade" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-lg font-bold text-ink leading-none">
                  {stats.totalQuizzesDone}
                  <span className="text-xs font-normal text-charcoal/40 ml-1">/ {totalPossibleBabs} bab</span>
                </p>
                <p className="text-xs text-charcoal/50 mt-0.5">Latihan diselesaikan</p>
              </div>
            </div>

            {stats.totalQuizzesDone > 0 && (
              <div className="flex items-center gap-2.5 bg-white border border-ink/8 rounded-2xl px-4 py-3 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Star size={15} className="text-gold" strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-lg font-bold text-ink leading-none">
                    {stats.totalQuizzesDone > 0
                      ? Math.round(stats.totalScore / stats.totalQuizzesDone)
                      : 0}
                    <span className="text-xs font-normal text-charcoal/40 ml-0.5">%</span>
                  </p>
                  <p className="text-xs text-charcoal/50 mt-0.5">Rata-rata skor</p>
                </div>
              </div>
            )}

            {stats.totalVocabLearned === 0 && stats.totalQuizzesDone === 0 && (
              <div className="flex items-center gap-2.5 bg-vermillion/5 border border-vermillion/15 rounded-2xl px-4 py-3">
                <Flame size={16} className="text-vermillion" strokeWidth={2} />
                <p className="text-sm text-vermillion font-medium">
                  Mulai belajar untuk melihat progresmu!
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Section label */}
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-base font-semibold text-ink">Level HSK</h2>
          <div className="flex-1 h-px bg-ink/8" />
          <span className="text-xs text-charcoal/40">4 level tersedia</span>
        </div>

        {/* Level Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {levels.map(({ level, data, progress, theme }) => (
            <LevelCard
              key={level}
              level={level}
              data={data}
              progress={progress}
              theme={theme}
            />
          ))}
        </motion.div>

        {/* Footer nudge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-center text-xs text-charcoal/35 mt-10"
        >
          每天学一点，进步看得见 · Sedikit demi sedikit, kemajuan terlihat nyata.
        </motion.p>
      </div>
    </div>
  )
}
