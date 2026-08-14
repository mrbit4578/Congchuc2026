import { useState, useMemo } from 'react'
import { quizQuestions, getQuestionsByCategory, getSubcategories, getRandomQuestions } from '../data/quizData'

export default function Quiz() {
  const [mode, setMode] = useState('setup')
  const [category, setCategory] = useState('all')
  const [questionCount, setQuestionCount] = useState(20)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])

  const subcategories = useMemo(() => getSubcategories(), [])

  const startQuiz = (isRandom = true) => {
    const qs = isRandom ? getRandomQuestions(questionCount, category) : getQuestionsByCategory(category).slice(0, questionCount)
    setQuestions(qs)
    setCurrent(0)
    setSelected(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
    setMode('quiz')
  }

  const handleSelect = (idx) => {
    if (showResult) return
    setSelected(idx)
  }

  const handleConfirm = () => {
    if (selected === null) return
    setShowResult(true)
    const isCorrect = selected === questions[current].correct
    if (isCorrect) setScore(s => s + 1)
    setAnswers(prev => [...prev, { questionId: questions[current].id, selected, correct: isCorrect }])
  }

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      setMode('result')
    }
  }

  const resetQuiz = () => {
    setMode('setup')
    setQuestions([])
    setCurrent(0)
    setSelected(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
  }

  if (mode === 'setup') {
    return (
      <div>
        <h1 className="text-xl font-extrabold mb-2">📝 Kiểm tra kiến thức</h1>
        <p className="text-sm text-muted mb-6">Chọn chế độ kiểm tra để đánh giá kiến thức của bạn.</p>

        <div className="bg-white border border-border rounded-xl p-6 shadow-sm max-w-lg">
          <h3 className="font-bold text-sm mb-4">Cấu hình bài kiểm tra</h3>

          <div className="mb-4">
            <label className="text-xs font-semibold text-muted block mb-1">Chủ đề</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white"
            >
              <option value="all">Tất cả ({quizQuestions.length} câu)</option>
              <option value="Vòng 1 — Kiến thức chung">Vòng 1 — Kiến thức chung</option>
              <option value="Vòng 2 — Chuyên ngành Kế toán">Vòng 2 — Chuyên ngành Kế toán</option>
              <option value="Tổng hợp">Tổng hợp</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="text-xs font-semibold text-muted block mb-1">Số câu hỏi: {questionCount}</label>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={questionCount}
              onChange={e => setQuestionCount(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>5</span>
              <span>30</span>
              <span>60</span>
            </div>
          </div>

          <button
            onClick={() => startQuiz(true)}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors"
          >
            🎲 Bắt đầu kiểm tra (ngẫu nhiên)
          </button>

          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-xs font-bold text-muted mb-3">Hoặc kiểm tra theo chuyên mục:</h4>
            <div className="grid grid-cols-2 gap-2">
              {subcategories.slice(0, 8).map(sub => {
                const count = quizQuestions.filter(q => q.subcategory === sub).length
                return (
                  <button
                    key={sub}
                    onClick={() => {
                      setQuestions(quizQuestions.filter(q => q.subcategory === sub))
                      setCurrent(0)
                      setSelected(null)
                      setShowResult(false)
                      setScore(0)
                      setAnswers([])
                      setMode('quiz')
                    }}
                    className="text-left text-xs bg-surface border border-border rounded-lg px-3 py-2 hover:bg-primary-light hover:border-primary transition-colors"
                  >
                    <span className="font-semibold text-ink">{sub}</span>
                    <span className="text-muted ml-1">({count})</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'result') {
    const percent = Math.round((score / questions.length) * 100)
    const passed = percent >= 50
    return (
      <div>
        <h1 className="text-xl font-extrabold mb-6">📊 Kết quả kiểm tra</h1>

        <div className={`border rounded-xl p-8 text-center mb-6 ${passed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="text-5xl font-extrabold mb-2" style={{ color: passed ? '#059669' : '#dc2626' }}>
            {score}/{questions.length}
          </div>
          <div className="text-lg font-bold" style={{ color: passed ? '#059669' : '#dc2626' }}>
            {percent}% — {passed ? 'ĐẠT ✅' : 'CHƯA ĐẠT ❌'}
          </div>
          <p className="text-sm text-muted mt-2">
            {passed ? 'Chúc mừng! Bạn đã đạt yêu cầu (≥50%).' : 'Bạn cần ôn tập thêm. Mục tiêu: ≥50% để qua Vòng 1.'}
          </p>
        </div>

        {/* Review */}
        <div className="space-y-4 mb-6">
          {questions.map((q, qi) => {
            const ans = answers[qi]
            const isCorrect = ans?.correct
            return (
              <div key={q.id} className={`bg-white border rounded-xl p-4 ${isCorrect ? 'border-emerald-200' : 'border-red-200'}`}>
                <div className="flex items-start gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCorrect ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{q.question}</p>
                    <p className="text-xs text-success mt-1">
                      Đáp án đúng: <b>{q.options[q.correct]}</b>
                    </p>
                    {!isCorrect && ans && (
                      <p className="text-xs text-danger mt-0.5">
                        Bạn chọn: {q.options[ans.selected]}
                      </p>
                    )}
                    <p className="text-xs text-muted mt-1">{q.explanation}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={resetQuiz} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors">
            🔄 Làm bài khác
          </button>
        </div>
      </div>
    )
  }

  // Quiz mode
  const q = questions[current]
  if (!q) return null

  return (
    <div>
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-bold text-muted">Câu {current + 1}/{questions.length}</span>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-bold text-muted">Điểm: {score}</span>
      </div>

      {/* Question */}
      <div className="bg-white border border-border rounded-xl p-6 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full">{q.subcategory}</span>
        </div>
        <h2 className="text-base font-bold mt-2 mb-4">{q.question}</h2>

        <div className="space-y-2">
          {q.options.map((opt, oi) => {
            let style = 'bg-surface border-border hover:border-primary'
            if (showResult) {
              if (oi === q.correct) style = 'bg-emerald-50 border-success text-success'
              else if (oi === selected && oi !== q.correct) style = 'bg-red-50 border-danger text-danger'
              else style = 'bg-gray-50 border-border opacity-50'
            } else if (oi === selected) {
              style = 'bg-primary-light border-primary text-primary'
            }
            return (
              <button
                key={oi}
                onClick={() => handleSelect(oi)}
                className={`w-full text-left px-4 py-3 border rounded-xl text-sm font-medium transition-colors ${style}`}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>
                {opt}
              </button>
            )
          })}
        </div>

        {showResult && (
          <div className={`mt-4 p-3 rounded-lg text-xs ${selected === q.correct ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            <b>{selected === q.correct ? '✅ Chính xác!' : '❌ Sai rồi.'}</b> {q.explanation}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {!showResult ? (
          <button
            onClick={handleConfirm}
            disabled={selected === null}
            className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Xác nhận
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 bg-success text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            {current < questions.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả 📊'}
          </button>
        )}
        <button
          onClick={resetQuiz}
          className="px-4 py-3 border border-border rounded-xl text-sm font-semibold text-muted hover:bg-gray-100 transition-colors"
        >
          Thoát
        </button>
      </div>
    </div>
  )
}
