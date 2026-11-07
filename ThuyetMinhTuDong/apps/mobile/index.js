/**
 * CHỨC NĂNG: [KHOI-DONG] [CAU-HINH]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Đăng ký component App với Expo để runtime biết ứng dụng cần khởi động từ đâu.
 *
 * VỊ TRÍ: apps/mobile/index.js
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - expo
 * - ./App
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
// Nhập các thành phần từ 'expo'.
import { registerRootComponent } from 'expo'
// Nhập các thành phần từ './App'.
import App from './App'

// CHỨC NĂNG: Đăng ký component gốc.
// XỬ LÝ: Dùng hàm Expo để tương thích môi trường Expo Go.
// Thực hiện Gọi registerRootComponent(App).
registerRootComponent(App)