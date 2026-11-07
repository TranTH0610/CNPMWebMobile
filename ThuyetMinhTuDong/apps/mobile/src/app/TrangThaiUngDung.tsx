/**
 * CHỨC NĂNG: [KHOI-DONG] [CAU-HINH]
 * VAI TRÒ: GIAO DIỆN MOBILE
 *
 * FILE NÀY LÀM GÌ:
 * Khởi tạo và ghép provider du khách, i18n và hành trình; các màn con dùng chung cùng trạng thái.
 *
 * VỊ TRÍ: apps/mobile/src/app/TrangThaiUngDung.tsx
 *
 * ĐƯỢC DÙNG BỞI:
 * - apps/mobile/App.tsx
 *
 * PHỤ THUỘC:
 * - @travelguide/admin-core/react
 * - ../features/admin/shared/services/KetNoiDichVuQuanTri
 * - react
 * - react-native
 * - react-native-safe-area-context
 * - expo-localization
 * - @travelguide/visitor-core/react
 * - @travelguide/visitor-core/journey/react
 * - ../features/language/i18n/CauHinhNgonNgu
 * - ../shared/services/KetNoiNenTang
 * - ../features/journey/adapters/KetNoiAudioVaDinhVi
 *
 * CÁC KHỐI CHÍNH:
 * 1. AppProviders
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
 */
import { AdminProvider } from '@travelguide/admin-core/react'
import { adminService, publicCatalog } from '../features/admin/shared/services/KetNoiDichVuQuanTri'
import type { ReactNode } from 'react'
import { ActivityIndicator } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { getLocales } from 'expo-localization'
import { VisitorProvider } from '@travelguide/visitor-core/react'
import { JourneyProvider } from '@travelguide/visitor-core/journey/react'
import { boot } from '../features/language/i18n/CauHinhNgonNgu'
import { storage } from '../shared/services/KetNoiNenTang'
import { journeyAdapters } from '../features/journey/adapters/KetNoiAudioVaDinhVi'

// Gán deviceLanguage bằng getLocales()[0]?.languageTag; nếu null hoặc undefined thì dùng null.
const deviceLanguage = getLocales()[0]?.languageTag ?? null
// CHỨC NĂNG: Giữ thứ tự provider để điều hướng, ngôn ngữ và phiên nghe dùng chung trạng thái.

// ==================== [KHOI-DONG] [CAU-HINH] AppProviders ====================
// TẠI SAO: Giữ phần hiển thị riêng nền tảng; nghiệp vụ dùng hook/service để tránh lặp xử lý.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <VisitorProvider
        boot={boot}
        storage={storage}
        catalog={publicCatalog}
        deviceLanguage={deviceLanguage}
        loading={<ActivityIndicator />}
      >
        <AdminProvider service={adminService}>
          <JourneyProvider adapters={journeyAdapters}>{children}</JourneyProvider>
        </AdminProvider>
      </VisitorProvider>
    </SafeAreaProvider>
  )
}
// TẠI SAO (AppProviders): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất
// quán và dễ bảo trì.
