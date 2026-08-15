import { guides } from '../src/data/guides.js'

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY
const DASHSCOPE_BASE_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'

const SYSTEM_PROMPT = `Bạn là trợ lý AI chuyên về pháp luật Việt Nam, hỗ trợ thí sinh ôn thi công chức.
Trả lời câu hỏi dựa trên các nguồn kiến thức được cung cấp bên dưới.

Quy tắc:
1. CHỈ sử dụng thông tin từ nguồn được cung cấp. Nếu không tìm thấy, nói rõ "Không tìm thấy thông tin liên quan trong tài liệu."
2. Trích dẫn nguồn cụ thể: tên văn bản + mục/điều tương ứng.
3. Sử dụng định dạng markdown để trình bày rõ ràng.
4. Giữ câu trả lời chính xác, ngắn gọn, tập trung vào câu hỏi.
5. Nếu câu hỏi liên quan đến so sánh hoặc phân biệt, sử dụng bảng hoặc gạch đầu dòng.
6. Trả lời bằng tiếng Việt.`

function searchGuides(question) {
  const keywords = question.toLowerCase()
    .replace(/[?.!,;:]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2)

  const results = []

  for (const [id, guide] of Object.entries(guides)) {
    for (const section of guide.sections || []) {
      const text = `${section.heading} ${section.content.join(' ')}`.toLowerCase()
      let score = 0
      for (const kw of keywords) {
        if (text.includes(kw)) score++
      }
      if (score > 0) {
        results.push({
          doc_id: id,
          doc_title: guide.title,
          section_heading: section.heading,
          text: section.content.join('\n'),
          score
        })
      }
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, 5)
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!DASHSCOPE_API_KEY) {
    return res.status(400).json({
      error: 'DASHSCOPE_API_KEY not configured. Add it in Vercel Environment Variables.'
    })
  }

  try {
    const { question, history } = req.body

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' })
    }

    const retrieved = searchGuides(question)

    let context = ''
    const sources = []
    if (retrieved.length > 0) {
      const contextParts = retrieved.map((r, i) =>
        `[Nguồn ${i + 1}] ${r.doc_title} -- ${r.section_heading}\n${r.text}`
      )
      context = contextParts.join('\n\n')
      sources.push(...retrieved.map(r => ({
        doc_id: r.doc_id,
        doc_title: r.doc_title,
        section_heading: r.section_heading,
        source_tier: 1
      })))
    } else {
      context = 'Không tìm thấy nguồn thông tin liên quan trực tiếp.'
    }

    const messages = [{ role: 'system', content: SYSTEM_PROMPT }]

    if (history && history.length > 0) {
      for (const msg of history.slice(-6)) {
        messages.push({ role: msg.role, content: msg.content })
      }
    }

    const userContent = `## Nguồn tham khảo\n\n${context}\n\n## Câu hỏi\n${question}`
    messages.push({ role: 'user', content: userContent })

    const response = await fetch(`${DASHSCOPE_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen-max',
        messages,
        temperature: 0.2,
        max_tokens: 1024
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('DashScope error:', errText)
      return res.status(500).json({ error: `LLM API error: ${response.status}` })
    }

    const data = await response.json()
    const answer = data.choices?.[0]?.message?.content || 'Không thể tạo câu trả lời.'

    return res.status(200).json({
      success: true,
      answer,
      sources,
      model: 'qwen-max',
      chunks_used: retrieved.length
    })
  } catch (err) {
    console.error('QA error:', err)
    return res.status(500).json({ error: err.message })
  }
}