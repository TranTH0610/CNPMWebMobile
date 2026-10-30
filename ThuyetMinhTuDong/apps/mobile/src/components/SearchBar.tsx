/**
 * FILE NÀY LÀM GÌ
 * Ô nhập từ khóa tìm kiếm trên mobile; nhận giá trị và callback từ màn hình để không tự giữ kho dữ
 * liệu riêng.
 *
 * VỊ TRÍ: apps/mobile/src/components/SearchBar.tsx
 * DÙNG BỞI: apps/mobile/src/components/index.ts.
 * PHỤ THUỘC: ../styles/explore; ../theme; react-native; @expo/vector-icons; ../i18n/index
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ '../styles/explore'.
import { explore } from '../styles/explore'
// Nhập các thành phần từ '../theme'.
import { colors } from '../theme'
// Nhập các thành phần từ 'react-native'.
import { Pressable, TextInput, View } from 'react-native'
// Nhập các thành phần từ '@expo/vector-icons'.
import { Ionicons } from '@expo/vector-icons'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'

// CHỨC NĂNG: Ô tìm có quay lại, xóa và bộ lọc.
// XỬ LÝ: Không debounce trong component; hook chung chịu trách nhiệm lọc.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function SearchBar({`: Khai báo SearchBar({ value, onChange, onBack, onFocus, onFilter, onSubmit, autoFocus = false, }). Component hàm nhận props và dựng phần giao diện SearchBar.
 * DÒNG `value,`: Nhận đầu vào { value, onChange, onBack, onFocus, onFilter, onSubmit, autoFocus = false, }: { value: string o từ nơi gọi hàm.
 * DÒNG `onChange,`: Nhận đầu vào { value, onChange, onBack, onFocus, onFilter, onSubmit, autoFocus = false, }: { value: string o từ nơi gọi hàm.
 * DÒNG `onBack,`: Nhận đầu vào { value, onChange, onBack, onFocus, onFilter, onSubmit, autoFocus = false, }: { value: string o từ nơi gọi hàm.
 * DÒNG `onFocus,`: Nhận đầu vào { value, onChange, onBack, onFocus, onFilter, onSubmit, autoFocus = false, }: { value: string o từ nơi gọi hàm.
 * DÒNG `onFilter,`: Nhận đầu vào { value, onChange, onBack, onFocus, onFilter, onSubmit, autoFocus = false, }: { value: string o từ nơi gọi hàm.
 * DÒNG `onSubmit,`: Nhận đầu vào { value, onChange, onBack, onFocus, onFilter, onSubmit, autoFocus = false, }: { value: string o từ nơi gọi hàm.
 * DÒNG `autoFocus = false,`: Nhận đầu vào { value, onChange, onBack, onFocus, onFilter, onSubmit, autoFocus = false, }: { value: string o từ nơi gọi hàm.
 * DÒNG `}: {`: Nhận đầu vào { value, onChange, onBack, onFocus, onFilter, onSubmit, autoFocus = false, }: { value: string o từ nơi gọi hàm.
 */
