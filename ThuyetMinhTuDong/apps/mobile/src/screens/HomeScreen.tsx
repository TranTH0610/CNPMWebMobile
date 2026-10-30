/**
 * FILE NÀY LÀM GÌ
 * Màn khám phá mobile: ảnh bìa, tìm kiếm, chip danh mục, điểm nổi bật và danh sách điểm tham quan.
 *
 * VỊ TRÍ: apps/mobile/src/screens/HomeScreen.tsx
 * DÙNG BỞI: apps/mobile/src/navigation/MainTabs.tsx;
 * apps/mobile/src/screens/SearchResultScreen.tsx.
 * PHỤ THUỘC: react; react-native; react-native-safe-area-context; @react-navigation/native;
 * @react-navigation/native-stack; @expo/vector-icons; @travelguide/visitor-core;
 * ../hooks/usePlaces; ../i18n/index; ../components/index; ../services/platform;
 * ../navigation/types
 * TẠI SAO TÁCH FILE: Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua lớp
 * dùng chung.
 */
// Nhập các thành phần từ 'react'.
import { useEffect, useMemo, useRef, useState } from 'react'
// Nhập các thành phần từ 'react-native'.
import { Alert, FlatList, Linking, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
// Nhập các thành phần từ 'react-native-safe-area-context'.
import { SafeAreaView } from 'react-native-safe-area-context'
// Nhập các thành phần từ '@react-navigation/native'.
import { useNavigation } from '@react-navigation/native'
// Nhập kiểu dữ liệu từ '@react-navigation/native-stack'.
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
// Nhập các thành phần từ '@expo/vector-icons'.
import { Ionicons } from '@expo/vector-icons'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { categoryOf, HERO_IMAGE, PHOTO_CREDITS } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { Category, PlaceRecord, SortOrder } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../hooks/usePlaces'.
import { useExplore, usePublishedCatalog, useVisitorPosition } from '../hooks/usePlaces'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'
// Nhập các thành phần từ '../components/index'.
import { Action, DemoNotice, State, colors, spacing, CategoryChips, Cover, PlaceCard, SearchBar, SortDropdown, explore } from '../components/index'
// Nhập các thành phần từ '../services/platform'.
import { getPosition } from '../services/platform'
// Nhập kiểu dữ liệu từ '../navigation/types'.
import type { VisitorStack } from '../navigation/types'

// CHỨC NĂNG: Ghép dữ liệu và điều kiện vào danh sách.
// XỬ LÝ: Dùng một FlatList dọc; carousel cuộn ngang bên trong header.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export default function HomeScreen({`: Khai báo HomeScreen({ search = false, initial, }). Component hàm nhận props và dựng phần giao diện HomeScreen.
 * DÒNG `search = false,`: Nhận đầu vào { search = false, initial, }: { search?: boolean initial?: { query?: string category?: Category từ nơi gọi hàm.
 * DÒNG `initial,`: Nhận đầu vào { search = false, initial, }: { search?: boolean initial?: { query?: string category?: Category từ nơi gọi hàm.
 * DÒNG `}: {`: Nhận đầu vào { search = false, initial, }: { search?: boolean initial?: { query?: string category?: Category từ nơi gọi hàm.
 */
export default function HomeScreen({
  search = false,
  initial,
}: {
  // Khai báo search không bắt buộc, kiểu boolean.
  search?: boolean
  // Khai báo initial không bắt buộc, kiểu { query?: string category?: Category }.
  initial?: {
    // Khai báo query không bắt buộc, kiểu string.
    query?: string
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `category?: Category`: Khai báo category không bắt buộc, kiểu Category.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}) {`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    category?: Category
  }
}) {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const navigation =`: Khai báo navigation: useNavigation() lấy bộ điều hướng của nền tảng để chuyển màn theo sự kiện.
   * DÒNG `useNavigation<NativeStackNavigationProp<VisitorStack>>()`: Khai báo navigation: useNavigation() lấy bộ điều hướng của nền tảng để chuyển màn theo sự kiện.
   */
  const navigation =
    useNavigation<NativeStackNavigationProp<VisitorStack>>()

  // Khai báo data: usePublishedCatalog nạp danh mục công bố và trạng thái tải/lỗi dùng bởi giao diện du khách.
  const data = usePublishedCatalog()
  // Khai báo position: Gọi useVisitorPosition(getPosition).
  const position = useVisitorPosition(getPosition)
  // Khai báo filters: Gọi useExplore(data.places, position.origin, initial).
  const filters = useExplore(data.places, position.origin, initial)
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  // Khai báo { width }: Gọi useWindowDimensions().
  const { width } = useWindowDimensions()

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const cardWidth = Math.max(`: Khai báo cardWidth: Gọi Math.max( 240, width - spacing.lg * 2 - spacing.sm, ).
   * DÒNG `240,`: Khai báo cardWidth: Gọi Math.max( 240, width - spacing.lg * 2 - spacing.sm, ).
   * DÒNG `width - spacing.lg * 2 - spacing.sm,`: Khai báo cardWidth: Gọi Math.max( 240, width - spacing.lg * 2 - spacing.sm, ).
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  const cardWidth = Math.max(
    240,
    width - spacing.lg * 2 - spacing.sm,
  )

  // Khai báo [slide, setSlide]: useState(0) giữ trạng thái qua các lần render.
  const [slide, setSlide] = useState(0)
  // CHỨC NĂNG: Đánh dấu ô tìm kiếm còn trống khi gửi để hiển thị gợi ý nhập.
  // Khai báo [searchRequired, setSearchRequired]: useState(false) giữ trạng thái qua các lần render.
  const [searchRequired, setSearchRequired] = useState(false)
  // Khai báo [draftQuery, setDraftQuery]: useState(initial?.query ?? '') giữ trạng thái qua các lần render.
  const [draftQuery, setDraftQuery] = useState(initial?.query ?? '')
  // Khai báo query: chọn giữa hai giá trị theo điều kiện search.
  const query = search ? filters.query : draftQuery
  // Khai báo list: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const list = useRef<FlatList>(null)
  // Khai báo featuredList: useRef giữ tham chiếu qua render mà thay đổi current không tự yêu cầu render lại.
  const featuredList = useRef<FlatList<PlaceRecord>>(null)

  // CHỨC NĂNG: Tính lại địa điểm nổi bật khi dữ liệu hoặc danh mục chọn thay đổi.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const featured = useMemo(() => data.places.filter(`: Khai báo featured: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `(place) => place.featured && (!filters.categories.length || filters.categories.includ`: Khai báo featured: useMemo lưu kết quả theo mảng phụ thuộc.
   * DÒNG `), [data.places, filters.categories])`: Khai báo featured: useMemo lưu kết quả theo mảng phụ thuộc.
   */
  const featured = useMemo(() => data.places.filter(
    (place) => place.featured && (!filters.categories.length || filters.categories.includes(categoryOf(place))),
  ), [data.places, filters.categories])

  // CHỨC NĂNG: Đổi danh mục hoặc xoay màn hình thì về thẻ đầu, tránh chấm nằm ngoài danh sách mới.
  // XỬ LÝ: Ref chỉ cuộn khi carousel có dữ liệu và đang được gắn vào màn.
  // DÒNG NÀY LÀM GÌ: Đưa chỉ số carousel về 0; nếu có thẻ thì cuộn danh sách về đầu.
  // CÁCH HOẠT ĐỘNG: featured hoặc cardWidth đổi sẽ làm effect đặt lại vị trí, không dùng animation
  // khi reset.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: featured,
  // cardWidth.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    // Cập nhật trạng thái qua setSlide(0).
    setSlide(0)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (featured.length) featuredList.current?.scrollToOffset({ offset: 0, animated: fals`: Rẽ nhánh nếu featured.length. | Thực hiện Gọi featuredList.current?.scrollToOffset({ offset: 0, animated: false }). | Gán thuộc tính offset: giá trị số 0. | Gán thuộc tính animated: sử dụng false làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `}, [featured, cardWidth])`: Đăng ký useEffect để thực hiện tác vụ sau render.
     */
    if (featured.length) featuredList.current?.scrollToOffset({ offset: 0, animated: false })
  }, [featured, cardWidth])
  // TẠI SAO: Đổi danh mục hoặc kích thước thẻ có thể làm chỉ số slide cũ không còn đúng với dữ
  // liệu mới.

  // CHỨC NĂNG: Đổi thứ tự và xin vị trí khi người dùng yêu cầu.
  // XỬ LÝ: Chọn theo tên không xin quyền GPS.
  // Khai báo onSort: khai báo callback (order: SortOrder) => { filters.setOrder(order) if (order === 'nearest' &&.
  const onSort = (order: SortOrder) => {
    // Thực hiện Gọi filters.setOrder(order).
    filters.setOrder(order)

    // Rẽ nhánh nếu order === 'nearest' && !position.origin.
    if (order === 'nearest' && !position.origin) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `void position.request()`: Thực hiện sử dụng void position.request() làm giá trị của bước hiện tại.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      void position.request()
    }
  }
  // TẠI SAO (onSort): Tách request giúp các nơi gọi dùng cùng địa chỉ, định dạng và cách xử lý
  // lỗi.

  // CHỨC NĂNG: Đồng nhất web: gửi rỗng báo lỗi, gửi có chữ mở kết quả cùng danh mục.
  // XỬ LÝ: Không chuyển màn ngay lúc chạm ô nhập; trim loại từ khóa chỉ có khoảng trắng.
  // Khai báo openSearch: khai báo callback () => { if (!query.trim()) { setSearchRequired(true).
  const openSearch = () => {
    // Rẽ nhánh nếu !query.trim(). | Cập nhật trạng thái qua setSearchRequired(true). | Thoát hàm hiện tại ngay.
    if (!query.trim()) { setSearchRequired(true); return }
    // Cập nhật trạng thái qua setSearchRequired(false).
    setSearchRequired(false)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (!search) navigation.navigate('Search', { query: query.trim(), category: filters.c`: Rẽ nhánh nếu !search. | Thực hiện Gọi navigation.navigate('Search', { query: query.trim(), category: filters.categories[0] }). | Gán thuộc tính query: query.trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính category: đọc filters.categories[0] từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    if (!search) navigation.navigate('Search', { query: query.trim(), category: filters.categories[0] })
  }
  // TẠI SAO (openSearch): Chặn từ khóa chỉ có khoảng trắng trước khi chuyển route để người dùng
  // biết cần nhập gì và giữ được điều kiện tìm hợp lệ.
  // Khai báo changeQuery: khai báo callback (value: string) => { if (search) filters.setQuery(value) else setDraftQuery.
  const changeQuery = (value: string) => {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (search) filters.setQuery(value)`: Rẽ nhánh nếu search. | Thực hiện Gọi filters.setQuery(value).
     * DÒNG `else setDraftQuery(value)`: Rẽ nhánh nếu search. | Cập nhật trạng thái qua setDraftQuery(value).
     */
    if (search) filters.setQuery(value)
    else setDraftQuery(value)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (value.trim()) setSearchRequired(false)`: Rẽ nhánh nếu value.trim(). | Cập nhật trạng thái qua setSearchRequired(false).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    if (value.trim()) setSearchRequired(false)
  }
  // TẠI SAO (changeQuery): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi qua
  // lớp dùng chung.
  // Khai báo changeCategories: khai báo callback (value: Category[]) => { filters.setCategories(value) setSlide(0) }.
  const changeCategories = (value: Category[]) => {
    // Thực hiện Gọi filters.setCategories(value).
    filters.setCategories(value)
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `setSlide(0)`: Cập nhật trạng thái qua setSlide(0).
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    setSlide(0)
  }
  // TẠI SAO (changeCategories): Một màn/trang ghép UI và hook, còn dữ liệu và nghiệp vụ được gọi
  // qua lớp dùng chung.


  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<SafeAreaView`: Dựng SafeAreaView.
   * DÒNG `style={explore.page}`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `edges={['top', 'left', 'right']}`: Thuộc tính edges: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `>`: Dựng SafeAreaView.
   * DÒNG `<FlatList`: Dựng FlatList.
   * DÒNG `ref={list}`: Thuộc tính ref: giữ tham chiếu đến phần tử/đối tượng để focus hoặc đo kích thước.
   * DÒNG `data={data.error ? [] : filters.results}`: Thuộc tính data: cung cấp tập dữ liệu cho thành phần danh sách.
   * DÒNG `keyExtractor={(item) => item.id}`: Thuộc tính keyExtractor: lấy khóa ổn định từ dữ liệu thay vì vị trí mảng.
   * DÒNG `contentContainerStyle={{`: Thuộc tính contentContainerStyle: định dạng vùng nội dung cuộn để không khóa chiều cao nội dung.
   * DÒNG `paddingBottom: spacing.xl,`: Gán thuộc tính paddingBottom: đọc spacing.xl từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `keyboardShouldPersistTaps="handled"`: Thuộc tính keyboardShouldPersistTaps: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `refreshing={data.loading && data.places.length > 0}`: Thuộc tính refreshing: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onRefresh={() => {`: Thuộc tính onRefresh: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `void data.reload()`: Thực hiện sử dụng void data.reload() làm giá trị của bước hiện tại.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `renderItem={({ item }) => (`: Thuộc tính renderItem: quy định cách dựng một phần tử danh sách.
   * DÒNG `<View style={{ paddingHorizontal: spacing.lg }}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính paddingHorizontal: đọc spacing.lg từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `<PlaceCard`: Dựng PlaceCard.
   * DÒNG `place={item}`: Thuộc tính place: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `origin={position.origin}`: Thuộc tính origin: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onOpen={() => navigation.navigate('Detail', {`: Thuộc tính onOpen: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `placeId: item.id,`: Gán thuộc tính placeId: đọc item.id từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `})}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng PlaceCard.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `ListHeaderComponent={`: Thuộc tính ListHeaderComponent: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<View>`: Dựng View.
   * DÒNG `{!search ? (`: Đưa biểu thức JavaScript !search ? ( <View style={{ minHeight: 285, justifyContent: 'flex-end', }} > <Cover uri={HERO_IMAGE} style={Sty vào JSX.
   * DÒNG `<View`: Dựng View.
   * DÒNG `style={{`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `minHeight: 285,`: Gán thuộc tính minHeight: giá trị số 285.
   * DÒNG `justifyContent: 'flex-end',`: Gán thuộc tính justifyContent: chuỗi 'flex-end'.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `>`: Dựng View.
   * DÒNG `<Cover`: Dựng Cover.
   * DÒNG `uri={HERO_IMAGE}`: Truyền địa chỉ tài nguyên vào component.
   * DÒNG `style={StyleSheet.absoluteFill}`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `/>`: Dựng Cover.
   * DÒNG `<View`: Dựng View.
   * DÒNG `style={{`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `padding: spacing.lg,`: Gán thuộc tính padding: đọc spacing.lg từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `gap: spacing.sm,`: Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `backgroundColor: colors.overlay,`: Gán thuộc tính backgroundColor: đọc colors.overlay từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `>`: Dựng View.
   * DÒNG `<View`: Dựng View.
   * DÒNG `style={{`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `flexDirection: 'row',`: Gán thuộc tính flexDirection: chuỗi 'row'.
   * DÒNG `justifyContent: 'flex-end',`: Gán thuộc tính justifyContent: chuỗi 'flex-end'.
   * DÒNG `marginBottom: spacing.xl,`: Gán thuộc tính marginBottom: đọc spacing.xl từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `>`: Dựng View.
   * DÒNG `<View accessibilityLabel={t('notification')}>`: Dựng View. | Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình.
   * DÒNG `<Ionicons`: Dựng Ionicons.
   * DÒNG `name="notifications-outline"`: Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `size={24}`: Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `color={colors.white}`: Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `/>`: Dựng Ionicons.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `<Text style={{ color: colors.white, fontSize: 17 }}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính color: đọc colors.white từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fontSize: giá trị số 17.
   * DÒNG `{t('explore')}`: Đưa biểu thức JavaScript t('explore') vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `<Text`: Dựng Text.
   * DÒNG `style={{`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `color: colors.white,`: Gán thuộc tính color: đọc colors.white từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `fontSize: 30,`: Gán thuộc tính fontSize: giá trị số 30.
   * DÒNG `fontWeight: '700',`: Gán thuộc tính fontWeight: chuỗi '700'.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `>`: Dựng Text.
   * DÒNG `{t('site')}`: Đưa biểu thức JavaScript t('site') vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `<Text`: Dựng Text.
   * DÒNG `style={{`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `color: colors.white,`: Gán thuộc tính color: đọc colors.white từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `lineHeight: 20,`: Gán thuộc tính lineHeight: giá trị số 20.
   * DÒNG `fontSize: 13,`: Gán thuộc tính fontSize: giá trị số 13.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `>`: Dựng Text.
   * DÒNG `{t('heroSubtitle')}`: Đưa biểu thức JavaScript t('heroSubtitle') vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `<SearchBar`: Dựng SearchBar.
   * DÒNG `value={query}`: Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
   * DÒNG `onChange={changeQuery}`: Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
   * DÒNG `onSubmit={openSearch}`: Thuộc tính onSubmit: xử lý gửi form.
   * DÒNG `/>`: Dựng SearchBar.
   * DÒNG `<Action title={t('searchButton')} icon="search-outline" variant="primary" onPress={op`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính icon: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính variant: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `{searchRequired && <Text accessibilityRole="alert" style={{ color: colors.text, backg`: Đưa biểu thức JavaScript searchRequired && <Text accessibilityRole="alert" style={{ color: colors.text, backgroundColor: colors.backgro vào JSX. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính color: đọc colors.text từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính backgroundColor: đọc colors.background từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính padding: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderRadius: giá trị số 8.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `) : (`: Đưa biểu thức JavaScript !search ? ( <View style={{ minHeight: 285, justifyContent: 'flex-end', }} > <Cover uri={HERO_IMAGE} style={Sty vào JSX.
   * DÒNG `<View style={explore.body}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<SearchBar`: Dựng SearchBar.
   * DÒNG `value={query}`: Thuộc tính value: điều khiển giá trị hiển thị từ trạng thái.
   * DÒNG `onChange={changeQuery}`: Thuộc tính onChange: đồng bộ giá trị người dùng nhập vào trạng thái.
   * DÒNG `onSubmit={openSearch}`: Thuộc tính onSubmit: xử lý gửi form.
   * DÒNG `autoFocus`: Thuộc tính autoFocus: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onBack={() => navigation.goBack()}`: Thuộc tính onBack: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onFilter={() => Alert.alert(`: Thuộc tính onFilter: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `t('sort'),`: Đưa biểu thức JavaScript () => Alert.alert( t('sort'), undefined, [ { text: t('nearest'), onPress: () => onSort('nearest'), }, { text:  vào JSX.
   * DÒNG `undefined,`: Đưa biểu thức JavaScript () => Alert.alert( t('sort'), undefined, [ { text: t('nearest'), onPress: () => onSort('nearest'), }, { text:  vào JSX.
   * DÒNG `[`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `text: t('nearest'),`: Gán thuộc tính text: Gọi t('nearest').
   * DÒNG `onPress: () => onSort('nearest'),`: Gán thuộc tính onPress: khai báo callback () => onSort('nearest').
   * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `text: t('name'),`: Gán thuộc tính text: Gọi t('name').
   * DÒNG `onPress: () => onSort('name'),`: Gán thuộc tính onPress: khai báo callback () => onSort('name').
   * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `text: t('close'),`: Gán thuộc tính text: Gọi t('close').
   * DÒNG `style: 'cancel',`: Gán thuộc tính style: chuỗi 'cancel'.
   * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `],`: Kết thúc danh sách phần tử trong mảng.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `/>`: Dựng SearchBar.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `<View style={explore.body}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{search && searchRequired && <Text accessibilityRole="alert" style={explore.muted}>{t`: Đưa biểu thức JavaScript search && searchRequired && <Text accessibilityRole="alert" style={explore.muted}>{t('searchRequired')}</Text> vào JSX. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<CategoryChips`: Dựng CategoryChips.
   * DÒNG `categories={filters.availableCategories}`: Thuộc tính categories: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `selected={filters.categories}`: Thuộc tính selected: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onSelect={changeCategories}`: Thuộc tính onSelect: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `/>`: Dựng CategoryChips.
   * DÒNG `<View style={{ gap: spacing.sm, marginBottom: spacing.md }}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính marginBottom: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `<Text style={explore.cardTitle}>{t('region')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flexDirection: chuỗi 'row'. | Gán thuộc tính flexWrap: chuỗi 'wrap'. | Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `{filters.availableZones.map(zone => (`: Đưa biểu thức JavaScript filters.availableZones.map(zone => ( <Action key={zone} title={t(zone === 'fortifications' ? 'zone_fortificati vào JSX.
   * DÒNG `<Action key={zone}`: Dựng Action. | Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
   * DÒNG `title={t(zone === 'fortifications' ? 'zone_fortifications' : 'zone_ceremonial')}`: Truyền tiêu đề cho thành phần nhận thuộc tính này.
   * DÒNG `selected={filters.zones.includes(zone)}`: Thuộc tính selected: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onPress={() => filters.setZones(filters.zones.includes(zone)`: Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `? filters.zones.filter(item => item !== zone) : [...filters.zones, zone])} />`: Đưa biểu thức JavaScript () => filters.setZones(filters.zones.includes(zone) ? filters.zones.filter(item => item !== zone) : [...filter vào JSX.
   * DÒNG `))}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `<Action title={t('clearAll')} variant="ghost" onPress={() => {`: Dựng Action. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính variant: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `filters.reset(); setDraftQuery(''); setSearchRequired(false); setSlide(0)`: Thực hiện Gọi filters.reset(). | Cập nhật trạng thái qua setDraftQuery(''). | Cập nhật trạng thái qua setSearchRequired(false). | Cập nhật trạng thái qua setSlide(0).
   * DÒNG `}} />`: Đưa biểu thức JavaScript () => { filters.reset().
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `{!search && (`: Đưa biểu thức JavaScript !search && ( <> <View style={[ explore.row, { marginBottom: spacing.md }, ]} > <Text style={explore.title}> {t vào JSX.
   * DÒNG `<>`: Đưa biểu thức JavaScript !search && ( <> <View style={[ explore.row, { marginBottom: spacing.md }, ]} > <Text style={explore.title}> {t vào JSX.
   * DÒNG `<View`: Dựng View.
   * DÒNG `style={[`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `explore.row,`: Đưa biểu thức JavaScript [ explore.row, { marginBottom: spacing.md }, ] vào JSX.
   * DÒNG `{ marginBottom: spacing.md },`: Đưa biểu thức JavaScript [ explore.row, { marginBottom: spacing.md }, ] vào JSX. | Gán thuộc tính marginBottom: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `]}`: Kết thúc danh sách phần tử trong mảng.
   * DÒNG `>`: Dựng View.
   * DÒNG `<Text style={explore.title}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{t('featured')}`: Đưa biểu thức JavaScript t('featured') vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `<Pressable`: Dựng Pressable.
   * DÒNG `accessibilityRole="button"`: Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onPress={() => navigation.navigate('Search', {})}`: Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `>`: Dựng Pressable.
   * DÒNG `<Text style={{ color: colors.primary }}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính color: đọc colors.primary từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `{t('viewAll')} ›`: Đưa biểu thức JavaScript t('viewAll') vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `{data.loading && !data.places.length ? <State message="loading" busy />`: Đưa biểu thức JavaScript data.loading && !data.places.length ? <State message="loading" busy /> : data.error ? <State message="loadErro vào JSX. | Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính busy: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `: data.error ? <State message="loadError" retry={() => { void data.reload() }} />`: Đưa biểu thức JavaScript data.loading && !data.places.length ? <State message="loading" busy /> : data.error ? <State message="loadErro vào JSX. | Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính retry: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thực hiện sử dụng void data.reload() làm giá trị của bước hiện tại.
   * DÒNG `: !featured.length ? (`: Đưa biểu thức JavaScript data.loading && !data.places.length ? <State message="loading" busy /> : data.error ? <State message="loadErro vào JSX.
   * DÒNG `<View style={{ padding: spacing.md, gap: spacing.sm, backgroundColor: colors.page, bo`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính padding: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính backgroundColor: đọc colors.page từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính borderRadius: giá trị số 12. | Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Text style={explore.cardTitle}>{t('featuredEmpty')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={explore.muted}>{t('featuredEmptyHint')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{!!filters.categories.length && <Action title={t('clearAll')} onPress={() => changeCa`: Đưa biểu thức JavaScript !!filters.categories.length && <Action title={t('clearAll')} onPress={() => changeCategories([])} /> vào JSX. | Truyền tiêu đề cho thành phần nhận thuộc tính này. | Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `) : <>`: Đưa biểu thức JavaScript data.loading && !data.places.length ? <State message="loading" busy /> : data.error ? <State message="loadErro vào JSX.
   * DÒNG `<FlatList`: Dựng FlatList.
   * DÒNG `ref={featuredList}`: Thuộc tính ref: giữ tham chiếu đến phần tử/đối tượng để focus hoặc đo kích thước.
   * DÒNG `horizontal`: Thuộc tính horizontal: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `data={featured}`: Thuộc tính data: cung cấp tập dữ liệu cho thành phần danh sách.
   * DÒNG `keyExtractor={(item) => item.id}`: Thuộc tính keyExtractor: lấy khóa ổn định từ dữ liệu thay vì vị trí mảng.
   * DÒNG `showsHorizontalScrollIndicator={false}`: Thuộc tính showsHorizontalScrollIndicator: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `snapToInterval={cardWidth + spacing.sm}`: Thuộc tính snapToInterval: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `decelerationRate="fast"`: Thuộc tính decelerationRate: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `contentContainerStyle={{`: Thuộc tính contentContainerStyle: định dạng vùng nội dung cuộn để không khóa chiều cao nội dung.
   * DÒNG `gap: spacing.sm,`: Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `onMomentumScrollEnd={(event) => setSlide(`: Thuộc tính onMomentumScrollEnd: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `Math.round(`: Đưa biểu thức JavaScript (event) => setSlide( Math.round( event.nativeEvent.contentOffset.x / (cardWidth + spacing.sm), ), ) vào JSX.
   * DÒNG `event.nativeEvent.contentOffset.x`: Đưa biểu thức JavaScript (event) => setSlide( Math.round( event.nativeEvent.contentOffset.x / (cardWidth + spacing.sm), ), ) vào JSX.
   * DÒNG `/ (cardWidth + spacing.sm),`: Đưa biểu thức JavaScript (event) => setSlide( Math.round( event.nativeEvent.contentOffset.x / (cardWidth + spacing.sm), ), ) vào JSX.
   * DÒNG `),`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `renderItem={({ item }) => (`: Thuộc tính renderItem: quy định cách dựng một phần tử danh sách.
   * DÒNG `<PlaceCard`: Dựng PlaceCard.
   * DÒNG `place={item}`: Thuộc tính place: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `featured`: Thuộc tính featured: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `width={cardWidth}`: Thuộc tính width: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onOpen={() => navigation.navigate('Detail', {`: Thuộc tính onOpen: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `placeId: item.id,`: Gán thuộc tính placeId: đọc item.id từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `})}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng PlaceCard.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `/>`: Dựng FlatList.
   * DÒNG `{featured.length > 1 && <View`: Đưa biểu thức JavaScript featured.length > 1 && <View style={[ explore.row, { justifyContent: 'center', padding: spacing.md, }, ]} > {f vào JSX.
   * DÒNG `style={[`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `explore.row,`: Đưa biểu thức JavaScript [ explore.row, { justifyContent: 'center', padding: spacing.md, }, ] vào JSX.
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `justifyContent: 'center',`: Gán thuộc tính justifyContent: chuỗi 'center'.
   * DÒNG `padding: spacing.md,`: Gán thuộc tính padding: đọc spacing.md từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `]}`: Kết thúc danh sách phần tử trong mảng.
   * DÒNG `>`: Dựng View.
   * DÒNG `{featured.map((place, index) => (`: Đưa biểu thức JavaScript featured.map((place, index) => ( <View key={place.id} style={{ width: 6, height: 6, borderRadius: 3, backgroun vào JSX.
   * DÒNG `<View`: Dựng View.
   * DÒNG `key={place.id}`: Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
   * DÒNG `style={{`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `width: 6,`: Gán thuộc tính width: giá trị số 6.
   * DÒNG `height: 6,`: Gán thuộc tính height: giá trị số 6.
   * DÒNG `borderRadius: 3,`: Gán thuộc tính borderRadius: giá trị số 3.
   * DÒNG `backgroundColor:`: Gán thuộc tính backgroundColor: chọn giữa hai giá trị theo điều kiện index === slide.
   * DÒNG `index === slide`: Gán thuộc tính backgroundColor: chọn giữa hai giá trị theo điều kiện index === slide.
   * DÒNG `? colors.primary`: Gán thuộc tính backgroundColor: chọn giữa hai giá trị theo điều kiện index === slide.
   * DÒNG `: colors.border,`: Gán thuộc tính backgroundColor: chọn giữa hai giá trị theo điều kiện index === slide.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng View.
   * DÒNG `))}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</View>}`: Đóng phần giao diện View.
   * DÒNG `</>}`: Đưa biểu thức JavaScript data.loading && !data.places.length ? <State message="loading" busy /> : data.error ? <State message="loadErro vào JSX.
   * DÒNG `</>`: Đưa biểu thức JavaScript !search && ( <> <View style={[ explore.row, { marginBottom: spacing.md }, ]} > <Text style={explore.title}> {t vào JSX.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `<View style={explore.row}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={[explore.title, { minWidth: 0 }]}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính minWidth: giá trị số 0.
   * DÒNG `{t(search ? 'results' : 'allPlaces')}`: Đưa biểu thức JavaScript t(search ? 'results' : 'allPlaces') vào JSX.
   * DÒNG `{' '}({filters.results.length})`: Đưa biểu thức JavaScript ' ' vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `<SortDropdown`: Dựng SortDropdown.
   * DÒNG `effectiveOrder={filters.effectiveOrder}`: Thuộc tính effectiveOrder: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onSelect={onSort}`: Thuộc tính onSelect: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `/>`: Dựng SortDropdown.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `{filters.order === 'nearest'`: Đưa biểu thức JavaScript filters.order === 'nearest' && filters.effectiveOrder === 'name' && ( <Text style={explore.muted}> {t('orderFa vào JSX.
   * DÒNG `&& filters.effectiveOrder === 'name' && (`: Đưa biểu thức JavaScript filters.order === 'nearest' && filters.effectiveOrder === 'name' && ( <Text style={explore.muted}> {t('orderFa vào JSX.
   * DÒNG `<Text style={explore.muted}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{t('orderFallback')}`: Đưa biểu thức JavaScript t('orderFallback') vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `{position.failed && (`: Đưa biểu thức JavaScript position.failed && ( <Text style={explore.muted}> {t('locationDenied')} </Text> ) vào JSX.
   * DÒNG `<Text style={explore.muted}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{t('locationDenied')}`: Đưa biểu thức JavaScript t('locationDenied') vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `ListEmptyComponent={`: Thuộc tính ListEmptyComponent: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `data.loading ? (`: Đưa biểu thức JavaScript data.loading ? ( <State message="loading" busy /> ) : data.error ? ( <State message="loadError" retry={() => { vào JSX.
   * DÒNG `<State message="loading" busy />`: Dựng State. | Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính busy: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `) : data.error ? (`: Đưa biểu thức JavaScript data.loading ? ( <State message="loading" busy /> ) : data.error ? ( <State message="loadError" retry={() => { vào JSX.
   * DÒNG `<State`: Dựng State.
   * DÒNG `message="loadError"`: Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `retry={() => {`: Thuộc tính retry: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `void data.reload()`: Thực hiện sử dụng void data.reload() làm giá trị của bước hiện tại.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng State.
   * DÒNG `) : (`: Đưa biểu thức JavaScript data.loading ? ( <State message="loading" busy /> ) : data.error ? ( <State message="loadError" retry={() => { vào JSX.
   * DÒNG `<View style={explore.body}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<State message="empty" />`: Dựng State. | Thuộc tính message: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<Text style={explore.muted}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{t('emptyHint')}`: Đưa biểu thức JavaScript t('emptyHint') vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `<Action`: Dựng Action.
   * DÒNG `title={t('clearAll')}`: Truyền tiêu đề cho thành phần nhận thuộc tính này.
   * DÒNG `onPress={filters.reset}`: Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `/>`: Dựng Action.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `ListFooterComponent={`: Thuộc tính ListFooterComponent: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `<View style={explore.body}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<DemoNotice />`: Dựng DemoNotice.
   * DÒNG `<Text style={explore.muted}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{t('photoCredits')}`: Đưa biểu thức JavaScript t('photoCredits') vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `{PHOTO_CREDITS.map((credit) => (`: Đưa biểu thức JavaScript PHOTO_CREDITS.map((credit) => ( <Pressable key={credit.url} accessibilityRole="link" onPress={() => { void Lin vào JSX.
   * DÒNG `<Pressable`: Dựng Pressable.
   * DÒNG `key={credit.url}`: Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
   * DÒNG `accessibilityRole="link"`: Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onPress={() => {`: Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `void Linking.openURL(credit.url)`: Thực hiện sử dụng void Linking.openURL(credit.url) làm giá trị của bước hiện tại.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `>`: Dựng Pressable.
   * DÒNG `<Text style={explore.muted}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{credit.title} · {credit.license}`: Đưa biểu thức JavaScript credit.title vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `))}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng FlatList.
   * DÒNG `</SafeAreaView>`: Đóng phần giao diện SafeAreaView.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <SafeAreaView
      style={explore.page}
      edges={['top', 'left', 'right']}
    >
      <FlatList
        ref={list}
        data={data.error ? [] : filters.results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: spacing.xl,
        }}
        keyboardShouldPersistTaps="handled"
        refreshing={data.loading && data.places.length > 0}
        onRefresh={() => {
          void data.reload()
        }}

        // CHỨC NĂNG: Dựng từng card khi cần.
        // XỬ LÝ: key theo ID ổn định, không dùng index.
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: spacing.lg }}>
            <PlaceCard
              place={item}
              origin={position.origin}
              onOpen={() => navigation.navigate('Detail', {
                placeId: item.id,
              })}
            />
          </View>
        )}

        ListHeaderComponent={
          <View>
            {!search ? (
              <View
                style={{
                  minHeight: 285,
                  justifyContent: 'flex-end',
                }}
              >
                <Cover
                  uri={HERO_IMAGE}
                  style={StyleSheet.absoluteFill}
                />

                <View
                  style={{
                    padding: spacing.lg,
                    gap: spacing.sm,
                    backgroundColor: colors.overlay,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      marginBottom: spacing.xl,
                    }}
                  >


                    <View accessibilityLabel={t('notification')}>
                      <Ionicons
                        name="notifications-outline"
                        size={24}
                        color={colors.white}
                      />
                    </View>
                  </View>

                  <Text style={{ color: colors.white, fontSize: 17 }}>
                    {t('explore')}
                  </Text>

                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 30,
                      fontWeight: '700',
                    }}
                  >
                    {t('site')}
                  </Text>

                  <Text
                    style={{
                      color: colors.white,
                      lineHeight: 20,
                      fontSize: 13,
                    }}
                  >
                    {t('heroSubtitle')}
                  </Text>

                  <SearchBar
                    value={query}
                    onChange={changeQuery}
                    onSubmit={openSearch}
                  />
                  <Action title={t('searchButton')} icon="search-outline" variant="primary" onPress={openSearch} />
                  {searchRequired && <Text accessibilityRole="alert" style={{ color: colors.text, backgroundColor: colors.background, padding: spacing.sm, borderRadius: 8 }}>{t('searchRequired')}</Text>}
                </View>
              </View>
            ) : (
              <View style={explore.body}>
                <SearchBar
                  value={query}
                  onChange={changeQuery}
                  onSubmit={openSearch}
                  autoFocus
                  onBack={() => navigation.goBack()}
                  onFilter={() => Alert.alert(
                    t('sort'),
                    undefined,
                    [
                      {
                        text: t('nearest'),
                        onPress: () => onSort('nearest'),
                      },
                      {
                        text: t('name'),
                        onPress: () => onSort('name'),
                      },
                      {
                        text: t('close'),
                        style: 'cancel',
                      },
                    ],
                  )}
                />
              </View>
            )}

            <View style={explore.body}>
              {search && searchRequired && <Text accessibilityRole="alert" style={explore.muted}>{t('searchRequired')}</Text>}
              <CategoryChips
                categories={filters.availableCategories}
                selected={filters.categories}
                onSelect={changeCategories}
              />

              {/* CHỨC NĂNG: Mobile có cùng lọc khu vực và xóa lọc như sidebar web.
                  XỬ LÝ: Bấm đổi điều kiện ngay; không đợi nút tìm kiếm. */}
              <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
                <Text style={explore.cardTitle}>{t('region')}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  {filters.availableZones.map(zone => (
                    <Action key={zone}
                      title={t(zone === 'fortifications' ? 'zone_fortifications' : 'zone_ceremonial')}
                      selected={filters.zones.includes(zone)}
                      onPress={() => filters.setZones(filters.zones.includes(zone)
                        ? filters.zones.filter(item => item !== zone) : [...filters.zones, zone])} />
                  ))}
                  <Action title={t('clearAll')} variant="ghost" onPress={() => {
                    filters.reset(); setDraftQuery(''); setSearchRequired(false); setSlide(0)
                  }} />
                </View>
              </View>

              {!search && (
                <>
                  <View
                    style={[
                      explore.row,
                      { marginBottom: spacing.md },
                    ]}
                  >
                    <Text style={explore.title}>
                      {t('featured')}
                    </Text>

                    <Pressable
                      accessibilityRole="button"
                      onPress={() => navigation.navigate('Search', {})}
                    >
                      <Text style={{ color: colors.primary }}>
                        {t('viewAll')} ›
                      </Text>
                    </Pressable>
                  </View>

                  {data.loading && !data.places.length ? <State message="loading" busy />
                    : data.error ? <State message="loadError" retry={() => { void data.reload() }} />
                    : !featured.length ? (
                      // CHỨC NĂNG: Cùng empty state với web khi không có điểm nổi bật phù hợp.
                      <View style={{ padding: spacing.md, gap: spacing.sm, backgroundColor: colors.page, borderRadius: 12 }} accessibilityRole="summary">
                        <Text style={explore.cardTitle}>{t('featuredEmpty')}</Text>
                        <Text style={explore.muted}>{t('featuredEmptyHint')}</Text>
                        {!!filters.categories.length && <Action title={t('clearAll')} onPress={() => changeCategories([])} />}
                      </View>
                    ) : <>
                  {/* CHỨC NĂNG: Carousel ngang có snap.
                      XỬ LÝ: Chiều rộng card theo màn hình;
                      tính chấm hiện tại từ độ cuộn khi dừng. */}
                  <FlatList
                    ref={featuredList}
                    horizontal
                    data={featured}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={cardWidth + spacing.sm}
                    decelerationRate="fast"
                    contentContainerStyle={{
                      gap: spacing.sm,
                    }}
                    onMomentumScrollEnd={(event) => setSlide(
                      Math.round(
                        event.nativeEvent.contentOffset.x
                        / (cardWidth + spacing.sm),
                      ),
                    )}
                    renderItem={({ item }) => (
                      <PlaceCard
                        place={item}
                        featured
                        width={cardWidth}
                        onOpen={() => navigation.navigate('Detail', {
                          placeId: item.id,
                        })}
                      />
                    )}
                  />

                  {featured.length > 1 && <View
                    style={[
                      explore.row,
                      {
                        justifyContent: 'center',
                        padding: spacing.md,
                      },
                    ]}
                  >
                    {featured.map((place, index) => (
                      <View
                        key={place.id}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor:
                            index === slide
                              ? colors.primary
                              : colors.border,
                        }}
                      />
                    ))}
                  </View>}
                    </>}

                </>
              )}

              <View style={explore.row}>
                <Text style={[explore.title, { minWidth: 0 }]}>
                  {t(search ? 'results' : 'allPlaces')}
                  {' '}({filters.results.length})
                </Text>

                <SortDropdown
                  effectiveOrder={filters.effectiveOrder}
                  onSelect={onSort}
                />
              </View>

              {filters.order === 'nearest'
                && filters.effectiveOrder === 'name' && (
                <Text style={explore.muted}>
                  {t('orderFallback')}
                </Text>
              )}

              {position.failed && (
                <Text style={explore.muted}>
                  {t('locationDenied')}
                </Text>
              )}
            </View>
          </View>
        }

        // CHỨC NĂNG: Phân biệt tải, lỗi và không có kết quả.
        // XỬ LÝ: Mỗi trường hợp có thông báo và đường khôi phục phù hợp.
        ListEmptyComponent={
          data.loading ? (
            <State message="loading" busy />
          ) : data.error ? (
            <State
              message="loadError"
              retry={() => {
                void data.reload()
              }}
            />
          ) : (
            <View style={explore.body}>
              <State message="empty" />
              <Text style={explore.muted}>
                {t('emptyHint')}
              </Text>
              <Action
                title={t('clearAll')}
                onPress={filters.reset}
              />
            </View>
          )
        }

        ListFooterComponent={
          <View style={explore.body}>
            <DemoNotice />
            <Text style={explore.muted}>
              {t('photoCredits')}
            </Text>

            {PHOTO_CREDITS.map((credit) => (
              <Pressable
                key={credit.url}
                accessibilityRole="link"
                onPress={() => {
                  void Linking.openURL(credit.url)
                }}
              >
                <Text style={explore.muted}>
                  {credit.title} · {credit.license}
                </Text>
              </Pressable>
            ))}
          </View>
        }
      />
    </SafeAreaView>
  )
}
// TẠI SAO (HomeScreen): Chặn từ khóa chỉ có khoảng trắng trước khi chuyển route để người dùng
// biết cần nhập gì và giữ được điều kiện tìm hợp lệ.
