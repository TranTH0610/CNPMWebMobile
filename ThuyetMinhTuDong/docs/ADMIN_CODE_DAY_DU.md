# Toàn bộ code Admin FE để copy theo thứ tự

Đọc ADMIN_UC12_UC17.md trước. Mỗi mục bên dưới là file đầy đủ; TẠO MỚI hoặc SỬA được ghi rõ. Không copy đè file khác phiên bản nếu bạn đã sửa riêng. Không có dấu ... thay code. JSON không thêm comment vì sẽ sai cú pháp.

## 1. TẠO MỚI — packages/admin-core/package.json

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\package.json

```json
{
  "name": "@travelguide/admin-core",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./react": "./src/react.tsx"
  },
  "dependencies": {
    "@travelguide/visitor-core": "*"
  },
  "peerDependencies": {
    "react": "^18.2.0 || ^19.0.0"
  },
  "scripts": {
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "lint": "eslint src --ext .ts,.tsx",
    "test": "node ../../scripts/build-admin-tests.cjs && node --test tests/admin.test.cjs"
  }
}
```

## 2. TẠO MỚI — packages/admin-core/tsconfig.json

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "skipLibCheck": true,
    "lib": [
      "ES2020",
      "DOM"
    ],
    "noEmit": true
  },
  "include": [
    "src"
  ]
}
```

## 3. TẠO MỚI — packages/admin-core/tsconfig.test.json

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\tsconfig.test.json

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "skipLibCheck": true,
    "outDir": ".test-build",
    "types": []
  },
  "include": [
    "src/models.ts",
    "src/contracts.ts",
    "src/mockService.ts",
    "src/validation.ts"
  ]
}
```

## 4. TẠO MỚI — packages/admin-core/src/models.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\src\models.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Kiểu dữ liệu Admin UC12–UC17 và danh tính được cấp sẵn.
 * Service, hooks, web/mobile dùng; phụ thuộc kiểu visitor-core, không có UI.
 * Bản đang sửa và bản công khai tách nhau để lưu nháp không ảnh hưởng khách.
 */
import type { PlaceRecord, Language, Category, PublishedText } from '@travelguide/visitor-core'
export type Workflow = 'draft' | 'submitted' | 'changes' | 'approved' | 'published' | 'archived'
export type AdminIdentity = { id: string; displayName: string; mode: 'demo' | 'api'; permissions: readonly ['manage-content', 'review', 'publish'] }
export type ManagedPlace = { id: string; record: PlaceRecord; period: string; revision: number; workflow: Workflow; reviewNote: string; approvedRevision?: number; published?: PlaceRecord; updatedAt: string }
export type PlaceInput = { id?: string; expectedRevision?: number; title: string; category: Category; period: string; lat: string; lng: string; verified: boolean; images: string[] }
export type ContentInput = { id: string; language: Language; expectedRevision: number; title: string; summary: string; address: string; body: string; audioUrl?: string }
export type DemoSession = { id: string; platform: 'web' | 'mobile-app'; lastSeen: number; startedAt: number; playing: boolean }
export type AdminDocument = { schema: 1; places: ManagedPlace[]; sessions: DemoSession[]; audit: { at: string; action: string; placeId: string; revision: number }[] }
export type Dashboard = { active: number; web: number; mobile: number; listening: number; gateToday: number; places: number; pending: number; published: number }
export type AdminErrorCode = 'loadError' | 'saveError' | 'invalid' | 'conflict' | 'notFound' | 'notApproved' | 'incomplete' | 'staleJob'
export class AdminError extends Error { constructor(public readonly code: AdminErrorCode) { super(code); this.name = 'AdminError' } }
export type PreparedText = PublishedText
/* CÁCH KIỂM TRA: TypeScript phải chặn workflow/ngôn ngữ lạ; published và record là hai bản riêng. */
```

## 5. TẠO MỚI — packages/admin-core/src/contracts.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\src\contracts.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Hợp đồng service để sau thay mock bằng API mà giữ UI.
 * MockService, AdminProvider và HTTP adapter tương lai dùng. UC12–UC17.
 * UI không gọi localStorage/AsyncStorage/fetch; chỉ gọi hợp đồng này.
 */
import type { Language, PlaceRecord } from '@travelguide/visitor-core'
import type { AdminDocument, AdminIdentity, PlaceInput, ContentInput } from './models'
export interface StoragePort { read(): Promise<string | null>; write(value: string): Promise<void> }
export interface AdminService {
  identity(): Promise<AdminIdentity>
  load(): Promise<AdminDocument>
  savePlace(input: PlaceInput): Promise<void>
  saveContent(input: ContentInput): Promise<void>
  translate(id: string, language: Language, expectedRevision: number): Promise<void>
  generateAudio(id: string, language: Language, expectedRevision: number): Promise<void>
  submit(id: string, revision: number): Promise<void>
  review(id: string, revision: number, approved: boolean, note: string): Promise<void>
  publish(id: string, revision: number): Promise<void>
  archive(id: string, revision: number): Promise<void>
  deletePlace(id: string, revision: number): Promise<void>
  simulate(platform: 'web' | 'mobile-app', playing?: boolean): Promise<void>
  endSessions(): Promise<void>
  reset(): Promise<void>
  published(): Promise<PlaceRecord[]>
  subscribe(listener: () => void): () => void
}
/* CÁCH KIỂM TRA: HTTP adapter phải thực hiện cùng interface; màn hình không thay đổi khi đổi nguồn. */
```

## 6. TẠO MỚI — packages/admin-core/src/validation.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\src\validation.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Kiểm tra biểu mẫu và tính thống kê phiên mô phỏng.
 * Service và Dashboard dùng; hàm thuần dễ kiểm thử. UC13–UC17.
 */
import { LANGUAGES } from '@travelguide/visitor-core'
import type { ManagedPlace, PlaceInput, AdminDocument, Dashboard } from './models'
import { AdminError } from './models'
// CHỨC NĂNG: Không nhận URL javascript/data hoặc tọa độ rỗng một nửa.
// XỬ LÝ: Cho asset photo:ID đã đóng gói; URL API chỉ HTTP(S), loại khoảng trắng.
export function mediaUrl(value: string, photo = false): boolean {
  // CHỨC NĂNG: Tệp demo base64 chỉ nhận MIME ảnh/audio an toàn, giới hạn 1 MB gốc.
  const local = photo ? /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/ : /^data:audio\/(?:mpeg|mp3|wav|ogg);base64,[A-Za-z0-9+/]+={0,2}$/
  if (value.startsWith('data:')) return value.length <= 1450000 && local.test(value)
  if (photo && /^photo:[a-z0-9-]+$/.test(value)) return true
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password } catch { return false }
}
export function validatePlace(input: PlaceInput) {
  if (!input.title.trim() || input.images.some(url => !mediaUrl(url, true))) throw new AdminError('invalid')
  if (Boolean(input.lat.trim()) !== Boolean(input.lng.trim())) throw new AdminError('invalid')
  if (!input.lat.trim()) { if (input.verified) throw new AdminError('invalid'); return }
  const lat = Number(input.lat), lng = Number(input.lng)
  // CHỨC NĂNG: Hàng rào demo rộng quanh Huế, không coi đây là ranh khảo sát chính thức.
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < 16.3 || lat > 16.7 || lng < 107.4 || lng > 107.8) throw new AdminError('invalid')
}
export function readyForReview(place: ManagedPlace) {
  const vi = place.record.content.vi
  if (!vi?.title.trim() || !vi.body.trim() || !place.record.images.length) throw new AdminError('incomplete')
  for (const { code } of LANGUAGES) {
    const text = place.record.content[code]
    if (text && (!text.title.trim() || !text.body.trim() || !text.audio)) throw new AdminError('incomplete')
  }
}
// CHỨC NĂNG: Số liệu là phiên, không phải số người/vé; 90 giây là giả định demo.
// XỬ LÝ: Dùng ngày lịch địa phương, không dùng toISOString cắt ngày UTC gây lệch múi giờ.
export function dashboard(doc: AdminDocument, now = Date.now()): Dashboard {
  const live = doc.sessions.filter(item => now - item.lastSeen <= 90000 && now >= item.lastSeen)
  return { active: live.length, web: live.filter(s => s.platform === 'web').length,
    mobile: live.filter(s => s.platform === 'mobile-app').length, listening: live.filter(s => s.playing).length,
    gateToday: doc.sessions.filter(s => new Date(s.startedAt).toDateString() === new Date(now).toDateString()).length,
    places: doc.places.filter(p => p.workflow !== 'archived').length,
    pending: doc.places.filter(p => p.workflow === 'submitted').length,
    published: doc.places.filter(p => Boolean(p.published) && p.workflow !== 'archived').length }
}
/* CÁCH KIỂM TRA: Tọa độ sai/ảnh javascript bị từ chối; phiên quá 90 giây không tính active. */
```

## 7. TẠO MỚI — packages/admin-core/src/mockService.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\src\mockService.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Nghiệp vụ Admin mô phỏng qua StoragePort và kiểm tra phiên bản.
 * Mock API RAM tạo một instance chung; test truyền kho giả qua StoragePort.
 * UC12–UC17: dịch/TTS vẫn mô phỏng; đồng bộ do HTTP adapter và server thực hiện.
 */
import { MOCK_PLACES, LANGUAGES } from '@travelguide/visitor-core'
import type { Language, PlaceRecord, PublishedText } from '@travelguide/visitor-core'
import type { AdminService, StoragePort } from './contracts'
import type { AdminDocument, ManagedPlace, ContentInput } from './models'
import { AdminError } from './models'
import { mediaUrl, readyForReview, validatePlace } from './validation'
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const stamp = () => new Date().toISOString()
const seed = (): AdminDocument => ({ schema: 1, sessions: [], audit: [], places: MOCK_PLACES.map(record => ({
  id: record.id, record: clone(record), period: '', revision: 1, workflow: 'published', reviewNote: '',
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
export function createMockAdminService(storage: StoragePort): AdminService {
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
        body: input.body.trim(), version: place.revision + 1, status: 'draft', audio })
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
      await new Promise(resolve => setTimeout(resolve, 400))
      return mutate(doc => {
        const place = item(doc, id, revision), text = place.record.content[language]
        if (!text?.body.trim()) throw new AdminError('incomplete')
        // CHỨC NĂNG: Gắn MP3 demo đã có để thử tua/nghe; không phải giọng của văn bản mới.
        replaceText(place, language, { ...text, audio: { id: 'demo-' + language + '-' + revision,
          url: 'demo:' + language, version: revision + 1, status: 'draft' } })
        log(doc, place, 'generateAudio')
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
```

## 8. TẠO MỚI — packages/admin-core/src/messages.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\src\messages.ts

```ts
/** FILE NÀY LÀM GÌ: Chữ Admin đủ năm ngôn ngữ dùng chung mobile/web.
 * useAdminText gọi; UC12–UC17. Keys được suy ra từ bản Việt để chặn thiếu khóa. */
import type { Language } from '@travelguide/visitor-core'
const vi = {
  "gateHint": "Lượt mở liên kết QR vào cổng, mỗi phiên/ngày tính một lần; không phải số vé hay số người.",
  "gateError": "Chưa tải được lượt QR.",
  "confirmDelete": "Xóa vĩnh viễn di tích này khỏi Admin và trang du khách trong kho RAM dùng chung? Bản nháp và bản công khai sẽ bị xóa. Không có nút hoàn tác.",
  "delete": "Xóa vĩnh viễn",
  "clearFile": "Bỏ tệp đã chọn",
  "localFile": "Đã chọn tệp cục bộ",
  "mediaError": "Tệp không hợp lệ hoặc lớn hơn 1 MB. Chọn JPEG/PNG/WebP hoặc MP3/WAV/OGG.",
  "fileHint": "Lưu tệp cục bộ tối đa 1 MB/tệp; API upload sẽ nối sau.",
  "pickAudio": "Chọn bản thu từ thiết bị",
  "pickImage": "Chọn ảnh từ thiết bị",
  "confirm": "Xác nhận",
  "previewError": "Không phát được bản nghe thử. Kiểm tra nguồn và thử lại.",
  "simListening": "Mô phỏng khách đang nghe",
  "overviewHint": "Theo dõi hoạt động và quản lý nội dung di tích.",
  "quickActions": "Thao tác nhanh",
  "managePlacesHint": "Cập nhật thông tin, hình ảnh và bài thuyết minh.",
  "reviewQueueHint": "Kiểm tra và công bố nội dung đã duyệt.",
  "catalogHint": "Quản lý danh mục và nội dung thuyết minh.",
  "basicInfo": "Thông tin di tích",
  "locationSection": "Vị trí và tọa độ",
  "mediaSection": "Hình ảnh và tư liệu",
  "workflowSection": "Lưu và quản lý phiên bản",
  "resetHint": "Khôi phục dữ liệu mẫu khi cần bắt đầu lại.",
  "editorHint": "Biên tập nội dung theo từng ngôn ngữ.",
  "clearSearch": "Xóa từ khóa",
  "admin": "Quản lý",
  "dashboard": "Tổng quan",
  "places": "Di tích",
  "reviews": "Kiểm duyệt",
  "qr": "QR tại cổng",
  "visitor": "Về trang du khách",
  "demo": "Dữ liệu dùng chung trên server RAM; khởi động lại server sẽ mất thay đổi.",
  "mockMedia": "Dịch/TTS mô phỏng. MP3 mẫu không đọc văn bản vừa soạn; nội dung được tạo là dữ liệu mẫu.",
  "loading": "Đang tải…",
  "save": "Lưu bản nháp",
  "saved": "Thao tác thành công",
  "new": "Thêm di tích",
  "edit": "Thông tin",
  "content": "Biên tập",
  "search": "Tìm di tích…",
  "title": "Tên chính thức",
  "period": "Giai đoạn lịch sử",
  "category": "Danh mục",
  "lat": "Vĩ độ",
  "lng": "Kinh độ",
  "verified": "Tọa độ đã kiểm tra",
  "images": "Ảnh: mỗi dòng một URL hoặc mã photo:ID",
  "summary": "Mô tả ngắn",
  "address": "Địa chỉ",
  "body": "Bài thuyết minh",
  "audio": "URL bản thu MP3 đã lưu trên máy chủ",
  "preview": "Nghe thử",
  "prepare": "Tạo audio mẫu",
  "translate": "Dịch nháp mô phỏng từ tiếng Việt",
  "submit": "Gửi duyệt",
  "approve": "Duyệt phiên bản",
  "reject": "Yêu cầu sửa",
  "note": "Ghi chú kiểm duyệt",
  "publish": "Công bố phiên bản",
  "confirmPublish": "Công bố bản này cho giao diện du khách trên thiết bị hiện tại?",
  "archive": "Lưu trữ di tích",
  "confirmArchive": "Lưu trữ sẽ bỏ điểm khỏi danh mục công khai . Tiếp tục?",
  "reset": "Đặt lại dữ liệu mẫu",
  "confirmReset": "Xóa các thay đổi cục bộ và nạp lại dữ liệu mẫu?",
  "cancel": "Hủy",
  "unsaved": "Có thay đổi chưa lưu. Bạn muốn rời biểu mẫu?",
  "active": "Phiên đang hoạt động",
  "web": "Web",
  "mobile": "App Mobile",
  "listening": "Đang nghe",
  "gateToday": "Lượt QR hôm nay",
  "simWeb": "Mô phỏng khách Web",
  "simMobile": "Mô phỏng khách App",
  "endSessions": "Kết thúc phiên mô phỏng",
  "analyticsHint": "Phiên ẩn danh được cập nhật từ server RAM; hết hoạt động sau 90 giây không gửi tín hiệu. Khởi động lại server sẽ mất số liệu. Đây là số phiên, không phải số người/vé.",
  "presenceError": "Chưa lấy được thống kê. Kiểm tra server RAM và địa chỉ API.",
  "empty": "Chưa có dữ liệu phù hợp",
  "revision": "Bản sửa",
  "current": "Bản công khai hiện hành",
  "none": "Chưa có",
  "status_draft": "Bản nháp",
  "status_submitted": "Chờ duyệt",
  "status_changes": "Cần sửa",
  "status_approved": "Đã duyệt",
  "status_published": "Đã công bố",
  "status_archived": "Đã lưu trữ",
  "error_loadError": "Không đọc được dữ liệu. Thử lại hoặc đặt lại dữ liệu.",
  "error_saveError": "Không lưu được. Bản công khai cũ được giữ nguyên.",
  "error_invalid": "Kiểm tra trường bắt buộc, tọa độ Huế và URL HTTP(S).",
  "error_conflict": "Bản đã thay đổi. Tải lại trước khi tiếp tục.",
  "error_notFound": "Không tìm thấy di tích",
  "error_notApproved": "Chỉ công bố đúng phiên bản đã duyệt, chưa sửa tiếp.",
  "error_incomplete": "Cần ảnh, bài Việt và audio cho các bản nội dung đã nhập.",
  "error_staleJob": "Kết quả tác vụ thuộc bản cũ. Hãy thử lại.",
  "retry": "Thử lại",
  "stop": "Dừng nghe thử"
} as const
const en = {
  "gateHint": "Gate QR link opens, counted once per session/day; not tickets or people.",
  "gateError": "QR statistics are unavailable.",
  "confirmDelete": "Permanently delete this place from shared Admin and visitor data? Draft and published content will be removed. There is no undo button.",
  "delete": "Delete permanently",
  "clearFile": "Remove selected file",
  "localFile": "Local file selected",
  "mediaError": "Invalid file or larger than 1 MB. Choose JPEG/PNG/WebP or MP3/WAV/OGG.",
  "fileHint": "Stores local files up to 1 MB each; upload API comes later.",
  "pickAudio": "Choose local recording",
  "pickImage": "Choose local image",
  "confirm": "Confirm",
  "previewError": "Preview unavailable. Check the source and retry.",
  "simListening": "Simulate listening visitor",
  "overviewHint": "Monitor activity and manage heritage content.",
  "quickActions": "Quick actions",
  "managePlacesHint": "Update information, photos and narration.",
  "reviewQueueHint": "Review and publish approved content.",
  "catalogHint": "Manage places and narration content.",
  "basicInfo": "Place information",
  "locationSection": "Location and coordinates",
  "mediaSection": "Photos and media",
  "workflowSection": "Save and manage versions",
  "resetHint": "Restore sample data when you need a fresh start.",
  "editorHint": "Edit content in each language.",
  "clearSearch": "Clear search",
  "admin": "Management",
  "dashboard": "Dashboard",
  "places": "Places",
  "reviews": "Reviews",
  "qr": "Gate QR",
  "visitor": "Visitor view",
  "demo": "Shared server RAM data; restarting the server loses changes.",
  "mockMedia": "Simulated translation/TTS. Sample MP3 does not read your edited text; generated content is sample data.",
  "loading": "Loading…",
  "save": "Save draft",
  "saved": "Operation completed",
  "new": "Add place",
  "edit": "Information",
  "content": "Edit content",
  "search": "Search places…",
  "title": "Official title",
  "period": "Historical period",
  "category": "Category",
  "lat": "Latitude",
  "lng": "Longitude",
  "verified": "Coordinates verified",
  "images": "Images: one URL or photo:ID per line",
  "summary": "Summary",
  "address": "Address",
  "body": "Narration text",
  "audio": "Hosted recording MP3 URL",
  "preview": "Preview audio",
  "prepare": "Prepare sample audio",
  "translate": "Simulated translation from Vietnamese",
  "submit": "Submit for review",
  "approve": "Approve revision",
  "reject": "Request changes",
  "note": "Review note",
  "publish": "Publish revision",
  "confirmPublish": "Publish this revision to the visitor view on this device?",
  "archive": "Archive place",
  "confirmArchive": "Archive removes this place from the public catalogue. Continue?",
  "reset": "Reset sample data",
  "confirmReset": "Discard local changes and restore sample data?",
  "cancel": "Cancel",
  "unsaved": "Unsaved changes. Leave this form?",
  "active": "Active sessions",
  "web": "Web",
  "mobile": "Mobile app",
  "listening": "Listening",
  "gateToday": "Gate entries today",
  "simWeb": "Simulate web visitor",
  "simMobile": "Simulate app visitor",
  "endSessions": "End simulated sessions",
  "analyticsHint": "Anonymous sessions are read from the RAM server and expire after 90 seconds without a heartbeat. Restarting the server clears them. Sessions are not people or tickets.",
  "presenceError": "Statistics are unavailable. Check the RAM server and API address.",
  "empty": "No matching data",
  "revision": "Revision",
  "current": "Current published version",
  "none": "None",
  "status_draft": "Draft",
  "status_submitted": "In review",
  "status_changes": "Changes requested",
  "status_approved": "Approved",
  "status_published": "Published",
  "status_archived": "Archived",
  "error_loadError": "Could not load data. Retry or reset data.",
  "error_saveError": "Save failed. The published version is unchanged.",
  "error_invalid": "Check required fields, Hue coordinates and HTTP(S) URLs.",
  "error_conflict": "Revision changed. Reload before continuing.",
  "error_notFound": "Place not found",
  "error_notApproved": "Publish only the unchanged approved revision.",
  "error_incomplete": "Require an image, Vietnamese text and audio for entered languages.",
  "error_staleJob": "Task result is stale. Retry.",
  "retry": "Retry",
  "stop": "Stop preview"
} as const
const cn = {
  "gateHint": "入口二维码链接打开次数，每个会话每天计一次；不代表票数或人数。",
  "gateError": "无法加载二维码统计。",
  "confirmDelete": "从共享管理和游客数据中永久删除此景点？草稿和公开内容将被删除，无法撤销。",
  "delete": "永久删除",
  "clearFile": "移除文件",
  "localFile": "已选本地文件",
  "mediaError": "文件无效或超过1MB。选择图片或音频支持格式。",
  "fileHint": "示例本地保存，每个文件最大1MB，后续连接上传API。",
  "pickAudio": "选择本地录音",
  "pickImage": "选择本地图片",
  "confirm": "确认",
  "previewError": "无法试听，请检查来源后重试。",
  "simListening": "模拟收听游客",
  "overviewHint": "查看使用情况并管理景点内容。",
  "quickActions": "快捷操作",
  "managePlacesHint": "更新信息、图片和讲解。",
  "reviewQueueHint": "审核并发布已批准的内容。",
  "catalogHint": "管理景点目录和讲解内容。",
  "basicInfo": "景点信息",
  "locationSection": "位置与坐标",
  "mediaSection": "图片与资料",
  "workflowSection": "保存与版本管理",
  "resetHint": "需要重新开始时恢复示例数据。",
  "editorHint": "按语言编辑内容。",
  "clearSearch": "清除关键词",
  "admin": "管理",
  "dashboard": "概览",
  "places": "景点",
  "reviews": "审核",
  "qr": "入口二维码",
  "visitor": "游客页面",
  "demo": "数据共用服务器内存；重启服务器会丢失更改。",
  "mockMedia": "翻译和语音为模拟，示例MP3不朗读编辑内容，仅供示例发布。",
  "loading": "加载中…",
  "save": "保存草稿",
  "saved": "操作成功",
  "new": "添加景点",
  "edit": "信息",
  "content": "编辑内容",
  "search": "搜索景点…",
  "title": "正式名称",
  "period": "历史时期",
  "category": "类别",
  "lat": "纬度",
  "lng": "经度",
  "verified": "坐标已核实",
  "images": "图片：每行一个URL或photo:ID",
  "summary": "简介",
  "address": "地址",
  "body": "讲解文稿",
  "audio": "已托管MP3录音URL",
  "preview": "试听",
  "prepare": "生成示例音频",
  "translate": "从越南语模拟翻译",
  "submit": "提交审核",
  "approve": "批准版本",
  "reject": "要求修改",
  "note": "审核备注",
  "publish": "发布版本",
  "confirmPublish": "向当前设备游客视图发布此版本？",
  "archive": "归档景点",
  "confirmArchive": "归档会从示例公开目录移除景点。继续？",
  "reset": "重置示例数据",
  "confirmReset": "清除本地修改并恢复示例数据？",
  "cancel": "取消",
  "unsaved": "有未保存修改，离开？",
  "active": "活跃会话",
  "web": "网页",
  "mobile": "移动应用",
  "listening": "正在收听",
  "gateToday": "今日入口次数",
  "simWeb": "模拟网页游客",
  "simMobile": "模拟应用游客",
  "endSessions": "结束示例会话",
  "analyticsHint": "匿名会话来自内存服务器，90秒未发送心跳即过期。重启服务器会清空数据。会话数不等于人数或票数。",
  "presenceError": "无法读取统计，请检查内存服务器和API地址。",
  "empty": "暂无匹配数据",
  "revision": "修订",
  "current": "当前公开版本",
  "none": "暂无",
  "status_draft": "草稿",
  "status_submitted": "待审核",
  "status_changes": "需修改",
  "status_approved": "已批准",
  "status_published": "已发布",
  "status_archived": "已归档",
  "error_loadError": "读取失败，请重试或重置。",
  "error_saveError": "保存失败，公开版本未改变。",
  "error_invalid": "请检查必填项、顺化坐标和HTTP(S)链接。",
  "error_conflict": "版本已变，请刷新后继续。",
  "error_notFound": "未找到景点",
  "error_notApproved": "只能发布未再修改的已批准版本。",
  "error_incomplete": "需要图片、越南语内容及已输入语言的音频。",
  "error_staleJob": "任务结果已过期，请重试。",
  "retry": "重试",
  "stop": "停止试听"
} as const
const pt = {
  "gateHint": "Aberturas do link QR de entrada, uma por sessão/dia; não são bilhetes nem pessoas.",
  "gateError": "Estatísticas QR indisponíveis.",
  "confirmDelete": "Eliminar este local dos dados partilhados de gestão e visitantes? O rascunho e a versão pública serão removidos. Não há botão para desfazer.",
  "delete": "Eliminar permanentemente",
  "clearFile": "Remover ficheiro",
  "localFile": "Ficheiro local escolhido",
  "mediaError": "Ficheiro inválido ou superior a 1 MB. Use imagem/áudio suportado.",
  "fileHint": "Guarda ficheiros locais até 1 MB; API de upload futura.",
  "pickAudio": "Escolher gravação local",
  "pickImage": "Escolher imagem local",
  "confirm": "Confirmar",
  "previewError": "Prévia indisponível. Verifique a origem e repita.",
  "simListening": "Simular visitante a ouvir",
  "overviewHint": "Acompanhe a atividade e gira conteúdos do património.",
  "quickActions": "Ações rápidas",
  "managePlacesHint": "Atualize informações, fotografias e narrações.",
  "reviewQueueHint": "Reveja e publique conteúdos aprovados.",
  "catalogHint": "Gira locais e conteúdos de narração.",
  "basicInfo": "Informação do local",
  "locationSection": "Localização e coordenadas",
  "mediaSection": "Fotografias e materiais",
  "workflowSection": "Guardar e gerir versões",
  "resetHint": "Reponha os dados de exemplo para recomeçar.",
  "editorHint": "Edite conteúdos em cada idioma.",
  "clearSearch": "Limpar pesquisa",
  "admin": "Gestão",
  "dashboard": "Visão geral",
  "places": "Locais",
  "reviews": "Revisão",
  "qr": "QR da entrada",
  "visitor": "Vista visitante",
  "demo": "Dados na RAM partilhada do servidor; reiniciar perde as alterações.",
  "mockMedia": "Tradução/TTS simulados. O MP3 não lê o texto editado; publicação com conteúdo de exemplo.",
  "loading": "A carregar…",
  "save": "Guardar rascunho",
  "saved": "Operação concluída",
  "new": "Adicionar local",
  "edit": "Informação",
  "content": "Editar conteúdo",
  "search": "Pesquisar locais…",
  "title": "Nome oficial",
  "period": "Período histórico",
  "category": "Categoria",
  "lat": "Latitude",
  "lng": "Longitude",
  "verified": "Coordenadas verificadas",
  "images": "Imagens: um URL ou photo:ID por linha",
  "summary": "Resumo",
  "address": "Morada",
  "body": "Texto da narração",
  "audio": "URL MP3 alojado",
  "preview": "Ouvir prévia",
  "prepare": "Preparar áudio de exemplo",
  "translate": "Tradução simulada do vietnamita",
  "submit": "Enviar para revisão",
  "approve": "Aprovar versão",
  "reject": "Pedir alterações",
  "note": "Nota de revisão",
  "publish": "Publicar versão",
  "confirmPublish": "Publicar esta versão para visitantes neste dispositivo?",
  "archive": "Arquivar local",
  "confirmArchive": "Arquivar remove o local do catálogo. Continuar?",
  "reset": "Repor exemplo",
  "confirmReset": "Eliminar alterações locais e repor dados de exemplo?",
  "cancel": "Cancelar",
  "unsaved": "Alterações por guardar. Sair?",
  "active": "Sessões ativas",
  "web": "Web",
  "mobile": "Aplicação móvel",
  "listening": "A ouvir",
  "gateToday": "Entradas QR hoje",
  "simWeb": "Simular visitante Web",
  "simMobile": "Simular visitante App",
  "endSessions": "Terminar sessões simuladas",
  "analyticsHint": "Sessões anónimas no servidor RAM expiram após 90 segundos sem sinal. Reiniciar o servidor apaga os dados. Sessões não são pessoas ou bilhetes.",
  "presenceError": "Estatísticas indisponíveis. Verifique o servidor RAM e o endereço da API.",
  "empty": "Sem dados correspondentes",
  "revision": "Revisão",
  "current": "Versão publicada atual",
  "none": "Nenhum",
  "status_draft": "Rascunho",
  "status_submitted": "Em revisão",
  "status_changes": "Alterações pedidas",
  "status_approved": "Aprovado",
  "status_published": "Publicado",
  "status_archived": "Arquivado",
  "error_loadError": "Falha ao carregar. Repetir ou repor dados.",
  "error_saveError": "Falha ao guardar. Versão pública mantida.",
  "error_invalid": "Verifique campos, coordenadas e URL HTTP(S).",
  "error_conflict": "Versão alterada. Recarregue antes de continuar.",
  "error_notFound": "Local não encontrado",
  "error_notApproved": "Publique apenas a revisão aprovada sem alterações.",
  "error_incomplete": "É necessária imagem, texto vietnamita e áudio nos idiomas preenchidos.",
  "error_staleJob": "Resultado desatualizado. Repita.",
  "retry": "Repetir",
  "stop": "Parar prévia"
} as const
const ja = {
  "gateHint": "入口QRリンクを開いた回数。同じセッションは1日1回で、人数や入場券数ではありません。",
  "gateError": "QR統計を取得できません。",
  "confirmDelete": "この史跡を共有された管理・来訪者データから完全に削除しますか？下書きと公開版が削除され、元に戻すボタンはありません。",
  "delete": "完全に削除",
  "clearFile": "選択ファイルを外す",
  "localFile": "ローカルファイル選択済み",
  "mediaError": "無効または1MB超過。対応する画像・音声を選んでください。",
  "fileHint": "サンプルは1ファイル1MBまでローカル保存。アップロードAPIは後日接続。",
  "pickAudio": "端末の録音を選択",
  "pickImage": "端末の画像を選択",
  "confirm": "確認",
  "previewError": "試聴できません。音源を確認して再試行してください。",
  "simListening": "再生中の利用者を追加",
  "overviewHint": "利用状況を確認し、史跡のコンテンツを管理します。",
  "quickActions": "クイック操作",
  "managePlacesHint": "情報、写真、音声ガイドを更新します。",
  "reviewQueueHint": "内容を確認して承認済みの版を公開します。",
  "catalogHint": "スポットと音声ガイドを管理します。",
  "basicInfo": "スポット情報",
  "locationSection": "場所と座標",
  "mediaSection": "写真と資料",
  "workflowSection": "保存とバージョン管理",
  "resetHint": "最初から始める場合にサンプルデータを復元します。",
  "editorHint": "言語ごとにコンテンツを編集します。",
  "clearSearch": "検索語を消去",
  "admin": "管理",
  "dashboard": "概要",
  "places": "史跡",
  "reviews": "審査",
  "qr": "入口QR",
  "visitor": "来訪者画面",
  "demo": "サーバーRAMの共有データです。再起動すると変更は失われます。",
  "mockMedia": "翻訳・TTSは模擬です。MP3は編集文を読みません。公開もサンプル用です。",
  "loading": "読込中…",
  "save": "下書き保存",
  "saved": "処理完了",
  "new": "史跡を追加",
  "edit": "情報",
  "content": "内容編集",
  "search": "史跡を検索…",
  "title": "正式名称",
  "period": "歴史的時代",
  "category": "分類",
  "lat": "緯度",
  "lng": "経度",
  "verified": "座標確認済み",
  "images": "画像：1行にURLまたはphoto:ID",
  "summary": "概要文",
  "address": "住所",
  "body": "解説文",
  "audio": "サーバー上のMP3 URL",
  "preview": "試聴",
  "prepare": "サンプル音声を用意",
  "translate": "ベトナム語から模擬翻訳",
  "submit": "審査に送信",
  "approve": "版を承認",
  "reject": "修正依頼",
  "note": "審査メモ",
  "publish": "版を公開",
  "confirmPublish": "この端末の来訪者画面に公開しますか？",
  "archive": "史跡をアーカイブ",
  "confirmArchive": "サンプル公開一覧から除きます。続けますか？",
  "reset": "サンプルデータをリセット",
  "confirmReset": "ローカル変更を破棄しサンプルに戻しますか？",
  "cancel": "取消",
  "unsaved": "未保存の変更があります。移動しますか？",
  "active": "アクティブセッション",
  "web": "Web",
  "mobile": "モバイルアプリ",
  "listening": "再生中",
  "gateToday": "本日のQR入場",
  "simWeb": "Web利用者を追加",
  "simMobile": "アプリ利用者を追加",
  "endSessions": "サンプルセッション終了",
  "analyticsHint": "匿名セッションをRAMサーバーから取得します。90秒間通知がないと期限切れになります。再起動で消去されます。人数・チケット数ではありません。",
  "presenceError": "統計を取得できません。RAMサーバーとAPIアドレスを確認してください。",
  "empty": "該当データなし",
  "revision": "改訂",
  "current": "現在の公開版",
  "none": "なし",
  "status_draft": "下書き",
  "status_submitted": "審査待ち",
  "status_changes": "要修正",
  "status_approved": "承認済み",
  "status_published": "公開済み",
  "status_archived": "アーカイブ済み",
  "error_loadError": "読込失敗。再試行またはリセットしてください。",
  "error_saveError": "保存失敗。公開版は変更されません。",
  "error_invalid": "必須項目・フエの座標・HTTP(S) URLを確認してください。",
  "error_conflict": "版が変更されました。再読込してください。",
  "error_notFound": "史跡が見つかりません",
  "error_notApproved": "承認後未変更の版だけ公開できます。",
  "error_incomplete": "画像・ベトナム語文・入力した言語の音声が必要です。",
  "error_staleJob": "古い処理結果です。再試行してください。",
  "retry": "再試行",
  "stop": "試聴停止"
} as const
export type AdminTextKey = keyof typeof vi
export const adminMessages: Record<Language, Record<AdminTextKey, string>> = { vi, en, cn, pt, ja }
/* CÁCH KIỂM TRA: Đổi đủ năm ngôn ngữ, mọi nhãn Admin đổi cùng lựa chọn du khách. */
```

