export const qaCategories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'vong-1', label: 'Vòng 1' },
  { id: 'vong-2', label: 'Vòng 2' },
  { id: 'ho-so', label: 'Hồ sơ & tuyển dụng' },
  { id: 'ke-toan', label: 'Kế toán' },
  { id: 'meo-thi', label: 'Mẹo thi' },
]

export const qaItems = [
  {
    id: 'qa-1',
    category: 'vong-1',
    categoryLabel: 'Vòng 1',
    question: 'Vòng 1 thi những nội dung gì và cần đạt bao nhiêu điểm?',
    answer:
      'Vòng 1 là phần trắc nghiệm kiến thức chung trên giấy hoặc máy tính, gồm 60 câu trong 60 phút. Theo bộ nội dung ôn tập hiện có, thí sinh cần đạt ít nhất 50% số câu đúng để được tham dự Vòng 2.',
    tip: 'Hãy luyện theo chặng 60 câu/60 phút để quen áp lực thời gian.',
    source: 'v1-2',
    tags: ['60 câu', '60 phút', '50%', 'kiến thức chung'],
  },
  {
    id: 'qa-2',
    category: 'vong-2',
    categoryLabel: 'Vòng 2',
    question: 'Cách tính điểm Vòng 2 như thế nào?',
    answer:
      'Vòng 2 gồm phần viết và phần phỏng vấn hoặc thực hành. Điểm phần viết chiếm 70%, phần phỏng vấn chiếm 30%; tổng điểm được tính theo thang 100. Thí sinh cần đạt từ 50 điểm trở lên theo nội dung ôn tập của trang.',
    tip: 'Đừng chỉ luyện viết: hãy chuẩn bị phần trình bày miệng và các tình huống nghiệp vụ.',
    source: 'v1-2',
    tags: ['70%', '30%', 'phỏng vấn', 'thực hành'],
  },
  {
    id: 'qa-3',
    category: 'ho-so',
    categoryLabel: 'Hồ sơ & tuyển dụng',
    question: 'Điều kiện cơ bản để đăng ký dự tuyển viên chức là gì?',
    answer:
      'Người dự tuyển cần là công dân Việt Nam từ đủ 18 tuổi, có phiếu đăng ký dự tuyển, lý lịch rõ ràng, văn bằng hoặc chứng chỉ phù hợp với vị trí việc làm và đủ sức khỏe để thực hiện công việc. Người đang bị truy cứu trách nhiệm hình sự hoặc thuộc trường hợp bị cấm không được đăng ký.',
    tip: 'Kiểm tra yêu cầu riêng trong thông báo tuyển dụng của đơn vị trước khi nộp hồ sơ.',
    source: 'v1-2',
    tags: ['18 tuổi', 'văn bằng', 'sức khỏe', 'lý lịch'],
  },
  {
    id: 'qa-4',
    category: 'ho-so',
    categoryLabel: 'Hồ sơ & tuyển dụng',
    question: 'Hồ sơ dự tuyển thường gồm những giấy tờ nào?',
    answer:
      'Bộ tài liệu ôn tập liệt kê các giấy tờ cơ bản gồm phiếu đăng ký dự tuyển, sơ yếu lý lịch, bản sao văn bằng và chứng chỉ, giấy khám sức khỏe và ảnh. Khi làm hồ sơ thực tế, hãy ưu tiên danh mục và biểu mẫu trong thông báo tuyển dụng chính thức.',
    tip: 'Lập checklist giấy tờ và kiểm tra thời hạn công chứng trước ngày nộp.',
    source: 'v1-2',
    tags: ['phiếu đăng ký', 'sơ yếu lý lịch', 'văn bằng', 'giấy khám sức khỏe'],
  },
  {
    id: 'qa-5',
    category: 'vong-1',
    categoryLabel: 'Vòng 1',
    question: 'Phân biệt phân quyền, phân cấp và ủy quyền như thế nào?',
    answer:
      'Phân quyền là pháp luật giao trực tiếp nhiệm vụ và quyền hạn cho mỗi cấp. Phân cấp là cấp trên giao cho cấp dưới thực hiện một nhiệm vụ, trong đó cấp trên vẫn chịu trách nhiệm. Ủy quyền là người đứng đầu giao cho cá nhân hoặc cơ quan khác thực hiện công việc thuộc thẩm quyền của mình.',
    tip: 'Mẹo nhớ: pháp luật giao là phân quyền; cấp trên giao cấp dưới là phân cấp; người đứng đầu giao cá nhân là ủy quyền.',
    source: 'v1-3',
    tags: ['phân quyền', 'phân cấp', 'ủy quyền'],
  },
  {
    id: 'qa-6',
    category: 'vong-1',
    categoryLabel: 'Vòng 1',
    question: 'Vị trí việc làm viên chức được hiểu là gì?',
    answer:
      'Vị trí việc làm là công việc hoặc nhiệm vụ gắn với chức danh nghề nghiệp hoặc chức vụ quản lý tương ứng, làm căn cứ xác định biên chế và cơ cấu viên chức. Mỗi vị trí gắn với bản mô tả công việc và khung năng lực yêu cầu.',
    tip: 'Khi ôn một vị trí, hãy đọc cả nhiệm vụ, tiêu chuẩn năng lực và sản phẩm đầu ra.',
    source: 'v1-4',
    tags: ['VTVL', 'chức danh nghề nghiệp', 'khung năng lực'],
  },
  {
    id: 'qa-7',
    category: 'vong-1',
    categoryLabel: 'Vòng 1',
    question: 'Viên chức có những quyền và nghĩa vụ chính nào?',
    answer:
      'Viên chức có quyền được bảo đảm điều kiện làm việc, đào tạo bồi dưỡng, hưởng lương và các chế độ theo vị trí việc làm. Đồng thời, viên chức phải chấp hành chủ trương, pháp luật, thực hiện đúng chức trách và bảo vệ bí mật nhà nước.',
    tip: 'Học theo cặp “quyền được hưởng – nghĩa vụ phải thực hiện” để tránh nhầm khi làm trắc nghiệm.',
    source: 'v1-1',
    tags: ['quyền', 'nghĩa vụ', 'đạo đức nghề nghiệp'],
  },
  {
    id: 'qa-8',
    category: 'vong-1',
    categoryLabel: 'Vòng 1',
    question: 'Các hình thức kỷ luật viên chức gồm những gì?',
    answer:
      'Các hình thức được liệt kê trong bộ nội dung hiện có gồm khiển trách, cảnh cáo, cách chức và buộc thôi việc. Khi học, nên ghi nhớ theo mức độ tăng dần và đối chiếu văn bản áp dụng trong từng kỳ tuyển dụng.',
    tip: 'Tạo thẻ ghi nhớ theo 4 mức để ôn nhanh trước khi làm đề.',
    source: 'v1-1',
    tags: ['khiển trách', 'cảnh cáo', 'cách chức', 'buộc thôi việc'],
  },
  {
    id: 'qa-9',
    category: 'ke-toan',
    categoryLabel: 'Kế toán',
    question: 'Ôn nghiệp vụ kế toán nên bắt đầu từ đâu?',
    answer:
      'Hãy bắt đầu từ đề cương vị trí kế toán, sau đó chia thành ba nhóm: nguyên lý và quy trình kế toán; chế độ chứng từ, sổ sách và báo cáo; tình huống xử lý trong đơn vị sự nghiệp công. Cuối mỗi chủ đề nên làm một bài tự kiểm tra ngắn.',
    tip: 'Ưu tiên hiểu luồng nghiệp vụ từ chứng từ đến báo cáo thay vì học thuộc từng đáp án rời rạc.',
    source: 'v2-1',
    tags: ['đề cương', 'chứng từ', 'sổ sách', 'báo cáo'],
  },
  {
    id: 'qa-10',
    category: 'ke-toan',
    categoryLabel: 'Kế toán',
    question: 'Làm sao để giảm sai sót khi giải bài tập nghiệp vụ?',
    answer:
      'Đọc kỹ yêu cầu, xác định đối tượng kế toán, kiểm tra đơn vị tính và lập bảng dữ kiện trước khi định khoản hoặc tính toán. Sau cùng, đối chiếu số phát sinh, số dư và kết quả với điều kiện của đề.',
    tip: 'Dành 5 phút cuối để kiểm tra dấu, đơn vị và các điều kiện đặc biệt trong đề.',
    source: 'v2-1',
    tags: ['định khoản', 'kiểm tra', 'số dư', 'tính toán'],
  },
  {
    id: 'qa-11',
    category: 'meo-thi',
    categoryLabel: 'Mẹo thi',
    question: 'Nên phân bổ thời gian làm bài trắc nghiệm như thế nào?',
    answer:
      'Với bài 60 câu trong 60 phút, nên dành khoảng 45–50 phút cho lượt làm đầu tiên và phần thời gian còn lại để quay lại câu đánh dấu, kiểm tra đáp án và tô hoặc nhập kết quả. Nếu gặp câu khó, hãy đánh dấu rồi chuyển tiếp thay vì dừng quá lâu.',
    tip: 'Luyện bằng đồng hồ bấm giờ và tạo một quy tắc cố định cho các câu chưa chắc.',
    source: 'v1-2',
    tags: ['quản lý thời gian', 'đánh dấu câu', 'trắc nghiệm'],
  },
  {
    id: 'qa-12',
    category: 'meo-thi',
    categoryLabel: 'Mẹo thi',
    question: 'Có thể lưu câu hỏi để ôn lại sau không?',
    answer:
      'Có. Trong mục Hỏi đáp, bạn có thể nhấn biểu tượng đánh dấu ở mỗi câu để lưu vào danh sách “Đã lưu”. Dữ liệu được lưu trên trình duyệt của thiết bị, vì vậy danh sách này sẽ thuận tiện cho việc ôn lại trên cùng thiết bị.',
    tip: 'Mỗi ngày chọn 5 câu đã lưu để tự trả lời trước khi mở phần đáp án.',
    source: null,
    tags: ['đã lưu', 'ôn tập', 'trình duyệt'],
  },
]

