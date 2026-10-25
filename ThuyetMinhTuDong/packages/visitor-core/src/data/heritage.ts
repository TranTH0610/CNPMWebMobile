/**
 * FILE NÀY LÀM GÌ: Ghép bài lịch sử có nguồn với MP3 đọc đúng văn bản.
 * mock.ts, Admin và bộ test dùng; phụ thuộc heritageContent.json/narrations.json.
 * UC02–UC06, UC14: nguồn chung cho cả bốn giao diện, không nhân bản bài trong UI.
 */
import raw from './heritageContent.json'
import recordings from './narrations.json'
import type { ContentSource, Language, PublishedText } from '../domain/model'

type HeritageEntry = {
  id: string; period: string; sources: ContentSource[]
  content: Record<Language, { address: string; summary: string; body: string }>
}
export const HERITAGE_CONTENT: readonly HeritageEntry[] = raw
export const NARRATIONS = recordings

// CHỨC NĂNG: Lấy MP3 đóng gói chỉ khi body trùng đúng bài đã tạo âm thanh.
// XỬ LÝ: Văn bản biên tập khác dù cùng ID/ngôn ngữ sẽ không mượn MP3 cũ.
export function bundledNarration(id: string, language: Language, body: string) {
  const entry = HERITAGE_CONTENT.find(place => place.id === id)
  if (entry?.content[language].body !== body) return undefined
  const recording = NARRATIONS.find(audio => audio.placeId === id && audio.language === language)
  return recording ? 'narration:' + recording.key : undefined
}

// CHỨC NĂNG: Chuyển khóa an toàn thành đường dẫn asset hoặc API.
// XỬ LÝ: Chỉ nhận SHA-256 đủ 64 ký tự; không ghép đường dẫn tùy ý từ QR/input.
export function narrationKey(url: string): string | undefined {
  return /^narration:[a-f0-9]{64}$/.test(url) ? url.slice(10) : undefined
}
export function bundledNarrationKey(key: string): boolean {
  return NARRATIONS.some(audio => audio.key === key)
}
export function heritageText(id: string, language: Language, title: string): PublishedText {
  const entry = HERITAGE_CONTENT.find(place => place.id === id)
  if (!entry) throw new Error('Missing heritage content: ' + id)
  const text = entry.content[language]
  const url = bundledNarration(id, language, text.body)
  if (!url) throw new Error('Missing narration: ' + id + '/' + language)
  const date = '2026-10-24T00:00:00Z'
  return {
    ...text, title, sources: entry.sources, adaptation: 'rewritten-and-translated',
    version: 2, status: 'published', approvedAt: date, publishedAt: date,
    audio: { id: url, url, version: 2, status: 'published', approvedAt: date, publishedAt: date },
  }
}
/* CÁCH KIỂM TRA: Có 8 bài × 5 ngôn ngữ; body thay đổi trả undefined;
 * mỗi audio có khóa khác nhau và đường dẫn không chứa tên máy/IP. */
