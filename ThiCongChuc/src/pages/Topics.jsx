import { useState } from 'react'
import { topTopics } from '../data/documents'

export default function Topics() {
  const [checked, setChecked] = useState(() => {
    const saved = localStorage.getItem('topics-checked')
    return saved ? JSON.parse(saved) : {}
  })

  const toggle = (i) => {
    const next = { ...checked, [i]: !checked[i] }
    if (!next[i]) delete next[i]
    setChecked(next)
    localStorage.setItem('topics-checked', JSON.stringify(next))
  }

  const doneCount = Object.keys(checked).length

  return (
    <div>
      <h1 className="font-heading text-[16px] font-extrabold flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-full bg-danger"></span>
        🔑 15 chủ đề dễ ra đề nhất
      </h1>
      <p className="text-[13px] text-muted mb-4">
        Checklist "ăn điểm" — tự kiểm tra bằng cách nhẩm lại không nhìn tài liệu; chủ đề nào chưa chắc thì quay lại đúng văn bản tương ứng.
      </p>

      <div className="bg-white dark:bg-card border border-border rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex justify-between text-[13px] font-semibold mb-2">
          <span>📈 Tiến độ</span>
          <span>{doneCount} / {topTopics.length} chủ đề</span>
        </div>
        <div className="h-2.5 bg-gray-100 dark:bg-[#252840] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-success rounded-full transition-all duration-300"
            style={{ width: `${Math.round((doneCount / topTopics.length) * 100)}%` }}
          />
        </div>
      </div>

      <ol className="space-y-2">
        {topTopics.map((topic, i) => (
          <li
            key={i}
            className={`bg-white dark:bg-card border border-border rounded-xl p-3 shadow-sm flex items-start gap-3 transition-all ${
              checked[i] ? 'opacity-60' : ''
            }`}
          >
            <div className="w-7 h-7 bg-primary-light dark:bg-indigo-950/50 text-primary dark:text-indigo-300 rounded-lg flex items-center justify-center font-extrabold text-[12px] font-heading flex-shrink-0">
              {i + 1}
            </div>
            <div className="flex-1">
              <p className={`text-[13px] font-medium leading-relaxed ${checked[i] ? 'line-through text-muted' : ''}`}>
                {topic}
              </p>
            </div>
            <label className="flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => toggle(i)}
                className="w-4 h-4 accent-success cursor-pointer"
              />
            </label>
          </li>
        ))}
      </ol>

      <div className="mt-6 bg-white dark:bg-card border border-border rounded-xl p-5 shadow-sm">
        <h2 className="font-heading text-[15px] font-extrabold mb-3">📚 Nguồn tài liệu chính thống</h2>
        <p className="text-[12px] text-muted mb-4 leading-relaxed">
          Tất cả văn bản pháp luật đều được cập nhật realtime từ các nguồn chính thống của Nhà nước:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a
            href="https://thuvienphapluat.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface dark:bg-[#252840] border border-border rounded-lg p-4 text-center hover:shadow-md transition-all no-underline text-ink"
          >
            <div className="text-xl mb-2">📖</div>
            <p className="text-[13px] font-bold font-heading">Thư viện Pháp luật</p>
            <p className="text-[12px] text-muted mt-1">thuvienphapluat.vn</p>
          </a>
          <a
            href="https://xaydungchinhsach.chinhphu.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface dark:bg-[#252840] border border-border rounded-lg p-4 text-center hover:shadow-md transition-all no-underline text-ink"
          >
            <div className="text-xl mb-2">🏛️</div>
            <p className="text-[13px] font-bold font-heading">Cổng TTĐT Chính phủ</p>
            <p className="text-[12px] text-muted mt-1">chinhphu.vn</p>
          </a>
          <a
            href="https://luatvietnam.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface dark:bg-[#252840] border border-border rounded-lg p-4 text-center hover:shadow-md transition-all no-underline text-ink"
          >
            <div className="text-xl mb-2">⚖️</div>
            <p className="text-[13px] font-bold font-heading">LuatVietnam</p>
            <p className="text-[12px] text-muted mt-1">luatvietnam.vn</p>
          </a>
        </div>
      </div>
    </div>
  )
}
