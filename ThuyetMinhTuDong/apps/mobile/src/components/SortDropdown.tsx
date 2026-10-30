/**
 * FILE NÀY LÀM GÌ
 * Bộ chọn cách sắp xếp mobile; thông báo lựa chọn cho phần lọc/sắp xếp của danh mục.
 *
 * VỊ TRÍ: apps/mobile/src/components/SortDropdown.tsx
 * DÙNG BỞI: apps/mobile/src/components/index.ts.
 * PHỤ THUỘC: ../styles/explore; ../theme; react-native; @expo/vector-icons;
 * @travelguide/visitor-core; ../i18n/index
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ '../styles/explore'.
import { explore } from '../styles/explore'
// Nhập các thành phần từ '../theme'.
import { colors } from '../theme'
// Nhập các thành phần từ 'react-native'.
import { Alert, Pressable, Text } from 'react-native'
// Nhập các thành phần từ '@expo/vector-icons'.
import { Ionicons } from '@expo/vector-icons'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { SortOrder } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'

// CHỨC NĂNG: Chọn cách sắp xếp bằng hộp native.
// XỬ LÝ: Nhãn thể hiện thứ tự thực tế; GPS do màn gọi xử lý.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function SortDropdown({`: Khai báo SortDropdown({ effectiveOrder, onSelect, }). Component hàm nhận props và dựng phần giao diện SortDropdown.
 * DÒNG `effectiveOrder,`: Nhận đầu vào { effectiveOrder, onSelect, }: { effectiveOrder: SortOrder onSelect: (value: SortOrder) => void từ nơi gọi hàm.
 * DÒNG `onSelect,`: Nhận đầu vào { effectiveOrder, onSelect, }: { effectiveOrder: SortOrder onSelect: (value: SortOrder) => void từ nơi gọi hàm.
 * DÒNG `}: {`: Nhận đầu vào { effectiveOrder, onSelect, }: { effectiveOrder: SortOrder onSelect: (value: SortOrder) => void từ nơi gọi hàm.
 */
export function SortDropdown({
  effectiveOrder,
  onSelect,
}: {
  // Khai báo effectiveOrder, kiểu SortOrder.
  effectiveOrder: SortOrder
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `onSelect: (value: SortOrder) => void`: Khai báo onSelect, kiểu (value: SortOrder) => void.
   * DÒNG `}) {`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  onSelect: (value: SortOrder) => void
}) {
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<Pressable`: Dựng Pressable.
   * DÒNG `style={explore.sort}`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `accessibilityRole="button"`: Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `accessibilityLabel={t('sort')}`: Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình.
   * DÒNG `onPress={() => Alert.alert(t('sort'), undefined, [`: Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `text: t('nearest'),`: Gán thuộc tính text: Gọi t('nearest').
   * DÒNG `onPress: () => onSelect('nearest'),`: Gán thuộc tính onPress: khai báo callback () => onSelect('nearest').
   * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `text: t('name'),`: Gán thuộc tính text: Gọi t('name').
   * DÒNG `onPress: () => onSelect('name'),`: Gán thuộc tính onPress: khai báo callback () => onSelect('name').
   * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `text: t('close'),`: Gán thuộc tính text: Gọi t('close').
   * DÒNG `style: 'cancel',`: Gán thuộc tính style: chuỗi 'cancel'.
   * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `])}`: Kết thúc danh sách phần tử trong mảng.
   * DÒNG `>`: Dựng Pressable.
   * DÒNG `<Text style={{ color: colors.text, fontSize: 12 }}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fontSize: giá trị số 12.
   * DÒNG `{t(effectiveOrder)}`: Đưa biểu thức JavaScript t(effectiveOrder) vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `<Ionicons`: Dựng Ionicons.
   * DÒNG `name="chevron-down"`: Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `size={14}`: Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `color={colors.muted}`: Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `/>`: Dựng Ionicons.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <Pressable
      style={explore.sort}
      accessibilityRole="button"
      accessibilityLabel={t('sort')}
      onPress={() => Alert.alert(t('sort'), undefined, [
        {
          text: t('nearest'),
          onPress: () => onSelect('nearest'),
        },
        {
          text: t('name'),
          onPress: () => onSelect('name'),
        },
        {
          text: t('close'),
          style: 'cancel',
        },
      ])}
    >
      <Text style={{ color: colors.text, fontSize: 12 }}>
        {t(effectiveOrder)}
      </Text>
      <Ionicons
        name="chevron-down"
        size={14}
        color={colors.muted}
      />
    </Pressable>
  )
}
// TẠI SAO (SortDropdown): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
