/**
 * FILE: packages/visitor-core/src/catalog/DuLieuHienThi.ts
 * FILE NÀY LÀM GÌ: Các hàm dẫn xuất giá trị hiển thị của địa điểm, giúp UI dùng thống nhất dữ liệu còn thiếu.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC02: Xem danh sách di tích.
 * - UC03: Tìm kiếm, lọc và sắp xếp.
 * - UC04: Xem chi tiết và đọc thuyết minh.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
import { PLACE_PHOTOS } from '../data/DanhMucAnh'
import type { Category } from '../domain/KieuDuLieuDuKhach'

// CHỨC NĂNG: Cung cấp ký hiệu danh mục.
// XỬ LÝ: Tên hiển thị lấy qua i18n, không nằm trong object này.
export const categoryIcons: Record<Category, string> = {
  monument: '⚑',
  palace: '▥',
  gate: '▣',
  temple: '♜',
  tomb: '▰',
  
  museum: '▤',
}

// CHỨC NĂNG: Hero và nguồn ảnh dùng cùng danh mục đã kiểm tra.
export const HERO_IMAGE = 'photo:ngo-mon'
export const PHOTO_CREDITS = Object.values(PLACE_PHOTOS).map(photo => ({
  title: photo.title + ' — ' + photo.author,
  url: photo.url,
  license: photo.license,
  
  licenseUrl: photo.licenseUrl,
}))
