/**
 * FILE NÀY LÀM GÌ
 * Dữ liệu điểm bản đồ và tuyến tham khảo; cờ xác minh phân biệt dữ liệu bản đồ với khảo sát thực
 * địa.
 *
 * VỊ TRÍ: packages/visitor-core/src/journey/journey-data.ts
 * DÙNG BỞI: packages/visitor-core/src/data/mock.ts;
 * packages/visitor-core/src/journey/journey-react.tsx.
 * PHỤ THUỘC: ../catalog/search; ../domain/model; ./journey
 * TẠI SAO TÁCH FILE: Logic dùng chung cần tách khỏi thiết bị để web và native điều khiển cùng
 * một nghiệp vụ.
 */
// Nhập các thành phần từ '../catalog/search'.
import { validPoint } from '../catalog/search'
// Nhập kiểu dữ liệu từ '../domain/model'.
import type { PlaceRecord } from '../domain/model'
// Nhập kiểu dữ liệu từ './journey'.
import type { MapPoint, VisitRoute } from './journey'

// CHỨC NĂNG: Giữ nguồn của từng marker để người dùng kiểm tra tọa độ.
// XỬ LÝ: fieldVerified=false phân biệt dữ liệu bản đồ với khảo sát thực địa.
// Khai báo MAP_POINTS: tạo object gồm 'ky-dai', 'ngo-mon', 'dien-thai-hoa', 'the-mieu', 'cung-dien-tho', 'truong-sanh-cung', 'dien-can-chanh', 'hien-lam-cac'.
export const MAP_POINTS: Readonly<Record<string, MapPoint>> = {
  // Gán thuộc tính 'ky-dai': tạo object gồm lat, lng, source, fieldVerified. | Gán thuộc tính lat: giá trị số 16.4663575. | Gán thuộc tính lng: giá trị số 107.5802462. | Gán thuộc tính source: chuỗi 'https://www.openstreetmap.org/way/218427614'. | Gán thuộc tính fieldVerified: sử dụng false làm giá trị của bước hiện tại. Ghi trạng thái khảo sát thực địa của điểm bản đồ.
  'ky-dai': { lat: 16.4663575, lng: 107.5802462, source: 'https://www.openstreetmap.org/way/218427614', fieldVerified: false },
  // Gán thuộc tính 'ngo-mon': tạo object gồm lat, lng, source, fieldVerified. | Gán thuộc tính lat: giá trị số 16.4676824. | Gán thuộc tính lng: giá trị số 107.5791834. | Gán thuộc tính source: chuỗi 'https://www.openstreetmap.org/way/172657562'. | Gán thuộc tính fieldVerified: sử dụng false làm giá trị của bước hiện tại. Ghi trạng thái khảo sát thực địa của điểm bản đồ.
  'ngo-mon': { lat: 16.4676824, lng: 107.5791834, source: 'https://www.openstreetmap.org/way/172657562', fieldVerified: false },
  // Gán thuộc tính 'dien-thai-hoa': tạo object gồm lat, lng, source, fieldVerified. | Gán thuộc tính lat: giá trị số 16.4687434. | Gán thuộc tính lng: giá trị số 107.5783867. | Gán thuộc tính source: chuỗi 'https://www.openstreetmap.org/way/531031566'. | Gán thuộc tính fieldVerified: sử dụng false làm giá trị của bước hiện tại. Ghi trạng thái khảo sát thực địa của điểm bản đồ.
  'dien-thai-hoa': { lat: 16.4687434, lng: 107.5783867, source: 'https://www.openstreetmap.org/way/531031566', fieldVerified: false },
  // Gán thuộc tính 'the-mieu': tạo object gồm lat, lng, source, fieldVerified. | Gán thuộc tính lat: giá trị số 16.4671614. | Gán thuộc tính lng: giá trị số 107.5767398. | Gán thuộc tính source: chuỗi 'https://www.openstreetmap.org/way/172657567'. | Gán thuộc tính fieldVerified: sử dụng false làm giá trị của bước hiện tại. Ghi trạng thái khảo sát thực địa của điểm bản đồ.
  'the-mieu': { lat: 16.4671614, lng: 107.5767398, source: 'https://www.openstreetmap.org/way/172657567', fieldVerified: false },
  // Gán thuộc tính 'cung-dien-tho': tạo object gồm lat, lng, source, fieldVerified. | Gán thuộc tính lat: giá trị số 16.4688916. | Gán thuộc tính lng: giá trị số 107.5754008. | Gán thuộc tính source: chuỗi 'https://www.openstreetmap.org/way/172763420'. | Gán thuộc tính fieldVerified: sử dụng false làm giá trị của bước hiện tại. Ghi trạng thái khảo sát thực địa của điểm bản đồ.
  'cung-dien-tho': { lat: 16.4688916, lng: 107.5754008, source: 'https://www.openstreetmap.org/way/172763420', fieldVerified: false },
  // Gán thuộc tính 'truong-sanh-cung': tạo object gồm lat, lng, source, fieldVerified. | Gán thuộc tính lat: giá trị số 16.4697182. | Gán thuộc tính lng: giá trị số 107.5746783. | Gán thuộc tính source: chuỗi 'https://www.openstreetmap.org/way/172763427'. | Gán thuộc tính fieldVerified: sử dụng false làm giá trị của bước hiện tại. Ghi trạng thái khảo sát thực địa của điểm bản đồ.
  'truong-sanh-cung': { lat: 16.4697182, lng: 107.5746783, source: 'https://www.openstreetmap.org/way/172763427', fieldVerified: false },
  // Gán thuộc tính 'dien-can-chanh': tạo object gồm lat, lng, source, fieldVerified. | Gán thuộc tính lat: giá trị số 16.4694768. | Gán thuộc tính lng: giá trị số 107.5777963. | Gán thuộc tính source: chuỗi 'https://www.openstreetmap.org/way/285990343'. | Gán thuộc tính fieldVerified: sử dụng false làm giá trị của bước hiện tại. Ghi trạng thái khảo sát thực địa của điểm bản đồ.
  'dien-can-chanh': { lat: 16.4694768, lng: 107.5777963, source: 'https://www.openstreetmap.org/way/285990343', fieldVerified: false },
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `'hien-lam-cac': { lat: 16.4667375, lng: 107.5770629, source: 'https://www.openstreetm`: Gán thuộc tính 'hien-lam-cac': tạo object gồm lat, lng, source, fieldVerified. | Gán thuộc tính lat: giá trị số 16.4667375. | Gán thuộc tính lng: giá trị số 107.5770629. | Gán thuộc tính source: chuỗi 'https://www.openstreetmap.org/way/172657564'. | Gán thuộc tính fieldVerified: sử dụng false làm giá trị của bước hiện tại. Ghi trạng thái khảo sát thực địa của điểm bản đồ.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  'hien-lam-cac': { lat: 16.4667375, lng: 107.5770629, source: 'https://www.openstreetmap.org/way/172657564', fieldVerified: false },
}

