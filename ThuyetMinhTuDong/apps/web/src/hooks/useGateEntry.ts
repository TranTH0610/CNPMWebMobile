/**
 * FILE NÀY LÀM GÌ
 * Ghi lượt vào từ liên kết QR chung có dấu entry=gate; dùng mã lượt để hạn chế đếm lại khi tải
 * trang.
 *
 * VỊ TRÍ: apps/web/src/hooks/useGateEntry.ts
 * DÙNG BỞI: apps/web/src/hooks/usePresenceHeartbeat.ts.
 * PHỤ THUỘC: react; react-router-dom; @travelguide/admin-core; ../services/admin/services
 * TẠI SAO TÁCH FILE: Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
 * dùng lại.
 */
// Nhập các thành phần từ 'react'.
import { useEffect } from 'react'
// Nhập các thành phần từ 'react-router-dom'.
import { useLocation } from 'react-router-dom'
// Nhập các thành phần từ '@travelguide/admin-core'.
import { sendGateEntry } from '@travelguide/admin-core'
// Nhập các thành phần từ '../services/admin/services'.
import { visitorGateClient } from '../services/admin/services'
// Khai báo visitId: không có giá trị khởi tạo.
let visitId: string | undefined
// Khai báo id(). Nhận đầu vào qua tham số.
function id() {
 // Rẽ nhánh nếu visitId. | Trả kết quả: sử dụng visitId làm giá trị của bước hiện tại.
 if(visitId)return visitId
 // Khai báo fresh: tính biểu thức 'gate_web_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2)+Math.random().
 const fresh='gate_web_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)
 // Bắt đầu vùng try. | Khai báo old: sessionStorage.getItem đọc giá trị đã lưu. | Thực hiện tính biểu thức visitId=old&&/^[-_a-zA-Z0-9]{20,100}$/.test(old)?old:fresh. | Thực hiện Gọi sessionStorage.setItem('hue-gate-visit',visitId). | Thực hiện tính biểu thức visitId=fresh.
 try {const old=sessionStorage.getItem('hue-gate-visit');visitId=old&&/^[-_a-zA-Z0-9]{20,100}$/.test(old)?old:fresh;sessionStorage.setItem('hue-gate-visit',visitId)}catch{visitId=fresh}
 /* GIẢI THÍCH TỪNG DÒNG:
  * DÒNG `return visitId`: Trả kết quả: sử dụng visitId làm giá trị của bước hiện tại.
  * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
  */
 return visitId
}
// TẠI SAO (id): Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và dùng
// lại.
// CHỨC NĂNG: Ghi lượt mở liên kết QR tại cổng.
// XỬ LÝ: Chỉ xử lý liên kết đúng dấu entry=gate và dùng mã lượt để hạn chế đếm lại.
// Khai báo useGateEntry(). Ghi lượt mở đúng liên kết vào cổng. | Khai báo {pathname,search}: Gọi useLocation().
export function useGateEntry(){const {pathname,search}=useLocation()
 // DÒNG NÀY LÀM GÌ: Chỉ gửi lượt QR khi pathname là / và search đúng ?entry=gate.
 // CÁCH HOẠT ĐỘNG: Trả hàm dừng của sendGateEntry để cleanup dùng khi route đổi hoặc component
 // rời.
 // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: pathname, search.
 // Đăng ký useEffect để thực hiện tác vụ sau render.
 useEffect(()=>{
  // CHỨC NĂNG: Chỉ QR do nhân viên cấp có entry=gate mới được ghi nhận.
  // XỬ LÝ: Mở web thường hoặc mở Admin không tăng; API lỗi retry không làm đếm lặp.
  // Rẽ nhánh nếu pathname!=='/'||search!=='?entry=gate'. | Thoát hàm hiện tại ngay.
  if(pathname!=='/'||search!=='?entry=gate')return
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return sendGateEntry(visitorGateClient,id(),'web')`: Trả kết quả: Gọi sendGateEntry(visitorGateClient,id(),'web').
   * DÒNG `},[pathname,search])`: Đăng ký useEffect để thực hiện tác vụ sau render.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return sendGateEntry(visitorGateClient,id(),'web')
 },[pathname,search])
 // TẠI SAO: Vào website thường hoặc mở trang khác không phải một lượt vào cổng; request thử lại
 // không được tăng lượt giả.
}
// TẠI SAO (useGateEntry): Chỉ lượt vào từ liên kết cổng mới được ghi nhận; tải trang thường
// không phải một lượt mở QR.
/* CÁCH KIỂM TRA: Mở / không tăng; /?entry=gate tăng một; refresh vẫn một; tab phiên mới có thể tăng. */
