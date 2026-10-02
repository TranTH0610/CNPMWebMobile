// index.ts
// Ham goi API dung chung cho ca web va mobile, tranh viet trung 2 lan

const API_URL = process.env.API_URL ?? 'http://localhost:3000/api'

export async function transcribeAudio(audioUrl: string, language: string) {
  const res = await fetch(API_URL + '/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioUrl, language }),
  })
  return res.json()
}