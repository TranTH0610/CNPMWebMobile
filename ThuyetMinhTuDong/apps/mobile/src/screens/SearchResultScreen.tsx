/**
 * FILE NÀY LÀM GÌ: Màn kết quả tìm kiếm được Stack đăng ký riêng.
 * Vị trí: apps/mobile/src/screens/SearchResultScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { VisitorStack } from '../navigation/types'
import HomeScreen from './HomeScreen'

// CHỨC NĂNG: Dùng danh sách ở chế độ tìm kiếm; URL/route đổi thì đặt lại điều kiện.
export default function SearchResultScreen({ route }: NativeStackScreenProps<VisitorStack, 'Search'>) {
 return <HomeScreen key={JSON.stringify(route.params)} search initial={route.params} />
}
