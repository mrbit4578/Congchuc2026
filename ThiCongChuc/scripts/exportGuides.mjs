import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputPath = resolve(__dirname, '..', '..', 'app', 'data', 'knowledge_base.json')

const { guides } = await import('../src/data/guides.js')

const result = Object.entries(guides).map(([id, data]) => ({
  doc_id: id,
  title: data.title || '',
  info: data.info || {},
  sections: (data.sections || []).map(s => ({
    heading: s.heading || '',
    content: Array.isArray(s.content) ? s.content : [String(s.content || '')]
  }))
}))

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8')
console.log(`Exported ${result.length} documents to ${outputPath}`)
