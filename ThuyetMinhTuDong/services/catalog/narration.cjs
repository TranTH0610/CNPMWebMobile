/** FILE NÀY LÀM GÌ: Tạo MP3 thật từ bài Admin đã lưu; server RAM gọi.
 * Phụ thuộc Python/gTTS cài theo scripts/requirements-narration.txt.
 * UC14.2: không gửi khóa API ra FE, không dùng giọng mẫu thay cho nội dung mới. */
const fs = require('node:fs')
const path = require('node:path')
const { createHash } = require('node:crypto')
const { execFile } = require('node:child_process')
const root = path.resolve(__dirname, '../..')
const jobs = new Map()
function audioFile(key) {
  if (!/^[a-f0-9]{64}$/.test(key)) return undefined
  for (const folder of ['apps/web/static/narrations', '.runtime/narrations']) {
    const file = path.join(root, folder, key + '.mp3')
    if (fs.existsSync(file) && fs.statSync(file).size > 0) return file
  }
}
async function prepareNarration(body, language) {
  if (!['vi','en','cn','pt','ja'].includes(language) || !body.trim() || body.length > 20000) throw Error('Invalid narration')
  const key = createHash('sha256').update('gtts-v1|' + language + '|' + body).digest('hex')
  if (audioFile(key)) return 'narration:' + key
  if (jobs.has(key)) return jobs.get(key)
  // CHỨC NĂNG: Giới hạn hai bài mới cùng lúc; gom yêu cầu trùng văn bản.
  // XỬ LÝ: Tệp request chỉ chứa bài công khai do Admin soạn; không truyền qua shell.
  if (jobs.size >= 2) throw Error('TTS busy')
  const task = (async () => {
    const folder = path.join(root, '.runtime/narrations')
    fs.mkdirSync(folder, {recursive:true})
    const request = path.join(folder, key + '.json'), output = path.join(folder, key + '.mp3')
    fs.writeFileSync(request, JSON.stringify({body,language}))
    try {
      await new Promise((resolve,reject) => execFile(process.env.NARRATION_PYTHON || 'python',
        [path.join(root,'scripts/generate-narrations.py'),'--request',request,'--output',output],
        {cwd:root,windowsHide:true,timeout:150000,env:{...process.env,PYTHONPATH:[path.join(root,'.tools/tts-python'),process.env.PYTHONPATH].filter(Boolean).join(path.delimiter)}},
        error => error ? reject(error) : resolve()))
      if (!audioFile(key)) throw Error('Missing MP3')
      return 'narration:' + key
    } finally { fs.rmSync(request,{force:true}) }
  })()
  jobs.set(key,task)
  try { return await task } finally { jobs.delete(key) }
}
// CHỨC NĂNG: Hỗ trợ HTTP Range để tua thật trên iOS/Android/trình duyệt.
// XỬ LÝ: Không cho đường dẫn tùy ý; range sai trả 416, không đọc tệp ngoài audio.
function sendAudio(req,res,key) {
  const file = audioFile(key)
  if (!file) { res.statusCode=404; res.end(); return }
  const size=fs.statSync(file).size,range=req.headers.range
  let start=0,end=size-1
  if(range){
    const match=/^bytes=(\d*)-(\d*)$/.exec(range)
    if(!match||(!match[1]&&!match[2])){res.statusCode=416;res.setHeader('Content-Range','bytes */'+size);res.end();return}
    if(!match[1])start=Math.max(0,size-Number(match[2]));else{start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]))}
    if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>end||start>=size){res.statusCode=416;res.setHeader('Content-Range','bytes */'+size);res.end();return}
    res.statusCode=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`)
  }
  res.setHeader('Content-Type','audio/mpeg');res.setHeader('Accept-Ranges','bytes')
  res.setHeader('Content-Length',end-start+1);res.setHeader('Cache-Control','private, max-age=3600')
  const stream=fs.createReadStream(file,{start,end})
  stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res)
}
module.exports={prepareNarration,sendAudio}
/* CÁCH KIỂM TRA: Bài mới sinh MP3 khác; gọi trùng không tạo lại;
 * mất mạng báo lỗi, body không bị sửa; Range trả đúng số byte. */
