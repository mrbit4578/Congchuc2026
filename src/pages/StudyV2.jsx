import { useState } from 'react'
import { v2Documents, downloadFiles } from '../data/documents'
import { guides } from '../data/guides'

const priorityLabels = { hot: '🔥 Rất cao', cao: 'Cao', vua: 'Vừa' }
const priorityStyles = {
  hot: 'bg-danger-light text-danger',
  cao: 'bg-warning-light text-warning',
  vua: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
}

export default function StudyV2({ progress, toggleDone }) {
  const [expanded, setExpanded] = useState({})
  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div>
      <h1 className="font-heading text-[16px] font-extrabold flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-full bg-warning"></span>
        🧮 Vòng 2 — 11 văn bản chuyên ngành Kế toán
      </h1>
      <p className="text-[13px] text-muted mb-6">
        Cụm A (chế độ kế toán HCSN) là <b>cốt lõi</b> — dự kiến chiếm tỷ trọng lớn nhất bài viết 180' và phỏng vấn.
      </p>

      {v2Documents.map((cum, ci) => (
        <div key={ci} className="mb-6">
          <h2 className="font-heading text-[14px] font-extrabold text-primary-dark dark:text-indigo-300 flex items-center gap-2 mb-4">
            <span className="flex-1 h-px bg-border"></span>
            <span>{cum.cum}</span>
            <span className="flex-1 h-px bg-border"></span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {cum.docs.map(doc => (
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
                  {downloadFiles[doc.id] && (
                    <a
                      href={`/downloads/${downloadFiles[doc.id].filename}`}
                      download
                      className="inline-flex items-center gap-1 text-[12px] font-semibold text-success bg-success-light dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg hover:bg-success hover:text-white transition-colors no-underline"
                    >
                      ⬇️ Tải .docx
                    </a>
                  )}
                </div>

                <button
                  onClick={() => toggleExpand(doc.id)}
                  className="mt-3 text-[12px] font-bold text-primary cursor-pointer hover:text-primary-dark dark:hover:text-indigo-300 bg-transparent border-none"
                >
                  {expanded[doc.id] ? '▾ Ẩn nội dung' : '▸ Xem nội dung chi tiết'}
                </button>

                {expanded[doc.id] && guides[doc.id] && (
                  <div className="mt-3 pt-3 border-t border-dashed border-border text-[12px]">
                    {/* Info table */}
                    <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-lg p-3 mb-3">
                      <h4 className="font-heading text-[12px] font-bold text-primary-dark dark:text-indigo-300 mb-2">📋 Thông tin văn bản</h4>
                      <div className="grid grid-cols-1 gap-1">
                        {Object.entries(guides[doc.id].info).map(([key, val]) => {
                          const labels = { soHieu: 'Số hiệu', loai: 'Loại', ngayBanHanh: 'Ngày ban hành', ngayHieuLuc: 'Ngày hiệu lực', coQuan: 'Cơ quan', thayThe: 'Thay thế', cauTruc: 'Cấu trúc', apDung: 'Áp dụng' }
                          return (
                            <div key={key} className="flex gap-2">
                              <span className="font-semibold text-ink/70 dark:text-ink/60 min-w-[100px]">{labels[key] || key}:</span>
                              <span className="text-ink/90 dark:text-ink/80">{val}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Guide sections */}
                    {guides[doc.id].sections.map((section, si) => (
                      <div key={si} className="mb-3">
                        <h4 className="font-heading text-[12px] font-bold text-primary-dark dark:text-indigo-300 mb-1.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          {section.heading}
                        </h4>
                        <ul className="pl-4 space-y-0.5">
                          {section.content.map((line, li) => {
                            const isIndented = line.startsWith('  ') || line.startsWith('- ')
                            const text = line.replace(/^[- ]+/, '').trim()
                            return (
                              <li key={li} className={`text-ink/80 dark:text-ink/90 leading-relaxed ${isIndented ? 'ml-3 list-none' : ''}`}>
                                {isIndented ? `• ${text}` : text}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    ))}

                    {/* Original focus & selfTest */}
                    <div className="mt-3 pt-3 border-t border-dashed border-border">
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
      ))}
    </div>
  )
}