## 9. TẠO MỚI — packages/admin-core/src/index.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\src\index.ts

```ts
/** FILE NÀY LÀM GÌ: Entry logic thuần Admin; app import bằng tên package.
 * Phụ thuộc các module bên dưới; React có entry riêng /react. UC12–UC17. */
export * from './models'
export * from './contracts'
export * from './validation'
export * from './mockService'
/* CÁCH KIỂM TRA: Import entry này trong test Node không được kéo React/DOM vào. */

export * from './httpService'
```

## 10. TẠO MỚI — packages/admin-core/src/react.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\src\react.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Context và hooks Admin dùng chung, UI không biết adapter lưu ở đâu.
 * Admin layout/web và AdminScreen/mobile dùng; UC12–UC17.
 * Phụ thuộc React, service và ngôn ngữ VisitorProvider hiện có.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useVisitor } from '@travelguide/visitor-core/react'
import type { AdminService } from './contracts'
import { AdminError, type AdminDocument, type AdminErrorCode, type AdminIdentity } from './models'
import { adminMessages, type AdminTextKey } from './messages'
const Context = createContext<AdminService | null>(null)
export function AdminProvider({ service, children }: { service: AdminService; children: ReactNode }) {
  return <Context.Provider value={service}>{children}</Context.Provider>
}
export function useAdminText() {
  const { language } = useVisitor()
  return useCallback((key: AdminTextKey): string => adminMessages[language][key], [language])
}
export function useAdmin() {
  const service = useContext(Context)
  if (!service) throw new Error('AdminProvider missing')
  const [data, setData] = useState<AdminDocument | null>(null)
  const [identity, setIdentity] = useState<AdminIdentity | null>(null)
  const [error, setError] = useState<AdminErrorCode | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState(false)
  const alive = useRef(true), sequence = useRef(0), locked = useRef(false)
  // CHỨC NĂNG: Hủy nhận dữ liệu cũ bằng sequence, gỡ subscription khi rời màn.
  const reload = useCallback(async () => {
    const request = ++sequence.current
    try {
      const [doc, manager] = await Promise.all([service.load(), service.identity()])
      if (alive.current && request === sequence.current) { setData(doc); setIdentity(manager); setError(null) }
    } catch (e) { if (alive.current && request === sequence.current) setError(e instanceof AdminError ? e.code : 'loadError') }
    finally { if (alive.current && request === sequence.current) setLoading(false) }
  }, [service])
  const invalidate = useCallback(() => { sequence.current++ }, [])
  useEffect(() => {
    alive.current = true; void reload()
    const stop = service.subscribe(() => { void reload() })
    return () => { alive.current = false; invalidate(); stop() }
  }, [service, reload, invalidate])
  // CHỨC NĂNG: Một thao tác tại một thời điểm; lỗi giữ nguyên form/bản công khai.
  const run = async (operation: () => Promise<void>): Promise<boolean> => {
    if (locked.current) return false
    locked.current = true; setBusy(true); setError(null); setSuccess(false)
    try { await operation(); if (alive.current) { await reload(); setSuccess(true) } return true }
    catch (e) { if (alive.current) setError(e instanceof AdminError ? e.code : 'saveError'); return false }
    finally { locked.current = false; if (alive.current) setBusy(false) }
  }
  return { service, data, identity, error, loading, busy, success, reload, run }
}
/* CÁCH KIỂM TRA: Rời màn trong lúc lưu không setState; lỗi lưu hiện thông báo, không báo thành công. */

// CHỨC NĂNG: Hai dashboard đọc cùng bộ đếm QR từ server RAM mỗi 5 giây.
// XỬ LÝ: Lỗi để —, không báo 0; cleanup bỏ timer và kết quả đến muộn.
export function useGateStatistics(client: import('./httpService').GateClient) {
 const [stats,setStats]=useState<import('./httpService').GateStats|null>(null),[error,setError]=useState(false),[retryKey,setRetryKey]=useState(0)
 useEffect(()=>{let alive=true;let timer:ReturnType<typeof setTimeout>|undefined
  const tick=async()=>{try{const value=await client.statistics();if(alive){setStats(value);setError(false)}}catch{if(alive){setStats(null);setError(true)}}if(alive)timer=setTimeout(()=>{void tick()},5000)}
  void tick();return()=>{alive=false;if(timer)clearTimeout(timer)}
 },[client,retryKey])
 return {stats,error,retry:()=>setRetryKey(value=>value+1)}
}
```

## 11. SỬA — .gitignore

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\.gitignore

```text
﻿# FILE NÀY LÀM GÌ:
# Bỏ dependency, kết quả test/build và cấu hình máy cá nhân khỏi Git.

# CHỨC NĂNG: Không commit thư viện cài từ npm.
node_modules/

# CHỨC NĂNG: Không commit file kiểm tra sinh tự động.
**/.test-build/
**/.verify-native/
**/dist/

# CHỨC NĂNG: Giữ cấu hình máy riêng ngoài Git.
.env
.env.local
# QR demo và bản sao .env chỉ dùng trên máy cá nhân.
.qr-output/

# Công cụ tunnel cục bộ, không commit binary.
.tools/

# Cache/log Expo tự sinh khi kiểm tra Android; không phải mã nguồn.
**/.expo/

# URL tunnel demo riêng của máy, script QR sinh lại khi chạy.
apps/web/static/visitor-config.json

# Output kiểm tra đóng gói Admin, không phải mã nguồn.
**/.verify-admin/

# Bản build quản lý độc lập với web du khách.
**/dist-admin/

# Bundle Node của mock API, sinh khi khởi động.
.runtime/
```

## 12. SỬA — apps/mobile/package.json

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\package.json

```json
{
  "name": "mobile",
  "version": "0.0.1",
  "private": true,
  "main": "index.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "lint": "eslint App.tsx src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "start:admin": "node ../../scripts/start-mobile-admin.cjs"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.2",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-native-community/slider": "5.2.0",
    "@react-navigation/bottom-tabs": "^6.6.1",
    "@react-navigation/native": "^6.1.10",
    "@react-navigation/native-stack": "^6.9.18",
    "@travelguide/admin-core": "*",
    "@travelguide/place-core": "*",
    "@travelguide/shared-types": "*",
    "@travelguide/visitor-core": "*",
    "expo": "~57.0.27",
    "expo-audio": "~57.0.5",
    "expo-camera": "~57.0.6",
    "expo-document-picker": "~57.0.3",
    "expo-file-system": "~57.0.7",
    "expo-localization": "~57.0.2",
    "expo-location": "~57.0.20",
    "expo-modules-core": "~57.0.24",
    "expo-speech": "~57.0.3",
    "i18next": "^26.4.2",
    "react": "19.2.3",
    "react-i18next": "^17.0.15",
    "react-native": "0.86.3",
    "react-native-maps": "1.27.2",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0"
  },
  "devDependencies": {
    "@expo/ngrok": "^4.1.0",
    "@types/react": "~19.2.4",
    "eslint": "^8.57.0",
    "typescript": "^6.0.3"
  }
}
```

## 13. TẠO MỚI — apps/mobile/src/components/admin/AdminUI.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\components\admin\AdminUI.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Bộ giao diện Admin mobile: khung, tiêu đề, trạng thái, trường nhập và thao tác nhanh.
 * Dashboard/Places/PlaceForm/ContentEditor/Reviews dùng; phụ thuộc token, Ionicons và admin-core.
 * UC12–UC17. Chỉ trình bày giao diện; lưu/duyệt/phiên vẫn do service hiện có xử lý.
 */
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import type { ManagedPlace } from '@travelguide/admin-core'
import { LANGUAGES, type Language } from '@travelguide/visitor-core'
import type { Track } from '@travelguide/visitor-core/journey'
import { Action } from '../Action'
import { colors, spacing } from '../../theme'
import { journeyAdapters } from '../../services/journeyAdapters'

type IconName = ComponentProps<typeof Ionicons>['name']
// CHỨC NĂNG: Tập trung style Admin, không sửa style của app du khách.
// XỬ LÝ: Dùng token chung; bố cục mềm và chữ có thể xuống dòng khi dịch dài.
export const styles = StyleSheet.create({
 page:{flex:1,backgroundColor:colors.page}, content:{padding:spacing.lg,gap:20,paddingBottom:32},
 card:{padding:spacing.lg,backgroundColor:colors.background,borderRadius:20,borderWidth:1,borderColor:colors.border,gap:12},
 title:{fontSize:26,lineHeight:34,fontWeight:'700',color:colors.text,letterSpacing:-0.5},
 heading:{fontSize:18,lineHeight:26,fontWeight:'700',color:colors.text},
 label:{fontSize:13,lineHeight:20,fontWeight:'600',color:colors.text},
 text:{fontSize:14,lineHeight:22,color:colors.text}, muted:{fontSize:12,lineHeight:19,color:colors.muted},
 notice:{padding:12,borderRadius:14,backgroundColor:colors.soft,flexDirection:'row',gap:8,alignItems:'flex-start'},
 error:{color:colors.danger,fontSize:13,lineHeight:21},
 feedback:{padding:12,borderRadius:14,backgroundColor:colors.background,borderWidth:1,borderColor:colors.border,gap:10},
 row:{flexDirection:'row',flexWrap:'wrap',gap:10,alignItems:'center'},
 input:{borderWidth:1,borderColor:colors.border,borderRadius:13,paddingHorizontal:14,paddingVertical:12,color:colors.text,backgroundColor:colors.background,minHeight:48,fontSize:14,lineHeight:21},
 inputFocused:{borderColor:colors.primary,backgroundColor:colors.soft},
 number:{fontSize:31,fontWeight:'700',lineHeight:42,color:colors.text},
 metric:{width:'47%',flexGrow:1,padding:16,backgroundColor:colors.background,borderRadius:20,borderWidth:1,borderColor:colors.border,gap:12},
 metricLabel:{fontSize:12,lineHeight:18,color:colors.muted,minHeight:36},
 metricIcon:{width:34,height:34,borderRadius:11,backgroundColor:colors.soft,alignItems:'center',justifyContent:'center'},
 badge:{alignSelf:'flex-start',paddingVertical:5,paddingHorizontal:10,backgroundColor:colors.soft,borderRadius:8,color:colors.primary,fontSize:11,fontWeight:'600'},
 hero:{backgroundColor:colors.playerBackground,borderRadius:24,padding:20,gap:12},
 brand:{fontSize:10,lineHeight:15,fontWeight:'700',letterSpacing:2,color:colors.playerAccent},
 heroTitle:{fontSize:27,lineHeight:35,fontWeight:'700',color:colors.white},
 heroText:{fontSize:12,lineHeight:20,color:colors.playerMuted},
 sectionHeading:{flexDirection:'row',alignItems:'center',gap:8},
 quickAction:{flexDirection:'row',alignItems:'center',gap:12,padding:16,backgroundColor:colors.background,borderWidth:1,borderColor:colors.border,borderRadius:18},
 quickIcon:{width:46,height:46,borderRadius:14,backgroundColor:colors.soft,alignItems:'center',justifyContent:'center'},
 languageChip:{minHeight:42,paddingHorizontal:14,justifyContent:'center',borderWidth:1,borderColor:colors.border,borderRadius:12,backgroundColor:colors.background},
 searchBox:{flexDirection:'row',alignItems:'center',gap:8,minHeight:50,borderWidth:1,borderColor:colors.border,borderRadius:15,paddingHorizontal:12,backgroundColor:colors.background},
 searchInput:{flex:1,minWidth:0,fontSize:14,color:colors.text,paddingVertical:12},
 listImage:{width:88,height:92,borderRadius:13,overflow:'hidden',flexShrink:0},
 divider:{height:1,backgroundColor:colors.border},
 pressed:{opacity:0.75},
})
// CHỨC NĂNG: Tiêu đề từng màn và tiêu đề từng nhóm dùng cùng nhịp chữ/khoảng cách.
export function PageHeader({title,description}:{title:string;description?:string}) {
 return <View style={{gap:6}}><Text style={styles.title}>{title}</Text>{description&&<Text style={styles.muted}>{description}</Text>}</View>
}
export function SectionHeading({title,icon}:{title:string;icon?:IconName}) {
 return <View style={styles.sectionHeading}>{icon&&<Ionicons name={icon} size={18} color={colors.primary}/>}<Text style={styles.heading}>{title}</Text></View>
}
export function QuickAction({title,description,icon,onPress}:{title:string;description:string;icon:IconName;onPress:()=>void}) {
 return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={({pressed})=>[styles.quickAction,pressed&&styles.pressed]}>
  <View style={styles.quickIcon}><Ionicons name={icon} size={23} color={colors.primary}/></View>
  <View style={{flex:1,gap:3}}><Text style={styles.label}>{title}</Text><Text style={styles.muted}>{description}</Text></View>
  <Ionicons name="chevron-forward" size={18} color={colors.muted}/>
 </Pressable>
}
// CHỨC NĂNG: Mỗi trạng thái có nhãn dịch và biểu tượng, không chỉ phân biệt bằng màu.
export function StatusBadge({workflow}:{workflow:ManagedPlace['workflow']}) {
 const t=useAdminText()
 const icons:Record<ManagedPlace['workflow'],IconName>={draft:'create-outline',submitted:'time-outline',changes:'alert-circle-outline',approved:'checkmark-circle-outline',published:'globe-outline',archived:'archive-outline'}
 const color=workflow==='changes'?colors.danger:workflow==='archived'?colors.muted:colors.primary
 return <View style={[styles.row,{alignSelf:'flex-start',gap:5,backgroundColor:colors.soft,paddingHorizontal:9,paddingVertical:5,borderRadius:9}]}>
  <Ionicons name={icons[workflow]} size={13} color={color}/><Text style={{fontSize:11,lineHeight:16,fontWeight:'600',color}}>{t(`status_${workflow}`)}</Text>
 </View>
}
export function LanguageTabs({value,onChange}:{value:Language;onChange:(language:Language)=>void}) {
 return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,paddingVertical:2}}>
  {LANGUAGES.map(language=><Pressable key={language.code} accessibilityRole="button" accessibilityLabel={language.label} accessibilityState={{selected:value===language.code}}
   onPress={()=>onChange(language.code)} style={[styles.languageChip,value===language.code&&{backgroundColor:colors.primary,borderColor:colors.primary}]}>
   <Text style={{fontSize:13,fontWeight:'600',color:value===language.code?colors.white:colors.muted}}>{language.label}</Text>
  </Pressable>)}
 </ScrollView>
}
export function DemoNotice() { const t=useAdminText();return <View style={styles.notice}><Ionicons name="information-circle-outline" size={17} color={colors.primary}/><Text style={[styles.muted,{flex:1}]}>{t('demo')}</Text></View> }
// CHỨC NĂNG: Biểu mẫu tránh bàn phím che nội dung; thông báo dữ liệu nằm cuối trang.
export function Frame({children}:{children:ReactNode}) {
 return <SafeAreaView style={styles.page} edges={['left','right','bottom']}><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined} keyboardVerticalOffset={88}>
  <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>{children}<DemoNotice/></ScrollView>
 </KeyboardAvoidingView></SafeAreaView>
}
export function Feedback({state}:{state:ReturnType<typeof useAdmin>}) {
 const t=useAdminText()
 return <>{state.loading&&<View style={styles.row}><ActivityIndicator color={colors.primary}/><Text style={styles.muted} accessibilityLiveRegion="polite">{t('loading')}</Text></View>}
 {state.error&&<View style={[styles.feedback,{borderColor:colors.danger}]}><Text style={styles.error} accessibilityRole="alert">{t(`error_${state.error}`)}</Text><Action title={t('retry')} icon="refresh-outline" onPress={()=>{void state.reload()}}/></View>}
 {state.success&&<View style={[styles.notice,{alignItems:'center'}]}><Ionicons name="checkmark-circle" size={18} color={colors.primary}/><Text style={styles.label}>{t('saved')}</Text></View>}</>
}
// CHỨC NĂNG: Trường nhập có nhãn và phản hồi focus, giữ nguyên giá trị/handler do form truyền.
export function Field({label,value,onChange,multiline=false,editable=true}:{label:string;value:string;onChange:(text:string)=>void;multiline?:boolean;editable?:boolean}) {
 const [focused,setFocused]=useState(false)
 return <View style={{gap:7}}><Text style={styles.label}>{label}</Text>
  <TextInput accessibilityLabel={label} style={[styles.input,multiline&&{minHeight:120,textAlignVertical:'top'},focused&&styles.inputFocused,!editable&&{backgroundColor:colors.page,color:colors.muted}]}
   value={value} editable={editable} onChangeText={onChange} multiline={multiline} autoCapitalize="none" onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
 </View>
}
// CHỨC NĂNG: Thao tác xóa có màu cảnh báo riêng, vẫn do màn hình hỏi xác nhận.
export function DangerAction({title,onPress,disabled=false}:{title:string;onPress:()=>void;disabled?:boolean}) {
 return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{disabled}} disabled={disabled} onPress={onPress}
  style={({pressed})=>[{minHeight:46,padding:12,borderRadius:13,borderWidth:1,borderColor:colors.danger,flexDirection:'row',justifyContent:'center',alignItems:'center',gap:8},(pressed||disabled)&&styles.pressed]}>
  <Ionicons name="trash-outline" size={18} color={colors.danger}/><Text style={[styles.label,{color:colors.danger,flexShrink:1,textAlign:'center'}]}>{title}</Text>
 </Pressable>
}
// CHỨC NĂNG: Hỏi trước khi back khỏi biểu mẫu chưa lưu, tránh mất nội dung.
export function useUnsaved(dirty:boolean) {
 const navigation=useNavigation(),t=useAdminText(),ref=useRef(dirty);ref.current=dirty
 useEffect(()=>navigation.addListener('beforeRemove',event=>{
  if(!ref.current)return
  event.preventDefault();Alert.alert(t('admin'),t('unsaved'),[{text:t('cancel'),style:'cancel'},{text:t('visitor'),onPress:()=>{ref.current=false;navigation.dispatch(event.data.action)}}])
 }),[navigation,t])
 return ()=>{ref.current=false}
}
// CHỨC NĂNG: Chỉ một preview Admin hoạt động trong toàn bộ cây màn hình.
let stopOtherPreview: (() => void) | undefined
export function AudioPreview({url,title}:{url:string;title:string}) {
 const t=useAdminText(),track=useRef<Track | undefined>(undefined),generation=useRef(0)
 const unlisten=useRef<(() => void) | undefined>(undefined),release=useRef<(() => void) | undefined>(undefined)
 const [busy,setBusy]=useState(false),[playing,setPlaying]=useState(false),[error,setError]=useState(false)
 const stop=()=>{generation.current++;unlisten.current?.();unlisten.current=undefined;track.current?.dispose();track.current=undefined;setPlaying(false);setBusy(false)}
 useEffect(()=>()=>{
  generation.current++;unlisten.current?.();track.current?.dispose();track.current=undefined
  if(stopOtherPreview===release.current)stopOtherPreview=undefined
 },[url])
 return <View style={styles.card}><Action title={playing?t('stop'):t('preview')} icon={playing?'stop':'play'} disabled={busy} onPress={()=>{
  if(playing){stop();return}
  stopOtherPreview?.();release.current=stop;stopOtherPreview=stop
  const request=++generation.current;setBusy(true);setError(false)
  void journeyAdapters.open(url,title).then(async next=>{
   if(request!==generation.current){next.dispose();return}
   track.current=next
   unlisten.current=next.listen(status=>{if(request===generation.current){setPlaying(status.playing);if(status.error)setError(true)}})
   await next.play();if(request===generation.current)setPlaying(true)
  }).catch(()=>{if(request===generation.current)setError(true)}).finally(()=>{if(request===generation.current)setBusy(false)})
 }} />{error && <Text style={styles.error}>{t('previewError')}</Text>}</View>
}
/* CÁCH KIỂM TRA: Rời màn dừng preview; input có nhãn; nút dễ bấm, không chồng audio du khách. */
```

