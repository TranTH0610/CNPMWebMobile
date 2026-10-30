/**
 * FILE NÀY LÀM GÌ
 * Nghe thử bản thu trong biên tập/kiểm duyệt. Native dùng controller nghe thử; web dùng phần tử
 * audio của trình duyệt.
 *
 * VỊ TRÍ: apps/web/src/components/admin/AudioPreview.tsx
 * DÙNG BỞI: apps/web/src/pages/admin/ContentEditorPage.tsx;
 * apps/web/src/pages/admin/ReviewsPage.tsx.
 * PHỤ THUỘC: react; @travelguide/visitor-core; ../../services/narrationSource
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ 'react'.
import { useEffect, useRef } from 'react'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { playbackCoordinator } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../../services/narrationSource'.
import { narrationSource } from '../../services/narrationSource'
// CHỨC NĂNG: Nghe thử bản thu trong biên tập/kiểm duyệt.
// XỬ LÝ: Nhận dữ liệu và callback qua props/hook; nơi sở hữu dữ liệu quyết định thao tác cập nhật.
// Khai báo AudioPreview({url}). Component hàm nhận props và dựng phần giao diện AudioPreview. | Khai báo url, kiểu string.
export function AudioPreview({url}:{url:string}) {
  // Khai báo ref: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const ref=useRef<HTMLAudioElement>(null)
  // DÒNG NÀY LÀM GÌ: Lấy audio hiện tại để đăng ký thao tác dọn nguồn nghe thử.
  // CÁCH HOẠT ĐỘNG: Effect không gọi play; hàm return pause audio và trả quyền phát khi URL đổi
  // hoặc rời component.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: url.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(()=>{
    // Khai báo audio: đọc ref.current từ đối tượng/mảng để dùng tại bước hiện tại.
    const audio=ref.current
    // Rẽ nhánh nếu !audio. | Thoát hàm hiện tại ngay.
    if(!audio)return
    // CHỨC NĂNG: Rời màn/đổi bài dừng và nhả nguồn đang nghe thử.
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return()=>{audio.pause();playbackCoordinator.release(audio)}`: Trả kết quả: khai báo callback ()=>{audio.pause(). | Thực hiện audio.pause tạm dừng nguồn âm thanh hiện tại. | Thực hiện playbackCoordinator.release trả quyền phát nếu nguồn này đang sở hữu, tránh xóa quyền của nguồn mới.
     * DÒNG `},[url])`: Đăng ký useEffect để thực hiện tác vụ sau render.
     */
    return()=>{audio.pause();playbackCoordinator.release(audio)}
  },[url])
  // TẠI SAO: Đổi bản thu hoặc rời trang phải dừng nguồn cũ để không chồng âm với bản mới.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return <audio ref={ref} controls preload="metadata" src={narrationSource(url,true)} o`: Trả cây giao diện của component để React hiển thị. | Thuộc tính ref: giữ tham chiếu đến phần tử/đối tượng để focus hoặc đo kích thước. | Thuộc tính controls: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính preload: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính src: chỉ định nguồn tài nguyên cần tải. | Thuộc tính onPlay: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `playbackCoordinator.claim(event.currentTarget)`: Thực hiện playbackCoordinator.claim nhận quyền phát của bộ điều phối.
   * DÒNG `}} />`: Đưa biểu thức JavaScript event=>{ // XỬ LÝ: Bao gồm cả audio du khách do adapter tạo, không chỉ thẻ trong DOM. playbackCoordinator.clai vào JSX.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return <audio ref={ref} controls preload="metadata" src={narrationSource(url,true)} onPlay={event=>{
    // XỬ LÝ: Bao gồm cả audio du khách do adapter tạo, không chỉ thẻ trong DOM.
    playbackCoordinator.claim(event.currentTarget)
  }} />
}
// TẠI SAO (AudioPreview): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
/* CÁCH KIỂM TRA: Pause tại 0:12, resume từ 0:12; bật bản khác làm bản trước pause. */
