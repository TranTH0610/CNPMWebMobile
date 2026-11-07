/**
 * CHỨC NĂNG: [KHOI-DONG] [CAU-HINH]
 * VAI TRÒ: CÔNG CỤ CHẠY DỰ ÁN
 *
 * FILE NÀY LÀM GÌ:
 * Xác minh danh sách và ảnh SQL đi được qua cùng URL website của QR.
 *
 * VỊ TRÍ: scripts/KiemTraWebsiteSanSang.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - scripts/ChayDemoCongKhai.cjs
 * - scripts/KiemThuQRCongKhai.test.cjs
 * - scripts/TaoMaQRCongKhai.cjs
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. visitorDataReady
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// ==================== [KHOI-DONG] [CAU-HINH] visitorDataReady ====================
async function visitorDataReady(origin, request = fetch) {
  try {
    const response = await request(origin + '/api/catalog/published', {
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    })
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json'))
      return false
    const places = await response.json()
    if (
      !Array.isArray(places) ||
      !places.every((p) => p && typeof p.id === 'string' && Array.isArray(p.images))
    )
      return false
    // CHỨC NĂNG: Kiểm tra một ảnh tham chiếu nội bộ; không gọi URL tùy ý do nội dung cung cấp.
    // XỬ LÝ: Danh sách rỗng hợp lệ; thiếu ảnh được UI xử lý bằng placeholder như trước.
    const image = places
      .flatMap((p) => p.images)
      .find(
        (value) =>
          typeof value === 'string' && /^(media:[a-f0-9]{64}|photo:[a-z0-9-]+)$/.test(value),
      )
    if (!image) return true
    const path = image.startsWith('media:')
      ? '/media/published/' + image.slice(6)
      : '/images/published/' + image.slice(6) + '.jpg'
    const media = await request(origin + '/api/catalog' + path, {
      method: 'HEAD',
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    })
    return (
      media.ok &&
      /^image\//.test(media.headers.get('content-type') || '') &&
      Number(media.headers.get('content-length')) > 0
    )
  } catch {
    return false
  }
}
module.exports = { visitorDataReady }
