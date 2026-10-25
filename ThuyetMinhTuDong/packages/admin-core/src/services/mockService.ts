/**
 * FILE NÀY LÀM GÌ: Nghiệp vụ Admin mô phỏng qua StoragePort và kiểm tra phiên bản.
 * Mock API RAM tạo một instance chung; test truyền kho giả qua StoragePort.
 * UC12–UC17: dịch còn mô phỏng; TTS lấy MP3 thật qua adapter server.
 */
import { MOCK_PLACES, LANGUAGES, bundledNarration } from '@travelguide/visitor-core'
import type { Language, PlaceRecord, PublishedText } from '@travelguide/visitor-core'
import type { AdminService, StoragePort } from '../domain/contracts'
import type { AdminDocument, ManagedPlace, ContentInput } from '../domain/models'
import { AdminError } from '../domain/models'
import { mediaUrl, readyForReview, validatePlace } from '../domain/validation'
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const stamp = () => new Date().toISOString()
const seed = (): AdminDocument => ({ schema: 1, sessions: [], audit: [], places: MOCK_PLACES.map(record => ({
  id: record.id, record: clone(record), period: record.period ?? '', revision: 1, workflow: 'published', reviewNote: '',
  approvedRevision: 1, published: clone(record), updatedAt: stamp(),
})) })
function readDocument(raw: string): AdminDocument {
  // CHỨC NĂNG: Kiểm tra dữ liệu cục bộ trước khi coi là AdminDocument.
  // XỬ LÝ: JSON hỏng/khác schema không ghi đè bằng seed; người dùng có thể đặt lại demo.
  const x: unknown = JSON.parse(raw)
  if (!x || typeof x !== 'object' || !('schema' in x) || x.schema !== 1 || !('places' in x) || !Array.isArray(x.places)
    || !('sessions' in x) || !Array.isArray(x.sessions) || !('audit' in x) || !Array.isArray(x.audit)) throw new AdminError('loadError')
  for (const p of x.places) {
    if (!p || typeof p !== 'object' || typeof p.id !== 'string' || !Number.isInteger(p.revision) || p.revision < 1
      || !['draft','submitted','changes','approved','published','archived'].includes(p.workflow)
      || !p.record || !Array.isArray(p.record.images) || !p.record.content || typeof p.period !== 'string') throw new AdminError('loadError')
  }
  return x as AdminDocument
}
// CHỨC NĂNG: Nhận bộ tạo MP3 từ server; logic FE không giữ khóa dịch vụ TTS.
// XỬ LÝ: Test/offline dùng bài đã đóng gói; bài mới cần adapter tạo giọng thật.
export function createMockAdminService(storage: StoragePort,
  prepareAudio?: (body: string, language: Language) => Promise<string>,
): AdminService {
  let cached: AdminDocument | undefined
  let loading: Promise<AdminDocument> | undefined
  let queue: Promise<void> = Promise.resolve()
  const listeners = new Set<() => void>()
  const notify = () => listeners.forEach(listener => listener())
  async function load(): Promise<AdminDocument> {
    if (!cached) {
      loading ??= storage.read().then(raw => { cached = raw ? readDocument(raw) : seed(); return cached })
        .catch(() => { throw new AdminError('loadError') }).finally(() => { loading = undefined })
      await loading
    }
    return clone(cached!)
  }
  // CHỨC NĂNG: Ghi nối tiếp; chỉ thay cache và thông báo sau khi ghi thành công.
  // XỬ LÝ: Lỗi lưu giữ bản công khai cũ, không giả hiển thị đã lưu. BE sau này
  // phải làm giao dịch và kiểm tra revision tương tự trên máy chủ.
  function mutate(action: (doc: AdminDocument) => void): Promise<void> {
    const task = queue.then(async () => {
      const next = await load(); action(next)
      try { await storage.write(JSON.stringify(next)) } catch { throw new AdminError('saveError') }
      cached = next; notify()
    })
    queue = task.catch(() => {})
    return task
  }
  function item(doc: AdminDocument, id: string, revision: number) {
    const place = doc.places.find(p => p.id === id)
    if (!place) throw new AdminError('notFound')
    if (place.revision !== revision) throw new AdminError('conflict')
    if (place.workflow === 'archived') throw new AdminError('invalid')
    return place
  }
  function touch(place: ManagedPlace) {
    place.revision++; place.workflow = 'draft'; place.approvedRevision = undefined
    place.reviewNote = ''; place.updatedAt = stamp()
  }
  const log = (doc: AdminDocument, place: ManagedPlace, action: string) => {
    doc.audit.unshift({ at: stamp(), action, placeId: place.id, revision: place.revision }); doc.audit = doc.audit.slice(0, 100)
  }
  function replaceText(place: ManagedPlace, language: Language, text: PublishedText) {
    place.record.content[language] = { ...text, status: 'draft', approvedAt: undefined, publishedAt: undefined }
    touch(place)
  }
  const service: AdminService = {
    identity: async () => ({ id: 'provided-demo-manager', displayName: 'HueGuide', mode: 'demo', permissions: ['manage-content','review','publish'] }),
    load, subscribe: listener => { listeners.add(listener); return () => { listeners.delete(listener) } },
    savePlace: input => mutate(doc => {
      validatePlace(input)
      let place: ManagedPlace
      if (input.id) place = item(doc, input.id, input.expectedRevision ?? -1)
      else {
        const id = 'place-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,7)
        place = { id, period: '', revision: 0, workflow: 'draft', reviewNote: '', updatedAt: stamp(),
          record: { id, canonicalTitle: input.title, scope: 'hue-citadel', inLaunchCatalog: true,
            status: 'draft', zone: 'ceremonial', images: [], content: {} } }
        doc.places.push(place)
      }
      place.period = input.period.trim(); place.record.period = place.period; place.record.canonicalTitle = input.title.trim()
      const source = place.record.content.vi
      place.record.content.vi = { title: input.title.trim(), summary: '', address: '', body: '', version: place.revision + 1,
        status: 'draft', ...source, ...(source ? { title: input.title.trim(), version: place.revision + 1 } : {}) }
      place.record.category = input.category; place.record.images = [...input.images]
      place.record.position = input.lat.trim() ? { lat: Number(input.lat), lng: Number(input.lng), verified: input.verified } : undefined
      touch(place); log(doc, place, 'savePlace')
    }),
    saveContent: (input: ContentInput) => mutate(doc => {
      const place = item(doc, input.id, input.expectedRevision)
      if (!input.title.trim() || !input.body.trim() || (input.audioUrl && !mediaUrl(input.audioUrl))) throw new AdminError('invalid')
      const old = place.record.content[input.language]
      // CHỨC NĂNG: Sửa văn bản làm audio cũ không còn khớp; phải chuẩn bị audio lại.
      const sameBody = old?.body === input.body.trim()
      const audio = input.audioUrl ? { id: 'recording-' + place.id + '-' + input.language + '-' + (place.revision + 1),
        url: input.audioUrl, version: place.revision + 1, status: 'draft' as const } : sameBody ? old?.audio : undefined
      replaceText(place, input.language, { title: input.title.trim(), summary: input.summary.trim(), address: input.address.trim(),
        body: input.body.trim(), version: place.revision + 1, status: 'draft', audio,
        sources: sameBody ? old?.sources : undefined, adaptation: sameBody ? old?.adaptation : undefined })
      log(doc, place, 'saveContent')
    }),
    translate: async (id, language, revision) => {
      // CHỨC NĂNG: Mô phỏng tác vụ bất đồng bộ; không giả là bản dịch thật.
      // XỬ LÝ: So revision lần nữa khi kết quả về, ngăn ghi đè nội dung mới.
      await new Promise(resolve => setTimeout(resolve, 400))
      return mutate(doc => {
        const place = item(doc, id, revision), source = place.record.content.vi
        if (!source?.body.trim() || language === 'vi') throw new AdminError('invalid')
        const name = LANGUAGES.find(l => l.code === language)?.label ?? language
        replaceText(place, language, { ...source, title: place.record.content[language]?.title ?? source.title,
          body: '[DEMO ' + name + '] ' + source.body, audio: undefined, version: revision + 1 })
        log(doc, place, 'translate')
      })
    },
    generateAudio: async (id, language, revision) => {
      // CHỨC NĂNG: Tạo giọng từ đúng body đã lưu, không gắn MP3 mẫu vào bài khác.
      // XỬ LÝ: Kiểm tra revision trước/sau tác vụ mạng; không khóa hàng đợi ghi
      // trong lúc chờ TTS. Bài bị sửa trong lúc tạo sẽ báo conflict.
      const before = await load(), place = item(before, id, revision)
      const text = place.record.content[language]
      if (!text?.body.trim()) throw new AdminError('incomplete')
      const bundled = bundledNarration(id, language, text.body)
      let url: string
      try {
        if (bundled) url = await Promise.resolve(bundled)
        else if (prepareAudio) url = await prepareAudio(text.body, language)
        else throw new AdminError('incomplete')
      } catch (error) { throw error instanceof AdminError ? error : new AdminError('saveError') }
      return mutate(doc => {
        const current = item(doc, id, revision), latest = current.record.content[language]
        if (!latest || latest.body !== text.body) throw new AdminError('conflict')
        replaceText(current, language, { ...latest, audio: { id: url,
          url, version: revision + 1, status: 'draft' } })
        log(doc, current, 'generateAudio')
      })
    },
    submit: (id, revision) => mutate(doc => {
      const place = item(doc, id, revision); readyForReview(place)
      if (!['draft','changes'].includes(place.workflow)) throw new AdminError('invalid')
      place.workflow = 'submitted'; log(doc, place, 'submit')
    }),
    review: (id, revision, approved, note) => mutate(doc => {
      const place = item(doc, id, revision)
      if (place.workflow !== 'submitted' || (!approved && !note.trim())) throw new AdminError('invalid')
      if (approved) readyForReview(place)
      place.workflow = approved ? 'approved' : 'changes'; place.reviewNote = note.trim()
      place.approvedRevision = approved ? revision : undefined; log(doc, place, approved ? 'approve' : 'requestChanges')
    }),
    publish: (id, revision) => mutate(doc => {
      const place = item(doc, id, revision)
      if (place.workflow !== 'approved' || place.approvedRevision !== revision) throw new AdminError('notApproved')
      readyForReview(place)
      const record = clone(place.record), now = stamp()
      record.status = 'published'
      for (const { code } of LANGUAGES) {
        const text = record.content[code]
        if (!text) continue
        text.status = 'published'; text.approvedAt = now; text.publishedAt = now
        if (text.audio) { text.audio.status = 'published'; text.audio.approvedAt = now; text.audio.publishedAt = now }
      }
      place.published = record; place.workflow = 'published'; log(doc, place, 'publish')
    }),
    archive: (id, revision) => mutate(doc => {
      const place = item(doc, id, revision); place.workflow = 'archived'; place.published = undefined; log(doc, place, 'archive')
    }),
    // CHỨC NĂNG: Xóa hẳn một di tích khỏi bản nháp và danh mục công khai cục bộ.
    // XỬ LÝ: Cho xóa cả điểm đã lưu trữ; kiểm tra ID/revision trước khi ghi.
    // Chỉ sửa document này, không xóa ảnh asset dùng chung hay các điểm khác.
    // mutate giữ nguyên dữ liệu nếu ghi storage thất bại; UI phải hỏi xác nhận.
    deletePlace: (id, revision) => mutate(doc => {
      const place = doc.places.find(p => p.id === id)
      if (!place) throw new AdminError('notFound')
      if (place.revision !== revision) throw new AdminError('conflict')
      log(doc, place, 'deletePlace')
      doc.places = doc.places.filter(p => p.id !== id)
    }),
    simulate: (platform, playing = false) => mutate(doc => {
      const now = Date.now(); doc.sessions.push({ id: 'demo-' + now + '-' + Math.random().toString(36).slice(2,6), platform,
        lastSeen: now, startedAt: now, playing })
    }),
    endSessions: () => mutate(doc => { doc.sessions.forEach(s => { s.lastSeen = 0; s.playing = false }) }),
    reset: () => {
      // CHỨC NĂNG: Khôi phục cả khi JSON hiện tại hỏng, không gọi load dữ liệu lỗi.
      const task = queue.then(async () => {
        const next = seed()
        try { await storage.write(JSON.stringify(next)) } catch { throw new AdminError('saveError') }
        cached = next; notify()
      })
      queue = task.catch(() => {}); return task
    },
    published: async (): Promise<PlaceRecord[]> => (await load()).places.flatMap(p => p.workflow !== 'archived' && p.published ? [p.published] : []),
  }
  return service
}
/* CÁCH KIỂM TRA: Lưu nháp không đổi published; sửa sau duyệt chặn publish;
 * hai lệnh cùng revision chỉ lệnh đầu thành công; storage.write lỗi không đổi cache. */
