import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, animate } from 'framer-motion'
import { BookOpen, Brain, Zap, Layers, Globe, BarChart3, ArrowRight, Star, ChevronDown } from 'lucide-react'

/* ── Helpers ────────────────────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function CountUp({ target, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, target, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: v => setVal(Math.floor(v)),
    })
    return () => c.stop()
  }, [inView, target])
  return <span ref={ref}>{val.toLocaleString('id-ID')}{suffix}</span>
}

/* ── Data ───────────────────────────────────────────────────────────────────── */
const levels = [
  { num: 1, hz: '一', label: 'Pemula', desc: 'Salam, perkenalan, angka, dan percakapan dasar sehari-hari.', vocab: 165, grammar: 15, soal: 800, gradient: 'from-[#c23a22] to-[#d94a33]' },
  { num: 2, hz: '二', label: 'Dasar', desc: 'Keluarga, hobi, cuaca, belanja, dan kalimat lebih kompleks.', vocab: 150, grammar: 15, soal: 800, gradient: 'from-[#d4a017] to-[#e8b830]' },
  { num: 3, hz: '三', label: 'Menengah Awal', desc: 'Opini, cerita masa lalu, situasi kerja dan belajar.', vocab: 300, grammar: 20, soal: 800, gradient: 'from-[#2d8a56] to-[#3aab6a]' },
  { num: 4, hz: '四', label: 'Menengah', desc: 'Diskusi abstrak, teks formal, dan idiom Mandarin.', vocab: 600, grammar: 25, soal: 800, gradient: 'from-[#1a1a2e] to-[#2d2d3f]' },
]

const features = [
  { icon: BookOpen, title: 'Kosakata Resmi HSK', desc: 'Lengkap dengan pinyin, arti, dan contoh kalimat nyata.', accent: 'bg-red-50 text-[#c23a22]' },
  { icon: Brain, title: 'Grammar Terstruktur', desc: 'Penjelasan lugas dalam Bahasa Indonesia. Langsung ngerti.', accent: 'bg-green-50 text-[#2d8a56]' },
  { icon: Zap, title: '3.200+ Soal Latihan', desc: 'Pilihan ganda, baca paragraf, dan susun kalimat.', accent: 'bg-yellow-50 text-[#d4a017]' },
  { icon: Layers, title: 'Mode Flashcard', desc: 'Hafalan kosakata efektif dengan sistem flip card.', accent: 'bg-red-50 text-[#c23a22]' },
  { icon: BarChart3, title: 'Progress Tracking', desc: 'Pantau perkembangan belajar di dashboard pribadi.', accent: 'bg-green-50 text-[#2d8a56]' },
  { icon: Globe, title: '100% Bahasa Indonesia', desc: 'Semua penjelasan dan instruksi dalam Bahasa Indonesia.', accent: 'bg-yellow-50 text-[#d4a017]' },
]

const vocabSample = [
  { hanzi: '你好', pinyin: 'nǐ hǎo', arti: 'Halo', contoh: '你好！很高兴认识你。' },
  { hanzi: '谢谢', pinyin: 'xiè xiè', arti: 'Terima kasih', contoh: '谢谢你的帮助！' },
  { hanzi: '学习', pinyin: 'xuéxí', arti: 'Belajar', contoh: '我喜欢学习汉语。' },
  { hanzi: '朋友', pinyin: 'péngyou', arti: 'Teman', contoh: '他是我的好朋友。' },
  { hanzi: '中国', pinyin: 'zhōngguó', arti: 'China', contoh: '我想去中国。' },
]

