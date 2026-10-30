/**
 * FILE NÀY LÀM GÌ
 * Ghi lượt vào từ liên kết QR chung có dấu entry=gate; dùng mã lượt để hạn chế đếm lại khi tải
 * trang.
 *
 * VỊ TRÍ: apps/mobile/src/hooks/useGateEntry.ts
 * DÙNG BỞI: apps/mobile/src/hooks/usePresenceHeartbeat.ts.
 * PHỤ THUỘC: react; react-native; @travelguide/admin-core; ../services/admin/services;
 * ../services/platform
 * TẠI SAO TÁCH FILE: Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
 * dùng lại.
 */
// Nhập các thành phần từ 'react'.
import { useEffect } from 'react'
// Nhập các thành phần từ 'react-native'.
import { Linking } from 'react-native'
// Nhập các thành phần từ '@travelguide/admin-core'.
import { sendGateEntry } from '@travelguide/admin-core'
// Nhập các thành phần từ '../services/admin/services'.
import { visitorGateClient } from '../services/admin/services'
// Nhập các thành phần từ '../services/platform'.
import { webOrigin } from '../services/platform'
// Khai báo visitId: tính biểu thức 'gate_app_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2)+Math.random().
const visitId='gate_app_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)
// CHỨC NĂNG: Ghi lượt mở liên kết QR tại cổng.
// XỬ LÝ: Chỉ xử lý liên kết đúng dấu entry=gate và dùng mã lượt để hạn chế đếm lại.
// Khai báo useGateEntry(enabled). Ghi lượt mở đúng liên kết vào cổng.
export function useGateEntry(enabled:boolean){
 // DÒNG NÀY LÀM GÌ: Nhận liên kết mở app ban đầu và các sự kiện URL mới trong lúc app đang chạy.
 // CÁCH HOẠT ĐỘNG: Chỉ ghi lượt khi origin, đường dẫn và query đúng quy tắc cổng; cleanup hủy gửi
 // và gỡ subscription.
 // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: enabled.
 // Đăng ký useEffect để thực hiện tác vụ sau render. | Rẽ nhánh nếu !enabled. | Thoát hàm hiện tại ngay.
 useEffect(()=>{if(!enabled)return
  // Khai báo alive: sử dụng true làm giá trị của bước hiện tại. | Khai báo stop: không có giá trị khởi tạo.
  let alive=true;let stop:(()=>void)|undefined
  // Khai báo receive: khai báo callback (url:string|null|undefined)=>{ if(!alive||!url)return try {const value=new.
  const receive=(url:string|null|undefined)=>{
   // Rẽ nhánh nếu !alive||!url. | Thoát hàm hiện tại ngay.
   if(!alive||!url)return
   // Bắt đầu vùng try. | Khai báo value: URL phân tích địa chỉ theo thành phần protocol/host/path thay vì tự cắt chuỗi. | Rẽ nhánh nếu value.search!=='?entry=gate'||value.pathname!=='/'||value.origin!==webOrigin. | Thoát hàm hiện tại ngay.
   try {const value=new URL(url);if(value.search!=='?entry=gate'||value.pathname!=='/'||value.origin!==webOrigin)return
    // CHỨC NĂNG: Giữ cùng ID suốt lần chạy app để sự kiện link lặp không tăng lượt.
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `stop?.();stop=sendGateEntry(visitorGateClient,visitId,'mobile-app')`: Thực hiện Gọi stop?.(). | Thực hiện tính biểu thức stop=sendGateEntry(visitorGateClient,visitId,'mobile-app').
     * DÒNG `}catch{/* Link sai không làm gián đoạn ứng dụng. * /}`: Bắt đầu vùng try.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    stop?.();stop=sendGateEntry(visitorGateClient,visitId,'mobile-app')
   }catch{/* Link sai không làm gián đoạn ứng dụng. */}
  }
  // TẠI SAO (receive): Tách vòng đời và việc đọc trạng thái khỏi UI giúp màn hình dễ theo dõi và
  // dùng lại.
  // Thực hiện sử dụng void Linking.getInitialURL().then(receive).catch(()=>{}) làm giá trị của bước hiện tại.
  void Linking.getInitialURL().then(receive).catch(()=>{})
  // Khai báo subscription: Gọi Linking.addEventListener('url',event=>receive(event.url)).
  const subscription=Linking.addEventListener('url',event=>receive(event.url))
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return()=>{alive=false;stop?.();subscription.remove()}`: Trả kết quả: khai báo callback ()=>{alive=false. | Thực hiện tính biểu thức alive=false. | Thực hiện Gọi stop?.(). | Thực hiện Gọi subscription.remove().
   * DÒNG `},[enabled])`: Đăng ký useEffect để thực hiện tác vụ sau render.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return()=>{alive=false;stop?.();subscription.remove()}
 },[enabled])
 // TẠI SAO: Cùng luồng QR cần hoạt động khi app vừa mở lẫn đang mở; link lặp không nên biến thành
 // nhiều lượt vào.
}
// TẠI SAO (useGateEntry): Chỉ lượt vào từ liên kết cổng mới được ghi nhận; tải trang thường
// không phải một lượt mở QR.
/* CÁCH KIỂM TRA: App cài riêng nhận link HTTPS vào cổng; mở từ icon/Expo không tăng lượt QR. */
