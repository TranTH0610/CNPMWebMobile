/**
 * FILE NÀY LÀM GÌ:
 * Kiểm tra dữ liệu QR trước khi mở địa điểm, thuộc UC05.
 * ScanScreen gọi parser; không tự mở URL ngoài ứng dụng.
 * Không phụ thuộc camera hoặc React Native.
 */

export type QrPolicy = {
  allowedOrigins: readonly string[]
  allowHttp: boolean
}

// CHỨC NĂNG: Kiểm tra cấu trúc ID địa điểm.
// XỬ LÝ: Chỉ cho chữ thường, số và gạch nối đơn; giới hạn 80 ký tự.
export function validPlaceId(id: string): boolean {
  return id.length <= 80
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)
}

// CHỨC NĂNG: Lấy ID từ QR hợp lệ.
// XỬ LÝ:
// - Chỉ nhận custom scheme của app hoặc origin web được cấu hình.
// - Kiểm tra dữ liệu thô trước URL(), vì URL có thể chuẩn hóa /../.
// - Không nhận query, hash, tài khoản hoặc đường dẫn khác mẫu.
export function parsePlaceQr(
  raw: string,
  policy: QrPolicy,
): string {
  const value = raw.trim()

  if (
    raw.length > 2048
    || value.includes('%')
    || value.includes('\\')
    || Array.from(value).some(
      (character) => character.charCodeAt(0) <= 32,
    )
    || /\/\.{1,2}(?:\/|$)/.test(value)
  ) {
    throw new Error('invalidQr')
  }

  let url: URL

  try {
    url = new URL(value)
  } catch {
    throw new Error('invalidQr')
  }

  if (url.username || url.password || url.search || url.hash) {
    throw new Error('invalidQr')
  }

  let path: string

  if (
    url.protocol === 'hueguide:'
    && url.hostname === 'places'
    && !url.port
  ) {
    path = '/places' + url.pathname
  } else {
    const allowedProtocol =
      url.protocol === 'https:'
      || (policy.allowHttp && url.protocol === 'http:')

    if (
      !allowedProtocol
      || !policy.allowedOrigins.includes(url.origin)
    ) {
      throw new Error('invalidQr')
    }

    path = url.pathname
  }

  const match =
    /^\/places\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(path)

  if (!match || !validPlaceId(match[1])) {
    throw new Error('invalidQr')
  }

  return match[1]
}

// CHỨC NĂNG: Tạo link web cho một địa điểm.
// XỬ LÝ: ID phải hợp lệ trước khi ghép URL.
export function placeUrl(origin: string, id: string): string {
  if (!validPlaceId(id)) throw new Error('invalidQr')

  return new URL('/places/' + id, origin).toString()
}