import { useState, useRef, useEffect } from 'react'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import SourceCard from '../components/SourceCard'

const suggestions = [
  "Vien chuc la gi? Khac cong chuc o diem nao?",
  "Quy trinh thi tuyen 2 vong nhu the nao?",
  "Cac muc diem uu tien trong tuyen dung?",
  "Che do tap su duoc quy dinh ra sao?",
  "Nhiem vu cua ke toan vien la gi?",
  "Phan quyen khac phan cap va uy quyen o diem nao?",
]

export default function QnA() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeSources, setActiveSources] = useState([])
  const [error, setError] = useState(null)
  const [apiKey, setApiKey] = useState('')
  const [showConfig, setShowConfig] = useState(false)
  const [configured, setConfigured] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/qa/status')
      .then(r => r.json())
      .then(data => {
        setConfigured(data.configured !== false)
        if (!data.configured) setShowConfig(true)
      })
      .catch(() => setConfigured(false))
  }, [])

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
      const res = await fetch('http://localhost:8000/api/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history, top_k: 5 })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Loi ${res.status}`)
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

  const handleConfigSubmit = async () => {
    if (!apiKey.trim()) return
    try {
      const res = await fetch('http://localhost:8000/api/qa/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dashscope_api_key: apiKey })
      })
      if (res.ok) {
        setConfigured(true)
        setShowConfig(false)
        setApiKey('')
      }
    } catch (err) {
      setError('Khong the luu API key: ' + err.message)
    }
  }

  return (
    <div>
      <h1 className="font-heading text-[16px] font-extrabold flex items-center gap-2 mb-1">
        <span className="w-3 h-3 rounded-full bg-primary"></span>
        Hỏi đáp nhanh - Hybrid RAG + Qwen AI
      </h1>
      <p className="text-[13px] text-muted mb-4">
        Dat cau hoi ve van ban phap luat. He thong tra loi dua tren 21 tai lieu on thi, co trich dan nguon cu the.
      </p>

      {showConfig && (
        <div className="mb-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <p className="text-[13px] font-semibold text-amber-800 dark:text-amber-300 mb-2">
            Cần cấu hình DashScope API key để sử dụng tính năng hỏi đáp.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="flex-1 px-3 py-2 border border-amber-300 dark:border-amber-700 rounded-lg text-[13px] bg-white dark:bg-card outline-none focus:border-primary"
            />
            <button
              onClick={handleConfigSubmit}
              className="px-4 py-2 bg-primary text-white rounded-lg text-[13px] font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
            >
              Lưu
            </button>
          </div>
          <p className="text-[11px] text-muted mt-2">
            Lấy API key miễn phí tại: dashscope.aliyuncs.com
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm flex flex-col" style={{ minHeight: '500px' }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !loading && (
              <div>
                <p className="text-[13px] text-muted mb-3">Goi y cau hoi:</p>
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
                Dang tim kiem va tra loi...
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
            <h3 className="font-heading text-[13px] font-bold mb-3">Nguon tham khao</h3>
            {activeSources.length > 0 ? (
              <div className="space-y-2">
                {activeSources.map((src, i) => (
                  <SourceCard key={i} source={src} index={i + 1} />
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-muted">Nguon se hien thi o day sau khi tra loi.</p>
            )}
          </div>
        </div>
      </div>

      {activeSources.length > 0 && (
        <div className="lg:hidden mt-4 bg-white dark:bg-card border border-border rounded-xl p-4 shadow-sm">
          <h3 className="font-heading text-[13px] font-bold mb-3">Nguon tham khao</h3>
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
