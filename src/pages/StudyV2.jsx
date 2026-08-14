import { useState } from 'react'
import { v2Documents } from '../data/documents'

const priorityLabels = { hot: '🔥 Rất cao', cao: 'Cao', vua: 'Vừa' }
const priorityStyles = {
  hot: 'bg-danger-light text-danger',
  cao: 'bg-warning-light text-warning',
  vua: 'bg-gray-100 text-gray-600',
}

export default function StudyV2({ progress, toggleDone }) {
  const [expanded, setExpanded] = useState({})
  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div>
      <h1 className="text-xl font-extrabold flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-full bg-warning"></span>
        🧮 Vòng 2 — 11 văn bản chuyên ngành Kế toán
      </h1>
      <p className="text-sm text-muted mb-6">
        Cụm A (chế độ kế toán HCSN) là <b>cốt lõi</b> — dự kiến chiếm tỷ trọng lớn nhất bài viết 180' và phỏng vấn.
      </p>

      {v2Documents.map((cum, ci) => (
        <div key={ci} className="mb-8">
          <h2 className="text-base font-extrabold text-primary-dark flex items-center gap-2 mb-4">
            <span className="flex-1 h-px bg-border"></span>
            <span>{cum.cum}</span>
            <span className="flex-1 h-px bg-border"></span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {cum.docs.map(doc => (
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
      ))}
    </div>
  )
}
