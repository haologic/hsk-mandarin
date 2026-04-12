import { useState, useMemo } from 'react'
import { hskData } from '../data'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, BookOpen, X } from 'lucide-react'

const colorMap = {
  vermillion: { accent: '#c23a22', bg: 'bg-red-50', badge: 'bg-red-100 text-red-800', ring: 'ring-red-200' },
  gold: { accent: '#d4a017', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800', ring: 'ring-yellow-200' },
  jade: { accent: '#2d8a56', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-800', ring: 'ring-emerald-200' },
}

function GrammarCard({ item, index, accent }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.055, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow-sm border border-[#f5f0eb] overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#faf8f5] transition-colors duration-150 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Number badge */}
          <span
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: accent }}
          >
            {index + 1}
          </span>
          <span className="font-semibold text-[#1a1a2e] text-sm sm:text-base leading-snug">
            {item.title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 space-y-4">
              {/* Pattern callout */}
              <div
                className="rounded-xl px-4 py-3 bg-[#faf8f5] border-l-4"
                style={{ borderLeftColor: accent }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Pola Kalimat</p>
                <p className="font-mono font-bold text-[#1a1a2e] text-sm sm:text-base">{item.pattern}</p>
              </div>

              {/* Explanation */}
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.explanation}</p>

              {/* Examples */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Contoh</p>
                {item.examples.map((ex, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="pl-3 border-l-2 border-gray-200"
                  >
                    <p className="text-base sm:text-lg font-medium text-[#1a1a2e] leading-snug">{ex.zh}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{ex.id}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Grammar() {
  const { level } = useParams()
  const levelNum = parseInt(level)
  const data = hskData[levelNum]
  const grammar = data?.grammar ?? []

  const colorKey = data?.color ?? 'vermillion'
  const { accent } = colorMap[colorKey] ?? colorMap.vermillion

  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return grammar
    return grammar.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.pattern.toLowerCase().includes(q) ||
        g.explanation.toLowerCase().includes(q) ||
        g.examples.some((e) => e.zh.includes(q) || e.id.toLowerCase().includes(q))
    )
  }, [grammar, search])

  if (!data) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <p className="text-gray-500">Level tidak ditemukan.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: accent }} />

      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 text-xs text-gray-400 mb-6 flex-wrap"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-gray-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <Link to={`/hsk/${level}`} className="hover:text-gray-600 transition-colors">
            HSK {level}
          </Link>
          <span>/</span>
          <span className="text-[#1a1a2e] font-medium">Tata Bahasa</span>
        </motion.nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: accent }}
            >
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] leading-tight">Tata Bahasa</h1>
              <p className="text-sm text-gray-500">{data.label} · {data.sublabel}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3 ml-13">
            {grammar.length} pola tata bahasa · Klik kartu untuk memperluas
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="relative mb-6"
        >
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pola, kata kunci, atau contoh…"
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#f5f0eb] bg-white text-sm text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-2 transition-shadow shadow-sm"
            style={{ '--tw-ring-color': `${accent}40` }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Hapus pencarian"
            >
              <X size={16} />
            </button>
          )}
        </motion.div>

        {/* Results count */}
        <AnimatePresence mode="wait">
          {search && (
            <motion.p
              key="count"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-gray-400 mb-4"
            >
              {filtered.length} hasil untuk &ldquo;{search}&rdquo;
            </motion.p>
          )}
        </AnimatePresence>

        {/* Grammar cards */}
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              filtered.map((item, index) => (
                <GrammarCard
                  key={item.title + index}
                  item={item}
                  index={index}
                  accent={accent}
                />
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 text-gray-400"
              >
                <Search size={36} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">Tidak ada hasil ditemukan</p>
                <p className="text-sm mt-1">Coba kata kunci yang berbeda</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer space */}
        <div className="h-12" />
      </div>
    </div>
  )
}
