/** FILE NÀY LÀM GÌ: Kiểm tra bài lịch sử và MP3 đóng gói giữa hai nền tảng.
 * npm test gọi; UC04/UC06/UC14. Kiểm tra SHA-256, thời lượng và nguồn từng bài. */
const {test}=require('node:test'),assert=require('node:assert/strict')
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto')
const root=path.resolve(__dirname,'..')
const entries=require('../packages/visitor-core/src/data/heritageContent.json')
const audio=require('../packages/visitor-core/src/data/narrations.json')
const hash=value=>createHash('sha256').update(value).digest('hex')
test('8 di tích × 5 ngôn ngữ có bài riêng, nguồn Wikipedia và không còn bài mẫu',()=>{
 assert.equal(entries.length,8);assert.equal(audio.length,40)
 for(const entry of entries){
  assert.deepEqual(Object.keys(entry.content),['vi','en','cn','pt','ja'])
  assert.ok(entry.sources.length)
  assert.ok(entry.sources.every(source=>new URL(source.url).hostname==='vi.wikipedia.org'))
  assert.equal(new Set(Object.values(entry.content).map(text=>text.body)).size,5)
  for(const [lang,text] of Object.entries(entry.content)){
   assert.ok(text.body.length>40);assert.ok(text.address.trim());assert.ok(text.summary.trim())
   assert.doesNotMatch(text.body,/sample text|DEMO|nội dung minh họa|chờ xác nhận/)
   const recording=audio.find(record=>record.placeId===entry.id&&record.language===lang)
   assert.ok(recording);assert.equal(recording.textSha256,hash(text.body))
   assert.equal(recording.key,hash('gtts-v1|'+lang+'|'+text.body))
  }
 }
})
test('40 MP3 khác nhau, đúng body và giống từng byte giữa web/mobile',()=>{
 assert.equal(new Set(audio.map(record=>record.key)).size,40)
 assert.equal(new Set(audio.map(record=>record.audioSha256)).size,40)
 for(const record of audio){
  const web=fs.readFileSync(path.join(root,'apps/web/static/narrations',record.key+'.mp3'))
  const mobile=fs.readFileSync(path.join(root,'apps/mobile/assets/narrations',record.key+'.mp3'))
  assert.deepEqual(web,mobile);assert.equal(web.length,record.bytes)
  assert.equal(hash(web),record.audioSha256);assert.ok(record.duration>20&&record.duration<120)
 }
})
