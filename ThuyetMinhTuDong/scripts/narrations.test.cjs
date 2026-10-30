/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra nội dung tám di tích, năm ngôn ngữ và 40 bản thu khớp dữ liệu giữa web/mobile.
 *
 * VỊ TRÍ: scripts/narrations.test.cjs
 * DÙNG BỞI: Bộ chạy test tương ứng trong package.json.
 * PHỤ THUỘC: node:test; node:assert/strict; node:fs; node:path; node:crypto;
 * ../packages/visitor-core/src/data/heritageContent.json;
 * ../packages/visitor-core/src/data/narrations.json
 * TẠI SAO TÁCH FILE: Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn
 * bộ giao diện.
 */
// Khai báo {test}: require nạp module 'node:test' để dùng chức năng có sẵn thay vì chép lại | Khai báo assert: require nạp module 'node:assert/strict' để dùng chức năng có sẵn thay vì chép lại.
const {test}=require('node:test'),assert=require('node:assert/strict')
// Khai báo fs: require nạp module 'node:fs' để dùng chức năng có sẵn thay vì chép lại | Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại | Khai báo {createHash}: require nạp module 'node:crypto' để dùng chức năng có sẵn thay vì chép lại.
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto')
// Khai báo root: Gọi path.resolve(__dirname,'..').
const root=path.resolve(__dirname,'..')
// Khai báo entries: require nạp module '../packages/visitor-core/src/data/heritageContent.json' để dùng chức năng có sẵn thay vì chép lại.
const entries=require('../packages/visitor-core/src/data/heritageContent.json')
// Khai báo audio: require nạp module '../packages/visitor-core/src/data/narrations.json' để dùng chức năng có sẵn thay vì chép lại.
const audio=require('../packages/visitor-core/src/data/narrations.json')
// Khai báo hash: khai báo callback value=>createHash('sha256').update(value).digest('hex').
const hash=value=>createHash('sha256').update(value).digest('hex')
// TẠI SAO (hash): Kiểm tra hành vi tự động giúp phát hiện lỗi mà không phải thao tác lại toàn bộ
// giao diện.
// Khẳng định kết quả thử nghiệm bằng test('8 di tích × 5 ngôn ngữ có bài riêng, nguồn Wikipedia và không còn bài mẫu',()=>{ assert.equal(entries.length,8).
test('8 di tích × 5 ngôn ngữ có bài riêng, nguồn Wikipedia và không còn bài mẫu',()=>{
 // Khẳng định kết quả thử nghiệm bằng assert.equal(entries.length,8). | Khẳng định kết quả thử nghiệm bằng assert.equal(audio.length,40).
 assert.equal(entries.length,8);assert.equal(audio.length,40)
 // Duyệt lần lượt entries bằng const entry.
 for(const entry of entries){
  // Khẳng định kết quả thử nghiệm bằng assert.deepEqual(Object.keys(entry.content),['vi','en','cn','pt','ja']).
  assert.deepEqual(Object.keys(entry.content),['vi','en','cn','pt','ja'])
  // Khẳng định kết quả thử nghiệm bằng assert.ok(entry.sources.length).
  assert.ok(entry.sources.length)
  // Khẳng định kết quả thử nghiệm bằng assert.ok(entry.sources.every(source=>new URL(source.url).hostname==='vi.wikipedia.org')).
  assert.ok(entry.sources.every(source=>new URL(source.url).hostname==='vi.wikipedia.org'))
  // Khẳng định kết quả thử nghiệm bằng assert.equal(new Set(Object.values(entry.content).map(text=>text.body)).size,5).
  assert.equal(new Set(Object.values(entry.content).map(text=>text.body)).size,5)
  // Duyệt lần lượt Object.entries(entry.content) bằng const [lang,text].
  for(const [lang,text] of Object.entries(entry.content)){
   // Khẳng định kết quả thử nghiệm bằng assert.ok(text.body.length>40). | Khẳng định kết quả thử nghiệm bằng assert.ok(text.address.trim()). | Khẳng định kết quả thử nghiệm bằng assert.ok(text.summary.trim()).
   assert.ok(text.body.length>40);assert.ok(text.address.trim());assert.ok(text.summary.trim())
   // Khẳng định kết quả thử nghiệm bằng assert.doesNotMatch(text.body,/sample text|DEMO|nội dung minh họa|chờ xác nhận/).
   assert.doesNotMatch(text.body,/sample text|DEMO|nội dung minh họa|chờ xác nhận/)
   // Khai báo recording: audio.find lấy phần tử đầu tiên phù hợp.
   const recording=audio.find(record=>record.placeId===entry.id&&record.language===lang)
   // Khẳng định kết quả thử nghiệm bằng assert.ok(recording). | Khẳng định kết quả thử nghiệm bằng assert.equal(recording.textSha256,hash(text.body)).
   assert.ok(recording);assert.equal(recording.textSha256,hash(text.body))
   /* GIẢI THÍCH TỪNG DÒNG:
    * DÒNG `assert.equal(recording.key,hash('gtts-v1|'+lang+'|'+text.body))`: Khẳng định kết quả thử nghiệm bằng assert.equal(recording.key,hash('gtts-v1|'+lang+'|'+text.body)).
    * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
    * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
    * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
    */
   assert.equal(recording.key,hash('gtts-v1|'+lang+'|'+text.body))
  }
 }
})
// Khẳng định kết quả thử nghiệm bằng test('40 MP3 khác nhau, đúng body và giống từng byte giữa web/mobile',()=>{ assert.equal(new Set(audio.map(record=>recor.
test('40 MP3 khác nhau, đúng body và giống từng byte giữa web/mobile',()=>{
 // Khẳng định kết quả thử nghiệm bằng assert.equal(new Set(audio.map(record=>record.key)).size,40).
 assert.equal(new Set(audio.map(record=>record.key)).size,40)
 // Khẳng định kết quả thử nghiệm bằng assert.equal(new Set(audio.map(record=>record.audioSha256)).size,40).
 assert.equal(new Set(audio.map(record=>record.audioSha256)).size,40)
 // Duyệt lần lượt audio bằng const record.
 for(const record of audio){
  // Khai báo web: Gọi fs.readFileSync(path.join(root,'apps/web/static/narrations',record.key+'.mp3')).
  const web=fs.readFileSync(path.join(root,'apps/web/static/narrations',record.key+'.mp3'))
  // Khai báo mobile: Gọi fs.readFileSync(path.join(root,'apps/mobile/assets/narrations',record.key+'.mp3')).
  const mobile=fs.readFileSync(path.join(root,'apps/mobile/assets/narrations',record.key+'.mp3'))
  // Khẳng định kết quả thử nghiệm bằng assert.deepEqual(web,mobile). | Khẳng định kết quả thử nghiệm bằng assert.equal(web.length,record.bytes).
  assert.deepEqual(web,mobile);assert.equal(web.length,record.bytes)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `assert.equal(hash(web),record.audioSha256);assert.ok(record.duration>20&&record.durat`: Khẳng định kết quả thử nghiệm bằng assert.equal(hash(web),record.audioSha256). | Khẳng định kết quả thử nghiệm bằng assert.ok(record.duration>20&&record.duration<120).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  assert.equal(hash(web),record.audioSha256);assert.ok(record.duration>20&&record.duration<120)
 }
})
