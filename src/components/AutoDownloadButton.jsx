import { useState } from 'react'

export default function AutoDownloadButton({ url, docTitle }) {
  const [loading, setLoading] = useState(false)
  const [downloadLinks, setDownloadLinks] = useState(null)
  const [error, setError] = useState(null)

  const handleAutoDownload = async () => {
    setLoading(true)
    setError(null)
    try {
      // Call local backend server
      const response = await fetch(`http://localhost:8000/api/download?url=${encodeURIComponent(url)}`)
      if (!response.ok) {
        throw new Error("Chưa bật backend (python main.py server) hoặc lỗi kết nối!")
      }
      const data = await response.json()
      if (data.success && data.exported_files) {
        setDownloadLinks(data.exported_files)
        // Trigger auto download of DOCX file if available
        const docxUrl = data.exported_files.docx || data.exported_files.markdown
        if (docxUrl) {
          const a = document.createElement("a")
          a.href = `http://localhost:8000${docxUrl}`
          a.download = ""
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      } else {
        throw new Error(data.message || "Tải dữ liệu thất bại")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        onClick={handleAutoDownload}
        disabled={loading}
        className="inline-flex items-center gap-1 text-[12px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
        title="Tự động tải nội dung & file DOCX về máy"
      >
        {loading ? "⏳ Đang tải về..." : "📥 Tải tự động về máy"}
      </button>

      {downloadLinks && (
        <div className="flex gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          {downloadLinks.docx && <a href={`http://localhost:8000${downloadLinks.docx}`} download className="underline">DOCX</a>}
          {downloadLinks.markdown && <a href={`http://localhost:8000${downloadLinks.markdown}`} download className="underline">Markdown</a>}
          {downloadLinks.json && <a href={`http://localhost:8000${downloadLinks.json}`} download className="underline">JSON</a>}
        </div>
      )}

      {error && (
        <span className="text-[11px] text-amber-600 dark:text-amber-400">
          ⚠️ {error}
        </span>
      )}
    </div>
  )
}
