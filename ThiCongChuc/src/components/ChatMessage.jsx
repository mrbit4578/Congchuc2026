import { useState } from 'react'

function SimpleMarkdown({ text }) {
  const lines = text.split('\n')
  const elements = []
  let inList = false
  let listItems = []

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="pl-5 space-y-1 my-2">
          {listItems.map((item, i) => (
            <li key={i} className="text-[13px] leading-relaxed">{renderInline(item)}</li>
          ))}
        </ul>
      )
      listItems = []
    }
    inList = false
  }

  const renderInline = (str) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      return <span key={i}>{part}</span>
    })
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true
      listItems.push(trimmed.slice(2))
    } else if (/^\d+\./.test(trimmed)) {
      inList = true
      listItems.push(trimmed.replace(/^\d+\.\s*/, ''))
    } else {
      if (inList) flushList()
      if (trimmed.startsWith('### ')) {
        elements.push(<h4 key={idx} className="font-heading text-[13px] font-bold text-primary-dark dark:text-indigo-300 mt-3 mb-1">{renderInline(trimmed.slice(4))}</h4>)
      } else if (trimmed.startsWith('## ')) {
        elements.push(<h3 key={idx} className="font-heading text-[14px] font-bold text-primary-dark dark:text-indigo-300 mt-3 mb-1">{renderInline(trimmed.slice(3))}</h3>)
      } else if (trimmed.startsWith('# ')) {
        elements.push(<h2 key={idx} className="font-heading text-[15px] font-bold text-primary-dark dark:text-indigo-300 mt-3 mb-1">{renderInline(trimmed.slice(2))}</h2>)
      } else if (trimmed === '') {
        elements.push(<div key={idx} className="h-2" />)
      } else {
        elements.push(<p key={idx} className="text-[13px] leading-relaxed my-1">{renderInline(trimmed)}</p>)
      }
    }
  })
  if (inList) flushList()
  return <>{elements}</>
}

export default function ChatMessage({ message }) {
  const [showSources, setShowSources] = useState(false)
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[90%] rounded-xl px-4 py-3 ${
        isUser
          ? 'bg-primary text-white'
          : 'bg-surface dark:bg-[#252840] border border-border'
      }`}>
        {isUser ? (
          <p className="text-[13px]">{message.content}</p>
        ) : (
          <div>
            <SimpleMarkdown text={message.content} />
            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-2 border-t border-border/50">
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="text-[11px] font-semibold text-primary hover:text-primary-dark cursor-pointer bg-transparent border-none"
                >
                  {showSources ? 'An nguon' : `${message.sources.length} nguon tham khao`}
                </button>
                {showSources && (
                  <div className="mt-2 space-y-1">
                    {message.sources.map((src, i) => (
                      <div key={i} className="text-[11px] text-muted bg-white dark:bg-card rounded px-2 py-1">
                        [{i + 1}] {src.doc_title} - {src.section_heading}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
