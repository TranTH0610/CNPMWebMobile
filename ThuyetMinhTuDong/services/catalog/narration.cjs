/**
 * FILE NÀY LÀM GÌ
 * Chuẩn bị MP3 từ nội dung/ngôn ngữ, dùng bộ nhớ đệm tệp và phục vụ audio với Range để tua được.
 *
 * VỊ TRÍ: services/catalog/narration.cjs
 * DÙNG BỞI: services/catalog/server.cjs.
 * PHỤ THUỘC: node:fs; node:path; node:crypto; node:child_process
 * TẠI SAO TÁCH FILE: Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
 * lớp kết nối này.
 */
// Khai báo fs: require nạp module 'node:fs' để dùng chức năng có sẵn thay vì chép lại.
const fs = require('node:fs')
// Khai báo path: require nạp module 'node:path' để dùng chức năng có sẵn thay vì chép lại.
const path = require('node:path')
// Khai báo { createHash }: require nạp module 'node:crypto' để dùng chức năng có sẵn thay vì chép lại.
const { createHash } = require('node:crypto')
// Khai báo { execFile }: require nạp module 'node:child_process' để dùng chức năng có sẵn thay vì chép lại.
const { execFile } = require('node:child_process')
// Khai báo root: Gọi path.resolve(__dirname, '../..').
const root = path.resolve(__dirname, '../..')
// Khai báo jobs: Map giữ các cặp khóa–giá trị trong RAM.
const jobs = new Map()
const {alias}=require('../database/media-store.cjs')
// CHỨC NĂNG: Xác định tệp MP3 của một khóa bản thu.
// XỬ LÝ: Giới hạn đường dẫn theo kho audio để không dùng chuỗi nhập làm đường dẫn tùy ý.
// Khai báo audioFile(key). Nhận đầu vào qua tham số.
function audioFile(key) {
  // Rẽ nhánh nếu !/^[a-f0-9]{64}$/.test(key). | Trả kết quả: sử dụng undefined làm giá trị của bước hiện tại.
  if (!/^[a-f0-9]{64}$/.test(key)) return undefined
  // Duyệt lần lượt ['apps/web/static/narrations', '.runtime/narrations'] bằng const folder.
  for (const folder of ['apps/web/static/narrations', '.runtime/narrations']) {
    // Khai báo file: Gọi path.join(root, folder, key + '.mp3').
    const file = path.join(root, folder, key + '.mp3')
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (fs.existsSync(file) && fs.statSync(file).size > 0) return file`: Rẽ nhánh nếu fs.existsSync(file) && fs.statSync(file).size > 0. | Trả kết quả: sử dụng file làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    if (fs.existsSync(file) && fs.statSync(file).size > 0) return file
  }
}
// TẠI SAO (audioFile): Không dùng thẳng dữ liệu người gửi thành đường dẫn để tránh truy cập tệp
// ngoài kho audio.
// CHỨC NĂNG: Chuẩn bị MP3 từ đúng bài và ngôn ngữ.
// XỬ LÝ: Dùng khóa nội dung để tái sử dụng bản khớp và tránh dùng âm thanh mẫu cho bài mới.
// Khai báo prepareNarration(body, language). Chuẩn bị audio tương ứng nội dung/ngôn ngữ thay vì gán một tệp mẫu cho mọi bài.
async function prepareNarration(body, language) {
  // Rẽ nhánh nếu !['vi','en','cn','pt','ja'].includes(language) || !body.trim() || body.length > 20000. | Ném Error('Invalid narration').
  if (!['vi','en','cn','pt','ja'].includes(language) || !body.trim() || body.length > 20000) throw Error('Invalid narration')
  // Khai báo key: Gọi createHash('sha256').update('gtts-v1|' + language + '|' + body).digest('hex').
  const key = createHash('sha256').update('gtts-v1|' + language + '|' + body).digest('hex')
  // Rẽ nhánh nếu audioFile(key). | Trả kết quả: tính biểu thức 'narration:' + key.
  // Nếu đã có byte trong SQL, tạo lại tham chiếu mà không gọi TTS/mở file cũ.
  if (await alias('narration:'+key)) return 'narration:'+key
  if (audioFile(key)) return 'narration:' + key
  // Rẽ nhánh nếu jobs.has(key). | Trả kết quả: jobs.get đọc theo khóa.
  if (jobs.has(key)) return jobs.get(key)
  // CHỨC NĂNG: Giới hạn hai bài mới cùng lúc; gom yêu cầu trùng văn bản.
  // XỬ LÝ: Tệp request chỉ chứa bài công khai do Admin soạn; không truyền qua shell.
  // Rẽ nhánh nếu jobs.size >= 2. | Ném Error('TTS busy').
  if (jobs.size >= 2) throw Error('TTS busy')
  // Khai báo task: Gọi (async () => { const folder = path.join(root, '.runtime/narrations') fs.mkdirSync(folder,.
  const task = (async () => {
    // Khai báo folder: Gọi path.join(root, '.runtime/narrations').
    const folder = path.join(root, '.runtime/narrations')
    // Thực hiện Gọi fs.mkdirSync(folder, {recursive:true}). | Gán thuộc tính recursive: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    fs.mkdirSync(folder, {recursive:true})
    // Khai báo request: Gọi path.join(folder, key + '.json').
    const request = path.join(folder, key + '.json'), output = path.join(folder, key + '.mp3')
    // Thực hiện Gọi fs.writeFileSync(request, JSON.stringify({body,language})). | Đặt trường body bằng giá trị của biến cùng tên. | Đặt trường language bằng giá trị của biến cùng tên.
    fs.writeFileSync(request, JSON.stringify({body,language}))
    // Bắt đầu vùng try.
    try {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `await new Promise((resolve,reject) => execFile(process.env.NARRATION_PYTHON || 'pytho`: Thực hiện await chờ Tạo đối tượng bằng new Promise((resolve,reject) => execFile(process.env.NARRATION_PYTHON || 'python', [path.j.
       * DÒNG `[path.join(root,'scripts/generate-narrations.py'),'--request',request,'--output',outp`: Thực hiện await chờ Tạo đối tượng bằng new Promise((resolve,reject) => execFile(process.env.NARRATION_PYTHON || 'python', [path.j.
       * DÒNG `{cwd:root,windowsHide:true,timeout:150000,env:{...process.env,PYTHONPATH:[path.join(r`: Thực hiện await chờ Tạo đối tượng bằng new Promise((resolve,reject) => execFile(process.env.NARRATION_PYTHON || 'python', [path.j. | Gán thuộc tính cwd: sử dụng root làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính windowsHide: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính timeout: giá trị số 150000. | Gán thuộc tính env: tạo object gồm ...giá trị ghép, PYTHONPATH. | Gán thuộc tính PYTHONPATH: Gọi [path.join(root,'.tools/tts-python'),process.env.PYTHONPATH].filter(Boolean).join(path.del.
       * DÒNG `error => error ? reject(error) : resolve()))`: Nhận đầu vào error từ nơi gọi hàm.
       */
      await new Promise((resolve,reject) => execFile(process.env.NARRATION_PYTHON || 'python',
        [path.join(root,'scripts/generate-narrations.py'),'--request',request,'--output',output],
        {cwd:root,windowsHide:true,timeout:150000,env:{...process.env,PYTHONPATH:[path.join(root,'.tools/tts-python'),process.env.PYTHONPATH].filter(Boolean).join(path.delimiter)}},
        error => error ? reject(error) : resolve()))
      // Rẽ nhánh nếu !audioFile(key). | Ném Error('Missing MP3').
      if (!audioFile(key)) throw Error('Missing MP3')
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `return 'narration:' + key`: Trả kết quả: tính biểu thức 'narration:' + key.
       * DÒNG `} finally { fs.rmSync(request,{force:true}) }`: Bắt đầu vùng try. | Thực hiện Gọi fs.rmSync(request,{force:true}). | Gán thuộc tính force: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
       * DÒNG `})()`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      return 'narration:' + key
    } finally { fs.rmSync(request,{force:true}) }
  })()
  // Thực hiện Gọi jobs.set(key,task).
  jobs.set(key,task)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `try { return await task } finally { jobs.delete(key) }`: Bắt đầu vùng try. | Trả kết quả: await chờ sử dụng task làm giá trị của bước hiện tại. | Thực hiện Gọi jobs.delete(key).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  try { return await task } finally { jobs.delete(key) }
}
// TẠI SAO (prepareNarration): Bản thu phải phản ánh đúng văn bản hiện tại, không dùng một MP3
// mẫu cho mọi địa điểm.
// CHỨC NĂNG: Hỗ trợ HTTP Range để tua thật trên iOS/Android/trình duyệt.
// XỬ LÝ: Không cho đường dẫn tùy ý; range sai trả 416, không đọc tệp ngoài audio.
// Khai báo sendAudio(req, res, key). Trả dữ liệu MP3 qua HTTP và xử lý Range để trình nghe có thể tua theo byte.
function sendAudio(req,res,key) {
  // Khai báo file: Gọi audioFile(key).
  const file = audioFile(key)
  // Rẽ nhánh nếu !file. | Thực hiện tính biểu thức res.statusCode=404. | Thực hiện Gọi res.end(). | Thoát hàm hiện tại ngay.
  if (!file) { res.statusCode=404; res.end(); return }
  // Khai báo size: đọc fs.statSync(file).size từ đối tượng/mảng để dùng tại bước hiện tại | Khai báo range: đọc req.headers.range từ đối tượng/mảng để dùng tại bước hiện tại.
  const size=fs.statSync(file).size,range=req.headers.range
  // Khai báo start: giá trị số 0.
  let start=0,end=size-1
  // Rẽ nhánh nếu range.
  if(range){
    // Khai báo match: Gọi /^bytes=(\d*)-(\d*)$/.exec(range).
    const match=/^bytes=(\d*)-(\d*)$/.exec(range)
    // Rẽ nhánh nếu !match||(!match[1]&&!match[2]). | Thực hiện tính biểu thức res.statusCode=416. | Đặt header phản hồi: res.setHeader('Content-Range','bytes * /'+size). | Thực hiện Gọi res.end(). | Thoát hàm hiện tại ngay.
    if(!match||(!match[1]&&!match[2])){res.statusCode=416;res.setHeader('Content-Range','bytes */'+size);res.end();return}
    // Rẽ nhánh nếu !match[1]. | Thực hiện tính biểu thức start=Math.max(0,size-Number(match[2])). | Thực hiện tính biểu thức start=Number(match[1]). | Rẽ nhánh nếu match[2]. | Thực hiện tính biểu thức end=Math.min(end,Number(match[2])).
    if(!match[1])start=Math.max(0,size-Number(match[2]));else{start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]))}
    // Rẽ nhánh nếu !Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>end||start>=size. | Thực hiện tính biểu thức res.statusCode=416. | Đặt header phản hồi: res.setHeader('Content-Range','bytes * /'+size). | Thực hiện Gọi res.end(). | Thoát hàm hiện tại ngay.
    if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>end||start>=size){res.statusCode=416;res.setHeader('Content-Range','bytes */'+size);res.end();return}
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `res.statusCode=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`)`: Thực hiện tính biểu thức res.statusCode=206. | Đặt header phản hồi: res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    res.statusCode=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`)
  }
  // Đặt header phản hồi: res.setHeader('Content-Type','audio/mpeg'). | Đặt header phản hồi: res.setHeader('Accept-Ranges','bytes').
  res.setHeader('Content-Type','audio/mpeg');res.setHeader('Accept-Ranges','bytes')
  // Đặt header phản hồi: res.setHeader('Content-Length',end-start+1). | Đặt header phản hồi: res.setHeader('Cache-Control','private, max-age=3600').
  res.setHeader('Content-Length',end-start+1);res.setHeader('Cache-Control','private, max-age=3600')
  // Khai báo stream: Gọi fs.createReadStream(file,{start,end}). | Đặt trường start bằng giá trị của biến cùng tên. | Đặt trường end bằng giá trị của biến cùng tên.
  const stream=fs.createReadStream(file,{start,end})
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe`: Đăng ký xử lý sự kiện: stream.on('error',()=>res.destroy()). | Đăng ký xử lý sự kiện: res.on('close',()=>stream.destroy()). | Thực hiện Gọi stream.pipe(res).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res)
}
// TẠI SAO (sendAudio): Trình nghe cần HTTP Range để tua; đường dẫn tệp chỉ được xác định từ khóa
// hợp lệ.
// Thực hiện tính biểu thức module.exports={prepareNarration,sendAudio}. | Đặt trường prepareNarration bằng giá trị của biến cùng tên. | Đặt trường sendAudio bằng giá trị của biến cùng tên.
module.exports={prepareNarration,sendAudio}
/* CÁCH KIỂM TRA: Bài mới sinh MP3 khác; gọi trùng không tạo lại;
 * mất mạng báo lỗi, body không bị sửa; Range trả đúng số byte. */
