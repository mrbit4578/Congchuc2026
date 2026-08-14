import { Link } from 'react-router-dom'
import { examInfo, v1Documents, v2Documents } from '../data/documents'

export default function Home({ progress }) {
  const totalDocs = v1Documents.length + v2Documents.reduce((acc, c) => acc + c.docs.length, 0)
  const doneCount = Object.keys(progress).length
  const percent = totalDocs > 0 ? Math.round((doneCount / totalDocs) * 100) : 0

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-dark via-indigo-900 to-primary text-white rounded-2xl p-8 mb-8 -mt-2">
        <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">
          {examInfo.title}
        </h1>
        <p className="mt-3 opacity-85 text-sm">{examInfo.unit}</p>
        <p className="mt-1 opacity-70 text-xs">{examInfo.basis}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {[examInfo.position, examInfo.round1, examInfo.round2, `Hạn hồ sơ: ${examInfo.deadline}`].map((badge, i) => (
            <span key={i} className="bg-white/15 border border-white/25 px-3 py-1 rounded-full text-xs">
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border border-border rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex justify-between text-sm font-semibold mb-2">
          <span>📈 Tiến độ ôn tập</span>
          <span>{doneCount} / {totalDocs} tài liệu</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-success rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-muted mt-2">Tick "Đã học xong" trên từng tài liệu để theo dõi tiến độ.</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <InfoCard icon="🏛️" title="Đơn vị tuyển" desc={`${examInfo.unit}. 07 chỉ tiêu / 06 vị trí; Kế toán: 01 chỉ tiêu.`} />
        <InfoCard icon="📝" title="Vòng 1" desc={`Trắc nghiệm 60 câu / 60 phút, đúng ≥50% mới vào Vòng 2. Địa điểm: ${examInfo.address}.`} />
        <InfoCard icon="✍️" title="Vòng 2" desc="Thi viết 180 phút (70%) + phỏng vấn ≤30 phút (30%). Mỗi phần phải đạt ≥50/100 điểm." />
        <InfoCard icon="📮" title="Hồ sơ dự tuyển" desc={`Mẫu 01 — NĐ 259/2026/NĐ-CP. Nhận 08/8 → 23:59 ngày 07/9/2026 qua email ${examInfo.email}.`} />
        <InfoCard icon="💰" title="Lệ phí" desc={`Phí dự thi: ${examInfo.fee}.`} />
        <InfoCard icon="📞" title="Liên hệ" desc={examInfo.contacts.map(c => `${c.name} — ${c.phone}`).join('\n')} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/vong-1" className="bg-white border border-border rounded-xl p-5 no-underline text-ink hover:shadow-lg hover:-translate-y-0.5 transition-all block">
          <div className="text-2xl mb-2">🟢</div>
          <h3 className="font-bold text-base">Vòng 1 — Kiến thức chung</h3>
          <p className="text-sm text-muted mt-1">10 văn bản pháp luật quan trọng nhất</p>
        </Link>
        <Link to="/vong-2" className="bg-white border border-border rounded-xl p-5 no-underline text-ink hover:shadow-lg hover:-translate-y-0.5 transition-all block">
          <div className="text-2xl mb-2">🧮</div>
          <h3 className="font-bold text-base">Vòng 2 — Chuyên ngành Kế toán</h3>
          <p className="text-sm text-muted mt-1">11 văn bản chuyên ngành theo 5 cụm</p>
        </Link>
        <Link to="/quiz" className="bg-white border border-border rounded-xl p-5 no-underline text-ink hover:shadow-lg hover:-translate-y-0.5 transition-all block">
          <div className="text-2xl mb-2">📝</div>
          <h3 className="font-bold text-base">Kiểm tra kiến thức</h3>
          <p className="text-sm text-muted mt-1">60 câu trắc nghiệm — tự đánh giá</p>
        </Link>
      </div>

      {/* Exam Strategy */}
      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-extrabold mb-4">💡 Chiến lược làm bài</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <h4 className="font-bold text-sm text-primary-dark">✍️ Bài viết Vòng 2 (70%)</h4>
            <p className="text-xs text-muted mt-2">
              Dàn ý 4 bước: <b>căn cứ pháp lý → quy định cụ thể → vận dụng tình huống → kiến nghị</b>. Luôn dẫn số hiệu + năm văn bản.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <h4 className="font-bold text-sm text-amber-800">🎤 Phỏng vấn (30%)</h4>
            <p className="text-xs text-muted mt-2">
              3 câu tủ: nhiệm vụ kế toán viên (TT 66/2024); đơn vị sự nghiệp nhóm mấy (NĐ 60/2021); quy trình xử lý chứng từ – lập BCTC (TT 24/2024).
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
            <h4 className="font-bold text-sm text-emerald-800">🧠 Mẹo trắc nghiệm V1</h4>
            <p className="text-xs text-muted mt-2">
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
    <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
      <div className="text-xl">{icon}</div>
      <h3 className="font-bold text-sm mt-2">{title}</h3>
      <p className="text-xs text-muted mt-1 whitespace-pre-line">{desc}</p>
    </div>
  )
}
