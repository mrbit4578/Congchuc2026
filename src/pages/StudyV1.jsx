import { useState } from 'react'
import { v1Documents } from '../data/documents'

const priorityLabels = { hot: '🔥 Rất cao', cao: 'Cao', vua: 'Vừa' }
const priorityStyles = {
  hot: 'bg-danger-light text-danger',
  cao: 'bg-warning-light text-warning',
  vua: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
}

export default function StudyV1({ progress, toggleDone }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState({})

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const filtered = v1Documents.filter(doc => {
    const matchFilter = filter === 'all' || doc.priority === filter
    const matchSearch = !search || doc.title.toLowerCase().includes(search.toLowerCase()) || doc.topics.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div>
      <h1 className="font-heading text-[16px] font-extrabold flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-full bg-success"></span>
        🟢 Vòng 1 — 10 văn bản kiến thức chung
      </h1>
      <p className="text-[13px] text-muted mb-4">
        Học theo thứ tự ưu tiên: <b>bộ ba viên chức (Luật VC 129/2025 → NĐ 259/2026 → NĐ 232/2026)</b> và <b>Luật TCCQĐP 72/2025</b> chiếm nhiều câu nhất.
      </p>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <input
          type="search"
          placeholder="🔍 Tìm tài liệu..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border border-border rounded-lg text-[13px] bg-white dark:bg-card text-ink placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
        />
        {[['all', 'Tất cả'], ['hot', '🔥 Rất cao'], ['cao', 'Cao'], ['vua', 'Vừa']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
              filter === val
                ? 'bg-primary text-white border-primary'
                : 'bg-white dark:bg-card text-muted border-border hover:border-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map(doc => (
          <div
            key={doc.id}
            className={`bg-white dark:bg-card border border-border rounded-xl p-4 shadow-sm transition-all hover:shadow-md ${
              progress[doc.id] ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${priorityStyles[doc.priority]}`}>
                {priorityLabels[doc.priority]}
              </span>
            </div>
            <h3 className={`font-heading font-bold text-[14px] leading-snug ${progress[doc.id] ? 'line-through' : ''}`}>
              {doc.title}
            </h3>
            <p className="text-[12px] text-muted mt-1">
              <b>Trọng tâm:</b> {doc.topics}
            </p>

            {doc.note && (
              <div className="mt-2 text-[12px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300 rounded-lg px-3 py-2">
                {doc.note}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              {doc.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary bg-primary-light dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-lg hover:bg-primary hover:text-white transition-colors no-underline"
                >
                  📄 {link.label} ↗
                </a>
              ))}
            </div>

            <button
              onClick={() => toggleExpand(doc.id)}
              className="mt-3 text-[12px] font-bold text-primary cursor-pointer hover:text-primary-dark dark:hover:text-indigo-300 bg-transparent border-none"
            >
              {expanded[doc.id] ? '▾ Ẩn trọng tâm' : '▸ Xem trọng tâm & câu tự kiểm tra'}
            </button>

            {expanded[doc.id] && (
              <div className="mt-3 pt-3 border-t border-dashed border-border text-[12px]">
                <h4 className="font-heading text-[12px] font-bold text-primary-dark dark:text-indigo-300 mb-2">🎯 Trọng tâm cần nắm</h4>
                <ul className="pl-4 space-y-1">
                  {doc.focus.map((item, i) => (
                    <li key={i} className="text-ink/80 dark:text-ink/90 leading-relaxed">{item}</li>
                  ))}
                </ul>
                <h4 className="font-heading text-[12px] font-bold text-primary-dark dark:text-indigo-300 mt-3 mb-2">❓ Tự kiểm tra</h4>
                <ol className="pl-4 space-y-1 list-decimal">
                  {doc.selfTest.map((item, i) => (
                    <li key={i} className="text-ink/80 dark:text-ink/90 leading-relaxed">{item}</li>
                  ))}
                </ol>
              </div>
            )}

            <label className="flex items-center gap-2 mt-3 pt-3 border-t border-border text-[12px] font-semibold text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={!!progress[doc.id]}
                onChange={() => toggleDone(doc.id)}
                className="w-4 h-4 accent-success cursor-pointer"
              />
              Đã học xong
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
