/**
 * FILE NÀY LÀM GÌ
 * Hiển thị ảnh địa điểm qua bộ phân giải của nền tảng và xử lý trạng thái ảnh không tải được.
 *
 * VỊ TRÍ: apps/mobile/src/components/PlaceImage.tsx
 * DÙNG BỞI: apps/mobile/src/components/index.ts.
 * PHỤ THUỘC: ../theme; react; react-native; ../services/placeImages; ../i18n/index
 * TẠI SAO TÁCH FILE: Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
 * tại một nơi.
 */
// Nhập các thành phần từ '../theme'.
import { ui, radii } from '../theme'
// Nhập các thành phần từ 'react'.
import { useEffect, useState } from 'react'
// Nhập các thành phần từ 'react-native'.
import { Image, Text, View } from 'react-native'
// Nhập các thành phần từ '../services/placeImages'.
import { resolvePlaceImage } from '../services/placeImages'
// Nhập các thành phần từ '../i18n/index'.
import { useText } from '../i18n/index'

// CHỨC NĂNG: Hiển thị ảnh hoặc placeholder khi ảnh thiếu/hỏng.
// XỬ LÝ: URL thay đổi thì reset lỗi để thử tải URL mới.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function PlaceImage({`: Khai báo PlaceImage({ uri, title, }). Component hàm nhận props và dựng phần giao diện PlaceImage.
 * DÒNG `uri,`: Nhận đầu vào { uri, title, }: { uri?: string title: string } từ nơi gọi hàm.
 * DÒNG `title,`: Nhận đầu vào { uri, title, }: { uri?: string title: string } từ nơi gọi hàm.
 * DÒNG `}: {`: Nhận đầu vào { uri, title, }: { uri?: string title: string } từ nơi gọi hàm.
 */
export function PlaceImage({
  uri,
  title,
}: {
  // Khai báo uri không bắt buộc, kiểu string.
  uri?: string
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `title: string`: Khai báo title, kiểu string.
   * DÒNG `}) {`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  title: string
}) {
  // Khai báo [failed, setFailed]: useState(false) giữ trạng thái qua các lần render.
  const [failed, setFailed] = useState(false)
  // Khai báo t: useText() lấy hàm dịch từ provider ngôn ngữ đang chọn.
  const t = useText()

  // DÒNG NÀY LÀM GÌ: Đặt lại cờ ảnh lỗi về false khi uri thay đổi.
  // CÁCH HOẠT ĐỘNG: Nguồn ảnh mới được thử tải lại, dù ảnh trước đó đã thất bại.
  // KHI NÀO CHẠY: Sau lần render đầu; chạy lại khi React thấy một phụ thuộc đổi: uri.
  // Đăng ký useEffect để thực hiện tác vụ sau render.
  useEffect(() => {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `setFailed(false)`: Cập nhật trạng thái qua setFailed(false).
     * DÒNG `}, [uri])`: Đăng ký useEffect để thực hiện tác vụ sau render.
     */
    setFailed(false)
  }, [uri])
  // TẠI SAO: Nếu giữ cờ lỗi cũ, component có thể tiếp tục hiện placeholder dù đã nhận một URL ảnh
  // mới hợp lệ.

  // Rẽ nhánh nếu !uri || failed.
  if (!uri || failed) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
     * DÒNG `<View`: Dựng View.
     * DÒNG `style={[`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
     * DÒNG `ui.banner,`: Đưa biểu thức JavaScript [ ui.banner, { minHeight: 110, justifyContent: 'center', }, ] vào JSX.
     * DÒNG `{`: Dấu phân cách của khối hiện tại; không thực hiện xử lý riêng.
     * DÒNG `minHeight: 110,`: Gán thuộc tính minHeight: giá trị số 110.
     * DÒNG `justifyContent: 'center',`: Gán thuộc tính justifyContent: chuỗi 'center'.
     * DÒNG `},`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `]}`: Kết thúc danh sách phần tử trong mảng.
     * DÒNG `>`: Dựng View.
     * DÒNG `<Text style={ui.muted}>{t('noImage')}</Text>`: Dựng Text. | Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
     * DÒNG `</View>`: Đóng phần giao diện View.
     * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return (
      <View
        style={[
          ui.banner,
          {
            minHeight: 110,
            justifyContent: 'center',
          },
        ]}
      >
        <Text style={ui.muted}>{t('noImage')}</Text>
      </View>
    )
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return (`: Trả cây giao diện của component để React hiển thị.
   * DÒNG `<Image`: Dựng Image.
   * DÒNG `source={resolvePlaceImage(uri)}`: Thuộc tính source: cung cấp nguồn tài nguyên cho thành phần native.
   * DÒNG `onError={() => setFailed(true)}`: Thuộc tính onError: nhận lỗi tài nguyên để có thể hiển thị trạng thái thay thế.
   * DÒNG `accessibilityLabel={title}`: Thuộc tính accessibilityLabel: cung cấp tên đọc cho trình đọc màn hình.
   * DÒNG `style={{`: Thuộc tính style: áp dụng style theo dữ liệu hoặc trạng thái hiện tại.
   * DÒNG `width: '100%',`: Gán thuộc tính width: chuỗi '100%'.
   * DÒNG `height: 220,`: Gán thuộc tính height: giá trị số 220.
   * DÒNG `borderRadius: radii.sm,`: Gán thuộc tính borderRadius: đọc radii.sm từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `}}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   * DÒNG `/>`: Dựng Image.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return (
    <Image
      source={resolvePlaceImage(uri)}
      onError={() => setFailed(true)}
      accessibilityLabel={title}
      style={{
        width: '100%',
        height: 220,
        borderRadius: radii.sm,
      }}
    />
  )
}
// TẠI SAO (PlaceImage): Tách thành phần dùng lại giúp các màn dùng cùng hành vi và sửa giao diện
// tại một nơi.
