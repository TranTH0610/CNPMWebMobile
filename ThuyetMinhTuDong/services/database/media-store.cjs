/**
 * FILE NÀY LÀM GÌ: Nhập byte ảnh/audio vào VARBINARY(MAX), lấy metadata và từng đoạn byte.
 * Codec, migration và HTTP media gọi. Không trả file static khi SQL lỗi.
 * TẠI SAO: Một file có thể được nhiều bản/ngôn ngữ tham chiếu nhưng chỉ lưu một lần theo SHA-256.
 */
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto')
const dns=require('node:dns/promises'),net=require('node:net')
const {connect}=require('./connection.cjs')
const root=path.resolve(__dirname,'../..'),MAX=15*1024*1024
const hash=value=>crypto.createHash('sha256').update(value).digest('hex')
const mediaKey=value=>/^media:([a-f0-9]{64})$/.exec(value)?.[1]
function mimeOf(bytes){
 if(bytes.subarray(0,3).equals(Buffer.from([255,216,255])))return'image/jpeg'
 if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return'image/png'
 if(bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP')return'image/webp'
 if(bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WAVE')return'audio/wav'
 if(bytes.toString('ascii',0,4)==='OggS')return'audio/ogg'
 if(bytes.toString('ascii',0,3)==='ID3'||bytes.length>2&&bytes[0]===255&&(bytes[1]&224)===224)return'audio/mpeg'
 throw Error('unsupported_media')
}
function isPrivate(address){
 if(net.isIP(address)===4){const [a,b]=address.split('.').map(Number);return a===0||a===10||a===127||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&b===168||a>=224||a===100&&b>=64&&b<=127}
 const value=address.toLowerCase();return value==='::'||value==='::1'||value.startsWith('fc')||value.startsWith('fd')||/^fe[89ab]/.test(value)||value.startsWith('::ffff:')
}
// Chỉ tải URL ảnh/audio công khai; kiểm tra lại mỗi redirect, giới hạn kích thước và thời gian.
async function download(address){
 for(let redirect=0;redirect<4;redirect++){
  const url=new URL(address)
  if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw Error('invalid_media_url')
  const addresses=await dns.lookup(url.hostname.replace(/^\[|\]$/g,''),{all:true})
  if(!addresses.length||addresses.some(item=>isPrivate(item.address)))throw Error('private_media_url')
  const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(10000)})
  if([301,302,303,307,308].includes(response.status)){
   const location=response.headers.get('location');await response.body?.cancel()
   if(!location)throw Error('invalid_redirect');address=new URL(location,url).href;continue
  }
  if(!response.ok||Number(response.headers.get('content-length'))>MAX){await response.body?.cancel();throw Error('media_download_failed')}
  const chunks=[];let size=0
  for await(const chunk of response.body){size+=chunk.length;if(size>MAX)throw Error('media_too_large');chunks.push(chunk)}
  return Buffer.concat(chunks)
 }
 throw Error('too_many_redirects')
}
// Chỉ dùng khi nhập/generate file. Luồng nghe/xem luôn lấy byte từ SQL.
async function readSource(uri){
 const photo=/^photo:([a-z0-9-]+)$/.exec(uri)
 if(photo)return fs.readFile(path.join(root,'apps/web/static/images/places',photo[1]+'.jpg'))
 const narration=/^narration:([a-f0-9]{64})$/.exec(uri)
 if(narration){
  for(const folder of ['apps/web/static/narrations','.runtime/narrations'])try{return await fs.readFile(path.join(root,folder,narration[1]+'.mp3'))}catch(error){if(error.code!=='ENOENT')throw error}
  throw Error('missing_audio_source')
 }
 const data=/^data:(?:image\/(?:jpeg|png|webp)|audio\/(?:mpeg|mp3|wav|ogg));base64,([A-Za-z0-9+/]+={0,2})$/.exec(uri)
 if(data){if(data[1].length>MAX*4/3+4)throw Error('media_too_large');return Buffer.from(data[1],'base64')}
 return download(uri)
}
async function resolveMedia(executor,sql,scope,uri,kind){
 const existing=mediaKey(uri)
 if(existing){
  const found=await executor.request().input('id',sql.Char(64),existing).input('kind',sql.VarChar(10),kind).query('SELECT Id FROM dbo.MediaFiles WHERE Id=@id AND Kind=@kind')
  if(!found.recordset.length)throw Error('missing_sql_media');return existing
 }
 const sourceHash=hash(uri)
 const known=await executor.request().input('hash',sql.Char(64),sourceHash).query('SELECT a.MediaId,m.Kind FROM dbo.MediaAliases a JOIN dbo.MediaFiles m ON m.Id=a.MediaId WHERE a.SourceHash=@hash')
 if(known.recordset.length){if(known.recordset[0].Kind!==kind)throw Error('wrong_media_kind');return known.recordset[0].MediaId}
 const bytes=await readSource(uri),mime=mimeOf(bytes)
 if(!bytes.length||bytes.length>MAX||!mime.startsWith(kind+'/'))throw Error('invalid_media')
 const id=hash(bytes)
 // UPDLOCK/HOLDLOCK giữ khóa đến hết transaction ngoài, tránh hai request cùng chèn một file.
 await executor.request().input('id',sql.Char(64),id).input('kind',sql.VarChar(10),kind).input('mime',sql.VarChar(40),mime)
  .input('bytes',sql.VarBinary(sql.MAX),bytes).input('scope',sql.NVarChar(100),scope).input('hash',sql.Char(64),sourceHash)
  .input('uri',sql.NVarChar(2048),uri.startsWith('data:')||uri.length>2048?null:uri).query(`
   IF NOT EXISTS(SELECT 1 FROM dbo.MediaFiles WITH(UPDLOCK,HOLDLOCK) WHERE Id=@id)
    INSERT dbo.MediaFiles(Id,Kind,MimeType,Data,SourceScope) VALUES(@id,@kind,@mime,@bytes,@scope);
   IF NOT EXISTS(SELECT 1 FROM dbo.MediaAliases WITH(UPDLOCK,HOLDLOCK) WHERE SourceHash=@hash)
    INSERT dbo.MediaAliases(SourceHash,SourceUri,MediaId) VALUES(@hash,@uri,@id);`)
 return id
}
async function normaliseDocumentMedia(executor,sql,scope,document){
 const copy=structuredClone(document),resolved=new Map()
 async function ref(uri,kind){const key=kind+'|'+uri;if(!resolved.has(key))resolved.set(key,await resolveMedia(executor,sql,scope,uri,kind));return'media:'+resolved.get(key)}
 for(const place of copy.places)for(const record of [place.record,place.published])if(record){
  for(let i=0;i<record.images.length;i++)record.images[i]=await ref(record.images[i],'image')
  for(const text of Object.values(record.content))if(text?.audio)text.audio.url=await ref(text.audio.url,'audio')
 }
 return copy
}
async function metadata(id){
 const {sql,pool}=await connect()
 return(await pool.request().input('id',sql.Char(64),id).query('SELECT Id,Kind,MimeType,ByteLength FROM dbo.MediaFiles WHERE Id=@id')).recordset[0]
}
async function alias(uri){const {sql,pool}=await connect();return(await pool.request().input('hash',sql.Char(64),hash(uri)).query('SELECT MediaId FROM dbo.MediaAliases WHERE SourceHash=@hash')).recordset[0]?.MediaId}
async function allowed(id,scope,preview){
 const {sql,pool}=await connect()
 const result=await pool.request().input('id',sql.Char(64),id).input('scope',sql.NVarChar(100),scope).input('preview',sql.Bit,preview).query(`
 SELECT TOP(1) 1 AS ok FROM (
  SELECT Scope,PlaceId,SnapshotKind,MediaId FROM dbo.PlaceImages
  UNION ALL SELECT Scope,PlaceId,SnapshotKind,MediaId FROM dbo.AudioTracks
 ) x JOIN dbo.Places p ON p.Scope=x.Scope AND p.PlaceId=x.PlaceId
 WHERE x.Scope=@scope AND x.MediaId=@id AND (@preview=1 OR (x.SnapshotKind=N'published' AND p.Workflow<>N'archived'))`)
 return Boolean(result.recordset.length)
}
async function bytes(id,start,length){const {sql,pool}=await connect();const result=await pool.request().input('id',sql.Char(64),id).input('start',sql.Int,start+1).input('length',sql.Int,length).query('SELECT SUBSTRING(Data,@start,@length) AS Content FROM dbo.MediaFiles WHERE Id=@id');if(!result.recordset.length)throw Error('missing_sql_media');return Buffer.from(result.recordset[0].Content)}
module.exports={mediaKey,mimeOf,resolveMedia,normaliseDocumentMedia,metadata,alias,allowed,bytes}
