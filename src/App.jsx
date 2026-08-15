import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import StudyV1 from './pages/StudyV1'
import StudyV2 from './pages/StudyV2'
import Quiz from './pages/Quiz'
import Roadmap from './pages/Roadmap'
import Topics from './pages/Topics'
import QA from './pages/QA'
import AiQA from './pages/AiQA'

function App() {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('onthi-progress')
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem('onthi-progress', JSON.stringify(progress))
  }, [progress])

  const toggleDone = (id) => {
    setProgress(prev => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else next[id] = true
      return next
    })
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home progress={progress} />} />
        <Route path="vong-1" element={<StudyV1 progress={progress} toggleDone={toggleDone} />} />
        <Route path="vong-2" element={<StudyV2 progress={progress} toggleDone={toggleDone} />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="lo-trinh" element={<Roadmap />} />
        <Route path="chu-de" element={<Topics />} />
        <Route path="hoi-dap" element={<QA />} />
        <Route path="hoi-dap-ai" element={<AiQA />} />
      </Route>
    </Routes>
  )
}

export default App