## 14. TẠO MỚI — apps/mobile/src/components/admin/LocalMediaPicker.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\components\admin\LocalMediaPicker.tsx

```tsx
/** FILE NÀY LÀM GÌ: Chọn ảnh/bản thu từ thiết bị, lưu cục bộ cho FE demo.
 * Form di tích/nội dung gọi; UC13–UC14.2. Expo document-picker đúng SDK57.
 * Không upload hoặc gửi file ra ngoài. BE sau này thay bước đọc bằng MediaService.
 */
import { useEffect,useRef,useState } from 'react'
import { Text,View } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system/legacy'
import { useAdminText } from '@travelguide/admin-core/react'
import { Action } from '../Action'
import { styles } from './AdminUI'
export function LocalMediaPicker({kind,onPick}:{kind:'image'|'audio';onPick:(value:string)=>void}){
 const t=useAdminText(),[busy,setBusy]=useState(false),[error,setError]=useState(false),alive=useRef(true)
 useEffect(()=>{alive.current=true;return()=>{alive.current=false}},[])
 const pick=async()=>{
  setBusy(true);setError(false)
  try{
   const result=await DocumentPicker.getDocumentAsync({type:kind==='image'?['image/jpeg','image/png','image/webp']:['audio/mpeg','audio/wav','audio/ogg'],multiple:false,copyToCacheDirectory:true})
   if(result.canceled)return
   const asset=result.assets[0],mime=asset.mimeType==='audio/x-wav'?'audio/wav':asset.mimeType
   const allowed=kind==='image'?['image/jpeg','image/png','image/webp']:['audio/mpeg','audio/mp3','audio/wav','audio/ogg']
   const info=await FileSystem.getInfoAsync(asset.uri)
   const size=asset.size??(info.exists?info.size:Infinity)
   if(!mime||!allowed.includes(mime)||size>1048576)throw Error('invalid')
   const base64=await FileSystem.readAsStringAsync(asset.uri,{encoding:FileSystem.EncodingType.Base64})
   if(base64.length>1400000)throw Error('invalid')
   if(alive.current)onPick('data:'+mime+';base64,'+base64)
  }catch{if(alive.current)setError(true)}finally{if(alive.current)setBusy(false)}
 }
 return <View style={{gap:8}}><Action title={t(kind==='image'?'pickImage':'pickAudio')} disabled={busy} onPress={()=>{void pick()}}/><Text style={styles.muted}>{t('fileHint')}</Text>{error&&<Text style={styles.error}>{t('mediaError')}</Text>}</View>
}
/* CÁCH KIỂM TRA: Hủy không lỗi; tệp >1MB bị chặn; lưu bản nháp rồi mở lại vẫn có file. */
```

## 15. TẠO MỚI — apps/mobile/src/navigation/AdminNavigator.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\navigation\AdminNavigator.tsx

```tsx
/** FILE NÀY LÀM GÌ: Stack Admin native không đăng nhập, tách khỏi các màn visitor.
 * AdminApp đăng ký; UC12–UC17. Dùng danh tính demo và service chung.
 * Không tạo NavigationContainer thứ hai; header dùng cùng token màu du khách. */
import { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAdminText } from '@travelguide/admin-core/react'
import { useJourney } from '../hooks/useJourney'
import { colors } from '../theme'
import type { AdminStack } from './adminTypes'
import { DashboardScreen } from '../screens/admin/DashboardScreen'
import { AdminPlacesScreen } from '../screens/admin/PlacesScreen'
import { PlaceFormScreen } from '../screens/admin/PlaceFormScreen'
import { ContentEditorScreen } from '../screens/admin/ContentEditorScreen'
import { ReviewsScreen } from '../screens/admin/ReviewsScreen'
const Stack=createNativeStackNavigator<AdminStack>()
export function AdminNavigator(){const t=useAdminText(),{engine}=useJourney();useEffect(()=>{engine.pause()},[engine]);return <Stack.Navigator screenOptions={{headerShadowVisible:false,headerTitleStyle:{fontSize:18,fontWeight:'700'},headerTintColor:colors.primary,headerStyle:{backgroundColor:colors.background},contentStyle:{backgroundColor:colors.page}}}>
 <Stack.Screen name="Dashboard" component={DashboardScreen} options={{title:t('admin')}}/>
 <Stack.Screen name="AdminPlaces" component={AdminPlacesScreen} options={{title:t('places')}}/>
 <Stack.Screen name="PlaceForm" component={PlaceFormScreen} options={{title:t('edit')}}/>
 <Stack.Screen name="Content" component={ContentEditorScreen} options={{title:t('content')}}/>
 <Stack.Screen name="Reviews" component={ReviewsScreen} options={{title:t('reviews')}}/>
 </Stack.Navigator>}
/* CÁCH KIỂM TRA: start:admin mở quản lý; bản du khách không có route Admin. */
```

## 16. SỬA — apps/mobile/src/navigation/RootNavigator.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\navigation\RootNavigator.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Stack điều hướng mobile, giữ một NavigationContainer và một trình phát toàn app.
 * Vị trí: apps/mobile/src/navigation/RootNavigator.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { usePresenceHeartbeat } from '../hooks/usePresenceHeartbeat'
import { useJourneyNavigation } from '../hooks/useJourneyNavigation'
import SearchResultScreen from '../screens/SearchResultScreen'
import { JourneyPlayer } from '../components/JourneyPlayer'
import { JourneyScreen } from '../screens/JourneyScreen'
import MainTabs from './MainTabs'
import DetailScreen from '../screens/DetailScreen'
import { linking } from './linking'
import type { VisitorStack } from './types'
import { View } from 'react-native'
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useText } from '../i18n/index'

// CHỨC NĂNG: Tạo bộ điều hướng có kiểm tra kiểu tham số.
// XỬ LÝ: TypeScript kiểm tra tên màn hình và dữ liệu truyền giữa các màn.
const Stack =
  createNativeStackNavigator<VisitorStack>()
// CHỨC NĂNG: Hiển thị màn danh sách ở chế độ tìm kiếm.
// XỬ LÝ: Khi tham số route thay đổi, key thay đổi để khởi tạo
// màn tìm kiếm với đúng từ khóa và danh mục mới.
const navigationRef = createNavigationContainerRef<VisitorStack>()
const openSuggested = (id: string) => { if (navigationRef.isReady()) navigationRef.navigate('Detail', { placeId: id }) }
// CHỨC NĂNG: Đăng ký các màn hình của ứng dụng.
// XỬ LÝ:
// - Chỉ có một NavigationContainer.
// - linking xử lý liên kết mở app từ QR.
// - Tiêu đề lấy qua i18n để cập nhật khi đổi ngôn ngữ.
export default function RootNavigator() {
  const t = useText()
  usePresenceHeartbeat(true)
  useJourneyNavigation({ open: openSuggested })

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerBackTitle: t('explore'),
        }}
      >
        <Stack.Screen
          name="Places"
          component={MainTabs}
          options={{
            title: t('explore'),
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Search"
          component={SearchResultScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            title: t('details'),
          }}
        />


        <Stack.Screen name="Journey" component={JourneyScreen} options={{ title: t('jMap') }} />
      </Stack.Navigator>
      <JourneyPlayer />
      </View>
    </NavigationContainer>
  )
}
```

## 17. TẠO MỚI — apps/mobile/src/navigation/adminTypes.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\navigation\adminTypes.ts

```ts
/** FILE NÀY LÀM GÌ: Kiểu route Admin native; AdminNavigator và màn hình dùng.
 * UC12–UC17, không có màn Login. */
export type AdminStack = { Dashboard: undefined; AdminPlaces: undefined; PlaceForm: { id?: string } | undefined; Content: { id: string }; Reviews: undefined }
/* CÁCH KIỂM TRA: Content thiếu id phải báo TypeScript. */
```

## 18. SỬA — apps/mobile/src/navigation/types.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\navigation\types.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Tách riêng một phần giao diện để dễ tìm và bảo trì.
 * Vị trí: apps/mobile/src/navigation/types.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import type { Category } from '@travelguide/visitor-core'

// CHỨC NĂNG: Kiểm tra tham số điều hướng.
// XỬ LÝ: Detail bắt buộc placeId; Search nhận điều kiện ban đầu.
export type VisitorStack = {
  Places: undefined
  Search: {
    query?: string
    category?: Category
  }
  Detail: {
    placeId: string
  }
  Journey: { placeId?: string } | undefined
}
```

## 19. SỬA — apps/mobile/src/providers/AppProviders.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\providers\AppProviders.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Ghép các provider mobile một lần tại gốc, giữ nguyên khóa lưu ngôn ngữ/tiến độ.
 * Vị trí: apps/mobile/src/providers/AppProviders.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { AdminProvider } from '@travelguide/admin-core/react'
import { adminService, publicCatalog } from '../services/admin/services'
import type { ReactNode } from 'react'
import { ActivityIndicator } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { getLocales } from 'expo-localization'
import { VisitorProvider } from '@travelguide/visitor-core/react'
import { JourneyProvider } from '@travelguide/visitor-core/journey/react'
import { boot } from '../i18n'
import { storage } from '../services/platform'
import { journeyAdapters } from '../services/journeyAdapters'

const deviceLanguage = getLocales()[0]?.languageTag ?? null
// CHỨC NĂNG: Giữ thứ tự provider để điều hướng, ngôn ngữ và phiên nghe dùng chung trạng thái.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <VisitorProvider
        boot={boot}
        storage={storage}
        catalog={publicCatalog}
        deviceLanguage={deviceLanguage}
        loading={<ActivityIndicator />}
      >
        <AdminProvider service={adminService}><JourneyProvider adapters={journeyAdapters}>
          {children}
        </JourneyProvider></AdminProvider>
      </VisitorProvider>
    </SafeAreaProvider>
  )
}
```

## 20. SỬA — apps/mobile/src/screens/DetailScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\DetailScreen.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Hiển thị bài đọc đúng ngôn ngữ, nút nghe và nút mở bản đồ của địa điểm.
 * Vị trí: apps/mobile/src/screens/DetailScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */
import { PLACE_PHOTOS } from '@travelguide/visitor-core'


import { ListenButton } from '../components/ListenButton'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { availableLanguages, LANGUAGES, publishedText } from '@travelguide/visitor-core'
import { usePublishedPlace } from '../hooks/usePlaces'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { Action, DemoNotice, LanguageBar, PlaceImage, State, ui } from '../components/index'
import type { VisitorStack } from '../navigation/types'

// CHỨC NĂNG: Tải đúng địa điểm theo tham số điều hướng.
// XỬ LÝ: ID sai, lỗi tải và thiếu bản ngôn ngữ được xử lý riêng.
export default function DetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<
  VisitorStack,
  'Detail'
>) {
  const { placeId } = route.params

  const data = usePublishedPlace(placeId)

  const {
    language,
    changeLanguage,
    saving,
  } = useVisitor()

  const t = useText()

  // CHỨC NĂNG: Quay về danh sách.
  // XỬ LÝ: Hoạt động cả khi mở chi tiết từ QR.
  const back = () => {
    navigation.navigate('Places')
  }

  if (data.loading) {
    return (
      <State
        message="loading"
        busy
      />
    )
  }

  if (data.error || !data.place) {
    return (
      <State
        message={data.error ?? 'notFound'}
        retry={data.retry}
        back={back}
      />
    )
  }

  const place = data.place

  // CHỨC NĂNG: Chọn bài đọc bằng ngôn ngữ đang dùng trên giao diện.
  // XỬ LÝ: Không giữ useState riêng cho ngôn ngữ bài đọc.
  // Khi provider đổi language, tiêu đề/tab/bài đọc cùng render lại.
  const content = publishedText(
    place,
    language,
  )

  return (
    <SafeAreaView
      style={ui.page}
      edges={['bottom', 'left', 'right']}
    >
      <ScrollView
        contentContainerStyle={ui.content}
      >
        <LanguageBar />

        <DemoNotice />

        <PlaceImage
          uri={place.images[0]}
          title={place.canonicalTitle}
        />

        {PLACE_PHOTOS[place.id]?.note?.[language] && <Text style={ui.muted}>{PLACE_PHOTOS[place.id].note?.[language]}</Text>}

        <Text style={ui.title}>
          {content?.title ?? place.canonicalTitle}
        </Text>
        {place.period && <Text style={ui.muted}>{place.period}</Text>}

        <Text style={ui.muted}>
          {t('available')}
        </Text>

        <ListenButton id={place.id} />
        <Action title={t('jMap')} icon="map-outline" onPress={() => navigation.navigate('Journey', { placeId: place.id })} />
        <View style={ui.row}>
          {availableLanguages(place).map(
            (code) => (
              <Action
                key={code}
                title={
                  LANGUAGES.find(
                    (item) =>
                      item.code === code,
                  )?.label ?? code
                }
                selected={language === code}
                disabled={saving}
                onPress={() => {
                  // CHỨC NĂNG: Đổi ngôn ngữ cho toàn ứng dụng.
                  // XỬ LÝ: Provider cập nhật i18n và lưu AsyncStorage.
                  void changeLanguage(code)
                }}
              />
            ),
          )}
        </View>

        {content ? (
          <View style={ui.card}>
            <Text style={ui.muted}>
              {content.address}
            </Text>

            <Text style={ui.heading}>
              {t('read')}
            </Text>

            <Text style={ui.text}>
              {content.body}
            </Text>

            <Text style={ui.muted}>
              {t('version')}: {content.version}
            </Text>
          </View>
        ) : (
          <State message="missing" />
        )}

        <Text style={ui.muted}>
          {place.position?.verified
            ? (
              t('coordinates')
              + ': '
              + place.position.lat
              + ', '
              + place.position.lng
            )
            : t('unverified')}
        </Text>

        <Action
          title={t('back')}
          onPress={back}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
```

## 21. SỬA — apps/mobile/src/screens/SettingsScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\SettingsScreen.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Hiển thị chọn ngôn ngữ; không cung cấp QR hoặc chia sẻ liên kết cho du khách.
 * Vị trí: apps/mobile/src/screens/SettingsScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, Text } from 'react-native'
import { useText } from '../i18n/index'
import { LanguageBar, ui } from '../components/index'

