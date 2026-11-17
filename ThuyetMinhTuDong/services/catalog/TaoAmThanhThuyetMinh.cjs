/**
 * FILE: services/catalog/TaoAmThanhThuyetMinh.cjs
 * FILE NÀY LÀM GÌ: Tạo hoặc lấy bản MP3 từ nội dung và ngôn ngữ đã chọn để chuẩn bị bản thu thuyết minh.
 * VAI TRÒ: Máy chủ/API; nhận yêu cầu từ Web và Mobile.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
const fs = require('node:fs')

const path = require('node:path')

const { createHash } = require('node:crypto')

const { execFile } = require('node:child_process')

const root = path.resolve(__dirname, '../..')

const jobs = new Map()
const { alias } = require('../database/LuuVaDocTepSql.cjs')
// CHỨC NĂNG: Xác định tệp MP3 của một khóa bản thu.
// XỬ LÝ: Giới hạn đường dẫn theo kho audio để không dùng chuỗi nhập làm đường dẫn tùy ý.

// [UC11] audioFile — Xác định tệp MP3 của một khóa bản thu.
function audioFile(key) {
  if (!/^[a-f0-9]{64}$/.test(key)) return undefined

  for (const folder of ['apps/web/static/narrations', '.runtime/narrations']) {
    const file = path.join(root, folder, key + '.mp3')

    if (fs.existsSync(file) && fs.statSync(file).size > 0) return file
  }
}
// TẠI SAO (audioFile): Không dùng thẳng dữ liệu người gửi thành đường dẫn để tránh truy cập tệp
// ngoài kho audio.
// CHỨC NĂNG: Chuẩn bị MP3 từ đúng bài và ngôn ngữ.
// XỬ LÝ: Dùng khóa nội dung để tái sử dụng bản khớp và tránh dùng âm thanh mẫu cho bài mới.

// [UC11] prepareNarration — Chuẩn bị bản MP3 theo văn bản và ngôn ngữ, tái sử dụng kết quả phù hợp khi có.
async function prepareNarration(body, language) {
  if (!['vi', 'en', 'cn', 'pt', 'ja'].includes(language) || !body.trim() || body.length > 20000)
    throw Error('Invalid narration')

  const key = createHash('sha256')
    .update('gtts-v1|' + language + '|' + body)
    .digest('hex')

  // Nếu đã có byte trong SQL, tạo lại tham chiếu mà không gọi TTS/mở file cũ.
  if (await alias('narration:' + key)) return 'narration:' + key
  if (audioFile(key)) return 'narration:' + key

  if (jobs.has(key)) return jobs.get(key)
  // CHỨC NĂNG: Giới hạn hai bài mới cùng lúc; gom yêu cầu trùng văn bản.
  // XỬ LÝ: Tệp request chỉ chứa bài công khai do Admin soạn; không truyền qua shell.

  if (jobs.size >= 2) throw Error('TTS busy')

  const task = (async () => {
    const folder = path.join(root, '.runtime/narrations')

    fs.mkdirSync(folder, { recursive: true })

    const request = path.join(folder, key + '.json'),
      output = path.join(folder, key + '.mp3')

    fs.writeFileSync(request, JSON.stringify({ body, language }))

    try {
      await new Promise((resolve, reject) =>
        execFile(
          process.env.NARRATION_PYTHON || 'python',
          [
            path.join(root, 'scripts/TaoCacBanThuyetMinh.py'),
            '--request',
            request,
            '--output',
            output,
          ],
          {
            cwd: root,
            windowsHide: true,
            timeout: 150000,
            env: {
              ...process.env,
              PYTHONPATH: [path.join(root, '.tools/tts-python'), process.env.PYTHONPATH]
                .filter(Boolean)
                .join(path.delimiter),
            },
          },
          (error) => (error ? reject(error) : resolve()),
        ),
      )

      if (!audioFile(key)) throw Error('Missing MP3')

      return 'narration:' + key
    } finally {
      fs.rmSync(request, { force: true })
    }
  })()

  jobs.set(key, task)

  try {
    return await task
  } finally {
    jobs.delete(key)
  }
}
// TẠI SAO (prepareNarration): Bản thu phải phản ánh đúng văn bản hiện tại, không dùng một MP3
// mẫu cho mọi địa điểm.
module.exports = { prepareNarration }
