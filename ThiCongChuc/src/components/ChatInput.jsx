import { useState } from 'react'

export default function ChatInput({ onSend, loading, value, onChange }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="border-t border-border p-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Hoi ve van ban phap luat..."
          disabled={loading}
          className="flex-1 px-3 py-2.5 border border-border rounded-lg text-[13px] bg-white dark:bg-card text-ink placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none disabled:opacity-50"
        />
        <button
          onClick={() => onSend()}
          disabled={loading || !value.trim()}
          className="px-4 py-2.5 bg-primary text-white rounded-lg text-[13px] font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Gui
        </button>
      </div>
    </div>
  )
}