// CHỨC NĂNG: Cho đổi ngôn ngữ.
// XỬ LÝ: Cùng provider với tiêu đề, danh sách và bài đọc.
export default function SettingsScreen() {
  const t = useText()

  return (
    <SafeAreaView style={ui.page}>
      <ScrollView contentContainerStyle={ui.content}>
        <Text style={ui.title}>{t('settings')}</Text>
        <LanguageBar />
        <Text style={ui.muted}>{t('noAccount')}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}
```

## 22. TẠO MỚI — apps/mobile/src/screens/admin/ContentEditorScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\admin\ContentEditorScreen.tsx

```tsx
/** FILE NÀY LÀM GÌ: Biên tập 5 ngôn ngữ native, audio URL và dịch/TTS demo.
 * AdminNavigator gọi; UC14/14.1/14.2. Dùng cùng service với web.
 * Form chưa lưu không được gửi duyệt/tạo tác vụ để tránh dùng văn bản cũ. */
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
import { useState, useRef } from 'react'
import { Alert,Text,View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { LANGUAGES } from '@travelguide/visitor-core'
import type { Language } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin,useAdminText } from '@travelguide/admin-core/react'
import type { AdminStack } from '../../navigation/adminTypes'
import { Action } from '../../components/Action'
import { Frame,Field,Feedback,PageHeader,SectionHeading,StatusBadge,LanguageTabs,styles,useUnsaved,AudioPreview } from '../../components/admin/AdminUI'
export function ContentEditorScreen({route}:NativeStackScreenProps<AdminStack,'Content'>){
 const state=useAdmin(),t=useAdminText(),[language,setLanguage]=useState<Language>('vi'),[dirty,setDirty]=useState(false)
 const fresh=state.data?.places.find(p=>p.id===route.params.id)
 const snapshot=useRef<ManagedPlace|undefined>(undefined)
 // CHỨC NĂNG: Giữ bản đang gõ; server sẽ báo conflict nếu revision bị thay đổi.
 if(!dirty||snapshot.current?.id!==route.params.id)snapshot.current=fresh
 const place=dirty?snapshot.current:fresh
 if(!place)return <Frame><Feedback state={state}/>{!state.loading&&<Text>{t('error_notFound')}</Text>}</Frame>
 const select=(code:Language)=>{const apply=()=>{setDirty(false);setLanguage(code)};if(!dirty)apply();else Alert.alert(t('admin'),t('unsaved'),[{text:t('cancel'),style:'cancel'},{text:LANGUAGES.find(l=>l.code===code)?.label,onPress:apply}])}
 return <Frame><PageHeader title={place.record.canonicalTitle} description={t('editorHint')}/>
  <View style={styles.row}><StatusBadge workflow={place.workflow}/><Text style={styles.muted}>{t('revision')} {place.revision}</Text></View>
  <LanguageTabs value={language} onChange={select}/>
  <View style={styles.notice}><Text style={[styles.muted,{flex:1}]}>{t('mockMedia')}</Text></View>
  <ContentForm key={place.id+language+place.revision} place={place} language={language} dirty={dirty} setDirty={setDirty}/>
 </Frame>
}
function ContentForm({place,language,dirty,setDirty}:{place:ManagedPlace;language:Language;dirty:boolean;setDirty:(v:boolean)=>void}){
 const state=useAdmin(),t=useAdminText(),text=place.record.content[language]
 const [title,setTitle]=useState(text?.title??''),[summary,setSummary]=useState(text?.summary??''),[body,setBody]=useState(text?.body??''),[address,setAddress]=useState(text?.address??'')
 const [audioUrl,setAudioUrl]=useState(text?.audio?.url.startsWith('demo:')?'':text?.audio?.url??'')
 useUnsaved(dirty)
 const change=(setter:(s:string)=>void)=>(s:string)=>{setDirty(true);setter(s)},disabled=state.busy||place.workflow==='archived'
 return <View style={{gap:16}}><Feedback state={state}/>
  <View style={styles.card}><SectionHeading title={t('basicInfo')} icon="document-text-outline"/>
  <Field label={t('title')} value={title} onChange={change(setTitle)}/><Field label={t('summary')} value={summary} onChange={change(setSummary)} multiline/>
  <Field label={t('address')} value={address} onChange={change(setAddress)}/><Field label={t('body')} value={body} onChange={change(setBody)} multiline/>
  </View>
  <View style={styles.card}><SectionHeading title={t('mediaSection')} icon="musical-notes-outline"/>
  <Field label={t('audio')} value={audioUrl.startsWith('data:')?t('localFile'):audioUrl} editable={!audioUrl.startsWith('data:')} onChange={change(setAudioUrl)}/>
  <LocalMediaPicker kind="audio" onPick={value=>{setAudioUrl(value);setDirty(true)}}/>
  {audioUrl.startsWith('data:')&&<Action title={t('clearFile')} onPress={()=>{setAudioUrl('');setDirty(true)}}/>}
  {text?.audio&&<AudioPreview url={text.audio.url} title={text.title}/>}
  </View>
  <View style={styles.card}><SectionHeading title={t('workflowSection')} icon="layers-outline"/>
  <Action title={t('save')} icon="save-outline" variant="primary" disabled={disabled} onPress={()=>{void state.run(()=>state.service.saveContent({id:place.id,language,expectedRevision:place.revision,title,summary,address,body,audioUrl:audioUrl.trim()||undefined})).then(ok=>{if(ok)setDirty(false)})}}/>
  <Action title={t('translate')} disabled={disabled||dirty||language==='vi'} onPress={()=>{void state.run(()=>state.service.translate(place.id,language,place.revision))}}/>
  <Action title={t('prepare')} disabled={disabled||dirty||!text?.body} onPress={()=>{void state.run(()=>state.service.generateAudio(place.id,language,place.revision))}}/>
  <Action title={t('submit')} icon="paper-plane-outline" disabled={disabled||dirty||!['draft','changes'].includes(place.workflow)} onPress={()=>{void state.run(()=>state.service.submit(place.id,place.revision))}}/>
  {!!place.reviewNote&&<Text style={styles.text}>{place.reviewNote}</Text>}
  </View>
 </View>
}
/* CÁCH KIỂM TRA: Lưu body mới bỏ audio cũ; tác vụ sai revision báo conflict, không ghi đè. */
```

## 23. TẠO MỚI — apps/mobile/src/screens/admin/DashboardScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\admin\DashboardScreen.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Trang tổng quan Admin mobile với bốn chỉ số và thao tác nhanh.
 * AdminNavigator gọi; phụ thuộc admin-core, presence RAM và bộ AdminUI. UC12–UC17.
 * Dữ liệu nội dung và lượt QR lấy từ API RAM chung; không có nút reset.
 */
import { useMemo, type ComponentProps } from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { dashboard } from '@travelguide/admin-core'
import { useAdmin, useAdminText, useGateStatistics } from '@travelguide/admin-core/react'
import { usePresenceStatistics } from '@travelguide/visitor-core/presence/react'
import type { AdminStack } from '../../navigation/adminTypes'
import { gateClient } from '../../services/admin/services'
import { adminPresenceClient } from '../../services/presence'
import { Action } from '../../components/Action'
import { Frame, Feedback, QuickAction, SectionHeading, styles } from '../../components/admin/AdminUI'
import { colors } from '../../theme'

export function DashboardScreen({navigation}:NativeStackScreenProps<AdminStack,'Dashboard'>) {
 const state=useAdmin(),t=useAdminText(),presence=usePresenceStatistics(adminPresenceClient),gate=useGateStatistics(gateClient)
 const metrics=useMemo(()=>state.data?dashboard(state.data):null,[state.data])
 const icons:Record<'active'|'gateToday'|'places'|'pending',ComponentProps<typeof Ionicons>['name']>={active:'people-outline',gateToday:'qr-code-outline',places:'business-outline',pending:'time-outline'}
 return <Frame>
  <View style={styles.hero}>
   <Text style={styles.brand}>HUEGUIDE</Text>
   <Text style={styles.heroTitle}>{t('dashboard')}</Text>
   <Text style={styles.heroText}>{t('overviewHint')}</Text>
  </View>
  <Feedback state={state}/>
  {/* CHỨC NĂNG: Active lấy API RAM, ba chỉ số khác lấy service cũ; không giả lập số. */}
  <View style={[styles.row,{alignItems:'stretch',gap:12}]}>
   {metrics&&(['active','gateToday','places','pending'] as const).map(key=><View key={key} style={[styles.metric,key==='active'&&{backgroundColor:colors.primary,borderColor:colors.primary}]}>
    <View style={[styles.metricIcon,key==='active'&&{backgroundColor:colors.playerControl}]}><Ionicons name={icons[key]} size={19} color={key==='active'?colors.white:colors.primary}/></View>
    <Text style={[styles.metricLabel,key==='active'&&{color:colors.white}]}>{t(key==='pending'?'status_submitted':key)}</Text>
    <Text style={[styles.number,key==='active'&&{color:colors.white}]}>{key==='active'?presence.stats?.active??'—':key==='gateToday'?gate.stats?.today??'—':metrics[key]}</Text>
   </View>)}
  </View>
  {presence.error?<View style={styles.card}><Text style={styles.error} accessibilityRole="alert">{t('presenceError')}</Text><Action title={t('retry')} icon="refresh-outline" onPress={presence.retry}/></View>:!presence.stats?<Text style={styles.muted}>{t('loading')}</Text>:null}
  <Text style={styles.muted}>{t('gateHint')}</Text>
  {gate.error&&<View style={styles.card}><Text style={styles.error}>{t('gateError')}</Text><Action title={t('retry')} onPress={gate.retry}/></View>}
  <SectionHeading title={t('quickActions')} icon="grid-outline"/>
  <QuickAction title={t('places')} description={t('managePlacesHint')} icon="business-outline" onPress={()=>navigation.navigate('AdminPlaces')}/>
  <QuickAction title={t('reviews')} description={t('reviewQueueHint')} icon="shield-checkmark-outline" onPress={()=>navigation.navigate('Reviews')}/>
  <Action title={t('new')} icon="add-outline" variant="primary" onPress={()=>navigation.navigate('PlaceForm')}/>
  <View style={styles.notice}><Ionicons name="pulse-outline" size={18} color={colors.primary}/><Text style={[styles.muted,{flex:1}]}>{t('analyticsHint')}</Text></View>
 </Frame>
}
/* CÁCH KIỂM TRA: Bốn ô không tràn; hai mục thao tác mở đúng màn; mất RAM server hiện —/thử lại. */
```

## 24. TẠO MỚI — apps/mobile/src/screens/admin/PlaceFormScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\admin\PlaceFormScreen.tsx

```tsx
/** FILE NÀY LÀM GÌ: Metadata native tương đương biểu mẫu web.
 * AdminNavigator gọi; UC13. Dùng cùng validatePlace/revision qua service. */
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
import { useState } from 'react'
import { Alert,Pressable,Switch,Text,View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { CATEGORIES,categoryOf } from '@travelguide/visitor-core'
import type { Category } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin,useAdminText } from '@travelguide/admin-core/react'
import { useText } from '../../i18n'
import type { AdminStack } from '../../navigation/adminTypes'
import { Action } from '../../components/Action'
import { Cover } from '../../components/Cover'
import { colors } from '../../theme'
import { Frame,Field,Feedback,PageHeader,SectionHeading,DangerAction,styles,useUnsaved } from '../../components/admin/AdminUI'
type Props=NativeStackScreenProps<AdminStack,'PlaceForm'>
export function PlaceFormScreen(props:Props){const state=useAdmin(),t=useAdminText(),id=props.route.params?.id,place=state.data?.places.find(p=>p.id===id)
 if(state.loading)return <Frame><Feedback state={state}/></Frame>
 if(id&&!place)return <Frame><Text>{t('error_notFound')}</Text></Frame>
 return <Form key={id??'new'} initial={place} navigation={props.navigation}/>
}
function Form({initial,navigation}:{initial?:ManagedPlace;navigation:Props['navigation']}){
 const [opened] = useState(initial)
 const state=useAdmin(),t=useAdminText(),vt=useText()
 const [title,setTitle]=useState(opened?.record.canonicalTitle??''),[category,setCategory]=useState<Category>(opened?categoryOf(opened.record):'palace')
 const [period,setPeriod]=useState(opened?.period??''),[lat,setLat]=useState(opened?.record.position?.lat.toString()??''),[lng,setLng]=useState(opened?.record.position?.lng.toString()??'')
 const [verified,setVerified]=useState(opened?.record.position?.verified??false),[images,setImages]=useState(opened?.record.images.join('\n')??''),[dirty,setDirty]=useState(false)
 const allowLeave=useUnsaved(dirty),change=(setter:(s:string)=>void)=>(s:string)=>{setDirty(true);setter(s)}
 return <Frame><PageHeader title={t(opened?'edit':'new')} description={t('catalogHint')}/><Feedback state={state}/>
  {/* CHỨC NĂNG: Chia metadata thành nhóm rõ ràng, không đổi state và validate của service. */}
  <View style={styles.card}>
   <SectionHeading title={t('basicInfo')} icon="business-outline"/>
   <Field label={t('title')} value={title} onChange={change(setTitle)}/>
   <Text style={styles.label}>{t('category')}</Text>
   <View style={styles.row}>{CATEGORIES.map(c=><Pressable key={c} accessibilityRole="button" accessibilityLabel={vt(`category_${c}`)} accessibilityState={{selected:category===c}}
    onPress={()=>{setCategory(c);setDirty(true)}} style={[styles.languageChip,category===c&&{backgroundColor:colors.soft,borderColor:colors.primary}]}>
    <Text style={{color:category===c?colors.primary:colors.muted,fontSize:12,fontWeight:'600'}}>{vt(`category_${c}`)}</Text>
   </Pressable>)}</View>
   <Field label={t('period')} value={period} onChange={change(setPeriod)}/>
  </View>
  <View style={styles.card}>
   <SectionHeading title={t('locationSection')} icon="location-outline"/>
   <View style={{flexDirection:'row',gap:10}}>
    <View style={{flex:1,minWidth:0}}><Field label={t('lat')} value={lat} onChange={change(setLat)}/></View>
    <View style={{flex:1,minWidth:0}}><Field label={t('lng')} value={lng} onChange={change(setLng)}/></View>
   </View>
   <View style={[styles.row,{flexWrap:'nowrap',justifyContent:'space-between'}]}>
    <Text style={[styles.label,{flex:1}]}>{t('verified')}</Text>
    <Switch accessibilityLabel={t('verified')} trackColor={{false:colors.border,true:colors.primary}} thumbColor={colors.white} value={verified} onValueChange={value=>{setVerified(value);setDirty(true)}}/>
   </View>
  </View>
  <View style={styles.card}>
   <SectionHeading title={t('mediaSection')} icon="images-outline"/>
   {!!images.trim()&&<Cover uri={images.split('\n').map(value=>value.trim()).find(Boolean)} style={{height:160,borderRadius:14}}/>}
   <Field label={t('images')} multiline value={images.split('\n').filter(s=>!s.startsWith('data:')).join('\n')} onChange={value=>{setImages([...images.split('\n').filter(s=>s.startsWith('data:')),value].filter(Boolean).join('\n'));setDirty(true)}}/>
   <LocalMediaPicker kind="image" onPick={value=>{setImages(old=>[old,value].filter(Boolean).join('\n'));setDirty(true)}}/>
   {images.includes('data:')&&<Action title={t('clearFile')} onPress={()=>{setImages(images.split('\n').filter(s=>!s.startsWith('data:')).join('\n'));setDirty(true)}}/>}
  </View>
  <View style={styles.card}><SectionHeading title={t('workflowSection')} icon="layers-outline"/>
  <Action title={t('save')} icon="save-outline" variant="primary" disabled={state.busy||opened?.workflow==='archived'} onPress={()=>{void state.run(()=>state.service.savePlace({id:opened?.id,expectedRevision:opened?.revision,title,category,period,lat,lng,verified,images:images.split('\n').map(s=>s.trim()).filter(Boolean)})).then(ok=>{if(ok){allowLeave();navigation.goBack()}})}}/>
  {opened&&opened.workflow!=='archived'&&<Action title={t('archive')} disabled={state.busy} onPress={()=>Alert.alert(t('archive'),t('confirmArchive'),[{text:t('cancel'),style:'cancel'},{text:t('archive'),style:'destructive',onPress:()=>{void state.run(()=>state.service.archive(opened.id,opened.revision)).then(ok=>{if(ok){allowLeave();navigation.goBack()}})}}])}/>}
  {/* CHỨC NĂNG: Xóa hẳn cả điểm đã lưu trữ; không xóa khi chưa xác nhận. */}
  {opened && <DangerAction title={t('delete')} disabled={state.busy} onPress={() => Alert.alert(t('delete'), t('confirmDelete') + '\n' + opened.record.canonicalTitle, [
    {text:t('cancel'),style:'cancel'},
    {text:t('delete'),style:'destructive',onPress:()=>{
      void state.run(()=>state.service.deletePlace(opened.id,opened.revision)).then(ok=>{
        if(ok){allowLeave();navigation.goBack()}
      })
    }},
  ])} />}
  </View>
 </Frame>
}
/* CÁCH KIỂM TRA: Back form bẩn có hỏi; lưu lỗi giữ giá trị; thêm mới không xuất hiện public trước duyệt. */
```

## 25. TẠO MỚI — apps/mobile/src/screens/admin/PlacesScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\admin\PlacesScreen.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Danh mục Admin dạng thẻ ảnh nhỏ, trạng thái và hai thao tác rõ ràng.
 * AdminNavigator gọi; phụ thuộc useAdmin, Cover, AdminUI. UC13.
 * Tìm kiếm debounce/không dấu và key ID giữ nguyên; không đổi service hoặc dữ liệu.
 */
import { useMemo, useState } from 'react'
import { FlatList, Pressable, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { normalize } from '@travelguide/visitor-core'
import { useDebounce } from '@travelguide/visitor-core/react'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import type { AdminStack } from '../../navigation/adminTypes'
import { Action } from '../../components/Action'
import { Cover } from '../../components/Cover'
import { DemoNotice, Feedback, PageHeader, StatusBadge, styles } from '../../components/admin/AdminUI'
import { colors } from '../../theme'
export function AdminPlacesScreen({navigation}:NativeStackScreenProps<AdminStack,'AdminPlaces'>) {
 const state=useAdmin(),t=useAdminText(),[query,setQuery]=useState(''),debounced=useDebounce(query)
 const places=useMemo(()=>state.data?.places.filter(p=>normalize(p.record.canonicalTitle).includes(normalize(debounced)))??[],[state.data,debounced])
 return <SafeAreaView style={styles.page} edges={['left','right','bottom']}>
  <FlatList data={places} keyExtractor={place=>place.id} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"
   ListHeaderComponent={<View style={{gap:16}}>
    <PageHeader title={t('places')} description={t('catalogHint')}/><Feedback state={state}/>
    <Action title={t('new')} icon="add-outline" variant="primary" onPress={()=>navigation.navigate('PlaceForm')}/>
    <View style={styles.searchBox}><Ionicons name="search-outline" size={20} color={colors.muted}/>
     <TextInput style={styles.searchInput} accessibilityLabel={t('search')} placeholder={t('search')} placeholderTextColor={colors.muted} value={query} onChangeText={setQuery} autoCorrect={false}/>
     {!!query&&<Pressable accessibilityRole="button" accessibilityLabel={t('clearSearch')} onPress={()=>setQuery('')} style={{padding:8}}><Ionicons name="close-circle" size={20} color={colors.muted}/></Pressable>}
    </View>
    <Text style={styles.muted}>{places.length} {t('places')}</Text>
   </View>}
   ListEmptyComponent={!state.loading&&!state.error?<View style={[styles.card,{alignItems:'center',paddingVertical:28}]}><Ionicons name="search-outline" size={32} color={colors.muted}/><Text style={styles.muted}>{t('empty')}</Text></View>:null}
   ListFooterComponent={<DemoNotice/>}
   // CHỨC NĂNG: FlatList chỉ dựng các thẻ cần thiết; ảnh cố định, nội dung tự xuống dòng.
   renderItem={({item})=><View style={styles.card}>
    <View style={{flexDirection:'row',gap:12,alignItems:'center'}}>
     <Cover uri={item.record.images[0]} style={styles.listImage}/>
     <View style={{flex:1,minWidth:0,gap:8}}><StatusBadge workflow={item.workflow}/><Text numberOfLines={2} style={styles.heading}>{item.record.canonicalTitle}</Text>
      {!!item.period&&<Text numberOfLines={1} style={styles.muted}>{item.period}</Text>}
     </View>
    </View>
    <View style={styles.divider}/>
    <View style={{flexDirection:'row',gap:10}}>
     <View style={{flex:1}}><Action title={t('edit')} icon="create-outline" onPress={()=>navigation.navigate('PlaceForm',{id:item.id})}/></View>
     <View style={{flex:1}}><Action title={t('content')} icon="document-text-outline" variant="primary" onPress={()=>navigation.navigate('Content',{id:item.id})}/></View>
    </View>
   </View>}
  />
 </SafeAreaView>
}
/* CÁCH KIỂM TRA: 'ky dai' tìm đúng; xóa tìm khôi phục danh sách; hai nút truyền đúng place ID. */
```

Đã gỡ màn QR admin: apps/mobile/src/screens/admin/QrScreen.tsx


## 27. TẠO MỚI — apps/mobile/src/screens/admin/ReviewsScreen.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\screens\admin\ReviewsScreen.tsx

```tsx
/** FILE NÀY LÀM GÌ: Danh sách chờ duyệt, so sánh năm bản và công bố native.
 * AdminNavigator gọi; UC15–UC16. Gọi cùng service kiểm tra revision với web. */
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AdminStack } from '../../navigation/adminTypes'
import { useState } from 'react'
import { Alert,FlatList,Text,View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Cover } from '../../components/Cover'
import { colors } from '../../theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { Language } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin,useAdminText } from '@travelguide/admin-core/react'
import { Action } from '../../components/Action'
import { DemoNotice,Feedback,Field,PageHeader,StatusBadge,LanguageTabs,SectionHeading,styles,AudioPreview } from '../../components/admin/AdminUI'
export function ReviewsScreen(){const state=useAdmin(),t=useAdminText(),places=state.data?.places.filter(p=>['submitted','approved','changes'].includes(p.workflow))??[]
 return <SafeAreaView style={styles.page} edges={['left','right','bottom']}><FlatList data={places} keyExtractor={p=>p.id+p.revision+p.workflow} contentContainerStyle={styles.content}
  ListHeaderComponent={<View style={{gap:16}}><PageHeader title={t('reviews')} description={t('reviewQueueHint')}/><Feedback state={state}/><Text style={styles.muted}>{places.length} {t('reviews')}</Text></View>}
  ListFooterComponent={<DemoNotice/>}
  ListEmptyComponent={!state.loading&&!state.error?<View style={[styles.card,{alignItems:'center',paddingVertical:32}]}><Ionicons name="shield-checkmark-outline" size={36} color={colors.primary}/><Text style={styles.muted}>{t('empty')}</Text></View>:null} renderItem={({item})=><Review place={item}/>}/></SafeAreaView>
}
function Review({place}:{place:ManagedPlace}){
 const navigation=useNavigation<NativeStackNavigationProp<AdminStack>>()
 const state=useAdmin(),t=useAdminText(),[language,setLanguage]=useState<Language>('vi'),[note,setNote]=useState(''),text=place.record.content[language]
 // CHỨC NĂNG: Thẻ duyệt tách nhận diện di tích, ngôn ngữ, nội dung và hành động.
 // XỬ LÝ: Nội dung vẫn hiển thị đầy đủ; mọi nút giữ điều kiện workflow/revision cũ.
 return <View style={styles.card}>
  <View style={{flexDirection:'row',gap:12,alignItems:'center'}}>
   <Cover uri={place.record.images[0]} style={{width:70,height:78,borderRadius:12}}/>
   <View style={{flex:1,minWidth:0,gap:7}}><StatusBadge workflow={place.workflow}/><Text style={styles.heading}>{place.record.canonicalTitle}</Text></View>
  </View>
  <Text style={styles.muted}>{t('revision')}: {place.revision} · {t('current')}: {place.published?.content.vi?.version??t('none')}</Text>
  <View style={styles.divider}/>
  <LanguageTabs value={language} onChange={setLanguage}/>
  <View style={{gap:8,padding:12,borderRadius:13,backgroundColor:colors.page}}>
   <Text style={styles.label}>{text?.title??t('none')}</Text><Text style={styles.text}>{text?.body??t('none')}</Text>
  </View>
  {text?.audio&&<AudioPreview key={language} url={text.audio.url} title={text.title}/>}
  <SectionHeading title={t('note')} icon="chatbubble-ellipses-outline"/>
  <Field label={t('note')} value={note} onChange={setNote} multiline/>{!!place.reviewNote&&<Text>{place.reviewNote}</Text>}
  <Action title={t('content')} icon="document-text-outline" onPress={()=>navigation.navigate('Content',{id:place.id})}/>
  <Feedback state={state}/>
  {place.workflow==='submitted'&&<><Action title={t('approve')} icon="checkmark-circle-outline" variant="primary" disabled={state.busy} onPress={()=>{void state.run(()=>state.service.review(place.id,place.revision,true,note))}}/><Action title={t('reject')} icon="return-down-back-outline" disabled={state.busy||!note.trim()} onPress={()=>{void state.run(()=>state.service.review(place.id,place.revision,false,note))}}/></>}
  {place.workflow==='approved'&&<Action title={t('publish')} icon="globe-outline" variant="primary" disabled={state.busy} onPress={()=>Alert.alert(t('publish'),t('confirmPublish'),[{text:t('cancel'),style:'cancel'},{text:t('publish'),onPress:()=>{void state.run(()=>state.service.publish(place.id,place.revision))}}])}/>}
 </View>
}
/* CÁCH KIỂM TRA: Duyệt chưa public; sửa sau duyệt chặn publish; xác nhận mới công bố. */
```

## 28. TẠO MỚI — apps/mobile/src/services/admin/services.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\mobile\src\services\admin\services.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Ghép API RAM chung vào Admin và danh mục du khách của nền tảng.
 * Provider và Dashboard gọi; UC12–UC17. Không tự quay về kho cục bộ khi mất mạng.
 * Bản nháp chỉ đọc qua Admin; publicCatalog chỉ lấy /published.
 */
import { createHttpAdminService, createGateClient } from '@travelguide/admin-core'
import { createCatalog } from '@travelguide/visitor-core'
import { webOrigin } from '../platform'
const base = process.env.EXPO_PUBLIC_ADMIN_API_URL || ''
// URL public có thể đi qua web tunnel; địa chỉ quản lý LAN tách riêng.
const publicBase = process.env.EXPO_PUBLIC_CATALOG_API_URL || (webOrigin ? webOrigin+'/api/catalog' : base)
export const adminService = createHttpAdminService(base)
const publicService = createHttpAdminService(publicBase)
export const gateClient = createGateClient(base)
export const visitorGateClient = createGateClient(publicBase)
export const publicCatalog = createCatalog(()=>publicService.published(),publicService.subscribe)
/* CÁCH KIỂM TRA: Web lưu rồi mobile thấy sau khoảng 3 giây; mất API hiện lỗi; public không lộ nháp. */
```

## 29. SỬA — apps/web/package.json

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\package.json

```json
{
  "name": "web",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "prebuild": "node ../../scripts/generate-app-links.cjs --if-configured",
    "build": "vite build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx",
    "dev:admin": "vite --mode admin --host 127.0.0.1 --port 5174 --strictPort",
    "build:admin": "vite build --mode admin",
    "preview:admin": "vite preview --mode admin --host 127.0.0.1 --port 4174 --strictPort"
  },
  "dependencies": {
    "@travelguide/place-core": "*",
    "@travelguide/shared-types": "*",
    "@travelguide/visitor-core": "^0.1.0",
    "i18next": "^26.4.2",
    "leaflet": "^1.9.4",
    "qrcode": "^1.5.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-i18next": "^17.0.15",
    "react-router-dom": "^6.22.0",
    "@travelguide/admin-core": "*"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.22",
    "@types/qrcode": "^1.5.5",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "typescript": "^5.4.0",
    "vite": "^5.1.0"
  }
}
```

## 30. SỬA — apps/web/src/components/Navbar.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\components\Navbar.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Thanh điều hướng web, logo, chọn ngôn ngữ và liên kết QR chung.
 * Vị trí: apps/web/src/components/Navbar.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { Link, NavLink } from 'react-router-dom'
import { useText } from '../i18n/index'
import { LanguagePicker } from './index'

export function Navbar() { const t = useText(); return (<header className="navbar">
        <div className="nav-inner">
          <Link className="brand" to="/">
            <span className="brand-mark" aria-hidden="true">🏯</span>
            <span>
              <strong>{t('site')}</strong>
              <small>{t('tagline')}</small>
            </span>
          </Link>

          <nav aria-label={t('explore')}>
            <NavLink end to="/">{t('home')}</NavLink>
            <NavLink to="/places">{t('explore')}</NavLink>

            <NavLink to="/journey">{t('jMap')}</NavLink>

            <NavLink to="/about">{t('about')}</NavLink>
          </nav>

          <div className="nav-actions">
            <LanguagePicker />


          </div>
        </div>
      </header>) }
```

## 31. TẠO MỚI — apps/web/src/components/admin/AdminUI.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\components\admin\AdminUI.tsx

```tsx
/** FILE NÀY LÀM GÌ: Thành phần và hooks nhỏ dùng lại trong Admin Web.
 * Các trang admin gọi; phụ thuộc admin-core/react. UC12–UC17. */
import { useEffect, useState, type ReactNode } from 'react'
import { useAdminText } from '@travelguide/admin-core/react'
import type { Workflow } from '@travelguide/admin-core'
import { useAdmin } from '@travelguide/admin-core/react'
export function Status({ value }: { value: Workflow }) {
 const t = useAdminText(); return <span className={'admin-badge state-' + value}>{t(`status_${value}`)}</span>
}
export function Feedback({ state }: { state: ReturnType<typeof useAdmin> }) {
 const t = useAdminText(); return <>
  {state.loading && <p role="status">{t('loading')}</p>}
  {state.error && <div className="admin-error" role="alert">{t(`error_${state.error}`)} <button className="secondary" onClick={() => { void state.reload() }}>{t('retry')}</button></div>}
  {state.success && <p className="admin-success" role="status">{t('saved')}</p>}
 </>
}
export function Field({ label, children }: { label: string; children: ReactNode }) {
 return <label className="admin-field"><span>{label}</span>{children}</label>
}
// CHỨC NĂNG: Bảo vệ thay đổi khi đóng/tải lại tab và bấm liên kết rời form.
// XỬ LÝ: Gỡ đúng listener; không chặn nút lưu hoặc điều hướng sau lưu thành công.
export function useUnsaved(dirty: boolean) {
 const t = useAdminText(), message = t('unsaved')
 useEffect(() => {
  if (!dirty) return
  const unload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
  const click = (event: MouseEvent) => {
   const anchor = event.target instanceof Element ? event.target.closest('a') : null
   if (anchor && anchor.getAttribute('href') && !anchor.hasAttribute('download') && !window.confirm(message)) { event.preventDefault(); event.stopPropagation() }
  }
  window.addEventListener('beforeunload', unload); document.addEventListener('click', click, true)
  return () => { window.removeEventListener('beforeunload', unload); document.removeEventListener('click', click, true) }
 }, [dirty, message])
}
/* CÁCH KIỂM TRA: Mỗi trạng thái có nhãn; bấm liên kết khi form bẩn phải hỏi trước. */

// CHỨC NĂNG: Hộp xác nhận trong app, không dùng hộp modal chặn của trình duyệt.
export function useConfirmation() {
 const t=useAdminText(),[pending,setPending]=useState<{message:string;run:()=>void}|null>(null)
 return {ask:(message:string,run:()=>void)=>setPending({message,run}),dialog:pending&&<div className="admin-modal-backdrop"><section className="admin-confirm" role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title"><h2 id="admin-confirm-title">{t('admin')}</h2><p>{pending.message}</p><div className="admin-actions"><button type="button" className="secondary" onClick={()=>setPending(null)}>{t('cancel')}</button><button type="button" autoFocus onClick={()=>{const run=pending.run;setPending(null);run()}}>{t('confirm')}</button></div></section></div>}
}
```

## 32. TẠO MỚI — apps/web/src/components/admin/LocalMediaPicker.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\components\admin\LocalMediaPicker.tsx

```tsx
/** FILE NÀY LÀM GÌ: Chọn tệp local cho bản FE, không giả gọi upload server.
 * PlaceForm/ContentEditor dùng; UC13–UC14.2. Giới hạn 1 MB để tránh đầy localStorage.
 * Khi có BE, thay bước đọc base64 bằng MediaService upload trả về URL. */
import { useState } from 'react'
import { useAdminText } from '@travelguide/admin-core/react'
export function LocalMediaPicker({ kind,onPick }: {kind:'image'|'audio';onPick:(value:string)=>void}) {
 const t=useAdminText(),[error,setError]=useState(false)
 return <div className="admin-local-file"><label className="button secondary">{t(kind==='image'?'pickImage':'pickAudio')}<input type="file" accept={kind==='image'?'image/jpeg,image/png,image/webp':'audio/mpeg,audio/wav,audio/ogg'} onChange={event=>{
  const file=event.target.files?.[0];event.target.value='';setError(false)
  if(!file)return
  const types=kind==='image'?['image/jpeg','image/png','image/webp']:['audio/mpeg','audio/mp3','audio/wav','audio/ogg']
  if(file.size>1048576||!types.includes(file.type)){setError(true);return}
  const reader=new FileReader();reader.onerror=()=>setError(true)
  reader.onload=()=>{if(typeof reader.result==='string')onPick(reader.result)};reader.readAsDataURL(file)
 }}/></label><p>{t('fileHint')}</p>{error&&<p role="alert" className="admin-error">{t('mediaError')}</p>}</div>
}
/* CÁCH KIỂM TRA: Tệp >1MB bị từ chối; ảnh/audio chọn được giữ sau tải lại khi đã lưu. */
```

## 33. TẠO MỚI — apps/web/src/layouts/AdminLayout.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\layouts\AdminLayout.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Khung Admin web gồm menu, danh tính được cấp và vùng trang con.
 * AdminRoutes gọi; dùng AdminProvider, JourneyProvider và LanguagePicker hiện có.
 * Liên quan UC12–UC17. CSS responsive giữ cùng tông xanh–trắng với Admin mobile.
 */
import { useVisitor } from '@travelguide/visitor-core/react'
import { useEffect } from 'react'
import { useJourney } from '../hooks/useJourney'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { LanguagePicker } from '../components/LanguagePicker'
import { AdminIcon, type AdminIconName } from '../components/admin/AdminIcon'
import '../styles/admin.css'
export function AdminLayout() {
 const t = useAdminText(), state = useAdmin(), { engine } = useJourney(), { language } = useVisitor(), { pathname } = useLocation()
 // CHỨC NĂNG: Dừng tiếng du khách khi vào quản lý và cập nhật ngôn ngữ tài liệu.
 // XỬ LÝ: Chỉ dùng instance đang có; mã cn nội bộ được chuyển thành zh-CN cho HTML.
 useEffect(() => { engine.pause() }, [engine])
 useEffect(() => { document.title = 'HueGuide · ' + t('admin'); document.documentElement.lang = language === 'cn' ? 'zh-CN' : language }, [language,t])
 const current = pathname.includes('/reviews') ? 'reviews' : pathname.includes('/places') ? 'places' : 'dashboard'
 const menu: {key: 'dashboard' | 'places' | 'reviews'; icon: AdminIconName; to: string}[] = [
  {key:'dashboard',icon:'dashboard',to:'/admin'},
  {key:'places',icon:'places',to:'/admin/places'},
  {key:'reviews',icon:'review',to:'/admin/reviews'},
 ]
 return <div className="admin-shell">
  <aside className="admin-sidebar">
   <Link className="admin-brand" to="/admin"><span className="admin-brand-icon"><AdminIcon name="places"/></span><strong>HueGuide<small>{t('admin')}</small></strong></Link>
   {/* CHỨC NĂNG: Menu có icon và trạng thái đang chọn; màn nhỏ cuộn ngang. */}
   <nav aria-label={t('admin')}>{menu.map(item => <NavLink end={item.key === 'dashboard'} key={item.key} to={item.to}><AdminIcon name={item.icon}/><span>{t(item.key)}</span><span className="admin-nav-arrow"><AdminIcon name="arrow"/></span></NavLink>)}</nav>
   <div className="admin-sidebar-note"><AdminIcon name="review"/><strong>{t('admin')}</strong><p>{t('overviewHint')}</p></div>
  </aside>
  <main className="admin-main">
   <header className="admin-topbar"><div><small>HUEGUIDE / {t('admin')}</small><strong>{t(current)}</strong></div><div className="admin-topbar-tools"><LanguagePicker/><div className="admin-identity"><span aria-hidden="true">HG</span><div><strong>{state.identity?.displayName ?? 'HueGuide'}</strong><small>{t('admin')}</small></div></div></div></header>
   <div className="admin-workspace"><Outlet/><div className="admin-demo admin-footnote" role="note">{t('demo')}</div></div>
  </main>
 </div>
}
/* CÁCH KIỂM TRA: Menu đổi đúng route; đổi ngôn ngữ đổi tiêu đề; ở màn nhỏ không tràn ngang trang. */
```

## 34. SỬA — apps/web/src/main.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\main.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Mount React 18, BrowserRouter và các provider; giữ ngôn ngữ/tiến độ dùng chung.
 * Vị trí: apps/web/src/main.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { publicCatalog } from './services/admin/services'
import { boot } from './i18n'
import { JourneyProvider } from '@travelguide/visitor-core/journey/react'
import { journeyAdapters } from './services/journeyAdapters'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { VisitorProvider } from '@travelguide/visitor-core/react'
import { colors, spacing } from '../../../packages/ui-tokens/colors'
import { storage } from './services/platform'
import App from './App'
import './styles/index.css'
import './styles/player.css'

// CHỨC NĂNG: Cho CSS dùng chung token với mobile.
// XỬ LÝ: Màu là chuỗi; spacing được đổi thành đơn vị px.
for (const [key, value] of Object.entries(colors)) {
  document.documentElement.style.setProperty('--' + key, value)
}

for (const [key, value] of Object.entries(spacing)) {
  document.documentElement.style.setProperty(
    '--space-' + key,
    value + 'px',
  )
}

const root = document.getElementById('root')

if (!root) throw new Error('Missing root element')

// CHỨC NĂNG: Khởi tạo ngôn ngữ trước khi mở các trang.
// XỬ LÝ: BrowserRouter giữ route chi tiết khi truy cập bằng QR.
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <VisitorProvider
      boot={boot}
      storage={storage}
      catalog={publicCatalog}
      deviceLanguage={
        navigator.languages?.[0] ?? navigator.language
      }
      loading={<progress />}
    >
      <BrowserRouter>
        <JourneyProvider adapters={journeyAdapters}><App /></JourneyProvider>
      </BrowserRouter>
    </VisitorProvider>
  </React.StrictMode>,
)
```

## 35. TẠO MỚI — apps/web/src/navigation/AdminRoutes.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\navigation\AdminRoutes.tsx

```tsx
/** FILE NÀY LÀM GÌ: Cây route Admin Web, không có route đăng nhập theo phạm vi FE.
 * AppRoutes gọi; layout nằm ngoài layout du khách. UC12–UC17.
 * Giữ service phiên/quyền để nối BE; route này không phải hàng rào bảo mật. */
import { Route, Routes } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'
import { DashboardPage } from '../pages/admin/DashboardPage'
import { AdminPlacesPage } from '../pages/admin/PlacesPage'
import { PlaceFormPage } from '../pages/admin/PlaceFormPage'
import { ContentEditorPage } from '../pages/admin/ContentEditorPage'
import { ReviewsPage } from '../pages/admin/ReviewsPage'
import { NotFoundPage } from '../pages/NotFoundPage'
export function AdminRoutes() { return <Routes><Route element={<AdminLayout />}>
 <Route index element={<DashboardPage />} /><Route path="places" element={<AdminPlacesPage />} />
 <Route path="places/new" element={<PlaceFormPage />} /><Route path="places/:id/edit" element={<PlaceFormPage />} />
 <Route path="places/:id/content" element={<ContentEditorPage />} /><Route path="reviews" element={<ReviewsPage />} />
<Route path="*" element={<NotFoundPage />} />
</Route></Routes> }
/* CÁCH KIỂM TRA: /admin vào thẳng; refresh /admin/places/ID/content vẫn mở đúng màn. */
```

## 36. SỬA — apps/web/src/navigation/AppRoutes.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\navigation\AppRoutes.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Bảng route web; không chứa code UI của từng trang.
 * Vị trí: apps/web/src/navigation/AppRoutes.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

// CHỨC NĂNG: Bản du khách chỉ đăng ký các route công khai.
// XỬ LÝ: Không import hoặc tải cây màn hình Admin; /admin không tồn tại ở bản này.
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { HomePage } from '../pages/HomePage'
import { PlacesPage } from '../pages/PlacesPage'
import { DetailPage } from '../pages/DetailPage'
import { JourneyPage } from '../pages/JourneyPage'
import { AboutPage } from '../pages/AboutPage'
import { NotFoundPage } from '../pages/NotFoundPage'

// CHỨC NĂNG: Giữ nguyên mọi URL cũ, bao gồm QR chung và deep link chi tiết.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/places/:id" element={<DetailPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
```

## 37. SỬA — apps/web/src/pages/DetailPage.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\DetailPage.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Trang bài đọc, đổi ngôn ngữ, nghe thuyết minh và mở marker địa điểm.
 * Vị trí: apps/web/src/pages/DetailPage.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */
import { PLACE_PHOTOS } from '@travelguide/visitor-core'


import { ListenButton } from '../components/ListenButton'
import { Link, useParams } from 'react-router-dom'
import { availableLanguages, LANGUAGES, publishedText, validPoint } from '@travelguide/visitor-core'
import { usePublishedPlace } from '../hooks/usePlaces'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { PlaceImage, State, Icon } from '../components/index'

// CHỨC NĂNG: Hiển thị chi tiết địa điểm theo route /places/:id.
// XỬ LÝ:
// - Tải dữ liệu thông qua hook và service.
// - Phân biệt đang tải, lỗi và không tìm thấy.
// - Không tạo QR tại trang chi tiết.
export function DetailPage() {
  const { id = '' } = useParams()

  const data = usePublishedPlace(id)

  const {
    language,
    changeLanguage,
    saving,
  } = useVisitor()

  const t = useText()

  // CHỨC NĂNG: Hiển thị trạng thái chờ dữ liệu.
  // XỬ LÝ: Chưa đọc place khi request chưa hoàn thành.
  if (data.loading) {
    return (
      <State
        message="loading"
        busy
      />
    )
  }

  // CHỨC NĂNG: Hiển thị lỗi hoặc địa điểm không tồn tại.
  // XỬ LÝ: Có nút thử lại và đường quay về danh sách.
  if (data.error || !data.place) {
    return (
      <section className="detail">
        <State
          message={
            data.error ?? 'notFound'
          }
          retry={data.retry}
        />

        <Link to="/places">
          {t('back')}
        </Link>
      </section>
    )
  }

  const place = data.place

  // CHỨC NĂNG: Lấy bài đọc bằng ngôn ngữ chung của giao diện.
  // XỬ LÝ:
  // - Không giữ lựa chọn ngôn ngữ riêng trong trang chi tiết.
  // - Đổi ngôn ngữ sẽ đổi cả UI và bài đọc.
  // - Thiếu bản công bố thì trả undefined để hiện thông báo.
  const content = publishedText(
    place,
    language,
  )

  const title =
    content?.title
    ?? place.canonicalTitle

  // CHỨC NĂNG: Chỉ liệt kê các bản ngôn ngữ đã công bố.
  // XỬ LÝ: Không cho chọn nội dung nháp hoặc chưa duyệt.
  const languages =
    availableLanguages(place)

  const position = place.position

  // CHỨC NĂNG: Kiểm tra tọa độ trước khi hiển thị.
  // XỬ LÝ: Cần cả trạng thái xác nhận và giá trị tọa độ hợp lệ.
  // Đoạn này không theo dõi GPS và không tự xác định địa điểm.
  const hasVerifiedPosition =
    position?.verified === true
    && validPoint(position)

  return (
    <article className="detail">
      <Link to="/places">
        {t('back')}
      </Link>

      <h1>{title}</h1>
      {place.period && <p>{place.period}</p>}

      <PlaceImage
        uri={place.images[0]}
        title={title}
      />

      {PLACE_PHOTOS[place.id]?.note?.[language] && <p className="photo-caption">{PLACE_PHOTOS[place.id].note?.[language]}</p>}
      <div className="detail-actions">
        <ListenButton id={place.id} />
        <Link className="button secondary" to={'/journey?placeId=' + place.id}><Icon name="pin" />{t('jMap')}</Link>
      </div>
      <p>{t('available')}</p>

      <div className="language-options">
        {languages.map((code) => {
          const label = LANGUAGES.find(
            (item) => item.code === code,
          )?.label ?? code

          return (
            <button
              key={code}
              type="button"
              aria-pressed={
                language === code
              }
              disabled={saving}
              onClick={() => {
                // CHỨC NĂNG: Đổi ngôn ngữ toàn website.
                // XỬ LÝ: Provider cập nhật i18n và lưu lựa chọn;
                // không chỉ đổi riêng bài đọc trên trang này.
                void changeLanguage(code)
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {content ? (
        <section>
          <p>{content.address}</p>

          <h2>{t('read')}</h2>

          <p className="narration">
            {content.body}
          </p>

          <p>
            {t('version')}: {content.version}
          </p>
        </section>
      ) : (
        <State message="missing" />
      )}

      <p>
        {hasVerifiedPosition && position
          ? (
            t('coordinates')
            + ': '
            + position.lat
            + ', '
            + position.lng
          )
          : t('unverified')}
      </p>

      {/* CHỨC NĂNG: Chi tiết chỉ hiển thị thông tin địa điểm.
          XỬ LÝ: Không đặt QrImage tại đây.
          GPS được điều phối qua useJourneyNavigation; chi tiết không tự phát audio. */}
    </article>
  )
}
```

## 38. TẠO MỚI — apps/web/src/pages/admin/ContentEditorPage.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\ContentEditorPage.tsx

```tsx
/** FILE NÀY LÀM GÌ: Biên tập năm ngôn ngữ, bản thu URL, dịch/TTS demo và gửi duyệt.
 * /admin/places/:id/content; UC14/14.1/14.2. Không gửi API key hoặc gọi dịch thật.
 * Mỗi bản form giữ expectedRevision; service chặn kết quả dịch cũ ghi đè bản mới. */
import { AdminIcon } from '../../components/admin/AdminIcon'
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { LANGUAGES } from '@travelguide/visitor-core'
import type { Language } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { Feedback, Field, Status, useUnsaved } from '../../components/admin/AdminUI'
export const audioSource = (url: string) => url.startsWith('demo:') ? '/demo-audio/' + url.slice(5) + '.mp3' : url
export function ContentEditorPage() {
 const state = useAdmin(), t = useAdminText(), { id } = useParams()
 const [language,setLanguage] = useState<Language>('vi'), [dirty,setDirty] = useState(false)
 const fresh = state.data?.places.find(p => p.id === id)
 const snapshot = useRef<ManagedPlace | undefined>(undefined)
 // CHỨC NĂNG: Poll từ máy khác không xóa nội dung chưa lưu.
 if (!dirty || snapshot.current?.id !== id) snapshot.current = fresh
 const place = dirty ? snapshot.current : fresh
 if (state.loading || !place) return <><Feedback state={state} />{!state.loading && <p>{t('error_notFound')}</p>}</>
 return <><div className="admin-page-title"><div><h1>{place.record.canonicalTitle}</h1><p>{t('editorHint')} · {t('revision')}: {place.revision}</p></div><Status value={place.workflow} /></div>
  <p className="admin-demo">{t('mockMedia')}</p>
  <div className="admin-language-tabs">{LANGUAGES.map(l => <button key={l.code} className={language === l.code ? '' : 'secondary'} aria-pressed={language === l.code} onClick={() => { if(!dirty || window.confirm(t('unsaved'))) { setDirty(false); setLanguage(l.code) } }}>{l.label}</button>)}</div>
  <ContentForm key={place.id + language + place.revision} place={place} language={language} dirty={dirty} setDirty={setDirty} />
 </>
}
function ContentForm({ place, language, dirty, setDirty }: { place: ManagedPlace; language: Language; dirty: boolean; setDirty: (value: boolean) => void }) {
 const state = useAdmin(), t = useAdminText(), text = place.record.content[language]
 const [title,setTitle] = useState(text?.title ?? ''), [summary,setSummary] = useState(text?.summary ?? '')
 const [body,setBody] = useState(text?.body ?? ''), [address,setAddress] = useState(text?.address ?? '')
 const [audioUrl,setAudioUrl] = useState(text?.audio?.url.startsWith('demo:') ? '' : text?.audio?.url ?? '')
 useUnsaved(dirty)
 const disabled = state.busy || place.workflow === 'archived'
 return <><Feedback state={state} /><form className="admin-card admin-form" onChange={() => setDirty(true)} onSubmit={event => {
  event.preventDefault(); void state.run(() => state.service.saveContent({ id: place.id, language, expectedRevision: place.revision, title, summary, body, address, audioUrl: audioUrl.trim() || undefined })).then(ok => { if(ok) setDirty(false) })
 }}>
  {/* CHỨC NĂNG: Tách nội dung và âm thanh để người biên tập không bỏ sót bước lưu. */}
  <section className="admin-form-section"><h2><AdminIcon name="content"/>{t('basicInfo')}</h2>
  <Field label={t('title')}><input value={title} required onChange={e => setTitle(e.target.value)} /></Field>
  <Field label={t('summary')}><textarea value={summary} rows={2} onChange={e => setSummary(e.target.value)} /></Field>
  <Field label={t('address')}><input value={address} onChange={e => setAddress(e.target.value)} /></Field>
  <Field label={t('body')}><textarea value={body} required rows={10} onChange={e => setBody(e.target.value)} /></Field>
  </section>
  <section className="admin-form-section"><h2><AdminIcon name="image"/>{t('mediaSection')}</h2>
  <Field label={t('audio')}><input value={audioUrl.startsWith('data:') ? t('localFile') : audioUrl} readOnly={audioUrl.startsWith('data:')} onChange={e => setAudioUrl(e.target.value)} placeholder="https://…/audio.mp3" /></Field>
  <LocalMediaPicker kind="audio" onPick={value => { setAudioUrl(value);setDirty(true) }} />
  {audioUrl.startsWith('data:') && <button type="button" className="secondary" onClick={()=>{setAudioUrl('');setDirty(true)}}>{t('clearFile')}</button>}
  {text?.audio && <div className="admin-audio"><span>{t('preview')}</span><audio controls preload="metadata" src={audioSource(text.audio.url)} /></div>}
  </section>
  <section className="admin-form-section"><h2><AdminIcon name="save"/>{t('workflowSection')}</h2>
  <div className="admin-actions"><button disabled={disabled}>{t('save')}</button>
   <button type="button" className="secondary" disabled={disabled || dirty || language === 'vi'} onClick={() => { void state.run(() => state.service.translate(place.id, language, place.revision)) }}>{t('translate')}</button>
   <button type="button" className="secondary" disabled={disabled || dirty || !text?.body} onClick={() => { void state.run(() => state.service.generateAudio(place.id, language, place.revision)) }}>{t('prepare')}</button>
   <button type="button" className="secondary" disabled={disabled || dirty || !['draft','changes'].includes(place.workflow)} onClick={() => { void state.run(() => state.service.submit(place.id, place.revision)) }}>{t('submit')}</button>
  </div>
  {place.reviewNote && <p className="admin-note">{t('note')}: {place.reviewNote}</p>}
 </section></form></>
}
/* CÁCH KIỂM TRA: Lưu trước khi dịch/tạo audio; đổi tab khi bẩn có hỏi; sửa body xóa audio cũ. */
```

## 39. TẠO MỚI — apps/web/src/pages/admin/DashboardPage.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\DashboardPage.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Tổng quan Admin web, bốn chỉ số và lối vào nghiệp vụ nhanh.
 * AdminRoutes gọi tại /admin; phụ thuộc admin-core, presence RAM và UI Admin.
 * UC12, UC17. Giữ số phiên thực từ API; không tạo số liệu minh họa khi mất kết nối.
 */
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePresenceStatistics } from '@travelguide/visitor-core/presence/react'
import { presenceClient } from '../../services/presence'
import { dashboard } from '@travelguide/admin-core'
import { useAdmin, useAdminText, useGateStatistics } from '@travelguide/admin-core/react'
import { Feedback } from '../../components/admin/AdminUI'
import { gateClient } from '../../services/admin/services'
import { AdminIcon, type AdminIconName } from '../../components/admin/AdminIcon'
export function DashboardPage() {
 const state = useAdmin(), t = useAdminText(), gate = useGateStatistics(gateClient)
 const presence = usePresenceStatistics(presenceClient)
 // CHỨC NĂNG: Tính lại thống kê nội dung khi kho thay đổi, tách số phiên lấy từ RAM.
 // XỬ LÝ: Chưa có phản hồi presence thì hiển thị —; không đánh đồng lỗi với 0 phiên.
 const metrics = useMemo(() => state.data ? dashboard(state.data) : null, [state.data])
 const tiles: {key:'active'|'gateToday'|'places'|'pending'; icon:AdminIconName}[] = [
  {key:'active',icon:'users'},{key:'gateToday',icon:'qr'},{key:'places',icon:'places'},{key:'pending',icon:'review'},
 ]
 return <>
  <section className="admin-hero"><div><span className="admin-eyebrow">HUEGUIDE</span><h1>{t('dashboard')}</h1><p>{t('overviewHint')}</p></div><Link className="button admin-hero-button" to="/admin/places/new"><AdminIcon name="plus"/>{t('new')}</Link><div className="admin-hero-decoration" aria-hidden="true"><AdminIcon name="places"/></div></section>
  <Feedback state={state}/>
  {metrics && <div className="admin-metrics">{tiles.map(({key,icon},index) => <article className={'admin-metric metric-'+index} key={key}><div className="admin-metric-top"><span>{t(key === 'pending' ? 'status_submitted' : key)}</span><span className="admin-metric-icon"><AdminIcon name={icon}/></span></div><strong>{key === 'active' ? presence.stats?.active ?? '—' : key === 'gateToday' ? gate.stats?.today ?? '—' : metrics[key]}</strong><div className="admin-metric-line"/></article>)}</div>}
  <p className="admin-demo">{t('gateHint')}</p>
  {gate.error&&<div className="admin-error" role="alert">{t('gateError')}<button className="secondary" onClick={gate.retry}>{t('retry')}</button></div>}
  <div className="admin-dashboard-grid">
   <section className="admin-card"><div className="admin-section-heading"><span className="admin-icon-box"><AdminIcon name="dashboard"/></span><h2>{t('quickActions')}</h2></div><div className="admin-quick-actions">{([
    {to:'/admin/places',title:'places',hint:'managePlacesHint',icon:'places'},
    {to:'/admin/reviews',title:'reviews',hint:'reviewQueueHint',icon:'review'},
   ] as const).map(item=><Link key={item.to} className="admin-quick-action" to={item.to}><span className="admin-icon-box"><AdminIcon name={item.icon}/></span><div><strong>{t(item.title)}</strong><p>{t(item.hint)}</p></div><AdminIcon name="arrow"/></Link>)}</div></section>
   <section className="admin-card admin-presence-card"><div className="admin-section-heading"><span className="admin-icon-box"><AdminIcon name="users"/></span><h2>{t('active')}</h2></div><p>{t('analyticsHint')}</p>
    {/* CHỨC NĂNG: Lỗi polling có nút thử lại; không che bằng dữ liệu giả. */}
    {presence.error ? <div className="admin-error" role="alert">{t('presenceError')}<button className="secondary" onClick={presence.retry}>{t('retry')}</button></div> : !presence.stats ? <p role="status">{t('loading')}</p> : null}
   </section>
  </div>

 </>
}
/* CÁCH KIỂM TRA: Bốn chỉ số đúng; liên kết mở đúng màn; không còn nút reset; tắt RAM hiện lỗi. */
```

## 40. TẠO MỚI — apps/web/src/pages/admin/PlaceFormPage.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\PlaceFormPage.tsx

```tsx
/** FILE NÀY LÀM GÌ: Tạo/sửa metadata di tích, ảnh và tọa độ xác nhận.
 * /admin/places/new hoặc /:id/edit; UC13. Validation/service ở admin-core.
 * Ảnh dùng URL/mã asset trong bản FE; API upload sẽ được nối qua media service. */
import { AdminIcon } from '../../components/admin/AdminIcon'
import { PlaceImage } from '../../components/PlaceImage'
import { LocalMediaPicker } from '../../components/admin/LocalMediaPicker'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CATEGORIES, categoryOf } from '@travelguide/visitor-core'
import type { Category } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { useText } from '../../i18n'
import { Feedback, Field, useUnsaved, useConfirmation } from '../../components/admin/AdminUI'
export function PlaceFormPage() {
 const state = useAdmin(), { id } = useParams(), t = useAdminText()
 const place = state.data?.places.find(p => p.id === id)
 if (state.loading) return <Feedback state={state} />
 if (id && !place) return <p>{t('error_notFound')}</p>
 return <PlaceForm key={id ?? 'new'} initial={place} />
}
function PlaceForm({ initial }: { initial?: ManagedPlace }) {
 const [opened] = useState(initial)
 const state = useAdmin(), t = useAdminText(), visitorText = useText(), navigate = useNavigate(), confirmation = useConfirmation()
 const [title,setTitle] = useState(opened?.record.canonicalTitle ?? '')
 const [category,setCategory] = useState<Category>(opened ? categoryOf(opened.record) : 'palace')
 const [period,setPeriod] = useState(opened?.period ?? '')
 const [lat,setLat] = useState(opened?.record.position?.lat.toString() ?? '')
 const [lng,setLng] = useState(opened?.record.position?.lng.toString() ?? '')
 const [verified,setVerified] = useState(opened?.record.position?.verified ?? false)
 const [images,setImages] = useState(opened?.record.images.join('\n') ?? '')
 const [dirty,setDirty] = useState(false); useUnsaved(dirty)
 return <><div className="admin-page-title"><div><h1>{t(opened ? 'edit' : 'new')}</h1><p>{t('catalogHint')}</p></div></div><Feedback state={state} />
  <form className="admin-card admin-form" onChange={() => setDirty(true)} onSubmit={event => {
   event.preventDefault()
   void state.run(() => state.service.savePlace({ id: opened?.id, expectedRevision: opened?.revision, title, category, period, lat, lng, verified,
    images: images.split('\n').map(s => s.trim()).filter(Boolean) })).then(ok => { if(ok) { setDirty(false); navigate('/admin/places') } })
  }}>
   {/* CHỨC NĂNG: Nhóm tên, danh mục và thời kỳ để nhập theo từng bước. */}
   <section className="admin-form-section"><h2><AdminIcon name="places"/>{t('basicInfo')}</h2>
   <Field label={t('title')}><input value={title} required onChange={e => setTitle(e.target.value)} /></Field>
   <Field label={t('category')}><select value={category} onChange={e => setCategory(e.target.value as Category)}>{CATEGORIES.map(c => <option key={c} value={c}>{visitorText(`category_${c}`)}</option>)}</select></Field>
   <Field label={t('period')}><input value={period} onChange={e => setPeriod(e.target.value)} /></Field>
   </section>
   <section className="admin-form-section"><h2><AdminIcon name="pin"/>{t('locationSection')}</h2>
   <div className="admin-two"><Field label={t('lat')}><input inputMode="decimal" value={lat} onChange={e => setLat(e.target.value)} /></Field><Field label={t('lng')}><input inputMode="decimal" value={lng} onChange={e => setLng(e.target.value)} /></Field></div>
   <label className="admin-check"><input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} />{t('verified')}</label>
   </section>
   {/* CHỨC NĂNG: Xem trước ảnh đầu tiên; PlaceImage vẫn xử lý ảnh lỗi. */}
   <section className="admin-form-section"><h2><AdminIcon name="image"/>{t('mediaSection')}</h2>
   {images.split('\n').find(s=>s.trim())&&<div className="admin-image-preview"><PlaceImage uri={images.split('\n').find(s=>s.trim())?.trim()} title={title}/></div>}
   <Field label={t('images')}><textarea rows={4} value={images.split('\n').filter(s => !s.startsWith('data:')).join('\n')} onChange={e => setImages([...images.split('\n').filter(s => s.startsWith('data:')), e.target.value].filter(Boolean).join('\n'))} /></Field>
   <LocalMediaPicker kind="image" onPick={value => { setImages(old => [old,value].filter(Boolean).join('\n')); setDirty(true) }} />
   {images.includes('data:') && <button type="button" className="secondary" onClick={() => {setImages(images.split('\n').filter(s => !s.startsWith('data:')).join('\n'));setDirty(true)}}>{t('clearFile')}</button>}
   </section>
   <section className="admin-form-section"><h2><AdminIcon name="save"/>{t('workflowSection')}</h2>
   <div className="admin-actions"><button disabled={state.busy || opened?.workflow === 'archived'}>{state.busy ? t('loading') : t('save')}</button>
    <button type="button" className="secondary" onClick={() => { if (!dirty || window.confirm(t('unsaved'))) navigate('/admin/places') }}>{t('cancel')}</button>
    {opened && opened.workflow !== 'archived' && <button type="button" className="secondary" disabled={state.busy} onClick={() => {
     if (window.confirm(t('confirmArchive'))) void state.run(() => state.service.archive(opened.id, opened.revision)).then(ok => { if(ok) { setDirty(false); navigate('/admin/places') } })
    }}>{t('archive')}</button>}
    {/* CHỨC NĂNG: Nút xóa riêng, không gửi form và không tự thực hiện khi mở màn.
        XỬ LÝ: Cần xác nhận đúng tên điểm; chỉ quay về danh sách sau khi ghi thành công. */}
    {opened && <button type="button" className="admin-delete" disabled={state.busy} onClick={() => {
      confirmation.ask(t('confirmDelete') + '\n' + opened.record.canonicalTitle, () => {
        void state.run(() => state.service.deletePlace(opened.id, opened.revision)).then(ok => {
          if (ok) { setDirty(false); navigate('/admin/places') }
        })
      })
    }}>{t('delete')}</button>}
   </div></section>
  </form>
  {confirmation.dialog}
 </>
}
/* CÁCH KIỂM TRA: Không lưu tọa độ ngoài Huế/URL nguy hiểm; sửa metadata không đổi bản public. */
```

## 41. TẠO MỚI — apps/web/src/pages/admin/PlacesPage.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\PlacesPage.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Danh sách di tích quản lý có tìm kiếm, ảnh và nhãn trạng thái.
 * AdminRoutes gọi tại /admin/places; dùng service qua useAdmin, PlaceImage và normalize.
 * UC13. Thẻ ảnh gọn trên desktop, tự về một cột trên điện thoại.
 */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { normalize } from '@travelguide/visitor-core'
import { useDebounce } from '@travelguide/visitor-core/react'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { PlaceImage } from '../../components/PlaceImage'
import { Feedback, Status } from '../../components/admin/AdminUI'
import { AdminIcon } from '../../components/admin/AdminIcon'
export function AdminPlacesPage() {
 const state = useAdmin(), t = useAdminText(), [query,setQuery] = useState('')
 // CHỨC NĂNG: Chờ gõ xong rồi tìm không dấu; chỉ lọc lại khi dữ liệu/từ khóa đổi.
 // XỬ LÝ: Không ẩn di tích đã lưu trữ để người quản lý còn xem và xử lý được.
 const search = useDebounce(query)
 const places = useMemo(() => state.data?.places.filter(p => normalize(p.record.canonicalTitle).includes(normalize(search))) ?? [], [state.data,search])
 return <><div className="admin-page-title"><div><h1>{t('places')}</h1><p>{t('catalogHint')}</p></div><Link className="button" to="/admin/places/new"><AdminIcon name="plus"/>{t('new')}</Link></div>
  <Feedback state={state}/>
  <div className="admin-list-toolbar"><div className="admin-search-wrap"><AdminIcon name="search"/><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={t('search')} aria-label={t('search')}/>{query&&<button type="button" className="secondary admin-clear-search" aria-label={t('clearSearch')} onClick={()=>setQuery('')}><AdminIcon name="close"/></button>}</div><span className="admin-result-count" role="status">{places.length} {t('places')}</span></div>
  <div className="admin-place-grid">{places.map(place => <article className="admin-place-card" key={place.id}>
   <div className="admin-place-cover"><PlaceImage uri={place.record.images[0]} title={place.record.canonicalTitle}/><Status value={place.workflow}/></div>
   <div className="admin-place-info"><span className="admin-revision">{t('revision')}: {place.revision}</span><h2>{place.record.canonicalTitle}</h2>{place.period&&<p>{place.period}</p>}
    <div className="admin-actions"><Link className="button secondary" to={'/admin/places/' + place.id + '/edit'}><AdminIcon name="edit"/>{t('edit')}</Link><Link className="button" to={'/admin/places/' + place.id + '/content'}><AdminIcon name="content"/>{t('content')}</Link></div>
   </div></article>)}</div>
  {!state.loading&&!state.error&&!places.length&&<div className="admin-card admin-empty"><AdminIcon name="search"/><h2>{t('empty')}</h2>{query&&<button className="secondary" onClick={()=>setQuery('')}>{t('clearSearch')}</button>}</div>}
 </>
}
/* CÁCH KIỂM TRA: Gõ ky dai; xóa từ khóa; tìm rỗng; các nút mở đúng id và trạng thái vẫn đủ nhãn. */
```

Đã gỡ màn QR admin: apps/web/src/pages/admin/QrPage.tsx


## 43. TẠO MỚI — apps/web/src/pages/admin/ReviewsPage.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\pages\admin\ReviewsPage.tsx

```tsx
/** FILE NÀY LÀM GÌ: So sánh văn bản/audio, yêu cầu sửa, duyệt và công bố đúng bản.
 * /admin/reviews; UC15–UC16. Backend tương lai phải kiểm tra lại mọi điều kiện.
 * Chỉ service đổi public; UI không tự gán status=published hoặc ngày duyệt. */
import { AdminIcon } from '../../components/admin/AdminIcon'
import { PlaceImage } from '../../components/PlaceImage'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { LANGUAGES } from '@travelguide/visitor-core'
import type { ManagedPlace } from '@travelguide/admin-core'
import { useAdmin, useAdminText } from '@travelguide/admin-core/react'
import { Feedback, Status, Field, useConfirmation } from '../../components/admin/AdminUI'
import { audioSource } from './ContentEditorPage'
export function ReviewsPage() {
 const state = useAdmin(), t = useAdminText()
 const places = state.data?.places.filter(p => ['submitted','approved','changes'].includes(p.workflow)) ?? []
 return <><div className="admin-page-title"><div><h1>{t('reviews')}</h1><p>{t('reviewQueueHint')}</p></div><span className="admin-pill">{places.length} {t('reviews')}</span></div><Feedback state={state} />
  {!state.loading && !places.length && <div className="admin-card admin-empty"><AdminIcon name="review"/><h2>{t('empty')}</h2></div>}
  {places.map(place => <ReviewCard key={place.id + place.revision + place.workflow} place={place} />)}
 </>
}
function ReviewCard({ place }: { place: ManagedPlace }) {
 const state = useAdmin(), t = useAdminText(), [note,setNote] = useState(''), confirmation = useConfirmation()
 return <article className="admin-card admin-review">{/* CHỨC NĂNG: Nhận diện đúng di tích trước khi đọc, duyệt hoặc công bố. */}<div className="admin-review-identity"><PlaceImage uri={place.record.images[0]} title={place.record.canonicalTitle}/><div><h2>{place.record.canonicalTitle}</h2><Status value={place.workflow}/></div></div>
  <p className="admin-review-meta">{t('revision')}: {place.revision} · {t('current')}: {place.published?.content.vi?.version ?? t('none')}</p>
  <div className="admin-review-grid">{LANGUAGES.map(l => { const text = place.record.content[l.code]; return text ? <section key={l.code}><h3>{l.label} · {text.title}</h3><p className="admin-body">{text.body}</p>{text.audio && <audio controls preload="none" src={audioSource(text.audio.url)} onPlay={event => {
   // CHỨC NĂNG: Chỉ nghe một bản review mỗi lúc để không chồng tiếng.
   document.querySelectorAll('audio').forEach(audio => { if(audio !== event.currentTarget) audio.pause() })
  }} />}</section> : null })}</div>
  <Field label={t('note')}><textarea rows={2} value={note} onChange={e => setNote(e.target.value)} /></Field>
  {place.reviewNote && <p>{place.reviewNote}</p>}
  <div className="admin-actions"><Link className="button secondary" to={'/admin/places/' + place.id + '/content'}>{t('content')}</Link>
   {place.workflow === 'submitted' && <><button disabled={state.busy} onClick={() => { void state.run(() => state.service.review(place.id, place.revision, true, note)) }}>{t('approve')}</button><button className="secondary" disabled={state.busy || !note.trim()} onClick={() => { void state.run(() => state.service.review(place.id, place.revision, false, note)) }}>{t('reject')}</button></>}
   {place.workflow === 'approved' && <button disabled={state.busy} onClick={() => { confirmation.ask(t('confirmPublish'), () => { void state.run(() => state.service.publish(place.id, place.revision)) }) }}>{t('publish')}</button>}
  </div>
 {confirmation.dialog}</article>
}
/* CÁCH KIỂM TRA: Reject thiếu ghi chú bị khóa; approve không tự public; publish cần xác nhận. */
```

## 44. TẠO MỚI — apps/web/src/services/admin/services.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\services\admin\services.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Ghép API RAM chung vào Admin và danh mục du khách của nền tảng.
 * Provider và Dashboard gọi; UC12–UC17. Không tự quay về kho cục bộ khi mất mạng.
 * Bản nháp chỉ đọc qua Admin; publicCatalog chỉ lấy /published.
 */
import { createHttpAdminService, createGateClient } from '@travelguide/admin-core'
import { createCatalog } from '@travelguide/visitor-core'
const base = import.meta.env.VITE_ADMIN_API_URL || '/api/catalog'
const publicBase = import.meta.env.VITE_CATALOG_API_URL || '/api/catalog'
export const adminService = createHttpAdminService(base)
const publicService = createHttpAdminService(publicBase)
export const gateClient = createGateClient(base)
export const visitorGateClient = createGateClient(publicBase)
export const publicCatalog = createCatalog(()=>publicService.published(),publicService.subscribe)
/* CÁCH KIỂM TRA: Web lưu rồi mobile thấy sau khoảng 3 giây; mất API hiện lỗi; public không lộ nháp. */
```

## 45. TẠO MỚI — apps/web/src/styles/admin.css

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\src\styles\admin.css

```css
/*
 * FILE NÀY LÀM GÌ: Giao diện Admin web xanh–trắng cùng Admin mobile.
 * AdminLayout nạp; các lớp admin-* chỉ tác động vùng quản lý, UC12–UC17.
 * CHỨC NĂNG: Khung điều hướng, dashboard, thẻ di tích, form và kiểm duyệt.
 * XỬ LÝ: Dùng token màu chung, minmax tránh tràn, breakpoint cho tablet/điện thoại.
 */
.admin-shell{min-height:100vh;display:grid;grid-template-columns:248px minmax(0,1fr);background:var(--page);color:var(--text)}
.admin-shell button,.admin-shell .button{min-height:44px}.admin-shell button:hover:not(:disabled),.admin-shell .button:hover{box-shadow:0 4px 12px #12335a12}.admin-shell button:disabled{cursor:not-allowed}
.admin-shell :is(a,button,input,select,textarea):focus-visible{outline:3px solid var(--primary);outline-offset:3px}
/* CHỨC NĂNG: Menu cố định trên desktop; icon và vạch xanh nhận diện trang hiện tại. */
.admin-sidebar{background:var(--background);border-right:1px solid var(--border);padding:30px 18px;position:sticky;top:0;height:100vh;display:flex;flex-direction:column;gap:44px}
.admin-brand{display:flex;gap:12px;align-items:center;color:var(--text);padding:0 10px}.admin-brand-icon{width:44px;height:44px;display:grid;place-items:center;border-radius:14px;color:white;background:var(--primary);box-shadow:0 7px 16px #1768e52b}.admin-brand-icon svg{width:27px;height:27px}.admin-brand strong{font-size:23px;letter-spacing:-.6px}.admin-brand small{display:block;font-size:11px;letter-spacing:.3px;color:var(--muted);font-weight:500;margin-top:1px}
.admin-sidebar nav{display:grid;gap:9px}.admin-sidebar nav a{position:relative;display:flex;align-items:center;gap:13px;border-radius:13px;padding:14px 15px;color:var(--muted);font-weight:600;min-height:50px}.admin-sidebar nav a:hover{background:var(--page);color:var(--text)}.admin-sidebar nav a.active{color:var(--primary);background:var(--soft)}.admin-sidebar nav a.active:before{content:"";width:3px;position:absolute;left:0;top:15px;bottom:15px;background:var(--primary);border-radius:3px}.admin-nav-arrow{display:none;margin-left:auto}.admin-sidebar nav a.active .admin-nav-arrow{display:flex}.admin-nav-arrow svg{width:16px}.admin-sidebar-note{margin-top:auto;border:1px solid var(--border);border-radius:16px;background:var(--page);padding:18px;display:grid;gap:10px}.admin-sidebar-note>svg{color:var(--primary);width:27px;height:27px}.admin-sidebar-note strong{font-size:13px}.admin-sidebar-note p{font-size:12px;line-height:1.7;color:var(--muted)}
.admin-main{min-width:0}.admin-topbar{background:var(--background);display:flex;align-items:center;justify-content:space-between;gap:20px;padding:20px 36px;border-bottom:1px solid var(--border)}.admin-topbar strong,.admin-topbar small{display:block}.admin-topbar>div>small{font-size:10px;letter-spacing:1px;color:var(--muted);margin-bottom:3px}.admin-topbar>div>strong{font-size:19px}.admin-topbar-tools{display:flex;gap:24px;align-items:center}.admin-identity{display:flex;gap:10px;align-items:center;border-left:1px solid var(--border);padding-left:22px}.admin-identity>span{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:var(--soft);color:var(--primary);font-size:12px;font-weight:700}.admin-identity strong{font-size:13px}.admin-identity small{font-size:11px;color:var(--muted)}
.admin-workspace{padding:30px 36px 32px;max-width:1580px;margin:auto}.admin-demo{background:var(--soft);color:var(--muted);padding:14px 18px;border:1px solid var(--border);border-radius:12px;font-size:12px;line-height:1.7;margin-bottom:20px}.admin-footnote{margin:28px 0 0;background:transparent;border-style:dashed;font-size:11px}
/* CHỨC NĂNG: Banner và đúng bốn chỉ số; không thêm biểu đồ hoặc số liệu giả. */
.admin-hero{position:relative;overflow:hidden;border-radius:22px;padding:30px 32px;margin-bottom:24px;background:linear-gradient(120deg,#102950,#194174);color:white;display:flex;gap:24px;align-items:center;justify-content:space-between}.admin-hero>div:first-child,.admin-hero-button{position:relative;z-index:1}.admin-eyebrow{font-size:10px;letter-spacing:3px;color:#a8c7ed;font-weight:600}.admin-hero h1{font-size:30px;margin:8px 0;letter-spacing:-.6px;line-height:1.3}.admin-hero p{color:#cee0f7;font-size:13px}.admin-hero-button{background:white;color:var(--primary);border:0;flex-shrink:0}.admin-hero-decoration{position:absolute;right:10%;top:-28px;width:240px;height:240px;border:1px solid #ffffff12;border-radius:50%;display:grid;place-items:center;transform:rotate(-12deg);pointer-events:none}.admin-hero-decoration svg{height:150px;width:150px;opacity:.055}
.admin-page-title{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:24px}.admin-page-title h1{font-size:27px;line-height:1.4;margin:0;letter-spacing:-.5px}.admin-page-title h2{margin:0;font-size:21px}.admin-page-title p{color:var(--muted);margin:5px 0 0;font-size:13px}.admin-pill{padding:7px 12px;border-radius:30px;background:var(--background);border:1px solid var(--border);font-size:12px;color:var(--primary)}
.admin-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;margin-bottom:24px}.admin-metric{background:var(--background);border:1px solid var(--border);border-radius:18px;padding:20px 22px;box-shadow:0 5px 18px #10295004}.admin-metric-top{display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--muted);font-size:13px}.admin-metric-icon{width:36px;height:36px;border-radius:11px;background:var(--soft);color:var(--primary);display:grid;place-items:center;flex-shrink:0}.admin-metric strong{display:block;font-size:36px;margin:10px 0 16px;line-height:1.2;letter-spacing:-1px}.admin-metric-line{height:4px;width:44px;border-radius:6px;background:var(--soft)}.admin-metric.metric-0{background:linear-gradient(130deg,var(--primary),#1351b4);color:white;border:0}.metric-0 .admin-metric-top{color:#e9f2ff}.metric-0 .admin-metric-icon{background:#ffffff24;color:white}.metric-0 .admin-metric-line{background:#ffffff66}
.admin-card{padding:24px;background:var(--background);border:1px solid var(--border);border-radius:18px;margin-bottom:20px;min-width:0}.admin-card h2{margin:0 0 12px;font-size:18px}.admin-card p{color:var(--muted);line-height:1.8}.admin-section-heading{display:flex;align-items:center;gap:12px;margin-bottom:20px}.admin-section-heading h2{margin:0;font-size:17px}.admin-icon-box{height:42px;width:42px;border-radius:12px;display:grid;place-items:center;color:var(--primary);background:var(--soft);flex-shrink:0}.admin-dashboard-grid{display:grid;grid-template-columns:1.15fr 1fr;gap:22px}.admin-quick-actions{display:grid;gap:12px}.admin-quick-action{display:flex;gap:14px;align-items:center;border:1px solid var(--border);border-radius:14px;padding:16px;color:var(--text);transition:background .15s,border-color .15s}.admin-quick-action:hover{background:var(--page);border-color:var(--primary)}.admin-quick-action>div{flex:1;min-width:0}.admin-quick-action strong{font-size:14px}.admin-quick-action p{font-size:12px;margin-top:3px;line-height:1.6}.admin-quick-action>svg{color:var(--muted);flex-shrink:0;width:18px}.admin-presence-card>p{font-size:13px}.admin-reset{display:flex;align-items:center;justify-content:space-between;gap:20px;background:transparent;border-style:dashed}.admin-reset h2{font-size:14px;margin-bottom:3px}.admin-reset p{margin:0;font-size:12px}.admin-reset button{flex-shrink:0}
/* CHỨC NĂNG: Thanh tìm kiếm và thẻ di tích có nhãn trạng thái, không thay logic tìm kiếm. */
.admin-list-toolbar{display:flex;gap:20px;align-items:center;justify-content:space-between;margin-bottom:24px}.admin-search-wrap{display:flex;gap:12px;align-items:center;border:1px solid var(--border);background:var(--background);padding:4px 12px;border-radius:13px;width:min(100%,480px);color:var(--muted)}.admin-search-wrap:focus-within{border-color:var(--primary);box-shadow:0 0 0 3px #1768e510}.admin-search-wrap input{border:0;background:transparent;flex:1;width:0;min-width:0;padding:10px 0;outline:0;min-height:42px}.admin-search-wrap input:focus-visible{outline:0}.admin-search-wrap input::-webkit-search-cancel-button{display:none}.admin-clear-search{border:0!important;min-width:36px!important;min-height:36px!important;padding:6px!important;background:var(--page)!important}.admin-clear-search svg{width:17px;height:17px}.admin-result-count{font-size:12px;color:var(--muted);white-space:nowrap}
.admin-place-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.admin-place-card{border:1px solid var(--border);border-radius:18px;background:var(--background);overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .15s,transform .15s}.admin-place-card:hover{box-shadow:0 12px 24px #1029500b;transform:translateY(-2px)}.admin-place-cover{position:relative;height:180px;overflow:hidden;background:var(--soft)}.admin-place-cover>.place-image{width:100%;height:100%;object-fit:cover}.admin-place-cover>.admin-badge{position:absolute;top:12px;left:12px;box-shadow:0 2px 10px #10295012;border:1px solid #ffffff99}.admin-place-info{padding:20px;display:flex;flex-direction:column;flex:1;min-width:0}.admin-place-card h2{font-size:18px;margin:5px 0 8px;line-height:1.4;overflow-wrap:anywhere}.admin-place-card p{font-size:12px;color:var(--muted)}.admin-revision{font-size:11px;color:var(--muted)}.admin-place-info .admin-actions{margin-top:auto;padding-top:18px;flex-wrap:nowrap}.admin-place-info .button{flex:1;font-size:12px;padding:9px 8px;min-width:0}.admin-place-info .button svg{width:17px;flex-shrink:0}
.admin-badge{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;border-radius:20px;padding:6px 11px;background:#edf2f8;color:#52627c;max-width:100%;overflow-wrap:anywhere}.admin-badge:before{content:"";width:5px;height:5px;flex-shrink:0;border-radius:50%;background:currentColor}.admin-badge.state-published{background:#e6f7ed;color:#187044}.admin-badge.state-approved{background:#e8f1ff;color:#1658b0}.admin-badge.state-submitted{background:#fff4da;color:#865f00}.admin-badge.state-changes{background:#fff0ed;color:#a63e25}.admin-badge.state-archived{background:#edf0f5;color:#6d7180}.admin-empty{display:grid;justify-items:center;gap:14px;text-align:center;padding:48px 20px}.admin-empty>svg{width:38px;height:38px;color:var(--primary)}.admin-empty h2{margin:0}
/* CHỨC NĂNG: Chia form thành nhóm có tiêu đề, vùng nhập có focus và hàng hành động riêng. */
.admin-form{max-width:1040px}.admin-form.admin-card{padding:0;overflow:visible}.admin-form-section{padding:26px 28px;border-bottom:1px solid var(--border)}.admin-form-section:last-child{border-bottom:0}.admin-form-section>h2{font-size:16px;display:flex;gap:10px;align-items:center;margin-bottom:24px}.admin-form-section>h2 svg{color:var(--primary);width:20px}.admin-field{display:grid;gap:8px;min-width:0;margin-bottom:20px}.admin-field>span{font-size:12px;font-weight:600}.admin-field input,.admin-field textarea,.admin-field select{padding:12px 14px;width:100%;border:1px solid var(--border);border-radius:11px;background:var(--background);color:var(--text);font:inherit;min-height:46px;transition:border-color .15s,box-shadow .15s}.admin-field input:focus,.admin-field textarea:focus,.admin-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px #1768e50c}.admin-field textarea{resize:vertical;line-height:1.8}.admin-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px}.admin-check{display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--page);border-radius:11px;font-size:13px;line-height:1.6}.admin-image-preview{height:220px;margin-bottom:20px;border-radius:13px;overflow:hidden;background:var(--soft)}.admin-image-preview>.place-image{width:100%;height:100%;object-fit:cover}.admin-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:16px}.admin-form-section>.admin-actions:first-child{margin-top:0}.admin-actions .admin-delete{margin-left:auto;background:transparent;border-color:#e9b9b5;color:var(--danger)}.admin-actions .admin-delete:hover{background:#fff1ef}
.admin-language-tabs{display:flex;gap:6px;flex-wrap:wrap;padding:6px;background:var(--background);border:1px solid var(--border);border-radius:14px;margin-bottom:24px;width:fit-content;max-width:100%}.admin-language-tabs button{border:0;font-size:13px;padding:9px 18px;border-radius:9px}.admin-language-tabs .secondary{background:transparent;color:var(--muted)}.admin-language-tabs .secondary:hover{background:var(--page)}.admin-audio{display:grid;gap:12px;padding:18px;background:var(--page);border:1px solid var(--border);border-radius:13px;margin:18px 0}.admin-audio>span{font-size:12px;font-weight:600}.admin-audio audio,.admin-review audio{width:100%;max-width:100%}.admin-local-file{margin:14px 0}.admin-local-file input{max-width:100%;font-size:12px}.admin-local-file label{gap:12px;flex-wrap:wrap}.admin-local-file p{font-size:12px;color:var(--muted)}.admin-note{padding:14px;border-left:3px solid var(--primary);background:var(--soft);font-size:13px;margin-top:20px}
.admin-review{padding:26px}.admin-review-identity{display:flex;align-items:center;gap:16px}.admin-review-identity>.place-image{width:76px;height:76px;object-fit:cover;border-radius:13px;flex-shrink:0}.admin-review-identity h2{margin:0 0 8px}.admin-review-meta{font-size:12px;color:var(--muted);margin:16px 0}.admin-review-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:20px 0 26px}.admin-review-grid section{padding:20px;border:1px solid var(--border);border-radius:14px;background:var(--page);min-width:0}.admin-review-grid h3{margin:0;font-size:14px;line-height:1.6}.admin-body{white-space:pre-wrap;overflow-wrap:anywhere;max-height:260px;overflow:auto;font-size:13px;margin:12px 0 16px;padding-right:6px}.admin-review .admin-actions{padding-top:18px;border-top:1px solid var(--border)}
.admin-error{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid #f0bdb5;background:#fff1ef;padding:14px 18px;border-radius:12px;color:var(--danger);margin-bottom:20px;font-size:13px}.admin-success{background:var(--soft);color:var(--primary);border:1px solid var(--border);padding:13px 18px;border-radius:12px;margin-bottom:20px;font-size:13px}.admin-modal-backdrop{position:fixed;inset:0;z-index:3000;background:#10295080;display:grid;place-items:center;padding:20px}.admin-confirm{width:min(100%,460px);background:var(--background);padding:28px;border-radius:20px;box-shadow:0 25px 80px #10295044}.admin-confirm h2{margin:0 0 12px}.admin-confirm p{line-height:1.7;white-space:pre-line}.admin-confirm .admin-actions{justify-content:flex-end}
/* CHỨC NĂNG: Tablet giảm cột; điện thoại thu menu và không làm co nhỏ vùng bấm. */
@media(max-width:1200px){.admin-shell{grid-template-columns:215px minmax(0,1fr)}.admin-workspace{padding:26px}.admin-topbar{padding:18px 26px}.admin-place-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.admin-metric{padding:18px}.admin-metric-top{font-size:12px}}
@media(max-width:1000px){.admin-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.admin-dashboard-grid{grid-template-columns:minmax(0,1fr);gap:0}.admin-identity{display:none}.admin-review-grid{grid-template-columns:minmax(0,1fr)}}
@media(max-width:760px){.admin-shell{display:block}.admin-sidebar{position:static;width:100%;height:auto;padding:18px 16px 12px;gap:20px;border-right:0;border-bottom:1px solid var(--border)}.admin-brand{padding:0}.admin-brand strong{font-size:21px}.admin-brand-icon{width:38px;height:38px;border-radius:12px}.admin-sidebar nav{display:flex;overflow-x:auto;gap:6px;padding-bottom:3px}.admin-sidebar nav a{white-space:nowrap;padding:10px 13px;gap:8px;min-height:44px;font-size:13px}.admin-sidebar nav a.active:before,.admin-nav-arrow,.admin-sidebar nav a.active .admin-nav-arrow,.admin-sidebar-note{display:none}.admin-topbar{padding:16px;gap:12px}.admin-topbar>div>small{font-size:9px}.admin-topbar>div>strong{font-size:16px}.admin-topbar-tools{min-width:0}.admin-topbar .language-picker select{max-width:155px;font-size:12px}.admin-workspace{padding:20px 16px}.admin-hero{padding:24px;align-items:flex-start;flex-direction:column;gap:20px;border-radius:18px}.admin-hero h1{font-size:27px}.admin-hero p{line-height:1.7}.admin-hero-button{font-size:13px}.admin-metrics{gap:12px}.admin-metric{padding:16px}.admin-metric strong{font-size:30px}.admin-metric-top{align-items:flex-start;flex-direction:column-reverse;gap:12px}.admin-metric-icon{width:32px;height:32px}.admin-page-title h1{font-size:24px}.admin-page-title>.button{font-size:12px}.admin-list-toolbar{gap:12px;align-items:stretch;flex-direction:column}.admin-search-wrap{width:100%}.admin-place-grid{grid-template-columns:minmax(0,1fr)}.admin-place-cover{height:195px}.admin-card{padding:20px}.admin-form-section{padding:22px 20px}.admin-form.admin-card{padding:0}.admin-two{grid-template-columns:minmax(0,1fr);gap:0}.admin-reset{align-items:flex-start;flex-direction:column}.admin-quick-action{padding:14px;gap:12px}.admin-quick-action .admin-icon-box{width:36px;height:36px}.admin-review{padding:20px}.admin-review-identity{align-items:flex-start;gap:12px}.admin-review-identity h2{font-size:17px}.admin-review-identity>.place-image{width:60px;height:64px}.admin-language-tabs{gap:4px;padding:5px}.admin-language-tabs button{padding:8px 11px;font-size:12px}.admin-actions .admin-delete{margin-left:0}.admin-actions>button{flex-grow:1}}
@media(prefers-reduced-motion:reduce){.admin-shell *{transition:none!important;scroll-behavior:auto!important}.admin-place-card:hover{transform:none}}
/* CÁCH KIỂM TRA: Thu cửa sổ về 390px, Tab qua nút/textarea, tăng cỡ chữ; form và thẻ không tràn ngang. */
```

## 46. SỬA — apps/web/vercel.json

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\apps\web\vercel.json

```json
{
  "headers": [
    {
      "source": "/.well-known/apple-app-site-association",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/json"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/places",
      "destination": "/index.html"
    },
    {
      "source": "/places/:id",
      "destination": "/index.html"
    },
    {
      "source": "/about",
      "destination": "/index.html"
    }
  ]
}
```

## 47. SỬA — package.json

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\package.json

```json
{
  "name": "project-root",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "test:visitor": "npm run test --workspace=@travelguide/visitor-core",
    "typecheck:visitor": "npm run typecheck --workspace=@travelguide/visitor-core && npm run typecheck --workspace=mobile",
    "lint:visitor": "npm run lint --workspace=@travelguide/visitor-core && npm run lint --workspace=mobile",
    "lint": "npm run lint --workspace=@travelguide/admin-core && npm run lint --workspace=@travelguide/visitor-core && npm run lint --workspace=mobile && npm run lint --workspace=web",
    "typecheck": "npm run typecheck --workspace=@travelguide/admin-core && npm run typecheck --workspace=@travelguide/visitor-core && npm run typecheck --workspace=mobile && npm run typecheck --workspace=web",
    "test": "npm run test --workspace=@travelguide/admin-core && npm run test --workspace=@travelguide/visitor-core && npm run test --workspace=@travelguide/place-core && node --test scripts/app-links.test.cjs scripts/public-qr.test.cjs && npm run presence:test && npm run catalog:test",
    "build:web": "npm run build --workspace=web",
    "links:generate": "node scripts/generate-app-links.cjs",
    "qr:create": "node scripts/create-public-qr.cjs",
    "demo:public": "node scripts/start-public-demo.cjs",
    "presence:start": "node services/presence/server.cjs",
    "presence:test": "node --test services/presence/presence.test.cjs",
    "catalog:start": "node scripts/start-catalog.cjs",
    "catalog:test": "node --test services/catalog/catalog.test.cjs"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "8.46.2",
    "@typescript-eslint/parser": "8.46.2",
    "eslint": "8.57.1",
    "eslint-plugin-react-hooks": "5.2.0"
  }
}
```

## 48. TẠO MỚI — packages/admin-core/tests/admin.test.cjs

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\admin-core\tests\admin.test.cjs

```js
/** FILE NÀY LÀM GÌ: Test nghiệp vụ thật Admin không cần trình duyệt/BE.
 * npm test gọi; UC12–UC17. Bộ nhớ giả chỉ thay IO, không thay luật duyệt/công bố. */
const {test}=require('node:test')
const assert=require('node:assert/strict')
const {createMockAdminService,dashboard}=require('../.test-build/index.cjs')
function fixture(){let raw=null,fail=false;const service=createMockAdminService({read:async()=>raw,write:async value=>{if(fail)throw Error('disk full');raw=value}});return {service,setFail:value=>{fail=value},raw:()=>raw}}
const input=(p,title=p.record.canonicalTitle)=>({id:p.id,expectedRevision:p.revision,title,category:'palace',period:'1802–1945',lat:'',lng:'',verified:false,images:p.record.images})
async function draft(service){const p=(await service.load()).places[0];await service.savePlace(input(p));return (await service.load()).places[0]}
test('UC12: danh tính cấp sẵn, không cần mật khẩu',async()=>{const {service}=fixture();assert.equal((await service.identity()).mode,'demo')})
test('UC13: save draft không đổi published',async()=>{const {service}=fixture();const p=(await service.load()).places[0];await service.savePlace(input(p,'New title'));const next=(await service.load()).places[0];assert.equal(next.record.canonicalTitle,'New title');assert.equal(next.published.canonicalTitle,p.published.canonicalTitle)})
test('UC13: tọa độ ngoài Huế và javascript URL bị chặn',async()=>{const {service}=fixture(),p=(await service.load()).places[0];await assert.rejects(service.savePlace({...input(p),lat:'21',lng:'105'}),e=>e.code==='invalid');await assert.rejects(service.savePlace({...input(p),images:['javascript:alert(1)']}),e=>e.code==='invalid')})
test('UC13: ghi đồng thời cùng revision chỉ một lệnh thành công',async()=>{const {service}=fixture(),p=(await service.load()).places[0];const results=await Promise.allSettled([service.savePlace(input(p,'A')),service.savePlace(input(p,'B'))]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(results.find(r=>r.status==='rejected').reason.code,'conflict')})
test('UC14: sửa body bỏ audio cũ không còn khớp',async()=>{const {service}=fixture(),p=(await service.load()).places[0];await service.saveContent({id:p.id,language:'vi',expectedRevision:p.revision,title:'Test',summary:'',address:'',body:'Changed narration'});assert.equal((await service.load()).places[0].record.content.vi.audio,undefined)})
test('UC14.2: tác vụ về muộn không ghi đè bản mới',async()=>{const {service}=fixture(),p=await draft(service);const job=service.generateAudio(p.id,'vi',p.revision);await service.savePlace(input(p,'New revision'));await assert.rejects(job,e=>e.code==='conflict');assert.equal((await service.load()).places[0].record.canonicalTitle,'New revision')})
test('UC15: yêu cầu sửa cần ghi chú',async()=>{const {service}=fixture(),p=await draft(service);await service.submit(p.id,p.revision);await assert.rejects(service.review(p.id,p.revision,false,''),e=>e.code==='invalid');await service.review(p.id,p.revision,false,'Check history');assert.equal((await service.load()).places[0].workflow,'changes')})
test('UC16: approve chưa công bố; publish đổi đúng bản',async()=>{const {service}=fixture(),p=(await service.load()).places[0];await service.savePlace(input(p,'Published new'));const d=(await service.load()).places[0];await service.submit(d.id,d.revision);await service.review(d.id,d.revision,true,'');assert.equal((await service.published())[0].canonicalTitle,p.record.canonicalTitle);await service.publish(d.id,d.revision);assert.equal((await service.published())[0].canonicalTitle,'Published new')})
test('UC16: sửa sau duyệt vô hiệu approval',async()=>{const {service}=fixture(),p=await draft(service);await service.submit(p.id,p.revision);await service.review(p.id,p.revision,true,'');await service.savePlace(input(p,'Changed after approval'));await assert.rejects(service.publish(p.id,p.revision+1),e=>e.code==='notApproved')})
test('UC16: lưu lỗi giữ nguyên cache và published',async()=>{const f=fixture(),p=await draft(f.service);await f.service.submit(p.id,p.revision);await f.service.review(p.id,p.revision,true,'');const before=JSON.stringify(await f.service.load());f.setFail(true);await assert.rejects(f.service.publish(p.id,p.revision),e=>e.code==='saveError');assert.equal(JSON.stringify(await f.service.load()),before)})
test('UC17: web/app riêng; hết 90 giây không tính active',async()=>{const {service}=fixture();await service.simulate('web');await service.simulate('mobile-app');const d=await service.load(),now=Date.now();assert.equal(dashboard(d,now).web,1);assert.equal(dashboard(d,now).mobile,1);assert.equal(dashboard(d,now+91000).active,0);await service.endSessions();assert.equal(dashboard(await service.load()).active,0)})
test('Reset/load: dữ liệu lỗi không bị âm thầm thay bằng seed',async()=>{const service=createMockAdminService({read:async()=>'{broken',write:async()=>{}});await assert.rejects(service.load(),e=>e.code==='loadError')})

test('Reset phục hồi được JSON hỏng',async()=>{let raw='{broken';const s=createMockAdminService({read:async()=>raw,write:async value=>{raw=value}});await assert.rejects(s.load());await s.reset();assert.equal((await s.load()).places.length,8)})
test('UC17: mô phỏng đang nghe có bộ đếm riêng',async()=>{const {service}=fixture();await service.simulate('web',true);assert.equal(dashboard(await service.load()).listening,1)})

test('Media demo chặn SVG/script và tệp quá dung lượng',()=>{const {mediaUrl}=require('../.test-build/index.cjs');assert.equal(mediaUrl('data:image/png;base64,AAAA',true),true);assert.equal(mediaUrl('data:image/svg+xml;base64,AAAA',true),false);assert.equal(mediaUrl('data:audio/mpeg;base64,AAAA'),true);assert.equal(mediaUrl('data:audio/mpeg;base64,'+'A'.repeat(1500000)),false)})

test('UC13: xóa hẳn được điểm đã lưu trữ, giữ các điểm khác',async()=>{
 const f=fixture(),p=(await f.service.load()).places[0]
 await f.service.archive(p.id,p.revision)
 await f.service.deletePlace(p.id,p.revision)
 assert.equal((await f.service.load()).places.length,7)
 assert.equal((await f.service.load()).places.some(item=>item.id===p.id),false)
 assert.equal((await f.service.published()).some(item=>item.id===p.id),false)
 const reopened=createMockAdminService({read:async()=>f.raw(),write:async()=>{}})
 assert.equal((await reopened.load()).places.some(item=>item.id===p.id),false)
})
test('UC13: xóa sai revision hoặc ID không xóa nhầm dữ liệu',async()=>{
 const {service}=fixture(),p=(await service.load()).places[0]
 await assert.rejects(service.deletePlace(p.id,p.revision+1),e=>e.code==='conflict')
 await assert.rejects(service.deletePlace('missing',1),e=>e.code==='notFound')
 assert.equal((await service.load()).places.length,8)
})
test('UC13: lỗi lưu khi xóa giữ nguyên di tích và bản công khai',async()=>{
 const f=fixture(),p=(await f.service.load()).places[0]
 f.setFail(true)
 await assert.rejects(f.service.deletePlace(p.id,p.revision),e=>e.code==='saveError')
 assert.equal((await f.service.load()).places.length,8)
 assert.equal((await f.service.published()).some(item=>item.id===p.id),true)
})
```

## 49. SỬA — packages/visitor-core/src/catalog.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\catalog.ts

```ts
/**
 * FILE NÀY LÀM GÌ:
 * Lọc địa điểm và nội dung công bố cho UC02/UC04.
 * Hook trong react.tsx gọi service này; phụ thuộc model.ts.
 * Nguồn mock hoặc API được truyền vào khi tạo service.
 */

import type {
  CatalogSource,
  Language,
  PlaceRecord,
  PublishedText,
} from './model'

// CHỨC NĂNG: Phân biệt điểm không tồn tại với lỗi tải dữ liệu.
// XỬ LÝ: UI dùng mã notFound thay vì hiện thông báo lỗi kỹ thuật.
export class CatalogError extends Error {
  constructor(public readonly code: 'notFound') {
    super(code)
    this.name = 'CatalogError'
  }
}

// CHỨC NĂNG: Lấy bản nội dung đúng ngôn ngữ đã duyệt và công bố.
// XỬ LÝ: Thiếu bản thì trả undefined; không tự dịch hoặc âm thầm đổi ngôn ngữ.
export function publishedText(
  place: PlaceRecord,
  language: Language,
): PublishedText | undefined {
  const text = place.content[language]

  return text?.status === 'published'
    && text.approvedAt
    && text.publishedAt
    ? text
    : undefined
}

// CHỨC NĂNG: Liệt kê các bản ngôn ngữ được phép đọc.
// XỬ LÝ: Bản nháp không xuất hiện trong danh sách lựa chọn.
export function availableLanguages(place: PlaceRecord): Language[] {
  return (['vi', 'en', 'cn', 'pt', 'ja'] as const).filter(
    (language) => Boolean(publishedText(place, language)),
  )
}

// CHỨC NĂNG: Tạo service danh sách và chi tiết.
// XỬ LÝ: Đổi nguồn dữ liệu chỉ cần đổi source, không phải sửa màn hình.
// Backend thật vẫn phải kiểm tra quyền/công bố; lọc FE không thay thế bảo mật server.
export function createCatalog(source: CatalogSource, subscribe?: (listener: () => void) => () => void) {
  const list = async (): Promise<PlaceRecord[]> => {
    const raw = await source()

    // CHỨC NĂNG: Giới hạn đúng phạm vi và danh mục triển khai.
    // XỬ LÝ: Loại điểm nháp, đã rút hoặc chưa được chọn triển khai.
    return raw
      .filter(
        (place) =>
          place.scope === 'hue-citadel'
          && place.inLaunchCatalog
          && place.status === 'published',
      )
      .map((place) => {
        const content: PlaceRecord['content'] = {}

        // CHỨC NĂNG: Không đưa nội dung nháp sang UI.
        // XỬ LÝ: Sao chép bản công bố để UI không sửa trực tiếp nguồn.
        for (const language of availableLanguages(place)) {
          const text = publishedText(place, language)
          if (text) content[language] = { ...text }
        }

        return {
          ...place,
          images: [...place.images],
          position: place.position ? { ...place.position } : undefined,
          content,
        }
      })
      .filter((place) => availableLanguages(place).length > 0)
  }

  return {
    list,
    subscribe,

    // CHỨC NĂNG: Lấy một địa điểm theo ID cho chi tiết hoặc QR.
    // XỬ LÝ: Dùng cùng điều kiện công bố như danh sách.
    async get(id: string): Promise<PlaceRecord> {
      const place = (await list()).find((item) => item.id === id)

      if (!place) throw new CatalogError('notFound')

      return place
    },
  }
}

export type Catalog = ReturnType<typeof createCatalog>
```

## 50. SỬA — packages/visitor-core/src/journey-react.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\journey-react.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ: Giữ một phiên nghe/GPS xuyên suốt mọi màn UC06–UC11.
 * App mobile và main.tsx web bọc provider dưới VisitorProvider UC01–UC05.
 * Phụ thuộc JourneyController và các adapter nền tảng; không tự phát lúc khởi động.
 */
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { JourneyController, type JourneyPorts } from './journey'
import { MAP_POINTS, VISIT_ROUTES } from './journey-data'
import { useVisitor } from './react'

export type JourneyAdapters = Omit<JourneyPorts, 'catalog' | 'positions' | 'routes'>
const Context = createContext<JourneyController | null>(null)

export function JourneyProvider({ adapters, children }: { adapters: JourneyAdapters; children: ReactNode }) {
  const { catalog, language } = useVisitor()
  const engine = useMemo(() => new JourneyController({ ...adapters, catalog, positions: MAP_POINTS, routes: VISIT_ROUTES }), [adapters, catalog])
  // CHỨC NĂNG: Đọc tiến độ nhưng chỉ đề nghị tiếp tục, không tự phát.
  // XỬ LÝ: Cleanup dừng GPS, giải phóng player và vô hiệu hóa request tải cũ.
  useEffect(() => { void engine.start(); return () => engine.dispose() }, [engine])
  useEffect(() => catalog.subscribe?.(() => { void engine.refreshCatalog() }), [catalog, engine])
  useEffect(() => { engine.changeLanguage(language) }, [engine, language])
  return <Context.Provider value={engine}>{children}</Context.Provider>
}

export function useJourney() {
  const engine = useContext(Context)
  if (!engine) throw new Error('JourneyProvider is missing')
  const state = useSyncExternalStore(engine.subscribe, engine.snapshot, engine.snapshot)
  const { changeLanguage } = useVisitor()
  return { engine, state, resumeSaved: async () => {
    const language = state.restore?.language
    if (language) { await changeLanguage(language); await engine.restorePlay() }
  } }
}

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Đổi trang khi đang nghe: player không bị tạo lại.
 * - Tải lại ứng dụng: chỉ hiện lời nhắc, chưa tự phát.
 */
```

## 51. SỬA — packages/visitor-core/src/journey.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\journey.ts

```ts
/**
 * FILE NÀY LÀM GÌ: Điều phối GPS, một nguồn audio và lưu tiến độ UC06–UC11.
 * JourneyProvider gọi; phụ thuộc model/catalog/search, không phụ thuộc React/thiết bị.
 * Adapter audio và bộ nhớ được truyền vào để test không cần GPS hoặc loa thật.
 */
import { LANGUAGES, type Language, type PlaceRecord, type Point } from './model'
import { publishedText, type Catalog } from './catalog'
import { distanceMeters, validPoint } from './search'

export type Fix = Point & { accuracy: number; timestamp: number }
export type MapPoint = Point & { source: string; fieldVerified: boolean }
export type VisitRoute = { id: string; title: Record<Language, string>; stops: string[]; verified: boolean; available: boolean }
export type MediaStatus = { position: number; duration: number; playing: boolean; ended: boolean; error?: boolean }
export type Track = {
  duration: number
  play(): Promise<void>
  pause(): void
  seek(seconds: number): Promise<void>
  rate(value: number): void
  listen(callback: (status: MediaStatus) => void): () => void
  dispose(): void
}
export type Saved = {
  placeId: string; language: Language; textVersion: number; audioId: string
  audioVersion: number; position: number; duration: number; rate: number
}
export type Session = Saved & { title: string }
export type JourneyPorts = {
  catalog: Catalog
  open(url: string, title: string): Promise<Track>
  watch(next: (fix: Fix) => void, fail: () => void): Promise<() => void>
  read(): Promise<string | null>
  write(value: string | null): Promise<void>
  positions: Readonly<Record<string, MapPoint>>
  routes: readonly VisitRoute[]
}
export type JourneyError = 'audioMissing' | 'audioFailed' | 'gpsFailed' | 'gpsWeak' | 'saveFailed' | 'savedInvalid' | 'loadError'
export type JourneyState = {
  places: readonly PlaceRecord[]; ready: boolean; status: 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'
  session?: Session; restore?: Saved; changed: boolean; error?: JourneyError
  gps: boolean; fix?: Fix; suggestedId?: string; routeId?: string
}

// CHỨC NĂNG: Giới hạn thời điểm tua theo thời lượng thật.
// XỬ LÝ: Không dùng số giả để mô phỏng thanh thời gian.
export const clampTime = (value: number, duration: number) =>
  Number.isFinite(value) && Number.isFinite(duration) ? Math.max(0, Math.min(value, duration)) : 0

// CHỨC NĂNG: Kiểm tra dữ liệu localStorage/AsyncStorage không đáng tin cậy.
// XỬ LÝ: JSON lỗi, ngôn ngữ lạ, thời gian âm hoặc phiên bản sai đều bị loại.
export function parseSaved(raw: string | null): Saved | undefined {
  if (!raw) return undefined
  try {
    const x: unknown = JSON.parse(raw)
    if (!x || typeof x !== 'object') return undefined
    const s = x as Record<string, unknown>
    if (typeof s.placeId !== 'string' || !s.placeId || typeof s.audioId !== 'string'
      || !LANGUAGES.some(l => l.code === s.language)
      || !['textVersion', 'audioVersion', 'position', 'duration', 'rate'].every(k => typeof s[k] === 'number' && Number.isFinite(s[k]))) return undefined
    if (Number(s.position) < 0 || Number(s.duration) <= 0 || Number(s.textVersion) < 1
      || Number(s.audioVersion) < 1 || ![0.75, 1, 1.25, 1.5, 2].includes(Number(s.rate))) return undefined
    return { placeId: s.placeId, language: s.language as Language, audioId: s.audioId,
      textVersion: Number(s.textVersion), audioVersion: Number(s.audioVersion),
      position: clampTime(Number(s.position), Number(s.duration)), duration: Number(s.duration), rate: Number(s.rate) }
  } catch { return undefined }
}

// CHỨC NĂNG: Chỉ chọn điểm gần nhất trong 100 m, giữ ổn định khi bằng nhau.
// XỬ LÝ: Tọa độ lấy từ nguồn bản đồ được ghi rõ, không coi là đã khảo sát GPS.
export function nearest(places: readonly PlaceRecord[], points: JourneyPorts['positions'], fix: Fix, previous?: string, now = Date.now()) {
  if (!validPoint(fix) || !Number.isFinite(fix.accuracy) || fix.accuracy < 0 || fix.accuracy > 60
    || !Number.isFinite(fix.timestamp) || Math.abs(now - fix.timestamp) > 30000) return undefined
  const matches = places.flatMap(p => {
    const point = points[p.id]
    if (!point || !validPoint(point)) return []
    const meters = distanceMeters(fix, point)
    return meters <= 100 ? [{ id: p.id, meters }] : []
  }).sort((a, b) => a.meters - b.meters || a.id.localeCompare(b.id))
  const stable = matches.find(m => m.id === previous)
  return stable && matches[0] && Math.abs(stable.meters - matches[0].meters) < 0.01 ? stable.id : matches[0]?.id
}

export function routeAvailable(route: VisitRoute, places: readonly PlaceRecord[]) {
  return route.available && route.stops.length > 0 && route.stops.every(id => places.some(p => p.id === id))
}

export class JourneyController {
  private state: JourneyState = { places: [], ready: false, status: 'idle', changed: false, gps: false }
  private listeners = new Set<() => void>()
  private track?: Track
  private unlisten?: () => void
  private unwatch?: () => void
  private generation = 0
  private lifecycle = 0
  private gpsGeneration = 0
  private intent?: { id: string; language: Language; autoplay: boolean }
  private writes: Promise<void> = Promise.resolve()
  private lastPersist = 0
  constructor(public readonly ports: JourneyPorts) {}
  snapshot = () => this.state
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  private set(next: Partial<JourneyState>) { this.state = { ...this.state, ...next }; this.listeners.forEach(l => l()) }

  // CHỨC NĂNG: Nạp danh mục và bản lưu độc lập.
  // XỬ LÝ: Bộ nhớ bị chặn vẫn giữ danh sách; bản ghi đổi phiên bản chỉ hiện lời nhắc.
  async start() {
    const life = ++this.lifecycle
    try {
      let readFailed = false
      const [places, raw] = await Promise.all([this.ports.catalog.list(), this.ports.read().catch(() => { readFailed = true; return null })])
      if (life !== this.lifecycle) return
      const saved = parseSaved(raw)
      let valid: Saved | undefined
      let changed = false
      if (saved) {
        const text = publishedText(places.find(p => p.id === saved.placeId) ?? { content: {} } as PlaceRecord, saved.language)
        const audio = text?.audio
        if (audio?.status === 'published' && audio.approvedAt && audio.publishedAt) {
          valid = saved
          changed = text?.version !== saved.textVersion || audio.id !== saved.audioId || audio.version !== saved.audioVersion
        }
      }
      this.set({ places, ready: true, restore: valid, changed,
        error: readFailed ? 'saveFailed' : raw && !valid ? 'savedInvalid' : undefined })
    } catch { if (life === this.lifecycle) this.set({ ready: true, error: 'loadError' }) }
  }

  // CHỨC NĂNG: Refresh danh mục sau công bố, không dừng nguồn audio đang nghe.
  async refreshCatalog() {
    const life = this.lifecycle
    try { const places = await this.ports.catalog.list(); if (life === this.lifecycle) this.set({ places }) }
    catch { if (life === this.lifecycle) this.set({ error: 'loadError' }) }
  }
  // CHỨC NĂNG: Ghi tuần tự để phản hồi ghi cũ không đè tiến độ mới.
  // XỬ LÝ: Lỗi lưu không dừng âm thanh; UI thông báo vẫn dùng được trong phiên.
  private persist(clear = false, quiet = false) {
    const s = this.state.session
    if (!s && !clear) return
    const value = clear ? null : JSON.stringify(s)
    const generation = this.generation
    this.writes = this.writes.then(() => this.ports.write(value)).catch(() => {
      // CHỨC NĂNG: Lỗi ghi của bài cũ không được mở lại player người dùng vừa đóng.
      // XỬ LÝ: Đối chiếu generation; close xóa checkpoint theo chế độ quiet.
      if (!quiet && generation === this.generation) this.set({ error: 'saveFailed' })
    })
  }
  private stopTrack() { this.unlisten?.(); this.unlisten = undefined; this.track?.pause(); this.track?.dispose(); this.track = undefined }

  // CHỨC NĂNG: Tải và phát một nguồn đã công bố.
  // XỬ LÝ: Mỗi lần gọi tăng generation; phản hồi cũ đến muộn chỉ được giải phóng.
  async play(id: string, language: Language, position = 0, autoplay = true, rate = 1) {
    const request = ++this.generation
    this.intent = { id, language, autoplay }
    this.persist()
    this.stopTrack()
    this.set({ status: 'loading', session: undefined, error: undefined, restore: undefined })
    let next: Track | undefined
    try {
      const place = await this.ports.catalog.get(id)
      if (request !== this.generation) return
      const text = publishedText(place, language)
      const audio = text?.audio
      if (!audio || audio.status !== 'published' || !audio.approvedAt || !audio.publishedAt) throw new Error('audioMissing')
      next = await this.ports.open(audio.url, text.title)
      if (request !== this.generation) { next.dispose(); return }
      if (!Number.isFinite(next.duration) || next.duration <= 0) throw new Error('audioFailed')
      this.track = next
      const session: Session = { placeId: id, language, title: text.title, textVersion: text.version,
        audioId: audio.id, audioVersion: audio.version, duration: next.duration,
        position: clampTime(position, next.duration), rate }
      await next.seek(session.position)
      if (request !== this.generation) return
      next.rate(rate)
      this.set({ session, status: 'paused' })
      this.unlisten = next.listen(status => {
        if (request !== this.generation || !this.state.session) return
        if (status.error) { this.persist(); this.stopTrack(); this.set({ status: 'error', error: 'audioFailed' }); return }
        this.set({ session: { ...this.state.session, position: clampTime(status.position, status.duration), duration: status.duration },
          status: status.ended ? 'ended' : status.playing ? 'playing' : 'paused' })
        if (status.ended) this.persist(true)
        else if (Date.now() - this.lastPersist > 5000) { this.lastPersist = Date.now(); this.persist() }
      })
      if (autoplay) { await next.play(); if (request === this.generation && this.intent?.autoplay) this.set({ status: 'playing' }) }
      this.persist()
    } catch (error) {
      if (request !== this.generation) { next?.dispose(); return }
      // CHỨC NĂNG: Pause ngay sau Play là thao tác bình thường, không phải lỗi nguồn.
      // XỬ LÝ: HTML Audio có thể hủy Promise play bằng AbortError khi pause đến trước.
      if (error instanceof Error && error.name === 'AbortError' && !this.intent?.autoplay && next === this.track) { this.persist(); return }
      if (next && next !== this.track) next.dispose()
      this.stopTrack()
      this.set({ status: 'error', error: error instanceof Error && error.message === 'audioMissing' ? 'audioMissing' : 'audioFailed' })
    }
  }

  // CHỨC NĂNG: Dừng và đóng hoàn toàn trình nghe khi nhấn × trên web/native.
  // XỬ LÝ: generation vô hiệu hóa tải/Promise cũ; gỡ listener trước khi pause/dispose.
  // Xóa phiên và checkpoint để đổi ngôn ngữ/retry không tự mở lại bài đã đóng.
  // Danh mục, tuyến và GPS giữ nguyên vì đóng trình nghe không phải thoát ứng dụng.
  close() {
    this.generation++
    this.intent = undefined
    this.stopTrack()
    this.set({ status: 'idle', session: undefined, restore: undefined, changed: false, error: undefined })
    this.persist(true, true)
  }

  // CHỨC NĂNG: Tạm dừng, tiếp tục, tua và tốc độ tác động trực tiếp lên Track thật.
  // XỬ LÝ: Chỉ cập nhật trạng thái khi nguồn hiện tại vẫn là nguồn đã thao tác.
  pause() { if (!this.track) return; if (this.intent) this.intent.autoplay = false; this.track.pause(); this.set({ status: 'paused' }); this.persist() }
  async resume() {
    const t = this.track
    if (!t) return
    if (this.intent) this.intent.autoplay = true
    try { await t.play(); if (t === this.track && this.intent?.autoplay) this.set({ status: 'playing', error: undefined }) }
    catch (error) { if (error instanceof Error && error.name === 'AbortError' && !this.intent?.autoplay) return; if (t === this.track) this.set({ status: 'error', error: 'audioFailed' }) }
  }
  async seek(value: number) {
    const t = this.track, s = this.state.session
    if (!t || !s || this.state.status === 'loading') return
    try { const position = clampTime(value, s.duration); await t.seek(position)
      if (t === this.track && this.state.session) { this.set({ session: { ...this.state.session, position } }); this.persist() }
    } catch { if (t === this.track) this.set({ error: 'audioFailed' }) }
  }
  rate(value: number) {
    if (!this.track || !this.state.session || ![0.75, 1, 1.25, 1.5, 2].includes(value)) return
    try { this.track.rate(value); this.set({ session: { ...this.state.session, rate: value } }); this.persist() }
    catch { this.set({ error: 'audioFailed' }) }
  }
  // CHỨC NĂNG: Đổi cả bài đọc và audio theo ngôn ngữ chung UC08.
  // XỬ LÝ: Đang nghe thì phát bản mới từ 0; đang tạm dừng vẫn tạm dừng từ 0.
  changeLanguage(language: Language) {
    const active = this.intent
    if (!active || active.language === language) return
    const autoplay = this.state.status === 'playing' || (this.state.status === 'loading' && active.autoplay)
    void this.play(active.id, language, 0, autoplay, this.state.session?.rate ?? 1)
  }
  dismissRestore() { this.set({ restore: undefined, changed: false }); this.persist(true) }
  async restorePlay() { const s = this.state.restore; if (s) await this.play(s.placeId, s.language, this.state.changed ? 0 : s.position, true, s.rate) }
  selectRoute(id?: string) {
    const route = this.ports.routes.find(r => r.id === id)
    this.set({ routeId: route && routeAvailable(route, this.state.places) ? id : undefined })
  }

  // CHỨC NĂNG: GPS chỉ đổi gợi ý, không gọi play.
  // XỬ LÝ: Đang phát/đang tải/đã kết thúc hoặc đang chờ khôi phục thì giữ màn.
  acceptFix(fix: Fix) {
    const weak = !Number.isFinite(fix.accuracy) || fix.accuracy < 0 || !Number.isFinite(fix.timestamp) || fix.accuracy > 60 || Math.abs(Date.now() - fix.timestamp) > 30000 || !validPoint(fix)
    const prior = this.state.error
    this.set({ fix: weak ? undefined : fix, error: weak ? 'gpsWeak' : prior === 'gpsWeak' || prior === 'gpsFailed' ? undefined : prior })
    if (weak || !['idle', 'paused', 'error'].includes(this.state.status) || this.state.restore) return
    this.set({ suggestedId: nearest(this.state.places, this.ports.positions, fix, this.state.suggestedId) })
  }
  async gps(enabled: boolean) {
    const request = ++this.gpsGeneration
    this.unwatch?.(); this.unwatch = undefined
    this.set({ gps: enabled, error: undefined })
    if (!enabled) return
    try {
      const stop = await this.ports.watch(fix => { if (request === this.gpsGeneration) this.acceptFix(fix) },
        () => { if (request === this.gpsGeneration) this.set({ gps: false, error: 'gpsFailed' }) })
      if (request !== this.gpsGeneration) stop(); else this.unwatch = stop
    } catch { if (request === this.gpsGeneration) this.set({ gps: false, error: 'gpsFailed' }) }
  }
  // CHỨC NĂNG: Chốt tiến độ khi web/app ra nền, không dừng bài đang nghe.
  checkpoint() { this.persist(this.state.status === 'ended') }
  retry() { if (this.state.error === 'loadError') { void this.start(); return } const i = this.intent; if (i) void this.play(i.id, i.language) }
  dispose() { this.lifecycle++; this.generation++; this.gpsGeneration++; this.persist(this.state.status === 'ended'); this.unwatch?.(); this.unwatch = undefined; this.stopTrack() }
}

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Chạy npm test; kiểm tra chỉ có một nguồn đang nghe.
 * - Đổi ngôn ngữ lúc tải chậm: nguồn cũ không được phát muộn.
 */
```

## 52. SỬA — packages/visitor-core/src/model.ts

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\model.ts

```ts
/**
 * FILE NÀY LÀM GÌ:
 * Định nghĩa dữ liệu dùng chung cho UC01–UC11.
 * Service, hooks và các màn mobile/web sử dụng.
 * Không phụ thuộc React Native hoặc trình duyệt.
 */

// CHỨC NĂNG: Khai báo các ngôn ngữ được hỗ trợ.
// XỬ LÝ: Giữ cn làm mã nội bộ để tương thích lựa chọn đã lưu.
export const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'cn', label: '中文' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
] as const

export type Language = (typeof LANGUAGES)[number]['code']

// CHỨC NĂNG: Nhận diện ngôn ngữ từ bộ nhớ hoặc thiết bị.
// XỬ LÝ: zh-CN thành cn, pt_BR thành pt; không hỗ trợ trả null.
export function languageOf(
  value: string | null | undefined,
): Language | null {
  const base = value
    ?.toLowerCase()
    .replace(/_/g, '-')
    .split('-')[0]

  return base === 'zh'
    ? 'cn'
    : LANGUAGES.find((item) => item.code === base)?.code ?? null
}

// CHỨC NĂNG: Khai báo mã danh mục ổn định.
// XỬ LÝ: UI lấy tên qua i18n; không dùng tên tiếng Việt làm mã.
export const CATEGORIES = [
  'palace',
  'gate',
  'temple',
  'tomb',
  'museum',
  'monument',
] as const

export type Category = (typeof CATEGORIES)[number]

export type Zone = 'fortifications' | 'ceremonial'
export type SortOrder = 'name' | 'nearest'

export type Point = {
  lat: number
  lng: number
}

// CHỨC NĂNG: Mô tả một bản nội dung theo ngôn ngữ.
// XỬ LÝ: Service kiểm tra trạng thái duyệt/công bố trước khi trả cho khách.
// CHỨC NĂNG: Nguồn audio có phiên bản và trạng thái công bố riêng.
// XỬ LÝ: Optional trong PublishedText để dữ liệu UC01–UC11 cũ vẫn dùng được.
export type PublishedAudio = {
  id: string; url: string; version: number
  status: 'draft' | 'published'; approvedAt?: string; publishedAt?: string
}
export type PublishedText = {
  audio?: PublishedAudio
  title: string
  summary: string
  body: string
  address: string
  version: number
  status: 'draft' | 'approved' | 'published'
  approvedAt?: string
  publishedAt?: string
}

// CHỨC NĂNG: Mô tả một địa điểm trong danh mục triển khai.
// XỬ LÝ: Các trường mới optional để dữ liệu cũ vẫn dùng được.
export type PlaceRecord = {
  id: string
  scope: string
  inLaunchCatalog: boolean
  status: 'draft' | 'published' | 'withdrawn'
  canonicalTitle: string
  zone: Zone
  images: string[]
  period?: string
  category?: Category
  featured?: boolean

  // CHỨC NĂNG: Phân biệt tọa độ đã xác nhận.
  // XỬ LÝ: Chỉ dùng verified=true để tính khoảng cách.
  position?: Point & {
    verified: boolean
  }

  // CHỨC NĂNG: Cho phép thiếu một số bản ngôn ngữ.
  // XỬ LÝ: Không tự dịch chưa duyệt để lấp bản thiếu.
  content: Partial<Record<Language, PublishedText>>
}

// CHỨC NĂNG: Đọc danh mục của dữ liệu mới hoặc dữ liệu cũ.
// XỬ LÝ: Thiếu category thì suy ra từ zone để tương thích ngược.
export function categoryOf(place: PlaceRecord): Category {
  return place.category
    ?? (place.zone === 'fortifications' ? 'gate' : 'palace')
}

export type CatalogSource =
  () => Promise<readonly PlaceRecord[]>

// CHỨC NĂNG: Tách logic ngôn ngữ khỏi công nghệ lưu trữ.
// XỬ LÝ: Mobile cung cấp AsyncStorage, web cung cấp localStorage.
export type StoragePort = {
  readLanguage: () => Promise<string | null>
  writeLanguage: (language: Language) => Promise<void>
}
```

## 53. SỬA — packages/visitor-core/src/react.tsx

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\packages\visitor-core\src\react.tsx

```tsx
/**
 * FILE NÀY LÀM GÌ:
 * Quản lý ngôn ngữ, tải dữ liệu, debounce và bộ lọc cho UC01–UC05.
 * App bọc VisitorProvider; các màn hình gọi hook từ file này.
 * Phụ thuộc React, i18next và logic thuần trong visitor-core.
 *
 * Không import AsyncStorage, camera hoặc API vị trí trực tiếp.
 * Những phần nền tảng được truyền qua adapter.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { createInstance, type i18n } from 'i18next'

import {
  I18nextProvider,
  initReactI18next,
  useTranslation,
} from 'react-i18next'

import {
  languageOf,
  type Language,
  type PlaceRecord,
  type Point,
  type SortOrder,
  type StoragePort,
  type Zone,
} from './model'

import { CatalogError, type Catalog } from './catalog'
import { demoCatalog } from './mock'
import { messages, type MessageKey } from './messages'
import { distanceTo, selectPlaces, validPoint } from './search'
// CHỨC NĂNG: Sử dụng danh mục cho bộ lọc mới.
// XỬ LÝ: categoryOf hỗ trợ cả dữ liệu chưa có category.
import { categoryOf, type Category } from './model'

// CHỨC NĂNG: Tạo instance i18n cho toàn bộ luồng visitor.
// XỬ LÝ: UI và hook dùng cùng instance nên không bị lệch ngôn ngữ.
// Namespace visitor tách khỏi cấu hình translation cũ.
export function createVisitorI18n() {
  const instance = createInstance()

  const ready = instance.use(initReactI18next).init({
    resources: Object.fromEntries(
      Object.entries(messages).map(([language, text]) => [
        language,
        { visitor: text },
      ]),
    ),
    ns: ['visitor'],
    defaultNS: 'visitor',
    lng: 'vi',
    fallbackLng: 'vi',
    supportedLngs: ['vi', 'en', 'cn', 'pt', 'ja'],
    load: 'currentOnly',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

  return { instance, ready }
}

type Boot = ReturnType<typeof createVisitorI18n>

type VisitorState = {
  language: Language
  saving: boolean
  persistenceError: 'saveError' | 'readError' | null
  changeLanguage: (language: Language) => Promise<void>
  catalog: Catalog
}

const Context = createContext<VisitorState | null>(null)

type ProviderProps = {
  boot: Boot
  storage: StoragePort
  deviceLanguage: string | null
  catalog?: Catalog
  loading: ReactNode
  children: ReactNode
}

// CHỨC NĂNG: Kết nối React với instance i18n.
// XỬ LÝ: StateProvider nằm bên trong I18nextProvider để hook nhận đúng instance.
export function VisitorProvider(props: ProviderProps) {
  
  return (
    <I18nextProvider i18n={props.boot.instance}>
      <StateProvider {...props} />
    </I18nextProvider>
  )
}

// CHỨC NĂNG: Khởi tạo và lưu lựa chọn ngôn ngữ.
// XỬ LÝ: Ưu tiên đã lưu -> thiết bị -> Việt;
// chỉ hiện màn hình sau khi đọc lựa chọn ban đầu.
function StateProvider({
  boot,
  storage,
  deviceLanguage,
  catalog = demoCatalog,
  loading,
  children,
}: ProviderProps) {
  const { i18n: instance } = useTranslation('visitor')

  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)

  const [persistenceError, setPersistenceError] =
    useState<VisitorState['persistenceError']>(null)
  const busy = useRef(false)

  useEffect(() => {
    let cancelled = false

    const initialize = async () => {
      await boot.ready

      let saved: string | null = null
      let failed = false

      try {
        saved = await storage.readLanguage()
      } catch {
        failed = true
      }

      // CHỨC NĂNG: Bỏ kết quả khi provider đã rời cây giao diện.
      // XỬ LÝ: Không tiếp tục cập nhật state của lần khởi tạo cũ.
      if (cancelled) return

      await instance.changeLanguage(
        languageOf(saved)
        ?? languageOf(deviceLanguage)
        ?? 'vi',
      )

      if (!cancelled) {
        setPersistenceError(failed ? 'readError' : null)
        setReady(true)
      }
    }

    void initialize()

    return () => {
      cancelled = true
    }
  }, [boot, storage, deviceLanguage, instance])

  // CHỨC NĂNG: Đổi ngôn ngữ giao diện và lưu lựa chọn.
  // XỬ LÝ: Khóa đồng bộ bằng ref để tránh bấm liên tục;
  // lỗi lưu vẫn giữ lựa chọn trong phiên và hiện thông báo.
  const changeLanguage = useCallback(
    async (language: Language) => {
      if (busy.current) return

      busy.current = true
      setSaving(true)
      setPersistenceError(null)

      try {
        await instance.changeLanguage(language)

        try {
          await storage.writeLanguage(language)
        } catch {
          setPersistenceError('saveError')
        }
      } finally {
        busy.current = false
        setSaving(false)
      }
    },
    [instance, storage],
  )

  const language =
    languageOf(instance.resolvedLanguage ?? instance.language)
    ?? 'vi'
   // CHỨC NĂNG: Tạo dữ liệu context dùng chung cho các màn hình.
  // XỬ LÝ: Chỉ tạo object mới khi một giá trị phụ thuộc thay đổi.
  const value = useMemo(
    () => ({
      language,
      saving,
      persistenceError,
      changeLanguage,
      catalog,
    }),
    [
      language,
      saving,
      persistenceError,
      changeLanguage,
      catalog,
    ],
  )

  // CHỨC NĂNG: Hiển thị giao diện chờ khi chưa đọc xong ngôn ngữ.
  // XỬ LÝ: Trả JSX thay vì để component không trả về giá trị.
  if (!ready) {
    return <>{loading}</>
  }

  // CHỨC NĂNG: Cung cấp trạng thái cho tất cả component con.
  // XỬ LÝ: children được đặt bên trong Context.Provider
  // để các hook useVisitor có thể đọc ngôn ngữ, service và dấu tim.
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

// CHỨC NĂNG: Đọc trạng thái dùng chung.
// XỬ LÝ: Báo lỗi lập trình nếu component quên nằm trong provider.
export function useVisitor() {
  const value = useContext(Context)

  if (!value) {
    throw new Error('VisitorProvider is missing')
  }

  return value
}

// CHỨC NĂNG: Trả hàm dịch có kiểm tra tên key.
// XỬ LÝ: Chỉ đọc namespace visitor; tự render lại khi đổi ngôn ngữ.
export function useText(): (key: MessageKey) => string {
  const { t } = useTranslation('visitor')

  return useCallback(
    (key: MessageKey) => String(t(key)),
    [t],
  )
}

// CHỨC NĂNG: Chờ 300 ms sau lần gõ cuối.
// XỬ LÝ:
// - Ô nhập vẫn cập nhật ngay.
// - Khi gõ tiếp, cleanup hủy timer trước.
// - Rời màn cũng hủy timer, không cập nhật giá trị cũ.
export function useDebounce<T>(value: T, delay = 300): T {
  const [result, setResult] = useState(value)

  useEffect(() => {
    const timer = setTimeout(
      () => setResult(value),
      delay,
    )

    return () => clearTimeout(timer)
  }, [value, delay])

  return result
}

// CHỨC NĂNG: Tải, làm mới và thử lại danh sách UC02.
// XỬ LÝ: Mỗi request có số thứ tự; phản hồi cũ không ghi đè phản hồi mới.
export function usePublishedCatalog() {
  const { catalog } = useVisitor()

  const [state, setState] = useState<{
    places: PlaceRecord[]
    loading: boolean
    error: boolean
  }>({
    places: [],
    loading: true,
    error: false,
  })

  const sequence = useRef(0)

  const reload = useCallback(async () => {
    const request = ++sequence.current

    setState((previous) => ({
      ...previous,
      loading: true,
      error: false,
    }))

    try {
      const places = await catalog.list()

      if (sequence.current === request) {
        setState({
          places,
          loading: false,
          error: false,
        })
      }
    } catch {
      if (sequence.current === request) {
        setState((previous) => ({
          ...previous,
          loading: false,
          error: true,
        }))
      }
    }
  }, [catalog])

  // CHỨC NĂNG: Vô hiệu hóa request đang chờ khi rời màn.
  // XỬ LÝ: Không cần hủy Promise mock; chỉ không nhận kết quả cũ.
  const cancel = useCallback(() => {
    sequence.current++
  }, [])

  useEffect(() => {
    void reload()
    return cancel
  }, [reload, cancel])

  // CHỨC NĂNG: Cập nhật bản công khai trong cùng app khi Admin công bố.
  useEffect(() => catalog.subscribe?.(() => { void reload() }), [catalog, reload])

  return { ...state, reload }
}

// CHỨC NĂNG: Tải chi tiết theo ID cho UC04.
// XỬ LÝ: Phân biệt không tồn tại với lỗi nguồn;
// gắn state với ID để không hiện dữ liệu điểm trước đó.
export function usePublishedPlace(id: string) {
  const { catalog } = useVisitor()
  const [attempt, setAttempt] = useState(0)

  const [state, setState] = useState<{
    id: string
    place?: PlaceRecord
    loading: boolean
    error: 'notFound' | 'loadError' | null
  }>({
    id: '',
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    setState({
      id,
      loading: true,
      error: null,
    })

    catalog.get(id)
      .then((place) => {
        if (!cancelled) {
          setState({
            id,
            place,
            loading: false,
            error: null,
          })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            id,
            loading: false,
            error: error instanceof CatalogError
              ? 'notFound'
              : 'loadError',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [catalog, id, attempt])

  useEffect(() => catalog.subscribe?.(() => setAttempt(value => value + 1)), [catalog])

  const current = state.id === id
    ? state
    : {
      id,
      loading: true,
      error: null,
    }

  return {
    ...current,
    retry: () => setAttempt((value) => value + 1),
  }
}

// CHỨC NĂNG: Gom trạng thái tìm kiếm, lọc và sắp xếp UC03.
// XỬ LÝ: useMemo chỉ tính lại khi dữ liệu hoặc điều kiện thực sự đổi.
export function usePlaceFilters(
  places: readonly PlaceRecord[],
  origin?: Point,
) {
  const { language } = useVisitor()

  const [query, setQuery] = useState('')
  const [zone, setZone] = useState<Zone | null>(null)
  const [order, setOrder] = useState<SortOrder>('name')

  const debounced = useDebounce(query)

  const results = useMemo(
    () => selectPlaces(places, {
      language,
      query: debounced,
      zone,
      order,
      origin,
    }),
    [places, language, debounced, zone, order, origin],
  )

  const zones = useMemo(
    () => [...new Set(places.map((place) => place.zone))],
    [places],
  )

  const effectiveOrder: SortOrder =
    order === 'nearest'
      && results.some(
        (place) => distanceTo(place, origin) !== undefined,
      )
      ? 'nearest'
      : 'name'

  return {
    query,
    setQuery,
    zone,
    setZone,
    order,
    setOrder,
    effectiveOrder,
    results,
    zones,

    // CHỨC NĂNG: Xóa từ khóa và nhóm đã chọn.
    // XỬ LÝ: Giữ cách sắp xếp người dùng đang chọn.
    reset: () => {
      setQuery('')
      setZone(null)
    },
  }
}

// CHỨC NĂNG: Xin vị trí khi người dùng chủ động bấm.
// XỬ LÝ: Bắt lỗi quyền/GPS, chặn yêu cầu lặp,
// tránh cập nhật state sau khi component đã unmount.
export function useVisitorPosition(
  getPosition: () => Promise<Point>,
) {
  const [origin, setOrigin] = useState<Point>()
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  const mounted = useRef(true)
  const busy = useRef(false)

  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  }, [])

  const request = useCallback(async () => {
    if (busy.current) return

    busy.current = true
    setLoading(true)
    setFailed(false)

    try {
      const point = await getPosition()

      if (!validPoint(point)) {
        throw new Error('Invalid position')
      }

      if (mounted.current) setOrigin(point)
    } catch {
      if (mounted.current) {
        setOrigin(undefined)
        setFailed(true)
      }
    } finally {
      busy.current = false

      if (mounted.current) setLoading(false)
    }
  }, [getPosition])

  return { origin, loading, failed, request }
}
/**
 * CHỨC NĂNG:
 * Gom điều kiện tìm kiếm/lọc theo mockup UC03.
 *
 * XỬ LÝ:
 * - Nhiều danh mục cùng nhóm kết hợp OR.
 * - Từ khóa, danh mục và khu vực kết hợp AND.
 * - initial chỉ dùng khi component được tạo.
 * - Web đổi URL sẽ đổi key component để khởi tạo lại điều kiện.
 */
export function useExplore(
  places: readonly PlaceRecord[],
  origin?: Point,
  initial: {
    query?: string
    category?: Category
  } = {},
) 
{
  const { language } = useVisitor()

  const [query, setQuery] = useState(initial.query ?? '')
  const [within, setWithin] = useState('')

  const [categories, setCategories] = useState<Category[]>(
    initial.category ? [initial.category] : [],
  )

  const [zones, setZones] = useState<Zone[]>([])
  const [order, setOrder] = useState<SortOrder>('nearest')

  // CHỨC NĂNG: Chờ lần gõ cuối trước khi tìm.
  // XỬ LÝ: useDebounce hiện có hủy timer cũ trong cleanup.
  const debounced = useDebounce(query + ' ' + within)

  // CHỨC NĂNG: Tính kết quả khi điều kiện thực sự thay đổi.
  // XỬ LÝ: Không lọc lại vì một render không liên quan.
  const results = useMemo(
    () => selectPlaces(places, {
      language,
      query: debounced,
      zone: null,
      order,
      origin,
      categories,
      zones,
    }),
    [
      places,
      language,
      debounced,
      order,
      origin,
      categories,
      zones,
    ],
  )

  const availableCategories = useMemo(
    () => [...new Set(places.map(categoryOf))],
    [places],
  )

  const availableZones = useMemo(
    () => [...new Set(places.map((place) => place.zone))],
    [places],
  )

  // CHỨC NĂNG: Cho UI biết cách sắp xếp thực tế.
  // XỬ LÝ: Không giả là gần nhất khi thiếu vị trí/tọa độ xác nhận.
  const effectiveOrder: SortOrder =
    order === 'nearest'
      && results.some(
        (place) => distanceTo(place, origin) !== undefined,
      )
      ? 'nearest'
      : 'name'

  const reset = () => {
    setQuery('')
    setWithin('')
    setCategories([])
    setZones([])
  }

  return {
    query,
    setQuery,
    within,
    setWithin,
    categories,
    setCategories,
    zones,
    setZones,
    order,
    setOrder,
    results,
    availableCategories,
    availableZones,
    effectiveOrder,
    reset,
  }
}
export type VisitorI18n = i18n
```

## 54. TẠO MỚI — scripts/build-admin-tests.cjs

Đường dẫn: D:\3.HTML\Đồ án CNPM\ThuyetMinhTuDong\scripts\build-admin-tests.cjs

```js
/** FILE NÀY LÀM GÌ: Bundle logic Admin để Node test đọc được workspace TypeScript.
 * admin-core npm test gọi; dùng esbuild có sẵn từ Vite, không tải thư viện mới.
 * Không bundle React; chỉ entry logic thuần. */
const path = require('node:path')
const { createRequire } = require('node:module')
const root = path.resolve(__dirname, '..')
const req = createRequire(path.join(root, 'apps/web/package.json'))
req('esbuild').buildSync({ entryPoints: [path.join(root,'packages/admin-core/src/index.ts')],
 bundle: true, platform: 'node', format: 'cjs', outfile: path.join(root,'packages/admin-core/.test-build/index.cjs') })
```

## Workflow GitHub ở gốc repository

### SỬA — D:\3.HTML\Đồ án CNPM\.github\workflows\mobile-ci.yml

```yaml
# FILE NÀY LÀM GÌ: Kiểm tra mobile và logic UC01–UC05 khi push/PR.
# GitHub Actions đọc ở gốc repository; npm ci chạy tại gốc npm workspaces.
name: Mobile CI
on:
  push:
    paths: ['ThuyetMinhTuDong/apps/mobile/**', 'ThuyetMinhTuDong/packages/**', 'ThuyetMinhTuDong/package*.json', 'ThuyetMinhTuDong/.eslintrc.cjs', 'ThuyetMinhTuDong/scripts/**', '.github/workflows/mobile-ci.yml']
  pull_request:
    paths: ['ThuyetMinhTuDong/apps/mobile/**', 'ThuyetMinhTuDong/packages/**', 'ThuyetMinhTuDong/package*.json', 'ThuyetMinhTuDong/.eslintrc.cjs', 'ThuyetMinhTuDong/scripts/**', '.github/workflows/mobile-ci.yml']
  workflow_dispatch:
permissions:
  contents: read
jobs:
  check:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ThuyetMinhTuDong
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: ThuyetMinhTuDong/package-lock.json
      - run: npm ci
      - run: npm run typecheck --workspace=mobile
      - run: npm run typecheck --workspace=@travelguide/visitor-core
      - run: npm run lint --workspace=mobile
      - run: npm run lint --workspace=@travelguide/visitor-core
      - run: npm run typecheck --workspace=@travelguide/admin-core
      - run: npm run lint --workspace=@travelguide/admin-core
      - run: npm test
```

### SỬA — D:\3.HTML\Đồ án CNPM\.github\workflows\web-ci.yml

```yaml
# FILE NÀY LÀM GÌ: Kiểm tra và đóng gói web UC01–UC05.
# Build artifact có thể tải từ Actions; việc phát hành website cần cấu hình hosting.
name: Web CI
on:
  push:
    paths: ['ThuyetMinhTuDong/apps/web/**', 'ThuyetMinhTuDong/packages/**', 'ThuyetMinhTuDong/package*.json', 'ThuyetMinhTuDong/.eslintrc.cjs', 'ThuyetMinhTuDong/scripts/**', '.github/workflows/web-ci.yml']
  pull_request:
    paths: ['ThuyetMinhTuDong/apps/web/**', 'ThuyetMinhTuDong/packages/**', 'ThuyetMinhTuDong/package*.json', 'ThuyetMinhTuDong/.eslintrc.cjs', 'ThuyetMinhTuDong/scripts/**', '.github/workflows/web-ci.yml']
  workflow_dispatch:
permissions:
  contents: read
jobs:
  check:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ThuyetMinhTuDong
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: ThuyetMinhTuDong/package-lock.json
      - run: npm ci
      - run: npm run typecheck --workspace=web
      - run: npm run typecheck --workspace=@travelguide/visitor-core
      - run: npm run lint --workspace=web
      - run: npm run lint --workspace=@travelguide/visitor-core
      - run: npm run typecheck --workspace=@travelguide/admin-core
      - run: npm run lint --workspace=@travelguide/admin-core
      - run: npm test
      - run: npm run build:web
      - uses: actions/upload-artifact@v4
        with:
          name: web-dist
          path: ThuyetMinhTuDong/apps/web/dist
          if-no-files-found: error
```

