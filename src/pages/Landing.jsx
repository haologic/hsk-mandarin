import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, animate } from 'framer-motion';
import {
  BookOpen,
  Brain,
  CreditCard,
  ChartBar,
  Globe,
  MessageSquare,
  ChevronDown,
  Star,
  Zap,
  CircleCheck,
  ArrowRight,
  Volume2,
  Award,
  Layers,
} from 'lucide-react';

// ─── Reusable animated section wrapper ────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated count-up number ─────────────────────────────────────────────────
function CountUp({ target, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {display.toLocaleString('id-ID')}
      {suffix}
    </span>
  );
}

// ─── Preview Tab: Vocab Table ──────────────────────────────────────────────────
const vocabData = [
  { hanzi: '你好', pinyin: 'nǐ hǎo', arti: 'Halo / Selamat datang', contoh: '你好！很高兴认识你。' },
  { hanzi: '谢谢', pinyin: 'xiè xiè', arti: 'Terima kasih', contoh: '谢谢你的帮助！' },
  { hanzi: '学习', pinyin: 'xuéxí', arti: 'Belajar', contoh: '我喜欢学习汉语。' },
  { hanzi: '朋友', pinyin: 'péngyou', arti: 'Teman', contoh: '他是我的好朋友。' },
];

function VocabPreview() {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#e8e0d6] bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#faf8f5] border-b border-[#e8e0d6]">
            <th className="px-4 py-3 text-left font-semibold text-[#1a1a2e]">汉字</th>
            <th className="px-4 py-3 text-left font-semibold text-[#1a1a2e]">Pinyin</th>
            <th className="px-4 py-3 text-left font-semibold text-[#1a1a2e]">Arti</th>
            <th className="px-4 py-3 text-left font-semibold text-[#1a1a2e] hidden md:table-cell">Contoh Kalimat</th>
          </tr>
        </thead>
        <tbody>
          {vocabData.map((row, i) => (
            <tr key={i} className="border-b border-[#f0ebe4] hover:bg-[#fdf9f6] transition-colors">
              <td className="px-4 py-3 font-[family-name:var(--font-chinese)] text-xl font-bold text-[#c23a22]">{row.hanzi}</td>
              <td className="px-4 py-3 text-[#2d8a56] font-medium italic">{row.pinyin}</td>
              <td className="px-4 py-3 text-[#1a1a2e]">{row.arti}</td>
              <td className="px-4 py-3 text-[#8a8490] font-[family-name:var(--font-chinese)] text-sm hidden md:table-cell">{row.contoh}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Preview Tab: Flashcard ────────────────────────────────────────────────────
function FlashcardPreview() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="cursor-pointer w-full max-w-sm"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', height: '200px' }}
        >
          {/* Front */}
          <div
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#c23a22] to-[#a03020] flex flex-col items-center justify-center shadow-lg"
          >
            <div className="font-[family-name:var(--font-chinese)] text-7xl font-bold text-white mb-2">学习</div>
            <div className="text-white/70 text-sm">Klik untuk melihat arti</div>
          </div>
          {/* Back */}
          <div
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            className="absolute inset-0 rounded-2xl bg-white border-2 border-[#c23a22]/20 flex flex-col items-center justify-center shadow-lg"
          >
            <div className="text-[#2d8a56] text-xl font-semibold italic mb-1">xuéxí</div>
            <div className="text-[#1a1a2e] text-2xl font-bold mb-3">Belajar</div>
            <div className="font-[family-name:var(--font-chinese)] text-[#8a8490] text-sm px-6 text-center">我喜欢学习汉语。</div>
            <div className="text-[#8a8490] text-xs mt-1">Saya suka belajar bahasa Mandarin.</div>
          </div>
        </motion.div>
      </div>
      <p className="text-[#8a8490] text-sm">Klik kartu untuk membalik</p>
      <div className="flex gap-3">
        <button className="px-5 py-2 rounded-full bg-red-50 text-[#c23a22] border border-[#c23a22]/20 text-sm font-medium hover:bg-red-100 transition-colors">Belum Hafal</button>
        <button className="px-5 py-2 rounded-full bg-green-50 text-[#2d8a56] border border-[#2d8a56]/20 text-sm font-medium hover:bg-green-100 transition-colors">Sudah Hafal</button>
      </div>
    </div>
  );
}

// ─── Preview Tab: Quiz ─────────────────────────────────────────────────────────
function QuizPreview() {
  const [selected, setSelected] = useState(null);
  const correct = 1;
  const options = ['Berbicara', 'Belajar', 'Menulis', 'Membaca'];

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-[#faf8f5] rounded-xl p-5 border border-[#e8e0d6] mb-4">
        <div className="text-xs font-semibold text-[#8a8490] uppercase tracking-wider mb-3">Soal 12 / 30 • HSK 1</div>
        <div className="font-[family-name:var(--font-chinese)] text-4xl font-bold text-[#1a1a2e] text-center my-4">学习</div>
        <p className="text-[#2d2d3f] text-center text-sm">Apa arti kata di atas?</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          const isCorrect = i === correct;
          const isSelected = selected === i;
          let cls = 'rounded-xl border-2 px-4 py-3 text-sm font-medium cursor-pointer transition-all duration-200 ';
          if (selected !== null) {
            if (isCorrect) cls += 'border-[#2d8a56] bg-green-50 text-[#2d8a56]';
            else if (isSelected) cls += 'border-[#c23a22] bg-red-50 text-[#c23a22]';
            else cls += 'border-[#e8e0d6] bg-white text-[#8a8490]';
          } else {
            cls += 'border-[#e8e0d6] bg-white text-[#1a1a2e] hover:border-[#c23a22]/40 hover:bg-red-50/30';
          }
          return (
            <button key={i} className={cls} onClick={() => setSelected(i)}>
              {isSelected && selected !== null ? (isCorrect ? '✓ ' : '✗ ') : ''}
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${selected === correct ? 'bg-green-50 text-[#2d8a56] border border-green-200' : 'bg-red-50 text-[#c23a22] border border-red-200'}`}
        >
          {selected === correct ? '✓ Benar! 学习 (xuéxí) = Belajar' : '✗ Kurang tepat. Jawaban benar: Belajar (xuéxí)'}
        </motion.div>
      )}
    </div>
  );
}

// ─── MAIN LANDING PAGE ─────────────────────────────────────────────────────────
export default function Landing() {
  const previewRef = useRef(null);
  const [activeTab, setActiveTab] = useState('vocab');

  const scrollToPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hskLevels = [
    {
      num: 1,
      chinese: '一',
      title: 'HSK 1',
      desc: 'Fondasi bahasa Mandarin. Belajar sapa, angka, warna, dan kalimat dasar sehari-hari.',
      vocab: 150,
      grammar: 15,
      soal: 800,
      color: 'from-[#c23a22] to-[#e05030]',
      badge: 'bg-red-100 text-[#c23a22]',
    },
    {
      num: 2,
      chinese: '二',
      title: 'HSK 2',
      desc: 'Percakapan lebih luas. Topik keluarga, hobi, cuaca, dan kehidupan sehari-hari.',
      vocab: 150,
      grammar: 15,
      soal: 800,
      color: 'from-[#d4a017] to-[#e8b830]',
      badge: 'bg-yellow-100 text-[#b88a00]',
    },
    {
      num: 3,
      chinese: '三',
      title: 'HSK 3',
      desc: 'Tingkat menengah. Ekspresikan opini, cerita masa lalu, dan situasi kompleks.',
      vocab: 300,
      grammar: 20,
      soal: 800,
      color: 'from-[#2d8a56] to-[#3aab6a]',
      badge: 'bg-green-100 text-[#2d8a56]',
    },
    {
      num: 4,
      chinese: '四',
      title: 'HSK 4',
      desc: 'Level lanjutan. Diskusi abstrak, teks formal, dan idiom bahasa Mandarin.',
      vocab: 600,
      grammar: 25,
      soal: 800,
      color: 'from-[#2d2d3f] to-[#3d3d52]',
      badge: 'bg-slate-100 text-[#2d2d3f]',
    },
  ];

  const features = [
    {
      icon: <BookOpen size={22} />,
      title: 'Kosakata Resmi HSK',
      desc: 'Daftar kosakata lengkap sesuai standar HSK, dilengkapi pinyin, arti, dan contoh kalimat nyata.',
      color: 'text-[#c23a22] bg-red-50',
    },
    {
      icon: <Brain size={22} />,
      title: 'Grammar Jelas & Terstruktur',
      desc: 'Penjelasan tata bahasa yang lugas dalam Bahasa Indonesia. Tidak pusing, langsung ngerti.',
      color: 'text-[#2d8a56] bg-green-50',
    },
    {
      icon: <Zap size={22} />,
      title: '800+ Soal per Level',
      desc: 'Latihan soal berlimpah dengan berbagai tipe — pilihan ganda, isi kosong, menjodohkan.',
      color: 'text-[#d4a017] bg-yellow-50',
    },
    {
      icon: <CreditCard size={22} />,
      title: 'Mode Flashcard',
      desc: 'Sistem spaced repetition untuk hafalan kosakata yang lebih efektif dan tahan lama.',
      color: 'text-[#c23a22] bg-red-50',
    },
    {
      icon: <ChartBar size={22} />,
      title: 'Progress Tracking',
      desc: 'Pantau perkembangan belajarmu dengan dashboard yang menampilkan statistik lengkap.',
      color: 'text-[#2d8a56] bg-green-50',
    },
    {
      icon: <Globe size={22} />,
      title: '100% Bahasa Indonesia',
      desc: 'Semua penjelasan, instruksi, dan contoh dalam Bahasa Indonesia. Belajar tanpa hambatan.',
      color: 'text-[#d4a017] bg-yellow-50',
    },
  ];

  const tabs = [
    { id: 'vocab', label: 'Tabel Kosakata', icon: <BookOpen size={14} /> },
    { id: 'flashcard', label: 'Flashcard', icon: <CreditCard size={14} /> },
    { id: 'quiz', label: 'Soal Latihan', icon: <MessageSquare size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] overflow-x-hidden">

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e8e0d6]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#c23a22] flex items-center justify-center shadow-sm">
              <span className="font-[family-name:var(--font-chinese)] text-white text-sm font-bold">汉</span>
            </div>
            <span className="font-bold text-[#1a1a2e] text-lg tracking-tight">HSK Mandarin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="hidden sm:block text-sm font-medium text-[#8a8490] hover:text-[#1a1a2e] transition-colors px-3 py-1.5"
            >
              Masuk
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-semibold bg-[#c23a22] text-white px-4 py-2 rounded-full hover:bg-[#a03020] transition-colors shadow-sm"
            >
              Mulai Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">

        {/* Background decorative characters */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="font-[family-name:var(--font-chinese)] absolute text-[28vw] font-black text-[#1a1a2e]/[0.025] leading-none top-[-5%] left-[-8%] select-none">学</div>
          <div className="font-[family-name:var(--font-chinese)] absolute text-[22vw] font-black text-[#c23a22]/[0.04] leading-none bottom-[5%] right-[-5%] select-none">文</div>
          <div className="font-[family-name:var(--font-chinese)] absolute text-[18vw] font-black text-[#2d8a56]/[0.035] leading-none top-[30%] right-[10%] select-none">中</div>
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: 'radial-gradient(circle, #1a1a2e 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          {/* Warm gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#faf8f5] to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 bg-[#c23a22]/10 border border-[#c23a22]/20 rounded-full px-4 py-1.5 mb-6"
            >
              <Star size={12} className="text-[#c23a22] fill-[#c23a22]" />
              <span className="text-[#c23a22] text-xs font-semibold tracking-wide uppercase">Platform HSK #1 untuk Pelajar Indonesia</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-[#1a1a2e] leading-[1.1] tracking-tight mb-5"
            >
              Kuasai Bahasa{' '}
              <span className="relative inline-block">
                <span className="text-[#c23a22]">Mandarin</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6 Q100 2 198 6" stroke="#d4a017" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              </span>
              <br />
              dari HSK 1 sampai 4
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
              className="text-[#8a8490] text-lg leading-relaxed mb-8 max-w-lg"
            >
              Modul belajar lengkap dengan <strong className="text-[#2d2d3f]">1.100+ kosakata</strong>, <strong className="text-[#2d2d3f]">3.200+ soal latihan</strong>, dan <strong className="text-[#2d2d3f]">75 poin grammar</strong> — semua dalam Bahasa Indonesia.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 bg-[#c23a22] text-white font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-[#a03020] transition-all shadow-lg shadow-[#c23a22]/25 hover:shadow-xl hover:shadow-[#c23a22]/30 hover:-translate-y-0.5"
              >
                Mulai Belajar Gratis
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={scrollToPreview}
                className="inline-flex items-center gap-2 bg-white border border-[#e8e0d6] text-[#2d2d3f] font-semibold px-7 py-3.5 rounded-full text-sm hover:border-[#c23a22]/40 hover:bg-[#fdf9f6] transition-all shadow-sm"
              >
                Lihat Preview
                <ChevronDown size={16} />
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              {[
                { icon: <CircleCheck size={14} />, text: 'Sesuai standar resmi HSK' },
                { icon: <CircleCheck size={14} />, text: 'Gratis selamanya' },
                { icon: <CircleCheck size={14} />, text: 'Update rutin' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[#2d8a56] text-sm font-medium">
                  {item.icon}
                  <span className="text-[#8a8490]">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Character card + floating badges */}
          <div className="relative flex items-center justify-center">
            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
              className="absolute -left-2 sm:-left-8 top-8 bg-white rounded-2xl px-4 py-3 shadow-lg shadow-black/8 border border-[#e8e0d6] z-20"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#c23a22]/10 flex items-center justify-center">
                  <BookOpen size={16} className="text-[#c23a22]" />
                </div>
                <div>
                  <div className="font-bold text-[#1a1a2e] text-sm">150+</div>
                  <div className="text-[#8a8490] text-xs">Kosakata/Level</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75, ease: 'easeOut' }}
              className="absolute -right-2 sm:-right-8 bottom-12 bg-white rounded-2xl px-4 py-3 shadow-lg shadow-black/8 border border-[#e8e0d6] z-20"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2d8a56]/10 flex items-center justify-center">
                  <Zap size={16} className="text-[#2d8a56]" />
                </div>
                <div>
                  <div className="font-bold text-[#1a1a2e] text-sm">800+</div>
                  <div className="text-[#8a8490] text-xs">Soal/Level</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: 'easeOut' }}
              className="absolute left-1/2 -translate-x-1/2 -top-6 bg-[#d4a017]/10 border border-[#d4a017]/30 rounded-full px-4 py-1.5 z-20"
            >
              <div className="flex items-center gap-1.5">
                <Award size={13} className="text-[#d4a017]" />
                <span className="text-[#b88a00] text-xs font-semibold">HSK 1 – 4 Lengkap</span>
              </div>
            </motion.div>

            {/* Main character card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Card shadow/glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#c23a22]/20 to-[#d4a017]/20 rounded-3xl blur-2xl scale-110" />

              <div className="relative bg-white rounded-3xl shadow-2xl shadow-black/12 border border-white/80 overflow-hidden w-64 sm:w-72">
                {/* Card header gradient */}
                <div className="bg-gradient-to-br from-[#c23a22] to-[#a03020] p-8 flex flex-col items-center">
                  <div className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">HSK 1 • Salam</div>
                  <div className="font-[family-name:var(--font-chinese)] text-8xl font-black text-white drop-shadow-lg leading-none mb-1">
                    你好
                  </div>
                  <div className="text-white/70 text-sm mt-3 italic">nǐ hǎo</div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-[#1a1a2e] font-bold text-lg">Halo / Selamat datang</div>
                      <div className="text-[#8a8490] text-sm mt-0.5">Kata sapaan paling dasar</div>
                    </div>
                    <button className="w-9 h-9 rounded-full bg-[#faf8f5] border border-[#e8e0d6] flex items-center justify-center hover:bg-red-50 transition-colors">
                      <Volume2 size={15} className="text-[#c23a22]" />
                    </button>
                  </div>

                  <div className="bg-[#faf8f5] rounded-xl p-3 border border-[#e8e0d6]">
                    <div className="font-[family-name:var(--font-chinese)] text-[#1a1a2e] text-sm mb-1">你好！很高兴认识你。</div>
                    <div className="text-[#8a8490] text-xs">Halo! Senang bertemu denganmu.</div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} className="fill-[#d4a017] text-[#d4a017]" />
                      ))}
                    </div>
                    <span className="text-xs text-[#8a8490] bg-[#faf8f5] px-2 py-1 rounded-full border border-[#e8e0d6]">Kata #1</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8a8490]"
        >
          <span className="text-xs uppercase tracking-widest font-medium">Scroll untuk tahu lebih</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────────────── */}
      <section className="bg-[#1a1a2e] py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: 4, suffix: ' Level', label: 'HSK', sub: 'Level 1 – 4', icon: <Layers size={20} /> },
              { value: 1100, suffix: '+', label: 'Kosakata', sub: 'Total semua level', icon: <BookOpen size={20} /> },
              { value: 3200, suffix: '+', label: 'Soal Latihan', sub: 'Berbagai tipe soal', icon: <MessageSquare size={20} /> },
              { value: 75, suffix: '', label: 'Grammar Points', sub: 'Penjelasan lengkap', icon: <Brain size={20} /> },
            ].map((stat, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-[#d4a017] mb-3 mx-auto">
                    {stat.icon}
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[#d4a017] font-semibold text-sm">{stat.label}</div>
                  <div className="text-white/40 text-xs mt-0.5">{stat.sub}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#2d8a56]/10 border border-[#2d8a56]/20 rounded-full px-4 py-1.5 mb-5">
              <CircleCheck size={12} className="text-[#2d8a56]" />
              <span className="text-[#2d8a56] text-xs font-semibold tracking-wide uppercase">Fitur Lengkap</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] mb-4 tracking-tight">
              Apa yang Kamu Dapatkan
            </h2>
            <p className="text-[#8a8490] text-lg max-w-xl mx-auto">
              Semua yang kamu butuhkan untuk menguasai Mandarin, dikemas dalam satu platform yang intuitif.
            </p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="group bg-white rounded-2xl p-6 border border-[#e8e0d6] hover:border-[#c23a22]/30 hover:shadow-lg hover:shadow-[#c23a22]/5 transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${feat.color} transition-transform group-hover:scale-110 duration-300`}>
                    {feat.icon}
                  </div>
                  <h3 className="font-bold text-[#1a1a2e] text-base mb-2">{feat.title}</h3>
                  <p className="text-[#8a8490] text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREVIEW SECTION ─────────────────────────────────────────────────── */}
      <section ref={previewRef} className="py-24 bg-[#f5f0eb] px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#c23a22]/10 border border-[#c23a22]/20 rounded-full px-4 py-1.5 mb-5">
              <Star size={12} className="text-[#c23a22] fill-[#c23a22]" />
              <span className="text-[#c23a22] text-xs font-semibold tracking-wide uppercase">Live Preview</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] mb-4 tracking-tight">
              Lihat Langsung Kualitasnya
            </h2>
            <p className="text-[#8a8490] text-lg max-w-xl mx-auto">
              Bukan janji — ini bukti nyata konten yang sudah menunggu untuk kamu pelajari.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-white rounded-full p-1.5 border border-[#e8e0d6] gap-1 shadow-sm">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-[#c23a22] text-white shadow-sm'
                        : 'text-[#8a8490] hover:text-[#1a1a2e] hover:bg-[#faf8f5]'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="bg-white rounded-2xl border border-[#e8e0d6] shadow-sm overflow-hidden"
            >
              {/* Browser-style header */}
              <div className="bg-[#faf8f5] border-b border-[#e8e0d6] px-5 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 ml-3">
                  <div className="bg-white rounded-md border border-[#e8e0d6] text-xs text-[#8a8490] px-3 py-1 max-w-xs">
                    hsk-mandarin.app/{activeTab === 'vocab' ? 'hsk/1/vocab' : activeTab === 'flashcard' ? 'hsk/1/flashcard' : 'hsk/1/quiz'}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {activeTab === 'vocab' && <VocabPreview />}
                {activeTab === 'flashcard' && <FlashcardPreview />}
                {activeTab === 'quiz' && <QuizPreview />}
              </div>
            </motion.div>
          </FadeUp>
        </div>
      </section>

      {/* ── LEVEL OVERVIEW ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#d4a017]/15 border border-[#d4a017]/25 rounded-full px-4 py-1.5 mb-5">
              <Layers size={12} className="text-[#d4a017]" />
              <span className="text-[#b88a00] text-xs font-semibold tracking-wide uppercase">Kurikulum Terstruktur</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] mb-4 tracking-tight">
              4 Level, Satu Tujuan
            </h2>
            <p className="text-[#8a8490] text-lg max-w-xl mx-auto">
              Dari nol hingga fasih. Ikuti jalur belajar yang telah dirancang secara terstruktur dan progresif.
            </p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {hskLevels.map((level, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="group bg-white rounded-2xl border border-[#e8e0d6] overflow-hidden hover:shadow-xl hover:shadow-black/8 transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
                  {/* Card header */}
                  <div className={`bg-gradient-to-br ${level.color} p-6 flex flex-col items-center`}>
                    <div className="font-[family-name:var(--font-chinese)] text-6xl font-black text-white/30 leading-none mb-2 select-none">
                      {level.chinese}
                    </div>
                    <div className="font-[family-name:var(--font-chinese)] text-3xl font-black text-white leading-none">
                      {level.chinese}
                    </div>
                    <div className="text-white font-bold text-lg mt-2">{level.title}</div>
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-[#8a8490] text-sm leading-relaxed mb-4 flex-1">{level.desc}</p>

                    <div className="space-y-2 mb-5">
                      {[
                        { label: 'Kosakata', value: `${level.vocab}+` },
                        { label: 'Grammar', value: `${level.grammar} poin` },
                        { label: 'Soal', value: `${level.soal}+` },
                      ].map((stat, j) => (
                        <div key={j} className="flex justify-between items-center text-xs">
                          <span className="text-[#8a8490]">{stat.label}</span>
                          <span className={`font-semibold px-2 py-0.5 rounded-full ${level.badge}`}>{stat.value}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      to={`/hsk/${level.num}/vocab`}
                      className="group/btn w-full text-center bg-[#faf8f5] hover:bg-[#c23a22] text-[#1a1a2e] hover:text-white border border-[#e8e0d6] hover:border-[#c23a22] font-semibold text-sm py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                      Mulai Belajar
                      <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL / SOCIAL PROOF ──────────────────────────────────────── */}
      <section className="py-16 bg-[#f5f0eb] px-4 sm:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-10">
            <p className="text-[#8a8490] text-sm font-semibold uppercase tracking-widest">Dipercaya pelajar di seluruh Indonesia</p>
          </FadeUp>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                quote: 'Akhirnya nemu platform HSK yang full Bahasa Indonesia! Belajarnya jadi jauh lebih mudah ngerti.',
                name: 'Rina S.',
                from: 'Jakarta',
                stars: 5,
              },
              {
                quote: 'Soal latihannya banyak banget, nggak pernah kehabisan buat latihan sebelum ujian HSK.',
                name: 'Budi P.',
                from: 'Surabaya',
                stars: 5,
              },
              {
                quote: 'Flashcard-nya keren, bisa latihan kapan aja di hp. Vocab hafal lebih cepet dari buku.',
                name: 'Sari W.',
                from: 'Bandung',
                stars: 5,
              },
            ].map((t, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-5 border border-[#e8e0d6] shadow-sm">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(t.stars)].map((_, s) => (
                      <Star key={s} size={13} className="fill-[#d4a017] text-[#d4a017]" />
                    ))}
                  </div>
                  <p className="text-[#2d2d3f] text-sm leading-relaxed mb-4">"{t.quote}"</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c23a22] to-[#d4a017] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{t.name[0]}</span>
                    </div>
                    <div>
                      <div className="text-[#1a1a2e] text-sm font-semibold">{t.name}</div>
                      <div className="text-[#8a8490] text-xs">{t.from}</div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ─────────────────────────────────────────────────────── */}
      <section className="py-28 px-4 sm:px-6 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="font-[family-name:var(--font-chinese)] absolute text-[20vw] font-black text-[#c23a22]/[0.04] leading-none top-0 left-[5%] select-none">加油</div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#c23a22]/[0.03] via-transparent to-[#d4a017]/[0.03]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 bg-[#c23a22]/10 border border-[#c23a22]/20 rounded-full px-4 py-1.5 mb-6">
              <Zap size={12} className="text-[#c23a22]" />
              <span className="text-[#c23a22] text-xs font-semibold tracking-wide uppercase">Mulai Sekarang • 100% Gratis</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1a1a2e] mb-5 tracking-tight leading-[1.1]">
              Mulai Perjalanan{' '}
              <span className="text-[#c23a22]">Mandarinmu</span>
              <br />
              Sekarang
            </h2>

            <p className="text-[#8a8490] text-lg leading-relaxed mb-3 max-w-2xl mx-auto">
              Ribuan pelajar Indonesia sudah memulai. Jangan biarkan bahasa jadi penghalangmu — dengan HSK Mandarin, semuanya terasa lebih mudah.
            </p>

            <p className="font-[family-name:var(--font-chinese)] text-[#c23a22] text-2xl font-bold mb-10">加油！</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="group inline-flex items-center justify-center gap-2.5 bg-[#c23a22] text-white font-bold px-10 py-4 rounded-full text-base hover:bg-[#a03020] transition-all shadow-xl shadow-[#c23a22]/30 hover:shadow-2xl hover:shadow-[#c23a22]/40 hover:-translate-y-1"
              >
                Mulai Belajar Gratis
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/hsk/1/vocab"
                className="inline-flex items-center justify-center gap-2 bg-white border border-[#e8e0d6] text-[#2d2d3f] font-semibold px-10 py-4 rounded-full text-base hover:border-[#c23a22]/40 hover:bg-[#fdf9f6] transition-all shadow-sm hover:-translate-y-0.5"
              >
                Langsung ke HSK 1
              </Link>
            </div>

            <p className="text-[#8a8490] text-sm mt-6">Tidak perlu daftar. Tidak perlu kartu kredit. Langsung belajar.</p>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="bg-[#1a1a2e] py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#c23a22] flex items-center justify-center">
                <span className="font-[family-name:var(--font-chinese)] text-white text-sm font-bold">汉</span>
              </div>
              <span className="font-bold text-white text-lg tracking-tight">HSK Mandarin</span>
            </div>

            {/* Nav links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              {[
                { label: 'HSK 1', to: '/hsk/1/vocab' },
                { label: 'HSK 2', to: '/hsk/2/vocab' },
                { label: 'HSK 3', to: '/hsk/3/vocab' },
                { label: 'HSK 4', to: '/hsk/4/vocab' },
                { label: 'Dashboard', to: '/dashboard' },
              ].map((link, i) => (
                <Link key={i} to={link.to} className="text-white/50 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text-sm">
              © 2026 HSK Mandarin. Dibuat untuk pelajar Indonesia.
            </p>
            <div className="flex items-center gap-1.5 text-white/30 text-xs">
              <span className="font-[family-name:var(--font-chinese)]">学中文，加油！</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
