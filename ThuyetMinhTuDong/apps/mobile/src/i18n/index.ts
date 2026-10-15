/**
 * FILE NÀY LÀM GÌ:
 * Đăng ký đúng file dịch cho từng mã ngôn ngữ và cấu hình i18n.
 *
 * Được dùng bởi:
 * - App.tsx
 * - LanguageScreen, SettingsScreen
 * - Các component dùng useTranslation
 * - Các hook cần LangCode
 *
 * Phụ thuộc:
 * - i18next, react-i18next, expo-localization
 * - Các file JSON trong locales
 *
 * Liên quan: chọn ngôn ngữ, giao diện đa ngôn ngữ và TTS.
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'

// CHỨC NĂNG: nhập từng file bằng tên rõ nghĩa.
// XỬ LÝ: tránh nhầm file Trung thành biến Bồ hoặc ngược lại.
import vietnamese from './locales/vi.json'
import english from './locales/en.json'
import japanese from './locales/ja.json'
import chinese from './locales/cn.json'
import portuguese from './locales/pt.json'

// CHỨC NĂNG: cung cấp mã nội bộ và mã đọc của thiết bị.
// XỬ LÝ: giữ cn làm mã nội bộ để không mất lựa chọn đã lưu.
// Hệ thống TTS dùng zh-CN cho tiếng Trung.
export const LANGUAGES = [
  {
    code: 'vi',
    label: 'Tiếng Việt',
    speech: 'vi-VN',
  },
  {
    code: 'en',
    label: 'English',
    speech: 'en-US',
  },
  {
    code: 'ja',
    label: '日本語',
    speech: 'ja-JP',
  },
  {
    code: 'cn',
    label: '中文',
    speech: 'zh-CN',
  },
  {
    code: 'pt',
    label: 'Português',
    speech: 'pt-PT',
  },
  LANGUAGES.find(
    (language) =>
      language.code === internalDeviceCode,
  )?.code ?? null

// CHỨC NĂNG: khởi tạo instance dùng chung một lần.
// XỬ LÝ:
// - supportedLngs giới hạn vào các mã dự án đang hỗ trợ.
// - currentOnly tra đúng mã nội bộ đã chọn.
// - Thiếu key mới fallback sang vi.
// - Không tự đổi ngôn ngữ theo ngôn ngữ thuyết minh.
if (!i18n.isInitialized) {
  void i18n
    .use(initReactI18next)
    .init({
      resources,
      supportedLngs: LANGUAGES.map(
        (language) => language.code,
      ),
      load: 'currentOnly',
      lng: DEVICE_LANG ?? 'vi',
      fallbackLng: 'vi',
      interpolation: {
        escapeValue: false,
      },
      react: {
        bindI18n: 'languageChanged',
        bindI18nStore: 'added removed',
        useSuspense: false,
      },
    })
} else {
  // CHỨC NĂNG: cập nhật nội dung khi Fast Refresh chạy lại module.
  // XỬ LÝ: không gọi init nhiều lần trên cùng instance.
  // deep=false thay các nhóm cấp gốc bằng nhóm trong file mới.
  for (const [code, resource] of Object.entries(resources)) {
    i18n.addResourceBundle(
      code,
      'translation',
      resource.translation,
      false,
      true,
    )
  }
}

export default i18n