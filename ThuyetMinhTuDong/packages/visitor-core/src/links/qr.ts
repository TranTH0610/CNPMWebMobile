/**
 * FILE NÀY LÀM GÌ
 * Kiểm tra và phân tích liên kết QR; nhận liên kết vào cổng chung và từ chối dữ liệu không hợp lệ.
 *
 * VỊ TRÍ: packages/visitor-core/src/links/qr.ts
 * DÙNG BỞI: packages/visitor-core/src/index.ts.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// Đặt tên kiểu QrPolicy.
export type QrPolicy = {
  // Khai báo allowedOrigins, kiểu readonly string[].
  allowedOrigins: readonly string[]
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `allowHttp: boolean`: Khai báo allowHttp, kiểu boolean.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  allowHttp: boolean
}

/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export type QrTarget =`: Đặt tên kiểu QrTarget.
 * DÒNG `| { kind: 'home' }`: Thành phần kiểu `| { kind: 'home' }` giới hạn hình dạng dữ liệu cho TypeScript. | Khai báo kind, kiểu 'home'.
 * DÒNG `| { kind: 'place'; id: string }`: Thành phần kiểu `| { kind: 'place'. | Khai báo kind, kiểu 'place'. | Khai báo id, kiểu string. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi.
 */
export type QrTarget =
  | { kind: 'home' }
  | { kind: 'place'; id: string }

// CHỨC NĂNG: Kiểm tra định dạng mã địa điểm trong liên kết.
// XỬ LÝ: Chặn ký tự hoặc độ dài ngoài quy tắc trước khi chuyển sang route/tìm dữ liệu.
// Khai báo validPlaceId(id). Nhận đầu vào qua tham số.
export function validPlaceId(id: string): boolean {
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return id.length <= 80`: Trả kết quả: tính biểu thức id.length <= 80 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id).
   * DÒNG `&& /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)`: Trả kết quả: tính biểu thức id.length <= 80 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id).
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return id.length <= 80
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)
}
// TẠI SAO (validPlaceId): Kiểm tra ID từ bên ngoài giúp tránh dùng ký tự ngoài hợp đồng vào
// đường dẫn hoặc truy vấn.

// CHỨC NĂNG: Kiểm tra payload trước khi điều hướng.
// XỬ LÝ: Kiểm tra raw trước URL() để không bỏ qua đường dẫn /../.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function parseQrTarget(`: Khai báo parseQrTarget(raw, policy). Nhận đầu vào qua tham số.
 * DÒNG `raw: string,`: Nhận đầu vào raw: string từ nơi gọi hàm.
 * DÒNG `policy: QrPolicy,`: Nhận đầu vào policy: QrPolicy từ nơi gọi hàm.
 * DÒNG `): QrTarget {`: Khai báo parseQrTarget(raw, policy). Nhận đầu vào qua tham số.
 */
