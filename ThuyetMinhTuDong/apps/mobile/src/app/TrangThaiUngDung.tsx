/**
 * FILE: apps/mobile/src/app/TrangThaiUngDung.tsx
 * FILE NÀY LÀM GÌ: Khởi tạo và ghép provider du khách, i18n và hành trình; các màn con dùng chung cùng trạng thái.
 * VAI TRÒ: Khởi tạo, điều hướng hoặc thành phần hỗ trợ ứng dụng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC01: Thiết lập và thay đổi ngôn ngữ.
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * - UC05: Bắt đầu tham quan bằng QR chung tại cổng.
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
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

// [UC01 / UC02 / UC03 / UC04 / UC05 / UC06 / UC07 / UC08] AppProviders — Giữ thứ tự provider để điều hướng, ngôn ngữ và phiên nghe dùng chung trạng thái.
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
