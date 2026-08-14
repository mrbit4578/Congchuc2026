import { Link } from 'react-router-dom'
import { examInfo, v1Documents, v2Documents } from '../data/documents'

export default function Home({ progress }) {
  const totalDocs = v1Documents.length + v2Documents.reduce((acc, c) => acc + c.docs.length, 0)
  const doneCount = Object.keys(progress).length
  const percent = totalDocs > 0 ? Math.round((doneCount / totalDocs) * 100) : 0

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-dark via-indigo-900 to-primary text-white rounded-2xl p-6 md:p-8 mb-6 -mt-2">
        <h1 className="font-heading text-[16px] md:text-[18px] font-extrabold leading-tight">
          {examInfo.title}
        </h1>
        <p className="mt-3 opacity-85 text-[13px]">{examInfo.unit}</p>
        <p className="mt-1 opacity-70 text-[12px]">{examInfo.basis}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {[examInfo.position, examInfo.round1, examInfo.round2, `Hạn hồ sơ: ${examInfo.deadline}`].map((badge, i) => (
            <span key={i} className="bg-white/15 border border-white/25 px-3 py-1 rounded-full text-[12px]">
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-card border border-border rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex justify-between text-[13px] font-semibold mb-2">
          <span>📈 Tiến độ ôn tập</span>
          <span>{doneCount} / {totalDocs} tài liệu</span>
        </div>
        <div className="h-2.5 bg-gray-100 dark:bg-[#252840] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-success rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-[12px] text-muted mt-2">Tick "Đã học xong" trên từng tài liệu để theo dõi tiến độ.</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <InfoCard icon="🏛️" title="Đơn vị tuyển" desc={`${examInfo.unit}. 07 chỉ tiêu / 06 vị trí; Kế toán: 01 chỉ tiêu.`} />
        <InfoCard icon="📝" title="Vòng 1" desc={`Trắc nghiệm 60 câu / 60 phút, đúng ≥50% mới vào Vòng 2. Địa điểm: ${examInfo.address}.`} />
        <InfoCard icon="✍️" title="Vòng 2" desc="Thi viết 180 phút (70%) + phỏng vấn ≤30 phút (30%). Mỗi phần phải đạt ≥50/100 điểm." />
        <InfoCard icon="📮" title="Hồ sơ dự tuyển" desc={`Mẫu 01 — NĐ 259/2026/NĐ-CP. Nhận 08/8 → 23:59 ngày 07/9/2026 qua email ${examInfo.email}.`} />
        <InfoCard icon="💰" title="Lệ phí" desc={`Phí dự thi: ${examInfo.fee}.`} />
        <InfoCard icon="📞" title="Liên hệ" desc={examInfo.contacts.map(c => `${c.name} — ${c.phone}`).join('\n')} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <Link to="/vong-1" className="bg-white dark:bg-card border border-border rounded-xl p-4 no-underline text-ink hover:shadow-lg hover:-translate-y-0.5 transition-all block">
          <div className="text-xl mb-2">🟢</div>
          <h3 className="font-heading font-bold text-[14px]">Vòng 1 — Kiến thức chung</h3>
          <p className="text-[12px] text-muted mt-1">10 văn bản pháp luật quan trọng nhất</p>
        </Link>
        <Link to="/vong-2" className="bg-white dark:bg-card border border-border rounded-xl p-4 no-underline text-ink hover:shadow-lg hover:-translate-y-0.5 transition-all block">
          <div className="text-xl mb-2">🧮</div>
          <h3 className="font-heading font-bold text-[14px]">Vòng 2 — Chuyên ngành Kế toán</h3>
          <p className="text-[12px] text-muted mt-1">11 văn bản chuyên ngành theo 5 cụm</p>
        </Link>
        <Link to="/quiz" className="bg-white dark:bg-card border border-border rounded-xl p-4 no-underline text-ink hover:shadow-lg hover:-translate-y-0.5 transition-all block">
          <div className="text-xl mb-2">📝</div>
          <h3 className="font-heading font-bold text-[14px]">Kiểm tra kiến thức</h3>
          <p className="text-[12px] text-muted mt-1">60 câu trắc nghiệm — tự đánh giá</p>
        </Link>
      </div>

      {/* Exam Strategy */}
      <div className="bg-white dark:bg-card border border-border rounded-xl p-5 shadow-sm">
        <h2 className="font-heading text-[15px] font-extrabold mb-4">💡 Chiến lược làm bài</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-lg p-3">
            <h4 className="font-heading font-bold text-[13px] text-primary-dark dark:text-indigo-300">✍️ Bài viết Vòng 2 (70%)</h4>
            <p className="text-[12px] text-muted mt-2">
              Dàn ý 4 bước: <b>căn cứ pháp lý → quy định cụ thể → vận dụng tình huống → kiến nghị</b>. Luôn dẫn số hiệu + năm văn bản.
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-lg p-3">
            <h4 className="font-heading font-bold text-[13px] text-amber-800 dark:text-amber-300">🎤 Phỏng vấn (30%)</h4>
            <p className="text-[12px] text-muted mt-2">
              3 câu tủ: nhiệm vụ kế toán viên (TT 66/2024); đơn vị sự nghiệp nhóm mấy (NĐ 60/2021); quy trình xử lý chứng từ – lập BCTC (TT 24/2024).
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-lg p-3">
            <h4 className="font-heading font-bold text-[13px] text-emerald-800 dark:text-emerald-300">🧠 Mẹo trắc nghiệm V1</h4>
            <p className="text-[12px] text-muted mt-2">
              Thuộc con số (34 tỉnh/TP; 168 đơn vị cấp xã; kinh tế số 30% GDP 2030…); học thuộc Điều 1 Luật VC 129/2025; mỗi tối 20–30 câu luyện đề.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon, title, desc }) {
  return (
    <div className="bg-white dark:bg-card border border-border rounded-xl p-3 shadow-sm">
      <div className="text-lg">{icon}</div>
      <h3 className="font-heading font-bold text-[13px] mt-1.5">{title}</h3>
      <p className="text-[12px] text-muted mt-1 whitespace-pre-line leading-relaxed">{desc}</p>
    </div>
  )
}
