/**
 * CHỨC NĂNG: [LUU-NHAP] [KIEM-DUYET] [TU-DONG-DICH] [THUYET-MINH]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Quản lý form và thao tác lưu nháp, tự dịch, tạo audio, gửi duyệt dùng chung web/mobile.
 *
 * VỊ TRÍ: packages/admin-core/src/react/useBienTapDiTich.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/admin-core/src/react/TrangThaiReact.tsx
 *
 * PHỤ THUỘC:
 * - react
 * - @travelguide/visitor-core
 * - ../domain/KieuDuLieuQuanTri
 * - ../i18n/BanDichGiaoDien
 * - ./TrangThaiReact
 *
 * CÁC KHỐI CHÍNH:
 * 1. emptyText
 * 2. textsOf
 * 3. usePlaceEditor
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
import { useRef, useState } from 'react'
import { LANGUAGES, categoryOf, type Category, type Language } from '@travelguide/visitor-core'
import {
  AdminError,
  type DraftText,
  type ManagedPlace,
  type PlaceInput,
} from '../domain/KieuDuLieuQuanTri'
import type { AdminTextKey } from '../i18n/BanDichGiaoDien'
import type { useAdmin } from './TrangThaiReact'

export type PlaceEditorAction = 'save' | 'translate' | 'audio' | 'submit'
type Texts = Partial<Record<Language, DraftText>>
// Form chỉ cần dịch vụ, trạng thái bận và hàm chạy tác vụ; không phụ thuộc toàn bộ provider.
type EditorState = Pick<ReturnType<typeof useAdmin>, 'service' | 'busy' | 'run'>
const emptyText = (): DraftText => ({ title: '', summary: '', address: '', body: '' })

// CHỨC NĂNG: Đọc các bản ngôn ngữ từ SQL vào vùng đang nhập của form.
// XỬ LÝ: Không đưa trạng thái duyệt, phiên bản hoặc URL media nội bộ vào ô URL nhập tay.
// ==================== [LUU-NHAP] [KIEM-DUYET] [TU-DONG-DICH] [THUYET-MINH] textsOf ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
function textsOf(place?: ManagedPlace): Texts {
  const result: Texts = {}
  for (const { code } of LANGUAGES) {
    const text = place?.record.content[code]
    if (text)
      result[code] = {
        title: text.title,
        summary: text.summary,
        address: text.address,
        body: text.body,
      }
  }
  return result
}

// ==================== [LUU-NHAP] [KIEM-DUYET] [TU-DONG-DICH] [THUYET-MINH] usePlaceEditor ====================
// CHỨC NĂNG: Thực hiện bước usePlaceEditor trong nhiệm vụ: Quản lý form và thao tác lưu nháp, tự dịch, tạo audio, gửi duyệt dùng chung web/mobile.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function usePlaceEditor(
  state: EditorState,
  initial: ManagedPlace | undefined,
  t: (key: AdminTextKey) => string,
) {
  const current = useRef(initial)
  const [saved, setSaved] = useState(initial)
  const [language, setLanguage] = useState<Language>('vi')
  const [texts, setTexts] = useState<Texts>(textsOf(initial))
  const [title, setTitle] = useState(initial?.record.canonicalTitle ?? '')
  const [category, setCategory] = useState<Category>(
    initial ? categoryOf(initial.record) : 'palace',
  )
  const [period, setPeriod] = useState(initial?.period ?? '')
  const [lat, setLat] = useState(initial?.record.position?.lat.toString() ?? '')
  const [lng, setLng] = useState(initial?.record.position?.lng.toString() ?? '')
  const [verified, setVerified] = useState(initial?.record.position?.verified ?? false)
  const [images, setImages] = useState(initial?.record.images.join('\n') ?? '')
  const [dirty, setDirty] = useState(false),
    [autoTranslate, setAutoTranslate] = useState(true)
  const [progress, setProgress] = useState('')
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const text = texts[language] ?? emptyText()
  const disabled = state.busy || saved?.workflow === 'archived'

  // CHỨC NĂNG: Sửa bản đang chọn; bản Việt là tên chuẩn và nguồn dịch tự động.
  // TẠI SAO: Không đổi i18n của giao diện khi chỉ chuyển tab nội dung cần biên tập.
  // ==================== [BIEN-TAP] edit ====================
  // CHỨC NĂNG: Cập nhật trường của bản ngôn ngữ đang được biên tập.
  // XỬ LÝ: Sao chép state, cập nhật trường và đánh dấu đã thay đổi; tên Việt đồng bộ tên chuẩn.
  // TẠI SAO: Không sửa trực tiếp state và không đổi ngôn ngữ giao diện khi chuyển bản nội dung.
  function edit(key: keyof DraftText, value: string) {
    setTexts((old) => ({ ...old, [language]: { ...(old[language] ?? emptyText()), [key]: value } }))
    if (language === 'vi' && key === 'title') setTitle(value)
    setDirty(true)
  }

  // CHỨC NĂNG: Sau mỗi tác vụ, lấy revision mới nhất do SQL trả về.
  // TẠI SAO: Dịch/tạo audio tăng phiên bản; dùng lại revision cũ sẽ bị chặn xung đột.
  // ==================== [LUU-NHAP] refresh ====================
  // CHỨC NĂNG: Lấy lại bản nháp và phiên bản mới nhất sau tác vụ.
  // XỬ LÝ: Đọc service, tìm đúng mã, cập nhật ref và state của form.
  // TẠI SAO: Lần lưu tiếp theo phải dùng revision mới để tránh xung đột phiên bản.
  async function refresh(id: string) {
    const place = (await state.service.load()).places.find((item) => item.id === id)
    if (!place) throw new AdminError('notFound')
    current.current = place
    setSaved(place)
    setTexts(textsOf(place))
    setImages(place.record.images.join('\n'))
    return place
  }

  // ==================== [TU-DONG-DICH] translateAll ====================
  // CHỨC NĂNG: Dịch bản Việt sang các ngôn ngữ hỗ trợ còn lại.
  // XỬ LÝ: Bỏ qua vi; dịch tuần tự từng ngôn ngữ rồi refresh để lấy revision mới.
  // TẠI SAO: Mỗi lần dịch có thể tăng revision; không dùng lại revision cũ cho tác vụ sau.
  async function translateAll() {
    for (const { code, label } of LANGUAGES) {
      if (code === 'vi') continue
      const place = current.current
      if (!place) throw new AdminError('notFound')
      setProgress(t('translating') + ' · ' + label)
      await state.service.translate(place.id, code, place.revision)
      await refresh(place.id)
    }
  }

  // ==================== [LUU-NHAP] save ====================
  // CHỨC NĂNG: Lưu thông tin đang nhập thành bản nháp.
  // XỬ LÝ: Ghép metadata/nội dung, gọi savePlace và refresh; chỉ dịch lại khi bản Việt thay đổi và tùy chọn cho phép.
  // TẠI SAO: Lưu nháp không tự công bố; mã đã lưu được giữ để thử lại khi tác vụ dịch lỗi.
  async function save(skipTranslation = false) {
    if (!dirty && current.current) return
    // CHỨC NĂNG: Không bắt buộc hoàn tất mọi trường khi lưu nháp.
    // XỬ LÝ: Chỉ tên là bắt buộc; phần chưa hoàn tất sẽ bị kiểm tra khi gửi duyệt.
    const content = { ...texts, vi: { ...(texts.vi ?? emptyText()), title } }
    const input: PlaceInput = {
      id: current.current?.id,
      expectedRevision: current.current?.revision,
      title,
      category,
      period,
      lat,
      lng,
      verified,
      images: images
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      content: Object.fromEntries(
        Object.entries(content).filter(([, value]) => value.title.trim()),
      ),
    }
    // Chỉ đổi nội dung chữ mới dịch lại; thay ảnh/MP3 không được xóa các bản dịch đang đúng.
    const previousVi = current.current?.record.content.vi
    const changedVi = (['title', 'summary', 'address', 'body'] as const).some(
      (key) => content.vi[key].trim() !== (previousVi?.[key] ?? '').trim(),
    )
    setProgress(t('save'))
    const id = await state.service.savePlace(input)
    // Giữ ngay mã DT đã lưu: dịch/audio thất bại sau đó vẫn tiếp tục trên nháp này, không thêm trùng.
    await refresh(id)
    setDirty(false)
    if (!skipTranslation && autoTranslate && changedVi && content.vi.body.trim())
      await translateAll()
  }

  // CHỨC NĂNG: Xóa trạng thái nhập sau gửi duyệt, không xóa bản ghi đã gửi trong SQL.
  // TẠI SAO: Gom về một hàm để không quên reset trường khi thêm thông tin mới cho form.
  // ==================== [LUU-NHAP] resetForNextPlace ====================
  // CHỨC NĂNG: Đưa form về trạng thái nhập di tích tiếp theo.
  // XỬ LÝ: Xóa state/ref của form và bật thông báo gửi thành công.
  // TẠI SAO: Không xóa bản ghi đã gửi trong SQL và không sửa nhầm hồ sơ vừa gửi.
  function resetForNextPlace() {
    current.current = undefined
    setSaved(undefined)
    setTexts({})
    setLanguage('vi')
    setTitle('')
    setCategory('palace')
    setPeriod('')
    setLat('')
    setLng('')
    setVerified(false)
    setImages('')
    setDirty(false)
    setAutoTranslate(true)
    setSubmittedSuccess(true)
  }

  // ==================== [BIEN-TAP] perform ====================
  // CHỨC NĂNG: Điều phối nút lưu, dịch, tạo audio và gửi phê duyệt.
  // XỬ LÝ: Lưu trước; chạy tác vụ được chọn; dọn tiến trình trong finally và reset form khi gửi thành công.
  // TẠI SAO: Các nút dùng cùng một luồng xử lý trên web/mobile và không để giao diện mắc trạng thái đang xử lý.
  async function perform(action: PlaceEditorAction) {
    setSubmittedSuccess(false)
    const ok = await state.run(async () => {
      try {
        await save(action === 'translate')
        if (action === 'translate') await translateAll()
        if (action === 'audio') {
          if (!current.current?.record.content.vi?.body.trim()) throw new AdminError('incomplete')
          // CHỨC NĂNG: Tạo MP3 cho từng bản đã có nội dung, theo đúng tiếng của bản đó.
          // XỬ LÝ: Tuần tự để tránh audio chồng tác vụ; phần đã xong vẫn được lưu nếu mạng lỗi.
          for (const { code, label } of LANGUAGES) {
            const place = current.current
            if (!place?.record.content[code]?.body.trim()) continue
            if (place.record.content[code]?.audio) continue
            setProgress(t('prepare') + ' · ' + label)
            await state.service.generateAudio(place.id, code, place.revision)
            await refresh(place.id)
          }
        }
        if (action === 'submit') {
          const place = current.current
          if (!place) throw new AdminError('notFound')
          setProgress(t('submit'))
          await state.service.submit(place.id, place.revision)
        }
      } finally {
        setProgress('')
      }
    })
    if (ok && action === 'submit') {
      // CHỨC NĂNG: Bắt đầu hồ sơ mới sau khi gửi thành công; không xóa hồ sơ vừa gửi trong SQL.
      // TẠI SAO: Không để lần nhập tiếp theo sửa nhầm di tích đã chuyển vào hàng chờ duyệt.
      resetForNextPlace()
    }
    return ok
  }

  // CHỨC NĂNG: Nạp bản mới nhất sau khi người dùng đồng ý bỏ thay đổi bị xung đột.
  // XỬ LÝ: Cập nhật cả metadata và nội dung; không chỉ thay revision của dữ liệu cũ.
  // ==================== [LUU-NHAP] reloadDraft ====================
  // CHỨC NĂNG: Nạp lại bản nháp mới nhất khi cần xử lý xung đột.
  // XỬ LÝ: Refresh rồi đồng bộ tên, danh mục, tọa độ và cờ đã sửa của form.
  // TẠI SAO: Không chỉ thay revision trong khi các trường vẫn giữ dữ liệu cũ.
  async function reloadDraft() {
    if (!current.current) throw new AdminError('notFound')
    const latest = await refresh(current.current.id)
    setTitle(latest.record.canonicalTitle)
    setCategory(categoryOf(latest.record))
    setPeriod(latest.period)
    setLat(latest.record.position?.lat.toString() ?? '')
    setLng(latest.record.position?.lng.toString() ?? '')
    setVerified(latest.record.position?.verified ?? false)
    setDirty(false)
  }

  return {
    current,
    saved,
    language,
    setLanguage,
    title,
    category,
    setCategory,
    period,
    setPeriod,
    lat,
    setLat,
    lng,
    setLng,
    verified,
    setVerified,
    images,
    setImages,
    dirty,
    setDirty,
    autoTranslate,
    setAutoTranslate,
    progress,
    text,
    disabled,
    edit,
    perform,
    reloadDraft,
    submittedSuccess,
  }
}
