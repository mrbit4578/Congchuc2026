import { useEffect, useMemo, useState } from 'react'
import { qaCategories, qaItems, qaSourceLabels, searchQa, suggestedQuestions } from '../data/qa'

const SAVED_KEY = 'onthi-qa-saved'
const SUBMITTED_KEY = 'onthi-qa-submitted'

function BookmarkIcon({ filled = false }) {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 4.75A1.75 1.75 0 017.75 3h8.5A1.75 1.75 0 0118 4.75V21l-6-3.75L6 21V4.75z" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path strokeLinecap="round" d="m16 16 4.5 4.5" />
    </svg>
  )
}

function StatCard({ value, label, icon }) {
  return (
    <div className="bg-white dark:bg-card border border-border rounded-xl p-3 shadow-sm flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary-light dark:bg-indigo-950/50 flex items-center justify-center text-lg">{icon}</div>
      <div>
        <p className="font-heading font-extrabold text-[17px] leading-none">{value}</p>
        <p className="text-[11px] text-muted mt-1">{label}</p>
      </div>
    </div>
  )
}

function QaCard({ item, open, saved, onToggle, onSave }) {
  return (
    <article className={`bg-white dark:bg-card border rounded-xl shadow-sm transition-colors ${open ? 'border-primary/50' : 'border-border'}`}>
      <div className="flex items-start gap-3 p-4">
        <button
          type="button"
          onClick={() => onToggle(item.id)}
          className="flex-1 text-left min-w-0"
          aria-expanded={open}
          aria-controls={`${item.id}-answer`}
        >
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary-light dark:bg-indigo-950/50 rounded-full px-2 py-1">{item.categoryLabel}</span>
            {saved && <span className="text-[10px] font-bold text-success bg-success-light dark:bg-emerald-950/50 rounded-full px-2 py-1">Đã lưu</span>}
          </div>
          <h2 className="font-heading text-[14px] font-extrabold leading-relaxed text-ink">{item.question}</h2>
        </button>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onSave(item.id)}
            className={`p-2 rounded-lg transition-colors ${saved ? 'text-primary bg-primary-light dark:bg-indigo-950/50' : 'text-muted hover:text-primary hover:bg-primary-light dark:hover:bg-indigo-950/50'}`}
            title={saved ? 'Bỏ lưu câu hỏi' : 'Lưu câu hỏi'}
            aria-label={saved ? 'Bỏ lưu câu hỏi' : 'Lưu câu hỏi'}
          >
            <BookmarkIcon filled={saved} />
          </button>
          <button
            type="button"
            onClick={() => onToggle(item.id)}
            className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary-light dark:hover:bg-indigo-950/50"
            aria-label={open ? 'Thu gọn câu trả lời' : 'Mở câu trả lời'}
          >
            <ChevronIcon open={open} />
          </button>
        </div>
      </div>

      {open && (
        <div id={`${item.id}-answer`} className="border-t border-border px-4 pb-4 pt-3">
          <p className="text-[13px] leading-7 text-ink">{item.answer}</p>
          <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 p-3">
            <p className="text-[12px] leading-relaxed text-amber-900 dark:text-amber-100"><strong>Gợi ý ôn tập:</strong> {item.tip}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {item.tags.map((tag) => (
              <span key={tag} className="text-[11px] text-muted bg-surface dark:bg-[#252840] border border-border rounded-full px-2 py-1">#{tag}</span>
            ))}
          </div>
          {item.source && (
            <p className="text-[11px] text-muted mt-3">Nguồn trong kho ôn tập: {qaSourceLabels[item.source] || item.source}</p>
          )}
        </div>
      )}
    </article>
  )
}

