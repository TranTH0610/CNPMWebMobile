/**
 * FILE NÀY LÀM GÌ: Khởi tạo i18n và cung cấp hàm dịch cho ứng dụng.
 * Vị trí: apps/mobile/src/i18n/index.ts. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { createVisitorI18n } from '@travelguide/visitor-core/react'

// CHỨC NĂNG: Khởi tạo ngôn ngữ đúng một lần ở tầng ứng dụng.
// XỬ LÝ: Resource VI/EN/CN/PT/JA dùng chung với nền tảng còn lại.
export const boot = createVisitorI18n()
export { useText } from '@travelguide/visitor-core/react'
