import { useState } from 'react'
import { v1Documents } from '../data/documents'

const priorityLabels = { hot: '🔥 Rất cao', cao: 'Cao', vua: 'Vừa' }
const priorityStyles = {
  hot: 'bg-danger-light text-danger',
  cao: 'bg-warning-light text-warning',
  vua: 'bg-gray-100 text-gray-600',
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
      <h1 className="text-xl font-extrabold flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-full bg-success"></span>
        🟢 Vòng 1 — 10 văn bản kiến thức chung
      </h1>
      <p className="text-sm text-muted mb-4">
        Học theo thứ tự ưu tiên: <b>bộ ba viên chức (Luật VC 129/2025 → NĐ 259/2026 → NĐ 232/2026)</b> và <b>Luật TCCQĐP 72/2025</b> chiếm nhiều câu nhất.
      </p>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <input
          type="search"
          placeholder="🔍 Tìm tài liệu..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2.5 border border-border rounded-xl text-sm bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
        />
        {[['all', 'Tất cả'], ['hot', '🔥 Rất cao'], ['cao', 'Cao'], ['vua', 'Vừa']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
              filter === val
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-muted border-border hover:border-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(doc => (
          <div
            key={doc.id}
            className={`bg-white border border-border rounded-xl p-5 shadow-sm transition-all hover:shadow-md ${
              progress[doc.id] ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${priorityStyles[doc.priority]}`}>
                {priorityLabels[doc.priority]}
              </span>
            </div>
            <h3 className={`font-bold text-sm leading-snug ${progress[doc.id] ? 'line-through' : ''}`}>
              {doc.title}
            </h3>
            <p className="text-xs text-muted mt-1">
              <b>Trọng tâm:</b> {doc.topics}
            </p>

            {doc.note && (
              <div className="mt-3 text-xs bg-red-50 border border-red-200 text-red-800 rounded-lg px-3 py-2">
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
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary-light border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors no-underline"
                >
                  📄 {link.label} ↗
                </a>
              ))}
            </div>

            <button
              onClick={() => toggleExpand(doc.id)}
              className="mt-3 text-xs font-bold text-primary cursor-pointer hover:text-primary-dark bg-transparent border-none"
            >
              {expanded[doc.id] ? '▾ Ẩn trọng tâm' : '▸ Xem trọng tâm & câu tự kiểm tra'}
            </button>

            {expanded[doc.id] && (
              <div className="mt-3 pt-3 border-t border-dashed border-border text-xs">
                <h4 className="text-xs font-bold text-primary-dark mb-2">🎯 Trọng tâm cần nắm</h4>
                <ul className="pl-4 space-y-1">
                  {doc.focus.map((item, i) => (
                    <li key={i} className="text-ink/80">{item}</li>
                  ))}
                </ul>
                <h4 className="text-xs font-bold text-primary-dark mt-4 mb-2">❓ Tự kiểm tra</h4>
                <ol className="pl-4 space-y-1 list-decimal">
                  {doc.selfTest.map((item, i) => (
                    <li key={i} className="text-ink/80">{item}</li>
                  ))}
                </ol>
              </div>
            )}

            <label className="flex items-center gap-2 mt-3 pt-3 border-t border-border text-xs font-semibold text-muted cursor-pointer">
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
