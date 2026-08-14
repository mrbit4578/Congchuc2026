import { useState } from 'react'

const tierLabels = { 1: 'Guide', 2: 'Van ban', 3: 'Ghi chu' }
const tierColors = {
  1: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  2: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
  3: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
}

export default function SourceCard({ source, index }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-border rounded-lg p-2.5 hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-2">
        <span className="text-[11px] font-bold text-primary bg-primary-light dark:bg-indigo-950/50 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
          {index}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-ink leading-tight truncate">
            {source.doc_title}
          </p>
          <p className="text-[11px] text-muted mt-0.5 truncate">
            {source.section_heading}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tierColors[source.source_tier] || tierColors[1]}`}>
              {tierLabels[source.source_tier] || 'Guide'}
            </span>
            {source.relevance_score > 0 && (
              <span className="text-[10px] text-muted">
                {(source.relevance_score * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
