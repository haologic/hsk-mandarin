import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Menu, X, BookOpen, GraduationCap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Dashboard', to: '/dashboard', icon: BookOpen },
]

function LevelLinks({ level }) {
  if (!level) return null
  return (
    <>
      <Link
        to={`/hsk/${level}/vocab`}
        className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-[#c23a22]/10 hover:text-[#c23a22] text-[#2d2d3f]"
      >
        <BookOpen size={14} />
        <span>HSK {level} Vocab</span>
      </Link>
      <Link
        to={`/hsk/${level}/grammar`}
        className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-[#2d8a56]/10 hover:text-[#2d8a56] text-[#2d2d3f]"
      >
        <BookOpen size={14} />
        <span>Grammar</span>
      </Link>
      <Link
        to={`/hsk/${level}/quiz`}
        className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-[#d4a017]/10 hover:text-[#d4a017] text-[#2d2d3f]"
      >
        <GraduationCap size={14} />
        <span>Quiz</span>
      </Link>
    </>
  )
}

export default function Navbar() {
  const location = useLocation()
  const params = useParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Extract level from any /hsk/:level/* route
  const levelMatch = location.pathname.match(/\/hsk\/(\d+)\//)
  const currentLevel = levelMatch ? levelMatch[1] : null

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY
    setScrolled(currentY > 12)
    if (currentY < 60) {
      setVisible(true)
    } else if (currentY > lastScrollY + 4) {
      setVisible(false)
      setMobileOpen(false)
    } else if (currentY < lastScrollY - 4) {
      setVisible(true)
    }
    setLastScrollY(currentY)
  }, [lastScrollY])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isActive = (to) => location.pathname === to

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={[
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-300',
        scrolled
          ? 'bg-white/75 backdrop-blur-xl shadow-sm border-b border-white/30'
          : 'bg-white/50 backdrop-blur-md border-b border-transparent',
      ].join(' ')}
      style={{ fontFamily: 'var(--font-sans, Inter, sans-serif)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 group shrink-0"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #c23a22 0%, #a52e19 100%)' }}
            >
              <span
                className="text-white text-lg font-bold leading-none select-none"
                style={{ fontFamily: 'var(--font-chinese, "Noto Sans SC", sans-serif)' }}
              >
                汉
              </span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-semibold tracking-tight text-[#1a1a2e]">
                HSK Mandarin
              </span>
              <span className="text-[10px] font-medium text-[#8a8490] tracking-widest uppercase">
                Learn Chinese
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={[
                  'flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200',
                  isActive(to)
                    ? 'bg-[#c23a22] text-white shadow-sm'
                    : 'text-[#2d2d3f] hover:bg-[#c23a22]/10 hover:text-[#c23a22]',
                ].join(' ')}
              >
                <Icon size={14} />
                <span>{label}</span>
              </Link>
            ))}

            {/* Level-specific links with a subtle divider */}
            {currentLevel && (
              <>
                <div className="w-px h-5 bg-[#8a8490]/25 mx-1" />
                <LevelLinks level={currentLevel} />
              </>
            )}
          </nav>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-[#2d2d3f] hover:bg-[#c23a22]/10 hover:text-[#c23a22] transition-all duration-200"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white/90 backdrop-blur-xl border-t border-white/30"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {NAV_LINKS.map(({ label, to, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={[
                    'flex items-center gap-2.5 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200',
                    isActive(to)
                      ? 'bg-[#c23a22] text-white shadow-sm'
                      : 'text-[#2d2d3f] hover:bg-[#c23a22]/10 hover:text-[#c23a22]',
                  ].join(' ')}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </Link>
              ))}

              {currentLevel && (
                <>
                  <div className="h-px bg-[#8a8490]/20 my-1 mx-1" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8a8490] px-4 pt-1 pb-0.5">
                    HSK {currentLevel}
                  </p>
                  <Link
                    to={`/hsk/${currentLevel}/vocab`}
                    className={[
                      'flex items-center gap-2.5 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200',
                      location.pathname.endsWith('/vocab')
                        ? 'bg-[#c23a22] text-white'
                        : 'text-[#2d2d3f] hover:bg-[#c23a22]/10 hover:text-[#c23a22]',
                    ].join(' ')}
                  >
                    <BookOpen size={15} />
                    <span>Vocabulary</span>
                  </Link>
                  <Link
                    to={`/hsk/${currentLevel}/grammar`}
                    className={[
                      'flex items-center gap-2.5 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200',
                      location.pathname.endsWith('/grammar')
                        ? 'bg-[#2d8a56] text-white'
                        : 'text-[#2d2d3f] hover:bg-[#2d8a56]/10 hover:text-[#2d8a56]',
                    ].join(' ')}
                  >
                    <BookOpen size={15} />
                    <span>Grammar</span>
                  </Link>
                  <Link
                    to={`/hsk/${currentLevel}/quiz`}
                    className={[
                      'flex items-center gap-2.5 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200',
                      location.pathname.endsWith('/quiz')
                        ? 'bg-[#d4a017] text-white'
                        : 'text-[#2d2d3f] hover:bg-[#d4a017]/10 hover:text-[#d4a017]',
                    ].join(' ')}
                  >
                    <GraduationCap size={15} />
                    <span>Quiz</span>
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
