/**
 * CHỨC NĂNG: [DINH-VI] [THUYET-MINH]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Nút bắt đầu nghe bài của địa điểm theo ngôn ngữ hiện tại; gọi luồng thuyết minh chung.
 *
 * VỊ TRÍ: apps/mobile/src/features/journey/components/NutNgheThuyetMinh.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/src/features/place-detail/screens/ManChiTietDiTich.tsx
 *
 * PHỤ THUỘC:
 * - ../../language/i18n/CauHinhNgonNgu
 * - ../../language/hooks/useDuKhach
 * - ../hooks/useHanhTrinh
 * - ../../../shared/components/NutThaoTac
 *
 * CÁC KHỐI CHÍNH:
 * 1. ListenButton
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { useVisitor } from '../../language/hooks/useDuKhach'
import { useJourney } from '../hooks/useHanhTrinh'
import { Action } from '../../../shared/components/NutThaoTac'

// CHỨC NĂNG: Nút bắt đầu nghe bài của địa điểm theo ngôn ngữ hiện tại; gọi luồng thuyết minh
// chung.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// ==================== [DINH-VI] [THUYET-MINH] ListenButton ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function ListenButton({ id }: { id: string }) {
  const { engine, state } = useJourney(),
    { language } = useVisitor(),
    t = useText()

  const same = state.session?.placeId === id && state.session.language === language

  const playing = same && state.status === 'playing'

  const paused = same && state.status === 'paused'

  const busy = state.status === 'loading'

  const label = t(busy ? 'jPreparing' : playing ? 'jPause' : paused ? 'jResume' : 'jPlay')
  // CHỨC NĂNG: Bấm lại cùng bài thì pause/resume, không tự phát lại từ đầu.

  const toggle = () => {
    if (playing) engine.pause()
    else if (paused) void engine.resume()
    else void engine.play(id, language)
  }
  // TẠI SAO (toggle): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
  // một nơi.

  return (
    <Action
      title={label}
      icon={playing ? 'pause' : 'play'}
      variant="primary"
      disabled={busy}
      onPress={toggle}
    />
  )
}
// TẠI SAO (ListenButton): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
