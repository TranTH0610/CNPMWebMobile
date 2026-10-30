/**
 * FILE NÀY LÀM GÌ
 * Hiển thị phần ảnh bìa và nội dung mở đầu của trang khám phá trên mobile.
 *
 * VỊ TRÍ: apps/mobile/src/components/Cover.tsx
 * DÙNG BỞI: apps/mobile/src/components/index.ts; apps/mobile/src/components/JourneyPlayer.tsx;
 * apps/mobile/src/components/PlaceCard.tsx; và các nơi import khác.
 * PHỤ THUỘC: ../styles/explore; ../theme; react; react-native; @expo/vector-icons;
 * ../services/placeImages; ../i18n/index
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ '../styles/explore'.
import { explore } from '../styles/explore'
// Nhập các thành phần từ '../theme'.
import { colors } from '../theme'
// Nhập các thành phần từ 'react'.
import { useState } from 'react'
// Nhập các thành phần từ 'react-native'.
import { Image, StyleSheet, Text, View } from 'react-native'
// Nhập kiểu dữ liệu từ 'react-native'.
import type { StyleProp, ViewStyle } from 'react-native'
// Nhập các thành phần từ '@expo/vector-icons'.
import { Ionicons } from '@expo/vector-icons'
// Nhập các thành phần từ '../services/placeImages'.
import { resolvePlaceImage } from '../services/placeImages'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'

// CHỨC NĂNG: Hiển thị ảnh co theo khung hoặc placeholder.
// XỬ LÝ: Lỗi gắn với URI để callback ảnh cũ không làm hỏng ảnh mới; thiếu asset cũng hiện placeholder.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function Cover({`: Khai báo Cover({ uri, style, }). Component hàm nhận props và dựng phần giao diện Cover.
 * DÒNG `uri,`: Nhận đầu vào { uri, style, }: { uri?: string style?: StyleProp<ViewStyle> } từ nơi gọi hàm.
 * DÒNG `style,`: Nhận đầu vào { uri, style, }: { uri?: string style?: StyleProp<ViewStyle> } từ nơi gọi hàm.
 * DÒNG `}: {`: Nhận đầu vào { uri, style, }: { uri?: string style?: StyleProp<ViewStyle> } từ nơi gọi hàm.
 */
export function Cover({
  uri,
  style,
}: {
  // Khai báo uri không bắt buộc, kiểu string.
  uri?: string
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `style?: StyleProp<ViewStyle>`: Khai báo style không bắt buộc, kiểu StyleProp<ViewStyle>.
   * DÒNG `}) {`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  style?: StyleProp<ViewStyle>
}) {
  // Khai báo [failedUri, setFailedUri]: useState() giữ trạng thái qua các lần render.
  const [failedUri, setFailedUri] = useState<string>()
  // Khai báo source: Gọi resolvePlaceImage(uri).
  const source = resolvePlaceImage(uri)
  // Khai báo failed: tính biểu thức failedUri === uri.
  const failed = failedUri === uri
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()


  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<View`: Dựng View.
   * DÒNG `style={[`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `backgroundColor: colors.soft,`: Gán thuộc tính backgroundColor: đọc colors.soft từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `overflow: 'hidden',`: Gán thuộc tính overflow: chuỗi 'hidden'.
   * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `style,`: Đưa biểu thức JavaScript [ { backgroundColor: colors.soft, overflow: 'hidden', }, style, ] vào JSX.
   * DÒNG `]}`: Kết thúc danh sách phần tử trong mảng.
   * DÒNG `>`: Dựng View.
   * DÒNG `{source && !failed ? (`: Đưa biểu thức JavaScript source && !failed ? ( <Image key={uri} source={source} onError={() => setFailedUri(uri)} // CHỨC NĂNG: Ghi đè  vào JSX.
   * DÒNG `<Image`: Dựng Image.
   * DÒNG `key={uri}`: Thuộc tính key: giữ định danh ổn định khi React cập nhật danh sách.
   * DÒNG `source={source}`: Thuộc tính source: cung cấp nguồn tài nguyên cho thành phần native.
   * DÒNG `onError={() => setFailedUri(uri)}`: Thuộc tính onError: nhận lỗi tài nguyên để có thể hiển thị trạng thái thay thế.
   * DÒNG `style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại. | Gán thuộc tính width: chuỗi '100%'. | Gán thuộc tính height: chuỗi '100%'.
   * DÒNG `resizeMode="cover"`: Thuộc tính resizeMode: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `/>`: Dựng Image.
   * DÒNG `) : (`: Đưa biểu thức JavaScript source && !failed ? ( <Image key={uri} source={source} onError={() => setFailedUri(uri)} // CHỨC NĂNG: Ghi đè  vào JSX.
   * DÒNG `<View`: Dựng View.
   * DÒNG `style={[`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `StyleSheet.absoluteFill,`: Đưa biểu thức JavaScript [ StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center', }, ] vào JSX.
   * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
   * DÒNG `alignItems: 'center',`: Gán thuộc tính alignItems: chuỗi 'center'.
   * DÒNG `justifyContent: 'center',`: Gán thuộc tính justifyContent: chuỗi 'center'.
   * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `]}`: Kết thúc danh sách phần tử trong mảng.
   * DÒNG `>`: Dựng View.
   * DÒNG `<Ionicons`: Dựng Ionicons.
   * DÒNG `name="image-outline"`: Thuộc tính name: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `size={28}`: Thuộc tính size: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `color={colors.muted}`: Thuộc tính color: truyền tùy chọn/giá trị vào phần tử hoặc component theo hợp đồng của nó.
   * DÒNG `/>`: Dựng Ionicons.
   * DÒNG `<Text style={explore.muted}>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `{t('noImage')}`: Đưa biểu thức JavaScript t('noImage') vào JSX.
   * DÒNG `</Text>`: Đóng phần giao diện Text.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `)}`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `</View>`: Đóng phần giao diện View.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <View
      style={[
        {
          backgroundColor: colors.soft,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {source && !failed ? (
        <Image
          key={uri}
          source={source}
          onError={() => setFailedUri(uri)}
          // CHỨC NĂNG: Ghi đè kích thước gốc mà RN tự thêm cho ảnh đóng gói.
          // XỬ LÝ: absoluteFill chỉ đặt vị trí; width/height 100% buộc ảnh co đúng khung
          // của thumbnail, ảnh hero và ảnh player. Nếu thiếu, chỉ thấy góc trời/tường của JPG.
          style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <Ionicons
            name="image-outline"
            size={28}
            color={colors.muted}
          />
          <Text style={explore.muted}>
            {t('noImage')}
          </Text>
        </View>
      )}
    </View>
  )
}
// TẠI SAO (Cover): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện tại
// một nơi.
