/** FILE NÀY LÀM GÌ: Test file SQL và luồng thêm ảnh/audio của admin qua HTTP thật.
 * npm run test:media gọi; scope test riêng, không thay file/nội dung của main. */
const {test,after}=require('node:test'),assert=require('node:assert/strict')
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto')
const {createCatalogServer}=require('../catalog/server.cjs')
const {testRepository}=require('./test-support.cjs'),{connect,close}=require('./connection.cjs')
const {rangeOf}=require('../catalog/media.cjs')
after(close)
async function setup(t){
 const {scope,repository}=testRepository(t)
 const server=createCatalogServer({scope,repository})
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
 t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections()}))
 const base='http://127.0.0.1:'+server.address().port
 const core=require('../../.runtime/admin-core.cjs')
 return{base,scope,client:core.createHttpAdminService(base)}
}
const dataUrl=(mime,bytes)=>'data:'+mime+';base64,'+bytes.toString('base64')
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZyQAAAAASUVORK5CYII=','base64')
const mp3=Buffer.from('ID3-test-upload-'+Date.now()+'-'+crypto.randomUUID())

test('8 ảnh và 40 MP3 tải từ SQL đúng từng byte so với nguồn đã nhập',async t=>{
 const {base}=await setup(t),places=await(await fetch(base+'/published')).json()
 const {sql,pool}=await connect()
 let pictures=0,audios=0
 for(const place of places){
  const picture=await fetch(base+'/media/published/'+place.images[0].slice(6))
  assert.equal(picture.status,200);assert.equal(picture.headers.get('content-type'),'image/jpeg')
  assert.deepEqual(Buffer.from(await picture.arrayBuffer()),await fs.readFile(path.resolve(__dirname,'../../apps/web/static/images/places',place.id+'.jpg')));pictures++
  for(const text of Object.values(place.content)){
   const id=text.audio.url.slice(6)
   const alias=await pool.request().input('id',sql.Char(64),id).query("SELECT SourceUri FROM dbo.MediaAliases WHERE MediaId=@id AND SourceUri LIKE N'narration:%'")
   const key=alias.recordset[0].SourceUri.slice(10)
   const audio=await fetch(base+'/media/published/'+id)
   assert.equal(audio.status,200);assert.equal(audio.headers.get('content-type'),'audio/mpeg')
   assert.deepEqual(Buffer.from(await audio.arrayBuffer()),await fs.readFile(path.resolve(__dirname,'../../apps/web/static/narrations',key+'.mp3')));audios++
  }
 }
 assert.equal(pictures,8);assert.equal(audios,40)
})

test('Ảnh/audio upload vào SQL, nháp không lộ; công bố rồi mới tải được ở visitor',async t=>{
 const {base,client}=await setup(t)
 let place=(await client.load()).places[0]
 await client.savePlace({id:place.id,expectedRevision:place.revision,title:place.record.canonicalTitle,category:place.record.category,period:place.period,lat:'',lng:'',verified:false,images:[dataUrl('image/png',png)]})
 place=(await client.load()).places[0]
 const imageId=place.record.images[0].slice(6)
 assert.match(place.record.images[0],/^media:[a-f0-9]{64}$/)
 assert.equal((await fetch(base+'/media/published/'+imageId)).status,404)
 const draft=await fetch(base+'/media/preview/'+imageId)
 assert.equal(draft.status,200);assert.deepEqual(Buffer.from(await draft.arrayBuffer()),png)
 const text=place.record.content.vi
 await client.saveContent({id:place.id,expectedRevision:place.revision,language:'vi',title:text.title,summary:text.summary,address:text.address,body:text.body,audioUrl:dataUrl('audio/mpeg',mp3)})
 place=(await client.load()).places[0]
 const audioId=place.record.content.vi.audio.url.slice(6)
 assert.equal((await fetch(base+'/media/published/'+audioId)).status,404)
 const preview=await fetch(base+'/media/preview/'+audioId,{headers:{Range:'bytes=0-9'}})
 assert.equal(preview.status,206);assert.deepEqual(Buffer.from(await preview.arrayBuffer()),mp3.subarray(0,10))
 await client.submit(place.id,place.revision)
 await client.review(place.id,place.revision,true,'Đã kiểm tra')
 await client.publish(place.id,place.revision)
 assert.equal((await fetch(base+'/media/published/'+imageId)).status,200)
 const publicAudio=await fetch(base+'/media/published/'+audioId)
 assert.equal(publicAudio.status,200);assert.deepEqual(Buffer.from(await publicAudio.arrayBuffer()),mp3)
})

test('SQL media hỗ trợ HEAD, tua đầu/cuối và trả 416 cho Range sai',async t=>{
 const {base,client}=await setup(t),place=(await client.load()).places[0]
 const route=base+'/media/published/'+place.published.content.vi.audio.url.slice(6)
 const head=await fetch(route,{method:'HEAD'}),size=Number(head.headers.get('content-length'))
 assert.equal(head.status,200);assert.ok(size>100);assert.equal((await head.arrayBuffer()).byteLength,0)
 const suffix=await fetch(route,{headers:{Range:'bytes=-10'}})
 assert.equal(suffix.status,206);assert.equal((await suffix.arrayBuffer()).byteLength,10)
 assert.equal(suffix.headers.get('content-range'),`bytes ${size-10}-${size-1}/${size}`)
 for(const range of ['bytes=-0','bytes=5-1','bytes=0-1,5-6','bytes=999999999-'])assert.equal((await fetch(route,{headers:{Range:range}})).status,416)
 assert.equal(rangeOf('bytes=a-b',100),null)
})

test('File có tên photo:/narration: cũ cũng đọc SQL, không cần mở file nguồn',async t=>{
 const {base,client}=await setup(t),place=(await client.load()).places[0]
 const {sql,pool}=await connect()
 const id=place.published.content.vi.audio.url.slice(6)
 const alias=await pool.request().input('id',sql.Char(64),id).query("SELECT SourceUri FROM dbo.MediaAliases WHERE MediaId=@id AND SourceUri LIKE N'narration:%'")
 // Nếu nhánh phục vụ file còn đọc đĩa thì test phải thất bại.
 t.mock.method(fs,'readFile',async()=>{throw Error('Source files unavailable')})
 t.mock.method(require('node:fs'),'createReadStream',()=>{throw Error('Source streams unavailable')})
 assert.equal((await fetch(base+'/images/published/'+place.id+'.jpg')).status,200)
 assert.equal((await fetch(base+'/audio/published/'+alias.recordset[0].SourceUri.slice(10)+'.mp3')).status,200)
})

test('Tệp sai loại/MIME giả và media không tồn tại không làm hỏng bản đã lưu',async t=>{
 const {client}=await setup(t),original=(await client.load()).places[0]
 const input={id:original.id,expectedRevision:original.revision,title:original.record.canonicalTitle,category:original.record.category,period:original.period,lat:'',lng:'',verified:false}
 await assert.rejects(client.savePlace({...input,images:[dataUrl('image/png',Buffer.from('<script>bad</script>'))]}))
 await assert.rejects(client.savePlace({...input,images:['media:'+'a'.repeat(64)]}))
 assert.deepStrictEqual((await client.load()).places[0],original)
})
