/**
 * FILE NÀY LÀM GÌ
 * Thẻ tóm tắt địa điểm, ảnh và thông tin hiển thị; bấm thẻ để mở đúng trang hoặc màn chi tiết.
 *
 * VỊ TRÍ: apps/mobile/src/components/PlaceCard.tsx
 * DÙNG BỞI: apps/mobile/src/components/index.ts.
 * PHỤ THUỘC: ../styles/explore; ../theme; ./Cover; react-native; @travelguide/visitor-core;
 * ../i18n/index; ../hooks/useVisitor
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ '../styles/explore'.
import { explore } from '../styles/explore'
// Nhập các thành phần từ '../theme'.
import { colors, spacing } from '../theme'
// Nhập các thành phần từ './Cover'.
import { Cover } from './Cover'
// Nhập các thành phần từ 'react-native'.
import { Pressable, StyleSheet, Text, View } from 'react-native'
// Nhập các thành phần từ '@travelguide/visitor-core'.
import { categoryOf, distanceTo, publishedText } from '@travelguide/visitor-core'
// Nhập kiểu dữ liệu từ '@travelguide/visitor-core'.
import type { PlaceRecord, Point } from '@travelguide/visitor-core'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'
// Nhập các thành phần từ '../hooks/useVisitor'.
import { useVisitor } from '../hooks/useVisitor'

// CHỨC NĂNG: Card lớn hoặc card ngang.
// XỬ LÝ: Thẻ chỉ mở chi tiết, ảnh lỗi dùng placeholder; không có nút yêu thích.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function PlaceCard({`: Khai báo PlaceCard({ place, onOpen, featured = false, width, origin, }). Component hàm nhận props và dựng phần giao diện PlaceCard.
 * DÒNG `place,`: Nhận đầu vào { place, onOpen, featured = false, width, origin, }: { place: PlaceRecord onOpen: () => void fe từ nơi gọi hàm.
 * DÒNG `onOpen,`: Nhận đầu vào { place, onOpen, featured = false, width, origin, }: { place: PlaceRecord onOpen: () => void fe từ nơi gọi hàm.
 * DÒNG `featured = false,`: Nhận đầu vào { place, onOpen, featured = false, width, origin, }: { place: PlaceRecord onOpen: () => void fe từ nơi gọi hàm.
 * DÒNG `width,`: Nhận đầu vào { place, onOpen, featured = false, width, origin, }: { place: PlaceRecord onOpen: () => void fe từ nơi gọi hàm.
 * DÒNG `origin,`: Nhận đầu vào { place, onOpen, featured = false, width, origin, }: { place: PlaceRecord onOpen: () => void fe từ nơi gọi hàm.
 * DÒNG `}: {`: Nhận đầu vào { place, onOpen, featured = false, width, origin, }: { place: PlaceRecord onOpen: () => void fe từ nơi gọi hàm.
 */
