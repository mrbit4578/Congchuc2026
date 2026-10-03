import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { v2Documents } from '../data/documents'
import { guides } from '../data/guides'
import { hcsnMeta, hcsnClusters, hcsnSources, hcsnTopics, hcsnAccounts, hcsnSubaccounts, hcsnTemporalRules, hcsnVersionLinks } from '../data/vong2hcsn'
import { hcsnCases, hcsnEssays } from '../data/vong2cases'
import AutoDownloadButton from '../components/AutoDownloadButton'

const priorityLabels = { hot: '🔥 Rất cao', cao: 'Cao', vua: 'Vừa' }
const priorityStyles = {
  hot: 'bg-danger-light text-danger',
  cao: 'bg-warning-light text-warning',
  vua: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
}

const tabs = [
  { id: 'docs', label: '📚 Văn bản & kiến thức' },
  { id: 'topics', label: '🗂 18 chủ đề' },
  { id: 'accounts', label: '🔍 Tra cứu tài khoản' },
  { id: 'practice', label: '✍️ Luyện tập' },
  { id: 'sources', label: '📑 Nguồn & mốc hiệu lực' },
]

const clusterOrder = ['A', 'B', 'C', 'D', 'E']

function formatVnd(n) {
  return Number(n).toLocaleString('vi-VN')
}

