/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: API PHÍA MÁY CHỦ
 *
 * FILE NÀY LÀM GÌ:
 * HTTP API cổng 8788: chia sẻ nội dung admin, danh mục công bố, audio, phiên bản và lượt mở
 *
 * VỊ TRÍ: services/catalog/MayChuApi.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/catalog/KiemThuApiDiTich.test.cjs
 * - services/database/KiemThuTepTaiNguyen.test.cjs
 *
 * PHỤ THUỘC:
 * - node:http
 * - node:path
 * - node:fs
 * - node:module
 * - node:crypto
 * - ./TaoAmThanhThuyetMinh.cjs
 * - ./TuDongDich.cjs
 * - ./KiemTraLenhQuanTri.cjs
 * - ./XuLyTepTaiNguyen.cjs
 * - ../database/LuuVaDocTepSql.cjs
 * - ../database/KhoDuLieuSql.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. loadCore
 * 2. createCatalogServer
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
const http = require('node:http')

const path = require('node:path')

const fs = require('node:fs')

const { createRequire } = require('node:module')

const { randomUUID } = require('node:crypto')

const { prepareNarration } = require('./TaoAmThanhThuyetMinh.cjs')
const { translateText } = require('./TuDongDich.cjs')
const { validateCommand: valid, isString: str } = require('./KiemTraLenhQuanTri.cjs')
const { sendMedia } = require('./XuLyTepTaiNguyen.cjs')
const mediaStore = require('../database/LuuVaDocTepSql.cjs')
// Kết nối kho SQL dùng chung; không tạo Map/Set lưu nghiệp vụ trong tiến trình API.
const { createSqlRepository } = require('../database/KhoDuLieuSql.cjs')

const root = path.resolve(__dirname, '../..')
// CHỨC NĂNG: Chạy đúng logic TypeScript đang dùng ở FE, tránh chép đôi workflow.

// ==================== [DUNG-CHUNG] loadCore ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
function loadCore() {
  const runtime = path.join(root, '.runtime')
  fs.mkdirSync(runtime, { recursive: true })
  const req = createRequire(path.join(root, 'apps/web/package.json'))
  req('esbuild').buildSync({
    entryPoints: [path.join(root, 'packages/admin-core/src/XuatCongKhai.ts')],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: path.join(runtime, 'admin-core.cjs'),
  })
  return require(path.join(runtime, 'admin-core.cjs'))
}
// TẠI SAO (loadCore): Dùng lại cùng nghiệp vụ admin-core tránh có hai quy trình quản trị lệch
// nhau giữa API và FE.
// CHỨC NĂNG: Tạo API nội dung dùng chung giữa web và mobile.
// XỬ LÝ: Tạo service cho từng transaction; lệnh sửa phải qua kiểm tra đầu vào và
// revision.

