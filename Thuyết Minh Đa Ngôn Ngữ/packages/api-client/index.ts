// index.ts
// Ham goi API dung chung cho ca web va mobile, tranh viet trung 2 lan
export async function transcribeAudio(audioUrl: string, language: string) {
  const res = await fetch(${process.env.API_URL}/transcribe, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioUrl, language }),
  })
  return res.json()
}
