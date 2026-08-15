import { useState, useRef, useEffect } from 'react'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import SourceCard from '../components/SourceCard'

const suggestions = [
  "Viên chức là gì? Khác công chức ở điểm nào?",
  "Quy trình thi tuyển 2 vòng như thế nào?",
  "Các mức điểm ưu tiên trong tuyển dụng?",
  "Chế độ tập sự được quy định ra sao?",
  "Nhiệm vụ của kế toán viên là gì?",
  "Phân quyền khác phân cấp và ủy quyền ở điểm nào?",
]

export default function QnA() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeSources, setActiveSources] = useState([])
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text) => {
    const question = text || input
    if (!question.trim() || loading) return
    setInput('')
    setError(null)
    const userMsg = { role: 'user', content: question }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || err.detail || `Lỗi ${res.status}`)
      }
      const data = await res.json()
      const assistantMsg = { role: 'assistant', content: data.answer, sources: data.sources }
      setMessages(prev => [...prev, assistantMsg])
      setActiveSources(data.sources || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="font-heading text-[16px] font-extrabold flex items-center gap-2 mb-1">
        <span className="w-3 h-3 rounded-full bg-primary"></span>
        Hỏi đáp nhanh — Hybrid RAG + Qwen AI
      </h1>
      <p className="text-[13px] text-muted mb-4">
        Đặt câu hỏi về văn bản pháp luật. Hệ thống trả lời dựa trên 21 tài liệu ôn thi, có trích dẫn nguồn cụ thể.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm flex flex-col" style={{ minHeight: '500px' }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !loading && (
              <div>
                <p className="text-[13px] text-muted mb-3">Gợi ý câu hỏi:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      className="text-left px-3 py-2.5 bg-surface dark:bg-[#252840] border border-border rounded-lg text-[12px] text-ink/80 hover:border-primary hover:text-primary transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-[13px] text-muted">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                Đang tìm kiếm và trả lời...
              </div>
            )}
            {error && (
              <div className="text-[12px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput onSend={handleSend} loading={loading} value={input} onChange={setInput} />
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-20 bg-white dark:bg-card border border-border rounded-xl p-4 shadow-sm">
            <h3 className="font-heading text-[13px] font-bold mb-3">Nguồn tham khảo</h3>
            {activeSources.length > 0 ? (
              <div className="space-y-2">
                {activeSources.map((src, i) => (
                  <SourceCard key={i} source={src} index={i + 1} />
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-muted">Nguồn sẽ hiển thị ở đây sau khi trả lời.</p>
            )}
          </div>
        </div>
      </div>

      {activeSources.length > 0 && (
        <div className="lg:hidden mt-4 bg-white dark:bg-card border border-border rounded-xl p-4 shadow-sm">
          <h3 className="font-heading text-[13px] font-bold mb-3">Nguồn tham khảo</h3>
          <div className="space-y-2">
            {activeSources.map((src, i) => (
              <SourceCard key={i} source={src} index={i + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
