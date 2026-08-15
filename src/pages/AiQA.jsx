import { useEffect, useRef, useState } from 'react'

const starterQuestions = [
  'Vòng 1 thi bao nhiêu câu và trong bao lâu?',
  'Phân biệt phân quyền, phân cấp và ủy quyền.',
  'Hồ sơ dự tuyển viên chức gồm những gì?',
]

const initialMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Xin chào! Tôi là trợ lý AI ôn thi viên chức. Bạn hãy hỏi về tuyển dụng, Vòng 1, Vòng 2 hoặc nghiệp vụ kế toán. Tôi sẽ tìm trong kho tài liệu của website trước khi trả lời.',
  sources: [],
}

function SparkleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 1.3 5.7L19 10l-5.7 1.3L12 17l-1.3-5.7L5 10l5.7-1.3L12 3zM19 16l.55 2.45L22 19l-2.45.55L19 22l-.55-2.45L16 19l2.45-.55L19 16z" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 4 16 8-16 8 3-8-3-8zm3 8h13" />
    </svg>
  )
}

function renderInline(line) {
  return line.split(/(\*\*[^*]+\*\*|\[\d+\])/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>
    if (/^\[\d+\]$/.test(part)) return <span key={index} className="font-bold text-primary">{part}</span>
    return <span key={index}>{part}</span>
  })
}

function renderAnswer(content) {
  return content.split('\n').map((line, index) => (
    <span key={`${line}-${index}`} className="block min-h-[1.25rem]">{line ? renderInline(line) : '\u00a0'}</span>
  ))
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-1"><SparkleIcon /></div>}
      <div className={`max-w-[88%] md:max-w-[78%] rounded-2xl px-4 py-3 ${isUser ? 'bg-primary text-white rounded-br-md' : 'bg-white dark:bg-card border border-border text-ink rounded-bl-md shadow-sm'}`}>
        <div className="text-[13px] leading-7">{renderAnswer(message.content)}</div>
        {!isUser && message.sources?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted mb-2">Nguồn đã truy xuất</p>
            <div className="space-y-1.5">
              {message.sources.map((source) => (
                <div key={source.id} className="flex gap-2 text-[11px] text-muted leading-relaxed">
                  <span className="text-primary font-bold">[{source.rank}]</span>
                  <span>{source.question} <span className="text-[10px] opacity-75">· {source.category}</span></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AiQA() {
  const [messages, setMessages] = useState([initialMessage])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const askQuestion = async (questionOverride) => {
    const question = (questionOverride ?? input).trim()
    if (!question || loading) return

    const userMessage = { id: `user-${Date.now()}`, role: 'user', content: question }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          history: messages.slice(-6).map(({ role, content }) => ({ role, content })),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        const err = new Error(data.error || 'Không thể nhận phản hồi từ AI.')
        err.debug = data.debug
        throw err
      }

      setMessages([...nextMessages, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        sources: data.sources || [],
      }])
    } catch (requestError) {
      let msg = requestError.message || 'Có lỗi xảy ra.'
      if (requestError.debug) {
        msg += ` (Debug: Exists=${requestError.debug.exists}, Len=${requestError.debug.length}, Env=[${requestError.debug.envKeys}])`
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    askQuestion()
  }

  const clearChat = () => {
    setMessages([initialMessage])
    setError('')
    setInput('')
  }

  return (
    <div>
      <div className="mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary mb-2">Retrieval-Augmented Generation</p>
          <h1 className="font-heading text-[21px] font-extrabold flex items-center gap-2">✨ Hỏi/Đáp AI</h1>
          <p className="text-[13px] text-muted mt-2 max-w-2xl leading-relaxed">AI truy xuất các nội dung liên quan trong kho ôn tập trước, sau đó tạo câu trả lời có nguồn tham chiếu. API key được giữ ở máy chủ và không gửi xuống trình duyệt.</p>
        </div>
        <button type="button" onClick={clearChat} className="self-start md:self-auto rounded-lg border border-border bg-white dark:bg-card px-3 py-2 text-[12px] font-bold text-muted hover:text-primary hover:border-primary transition-colors">Xóa cuộc trò chuyện</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-5 items-start">
        <section className="bg-surface dark:bg-[#151827] border border-border rounded-2xl p-3 sm:p-5 shadow-sm">
          <div className="min-h-[420px] max-h-[62vh] overflow-y-auto space-y-4 pr-1">
            {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
            {loading && (
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0"><SparkleIcon /></div>
                <div className="bg-white dark:bg-card border border-border rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center h-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:120ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:240ms]" />
                    <span className="text-[11px] text-muted ml-2">Đang truy xuất tài liệu và suy luận...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900/50 px-3 py-2.5 text-[12px] leading-relaxed text-red-800 dark:text-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-4 flex items-end gap-2 bg-white dark:bg-card border border-border rounded-xl p-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  handleSubmit(event)
                }
              }}
              placeholder="Nhập câu hỏi của bạn... (Enter để gửi, Shift + Enter để xuống dòng)"
              rows={2}
              maxLength={1200}
              className="flex-1 resize-none bg-transparent px-2 py-1.5 text-[13px] text-ink outline-none"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary-dark transition-colors" title="Gửi câu hỏi" aria-label="Gửi câu hỏi"><SendIcon /></button>
          </form>
          <p className="text-[10px] text-muted mt-2 text-right">{input.length}/1.200 ký tự · AI có thể trả lời chưa chính xác</p>
        </section>

        <aside className="space-y-4">
          <div className="bg-white dark:bg-card border border-border rounded-xl p-4 shadow-sm">
            <h2 className="font-heading text-[14px] font-extrabold mb-3">Câu hỏi gợi ý</h2>
            <div className="space-y-2">
              {starterQuestions.map((question) => (
                <button key={question} type="button" onClick={() => askQuestion(question)} disabled={loading} className="w-full text-left rounded-lg border border-border bg-surface dark:bg-[#252840] px-3 py-2.5 text-[12px] leading-relaxed text-ink hover:border-primary hover:text-primary disabled:opacity-50 transition-colors">{question}</button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-card border border-border rounded-xl p-4 shadow-sm">
            <h2 className="font-heading text-[14px] font-extrabold mb-3">RAG đang hoạt động</h2>
            <div className="space-y-3 text-[12px] text-muted">
              <div className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-primary-light dark:bg-indigo-950/50 text-primary flex items-center justify-center font-bold text-[10px]">1</span><p><strong className="text-ink">Truy xuất:</strong> tìm câu hỏi, thẻ và nội dung gần với câu hỏi.</p></div>
              <div className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-primary-light dark:bg-indigo-950/50 text-primary flex items-center justify-center font-bold text-[10px]">2</span><p><strong className="text-ink">Tăng cường:</strong> đưa các đoạn liên quan vào ngữ cảnh cho AI.</p></div>
              <div className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-primary-light dark:bg-indigo-950/50 text-primary flex items-center justify-center font-bold text-[10px]">3</span><p><strong className="text-ink">Trả lời:</strong> tạo đáp án tiếng Việt kèm nguồn [1], [2].</p></div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/50 p-4">
            <p className="text-[11px] leading-relaxed text-amber-900 dark:text-amber-100"><strong>Bảo mật:</strong> Không nhập mật khẩu, thông tin cá nhân hoặc dữ liệu nhạy cảm. Với nội dung pháp lý, hãy đối chiếu văn bản và thông báo tuyển dụng chính thức.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
