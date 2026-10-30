/**
 * FILE NÀY LÀM GÌ
 * Nút bắt đầu nghe bài của địa điểm theo ngôn ngữ hiện tại; gọi luồng thuyết minh chung.
 *
 * VỊ TRÍ: apps/web/src/components/ListenButton.tsx
 * DÙNG BỞI: apps/web/src/pages/DetailPage.tsx.
 * PHỤ THUỘC: ../i18n; ../hooks/useVisitor; ../hooks/useJourney; ./Icon
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ '../i18n'.
import { useText } from '../i18n'
// Nhập các thành phần từ '../hooks/useVisitor'.
import { useVisitor } from '../hooks/useVisitor'
// Nhập các thành phần từ '../hooks/useJourney'.
import { useJourney } from '../hooks/useJourney'
// Nhập các thành phần từ './Icon'.
import { Icon } from './Icon'

// CHỨC NĂNG: Nút bắt đầu nghe bài của địa điểm theo ngôn ngữ hiện tại; gọi luồng thuyết minh
// chung.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo ListenButton({ id }). Component hàm nhận props và dựng phần giao diện ListenButton. | Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi.
export function ListenButton({ id }: { id: string }) {
  // Khai báo { engine, state }: useJourney() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo { language }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình | Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const { engine, state } = useJourney(), { language } = useVisitor(), t = useText()
  // Khai báo same: tính biểu thức state.session?.placeId === id && state.session.language === language.
  const same = state.session?.placeId === id && state.session.language === language
  // Khai báo playing: tính biểu thức same && state.status === 'playing'.
  const playing = same && state.status === 'playing'
  // Khai báo paused: tính biểu thức same && state.status === 'paused'.
  const paused = same && state.status === 'paused'
  // Khai báo busy: tính biểu thức state.status === 'loading'.
  const busy = state.status === 'loading'
  // Khai báo label: Gọi t(busy ? 'jPreparing' : playing ? 'jPause' : paused ? 'jResume' : 'jPlay').
  const label = t(busy ? 'jPreparing' : playing ? 'jPause' : paused ? 'jResume' : 'jPlay')
  // CHỨC NĂNG: Bấm lại cùng bài thì pause/resume, không tự phát lại từ đầu.
  // Khai báo toggle: khai báo callback () => { if (playing) engine.pause() else if (paused) void engine.resume() e.
  const toggle = () => {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (playing) engine.pause()`: Rẽ nhánh nếu playing. | Thực hiện engine.pause tạm dừng nguồn âm thanh hiện tại.
     * DÒNG `else if (paused) void engine.resume()`: Rẽ nhánh nếu playing. | Rẽ nhánh nếu paused. | Thực hiện sử dụng void engine.resume() làm giá trị của bước hiện tại.
     * DÒNG `else void engine.play(id, language)`: Rẽ nhánh nếu paused. | Thực hiện sử dụng void engine.play(id, language) làm giá trị của bước hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    if (playing) engine.pause()
    else if (paused) void engine.resume()
    else void engine.play(id, language)
  }
  // TẠI SAO (toggle): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
  // một nơi.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return <button type="button" className="listen-button" disabled={busy} onClick={toggl`: Trả cây giao diện của component để React hiển thị. | Thuộc tính type: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính className: liên kết phần tử với quy tắc CSS. | Thuộc tính disabled: khóa thao tác khi chưa sẵn sàng. | Thuộc tính onClick: nối thao tác bấm với callback. | Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return <button type="button" className="listen-button" disabled={busy} onClick={toggle}><Icon name={playing ? 'pause' : 'play'} />{label}</button>
}
// TẠI SAO (ListenButton): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
