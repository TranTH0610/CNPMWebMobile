/**
 * FILE: apps/mobile/src/features/journey/components/NutNgheThuyetMinh.tsx
 * FILE NÀY LÀM GÌ: Nút bắt đầu nghe bài của địa điểm theo ngôn ngữ hiện tại; gọi luồng thuyết minh chung.
 * VAI TRÒ: Giao diện Mobile; gọi hook/service để xử lý nghiệp vụ.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { useText } from '../../language/i18n/CauHinhNgonNgu'
import { useVisitor } from '../../language/hooks/useDuKhach'
import { useJourney } from '../hooks/useHanhTrinh'
import { Action } from '../../../shared/components/NutThaoTac'

// CHỨC NĂNG: Nút bắt đầu nghe bài của địa điểm theo ngôn ngữ hiện tại; gọi luồng thuyết minh
// chung.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.

// [UC07] ListenButton — Nút bắt đầu nghe bài của địa điểm theo ngôn ngữ hiện tại; gọi luồng thuyết minh
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

  // [UC07] toggle — Bấm lại cùng bài thì pause/resume, không tự phát lại từ đầu.
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