export function SearchBar({
  value,
  onChange,
  onBack,
  onFocus,
  onFilter,
  onSubmit,
  autoFocus = false,
}: {
  // Khai báo value, kiểu string.
  value: string
  // Khai báo onChange, kiểu (value: string) => void.
  onChange: (value: string) => void
  // Khai báo onBack không bắt buộc, kiểu () => void.
  onBack?: () => void
  // Khai báo onFocus không bắt buộc, kiểu () => void.
  onFocus?: () => void
  // Khai báo onFilter không bắt buộc, kiểu () => void.
  onFilter?: () => void
  // Khai báo onSubmit không bắt buộc, kiểu () => void.
  onSubmit?: () => void
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `autoFocus?: boolean`: Khai báo autoFocus không bắt buộc, kiểu boolean.
   * DÒNG `}) {`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  autoFocus?: boolean
}) {
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<View style={explore.row}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{onBack && (`: Đưa biểu thức JavaScript onBack && ( <Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={onBack} style={explo vào JSX.
   * DÒNG `<Pressable`: Dựng Pressable.
   * DÒNG `accessibilityRole="button"`: Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `accessibilityLabel={t('back')}`: Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình.
   * DÒNG `onPress={onBack}`: Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `style={explore.icon}`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `>`: Dựng Pressable.
   * DÒNG `<Ionicons`: Dựng Ionicons.
   * DÒNG `name="chevron-back"`: Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `size={24}`: Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `color={colors.text}`: Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `/>`: Dựng Ionicons.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `<View style={[explore.search, { flex: 1 }]}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flex: giá trị số 1.
   * DÒNG `<Ionicons`: Dựng Ionicons.
   * DÒNG `name="search-outline"`: Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `size={20}`: Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `color={colors.muted}`: Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `/>`: Dựng Ionicons.
   * DÒNG `<TextInput`: Dựng TextInput.
   * DÒNG `style={explore.input}`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `value={value}`: Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
   * DÒNG `onChangeText={onChange}`: Thuộc tính onChangeText: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onFocus={onFocus}`: Thuộc tính onFocus: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `returnKeyType="search"`: Thuộc tính returnKeyType: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onSubmitEditing={onSubmit}`: Thuộc tính onSubmitEditing: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `autoFocus={autoFocus}`: Thuộc tính autoFocus: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `placeholder={t('search')}`: Thuộc tính placeholder: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `placeholderTextColor={colors.muted}`: Thuộc tính placeholderTextColor: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `accessibilityLabel={t('search')}`: Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình.
   * DÒNG `autoCorrect={false}`: Thuộc tính autoCorrect: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `/>`: Dựng TextInput.
   * DÒNG `{!!value && (`: Đưa biểu thức JavaScript !!value && ( <Pressable onPress={() => onChange('')} accessibilityLabel={t('clearSearch')} accessibilityRole=" vào JSX.
   * DÒNG `<Pressable`: Dựng Pressable.
   * DÒNG `onPress={() => onChange('')}`: Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `accessibilityLabel={t('clearSearch')}`: Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình.
   * DÒNG `accessibilityRole="button"`: Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `style={explore.icon}`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `>`: Dựng Pressable.
   * DÒNG `<Ionicons`: Dựng Ionicons.
   * DÒNG `name="close-circle"`: Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `size={18}`: Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `color={colors.muted}`: Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `/>`: Dựng Ionicons.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `{onFilter && (`: Đưa biểu thức JavaScript onFilter && ( <Pressable accessibilityLabel={t('filters')} accessibilityRole="button" onPress={onFilter} style vào JSX.
   * DÒNG `<Pressable`: Dựng Pressable.
   * DÒNG `accessibilityLabel={t('filters')}`: Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình.
   * DÒNG `accessibilityRole="button"`: Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onPress={onFilter}`: Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `style={explore.sort}`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `>`: Dựng Pressable.
   * DÒNG `<Ionicons`: Dựng Ionicons.
   * DÒNG `name="options-outline"`: Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `size={22}`: Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `color={colors.text}`: Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `/>`: Dựng Ionicons.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <View style={explore.row}>
      {onBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('back')}
          onPress={onBack}
          style={explore.icon}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.text}
          />
        </Pressable>
      )}

      <View style={[explore.search, { flex: 1 }]}>
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.muted}
        />

        <TextInput
          style={explore.input}
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
          autoFocus={autoFocus}
          placeholder={t('search')}
          placeholderTextColor={colors.muted}
          accessibilityLabel={t('search')}
          autoCorrect={false}
        />

        {!!value && (
          <Pressable
            onPress={() => onChange('')}
            accessibilityLabel={t('clearSearch')}
            accessibilityRole="button"
            style={explore.icon}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.muted}
            />
          </Pressable>
        )}
      </View>

      {onFilter && (
        <Pressable
          accessibilityLabel={t('filters')}
          accessibilityRole="button"
          onPress={onFilter}
          style={explore.sort}
        >
          <Ionicons
            name="options-outline"
            size={22}
            color={colors.text}
          />
        </Pressable>
      )}
    </View>
  )
}
// TẠI SAO (SearchBar): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
