/**
 * FILE NÀY LÀM GÌ
 * Nghiệp vụ quản trị mô phỏng: tạo/sửa, gửi duyệt, duyệt, công bố, lưu trữ/xóa. Kiểm tra revision
 * và xếp hàng ghi.
 *
 * VỊ TRÍ: packages/admin-core/src/services/mockService.ts
 * DÙNG BỞI: packages/admin-core/src/index.ts.
 * PHỤ THUỘC: @travelguide/visitor-core; ../domain/contracts; ../domain/models;
 * ../domain/validation
 * TẠI SAO TÁCH FILE: Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
 * lớp kết nối này.
 */
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { MOCK_PLACES, LANGUAGES, bundledNarration } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Language, PlaceRecord, PublishedText } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '../domain/contracts'.
import type { AdminService, StoragePort } from '../domain/contracts'
// Nhập kiểu dữ liệu từ '../domain/models'.
import type { AdminDocument, ManagedPlace, ContentInput } from '../domain/models'
// Nhập các thành phần từ '../domain/models'.
import { AdminError } from '../domain/models'
// Nhập các thành phần từ '../domain/validation'.
import { mediaUrl, readyForReview, validatePlace } from '../domain/validation'
// Khai báo clone: khai báo callback <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T.
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T
// TẠI SAO (clone): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
// phải xử lý dữ liệu sai như thành công.
// Khai báo stamp: khai báo callback () => new Date().toISOString().
const stamp = () => new Date().toISOString()
// TẠI SAO (stamp): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
// lớp kết nối này.
// Khai báo seed: khai báo callback (): AdminDocument => ({ schema: 1, sessions: [], audit: [], places: MOCK_PL. | Gán thuộc tính schema: giá trị số 1. | Gán thuộc tính sessions: tạo mảng []. | Gán thuộc tính audit: tạo mảng []. | Gán thuộc tính places: MOCK_PLACES.map tạo mảng kết quả từ từng phần tử, dùng cho dữ liệu dẫn xuất hoặc danh sách thành phần. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
const seed = (): AdminDocument => ({ schema: 1, sessions: [], audit: [], places: MOCK_PLACES.map(record => ({
  // Gán thuộc tính id: đọc record.id từ đối tượng/mảng để dùng tại bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi. | Gán thuộc tính record: Gọi clone(record). | Gán thuộc tính period: tính biểu thức record.period ?? ''. | Gán thuộc tính revision: giá trị số 1. | Gán thuộc tính workflow: chuỗi 'published'. | Gán thuộc tính reviewNote: chuỗi ''.
  id: record.id, record: clone(record), period: record.period ?? '', revision: 1, workflow: 'published', reviewNote: '',
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `approvedRevision: 1, published: clone(record), updatedAt: stamp(),`: Gán thuộc tính approvedRevision: giá trị số 1. | Gán thuộc tính published: Gọi clone(record). | Gán thuộc tính updatedAt: Gọi stamp().
   * DÒNG `})) })`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  approvedRevision: 1, published: clone(record), updatedAt: stamp(),
})) })
// TẠI SAO (seed): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý tập dữ
// liệu.
// CHỨC NĂNG: Kiểm tra dữ liệu quản trị đọc từ kho.
// XỬ LÝ: Chỉ nhận schema và cấu trúc hợp lệ; JSON hỏng không được âm thầm coi là dữ liệu mới.
// Khai báo readDocument(raw). Kiểm tra dữ liệu quản trị đã đọc trước khi dùng, tránh coi JSON hỏng là một bản hợp lệ.
function readDocument(raw: string): AdminDocument {
  // CHỨC NĂNG: Kiểm tra dữ liệu cục bộ trước khi coi là AdminDocument.
  // XỬ LÝ: JSON hỏng/khác schema phải báo lỗi; không tự ghi đè dữ liệu đã có bằng seed.
  // Khai báo x: JSON.parse chuyển chuỗi sang dữ liệu.
  const x: unknown = JSON.parse(raw)
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `if (!x || typeof x !== 'object' || !('schema' in x) || x.schema !== 1 || !('places' i`: Rẽ nhánh nếu !x || typeof x !== 'object' || !('schema' in x) || x.schema !== 1 || !('places' in x) || !Array.isArray(x.plac.
   * DÒNG `|| !('sessions' in x) || !Array.isArray(x.sessions) || !('audit' in x) || !Array.isAr`: Rẽ nhánh nếu !x || typeof x !== 'object' || !('schema' in x) || x.schema !== 1 || !('places' in x) || !Array.isArray(x.plac. | Ném new AdminError('loadError').
   */
  if (!x || typeof x !== 'object' || !('schema' in x) || x.schema !== 1 || !('places' in x) || !Array.isArray(x.places)
    || !('sessions' in x) || !Array.isArray(x.sessions) || !('audit' in x) || !Array.isArray(x.audit)) throw new AdminError('loadError')
  // Duyệt lần lượt x.places bằng const p.
  for (const p of x.places) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (!p || typeof p !== 'object' || typeof p.id !== 'string' || !Number.isInteger(p.re`: Rẽ nhánh nếu !p || typeof p !== 'object' || typeof p.id !== 'string' || !Number.isInteger(p.revision) || p.revision < 1 ||.
     * DÒNG `|| !['draft','submitted','changes','approved','published','archived'].includes(p.work`: Rẽ nhánh nếu !p || typeof p !== 'object' || typeof p.id !== 'string' || !Number.isInteger(p.revision) || p.revision < 1 ||.
     * DÒNG `|| !p.record || !Array.isArray(p.record.images) || !p.record.content || typeof p.peri`: Rẽ nhánh nếu !p || typeof p !== 'object' || typeof p.id !== 'string' || !Number.isInteger(p.revision) || p.revision < 1 ||. | Ném new AdminError('loadError').
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    if (!p || typeof p !== 'object' || typeof p.id !== 'string' || !Number.isInteger(p.revision) || p.revision < 1
      || !['draft','submitted','changes','approved','published','archived'].includes(p.workflow)
      || !p.record || !Array.isArray(p.record.images) || !p.record.content || typeof p.period !== 'string') throw new AdminError('loadError')
  }
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return x as AdminDocument`: Trả kết quả: sử dụng x làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return x as AdminDocument
}
// TẠI SAO (readDocument): JSON hợp lệ về cú pháp vẫn có thể sai cấu trúc; không nên dùng dữ liệu
// hỏng hoặc ghi đè thành seed.
// CHỨC NĂNG: Nhận bộ tạo MP3 từ server; logic FE không giữ khóa dịch vụ TTS.
// XỬ LÝ: Test có thể dùng bài đã đóng gói; bài mới cần adapter tạo giọng thật.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function createMockAdminService(storage: StoragePort,`: Khai báo createMockAdminService(storage, prepareAudio). Nhận đầu vào qua tham số.
 * DÒNG `prepareAudio?: (body: string, language: Language) => Promise<string>,`: Nhận đầu vào prepareAudio?: (body: string, language: Language) => Promise<string> từ nơi gọi hàm.
 * DÒNG `): AdminService {`: Khai báo createMockAdminService(storage, prepareAudio). Nhận đầu vào qua tham số.
 */
export function createMockAdminService(storage: StoragePort,
  prepareAudio?: (body: string, language: Language) => Promise<string>,
): AdminService {
  // CHỨC NĂNG: Bản dữ liệu đã nạp trong RAM để không đọc lại kho cho mỗi thao tác.
  // Khai báo cached: không có giá trị khởi tạo.
  let cached: AdminDocument | undefined
  // Khai báo loading: không có giá trị khởi tạo.
  let loading: Promise<AdminDocument> | undefined
  // CHỨC NĂNG: Hàng đợi ghi nối tiếp; tránh hai thao tác lưu hoàn tất theo thứ tự ngược.
  // Khai báo queue: Gọi Promise.resolve().
  let queue: Promise<void> = Promise.resolve()
  // CHỨC NĂNG: Các callback nhận thay đổi; dùng Set để không đăng ký trùng cùng tham chiếu.
  // Khai báo listeners: Set giữ các phần tử duy nhất để tránh đăng ký hoặc đếm trùng.
  const listeners = new Set<() => void>()
  // Khai báo notify: khai báo callback () => listeners.forEach(listener => listener()).
  const notify = () => listeners.forEach(listener => listener())
  // TẠI SAO (notify): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
  // lớp kết nối này.
  // Khai báo load(). Nhận đầu vào qua tham số.
  async function load(): Promise<AdminDocument> {
    // Rẽ nhánh nếu !cached.
    if (!cached) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `loading ??= storage.read().then(raw => { cached = raw ? readDocument(raw) : seed(); r`: Thực hiện tính biểu thức loading ??= storage.read().then(raw => { cached = raw ? readDocument(raw) : seed(). | Thực hiện tính biểu thức cached = raw ? readDocument(raw) : seed(). | Trả kết quả: sử dụng cached làm giá trị của bước hiện tại.
       * DÒNG `.catch(() => { throw new AdminError('loadError') }).finally(() => { loading = undefin`: Thực hiện tính biểu thức loading ??= storage.read().then(raw => { cached = raw ? readDocument(raw) : seed(). | Ném new AdminError('loadError'). | Thực hiện tính biểu thức loading = undefined.
       */
      loading ??= storage.read().then(raw => { cached = raw ? readDocument(raw) : seed(); return cached })
        .catch(() => { throw new AdminError('loadError') }).finally(() => { loading = undefined })
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `await loading`: Thực hiện await chờ sử dụng loading làm giá trị của bước hiện tại.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      await loading
    }
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return clone(cached!)`: Trả kết quả: Gọi clone(cached!).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return clone(cached!)
  }
  // TẠI SAO (load): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
  // phải xử lý dữ liệu sai như thành công.
  // CHỨC NĂNG: Ghi nối tiếp; chỉ thay cache và thông báo sau khi ghi thành công.
  // XỬ LÝ: Lỗi lưu giữ bản công khai cũ, không giả hiển thị đã lưu. BE sau này
  // phải làm giao dịch và kiểm tra revision tương tự trên máy chủ.
  // Khai báo mutate(action). Xếp thao tác thay đổi vào hàng đợi ghi.
  function mutate(action: (doc: AdminDocument) => void): Promise<void> {
    // Khai báo task: Gọi queue.then(async () => { const next = await load().
    const task = queue.then(async () => {
      // Khai báo next: await chờ Gọi load(). | Thực hiện Gọi action(next).
      const next = await load(); action(next)
      // Bắt đầu vùng try. | Thực hiện await chờ Gọi storage.write(JSON.stringify(next)). | Ném new AdminError('saveError').
      try { await storage.write(JSON.stringify(next)) } catch { throw new AdminError('saveError') }
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `cached = next; notify()`: Thực hiện tính biểu thức cached = next. | Thực hiện Gọi notify().
       * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      cached = next; notify()
    })
    // Thực hiện tính biểu thức queue = task.catch(() => {}).
    queue = task.catch(() => {})
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return task`: Trả kết quả: sử dụng task làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return task
  }
  // TẠI SAO (mutate): Hai lần lưu bất đồng bộ có thể xong ngược thứ tự; hàng đợi giữ thứ tự và chỉ
  // báo thành công sau khi lưu được.
  // CHỨC NĂNG: Lấy bản ghi đủ điều kiện chỉnh sửa.
  // XỬ LÝ: Kiểm tra ID, revision và trạng thái; tránh ghi đè bản vừa bị nơi khác sửa.
  // Khai báo item(doc, id, revision). Nhận đầu vào qua tham số.
  function item(doc: AdminDocument, id: string, revision: number) {
    // Khai báo place: doc.places.find lấy phần tử đầu tiên phù hợp.
    const place = doc.places.find(p => p.id === id)
    // Rẽ nhánh nếu !place. | Ném new AdminError('notFound').
    if (!place) throw new AdminError('notFound')
    // Rẽ nhánh nếu place.revision !== revision. | Ném new AdminError('conflict').
    if (place.revision !== revision) throw new AdminError('conflict')
    // Rẽ nhánh nếu place.workflow === 'archived'. | Ném new AdminError('invalid').
    if (place.workflow === 'archived') throw new AdminError('invalid')
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return place`: Trả kết quả: sử dụng place làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return place
  }
  // TẠI SAO (item): Bản ghi có thể đã bị sửa hoặc lưu trữ ở nơi khác; kiểm tra revision ngăn ghi
  // đè thay đổi mới hơn.
  // CHỨC NĂNG: Đánh dấu bản ghi vừa bị sửa.
  // XỬ LÝ: Tăng revision và đưa về nháp, vì lần duyệt cũ không còn áp dụng cho nội dung mới.
  // Khai báo touch(place). Đánh dấu địa điểm bị sửa: tăng revision và đưa về bản nháp để cần duyệt lại.
  function touch(place: ManagedPlace) {
    // Thực hiện sử dụng place.revision++ làm giá trị của bước hiện tại. | Thực hiện tính biểu thức place.workflow = 'draft'. | Thực hiện tính biểu thức place.approvedRevision = undefined.
    place.revision++; place.workflow = 'draft'; place.approvedRevision = undefined
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `place.reviewNote = ''; place.updatedAt = stamp()`: Thực hiện tính biểu thức place.reviewNote = ''. | Thực hiện tính biểu thức place.updatedAt = stamp().
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    place.reviewNote = ''; place.updatedAt = stamp()
  }
  // TẠI SAO (touch): Nội dung sửa sau khi duyệt không còn là bản đã được duyệt; phải tăng phiên
  // bản và đưa lại về nháp.
  // Khai báo log: khai báo callback (doc: AdminDocument, place: ManagedPlace, action: string) => { doc.audit.un.
  const log = (doc: AdminDocument, place: ManagedPlace, action: string) => {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `doc.audit.unshift({ at: stamp(), action, placeId: place.id, revision: place.revision `: Thực hiện Gọi doc.audit.unshift({ at: stamp(), action, placeId: place.id, revision: place.revision }). | Gán thuộc tính at: Gọi stamp(). | Đặt trường action bằng giá trị của biến cùng tên. | Gán thuộc tính placeId: đọc place.id từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính revision: đọc place.revision từ đối tượng/mảng để dùng tại bước hiện tại. Phiên bản phục vụ kiểm tra xung đột khi nhiều giao diện sửa cùng bản ghi. | Thực hiện tính biểu thức doc.audit = doc.audit.slice(0, 100).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    doc.audit.unshift({ at: stamp(), action, placeId: place.id, revision: place.revision }); doc.audit = doc.audit.slice(0, 100)
  }
  // TẠI SAO (log): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại lớp
  // kết nối này.
  // CHỨC NĂNG: Thay nội dung một ngôn ngữ của di tích.
  // XỬ LÝ: Bản vừa sửa là nháp và cần đi lại các bước duyệt trước khi công bố.
  // Khai báo replaceText(place, language, text). Nhận đầu vào qua tham số.
  function replaceText(place: ManagedPlace, language: Language, text: PublishedText) {
    // Thực hiện tính biểu thức place.record.content[language] = { ...text, status: 'draft', approvedAt: undefined, publis. | Gán thuộc tính status: chuỗi 'draft'. | Gán thuộc tính approvedAt: sử dụng undefined làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính publishedAt: sử dụng undefined làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
    place.record.content[language] = { ...text, status: 'draft', approvedAt: undefined, publishedAt: undefined }
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `touch(place)`: Thực hiện Gọi touch(place).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    touch(place)
  }
  // TẠI SAO (replaceText): Bài ngôn ngữ vừa sửa cần được duyệt lại; không được giữ dấu công bố của
  // nội dung cũ.
  // Khai báo service: tạo object gồm identity, load, subscribe, savePlace, saveContent, translate, generateAudio, submit, review.
  const service: AdminService = {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `identity: async () => ({ id: 'provided-demo-manager', displayName: 'HueGuide', mode: `: Gán thuộc tính identity: khai báo callback async () => ({ id: 'provided-demo-manager', displayName: 'HueGuide', mode:. | Gán thuộc tính id: chuỗi 'provided-demo-manager'. | Gán thuộc tính displayName: chuỗi 'HueGuide'. | Gán thuộc tính mode: chuỗi 'demo'. | Gán thuộc tính permissions: tạo mảng ['manage-content','review','publish'].
     * DÒNG `load, subscribe: listener => { listeners.add(listener); return () => { listeners.dele`: Đặt trường load bằng giá trị của biến cùng tên. | Gán thuộc tính subscribe: khai báo callback listener => { listeners.add(listener). | Thực hiện listeners.add đăng ký một callback nhận thay đổi. | Trả kết quả: khai báo callback () => { listeners.delete(listener) }. | Thực hiện listeners.delete gỡ callback đã đăng ký để nơi rời màn không tiếp tục nhận cập nhật.
     */
    identity: async () => ({ id: 'provided-demo-manager', displayName: 'HueGuide', mode: 'demo', permissions: ['manage-content','review','publish'] }),
    load, subscribe: listener => { listeners.add(listener); return () => { listeners.delete(listener) } },
    // Gán thuộc tính savePlace: khai báo callback input => mutate(doc => { validatePlace(input) let place: ManagedPlace if (i.
    savePlace: input => mutate(doc => {
      // Thực hiện Gọi validatePlace(input).
      validatePlace(input)
      // Khai báo place: không có giá trị khởi tạo.
      let place: ManagedPlace
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `if (input.id) place = item(doc, input.id, input.expectedRevision ?? -1)`: Rẽ nhánh nếu input.id. | Thực hiện tính biểu thức place = item(doc, input.id, input.expectedRevision ?? -1).
       * DÒNG `else {`: Rẽ nhánh nếu input.id.
       */
      if (input.id) place = item(doc, input.id, input.expectedRevision ?? -1)
      else {
        // Khai báo id: tính biểu thức 'place-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,7).
        const id = 'place-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,7)
        // Thực hiện tính biểu thức place = { id, period: '', revision: 0, workflow: 'draft', reviewNote: '', updatedAt: stamp. | Đặt trường id bằng giá trị của biến cùng tên. | Gán thuộc tính period: chuỗi ''. | Gán thuộc tính revision: giá trị số 0. | Gán thuộc tính workflow: chuỗi 'draft'. | Gán thuộc tính reviewNote: chuỗi ''. | Gán thuộc tính updatedAt: Gọi stamp().
        place = { id, period: '', revision: 0, workflow: 'draft', reviewNote: '', updatedAt: stamp(),
          // Gán thuộc tính record: tạo object gồm id, canonicalTitle, scope, inLaunchCatalog, status, zone, images, content. | Đặt trường id bằng giá trị của biến cùng tên. | Gán thuộc tính canonicalTitle: đọc input.title từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính scope: chuỗi 'hue-citadel'. | Gán thuộc tính inLaunchCatalog: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
          record: { id, canonicalTitle: input.title, scope: 'hue-citadel', inLaunchCatalog: true,
            // Gán thuộc tính status: chuỗi 'draft'. | Gán thuộc tính zone: chuỗi 'ceremonial'. | Gán thuộc tính images: tạo mảng []. | Gán thuộc tính content: tạo object gồm.
            status: 'draft', zone: 'ceremonial', images: [], content: {} } }
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `doc.places.push(place)`: Thực hiện Gọi doc.places.push(place).
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        doc.places.push(place)
      }
      // Thực hiện tính biểu thức place.period = input.period.trim(). | Thực hiện tính biểu thức place.record.period = place.period. | Thực hiện tính biểu thức place.record.canonicalTitle = input.title.trim().
      place.period = input.period.trim(); place.record.period = place.period; place.record.canonicalTitle = input.title.trim()
      // Khai báo source: đọc place.record.content.vi từ đối tượng/mảng để dùng tại bước hiện tại.
      const source = place.record.content.vi
      // Thực hiện tính biểu thức place.record.content.vi = { title: input.title.trim(), summary: '', address: '', body: '',. | Gán thuộc tính title: input.title.trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính summary: chuỗi ''. | Gán thuộc tính address: chuỗi ''. | Gán thuộc tính body: chuỗi ''. | Gán thuộc tính version: tính biểu thức place.revision + 1.
      place.record.content.vi = { title: input.title.trim(), summary: '', address: '', body: '', version: place.revision + 1,
        // Gán thuộc tính status: chuỗi 'draft'. | Gán thuộc tính title: input.title.trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính version: tính biểu thức place.revision + 1.
        status: 'draft', ...source, ...(source ? { title: input.title.trim(), version: place.revision + 1 } : {}) }
      // Thực hiện tính biểu thức place.record.category = input.category. | Thực hiện tính biểu thức place.record.images = [...input.images].
      place.record.category = input.category; place.record.images = [...input.images]
      // Thực hiện tính biểu thức place.record.position = input.lat.trim() ? { lat: Number(input.lat), lng: Number(input.lng. | Gán thuộc tính lat: Gọi Number(input.lat). | Gán thuộc tính lng: Gọi Number(input.lng). | Gán thuộc tính verified: đọc input.verified từ đối tượng/mảng để dùng tại bước hiện tại. Tách tọa độ tham khảo với tọa độ đã xác nhận.
      place.record.position = input.lat.trim() ? { lat: Number(input.lat), lng: Number(input.lng), verified: input.verified } : undefined
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `touch(place); log(doc, place, 'savePlace')`: Thực hiện Gọi touch(place). | Thực hiện Gọi log(doc, place, 'savePlace').
       * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      touch(place); log(doc, place, 'savePlace')
    }),
    // Gán thuộc tính saveContent: khai báo callback (input: ContentInput) => mutate(doc => { const place = item(doc, input.id,.
    saveContent: (input: ContentInput) => mutate(doc => {
      // Khai báo place: Gọi item(doc, input.id, input.expectedRevision).
      const place = item(doc, input.id, input.expectedRevision)
      // Rẽ nhánh nếu !input.title.trim() || !input.body.trim() || (input.audioUrl && !mediaUrl(input.audioUrl)). | Ném new AdminError('invalid').
      if (!input.title.trim() || !input.body.trim() || (input.audioUrl && !mediaUrl(input.audioUrl))) throw new AdminError('invalid')
      // Khai báo old: đọc place.record.content[input.language] từ đối tượng/mảng để dùng tại bước hiện tại.
      const old = place.record.content[input.language]
      // CHỨC NĂNG: Sửa văn bản làm audio cũ không còn khớp; phải chuẩn bị audio lại.
      // Khai báo sameBody: tính biểu thức old?.body === input.body.trim().
      const sameBody = old?.body === input.body.trim()
      // Khai báo audio: chọn giữa hai giá trị theo điều kiện input.audioUrl. | Gán thuộc tính id: tính biểu thức 'recording-' + place.id + '-' + input.language + '-' + (place.revision + 1).
      const audio = input.audioUrl ? { id: 'recording-' + place.id + '-' + input.language + '-' + (place.revision + 1),
        // Gán thuộc tính url: đọc input.audioUrl từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính version: tính biểu thức place.revision + 1. | Gán thuộc tính status: chuỗi 'draft'.
        url: input.audioUrl, version: place.revision + 1, status: 'draft' as const } : sameBody ? old?.audio : undefined
      // Thực hiện Gọi replaceText(place, input.language, { title: input.title.trim(), summary: input.summary.tri. | Gán thuộc tính title: input.title.trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính summary: input.summary.trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính address: input.address.trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
      replaceText(place, input.language, { title: input.title.trim(), summary: input.summary.trim(), address: input.address.trim(),
        // Gán thuộc tính body: input.body.trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính version: tính biểu thức place.revision + 1. | Gán thuộc tính status: chuỗi 'draft'. | Đặt trường audio bằng giá trị của biến cùng tên.
        body: input.body.trim(), version: place.revision + 1, status: 'draft', audio,
        // Gán thuộc tính sources: chọn giữa hai giá trị theo điều kiện sameBody. | Gán thuộc tính adaptation: chọn giữa hai giá trị theo điều kiện sameBody.
        sources: sameBody ? old?.sources : undefined, adaptation: sameBody ? old?.adaptation : undefined })
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `log(doc, place, 'saveContent')`: Thực hiện Gọi log(doc, place, 'saveContent').
       * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      log(doc, place, 'saveContent')
    }),
    // Gán thuộc tính translate: khai báo callback async (id, language, revision) => { // CHỨC NĂNG: Mô phỏng tác vụ bất đồng.
    translate: async (id, language, revision) => {
      // CHỨC NĂNG: Mô phỏng tác vụ bất đồng bộ; không giả là bản dịch thật.
      // XỬ LÝ: So revision lần nữa khi kết quả về, ngăn ghi đè nội dung mới.
      // Thực hiện await chờ Tạo đối tượng bằng new Promise(resolve => setTimeout(resolve, 400)).
      await new Promise(resolve => setTimeout(resolve, 400))
      // Trả kết quả: Gọi mutate(doc => { const place = item(doc, id, revision), source = place.record.content.vi if.
      return mutate(doc => {
        // Khai báo place: Gọi item(doc, id, revision).
        const place = item(doc, id, revision), source = place.record.content.vi
        // Rẽ nhánh nếu !source?.body.trim() || language === 'vi'. | Ném new AdminError('invalid').
        if (!source?.body.trim() || language === 'vi') throw new AdminError('invalid')
        // Gán name bằng LANGUAGES.find(l => l.code === language)?.label; nếu null hoặc undefined thì dùng language.
        const name = LANGUAGES.find(l => l.code === language)?.label ?? language
        // Thực hiện Gọi replaceText(place, language, { ...source, title: place.record.content[language]?.title ??. | Gán thuộc tính title: tính biểu thức place.record.content[language]?.title ?? source.title.
        replaceText(place, language, { ...source, title: place.record.content[language]?.title ?? source.title,
          // Gán thuộc tính body: tính biểu thức '[DEMO ' + name + '] ' + source.body. | Gán thuộc tính audio: sử dụng undefined làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính version: tính biểu thức revision + 1.
          body: '[DEMO ' + name + '] ' + source.body, audio: undefined, version: revision + 1 })
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `log(doc, place, 'translate')`: Thực hiện Gọi log(doc, place, 'translate').
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        log(doc, place, 'translate')
      })
    },
    // Gán thuộc tính generateAudio: khai báo callback async (id, language, revision) => { // CHỨC NĂNG: Tạo giọng từ đúng body đã.
    generateAudio: async (id, language, revision) => {
      // CHỨC NĂNG: Tạo giọng từ đúng body đã lưu, không gắn MP3 mẫu vào bài khác.
      // XỬ LÝ: Kiểm tra revision trước/sau tác vụ mạng; không khóa hàng đợi ghi
      // trong lúc chờ TTS. Bài bị sửa trong lúc tạo sẽ báo conflict.
      // Khai báo before: await chờ Gọi load().
      const before = await load(), place = item(before, id, revision)
      // Khai báo text: đọc place.record.content[language] từ đối tượng/mảng để dùng tại bước hiện tại.
      const text = place.record.content[language]
      // Rẽ nhánh nếu !text?.body.trim(). | Ném new AdminError('incomplete').
      if (!text?.body.trim()) throw new AdminError('incomplete')
      // Khai báo bundled: Gọi bundledNarration(id, language, text.body).
      const bundled = bundledNarration(id, language, text.body)
      // Khai báo url: không có giá trị khởi tạo.
      let url: string
      // Bắt đầu vùng try.
      try {
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `if (bundled) url = await Promise.resolve(bundled)`: Rẽ nhánh nếu bundled. | Thực hiện tính biểu thức url = await Promise.resolve(bundled).
         * DÒNG `else if (prepareAudio) url = await prepareAudio(text.body, language)`: Rẽ nhánh nếu bundled. | Rẽ nhánh nếu prepareAudio. | Thực hiện tính biểu thức url = await prepareAudio(text.body, language).
         * DÒNG `else throw new AdminError('incomplete')`: Rẽ nhánh nếu prepareAudio. | Ném new AdminError('incomplete').
         * DÒNG `} catch (error) { throw error instanceof AdminError ? error : new AdminError('saveErr`: Bắt đầu vùng try. | Ném error instanceof AdminError ? error : new AdminError('saveError').
         */
        if (bundled) url = await Promise.resolve(bundled)
        else if (prepareAudio) url = await prepareAudio(text.body, language)
        else throw new AdminError('incomplete')
      } catch (error) { throw error instanceof AdminError ? error : new AdminError('saveError') }
      // Trả kết quả: Gọi mutate(doc => { const current = item(doc, id, revision), latest = current.record.content[l.
      return mutate(doc => {
        // Khai báo current: Gọi item(doc, id, revision).
        const current = item(doc, id, revision), latest = current.record.content[language]
        // Rẽ nhánh nếu !latest || latest.body !== text.body. | Ném new AdminError('conflict').
        if (!latest || latest.body !== text.body) throw new AdminError('conflict')
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `replaceText(current, language, { ...latest, audio: { id: url,`: Thực hiện Gọi replaceText(current, language, { ...latest, audio: { id: url, url, version: revision + 1,. | Gán thuộc tính audio: tạo object gồm id, url, version, status. | Gán thuộc tính id: sử dụng url làm giá trị của bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi.
         * DÒNG `url, version: revision + 1, status: 'draft' } })`: Đặt trường url bằng giá trị của biến cùng tên. | Gán thuộc tính version: tính biểu thức revision + 1. | Gán thuộc tính status: chuỗi 'draft'.
         */
        replaceText(current, language, { ...latest, audio: { id: url,
          url, version: revision + 1, status: 'draft' } })
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `log(doc, current, 'generateAudio')`: Thực hiện Gọi log(doc, current, 'generateAudio').
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        log(doc, current, 'generateAudio')
      })
    },
    // Gán thuộc tính submit: khai báo callback (id, revision) => mutate(doc => { const place = item(doc, id, revision).
    submit: (id, revision) => mutate(doc => {
      // Khai báo place: Gọi item(doc, id, revision). | Thực hiện Gọi readyForReview(place).
      const place = item(doc, id, revision); readyForReview(place)
      // Rẽ nhánh nếu !['draft','changes'].includes(place.workflow). | Ném new AdminError('invalid').
      if (!['draft','changes'].includes(place.workflow)) throw new AdminError('invalid')
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `place.workflow = 'submitted'; log(doc, place, 'submit')`: Thực hiện tính biểu thức place.workflow = 'submitted'. | Thực hiện Gọi log(doc, place, 'submit').
       * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      place.workflow = 'submitted'; log(doc, place, 'submit')
    }),
    // Gán thuộc tính review: khai báo callback (id, revision, approved, note) => mutate(doc => { const place = item(doc, i.
    review: (id, revision, approved, note) => mutate(doc => {
      // Khai báo place: Gọi item(doc, id, revision).
      const place = item(doc, id, revision)
      // Rẽ nhánh nếu place.workflow !== 'submitted' || (!approved && !note.trim()). | Ném new AdminError('invalid').
      if (place.workflow !== 'submitted' || (!approved && !note.trim())) throw new AdminError('invalid')
      // Rẽ nhánh nếu approved. | Thực hiện Gọi readyForReview(place).
      if (approved) readyForReview(place)
      // Thực hiện tính biểu thức place.workflow = approved ? 'approved' : 'changes'. | Thực hiện tính biểu thức place.reviewNote = note.trim().
      place.workflow = approved ? 'approved' : 'changes'; place.reviewNote = note.trim()
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `place.approvedRevision = approved ? revision : undefined; log(doc, place, approved ? `: Thực hiện tính biểu thức place.approvedRevision = approved ? revision : undefined. | Thực hiện Gọi log(doc, place, approved ? 'approve' : 'requestChanges').
       * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      place.approvedRevision = approved ? revision : undefined; log(doc, place, approved ? 'approve' : 'requestChanges')
    }),
    // Gán thuộc tính publish: khai báo callback (id, revision) => mutate(doc => { const place = item(doc, id, revision) if.
    publish: (id, revision) => mutate(doc => {
      // Khai báo place: Gọi item(doc, id, revision).
      const place = item(doc, id, revision)
      // Rẽ nhánh nếu place.workflow !== 'approved' || place.approvedRevision !== revision. | Ném new AdminError('notApproved').
      if (place.workflow !== 'approved' || place.approvedRevision !== revision) throw new AdminError('notApproved')
      // Thực hiện Gọi readyForReview(place).
      readyForReview(place)
      // Khai báo record: Gọi clone(place.record).
      const record = clone(place.record), now = stamp()
      // Thực hiện tính biểu thức record.status = 'published'.
      record.status = 'published'
      // Duyệt lần lượt LANGUAGES bằng const { code }.
      for (const { code } of LANGUAGES) {
        // Khai báo text: đọc record.content[code] từ đối tượng/mảng để dùng tại bước hiện tại.
        const text = record.content[code]
        // Rẽ nhánh nếu !text. | Tiếp phần `continue` của ContinueStatement.
        if (!text) continue
        // Thực hiện tính biểu thức text.status = 'published'. | Thực hiện tính biểu thức text.approvedAt = now. | Thực hiện tính biểu thức text.publishedAt = now.
        text.status = 'published'; text.approvedAt = now; text.publishedAt = now
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `if (text.audio) { text.audio.status = 'published'; text.audio.approvedAt = now; text.`: Rẽ nhánh nếu text.audio. | Thực hiện tính biểu thức text.audio.status = 'published'. | Thực hiện tính biểu thức text.audio.approvedAt = now. | Thực hiện tính biểu thức text.audio.publishedAt = now.
         * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        if (text.audio) { text.audio.status = 'published'; text.audio.approvedAt = now; text.audio.publishedAt = now }
      }
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `place.published = record; place.workflow = 'published'; log(doc, place, 'publish')`: Thực hiện tính biểu thức place.published = record. | Thực hiện tính biểu thức place.workflow = 'published'. | Thực hiện Gọi log(doc, place, 'publish').
       * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      place.published = record; place.workflow = 'published'; log(doc, place, 'publish')
    }),
    // Gán thuộc tính archive: khai báo callback (id, revision) => mutate(doc => { const place = item(doc, id, revision).
    archive: (id, revision) => mutate(doc => {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `const place = item(doc, id, revision); place.workflow = 'archived'; place.published =`: Khai báo place: Gọi item(doc, id, revision). | Thực hiện tính biểu thức place.workflow = 'archived'. | Thực hiện tính biểu thức place.published = undefined. | Thực hiện Gọi log(doc, place, 'archive').
       * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      const place = item(doc, id, revision); place.workflow = 'archived'; place.published = undefined; log(doc, place, 'archive')
    }),
    // CHỨC NĂNG: Xóa hẳn một di tích khỏi bản nháp và danh mục công khai cục bộ.
    // XỬ LÝ: Cho xóa cả điểm đã lưu trữ; kiểm tra ID/revision trước khi ghi.
    // Chỉ sửa document này, không xóa ảnh asset dùng chung hay các điểm khác.
    // mutate giữ nguyên dữ liệu nếu ghi storage thất bại; UI phải hỏi xác nhận.
    // Gán thuộc tính deletePlace: khai báo callback (id, revision) => mutate(doc => { const place = doc.places.find(p => p.id =.
    deletePlace: (id, revision) => mutate(doc => {
      // Khai báo place: doc.places.find lấy phần tử đầu tiên phù hợp.
      const place = doc.places.find(p => p.id === id)
      // Rẽ nhánh nếu !place. | Ném new AdminError('notFound').
      if (!place) throw new AdminError('notFound')
      // Rẽ nhánh nếu place.revision !== revision. | Ném new AdminError('conflict').
      if (place.revision !== revision) throw new AdminError('conflict')
      // Thực hiện Gọi log(doc, place, 'deletePlace').
      log(doc, place, 'deletePlace')
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `doc.places = doc.places.filter(p => p.id !== id)`: Thực hiện tính biểu thức doc.places = doc.places.filter(p => p.id !== id).
       * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      doc.places = doc.places.filter(p => p.id !== id)
    }),
    // Gán thuộc tính simulate: khai báo callback (platform, playing = false) => mutate(doc => { const now = Date.now().
    simulate: (platform, playing = false) => mutate(doc => {
      // Khai báo now: Date.now() lấy thời gian hiện tại theo mili giây để so sánh tuổi dữ liệu hoặc tạo dấu thời gian. | Thực hiện Gọi doc.sessions.push({ id: 'demo-' + now + '-' + Math.random().toString(36).slice(2,6), platf. | Gán thuộc tính id: tính biểu thức 'demo-' + now + '-' + Math.random().toString(36).slice(2,6). | Đặt trường platform bằng giá trị của biến cùng tên.
      const now = Date.now(); doc.sessions.push({ id: 'demo-' + now + '-' + Math.random().toString(36).slice(2,6), platform,
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `lastSeen: now, startedAt: now, playing })`: Gán thuộc tính lastSeen: sử dụng now làm giá trị của bước hiện tại. Dùng thời gian của server để tính phiên hết hạn, không tin đồng hồ client. | Gán thuộc tính startedAt: sử dụng now làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Đặt trường playing bằng giá trị của biến cùng tên.
         * DÒNG `}),`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        lastSeen: now, startedAt: now, playing })
    }),
    // Gán thuộc tính endSessions: khai báo callback () => mutate(doc => { doc.sessions.forEach(s => { s.lastSeen = 0. | Thực hiện Gọi doc.sessions.forEach(s => { s.lastSeen = 0. | Thực hiện tính biểu thức s.lastSeen = 0. | Thực hiện tính biểu thức s.playing = false.
    endSessions: () => mutate(doc => { doc.sessions.forEach(s => { s.lastSeen = 0; s.playing = false }) }),
    // Gán thuộc tính reset: khai báo callback () => { // CHỨC NĂNG: Khôi phục cả khi JSON hiện tại hỏng, không gọi load d.
    reset: () => {
      // CHỨC NĂNG: Khôi phục cả khi JSON hiện tại hỏng, không gọi load dữ liệu lỗi.
      // Khai báo task: Gọi queue.then(async () => { const next = seed() try { await storage.write(JSON.stringify(next.
      const task = queue.then(async () => {
        // Khai báo next: Gọi seed().
        const next = seed()
        // Bắt đầu vùng try. | Thực hiện await chờ Gọi storage.write(JSON.stringify(next)). | Ném new AdminError('saveError').
        try { await storage.write(JSON.stringify(next)) } catch { throw new AdminError('saveError') }
        /* GIẢI THÍCH TỪNG DÒNG:
         * DÒNG `cached = next; notify()`: Thực hiện tính biểu thức cached = next. | Thực hiện Gọi notify().
         * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
         */
        cached = next; notify()
      })
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `queue = task.catch(() => {}); return task`: Thực hiện tính biểu thức queue = task.catch(() => {}). | Trả kết quả: sử dụng task làm giá trị của bước hiện tại.
       * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      queue = task.catch(() => {}); return task
    },
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `published: async (): Promise<PlaceRecord[]> => (await load()).places.flatMap(p => p.w`: Gán thuộc tính published: khai báo callback async (): Promise<PlaceRecord[]> => (await load()).places.flatMap(p => p.wo.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    published: async (): Promise<PlaceRecord[]> => (await load()).places.flatMap(p => p.workflow !== 'archived' && p.published ? [p.published] : []),
  }
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return service`: Trả kết quả: sử dụng service làm giá trị của bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return service
}
// TẠI SAO (createMockAdminService): Một nơi xử lý workflow và revision giúp admin web/mobile áp
// dụng cùng quy tắc.
/* CÁCH KIỂM TRA: Lưu nháp không đổi published; sửa sau duyệt chặn publish;
 * hai lệnh cùng revision chỉ lệnh đầu thành công; storage.write lỗi không đổi cache. */