export const qaSourceLabels = {
  'v1-1': 'Tài liệu Vòng 1 · Luật Viên chức',
  'v1-2': 'Tài liệu Vòng 1 · Tuyển dụng viên chức',
  'v1-3': 'Tài liệu Vòng 1 · Chính quyền địa phương',
  'v1-4': 'Tài liệu Vòng 1 · Vị trí việc làm',
  'v2-1': 'Đề cương nghiệp vụ kế toán',
}

export const suggestedQuestions = [
  'Vòng 1 thi bao nhiêu câu?',
  'Hồ sơ dự tuyển gồm gì?',
  'Cách tính điểm Vòng 2',
  'Phân biệt phân quyền và phân cấp',
]

export function searchQa(items, query, category) {
  const normalizedQuery = query.trim().toLowerCase()

  return items.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category
    if (!matchesCategory) return false
    if (!normalizedQuery) return true

    const searchable = [
      item.question,
      item.answer,
      item.tip,
      item.categoryLabel,
      ...item.tags,
    ].join(' ').toLowerCase()

    return searchable.includes(normalizedQuery)
  })
}

export function getQaStats(items) {
  const categories = new Set(items.map((item) => item.category)).size
  const savedCount = items.filter((item) => item.source).length
  return { total: items.length, categories, sourced: savedCount }
}
