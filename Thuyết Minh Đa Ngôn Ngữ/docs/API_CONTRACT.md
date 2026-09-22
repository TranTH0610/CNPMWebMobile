# API Contract (FE <-> BE thong nhat)

## POST /api/transcribe
Request:  { "audioUrl": string, "language": string }
Response: { "text": string, "confidence": number }
