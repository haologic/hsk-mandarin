import hsk1Vocab from './hsk1-vocab.json'
import hsk1Grammar from './hsk1-grammar.json'
import hsk1Soal from './hsk1-soal.json'
import hsk2Vocab from './hsk2-vocab.json'
import hsk2Grammar from './hsk2-grammar.json'
import hsk2Soal from './hsk2-soal.json'
import hsk3Vocab from './hsk3-vocab.json'
import hsk3Grammar from './hsk3-grammar.json'
import hsk3Soal from './hsk3-soal.json'
import hsk4Vocab from './hsk4-vocab.json'
import hsk4Grammar from './hsk4-grammar.json'
import hsk4Soal from './hsk4-soal.json'

export const hskData = {
  1: {
    vocab: hsk1Vocab,
    grammar: hsk1Grammar,
    soal: hsk1Soal,
    label: 'HSK 1',
    sublabel: 'Pemula',
    hanzi: '一',
    color: 'vermillion',
    description: 'Dasar-dasar Bahasa Mandarin. Kosakata sehari-hari, salam, perkenalan, angka, dan percakapan sederhana.',
  },
  2: {
    vocab: hsk2Vocab,
    grammar: hsk2Grammar,
    soal: hsk2Soal,
    label: 'HSK 2',
    sublabel: 'Dasar',
    hanzi: '二',
    color: 'gold',
    description: 'Memperluas kosakata dan kemampuan membuat kalimat lebih kompleks untuk kehidupan sehari-hari.',
  },
  3: {
    vocab: hsk3Vocab,
    grammar: hsk3Grammar,
    soal: hsk3Soal,
    label: 'HSK 3',
    sublabel: 'Menengah Awal',
    hanzi: '三',
    color: 'jade',
    description: 'Mampu berkomunikasi dalam situasi sehari-hari di China, termasuk bekerja dan belajar.',
  },
  4: {
    vocab: hsk4Vocab,
    grammar: hsk4Grammar,
    soal: hsk4Soal,
    label: 'HSK 4',
    sublabel: 'Menengah',
    hanzi: '四',
    color: 'vermillion',
    description: 'Dapat berdiskusi tentang berbagai topik dengan lancar dan memahami teks Mandarin yang lebih kompleks.',
  },
}

// Progress helpers using localStorage
export function getProgress(level) {
  try {
    const data = JSON.parse(localStorage.getItem(`hsk_progress_${level}`) || '{}')
    return {
      learnedVocab: data.learnedVocab || [],
      completedBabs: data.completedBabs || [],
      quizScores: data.quizScores || {},
      flashcardsDue: data.flashcardsDue || {},
    }
  } catch {
    return { learnedVocab: [], completedBabs: [], quizScores: {}, flashcardsDue: {} }
  }
}

export function saveProgress(level, progress) {
  localStorage.setItem(`hsk_progress_${level}`, JSON.stringify(progress))
}

export function getOverallStats() {
  const stats = { totalVocabLearned: 0, totalQuizzesDone: 0, totalScore: 0 }
  for (const level of [1, 2, 3, 4]) {
    const p = getProgress(level)
    stats.totalVocabLearned += p.learnedVocab.length
    stats.totalQuizzesDone += p.completedBabs.length
    const scores = Object.values(p.quizScores)
    stats.totalScore += scores.reduce((a, b) => a + b, 0)
  }
  return stats
}