// ==================== [DUNG-CHUNG] createCatalogServer ====================
function createCatalogServer({
  now = Date.now,
  origins = [
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://127.0.0.1:5174',
    'http://localhost:5174',
  ],
  core = loadCore(),
  prepareAudio = prepareNarration,
  translator = translateText,
  initialDocument = null,
  initialGate = null,
  scope = 'main',
  repository = createSqlRepository({ now, scope }),
} = {}) {
  // CHỨC NĂNG: Mỗi request đọc SQL trong transaction; cache tạm chỉ sống trong request.
  // TẠI SAO: Dùng lại nghiệp vụ duyệt/công bố nhưng không giữ dữ liệu chính trong RAM.
  const instance = randomUUID()
  // CHỨC NĂNG: Tách request chỉ đọc khỏi lệnh ghi, giữ khởi tạo seed trong khóa ghi.
  async function run(
    action,
    translateOverride = translator,
    audioOverride = prepareAudio,
    readOnly = false,
  ) {
    let needsInitialization = false
    const value = await repository[readOnly ? 'catalogRead' : 'catalog'](async (storage) => {
      let service = core.createAdminService(storage, audioOverride, translateOverride)
      if ((await storage.read()) === null) {
        if (readOnly) {
          needsInitialization = true
          return
        }
        await storage.write(JSON.stringify(initialDocument ?? (await service.load())))
        service = core.createAdminService(storage, audioOverride, translateOverride)
      }
      return action(service, storage)
    })
    // Không nâng Shared thành Exclusive trong cùng transaction: tránh deadlock khi hai client mở lần đầu.
    if (needsInitialization) {
      await run(async () => {})
      return run(action, translateOverride, audioOverride, true)
    }
    return value
  }
  // Chỉ nhập số tổng từ phiên cũ một lần; SQL vẫn giữ lịch sử các ngày trước.
  let imported = false
  async function importGate() {
    if (!imported && initialGate) {
      await repository.importGate(initialGate)
      imported = true
    }
  }

  // CHỨC NĂNG: Đọc body JSON của lệnh quản trị.
  // XỬ LÝ: Kiểm tra Content-Type và kích thước để body sai/quá lớn không làm đầy bộ nhớ.

  async function json(req) {
    if (!String(req.headers['content-type'] || '').startsWith('application/json'))
      throw Error('invalid')
    const chunks = []
    let size = 0
    for await (const chunk of req) {
      size += chunk.length
      if (size > 8 * 1024 * 1024) throw Error('invalid')
      chunks.push(chunk)
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  }
  // TẠI SAO (json): Body quá lớn hoặc sai Content-Type cần bị chặn trước khi xử lý để tránh dùng
  // RAM vô hạn.

  const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('X-Content-Type-Options', 'nosniff')

    const reply = (status, value) => {
      res.statusCode = status
      res.end(JSON.stringify(value))
    }
    // TẠI SAO (reply): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho SQL được giữ tại
    // lớp kết nối này.

    const origin = req.headers.origin

    if (origin && !origins.includes(origin)) return reply(403, { error: 'invalid' })

    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Vary', 'Origin')
    }

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range')
      res.statusCode = 204
      return res.end()
    }

    const pathname = (req.url || '').split('?')[0]

    try {
      if (req.method === 'GET' || req.method === 'HEAD') {
        // Ảnh và âm thanh đều đọc byte từ SQL; preview/công bố được kiểm tra riêng.
        const media = /^\/media\/(published|preview)\/([a-f0-9]{64})$/.exec(pathname)
        const audio = /^\/audio\/(published|preview)\/([a-f0-9]{64})\.mp3$/.exec(pathname)
        const photo = /^\/images\/(published|preview)\/([a-z0-9-]+)\.jpg$/.exec(pathname)
        if (media || audio || photo) {
          const match = media || audio || photo
          const id = media
            ? media[2]
            : await mediaStore.alias((audio ? 'narration:' : 'photo:') + match[2], scope)
          await sendMedia(req, res, { id, scope, preview: match[1] === 'preview' })
          return
        }
        // CHỨC NĂNG: Admin mobile đọc cùng thống kê SQL 8787 qua cổng LAN 8788.
        // XỬ LÝ: Chỉ chuyển tiếp GET thống kê; không nhân đôi kho phiên đang hoạt động.

        if (pathname === '/presence/statistics/active') {
          const response = await fetch(
            (process.env.PRESENCE_TARGET || 'http://127.0.0.1:8787') + '/statistics/active',
            { signal: AbortSignal.timeout(5000) },
          )

          if (!response.ok) return reply(503, { error: 'loadError' })

          return reply(200, await response.json())
        }

        if (pathname === '/version')
          return reply(200, {
            version: instance + ':' + (await repository.version()),
            storage: 'sqlserver',
          })

        if (pathname === '/document')
          return reply(200, await run((service) => service.load(), translator, prepareAudio, true))

        if (pathname === '/identity')
          return reply(
            200,
            await core
              .createAdminService({
                read: async () => null,
                write: async () => {
                  throw Error('read_only_identity')
                },
              })
              .identity(),
          )

        if (pathname === '/published')
          return reply(
            200,
            await run((service) => service.published(), translator, prepareAudio, true),
          )

        if (pathname === '/gate/statistics') {
          await importGate()
          return reply(200, await repository.gateStatistics())
        }
      }

      if (req.method === 'POST' && pathname === '/commands') {
        const body = await json(req)

        if (!body || !valid(body.action, body.args)) return reply(400, { error: 'invalid' })
        // CHỨC NĂNG: Chờ dịch/TTS ở ngoài transaction SQL để trang du khách vẫn tải được.
        // XỬ LÝ: Đọc revision trước, chuẩn bị tài nguyên, rồi kiểm tra revision lại khi ghi.
        // TẠI SAO: Không giữ khóa SQL suốt thời gian chờ dịch vụ ngoài mạng.
        if (['translate', 'generateAudio'].includes(body.action)) {
          const [id, language, revision] = body.args
          const place = (
            await run((service) => service.load(), translator, prepareAudio, true)
          ).places.find((p) => p.id === id)
          if (!place) throw new core.AdminError('notFound')
          if (place.revision !== revision) throw new core.AdminError('conflict')
          if (place.workflow === 'archived') throw new core.AdminError('invalid')
          if (body.action === 'translate') {
            const source = place.record.content.vi
            if (language === 'vi' || !source?.body.trim()) throw new core.AdminError('invalid')
            const translated = new Map()
            try {
              for (const key of ['title', 'summary', 'address', 'body']) {
                const text = source[key]
                if (text.trim() && !translated.has(text))
                  translated.set(
                    text,
                    await translator(text, language, undefined, { title: source.title }),
                  )
              }
            } catch {
              throw new core.AdminError('translationError')
            }
            await run(
              (service) => service.translate(id, language, revision),
              async (text) => {
                if (!translated.has(text)) throw new core.AdminError('conflict')
                return translated.get(text)
              },
            )
          } else {
            const source = place.record.content[language]
            if (!source?.body.trim()) throw new core.AdminError('incomplete')
            let audio
            try {
              audio = await prepareAudio(source.body, language)
            } catch {
              throw new core.AdminError('saveError')
            }
            await run(
              (service) => service.generateAudio(id, language, revision),
              translator,
              async () => audio,
            )
          }
          return reply(200, { ok: true })
        }
        // CHỨC NĂNG: Trả mã DT do SQL sinh ngay trong transaction lưu bản nháp.
        // TẠI SAO: FE dùng đúng mã này cho dịch/audio/lưu tiếp, tránh tạo trùng khi thử lại.
        if (body.action === 'savePlace') {
          const id = await run(async (service, storage) => {
            const temporaryId = await service.savePlace(body.args[0])
            const position = (await service.load()).places.findIndex(
              (place) => place.id === temporaryId,
            )
            const stored = JSON.parse(await storage.read())
            return stored.places[position].id
          })
          return reply(200, { ok: true, id })
        }
        await run((service) => service[body.action](...body.args))
        return reply(200, { ok: true })
      }

      if (req.method === 'POST' && pathname === '/gate/entry') {
        const body = await json(req)

        if (
          !body ||
          !str(body.visitId) ||
          !/^[-_a-zA-Z0-9]{20,100}$/.test(body.visitId) ||
          !['web', 'mobile-app'].includes(body.platform)
        )
          return reply(400, { error: 'invalid' })
        // Khóa ghép SQL (ngày, mã lượt) chặn đếm lại sau restart hoặc request đồng thời.
        await importGate()
        await repository.gateEntry(body.visitId, body.platform)
        return reply(200, { ok: true })
      }

      reply(404, { error: 'notFound' })
    } catch (error) {
      const code =
        error instanceof core.AdminError
          ? error.code
          : error instanceof SyntaxError || error.message === 'invalid'
            ? 'invalid'
            : error.message === 'capacity'
              ? 'saveError'
              : 'loadError'
      reply(
        code === 'conflict'
          ? 409
          : code === 'notFound'
            ? 404
            : ['saveError', 'loadError'].includes(code)
              ? 503
              : 400,
        { error: code },
      )
    }
  })

  server.requestTimeout = 15000
  server.headersTimeout = 15000

  return server
}
// TẠI SAO (createCatalogServer): Web và mobile phải sửa/đọc cùng tài liệu; tạo kho riêng cho mỗi
// giao diện sẽ mất đồng bộ.

if (require.main === module) {
  const server = createCatalogServer({
    initialDocument: process.env.CATALOG_IMPORT_DOCUMENT
      ? JSON.parse(fs.readFileSync(process.env.CATALOG_IMPORT_DOCUMENT, 'utf8'))
      : null,
    initialGate: process.env.CATALOG_IMPORT_GATE
      ? JSON.parse(fs.readFileSync(process.env.CATALOG_IMPORT_GATE, 'utf8'))
      : null,
    origins: (
      process.env.CATALOG_ORIGINS ||
      'http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:5174,http://localhost:5174'
    ).split(','),
  })
  const host = process.env.CATALOG_HOST || '127.0.0.1',
    port = Number(process.env.CATALOG_PORT || 8788)
  server.listen(port, host, () => console.log(`Catalog SQL Server: http://${host}:${port}`))
  server.on('error', (error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}

module.exports = { createCatalogServer }
/* CÁCH KIỂM TRA: Hai HTTP client sửa cùng revision chỉ một thành công; public không lộ nháp; refresh QR không tăng lượt; restart vẫn giữ dữ liệu trong SQL Server. */
