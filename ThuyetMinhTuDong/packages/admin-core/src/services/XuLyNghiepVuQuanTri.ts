/**
 * FILE: packages/admin-core/src/services/XuLyNghiepVuQuanTri.ts
 * FILE NÀY LÀM GÌ: Thực hiện quy tắc quản trị: danh tính cấp sẵn, lưu nháp, dịch, tạo audio, kiểm duyệt và công bố theo revision.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC09: Truy cập khu vực quản lý được cấp sẵn.
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * - UC13: Công bố phiên bản đã duyệt.
 * - UC14: Theo dõi hoạt động và lượt vào từ QR.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { MOCK_PLACES, LANGUAGES, bundledNarration } from '@travelguide/visitor-core'
import type { Language, PlaceRecord, PublishedText } from '@travelguide/visitor-core'
import type { AdminService, StoragePort } from '../domain/HopDongDichVu'
import type { AdminDocument, ManagedPlace, ContentInput } from '../domain/KieuDuLieuQuanTri'
import { AdminError } from '../domain/KieuDuLieuQuanTri'
import { mediaUrl, readyForReview, validatePlace } from '../domain/KiemTraDuLieu'

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T
// TẠI SAO (clone): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
// phải xử lý dữ liệu sai như thành công.

const stamp = () => new Date().toISOString()
// TẠI SAO (stamp): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
// lớp kết nối này.

const seed = (): AdminDocument => ({
  schema: 1,
  sessions: [],
  audit: [],
  places: MOCK_PLACES.map((record) => ({
    id: record.id,
    record: clone(record),
    period: record.period ?? '',
    revision: 1,
    workflow: 'published',
    reviewNote: '',

    approvedRevision: 1,
    published: clone(record),
    updatedAt: stamp(),
  })),
})
// TẠI SAO (seed): Tạo kết quả dẫn xuất ở một nơi giúp các màn dùng cùng quy tắc xử lý tập dữ
// liệu.
// CHỨC NĂNG: Kiểm tra dữ liệu quản trị đọc từ kho.
// XỬ LÝ: Chỉ nhận schema và cấu trúc hợp lệ; JSON hỏng không được âm thầm coi là dữ liệu mới.

// [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] readDocument — Kiểm tra dữ liệu quản trị đọc từ kho.
function readDocument(raw: string): AdminDocument {
  // CHỨC NĂNG: Kiểm tra dữ liệu cục bộ trước khi coi là AdminDocument.
  // XỬ LÝ: JSON hỏng/khác schema phải báo lỗi; không tự ghi đè dữ liệu đã có bằng seed.

  const x: unknown = JSON.parse(raw)

  if (
    !x ||
    typeof x !== 'object' ||
    !('schema' in x) ||
    x.schema !== 1 ||
    !('places' in x) ||
    !Array.isArray(x.places) ||
    !('sessions' in x) ||
    !Array.isArray(x.sessions) ||
    !('audit' in x) ||
    !Array.isArray(x.audit)
  )
    throw new AdminError('loadError')

  for (const p of x.places) {
    if (
      !p ||
      typeof p !== 'object' ||
      typeof p.id !== 'string' ||
      !Number.isInteger(p.revision) ||
      p.revision < 1 ||
      !['draft', 'submitted', 'changes', 'approved', 'published', 'archived'].includes(
        p.workflow,
      ) ||
      !p.record ||
      !Array.isArray(p.record.images) ||
      !p.record.content ||
      typeof p.period !== 'string'
    )
      throw new AdminError('loadError')
  }

  return x as AdminDocument
}
// TẠI SAO (readDocument): JSON hợp lệ về cú pháp vẫn có thể sai cấu trúc; không nên dùng dữ liệu
// hỏng hoặc ghi đè thành seed.
// CHỨC NĂNG: Nhận bộ tạo MP3 từ server; logic FE không giữ khóa dịch vụ TTS.
// XỬ LÝ: Test có thể dùng bài đã đóng gói; bài mới cần adapter tạo giọng thật.

// [UC09 / UC10 / UC11 / UC12 / UC13 / UC14] createAdminService — Tạo bộ quy tắc quản trị dùng tại API, bao gồm kiểm tra trạng thái và revision.
export function createAdminService(
  storage: StoragePort,
  prepareAudio?: (body: string, language: Language) => Promise<string>,
  translateText?: (text: string, language: Language) => Promise<string>,
): AdminService {
  // CHỨC NĂNG: Bản dữ liệu đã nạp trong RAM để không đọc lại kho cho mỗi thao tác.

  let cached: AdminDocument | undefined

  let loading: Promise<AdminDocument> | undefined
  // CHỨC NĂNG: Hàng đợi ghi nối tiếp; tránh hai thao tác lưu hoàn tất theo thứ tự ngược.

  let queue: Promise<void> = Promise.resolve()
  // CHỨC NĂNG: Các callback nhận thay đổi; dùng Set để không đăng ký trùng cùng tham chiếu.

  const listeners = new Set<() => void>()

  const notify = () => listeners.forEach((listener) => listener())
  // TẠI SAO (notify): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại
  // lớp kết nối này.

  async function load(): Promise<AdminDocument> {
    if (!cached) {
      loading ??= storage
        .read()
        .then((raw) => {
          cached = raw ? readDocument(raw) : seed()
          return cached
        })
        .catch(() => {
          throw new AdminError('loadError')
        })
        .finally(() => {
          loading = undefined
        })

      await loading
    }

    return clone(cached!)
  }
  // TẠI SAO (load): Đầu vào hoặc kết quả có thể không hợp lệ; kiểm tra tại đây để nơi gọi không
  // phải xử lý dữ liệu sai như thành công.
  // CHỨC NĂNG: Ghi nối tiếp; chỉ thay cache và thông báo sau khi ghi thành công.
  // XỬ LÝ: Lỗi lưu giữ bản công khai cũ, không giả hiển thị đã lưu. BE sau này
  // phải làm giao dịch và kiểm tra revision tương tự trên máy chủ.

  // [UC10 / UC11 / UC12 / UC13] mutate — Xếp hàng thay đổi document, lưu thành công rồi mới thông báo trạng thái mới.
  function mutate(action: (doc: AdminDocument) => void): Promise<void> {
    const task = queue.then(async () => {
      const next = await load()
      action(next)

      try {
        await storage.write(JSON.stringify(next))
      } catch {
        throw new AdminError('saveError')
      }

      cached = next
      notify()
    })

    queue = task.catch(() => {})

    return task
  }
  // TẠI SAO (mutate): Hai lần lưu bất đồng bộ có thể xong ngược thứ tự; hàng đợi giữ thứ tự và chỉ
  // báo thành công sau khi lưu được.
  // CHỨC NĂNG: Lấy bản ghi đủ điều kiện chỉnh sửa.
  // XỬ LÝ: Kiểm tra ID, revision và trạng thái; tránh ghi đè bản vừa bị nơi khác sửa.

  // [UC10 / UC11 / UC12 / UC13] item — Tìm đúng hồ sơ và kiểm tra revision trước khi thao tác để tránh ghi đè bản mới hơn.
  function item(doc: AdminDocument, id: string, revision: number) {
    const place = doc.places.find((p) => p.id === id)

    if (!place) throw new AdminError('notFound')

    if (place.revision !== revision) throw new AdminError('conflict')

    if (place.workflow === 'archived') throw new AdminError('invalid')

    return place
  }
  // TẠI SAO (item): Bản ghi có thể đã bị sửa hoặc lưu trữ ở nơi khác; kiểm tra revision ngăn ghi
  // đè thay đổi mới hơn.
  // CHỨC NĂNG: Đánh dấu bản ghi vừa bị sửa.
  // XỬ LÝ: Tăng revision và đưa về nháp, vì lần duyệt cũ không còn áp dụng cho nội dung mới.

  // [UC10 / UC11] touch — Tăng revision và đưa bản đang sửa về nháp, hủy dấu duyệt cũ sau thay đổi.
  function touch(place: ManagedPlace) {
    place.revision++
    place.workflow = 'draft'
    place.approvedRevision = undefined

    place.reviewNote = ''
    place.updatedAt = stamp()
  }
  // TẠI SAO (touch): Nội dung sửa sau khi duyệt không còn là bản đã được duyệt; phải tăng phiên
  // bản và đưa lại về nháp.

  const log = (doc: AdminDocument, place: ManagedPlace, action: string) => {
    doc.audit.unshift({ at: stamp(), action, placeId: place.id, revision: place.revision })
    doc.audit = doc.audit.slice(0, 100)
  }
  // TẠI SAO (log): Nơi gọi chỉ cần hợp đồng; chi tiết HTTP, thiết bị hoặc kho RAM được giữ tại lớp
  // kết nối này.
  // CHỨC NĂNG: Thay nội dung một ngôn ngữ của di tích.
  // XỬ LÝ: Bản vừa sửa là nháp và cần đi lại các bước duyệt trước khi công bố.

  // [UC11] replaceText — Thay bản ngôn ngữ trong bản nháp, cập nhật phiên bản và trạng thái văn bản/audio.
  function replaceText(place: ManagedPlace, language: Language, text: PublishedText) {
    // CHỨC NĂNG: Bài viết đổi thì bản thu đi kèm cũng phải trở về nháp.
    // TẠI SAO: Không để âm thanh mang trạng thái công bố cho nội dung chưa duyệt.
    place.record.content[language] = {
      ...text,
      status: 'draft',
      approvedAt: undefined,
      publishedAt: undefined,
      audio: text.audio
        ? { ...text.audio, status: 'draft', approvedAt: undefined, publishedAt: undefined }
        : undefined,
    }

    touch(place)
  }
  // TẠI SAO (replaceText): Bài ngôn ngữ vừa sửa cần được duyệt lại; không được giữ dấu công bố của
  // nội dung cũ.

  const service: AdminService = {
    // [UC09] identity — Trả danh tính và quyền quản lý được cấp sẵn; đây không phải xác thực tài khoản/mật khẩu.
    identity: async () => ({
      id: 'provided-demo-manager',
      displayName: 'HueGuide',
      mode: 'demo',
      permissions: ['manage-content', 'review', 'publish'],
    }),
    load,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },

    // CHỨC NĂNG: Lưu metadata và các bản ngôn ngữ trong cùng lần ghi.
    // TẠI SAO: Không tạo di tích thành công nhưng mất bài thuyết minh vì lần ghi thứ hai lỗi.
    // [UC10] savePlace — Kiểm tra và lưu hồ sơ di tích, tăng revision và đưa bản đang sửa về nháp; giữ bản công bố cũ.
    savePlace: async (input) => {
      let savedId = ''
      await mutate((doc) => {
        validatePlace(input)

        let place: ManagedPlace

        if (input.id) place = item(doc, input.id, input.expectedRevision ?? -1)
        else {
          const id =
            'place-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7)

          place = {
            id,
            period: '',
            revision: 0,
            workflow: 'draft',
            reviewNote: '',
            updatedAt: stamp(),

            record: {
              id,
              canonicalTitle: input.title,
              scope: 'hue-citadel',
              inLaunchCatalog: true,

              status: 'draft',
              zone: 'ceremonial',
              images: [],
              content: {},
            },
          }

          doc.places.push(place)
        }

        place.period = input.period.trim()
        place.record.period = place.period
        place.record.canonicalTitle = input.title.trim()

        const source = place.record.content.vi

        place.record.content.vi = {
          title: input.title.trim(),
          summary: '',
          address: '',
          body: '',
          version: place.revision + 1,

          status: 'draft',
          ...source,
          ...(source ? { title: input.title.trim(), version: place.revision + 1 } : {}),
        }

        place.record.category = input.category
        place.record.images = [...input.images]

        place.record.position = input.lat.trim()
          ? { lat: Number(input.lat), lng: Number(input.lng), verified: input.verified }
          : undefined

        // CHỨC NĂNG: Gắn nội dung nháp; giữ audio chỉ khi bài đọc không đổi.
        // XỬ LÝ: Không nhận status/version từ client và không sửa ảnh chụp đã công bố.
        for (const { code } of LANGUAGES) {
          const text = input.content?.[code]
          if (!text) continue
          const old = place.record.content[code]
          const sameBody = old?.body === text.body.trim()
          if (!text.title.trim() || (text.audioUrl && !mediaUrl(text.audioUrl)))
            throw new AdminError('invalid')
          place.record.content[code] = {
            title: text.title.trim(),
            summary: text.summary.trim(),
            address: text.address.trim(),
            body: text.body.trim(),
            version: place.revision + 1,
            status: 'draft',
            audio: text.audioUrl
              ? {
                  id: text.audioUrl,
                  url: text.audioUrl,
                  version: place.revision + 1,
                  status: 'draft',
                }
              : sameBody && old?.audio
                ? { ...old.audio, status: 'draft', approvedAt: undefined, publishedAt: undefined }
                : undefined,
            sources: sameBody ? old?.sources : undefined,
            adaptation: sameBody ? old?.adaptation : undefined,
          }
        }
        touch(place)
        log(doc, place, 'savePlace')
        savedId = place.id
      })
      return savedId
    },

    // [UC11] saveContent — Lưu văn bản/bản thu của ngôn ngữ đang biên tập và cập nhật revision bản nháp.
    saveContent: (input: ContentInput) =>
      mutate((doc) => {
        const place = item(doc, input.id, input.expectedRevision)

        if (
          !input.title.trim() ||
          !input.body.trim() ||
          (input.audioUrl && !mediaUrl(input.audioUrl))
        )
          throw new AdminError('invalid')

        const old = place.record.content[input.language]
        // CHỨC NĂNG: Sửa văn bản làm audio cũ không còn khớp; phải chuẩn bị audio lại.

        const sameBody = old?.body === input.body.trim()

        const audio = input.audioUrl
          ? {
              id: 'recording-' + place.id + '-' + input.language + '-' + (place.revision + 1),

              url: input.audioUrl,
              version: place.revision + 1,
              status: 'draft' as const,
            }
          : sameBody
            ? old?.audio
            : undefined

        replaceText(place, input.language, {
          title: input.title.trim(),
          summary: input.summary.trim(),
          address: input.address.trim(),

          body: input.body.trim(),
          version: place.revision + 1,
          status: 'draft',
          audio,

          sources: sameBody ? old?.sources : undefined,
          adaptation: sameBody ? old?.adaptation : undefined,
        })

        log(doc, place, 'saveContent')
      }),

    // CHỨC NĂNG: Dịch thật cả tên, mô tả, địa chỉ và bài đọc từ bản Việt đã lưu.
    // XỬ LÝ: Chỉ ghi khi cả bốn trường dịch xong; revision chặn kết quả cũ ghi đè bài mới.
    // [UC11] translate — Dịch từ nội dung nguồn đã lưu sang ngôn ngữ đích, kiểm tra revision để tránh ghi đè tác vụ mới.
    translate: async (id, language, revision) => {
      const place = item(await load(), id, revision),
        source = place.record.content.vi
      if (!source?.body.trim() || language === 'vi') throw new AdminError('invalid')
      if (!translateText) throw new AdminError('translationError')
      const fields = ['title', 'summary', 'address', 'body'] as const
      const translated = { title: '', summary: '', address: '', body: '' }
      try {
        for (const key of fields)
          translated[key] = source[key].trim() ? await translateText(source[key], language) : ''
      } catch {
        throw new AdminError('translationError')
      }
      return mutate((doc) => {
        const current = item(doc, id, revision)
        replaceText(current, language, { ...translated, version: revision + 1, status: 'draft' })
        log(doc, current, 'translate')
      })
    },
    // CHỨC NĂNG: Tạo audio từ đúng bài đã lưu; bản nháp vẫn chưa công khai.
    // [UC11] generateAudio — Tạo bản thu theo văn bản và ngôn ngữ đã lưu, gắn kết quả vào đúng phiên bản nội dung.
    generateAudio: async (id, language, revision) => {
      // CHỨC NĂNG: Tạo giọng từ đúng body đã lưu, không gắn MP3 mẫu vào bài khác.
      // XỬ LÝ: Kiểm tra revision trước/sau tác vụ mạng; không khóa hàng đợi ghi
      // trong lúc chờ TTS. Bài bị sửa trong lúc tạo sẽ báo conflict.

      const before = await load(),
        place = item(before, id, revision)

      const text = place.record.content[language]

      if (!text?.body.trim()) throw new AdminError('incomplete')

      const bundled = bundledNarration(id, language, text.body)

      let url: string

      try {
        if (bundled) url = await Promise.resolve(bundled)
        else if (prepareAudio) url = await prepareAudio(text.body, language)
        else throw new AdminError('incomplete')
      } catch (error) {
        throw error instanceof AdminError ? error : new AdminError('saveError')
      }

      return mutate((doc) => {
        const current = item(doc, id, revision),
          latest = current.record.content[language]

        if (!latest || latest.body !== text.body) throw new AdminError('conflict')

        replaceText(current, language, {
          ...latest,
          audio: { id: url, url, version: revision + 1, status: 'draft' },
        })

        log(doc, current, 'generateAudio')
      })
    },

    // [UC12] submit — Kiểm tra điều kiện gửi duyệt và revision, rồi chuyển bản nháp sang trạng thái chờ duyệt.
    submit: (id, revision) =>
      mutate((doc) => {
        const place = item(doc, id, revision)
        readyForReview(place)

        if (!['draft', 'changes'].includes(place.workflow)) throw new AdminError('invalid')

        place.workflow = 'submitted'
        log(doc, place, 'submit')
      }),

    // [UC12] review — Ghi quyết định duyệt hoặc yêu cầu sửa; kiểm tra revision và yêu cầu ghi chú khi trả sửa.
    review: (id, revision, approved, note) =>
      mutate((doc) => {
        const place = item(doc, id, revision)

        if (place.workflow !== 'submitted' || (!approved && !note.trim()))
          throw new AdminError('invalid')

        if (approved) readyForReview(place)

        place.workflow = approved ? 'approved' : 'changes'
        place.reviewNote = note.trim()

        place.approvedRevision = approved ? revision : undefined
        log(doc, place, approved ? 'approve' : 'requestChanges')
      }),

    // [UC13] publish — Chỉ công bố revision đã được duyệt; sao chép văn bản/audio thành ảnh chụp dữ liệu published.
    publish: (id, revision) =>
      mutate((doc) => {
        const place = item(doc, id, revision)

        if (place.workflow !== 'approved' || place.approvedRevision !== revision)
          throw new AdminError('notApproved')

        readyForReview(place)

        const record = clone(place.record),
          now = stamp()

        record.status = 'published'

        for (const { code } of LANGUAGES) {
          const text = record.content[code]

          if (!text) continue

          text.status = 'published'
          text.approvedAt = now
          text.publishedAt = now

          if (text.audio) {
            text.audio.status = 'published'
            text.audio.approvedAt = now
            text.audio.publishedAt = now
          }
        }

        place.published = record
        place.workflow = 'published'
        log(doc, place, 'publish')
      }),

    // [UC10] archive — Lưu trữ di tích và ngừng cung cấp bản công bố cho du khách.
    archive: (id, revision) =>
      mutate((doc) => {
        const place = item(doc, id, revision)
        place.workflow = 'archived'
        place.published = undefined
        log(doc, place, 'archive')
      }),
    // CHỨC NĂNG: Xóa hẳn một di tích khỏi bản nháp và danh mục công khai cục bộ.
    // XỬ LÝ: Cho xóa cả điểm đã lưu trữ; kiểm tra ID/revision trước khi ghi.
    // Chỉ sửa document này, không xóa ảnh asset dùng chung hay các điểm khác.
    // mutate giữ nguyên dữ liệu nếu ghi storage thất bại; UI phải hỏi xác nhận.

    // [UC10] deletePlace — Xóa hồ sơ di tích theo các điều kiện nghiệp vụ hiện có và ghi lại thay đổi.
    deletePlace: (id, revision) =>
      mutate((doc) => {
        const place = doc.places.find((p) => p.id === id)

        if (!place) throw new AdminError('notFound')

        if (place.revision !== revision) throw new AdminError('conflict')

        log(doc, place, 'deletePlace')

        doc.places = doc.places.filter((p) => p.id !== id)
      }),

    simulate: (platform, playing = false) =>
      mutate((doc) => {
        const now = Date.now()
        doc.sessions.push({
          id: 'demo-' + now + '-' + Math.random().toString(36).slice(2, 6),
          platform,

          lastSeen: now,
          startedAt: now,
          playing,
        })
      }),

    endSessions: () =>
      mutate((doc) => {
        doc.sessions.forEach((s) => {
          s.lastSeen = 0
          s.playing = false
        })
      }),

    reset: () => {
      // CHỨC NĂNG: Khôi phục cả khi JSON hiện tại hỏng, không gọi load dữ liệu lỗi.

      const task = queue.then(async () => {
        const next = seed()

        try {
          await storage.write(JSON.stringify(next))
        } catch {
          throw new AdminError('saveError')
        }

        cached = next
        notify()
      })

      queue = task.catch(() => {})
      return task
    },

    // [UC02 / UC04 / UC07] published — Chỉ trả bản công bố của các di tích chưa bị lưu trữ cho phía du khách.
    published: async (): Promise<PlaceRecord[]> =>
      (await load()).places.flatMap((p) =>
        p.workflow !== 'archived' && p.published ? [p.published] : [],
      ),
  }

  return service
}
// TẠI SAO (createAdminService): Một nơi xử lý workflow và revision giúp admin web/mobile áp
// dụng cùng quy tắc.
/* CÁCH KIỂM TRA: Lưu nháp không đổi published; sửa sau duyệt chặn publish;
 * hai lệnh cùng revision chỉ lệnh đầu thành công; storage.write lỗi không đổi cache. */