export function PlaceCard({
  place,
  onOpen,
  featured = false,
  width,
  origin,
}: {
  // Khai báo place, kiểu PlaceRecord.
  place: PlaceRecord
  // Khai báo onOpen, kiểu () => void.
  onOpen: () => void
  // Khai báo featured không bắt buộc, kiểu boolean.
  featured?: boolean
  // Khai báo width không bắt buộc, kiểu number.
  width?: number
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `origin?: Point`: Khai báo origin không bắt buộc, kiểu Point.
   * DÒNG `}) {`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  origin?: Point
}) {
  // Khai báo { language }: useVisitor() đọc trạng thái dùng chung từ provider thay vì tự tạo một kho riêng tại màn hình.
  const { language } = useVisitor()

  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()
  // Khai báo content: publishedText lấy bản đã công bố đúng ngôn ngữ.
  const content = publishedText(place, language)
  // Gán title bằng content?.title; nếu null hoặc undefined thì dùng place.canonicalTitle.
  const title = content?.title ?? place.canonicalTitle
  // Khai báo meters: Gọi distanceTo(place, origin).
  const meters = distanceTo(place, origin)

  // Rẽ nhánh nếu featured.
  if (featured) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
     * DÒNG `<View style={[explore.featured, { width }]}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Đặt trường width bằng giá trị của biến cùng tên.
     * DÒNG `<Cover`: Dựng Cover.
     * DÒNG `uri={place.images[0]}`: Truyền địa chỉ tài nguyên vào component.
     * DÒNG `style={StyleSheet.absoluteFill}`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
     * DÒNG `/>`: Dựng Cover.
     * DÒNG `<Pressable`: Dựng Pressable.
     * DÒNG `accessibilityRole="button"`: Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
     * DÒNG `accessibilityLabel={title}`: Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình.
     * DÒNG `onPress={onOpen}`: Thuộc tính onPress: nối thao tác nhấn với callback.
     * DÒNG `style={explore.featuredText}`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
     * DÒNG `>`: Dựng Pressable.
     * DÒNG `<Text style={explore.badge}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
     * DÒNG `{t(`category_${categoryOf(place)}`)}`: Đưa biểu thức JavaScript t(`category_${categoryOf(place)}`) vào JSX.
     * DÒNG `</Text>`: Đóng phần giao diện Text.
     * DÒNG `<Text`: Dựng Text.
     * DÒNG `style={[`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
     * DÒNG `explore.cardTitle,`: Đưa biểu thức JavaScript [ explore.cardTitle, { color: colors.white, fontSize: 22 }, ] vào JSX.
     * DÒNG `{ color: colors.white, fontSize: 22 },`: Đưa biểu thức JavaScript [ explore.cardTitle, { color: colors.white, fontSize: 22 }, ] vào JSX. | Gán thuộc tính color: đọc colors.white từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fontSize: giá trị số 22.
     * DÒNG `]}`: Kết thúc danh sách phần tử trong mảng.
     * DÒNG `>`: Dựng Text.
     * DÒNG `{title}`: Đưa biểu thức JavaScript title vào JSX.
     * DÒNG `</Text>`: Đóng phần giao diện Text.
     * DÒNG `<Text style={{ color: colors.white, fontSize: 12 }}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính color: đọc colors.white từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fontSize: giá trị số 12.
     * DÒNG `{content ? content.address || t('city') : t('missing')}`: Đưa biểu thức JavaScript content ? content.address || t('city') : t('missing') vào JSX.
     * DÒNG `</Text>`: Đóng phần giao diện Text.
     * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
     * DÒNG `</View>`: Đóng phần giao diện View.
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return (
      <View style={[explore.featured, { width }]}>
        <Cover
          uri={place.images[0]}
          style={StyleSheet.absoluteFill}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={title}
          onPress={onOpen}
          style={explore.featuredText}
        >
          <Text style={explore.badge}>
            {t(`category_${categoryOf(place)}`)}
          </Text>

          <Text
            style={[
              explore.cardTitle,
              { color: colors.white, fontSize: 22 },
            ]}
          >
            {title}
          </Text>

          <Text style={{ color: colors.white, fontSize: 12 }}>
            {content ? content.address || t('city') : t('missing')}
          </Text>
        </Pressable>

      </View>
    )
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<View style={explore.card}>`: Dựng View. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Pressable`: Dựng Pressable.
   * DÒNG `accessibilityRole="button"`: Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `accessibilityLabel={title}`: Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình.
   * DÒNG `onPress={onOpen}`: Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `style={{ width: explore.image.width, height: explore.image.height, flexShrink: 0 }}`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính width: đọc explore.image.width từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính height: đọc explore.image.height từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính flexShrink: giá trị số 0.
   * DÒNG `>`: Dựng Pressable.
   * DÒNG `<Cover uri={place.images[0]} style={explore.image} />`: Dựng Cover. | Truyền địa chỉ tài nguyên vào component. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `<Pressable`: Dựng Pressable.
   * DÒNG `accessibilityRole="button"`: Thuộc tính accessibilityRole: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `onPress={onOpen}`: Thuộc tính onPress: nối thao tác nhấn với callback.
   * DÒNG `style={{ flex: 1, gap: spacing.sm }}`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính flex: giá trị số 1. | Gán thuộc tính gap: đọc spacing.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `>`: Dựng Pressable.
   * DÒNG `<Text numberOfLines={2} style={explore.cardTitle}>{title}</Text>`: Dựng Text. | Thuộc tính numberOfLines: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `<Text style={explore.badge}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{t(`category_${categoryOf(place)}`)}`: Đưa biểu thức JavaScript t(`category_${categoryOf(place)}`) vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `<Text numberOfLines={2} ellipsizeMode="tail" style={explore.muted}>`: Dựng Text. | Thuộc tính numberOfLines: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính ellipsizeMode: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{content ? content.address || t('city') : t('missing')}`: Đưa biểu thức JavaScript content ? content.address || t('city') : t('missing') vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `{meters !== undefined && (`: Đưa biểu thức JavaScript meters !== undefined && ( <Text style={explore.muted}> {(meters / 1000).toFixed(2)} km </Text> ) vào JSX.
   * DÒNG `<Text style={explore.muted}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{(meters / 1000).toFixed(2)} km`: Đưa biểu thức JavaScript (meters / 1000).toFixed(2) vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</Pressable>`: Đóng phần giao diện Pressable.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <View style={explore.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        onPress={onOpen}
        style={{ width: explore.image.width, height: explore.image.height, flexShrink: 0 }}
      >
        <Cover uri={place.images[0]} style={explore.image} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={onOpen}
        style={{ flex: 1, gap: spacing.sm }}
      >
        <Text numberOfLines={2} style={explore.cardTitle}>{title}</Text>

        <Text style={explore.badge}>
          {t(`category_${categoryOf(place)}`)}
        </Text>

        <Text numberOfLines={2} ellipsizeMode="tail" style={explore.muted}>
          {content ? content.address || t('city') : t('missing')}
        </Text>

        {meters !== undefined && (
          <Text style={explore.muted}>
            {(meters / 1000).toFixed(2)} km
          </Text>
        )}
      </Pressable>

    </View>
  )
}
// TẠI SAO (PlaceCard): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
