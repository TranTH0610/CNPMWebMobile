/**
 * FILE NÀY LÀM GÌ
 * Client gọi API transcribe từ cấu hình URL. Đây là tiện ích có trong kho mã; không đồng nghĩa
 * dịch vụ nhận dạng giọng nói đã được triển khai.
 *
 * VỊ TRÍ: packages/api-client/index.ts
 * DÙNG BỞI: Entry hoặc nơi import module này trong ứng dụng.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
﻿// index.ts
// Ham goi API dung chung cho ca web va mobile, tranh viet trung 2 lan

// Gán API_URL bằng process.env.API_URL; nếu null hoặc undefined thì dùng 'http://localhost:3000/api'.
const API_URL = process.env.API_URL ?? 'http://localhost:3000/api'

// CHỨC NĂNG: Gửi yêu cầu nhận dạng âm thanh đến API đã cấu hình.
// XỬ LÝ: Đây là client HTTP; chức năng chỉ có kết quả khi endpoint tương ứng hoạt động.
// Khai báo transcribeAudio(audioUrl, language). Nhận đầu vào qua tham số.
export async function transcribeAudio(audioUrl: string, language: string) {
  // Khai báo res: await chờ fetch gửi HTTP request.
  const res = await fetch(API_URL + '/transcribe', {
    // Gán thuộc tính method: chuỗi 'POST'.
    method: 'POST',
    // Gán thuộc tính headers: tạo object gồm 'Content-Type'. | Gán thuộc tính 'Content-Type': chuỗi 'application/json'.
    headers: { 'Content-Type': 'application/json' },
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `body: JSON.stringify({ audioUrl, language }),`: Gán thuộc tính body: JSON.stringify tuần tự hóa dữ liệu để lưu hoặc truyền qua HTTP. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Đặt trường audioUrl bằng giá trị của biến cùng tên. | Đặt trường language bằng giá trị của biến cùng tên.
     * DÒNG `})`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    body: JSON.stringify({ audioUrl, language }),
  })
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return res.json()`: Trả kết quả: Gọi res.json().
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return res.json()
}
// TẠI SAO (transcribeAudio): UI gửi hợp đồng HTTP mà không giữ logic nhận dạng giọng nói;
// endpoint thực tế phải có dịch vụ đáp ứng.