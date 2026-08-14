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
        <h1 className="font-heading text-[16px] font-extrabold mb-2">📝 Kiểm tra kiến thức</h1>
        <p className="text-[13px] text-muted mb-6">Chọn chế độ kiểm tra để đánh giá kiến thức của bạn.</p>

        <div className="bg-white dark:bg-card border border-border rounded-xl p-5 shadow-sm max-w-lg">
          <h3 className="font-heading font-bold text-[14px] mb-4">Cấu hình bài kiểm tra</h3>

          <div className="mb-4">
            <label className="text-[12px] font-semibold text-muted block mb-1">Chủ đề</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-[13px] bg-white dark:bg-card text-ink"
            >
              <option value="all">Tất cả ({quizQuestions.length} câu)</option>
              <option value="Vòng 1 — Kiến thức chung">Vòng 1 — Kiến thức chung</option>
              <option value="Vòng 2 — Chuyên ngành Kế toán">Vòng 2 — Chuyên ngành Kế toán</option>
              <option value="Tổng hợp">Tổng hợp</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="text-[12px] font-semibold text-muted block mb-1">Số câu hỏi: {questionCount}</label>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={questionCount}
              onChange={e => setQuestionCount(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[12px] text-muted">
              <span>5</span>
              <span>30</span>
              <span>60</span>
            </div>
          </div>

          <button
            onClick={() => startQuiz(true)}
            className="w-full bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-primary-dark transition-colors text-[13px]"
          >
            🎲 Bắt đầu kiểm tra (ngẫu nhiên)
          </button>

          <div className="mt-5 pt-4 border-t border-border">
            <h4 className="font-heading text-[12px] font-bold text-muted mb-3">Hoặc kiểm tra theo chuyên mục:</h4>
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
                    className="text-left text-[12px] bg-surface dark:bg-[#252840] border border-border rounded-lg px-3 py-2 hover:bg-primary-light dark:hover:bg-indigo-950/30 hover:border-primary transition-colors"
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
        <h1 className="font-heading text-[16px] font-extrabold mb-6">📊 Kết quả kiểm tra</h1>

        <div className={`border rounded-xl p-6 text-center mb-6 ${passed ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'}`}>
          <div className="text-4xl font-extrabold font-heading mb-2" style={{ color: passed ? '#059669' : '#dc2626' }}>
            {score}/{questions.length}
          </div>
          <div className="text-[15px] font-bold font-heading" style={{ color: passed ? '#059669' : '#dc2626' }}>
            {percent}% — {passed ? 'ĐẠT ✅' : 'CHƯA ĐẠT ❌'}
          </div>
          <p className="text-[12px] text-muted mt-2">
            {passed ? 'Chúc mừng! Bạn đã đạt yêu cầu (≥50%).' : 'Bạn cần ôn tập thêm. Mục tiêu: ≥50% để qua Vòng 1.'}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {questions.map((q, qi) => {
            const ans = answers[qi]
            const isCorrect = ans?.correct
            return (
              <div key={q.id} className={`bg-white dark:bg-card border rounded-xl p-4 ${isCorrect ? 'border-emerald-200 dark:border-emerald-800' : 'border-red-200 dark:border-red-800'}`}>
                <div className="flex items-start gap-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isCorrect ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold">{q.question}</p>
                    <p className="text-[12px] text-success mt-1">
                      Đáp án đúng: <b>{q.options[q.correct]}</b>
                    </p>
                    {!isCorrect && ans && (
                      <p className="text-[12px] text-danger mt-0.5">
                        Bạn chọn: {q.options[ans.selected]}
                      </p>
                    )}
                    <p className="text-[12px] text-muted mt-1 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button onClick={resetQuiz} className="w-full bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-primary-dark transition-colors text-[13px]">
          🔄 Làm bài khác
        </button>
      </div>
    )
  }

  const q = questions[current]
  if (!q) return null

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[12px] font-bold text-muted">Câu {current + 1}/{questions.length}</span>
        <div className="flex-1 h-2 bg-gray-100 dark:bg-[#252840] rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-[12px] font-bold text-muted">Điểm: {score}</span>
      </div>

      <div className="bg-white dark:bg-card border border-border rounded-xl p-5 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-semibold text-primary bg-primary-light dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">{q.subcategory}</span>
        </div>
        <h2 className="font-heading text-[14px] font-bold mt-2 mb-4">{q.question}</h2>

        <div className="space-y-2">
          {q.options.map((opt, oi) => {
            let style = 'bg-surface dark:bg-[#252840] border-border hover:border-primary'
            if (showResult) {
              if (oi === q.correct) style = 'bg-emerald-50 dark:bg-emerald-950/30 border-success text-success'
              else if (oi === selected && oi !== q.correct) style = 'bg-red-50 dark:bg-red-950/30 border-danger text-danger'
              else style = 'bg-gray-50 dark:bg-[#1a1d2e] border-border opacity-50'
            } else if (oi === selected) {
              style = 'bg-primary-light dark:bg-indigo-950/50 border-primary text-primary'
            }
            return (
              <button
                key={oi}
                onClick={() => handleSelect(oi)}
                className={`w-full text-left px-3 py-2.5 border rounded-lg text-[13px] font-medium transition-colors ${style}`}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>
                {opt}
              </button>
            )
          })}
        </div>

        {showResult && (
          <div className={`mt-4 p-3 rounded-lg text-[12px] leading-relaxed ${selected === q.correct ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
            <b>{selected === q.correct ? '✅ Chính xác!' : '❌ Sai rồi.'}</b> {q.explanation}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {!showResult ? (
          <button
            onClick={handleConfirm}
            disabled={selected === null}
            className="flex-1 bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-[13px]"
          >
            Xác nhận
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 bg-success text-white font-bold py-2.5 rounded-lg hover:bg-emerald-700 transition-colors text-[13px]"
          >
            {current < questions.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả 📊'}
          </button>
        )}
        <button
          onClick={resetQuiz}
          className="px-4 py-2.5 border border-border rounded-lg text-[12px] font-semibold text-muted hover:bg-gray-100 dark:hover:bg-[#252840] transition-colors"
        >
          Thoát
        </button>
      </div>
    </div>
  )
}
