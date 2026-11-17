/**
 * FILE: apps/mobile/src/features/journey/hooks/useHanhTrinh.ts
 * FILE NÀY LÀM GÌ: Điểm import hook hành trình của ứng dụng; dùng lại triển khai chung trong visitor-core.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
// CHỨC NĂNG: Dùng cùng phiên audio/GPS và tiến độ trên toàn ứng dụng.

export { useJourney } from '@travelguide/visitor-core/journey/react'