export function parseQrTarget(
  raw: string,
  policy: QrPolicy,
): QrTarget {
  // Khai báo value: raw.trim bỏ khoảng trắng đầu/cuối để kiểm tra dữ liệu nhập thực tế.
  const value = raw.trim()

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `if (`: Rẽ nhánh nếu raw.length > 2048 || value.includes('%') || value.includes('\\') || Array.from(value).some( (character) => cha.
   * DÒNG `raw.length > 2048`: Rẽ nhánh nếu raw.length > 2048 || value.includes('%') || value.includes('\\') || Array.from(value).some( (character) => cha.
   * DÒNG `|| value.includes('%')`: Rẽ nhánh nếu raw.length > 2048 || value.includes('%') || value.includes('\\') || Array.from(value).some( (character) => cha.
   * DÒNG `|| value.includes('\\')`: Rẽ nhánh nếu raw.length > 2048 || value.includes('%') || value.includes('\\') || Array.from(value).some( (character) => cha.
   * DÒNG `|| Array.from(value).some(`: Rẽ nhánh nếu raw.length > 2048 || value.includes('%') || value.includes('\\') || Array.from(value).some( (character) => cha.
   * DÒNG `(character) => character.charCodeAt(0) <= 32,`: Rẽ nhánh nếu raw.length > 2048 || value.includes('%') || value.includes('\\') || Array.from(value).some( (character) => cha.
   * DÒNG `)`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   * DÒNG `|| /\/\.{1,2}(?:\/|$)/.test(value)`: Rẽ nhánh nếu raw.length > 2048 || value.includes('%') || value.includes('\\') || Array.from(value).some( (character) => cha.
   * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  if (
    raw.length > 2048
    || value.includes('%')
    || value.includes('\\')
    || Array.from(value).some(
      (character) => character.charCodeAt(0) <= 32,
    )
    || /\/\.{1,2}(?:\/|$)/.test(value)
  ) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `throw new Error('invalidQr')`: Ném new Error('invalidQr').
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    throw new Error('invalidQr')
  }

  // Khai báo url: không có giá trị khởi tạo.
  let url: URL

  // Bắt đầu vùng try.
  try {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `url = new URL(value)`: Thực hiện tính biểu thức url = new URL(value).
     * DÒNG `} catch {`: Bắt đầu vùng try.
     */
    url = new URL(value)
  } catch {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `throw new Error('invalidQr')`: Ném new Error('invalidQr').
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    throw new Error('invalidQr')
  }

  // CHỨC NĂNG: QR cổng được phép mang đúng dấu nguồn entry=gate ở trang chủ.
  // XỬ LÝ: Query khác và query trên địa điểm vẫn bị từ chối.
  // Rẽ nhánh nếu url.username || url.password || (url.search && !(url.pathname === '/' && url.search === '?entry=gate')) || url.
  if (url.username || url.password || (url.search && !(url.pathname === '/' && url.search === '?entry=gate')) || url.hash) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `throw new Error('invalidQr')`: Ném new Error('invalidQr').
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    throw new Error('invalidQr')
  }

  // Khai báo path: không có giá trị khởi tạo.
  let path: string

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `if (`: Rẽ nhánh nếu url.protocol === 'hueguide:' && url.hostname === 'places' && !url.port.
   * DÒNG `url.protocol === 'hueguide:'`: Rẽ nhánh nếu url.protocol === 'hueguide:' && url.hostname === 'places' && !url.port.
   * DÒNG `&& url.hostname === 'places'`: Rẽ nhánh nếu url.protocol === 'hueguide:' && url.hostname === 'places' && !url.port.
   * DÒNG `&& !url.port`: Rẽ nhánh nếu url.protocol === 'hueguide:' && url.hostname === 'places' && !url.port.
   * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  if (
    url.protocol === 'hueguide:'
    && url.hostname === 'places'
    && !url.port
  ) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `path = '/places' + url.pathname`: Thực hiện tính biểu thức path = '/places' + url.pathname.
     * DÒNG `} else {`: Xác định thân khối lệnh.
     */
    path = '/places' + url.pathname
  } else {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `const allowedProtocol =`: Khai báo allowedProtocol: tính biểu thức url.protocol === 'https:' || (policy.allowHttp && url.protocol === 'http:').
     * DÒNG `url.protocol === 'https:'`: Khai báo allowedProtocol: tính biểu thức url.protocol === 'https:' || (policy.allowHttp && url.protocol === 'http:').
     * DÒNG `|| (policy.allowHttp && url.protocol === 'http:')`: Khai báo allowedProtocol: tính biểu thức url.protocol === 'https:' || (policy.allowHttp && url.protocol === 'http:').
     */
    const allowedProtocol =
      url.protocol === 'https:'
      || (policy.allowHttp && url.protocol === 'http:')

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (`: Rẽ nhánh nếu !allowedProtocol || !policy.allowedOrigins.includes(url.origin).
     * DÒNG `!allowedProtocol`: Rẽ nhánh nếu !allowedProtocol || !policy.allowedOrigins.includes(url.origin).
     * DÒNG `|| !policy.allowedOrigins.includes(url.origin)`: Rẽ nhánh nếu !allowedProtocol || !policy.allowedOrigins.includes(url.origin).
     * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
     */
    if (
      !allowedProtocol
      || !policy.allowedOrigins.includes(url.origin)
    ) {
      /* GIẢI THÍCH TỪNG DÒNG:
       * DÒNG `throw new Error('invalidQr')`: Ném new Error('invalidQr').
       * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
       */
      throw new Error('invalidQr')
    }

    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `path = url.pathname`: Thực hiện tính biểu thức path = url.pathname.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    path = url.pathname
  }

  // CHỨC NĂNG: Chấp nhận QR vào chung không có ID.
  // XỬ LÝ: Chỉ root hoặc /places là trang vào chung hợp lệ.
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `if (`: Rẽ nhánh nếu path === '/' || path === '/places' || path === '/places/'.
   * DÒNG `path === '/'`: Rẽ nhánh nếu path === '/' || path === '/places' || path === '/places/'.
   * DÒNG `|| path === '/places'`: Rẽ nhánh nếu path === '/' || path === '/places' || path === '/places/'.
   * DÒNG `|| path === '/places/'`: Rẽ nhánh nếu path === '/' || path === '/places' || path === '/places/'.
   * DÒNG `) {`: Kết thúc nhóm biểu thức hoặc lời gọi hàm.
   */
  if (
    path === '/'
    || path === '/places'
    || path === '/places/'
  ) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `return { kind: 'home' }`: Trả kết quả: tạo object gồm kind. | Gán thuộc tính kind: chuỗi 'home'.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    return { kind: 'home' }
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `const match =`: Khai báo match: Gọi /^\/places\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(path).
   * DÒNG `/^\/places\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(path)`: Khai báo match: Gọi /^\/places\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(path).
   */
  const match =
    /^\/places\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(path)

  // Rẽ nhánh nếu !match || !validPlaceId(match[1]).
  if (!match || !validPlaceId(match[1])) {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `throw new Error('invalidQr')`: Ném new Error('invalidQr').
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    throw new Error('invalidQr')
  }

  // Trả kết quả: tạo object gồm kind, id.
  return {
    // Gán thuộc tính kind: chuỗi 'place'.
    kind: 'place',
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `id: match[1],`: Gán thuộc tính id: đọc match[1] từ đối tượng/mảng để dùng tại bước hiện tại. Mã ổn định giúp tìm đúng bản ghi và làm key danh sách khi thứ tự thay đổi.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    id: match[1],
  }
}
// TẠI SAO (parseQrTarget): QR là đầu vào bên ngoài; phải xác định đích được phép trước khi điều
// hướng.

// CHỨC NĂNG: Giữ API cũ cho nơi chỉ nhận QR của một điểm.
// XỬ LÝ: Chỗ cần nhận QR chung phải dùng parseQrTarget.
/* GIẢI THÍCH TỪNG DÒNG:
 * DÒNG `export function parsePlaceQr(`: Khai báo parsePlaceQr(raw, policy). Nhận đầu vào qua tham số.
 * DÒNG `raw: string,`: Nhận đầu vào raw: string từ nơi gọi hàm.
 * DÒNG `policy: QrPolicy,`: Nhận đầu vào policy: QrPolicy từ nơi gọi hàm.
 * DÒNG `): string {`: Khai báo parsePlaceQr(raw, policy). Nhận đầu vào qua tham số.
 */
export function parsePlaceQr(
  raw: string,
  policy: QrPolicy,
): string {
  // Khai báo target: Gọi parseQrTarget(raw, policy).
  const target = parseQrTarget(raw, policy)

  // Rẽ nhánh nếu target.kind !== 'place'.
  if (target.kind !== 'place') {
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `throw new Error('invalidQr')`: Ném new Error('invalidQr').
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    throw new Error('invalidQr')
  }

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return target.id`: Trả kết quả: đọc target.id từ đối tượng/mảng để dùng tại bước hiện tại.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return target.id
}
// TẠI SAO (parsePlaceQr): Dùng parser chung tránh nơi quét QR và nơi mở deep link có quy tắc
// khác nhau.

// CHỨC NĂNG: Tạo URL để mã hóa thành QR.
// XỬ LÝ: ID phải đúng định dạng trước khi ghép URL.
// Khai báo placeUrl(origin, id). Nhận đầu vào qua tham số.
export function placeUrl(origin: string, id: string): string {
  // Rẽ nhánh nếu !validPlaceId(id). | Ném new Error('invalidQr').
  if (!validPlaceId(id)) throw new Error('invalidQr')

  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `return new URL('/places/' + id, origin).toString()`: Trả kết quả: Gọi new URL('/places/' + id, origin).toString().
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  return new URL('/places/' + id, origin).toString()
}
// TẠI SAO (placeUrl): Ghép URL có kiểm tra giúp ID hoặc origin không làm hỏng địa chỉ chi tiết.