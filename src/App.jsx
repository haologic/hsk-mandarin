import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Vocab from './pages/Vocab'
import Grammar from './pages/Grammar'
import Quiz from './pages/Quiz'

function App() {
  const location = useLocation()
  const showNavbar = location.pathname !== '/'

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream, #faf8f5)' }}>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hsk/:level/vocab" element={<Vocab />} />
        <Route path="/hsk/:level/grammar" element={<Grammar />} />
        <Route path="/hsk/:level/quiz" element={<Quiz />} />
      </Routes>
    </div>
  )
}

export default App
