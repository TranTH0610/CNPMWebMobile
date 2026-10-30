/**
 * FILE NÀY LÀM GÌ
 * Đăng ký component App với Expo để runtime biết ứng dụng cần khởi động từ đâu.
 *
 * VỊ TRÍ: apps/mobile/index.js
 * DÙNG BỞI: Entry hoặc nơi import module này trong ứng dụng.
 * PHỤ THUỘC: expo; ./App
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// Nhập các thành phần từ 'expo'.
import { registerRootComponent } from 'expo'
// Nhập các thành phần từ './App'.
import App from './App'

// CHỨC NĂNG: Đăng ký component gốc.
// XỬ LÝ: Dùng hàm Expo để tương thích môi trường Expo Go.
// Thực hiện Gọi registerRootComponent(App).
registerRootComponent(App)