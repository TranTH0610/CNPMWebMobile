/**
 * FILE NÀY LÀM GÌ
 * Khởi tạo và ghép provider du khách, i18n và hành trình; các màn con dùng chung cùng trạng thái.
 *
 * VỊ TRÍ: apps/mobile/src/providers/AppProviders.tsx
 * DÙNG BỞI: apps/mobile/App.tsx.
 * PHỤ THUỘC: @travelguide/admin-core/react; ../services/admin/services; react; react-native;
 * react-native-safe-area-context; expo-localization; @travelguide/visitor-core/react;
 * @travelguide/visitor-core/journey/react; ../i18n; ../services/platform;
 * ../services/journeyAdapters
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// Nhập các thành phần từ '@travelguide/admin-core/react'.
import { AdminProvider } from '@travelguide/admin-core/react'
// Nhập các thành phần từ '../services/admin/services'.
import { adminService, publicCatalog } from '../services/admin/services'
// Nhập kiểu dữ liệu từ 'react'.
import type { ReactNode } from 'react'
// Nhập các thành phần từ 'react-native'.
import { ActivityIndicator } from 'react-native'
// Nhập các thành phần từ 'react-native-safe-area-context'.
import { SafeAreaProvider } from 'react-native-safe-area-context'
// Nhập các thành phần từ 'expo-localization'.
import { getLocales } from 'expo-localization'
// Nhập các thành phần từ '@travelguide/visitor-core/react'.
import { VisitorProvider } from '@travelguide/visitor-core/react'
// Nhập các thành phần từ '@travelguide/visitor-core/journey/react'.
import { JourneyProvider } from '@travelguide/visitor-core/journey/react'
// Nhập các thành phần từ '../i18n'.
import { boot } from '../i18n'
// Nhập các thành phần từ '../services/platform'.
import { storage } from '../services/platform'
// Nhập các thành phần từ '../services/journeyAdapters'.
import { journeyAdapters } from '../services/journeyAdapters'

// Gán deviceLanguage bằng getLocales()[0]?.languageTag; nếu null hoặc undefined thì dùng null.
const deviceLanguage = getLocales()[0]?.languageTag ?? null
// CHỨC NĂNG: Giữ thứ tự provider để điều hướng, ngôn ngữ và phiên nghe dùng chung trạng thái.
// Khai báo AppProviders({ children }). Component hàm nhận props và dựng phần giao diện AppProviders. | Khai báo children, kiểu ReactNode.
export function AppProviders({ children }: { children: ReactNode }) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<SafeAreaProvider>`: Dựng SafeAreaProvider.
   * DÒNG `<VisitorProvider`: Dựng VisitorProvider.
   * DÒNG `boot={boot}`: Thuộc tính boot: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `storage={storage}`: Thuộc tính storage: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `catalog={publicCatalog}`: Thuộc tính catalog: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `deviceLanguage={deviceLanguage}`: Thuộc tính deviceLanguage: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `loading={<ActivityIndicator />}`: Thuộc tính loading: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `>`: Dựng VisitorProvider.
   * DÒNG `<AdminProvider service={adminService}><JourneyProvider adapters={journeyAdapters}>`: Dựng AdminProvider. | Thuộc tính service: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính adapters: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `{children}`: Đưa biểu thức JavaScript children vào JSX.
   * DÒNG `</JourneyProvider></AdminProvider>`: Đóng phần giao diện JourneyProvider.
   * DÒNG `</VisitorProvider>`: Đóng phần giao diện VisitorProvider.
   * DÒNG `</SafeAreaProvider>`: Đóng phần giao diện SafeAreaProvider.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <SafeAreaProvider>
      <VisitorProvider
        boot={boot}
        storage={storage}
        catalog={publicCatalog}
        deviceLanguage={deviceLanguage}
        loading={<ActivityIndicator />}
      >
        <AdminProvider service={adminService}><JourneyProvider adapters={journeyAdapters}>
          {children}
        </JourneyProvider></AdminProvider>
      </VisitorProvider>
    </SafeAreaProvider>
  )
}
// TẠI SAO (AppProviders): Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất
// quán và dễ bảo trì.