/* ── Preview Components ─────────────────────────────────────────────────────── */
function PreviewVocab() {
  return (
    <div className="rounded-xl border border-[#e8e0d6] overflow-hidden bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#f5f0eb] text-left text-xs font-semibold text-[#8a8490] uppercase tracking-wider">
            <th className="px-4 py-3">Hanzi</th>
            <th className="px-4 py-3">Pinyin</th>
            <th className="px-4 py-3">Arti</th>
            <th className="px-4 py-3 hidden sm:table-cell">Contoh</th>
          </tr>
        </thead>
        <tbody>
          {vocabSample.map((v, i) => (
            <tr key={i} className="border-t border-[#f0ebe4]">
              <td className="px-4 py-3 font-[family-name:var(--font-chinese)] text-lg font-bold text-[#c23a22]">{v.hanzi}</td>
              <td className="px-4 py-3 text-[#2d8a56] italic">{v.pinyin}</td>
              <td className="px-4 py-3 text-[#1a1a2e]">{v.arti}</td>
              <td className="px-4 py-3 text-[#8a8490] font-[family-name:var(--font-chinese)] text-xs hidden sm:table-cell">{v.contoh}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PreviewFlashcard() {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="cursor-pointer w-72 h-44" style={{ perspective: 1000 }} onClick={() => setFlipped(!flipped)}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', height: '100%' }}
        >
          <div style={{ backfaceVisibility: 'hidden' }} className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#c23a22] to-[#a03020] flex flex-col items-center justify-center shadow-lg">
            <div className="font-[family-name:var(--font-chinese)] text-6xl font-bold text-white">学习</div>
            <div className="text-white/60 text-xs mt-2">Klik untuk balik</div>
          </div>
          <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} className="absolute inset-0 rounded-2xl bg-white border border-[#e8e0d6] flex flex-col items-center justify-center shadow-lg">
            <div className="text-[#2d8a56] text-lg italic">xuéxí</div>
            <div className="text-[#1a1a2e] text-2xl font-bold mt-1">Belajar</div>
            <div className="text-[#8a8490] text-xs mt-3 font-[family-name:var(--font-chinese)]">我喜欢学习汉语。</div>
          </div>
        </motion.div>
      </div>
      <div className="flex gap-3">
        <span className="px-4 py-1.5 rounded-full bg-red-50 text-[#c23a22] border border-[#c23a22]/20 text-xs font-medium">Belum Hafal</span>
        <span className="px-4 py-1.5 rounded-full bg-green-50 text-[#2d8a56] border border-[#2d8a56]/20 text-xs font-medium">Sudah Hafal</span>
      </div>
    </div>
  )
}

function PreviewQuiz() {
  const [sel, setSel] = useState(null)
  const opts = ['Berbicara', 'Belajar', 'Menulis', 'Membaca']
  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-[#f5f0eb] rounded-xl p-4 mb-4 text-center">
        <div className="text-[10px] text-[#8a8490] uppercase font-semibold mb-2">Soal 12 / 40</div>
        <div className="font-[family-name:var(--font-chinese)] text-4xl font-bold text-[#1a1a2e]">学习</div>
        <p className="text-[#8a8490] text-sm mt-2">Apa arti kata di atas?</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {opts.map((o, i) => {
          const correct = i === 1
          const chosen = sel === i
          let cls = 'rounded-lg border-2 px-3 py-2.5 text-sm font-medium cursor-pointer transition-all '
          if (sel !== null) {
            if (correct) cls += 'border-[#2d8a56] bg-green-50 text-[#2d8a56]'
            else if (chosen) cls += 'border-[#c23a22] bg-red-50 text-[#c23a22]'
            else cls += 'border-[#e8e0d6] text-[#8a8490]'
          } else {
            cls += 'border-[#e8e0d6] text-[#1a1a2e] hover:border-[#c23a22]/40'
          }
          return <button key={i} className={cls} onClick={() => setSel(i)}>{o}</button>
        })}
      </div>
      {sel !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-3 rounded-lg px-3 py-2 text-xs font-medium ${sel === 1 ? 'bg-green-50 text-[#2d8a56]' : 'bg-red-50 text-[#c23a22]'}`}>
          {sel === 1 ? 'Benar! 学习 = Belajar' : 'Jawaban benar: Belajar'}
        </motion.div>
      )}
    </div>
  )
}

/* ── MAIN PAGE ──────────────────────────────────────────────────────────────── */
export default function Landing() {
  const previewRef = useRef(null)
  const [tab, setTab] = useState('vocab')

  return (
    <div className="min-h-screen bg-[#faf8f5]">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e8e0d6]/60">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#c23a22] flex items-center justify-center">
              <span className="font-[family-name:var(--font-chinese)] text-white text-xs font-bold">汉</span>
            </div>
            <span className="font-bold text-[#1a1a2e]">HSK Mandarin</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="text-sm text-[#8a8490] hover:text-[#1a1a2e] px-3 py-1.5 hidden sm:block">Masuk</Link>
            <Link to="/dashboard" className="text-sm font-semibold bg-[#c23a22] text-white px-4 py-1.5 rounded-full hover:bg-[#a03020] transition-colors">Mulai Gratis</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        {/* Background chars */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="font-[family-name:var(--font-chinese)] absolute text-[20vw] font-black text-[#1a1a2e]/[0.02] top-[5%] left-[5%]">学</div>
          <div className="font-[family-name:var(--font-chinese)] absolute text-[16vw] font-black text-[#c23a22]/[0.03] bottom-[10%] right-[5%]">文</div>
          <div className="font-[family-name:var(--font-chinese)] absolute text-[14vw] font-black text-[#2d8a56]/[0.025] top-[40%] right-[15%]">中</div>
        </div>

        <div className="relative max-w-5xl mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="inline-flex items-center gap-1.5 bg-[#c23a22]/10 border border-[#c23a22]/20 rounded-full px-3 py-1 mb-5">
                  <Star size={10} className="text-[#c23a22] fill-[#c23a22]" />
                  <span className="text-[#c23a22] text-[11px] font-semibold uppercase tracking-wide">Platform HSK #1 Indonesia</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1a2e] leading-tight mb-5"
              >
                Kuasai Bahasa Mandarin dari{' '}
                <span className="text-[#c23a22]">HSK 1</span> sampai{' '}
                <span className="text-[#c23a22]">4</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[#8a8490] text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
              >
                1.100+ kosakata, 3.200+ soal latihan, dan 75 poin grammar — semua dalam Bahasa Indonesia. Gratis selamanya.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <Link to="/dashboard" className="inline-flex items-center gap-2 bg-[#c23a22] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#a03020] transition-colors shadow-md shadow-[#c23a22]/20">
                  Mulai Belajar Gratis <ArrowRight size={16} />
                </Link>
                <button onClick={() => previewRef.current?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-2 border-2 border-[#e8e0d6] text-[#1a1a2e] font-semibold px-6 py-3 rounded-full hover:border-[#c23a22]/30 transition-colors">
                  Lihat Preview <ChevronDown size={16} />
                </button>
              </motion.div>
            </div>

            {/* Right: Hero Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl border border-[#e8e0d6] p-8 text-center">
                  <div className="text-xs text-[#8a8490] uppercase font-semibold tracking-wider mb-3">HSK 1 · Kata Pertamamu</div>
                  <div className="font-[family-name:var(--font-chinese)] text-7xl font-bold text-[#c23a22] mb-3">你好</div>
                  <div className="text-[#2d8a56] text-lg italic mb-1">nǐ hǎo</div>
                  <div className="text-[#1a1a2e] text-xl font-semibold mb-4">Halo / Apa kabar</div>
                  <div className="bg-[#f5f0eb] rounded-xl p-4 text-left">
                    <div className="font-[family-name:var(--font-chinese)] text-[#1a1a2e] text-sm">你好！很高兴认识你。</div>
                    <div className="text-[#8a8490] text-xs mt-1">Halo! Senang bertemu denganmu.</div>
                  </div>
                </div>
                {/* Floating badges */}
                <div className="absolute -top-3 -right-3 bg-white shadow-lg rounded-full px-3 py-1.5 text-xs font-semibold text-[#c23a22] border border-[#e8e0d6]">
                  1.100+ Kosakata
                </div>
                <div className="absolute -bottom-3 -left-3 bg-white shadow-lg rounded-full px-3 py-1.5 text-xs font-semibold text-[#2d8a56] border border-[#e8e0d6]">
                  3.200+ Soal
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-[#1a1a2e]">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: 4, label: 'Level HSK', suffix: '' },
              { n: 1100, label: 'Kosakata', suffix: '+' },
              { n: 3200, label: 'Soal Latihan', suffix: '+' },
              { n: 75, label: 'Grammar Points', suffix: '' },
            ].map((s, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="text-3xl sm:text-4xl font-extrabold text-white">
                  <CountUp target={s.n} suffix={s.suffix} />
                </div>
                <div className="text-[#8a8490] text-sm mt-1">{s.label}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5">
          <FadeUp className="text-center mb-12">
            <div className="text-[#c23a22] text-xs font-semibold uppercase tracking-wider mb-2">Fitur Lengkap</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] mb-3">Semua yang Kamu Butuhkan</h2>
            <p className="text-[#8a8490] max-w-lg mx-auto">Satu platform untuk menguasai Mandarin dari nol sampai fasih.</p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="bg-white rounded-xl border border-[#e8e0d6] p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className={`w-10 h-10 rounded-lg ${f.accent} flex items-center justify-center mb-3`}>
                    <f.icon size={20} />
                  </div>
                  <h3 className="font-semibold text-[#1a1a2e] mb-1.5">{f.title}</h3>
                  <p className="text-[#8a8490] text-sm leading-relaxed">{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* PREVIEW */}
      <section ref={previewRef} className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5">
          <FadeUp className="text-center mb-10">
            <div className="text-[#2d8a56] text-xs font-semibold uppercase tracking-wider mb-2">Preview Gratis</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] mb-3">Intip Isi Modulnya</h2>
            <p className="text-[#8a8490] max-w-md mx-auto">Lihat langsung kualitas konten sebelum mulai belajar.</p>
          </FadeUp>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {[
              { id: 'vocab', label: 'Kosakata' },
              { id: 'flashcard', label: 'Flashcard' },
              { id: 'quiz', label: 'Soal' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-[#c23a22] text-white shadow-sm'
                    : 'bg-[#f5f0eb] text-[#8a8490] hover:text-[#1a1a2e]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <FadeUp>
            <div className="bg-[#faf8f5] rounded-2xl border border-[#e8e0d6] p-5 sm:p-8">
              {tab === 'vocab' && <PreviewVocab />}
              {tab === 'flashcard' && <PreviewFlashcard />}
              {tab === 'quiz' && <PreviewQuiz />}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* LEVELS */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5">
          <FadeUp className="text-center mb-12">
            <div className="text-[#d4a017] text-xs font-semibold uppercase tracking-wider mb-2">Kurikulum Terstruktur</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] mb-3">4 Level, Satu Tujuan</h2>
            <p className="text-[#8a8490] max-w-md mx-auto">Dari nol hingga fasih, ikuti jalur yang terstruktur dan progresif.</p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 gap-5">
            {levels.map((l, i) => (
              <FadeUp key={l.num} delay={i * 0.1}>
                <div className="bg-white rounded-xl border border-[#e8e0d6] overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${l.gradient} p-5 text-white relative overflow-hidden`}>
                    <div className="font-[family-name:var(--font-chinese)] absolute right-4 top-1/2 -translate-y-1/2 text-6xl font-black text-white/10">{l.hz}</div>
                    <div className="relative">
                      <div className="text-xl font-bold">HSK {l.num}</div>
                      <div className="text-white/70 text-sm">{l.label}</div>
                    </div>
                  </div>
                  {/* Body */}
                  <div className="p-5">
                    <p className="text-[#8a8490] text-sm mb-4">{l.desc}</p>
                    <div className="flex gap-4 text-xs text-[#8a8490] mb-4">
                      <span><strong className="text-[#1a1a2e]">{l.vocab}</strong> kosakata</span>
                      <span><strong className="text-[#1a1a2e]">{l.grammar}</strong> grammar</span>
                      <span><strong className="text-[#1a1a2e]">{l.soal}+</strong> soal</span>
                    </div>
                    <Link to={`/hsk/${l.num}/vocab`} className="inline-flex items-center gap-1 text-[#c23a22] text-sm font-semibold hover:gap-2 transition-all">
                      Mulai Belajar <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1a1a2e]">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <FadeUp>
            <div className="font-[family-name:var(--font-chinese)] text-5xl text-[#c23a22] mb-4">加油</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Mulai Perjalanan Mandarinmu Sekarang</h2>
            <p className="text-[#8a8490] mb-8 max-w-md mx-auto">Jangan biarkan bahasa jadi penghalang. Dengan HSK Mandarin, semuanya terasa lebih mudah.</p>
            <Link to="/dashboard" className="inline-flex items-center gap-2 bg-[#c23a22] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#a03020] transition-colors shadow-lg shadow-[#c23a22]/30 text-lg">
              Mulai Belajar Gratis <ArrowRight size={18} />
            </Link>
            <p className="text-[#8a8490]/50 text-xs mt-4">100% gratis. Tanpa kartu kredit.</p>
          </FadeUp>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-[#e8e0d6]">
        <div className="max-w-5xl mx-auto px-5 text-center">
          <p className="text-[#8a8490] text-sm">&copy; 2026 HSK Mandarin. Dibuat untuk pelajar Indonesia.</p>
        </div>
      </footer>
    </div>
  )
}
