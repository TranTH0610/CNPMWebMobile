/**
 * FILE NÀY LÀM GÌ:
 * Điểm vào của Expo, đăng ký App.tsx.
 * package.json của mobile trỏ main tới file này.
 * Phụ thuộc expo và App; phục vụ toàn bộ UC01–UC05.
 */

import { registerRootComponent } from 'expo'
import App from './App'

// CHỨC NĂNG: Đăng ký component gốc.
// XỬ LÝ: Dùng hàm Expo để tương thích môi trường Expo Go.
registerRootComponent(App)