export default function QA() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [openId, setOpenId] = useState('qa-1')
  const [savedIds, setSavedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
    } catch {
      return []
    }
  })
  const [submittedQuestions, setSubmittedQuestions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SUBMITTED_KEY) || '[]')
    } catch {
      return []
    }
  })
  const [draftQuestion, setDraftQuestion] = useState('')
  const [showComposer, setShowComposer] = useState(false)
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedIds))
  }, [savedIds])

  useEffect(() => {
    localStorage.setItem(SUBMITTED_KEY, JSON.stringify(submittedQuestions))
  }, [submittedQuestions])

  const filteredItems = useMemo(() => {
    const result = searchQa(qaItems, query, category)
    return showSavedOnly ? result.filter((item) => savedIds.includes(item.id)) : result
  }, [category, query, savedIds, showSavedOnly])

  const submitQuestion = (event) => {
    event.preventDefault()
    const text = draftQuestion.trim()
    if (!text) return

    const next = [{ id: `submitted-${Date.now()}`, text, createdAt: new Date().toLocaleDateString('vi-VN') }, ...submittedQuestions]
    setSubmittedQuestions(next)
    setDraftQuestion('')
    setShowComposer(false)
    setNotice('Đã lưu câu hỏi trên thiết bị này. Bạn có thể xem lại ở khu vực bên dưới.')
    window.setTimeout(() => setNotice(''), 4500)
  }

  const toggleSaved = (id) => {
    setSavedIds((current) => current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id])
  }

  const applySuggestion = (suggestion) => {
    setQuery(suggestion)
    setShowSavedOnly(false)
  }

  return (
    <div>
      <div className="mb-5">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary mb-2">Trợ lý ôn tập</p>
            <h1 className="font-heading text-[21px] font-extrabold flex items-center gap-2">💬 Hỏi đáp ôn thi viên chức</h1>
            <p className="text-[13px] text-muted mt-2 max-w-2xl leading-relaxed">Tra cứu nhanh các câu hỏi thường gặp về tuyển dụng, kiến thức chung, nghiệp vụ kế toán và phương pháp làm bài.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowComposer((open) => !open)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[12px] font-bold text-white shadow-sm hover:bg-primary-dark transition-colors"
          >
            <span className="text-base leading-none">＋</span> Đặt câu hỏi
          </button>
        </div>
      </div>

      {showComposer && (
        <form onSubmit={submitQuestion} className="mb-5 bg-white dark:bg-card border border-primary/30 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h2 className="font-heading text-[14px] font-extrabold">Đặt câu hỏi để ôn lại sau</h2>
            <button type="button" onClick={() => setShowComposer(false)} className="text-muted hover:text-ink text-lg leading-none" aria-label="Đóng">×</button>
          </div>
          <p className="text-[12px] text-muted mb-3">Câu hỏi sẽ được lưu cục bộ trên trình duyệt của bạn. Tính năng này chưa gửi dữ liệu lên máy chủ.</p>
          <textarea
            value={draftQuestion}
            onChange={(event) => setDraftQuestion(event.target.value)}
            placeholder="Ví dụ: Hồ sơ dự tuyển cần chuẩn bị trước bao lâu?"
            rows={3}
            className="w-full rounded-lg border border-border bg-surface dark:bg-[#252840] px-3 py-2.5 text-[13px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-y"
          />
          <div className="flex justify-end mt-3">
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-[12px] font-bold text-white hover:bg-primary-dark transition-colors">Lưu câu hỏi</button>
          </div>
        </form>
      )}

      {notice && <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-900/50 px-3 py-2.5 text-[12px] text-emerald-800 dark:text-emerald-100">✓ {notice}</div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard value={qaItems.length} label="Câu hỏi có sẵn" icon="💡" />
        <StatCard value={qaCategories.length - 1} label="Nhóm chủ đề" icon="🗂️" />
        <StatCard value={savedIds.length} label="Câu hỏi đã lưu" icon="🔖" />
        <StatCard value={submittedQuestions.length} label="Câu hỏi của bạn" icon="✍️" />
      </div>

      <section className="bg-white dark:bg-card border border-border rounded-xl p-4 shadow-sm mb-5">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"><SearchIcon /></span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo câu hỏi, chủ đề hoặc từ khóa..."
            className="w-full rounded-lg border border-border bg-surface dark:bg-[#252840] pl-9 pr-3 py-2.5 text-[13px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {qaCategories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { setCategory(item.id); setShowSavedOnly(false) }}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${category === item.id && !showSavedOnly ? 'bg-primary text-white' : 'bg-surface dark:bg-[#252840] text-muted border border-border hover:border-primary hover:text-primary'}`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowSavedOnly((current) => !current)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${showSavedOnly ? 'bg-success text-white' : 'bg-surface dark:bg-[#252840] text-muted border border-border hover:border-success hover:text-success'}`}
          >
            🔖 Đã lưu ({savedIds.length})
          </button>
        </div>
      </section>

      {!query && !showSavedOnly && (
        <div className="mb-5">
          <p className="text-[11px] text-muted mb-2">Gợi ý tìm nhanh</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => applySuggestion(suggestion)} className="text-left text-[11px] text-primary bg-primary-light dark:bg-indigo-950/50 rounded-full px-3 py-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors">{suggestion}</button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="font-heading text-[15px] font-extrabold">{showSavedOnly ? 'Câu hỏi đã lưu' : 'Danh sách hỏi đáp'}</h2>
        <span className="text-[11px] text-muted">{filteredItems.length} kết quả</span>
      </div>

      {filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <QaCard
              key={item.id}
              item={item}
              open={openId === item.id}
              saved={savedIds.includes(item.id)}
              onToggle={(id) => setOpenId((current) => current === id ? null : id)}
              onSave={toggleSaved}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-card border border-border rounded-xl p-8 text-center shadow-sm">
          <div className="text-3xl mb-2">🔎</div>
          <h2 className="font-heading text-[15px] font-extrabold">Chưa tìm thấy câu hỏi phù hợp</h2>
          <p className="text-[12px] text-muted mt-2">Thử từ khóa ngắn hơn hoặc đặt câu hỏi để lưu lại nội dung cần bổ sung.</p>
          <button type="button" onClick={() => { setQuery(''); setCategory('all'); setShowSavedOnly(false) }} className="mt-4 text-[12px] font-bold text-primary hover:text-primary-dark">Xóa bộ lọc</button>
        </div>
      )}

      {submittedQuestions.length > 0 && (
        <section className="mt-6 bg-white dark:bg-card border border-border rounded-xl p-4 shadow-sm">
          <h2 className="font-heading text-[14px] font-extrabold">Câu hỏi bạn đã lưu</h2>
          <p className="text-[12px] text-muted mt-1 mb-3">Dùng danh sách này để bổ sung vào buổi ôn tập tiếp theo.</p>
          <div className="space-y-2">
            {submittedQuestions.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-lg bg-surface dark:bg-[#252840] border border-border px-3 py-2.5">
                <span className="text-primary">?</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] leading-relaxed">{item.text}</p>
                  <p className="text-[10px] text-muted mt-1">Đã lưu ngày {item.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/50 p-4">
        <p className="text-[12px] leading-relaxed text-amber-900 dark:text-amber-100"><strong>Lưu ý:</strong> Nội dung Hỏi đáp là tài liệu hỗ trợ ôn tập được biên soạn theo kho dữ liệu của website, không thay thế thông báo tuyển dụng hoặc văn bản pháp luật chính thức. Hãy kiểm tra nguồn cập nhật trước khi sử dụng cho hồ sơ và kỳ thi thực tế.</p>
      </div>
    </div>
  )
}
