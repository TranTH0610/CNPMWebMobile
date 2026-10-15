/**
 * FILE NÀY LÀM GÌ:
 * Đăng ký bản dịch, khai báo ngôn ngữ và mã giọng đọc của ứng dụng.
 *
 * Được dùng bởi:
 * - App.tsx
 * - LanguageScreen, SettingsScreen
 * - Các component dùng useTranslation
 * - Các hook cần kiểu LangCode
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

// CHỨC NĂNG: đọc nội dung dịch từ từng file.
// XỬ LÝ: đặt tên rõ nghĩa để không nhầm Trung với Bồ.
import vietnamese from './locales/vi.json'
import english from './locales/en.json'
import japanese from './locales/ja.json'
import chinese from './locales/cn.json'
import portuguese from './locales/pt.json'

// CHỨC NĂNG: khai báo các ngôn ngữ được hỗ trợ.
// XỬ LÝ:
// - code: mã nội bộ, dùng trong dữ liệu và lựa chọn đã lưu.
// - speech: mã ngôn ngữ hệ thống đọc.
// - Giữ cn làm mã nội bộ, dùng zh-CN cho giọng Trung.
// - as const giúp TypeScript giữ chính xác từng mã ngôn ngữ.
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
] as const

// CHỨC NĂNG: xuất kiểu mã ngôn ngữ cho các file khác.
// XỬ LÝ: suy ra từ LANGUAGES, không khai báo danh sách lần hai.
// Kết quả là: 'vi' | 'en' | 'ja' | 'cn' | 'pt'.
export type LangCode =
  (typeof LANGUAGES)[number]['code']

// CHỨC NĂNG: gắn mỗi mã với đúng file dịch.
// XỬ LÝ: từng ngôn ngữ có resource riêng, không trộn các file.
const resources = {
  vi: {
    translation: vietnamese,
  },
  en: {
    translation: english,
  },
  ja: {
    translation: japanese,
  },
  cn: {
    translation: chinese,
  },
  pt: {
    translation: portuguese,
  },
}

// CHỨC NĂNG: đọc ngôn ngữ của thiết bị.
// XỬ LÝ: nếu không đọc được thì dùng chuỗi rỗng,
// để bước tìm phía dưới trả null.
const deviceCode =
  getLocales()[0]?.languageCode ?? ''

// CHỨC NĂNG: chuyển mã thiết bị sang mã nội bộ.
// XỬ LÝ: hệ điều hành dùng zh cho tiếng Trung;
// dữ liệu hiện tại của dự án dùng cn.
const internalDeviceCode =
  deviceCode === 'zh'
    ? 'cn'
    : deviceCode

// CHỨC NĂNG: tìm ngôn ngữ được hỗ trợ để gợi ý lúc mở lần đầu.
// XỬ LÝ: ngôn ngữ thiết bị không được hỗ trợ thì trả null.
// Đây là biến riêng, nằm ngoài mảng LANGUAGES.
export const DEVICE_LANG: LangCode | null =
  LANGUAGES.find(
    (language) =>
      language.code === internalDeviceCode,
  )?.code ?? null

// CHỨC NĂNG: khởi tạo i18n khi chưa được khởi tạo.
// XỬ LÝ:
// - Chỉ chấp nhận các mã ngôn ngữ trong LANGUAGES.
// - Thiếu key thì dùng bản Việt.
// - RootNavigator sẽ áp dụng lựa chọn đã lưu lúc khởi động.
// - languageChanged giúp giao diện cập nhật khi đổi ngôn ngữ.
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
  // CHỨC NĂNG: cập nhật resource khi Fast Refresh chạy lại file.
  // XỬ LÝ: không gọi init lần nữa; cập nhật các nhóm dịch
  // bằng nội dung mới đã import từ JSON.
  for (
    const [code, resource]
    of Object.entries(resources)
  ) {
    i18n.addResourceBundle(
      code,
      'translation',
      resource.translation,
      false,
      true,
    )
  }
}

// CHỨC NĂNG: cung cấp cùng một instance i18n cho ứng dụng.
// XỬ LÝ: default export là instance; LangCode là named type export.
export default i18n