// Khai báo VISIT_ROUTES: tạo mảng [{ id: 'hue-preview', title: { vi: 'Thứ tự tham khảo Hoàng thành — chưa duyệt lố.
export const VISIT_ROUTES: readonly VisitRoute[] = [{
  // Gán thuộc tính id: chuỗi 'hue-preview'.
  id: 'hue-preview',
  // Gán thuộc tính title: tạo object gồm vi, en, cn, pt, ja. | Gán thuộc tính vi: chuỗi 'Thứ tự tham khảo Hoàng thành — chưa duyệt lối đi'. | Gán thuộc tính en: chuỗi 'Imperial City preview — walking paths pending approval'.
  title: { vi: 'Thứ tự tham khảo Hoàng thành — chưa duyệt lối đi', en: 'Imperial City preview — walking paths pending approval',
    // Gán thuộc tính cn: chuỗi '皇城参考顺序，步行路线待审核'. | Gán thuộc tính pt: chuỗi 'Ordem de visita da Cidade Imperial — percursos por aprovar'. | Gán thuộc tính ja: chuỗi '皇城の参考順序・歩行経路は未承認'.
    cn: '皇城参考顺序，步行路线待审核', pt: 'Ordem de visita da Cidade Imperial — percursos por aprovar', ja: '皇城の参考順序・歩行経路は未承認' },
  // Gán thuộc tính stops: tạo mảng ['ngo-mon', 'dien-thai-hoa', 'the-mieu', 'cung-dien-tho'].
  stops: ['ngo-mon', 'dien-thai-hoa', 'the-mieu', 'cung-dien-tho'],
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `verified: false, available: true,`: Gán thuộc tính verified: sử dụng false làm giá trị của bước hiện tại. Tách tọa độ tham khảo với tọa độ đã xác nhận. | Gán thuộc tính available: sử dụng true làm giá trị của bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `}]`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  verified: false, available: true,
}]

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Mở từng source để đối chiếu marker OSM.
 * - Tuyến tham khảo phải hiển thị nhãn chưa duyệt, không vẽ lối đi giả.
 */

// CHỨC NĂNG: Map, GPS và chi tiết ưu tiên tọa độ đang công bố từ cùng record Admin.
// XỬ LÝ: Chỉ dùng marker mặc định khi API cũ chưa có position; không gán nguồn OSM
// cũ cho tọa độ Admin đã chỉnh sang chỗ khác.
// Khai báo mapPointFor(place). Nhận đầu vào qua tham số.
export function mapPointFor(place: PlaceRecord): MapPoint | undefined {
  // Khai báo fallback: đọc MAP_POINTS[place.id] từ đối tượng/mảng để dùng tại bước hiện tại | Khai báo position: đọc place.position từ đối tượng/mảng để dùng tại bước hiện tại.
  const fallback = MAP_POINTS[place.id], position = place.position
  // Rẽ nhánh nếu !position || !validPoint(position). | Trả kết quả: sử dụng fallback làm giá trị của bước hiện tại.
  if (!position || !validPoint(position)) return fallback
  // Khai báo same: tính biểu thức fallback && Math.abs(position.lat-fallback.lat)<0.000001 && Math.abs(position.lng-fallback.
  const same = fallback && Math.abs(position.lat-fallback.lat)<0.000001 && Math.abs(position.lng-fallback.lng)<0.000001
  // Trả kết quả: tạo object gồm lat, lng, fieldVerified, source. | Gán thuộc tính lat: đọc position.lat từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính lng: đọc position.lng từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fieldVerified: đọc position.verified từ đối tượng/mảng để dùng tại bước hiện tại. Ghi trạng thái khảo sát thực địa của điểm bản đồ.
  return { lat: position.lat, lng: position.lng, fieldVerified: position.verified,
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `source: position.source ?? (same ? fallback.source : '') }`: Gán thuộc tính source: tính biểu thức position.source ?? (same ? fallback.source : '').
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
    source: position.source ?? (same ? fallback.source : '') }
}
// TẠI SAO (mapPointFor): Vị trí mới trong bản ghi nên được ưu tiên; chỉ dùng tọa độ tham khảo
// khi chưa có vị trí hợp lệ.