function DocCard({ doc, progress, toggleDone, expanded, toggleExpand }) {
  return (
    <div
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

      <div className="flex flex-wrap gap-2 items-center mt-3">
        {doc.links.map((link, i) => (
          <div key={i} className="flex items-center gap-1.5 flex-wrap">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary bg-primary-light dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-lg hover:bg-primary hover:text-white transition-colors no-underline"
            >
              📄 {link.label} ↗
            </a>
            {link.url.includes('thuvienphapluat.vn') && (
              <AutoDownloadButton url={link.url} docTitle={doc.title} />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => toggleExpand(doc.id)}
        className="mt-3 text-[12px] font-bold text-primary cursor-pointer hover:text-primary-dark dark:hover:text-indigo-300 bg-transparent border-none"
      >
        {expanded[doc.id] ? '▾ Ẩn nội dung' : '▸ Xem nội dung chi tiết'}
      </button>

      {expanded[doc.id] && guides[doc.id] && (
        <div className="mt-3 pt-3 border-t border-dashed border-border text-[12px]">
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-lg p-3 mb-3">
            <h4 className="font-heading text-[12px] font-bold text-primary-dark dark:text-indigo-300 mb-2">📋 Thông tin văn bản</h4>
            <div className="grid grid-cols-1 gap-1">
              {Object.entries(guides[doc.id].info).map(([key, val]) => {
                const labels = { soHieu: 'Số hiệu', loai: 'Loại', ngayBanHanh: 'Ngày ban hành', ngayHieuLuc: 'Ngày hiệu lực', coQuan: 'Cơ quan', thayThe: 'Thay thế', cauTruc: 'Cấu trúc', apDung: 'Áp dụng', suaDoi: 'Sửa đổi', huongDan: 'Hướng dẫn', ghiChu: 'Ghi chú', noiDung: 'Nội dung', hopNhat: 'Hợp nhất' }
                return (
                  <div key={key} className="flex gap-2">
                    <span className="font-semibold text-ink/70 dark:text-ink/60 min-w-[100px]">{labels[key] || key}:</span>
                    <span className="text-ink/90 dark:text-ink/80">{val}</span>
                  </div>
                )
              })}
            </div>
          </div>

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
  )
}

function TopicsTab() {
  const topicsByCluster = useMemo(() => {
    const m = {}
    for (const t of hcsnTopics) {
      if (!m[t.cluster]) m[t.cluster] = []
      m[t.cluster].push(t)
    }
    return m
  }, [])
  return (
    <div>
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-5 text-[12px] text-amber-900 dark:text-amber-200">
        18 chủ đề thuộc 5 cụm (bộ biên soạn {hcsnMeta.reviewedOn}). Mỗi chủ đề ghi rõ mục tiêu học và vị trí pháp lý — mở rộng chi tiết trong tab <b>Văn bản & kiến thức</b>.
      </div>
      {clusterOrder.map(c => (
        <div key={c} className="mb-6">
          <h2 className="font-heading text-[14px] font-extrabold text-primary-dark dark:text-indigo-300 mb-1">{hcsnClusters[c].name}</h2>
          <p className="text-[12px] text-muted mb-3">{hcsnClusters[c].desc}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topicsByCluster[c]?.map(t => (
              <div key={t.id} className="bg-white dark:bg-card border border-border rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-light dark:bg-indigo-950/50 text-primary">{t.id}</span>
                  <span className="text-[11px] text-muted">{t.source_id}</span>
                </div>
                <h3 className="font-heading font-bold text-[13px]">{t.title}</h3>
                <p className="text-[12px] text-ink/80 dark:text-ink/90 mt-1 leading-relaxed">🎯 {t.learning_outcome}</p>
                <p className="text-[11px] text-muted mt-1">📍 {t.locator}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function AccountsTab() {
  const [query, setQuery] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [showSub, setShowSub] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return hcsnAccounts.filter(a => {
      if (classFilter !== 'all') {
        if (classFilter === 'off') { if (!a.off_balance) return false }
        else if (a.account_class !== classFilter) return false
      }
      if (!q) return true
      return a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
    })
  }, [query, classFilter])

  const classOptions = [
    { v: 'all', l: 'Tất cả' },
    ...['1','2','3','4','5','6','7','8','9'].map(n => ({ v: n, l: `Loại ${n}` })),
    { v: 'off', l: 'Ngoài bảng' },
  ]

  return (
    <div>
      <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl px-4 py-3 mb-4 text-[12px] text-ink/80 dark:text-ink/90">
        Tra cứu 80 tài khoản cấp 1 và 52 tài khoản chi tiết chọn lọc theo TT 24/2024 (Phụ lục I). Mã tài khoản được giữ dạng chuỗi để bảo toàn số 0 đầu (ví dụ <b>008</b>, <b>008212</b>). 52 mã chi tiết <b>không phải</b> toàn bộ hệ thống cấp 2/3.
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Tìm theo mã (vd: 008212) hoặc tên tài khoản…"
          className="flex-1 px-3 py-2 border border-border rounded-lg text-[13px] bg-white dark:bg-card text-ink"
        />
        <select
          value={classFilter}
          onChange={e => setClassFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg text-[13px] bg-white dark:bg-card text-ink"
        >
          {classOptions.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
        <label className="flex items-center gap-2 text-[12px] font-semibold text-muted cursor-pointer whitespace-nowrap">
          <input type="checkbox" checked={showSub} onChange={e => setShowSub(e.target.checked)} className="w-4 h-4 accent-primary cursor-pointer" />
          Hiện 52 TK chi tiết
        </label>
      </div>

      <div className="text-[12px] text-muted mb-2">{filtered.length} tài khoản cấp 1 {query && <>khớp “{query}”</>}</div>

      <div className="bg-white dark:bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-surface dark:bg-[#252840] text-left">
                <th className="px-3 py-2 font-bold whitespace-nowrap">Mã</th>
                <th className="px-3 py-2 font-bold">Tên tài khoản</th>
                <th className="px-3 py-2 font-bold whitespace-nowrap">Loại</th>
                <th className="px-3 py-2 font-bold">Phạm vi áp dụng</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.code} className="border-t border-border hover:bg-surface/60 dark:hover:bg-[#252840]/60">
                  <td className="px-3 py-2 font-mono font-bold text-primary whitespace-nowrap">{a.code}</td>
                  <td className="px-3 py-2">
                    {a.name}
                    {a.off_balance && <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">ngoài bảng</span>}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{a.off_balance ? '—' : a.account_class}</td>
                  <td className="px-3 py-2 text-muted">{a.applicability} <span className="text-[11px]">[{a.source_id} — {a.locator}]</span></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-6 text-center text-muted">Không tìm thấy tài khoản nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showSub && (
        <div className="mt-5">
          <h3 className="font-heading font-bold text-[13px] mb-2">52 tài khoản chi tiết chọn lọc (không phải toàn bộ cấp 2/3)</h3>
          <div className="bg-white dark:bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="bg-surface dark:bg-[#252840] text-left">
                    <th className="px-3 py-2 font-bold whitespace-nowrap">Mã</th>
                    <th className="px-3 py-2 font-bold">Tên</th>
                    <th className="px-3 py-2 font-bold">Vị trí pháp lý</th>
                  </tr>
                </thead>
                <tbody>
                  {hcsnSubaccounts.map(a => (
                    <tr key={a.code} className="border-t border-border hover:bg-surface/60 dark:hover:bg-[#252840]/60">
                      <td className="px-3 py-2 font-mono font-bold text-primary whitespace-nowrap">{a.code}</td>
                      <td className="px-3 py-2">{a.name}</td>
                      <td className="px-3 py-2 text-muted">{a.source_id} — {a.locator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CaseEntries({ entries }) {
  return (
    <div className="space-y-3 mt-2">
      {entries.map((e, i) => (
        <div key={i} className="bg-surface dark:bg-[#252840] rounded-lg p-3">
          <div className="text-[12px] font-bold mb-2">Bước {i + 1}: {e.label}</div>
          {e.debits?.length > 0 && (
            <div className="text-[12px] mb-1">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Nợ:</span>{' '}
              {e.debits.map((d, j) => <span key={j} className="font-mono">{d.account} {formatVnd(d.amount_vnd)}đ{j < e.debits.length - 1 ? ' · ' : ''}</span>)}
            </div>
          )}
          {e.credits?.length > 0 && (
            <div className="text-[12px] mb-1">
              <span className="font-semibold text-red-600 dark:text-red-400">Có:</span>{' '}
              {e.credits.map((c, j) => <span key={j} className="font-mono">{c.account} {formatVnd(c.amount_vnd)}đ{j < e.credits.length - 1 ? ' · ' : ''}</span>)}
            </div>
          )}
          {e.off_balance?.length > 0 && (
            <div className="text-[12px]">
              <span className="font-semibold text-amber-600 dark:text-amber-400">Ngoài bảng:</span>{' '}
              {e.off_balance.map((o, j) => <span key={j} className="font-mono">{o.account} ({o.side === 'debit' ? 'Nợ' : 'Có'}) {formatVnd(o.amount_vnd)}đ{j < e.off_balance.length - 1 ? ' · ' : ''}</span>)}
            </div>
          )}
          {e.debits?.length === 0 && e.credits?.length === 0 && e.off_balance?.length === 0 && (
            <div className="text-[12px] text-muted">Không phát sinh bút toán trong bảng ở bước này.</div>
          )}
        </div>
      ))}
    </div>
  )
}

function PracticeTab() {
  const [openCase, setOpenCase] = useState({})
  const [openEssay, setOpenEssay] = useState({})
  return (
    <div>
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-5 text-[12px] text-amber-900 dark:text-amber-200">
        Bài tập <b>tự biên soạn</b> — không phải đề thi thật, không dự đoán đề. Số tiền, tỷ lệ trong bài là <b>giả định có ghi điều kiện</b>, không thay quy định thuế, bảo hiểm, lương, khấu hao thực tế.
      </div>

      <div className="bg-white dark:bg-card border border-border rounded-xl p-4 shadow-sm mb-6">
        <h3 className="font-heading font-bold text-[13px] mb-1">📝 40 câu trắc nghiệm tự biên soạn</h3>
        <p className="text-[12px] text-muted mb-3">Đã nạp vào trang Kiểm tra kiến thức — chọn chủ đề “Vòng 2 — Chuyên ngành Kế toán”, có chấm điểm và giải thích kèm nguồn.</p>
        <Link to="/quiz" className="inline-flex items-center gap-1 text-[12px] font-bold text-white bg-primary px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors no-underline">
          🎲 Luyện trắc nghiệm ngay →
        </Link>
      </div>

      <h3 className="font-heading font-bold text-[14px] mb-3">📒 12 bài tập định khoản có điều kiện</h3>
      <div className="space-y-3 mb-8">
        {hcsnCases.map(c => (
          <div key={c.id} className="bg-white dark:bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-light dark:bg-indigo-950/50 text-primary">{c.id}</span>
              <span className="text-[11px] text-muted">{c.source_id} — {c.locator}</span>
            </div>
            <h4 className="font-heading font-bold text-[13px]">{c.title}</h4>
            <div className="text-[12px] text-muted mt-1">
              <b>Giả định:</b> {c.assumptions.join(' ')}
            </div>
            <div className="text-[12px] mt-1"><b>Đề bài:</b> {c.prompt}</div>
            <button
              onClick={() => setOpenCase(p => ({ ...p, [c.id]: !p[c.id] }))}
              className="mt-2 text-[12px] font-bold text-primary cursor-pointer hover:text-primary-dark bg-transparent border-none"
            >
              {openCase[c.id] ? '▾ Ẩn lời giải' : '▸ Xem lời giải (bút toán từng bước)'}
            </button>
            {openCase[c.id] && (
              <div>
                <CaseEntries entries={c.entries} />
                <div className="mt-2 text-[12px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2">
                  <b>Kết quả:</b> {c.result}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="font-heading font-bold text-[14px] mb-3">🖊️ 8 đề tự luận / tình huống</h3>
      <div className="space-y-3">
        {hcsnEssays.map(e => (
          <div key={e.id} className="bg-white dark:bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-warning-light text-warning">{e.id}</span>
              <span className="text-[11px] text-muted">{e.source_id} — {e.locator}</span>
            </div>
            <h4 className="font-heading font-bold text-[13px]">{e.title}</h4>
            <div className="text-[12px] mt-1"><b>Đề:</b> {e.prompt}</div>
            <button
              onClick={() => setOpenEssay(p => ({ ...p, [e.id]: !p[e.id] }))}
              className="mt-2 text-[12px] font-bold text-primary cursor-pointer hover:text-primary-dark bg-transparent border-none"
            >
              {openEssay[e.id] ? '▾ Ẩn dàn ý & khung điểm' : '▸ Xem dàn ý trả lời & khung điểm đề xuất'}
            </button>
            {openEssay[e.id] && (
              <div className="mt-2">
                <ul className="pl-4 space-y-1 list-disc">
                  {e.answer.map((a, i) => <li key={i} className="text-[12px] text-ink/80 dark:text-ink/90 leading-relaxed">{a}</li>)}
                </ul>
                <div className="mt-2 text-[12px] text-muted">
                  <b>Khung điểm đề xuất (tự kiểm):</b>{' '}
                  {Object.entries(e.rubric_proposed).map(([k, v], i) => (
                    <span key={k}>{i > 0 && ' · '}{k}: {v}đ</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function SourcesTab() {
  return (
    <div>
      <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl px-4 py-3 mb-4 text-[12px] text-ink/80 dark:text-ink/90">
        14 văn bản nguồn chính thức (mốc nghiên cứu {hcsnMeta.reviewedOn}). Luôn đối chiếu văn bản gốc trên Cổng Chính phủ/Công báo trước kỳ thi.
      </div>

      <h3 className="font-heading font-bold text-[13px] mb-2">Danh mục văn bản</h3>
      <div className="space-y-2 mb-6">
        {hcsnSources.map(s => (
          <div key={s.id} className="bg-white dark:bg-card border border-border rounded-xl p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-light dark:bg-indigo-950/50 text-primary">{s.id}</span>
              <span className="font-bold text-[13px]">{s.title}</span>
            </div>
            <div className="text-[12px] text-muted mt-1">
              {s.issuedOn && <>Ban hành: {s.issuedOn} · </>}
              Hiệu lực: <b>{s.effectiveOn || 'theo văn bản gốc / năm ngân sách'}</b>
              {s.url && <> · <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold">Văn bản chính thức ↗</a></>}
            </div>
            {s.note && <div className="text-[12px] text-ink/70 dark:text-ink/80 mt-1">{s.note}</div>}
          </div>
        ))}
      </div>

      <h3 className="font-heading font-bold text-[13px] mb-2">Quan hệ sửa đổi / thay thế giữa các văn bản</h3>
      <div className="bg-white dark:bg-card border border-border rounded-xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-surface dark:bg-[#252840] text-left">
                <th className="px-3 py-2 font-bold">Văn bản sửa</th>
                <th className="px-3 py-2 font-bold">Văn bản bị sửa</th>
                <th className="px-3 py-2 font-bold">Quan hệ</th>
                <th className="px-3 py-2 font-bold">Vị trí</th>
                <th className="px-3 py-2 font-bold">Hiệu lực</th>
              </tr>
            </thead>
            <tbody>
              {hcsnVersionLinks.map((v, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-2 font-mono font-bold">{v.source_id}</td>
                  <td className="px-3 py-2 font-mono">{v.target_source_id || v.target_external_document}</td>
                  <td className="px-3 py-2">{v.relation === 'amends' ? 'Sửa đổi' : v.relation === 'replaces' ? 'Thay thế' : v.relation}</td>
                  <td className="px-3 py-2">{v.locator}</td>
                  <td className="px-3 py-2">{v.effective_on}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h3 className="font-heading font-bold text-[13px] mb-2">Mốc thời gian áp dụng theo năm ngân sách</h3>
      <div className="space-y-2 mb-6">
        {hcsnTemporalRules.map((t, i) => (
          <div key={i} className="bg-white dark:bg-card border border-border rounded-xl p-3 text-[12px]">
            <span className="font-mono font-bold text-primary">{t.source_id}</span>
            <span className="ml-2">áp dụng từ <b>năm ngân sách {t.fiscal_year_from}</b> ({t.locator})</span>
            {t.exception_note && <div className="text-muted mt-1">⚠️ {t.exception_note}</div>}
          </div>
        ))}
      </div>

      <h3 className="font-heading font-bold text-[13px] mb-2">Giới hạn & nội dung chưa xác minh</h3>
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3 text-[12px] text-red-800 dark:text-red-300">
        <ul className="pl-4 space-y-1 list-disc">
          {hcsnMeta.limitations.map((l, i) => <li key={i}>{l}</li>)}
          <li>Chưa có thông báo tuyển dụng chính thức — hình thức, thời lượng, tỷ trọng từng văn bản giữ trạng thái <b>chưa xác minh</b>.</li>
          <li>Chưa có quyết định tự chủ của đơn vị cụ thể — không suy nhóm tự chủ từ tên đơn vị.</li>
        </ul>
      </div>
    </div>
  )
}

export default function StudyV2({ progress, toggleDone }) {
  const [tab, setTab] = useState('docs')
  const [expanded, setExpanded] = useState({})
  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div>
      <h1 className="font-heading text-[16px] font-extrabold flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-full bg-warning"></span>
        🧮 Vòng 2 — {v2Documents.length} văn bản chuyên ngành Kế toán
      </h1>
      <p className="text-[13px] text-muted mb-4">
        Cụm A (chế độ kế toán HCSN) là <b>cốt lõi</b> — kiến thức trọng tâm của vòng 2. Đã cập nhật theo mốc nghiên cứu <b>{hcsnMeta.reviewedOn}</b> (TT 46, TT 108, 2 văn bản hợp nhất).
      </p>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-3">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors ${
              tab === t.id
                ? 'bg-primary text-white'
                : 'bg-surface dark:bg-[#252840] text-muted hover:bg-primary-light dark:hover:bg-indigo-950/50 hover:text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'docs' && (
        <div>
          {v2Documents.map((cum, ci) => (
            <div key={ci} className="mb-6">
              <h2 className="font-heading text-[14px] font-extrabold text-primary-dark dark:text-indigo-300 flex items-center gap-2 mb-4">
                <span className="flex-1 h-px bg-border"></span>
                <span>{cum.cum}</span>
                <span className="flex-1 h-px bg-border"></span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {cum.docs.map(doc => (
                  <DocCard key={doc.id} doc={doc} progress={progress} toggleDone={toggleDone} expanded={expanded} toggleExpand={toggleExpand} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'topics' && <TopicsTab />}
      {tab === 'accounts' && <AccountsTab />}
      {tab === 'practice' && <PracticeTab />}
      {tab === 'sources' && <SourcesTab />}
    </div>
  )
}
