/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Client gọi API transcribe từ cấu hình URL. Đây là tiện ích có trong kho mã; không đồng nghĩa
 *
 * VỊ TRÍ: packages/api-client/XuatCongKhai.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. transcribeAudio
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// index.ts
// Ham goi API dung chung cho ca web va mobile, tranh viet trung 2 lan

// Gán API_URL bằng process.env.API_URL; nếu null hoặc undefined thì dùng 'http://localhost:3000/api'.
const API_URL = process.env.API_URL ?? 'http://localhost:3000/api'

// CHỨC NĂNG: Gửi yêu cầu nhận dạng âm thanh đến API đã cấu hình.
// XỬ LÝ: Đây là client HTTP; chức năng chỉ có kết quả khi endpoint tương ứng hoạt động.
// Khai báo transcribeAudio(audioUrl, language). Nhận đầu vào qua tham số.
// ==================== [DUNG-CHUNG] transcribeAudio ====================
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export async function transcribeAudio(audioUrl: string, language: string) {
  // Khai báo res: await chờ fetch gửi HTTP request.
  const res = await fetch(API_URL + '/transcribe', {
    // Gán thuộc tính method: chuỗi 'POST'.
    method: 'POST',
    // Gán thuộc tính headers: tạo object gồm 'Content-Type'. | Gán thuộc tính 'Content-Type': chuỗi 'application/json'.
    headers: { 'Content-Type': 'application/json' },
    
    body: JSON.stringify({ audioUrl, language }),
  })
  
  return res.json()
}
// TẠI SAO (transcribeAudio): UI gửi hợp đồng HTTP mà không giữ logic nhận dạng giọng nói;
// endpoint thực tế phải có dịch vụ đáp ứng.