import { roadmap } from '../data/documents'

export default function Roadmap() {
  return (
    <div>
      <h1 className="text-xl font-extrabold flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-full bg-primary"></span>
        🗓️ Lộ trình 9 tuần & chiến lược làm bài
      </h1>
      <p className="text-sm text-muted mb-6">
        Mốc hôm nay đến hạn nộp hồ sơ 07/9/2026 và thi Vòng 1 dự kiến tháng 10/2026 — bám theo lộ trình này để không bị dồn lực.
      </p>

      <div className="space-y-4 mb-8">
        {roadmap.map((item, i) => (
          <div key={i} className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-extrabold text-sm">
                {i + 1}
              </div>
              <div>
                <h3 className="font-bold text-sm">{item.week}</h3>
                <p className="text-xs text-muted">{item.title}</p>
              </div>
            </div>
            <ul className="pl-4 space-y-2">
              {item.tasks.map((task, ti) => (
                <li key={ti} className="text-sm text-ink/80 flex items-start gap-2">
                  <span className="text-success mt-0.5">●</span>
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Strategy Cards */}
      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-extrabold mb-4">🎯 Chiến lược chi tiết</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <h4 className="font-bold text-sm text-primary-dark mb-2">✍️ Bài viết Vòng 2 (70%)</h4>
            <p className="text-xs text-muted">
              Dàn ý 4 bước: <b>căn cứ pháp lý → quy định cụ thể → vận dụng tình huống → kiến nghị</b>.
            </p>
            <p className="text-xs text-muted mt-2">
              Luôn dẫn số hiệu + năm văn bản (ví dụ: "khoản 3 Điều 4 NĐ 60/2021/NĐ-CP, sửa đổi bởi NĐ 111/2025/NĐ-CP").
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <h4 className="font-bold text-sm text-amber-800 mb-2">🎤 Phỏng vấn (30%)</h4>
            <p className="text-xs text-muted">3 câu tủ cần chuẩn bị:</p>
            <ol className="text-xs text-muted mt-1 pl-4 list-decimal space-y-1">
              <li>Nhiệm vụ kế toán viên (TT 66/2024)</li>
              <li>Đơn vị sự nghiệp nhóm mấy & nguồn tài chính (NĐ 60/2021)</li>
              <li>Quy trình xử lý chứng từ – lập BCTC tại đơn vị (TT 24/2024)</li>
            </ol>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
            <h4 className="font-bold text-sm text-emerald-800 mb-2">🧠 Mẹo trắc nghiệm Vòng 1</h4>
            <ul className="text-xs text-muted pl-4 list-disc space-y-1">
              <li>Thuộc con số: 34 tỉnh/TP = 28+6; TP.HCM 168 đơn vị = 113+54+1</li>
              <li>Kinh tế số 30% GDP 2030; 50% GDP 2045</li>
              <li>Học thuộc Điều 1 Luật Viên chức 129/2025</li>
              <li>Mỗi tối 20–30 câu luyện đề</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <h4 className="font-bold text-sm text-red-800 mb-2">⚠️ Lưu ý quan trọng</h4>
            <ul className="text-xs text-muted pl-4 list-disc space-y-1">
              <li>Hạn hồ sơ: 23:59 ngày 07/9/2026</li>
              <li>Email nộp: ttcudvc.catlai@tphcm.gov.vn</li>
              <li>Dùng Mẫu 01 theo NĐ 259/2026/NĐ-CP</li>
              <li>Phí dự thi: 300–500 nghìn đồng</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Timeline Visual */}
      <div className="mt-8 bg-white border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-extrabold mb-4">📅 Timeline tổng quan</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
          {[
            { date: '08/2026', label: 'Mở nhận hồ sơ', color: 'bg-primary' },
            { date: '07/9/2026', label: 'Hạn nộp hồ sơ (23:59)', color: 'bg-danger' },
            { date: '10/2026', label: 'Thi Vòng 1 (dự kiến)', color: 'bg-warning' },
            { date: '≤10 ngày sau V1', label: 'Thi Vòng 2 (viết + phỏng vấn)', color: 'bg-success' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 mb-4 relative">
              <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center z-10`}>
                <span className="text-white text-xs font-bold">{i + 1}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-muted">{item.date}</p>
                <p className="text-sm font-semibold">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
