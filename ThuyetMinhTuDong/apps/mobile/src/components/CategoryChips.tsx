/**
 * FILE NÀY LÀM GÌ
 * Hiển thị các nút danh mục và trạng thái đang chọn; gửi lựa chọn về màn cha để cập nhật bộ lọc.
 *
 * VỊ TRÍ: apps/mobile/src/components/CategoryChips.tsx
 * DÙNG BỞI: apps/mobile/src/components/index.ts.
 * PHỤ THUỘC: ../styles/explore; ../theme; react-native; @travelguide/visitor-core; ../i18n/index
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ '../styles/explore'.
import { explore } from '../styles/explore'
// Nhập các thành phần từ '../theme'.
import { colors, spacing } from '../theme'
// Nhập các thành phần từ 'react-native'.
import { FlatList, Pressable, Text } from 'react-native'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { categoryIcons } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Category } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'

// CHỨC NĂNG: Dãy chip cuộn ngang.
// XỬ LÝ: Chỉ hiện khi có ít nhất hai danh mục, key dùng mã ổn định.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function CategoryChips({`: Khai báo CategoryChips({ categories, selected, onSelect, }). Component hàm nhận props và dựng phần giao diện CategoryChips.
 * DÒNG `categories,`: Nhận đầu vào { categories, selected, onSelect, }: { categories: readonly Category[] selected: readonly Categ từ nơi gọi hàm.
 * DÒNG `selected,`: Nhận đầu vào { categories, selected, onSelect, }: { categories: readonly Category[] selected: readonly Categ từ nơi gọi hàm.
 * DÒNG `onSelect,`: Nhận đầu vào { categories, selected, onSelect, }: { categories: readonly Category[] selected: readonly Categ từ nơi gọi hàm.
 * DÒNG `}: {`: Nhận đầu vào { categories, selected, onSelect, }: { categories: readonly Category[] selected: readonly Categ từ nơi gọi hàm.
 */
export function CategoryChips({
  categories,
  selected,
  onSelect,
}: {
  // Khai báo categories, kiểu readonly Category[].
  categories: readonly Category[]
  // Khai báo selected, kiểu readonly Category[].
  selected: readonly Category[]
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `onSelect: (value: Category[]) => void`: Khai báo onSelect, kiểu (value: Category[]) => void.
   * DÒNG `}) {`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  onSelect: (value: Category[]) => void
}) {
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  // Rẽ nhánh nếu categories.length < 2. | Trả kết quả: sử dụng null làm giá trị của bước hiện tại.
  if (categories.length < 2) return null

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<FlatList`: Dựng FlatList.
   * DÒNG `horizontal`: Thuộc tính horizontal: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `showsHorizontalScrollIndicator={false}`: Thuộc tính showsHorizontalScrollIndicator: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `data={[null, ...categories]}`: Thuộc tính data: cung cấp tập dữ liệu cho thành phần danh sách.
   * DÒNG `contentContainerStyle={{`: Thuộc tính contentContainerStyle: định dạng vùng nội dung cuộn để không khóa chiều cao nội dung.
   * DÒNG `gap: spacing.sm,`: Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `paddingVertical: spacing.md,`: Gán thuộc tính paddingVertical: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `keyExtractor={(item) => item ?? 'all'}`: Thuộc tính keyExtractor: lấy khóa ổn định từ dữ liệu thay vì vị trí mảng.
   * DÒNG `renderItem={({ item }) => {`: Thuộc tính renderItem: quy định cách dựng một phần tử danh sách.
   * DÒNG `const active = item`: Khai báo active: chọn giữa hai giá trị theo điều kiện item.
   * DÒNG `? selected.includes(item)`: Khai báo active: chọn giữa hai giá trị theo điều kiện item.
   * DÒNG `: selected.length === 0`: Khai báo active: chọn giữa hai giá trị theo điều kiện item.
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<Pressable`: Dựng Pressable.
   * DÒNG `accessibilityRole="button"`: Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `accessibilityState={{ selected: active }}`: Thuộc tính accessibilityState: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Gán thuộc tính selected: sử dụng active làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `onPress={() => onSelect(item ? [item] : [])}`: Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `style={[`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `explore.chip,`: Đưa biểu thức JavaScript [ explore.chip, active && { backgroundColor: colors.primary, }, ] vào JSX.
   * DÒNG `active && {`: Đưa biểu thức JavaScript [ explore.chip, active && { backgroundColor: colors.primary, }, ] vào JSX.
   * DÒNG `backgroundColor: colors.primary,`: Gán thuộc tính backgroundColor: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `]}`: Kết thúc danh sách phần tử trong mảng.
   * DÒNG `>`: Dựng Pressable.
   * DÒNG `<Text`: Dựng Text.
   * DÒNG `style={[`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `explore.chipIcon,`: Đưa biểu thức JavaScript [ explore.chipIcon, active && { color: colors.white }, ] vào JSX.
   * DÒNG `active && { color: colors.white },`: Đưa biểu thức JavaScript [ explore.chipIcon, active && { color: colors.white }, ] vào JSX. | Gán thuộc tính color: đọc colors.white từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `]}`: Kết thúc danh sách phần tử trong mảng.
   * DÒNG `>`: Dựng Text.
   * DÒNG `{item ? categoryIcons[item] : '▥'}`: Đưa biểu thức JavaScript item ? categoryIcons[item] : '▥' vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `<Text`: Dựng Text.
   * DÒNG `style={[`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `explore.chipText,`: Đưa biểu thức JavaScript [ explore.chipText, active && { color: colors.white }, ] vào JSX.
   * DÒNG `active && { color: colors.white },`: Đưa biểu thức JavaScript [ explore.chipText, active && { color: colors.white }, ] vào JSX. | Gán thuộc tính color: đọc colors.white từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `]}`: Kết thúc danh sách phần tử trong mảng.
   * DÒNG `>`: Dựng Text.
   * DÒNG `{t(item ? `category_${item}` : 'all')}`: Đưa biểu thức JavaScript t(item ? `category_${item}` : 'all') vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng FlatList.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={[null, ...categories]}
      contentContainerStyle={{
        gap: spacing.sm,
        paddingVertical: spacing.md,
      }}
      keyExtractor={(item) => item ?? 'all'}
      renderItem={({ item }) => {
        const active = item
          ? selected.includes(item)
          : selected.length === 0

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(item ? [item] : [])}
            style={[
              explore.chip,
              active && {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                explore.chipIcon,
                active && { color: colors.white },
              ]}
            >
              {item ? categoryIcons[item] : '▥'}
            </Text>

            <Text
              style={[
                explore.chipText,
                active && { color: colors.white },
              ]}
            >
              {t(item ? `category_${item}` : 'all')}
            </Text>
          </Pressable>
        )
      }}
    />
  )
}
// TẠI SAO (CategoryChips): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao
// diện tại một nơi.
