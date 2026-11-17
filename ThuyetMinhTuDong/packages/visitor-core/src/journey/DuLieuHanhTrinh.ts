/**
 * FILE: packages/visitor-core/src/journey/DuLieuHanhTrinh.ts
 * FILE NÀY LÀM GÌ: Cung cấp tọa độ và tuyến tham khảo; tuyến chưa được xác nhận không được coi là đường đi bộ đã kiểm chứng.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC06: Nhận diện di tích gần nhất bằng GPS.
 * - UC08: Xem bản đồ, tuyến tham quan và tìm đường.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { validPoint } from '../catalog/TimKiemVaBoLoc'
import type { PlaceRecord } from '../domain/KieuDuLieuDuKhach'
import type { MapPoint, VisitRoute } from './HanhTrinh'

// CHỨC NĂNG: Giữ nguồn của từng marker để người dùng kiểm tra tọa độ.
// XỬ LÝ: fieldVerified=false phân biệt dữ liệu bản đồ với khảo sát thực địa.
export const MAP_POINTS: Readonly<Record<string, MapPoint>> = {
  'ky-dai': { lat: 16.4663575, lng: 107.5802462, source: 'https://www.openstreetmap.org/way/218427614', fieldVerified: false },
  'ngo-mon': { lat: 16.4676824, lng: 107.5791834, source: 'https://www.openstreetmap.org/way/172657562', fieldVerified: false },
  'dien-thai-hoa': { lat: 16.4687434, lng: 107.5783867, source: 'https://www.openstreetmap.org/way/531031566', fieldVerified: false },
  'the-mieu': { lat: 16.4671614, lng: 107.5767398, source: 'https://www.openstreetmap.org/way/172657567', fieldVerified: false },
  'cung-dien-tho': { lat: 16.4688916, lng: 107.5754008, source: 'https://www.openstreetmap.org/way/172763420', fieldVerified: false },
  'truong-sanh-cung': { lat: 16.4697182, lng: 107.5746783, source: 'https://www.openstreetmap.org/way/172763427', fieldVerified: false },
  'dien-can-chanh': { lat: 16.4694768, lng: 107.5777963, source: 'https://www.openstreetmap.org/way/285990343', fieldVerified: false },
  
  'hien-lam-cac': { lat: 16.4667375, lng: 107.5770629, source: 'https://www.openstreetmap.org/way/172657564', fieldVerified: false },
}

export const VISIT_ROUTES: readonly VisitRoute[] = [{
  id: 'hue-preview',
  title: { vi: 'Thứ tự tham khảo Hoàng thành — chưa duyệt lối đi', en: 'Imperial City preview — walking paths pending approval',
    cn: '皇城参考顺序，步行路线待审核', pt: 'Ordem de visita da Cidade Imperial — percursos por aprovar', ja: '皇城の参考順序・歩行経路は未承認' },
  stops: ['ngo-mon', 'dien-thai-hoa', 'the-mieu', 'cung-dien-tho'],
  
  verified: false, available: true,
}]

/* CÁCH KIỂM TRA FILE NÀY CHẠY ĐÚNG:
 * - Mở từng source để đối chiếu marker OSM.
 * - Tuyến tham khảo phải hiển thị nhãn chưa duyệt, không vẽ lối đi giả.
 */

// CHỨC NĂNG: Map, GPS và chi tiết ưu tiên tọa độ đang công bố từ cùng record Admin.
// XỬ LÝ: Chỉ dùng marker mặc định khi API cũ chưa có position; không gán nguồn OSM
// cũ cho tọa độ Admin đã chỉnh sang chỗ khác.
// [UC06 / UC08] mapPointFor — Map, GPS và chi tiết ưu tiên tọa độ đang công bố từ cùng record Admin.
export function mapPointFor(place: PlaceRecord): MapPoint | undefined {
  const fallback = MAP_POINTS[place.id], position = place.position
  if (!position || !validPoint(position)) return fallback
  const same = fallback && Math.abs(position.lat-fallback.lat)<0.000001 && Math.abs(position.lng-fallback.lng)<0.000001
  // Trả kết quả: tạo object gồm lat, lng, fieldVerified, source. | Gán thuộc tính lat: đọc position.lat từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính lng: đọc position.lng từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng. | Gán thuộc tính fieldVerified: đọc position.verified từ đối tượng/mảng để dùng tại bước hiện tại. Ghi trạng thái khảo sát thực địa của điểm bản đồ.
  return { lat: position.lat, lng: position.lng, fieldVerified: position.verified,
    
    source: position.source ?? (same ? fallback.source : '') }
}
// TẠI SAO (mapPointFor): Vị trí mới trong bản ghi nên được ưu tiên; chỉ dùng tọa độ tham khảo
// khi chưa có vị trí hợp lệ.
