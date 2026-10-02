const cache = new Map<string, string>()

// Chia văn bản thành các đoạn ngắn theo câu để không vượt giới hạn của API
function chunkText(text: string, max = 250): string[] {
  const sentences = text.match(/[^.!?。]+[.!?。]?\s*/g) ?? [text]
  const chunks: string[] = []
  let current = ''
  for (const s of sentences) {
    if ((current + s).length > max && current) {
      chunks.push(current.trim())
      current = s
    } else {
      current += s
    }
  }
  if (current.trim()) chunks.push(current.trim())
  return chunks
}

async function translateChunk(text: string, from: string, to: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Translate request failed')
  const data = await res.json()
  const out = data?.responseData?.translatedText as string | undefined
  if (!out) throw new Error('No translation returned')
  return out
}

export async function translateLong(text: string, from: string, to: string): Promise<string> {
  if (from === to) return text
  const key = `${from}|${to}|${text}`
  const hit = cache.get(key)
  if (hit) return hit
  const parts: string[] = []
  for (const chunk of chunkText(text)) {
    parts.push(await translateChunk(chunk, from, to))
  }
  const result = parts.join(' ')
  cache.set(key, result)
  return result
}

// Lấy đoạn tóm tắt một bài trên Wikipedia theo ngôn ngữ
export async function fetchWikiSummary(title: string, lang = 'vi'): Promise<string> {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Wikipedia page not found')
  const data = await res.json()
  return data.extract as string
}