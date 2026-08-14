import { roadmap } from '../data/documents'

export default function Roadmap() {
  return (
    <div>
      <h1 className="font-heading text-[16px] font-extrabold flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-full bg-primary"></span>
        🗓️ Lộ trình 9 tuần & chiến lược làm bài
      </h1>
      <p className="text-[13px] text-muted mb-6">
        Mốc hôm nay đến hạn nộp hồ sơ 07/9/2026 và thi Vòng 1 dự kiến tháng 10/2026 — bám theo lộ trình này để không bị dồn lực.
      </p>

      <div className="space-y-3 mb-6">
        {roadmap.map((item, i) => (
          <div key={i} className="bg-white dark:bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-primary text-white rounded-lg flex items-center justify-center font-extrabold text-[13px] font-heading">
                {i + 1}
              </div>
              <div>
                <h3 className="font-heading font-bold text-[14px]">{item.week}</h3>
                <p className="text-[12px] text-muted">{item.title}</p>
              </div>
            </div>
            <ul className="pl-4 space-y-1.5">
              {item.tasks.map((task, ti) => (
                <li key={ti} className="text-[13px] text-ink/80 dark:text-ink/90 flex items-start gap-2 leading-relaxed">
                  <span className="text-success mt-0.5">●</span>
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Strategy Cards */}
      <div className="bg-white dark:bg-card border border-border rounded-xl p-5 shadow-sm">
        <h2 className="font-heading text-[15px] font-extrabold mb-4">🎯 Chiến lược chi tiết</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-lg p-3">
            <h4 className="font-heading font-bold text-[13px] text-primary-dark dark:text-indigo-300 mb-2">✍️ Bài viết Vòng 2 (70%)</h4>
            <p className="text-[12px] text-muted leading-relaxed">
              Dàn ý 4 bước: <b>căn cứ pháp lý → quy định cụ thể → vận dụng tình huống → kiến nghị</b>.
            </p>
            <p className="text-[12px] text-muted mt-1.5 leading-relaxed">
              Luôn dẫn số hiệu + năm văn bản (ví dụ: "khoản 3 Điều 4 NĐ 60/2021/NĐ-CP, sửa đổi bởi NĐ 111/2025/NĐ-CP").
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-lg p-3">
            <h4 className="font-heading font-bold text-[13px] text-amber-800 dark:text-amber-300 mb-2">🎤 Phỏng vấn (30%)</h4>
            <p className="text-[12px] text-muted">3 câu tủ cần chuẩn bị:</p>
            <ol className="text-[12px] text-muted mt-1 pl-4 list-decimal space-y-0.5 leading-relaxed">
              <li>Nhiệm vụ kế toán viên (TT 66/2024)</li>
              <li>Đơn vị sự nghiệp nhóm mấy & nguồn tài chính (NĐ 60/2021)</li>
              <li>Quy trình xử lý chứng từ – lập BCTC tại đơn vị (TT 24/2024)</li>
            </ol>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-lg p-3">
            <h4 className="font-heading font-bold text-[13px] text-emerald-800 dark:text-emerald-300 mb-2">🧠 Mẹo trắc nghiệm Vòng 1</h4>
            <ul className="text-[12px] text-muted pl-4 list-disc space-y-0.5 leading-relaxed">
              <li>Thuộc con số: 34 tỉnh/TP = 28+6; TP.HCM 168 đơn vị = 113+54+1</li>
              <li>Kinh tế số 30% GDP 2030; 50% GDP 2045</li>
              <li>Học thuộc Điều 1 Luật Viên chức 129/2025</li>
              <li>Mỗi tối 20–30 câu luyện đề</li>
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-lg p-3">
            <h4 className="font-heading font-bold text-[13px] text-red-800 dark:text-red-300 mb-2">⚠️ Lưu ý quan trọng</h4>
            <ul className="text-[12px] text-muted pl-4 list-disc space-y-0.5 leading-relaxed">
              <li>Hạn hồ sơ: 23:59 ngày 07/9/2026</li>
              <li>Email nộp: ttcudvc.catlai@tphcm.gov.vn</li>
              <li>Dùng Mẫu 01 theo NĐ 259/2026/NĐ-CP</li>
              <li>Phí dự thi: 300–500 nghìn đồng</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Timeline Visual */}
      <div className="mt-6 bg-white dark:bg-card border border-border rounded-xl p-5 shadow-sm">
        <h2 className="font-heading text-[15px] font-extrabold mb-4">📅 Timeline tổng quan</h2>
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
                <span className="text-white text-[12px] font-bold font-heading">{i + 1}</span>
              </div>
              <div>
                <p className="text-[12px] font-bold text-muted">{item.date}</p>
                <p className="text-[13px] font-semibold">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
