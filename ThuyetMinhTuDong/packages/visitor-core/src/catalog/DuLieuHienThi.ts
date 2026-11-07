/**
 * CHỨC NĂNG: [KHAM-PHA]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Các hàm dẫn xuất giá trị hiển thị của địa điểm, giúp UI dùng thống nhất dữ liệu còn thiếu.
 *
 * VỊ TRÍ: packages/visitor-core/src/catalog/DuLieuHienThi.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/visitor-core/src/XuatCongKhai.ts
 *
 * PHỤ THUỘC:
 * - ../data/DanhMucAnh
 * - ../domain/KieuDuLieuDuKhach
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Nhập các thành phần từ '../data/DanhMucAnh'.
import { PLACE_PHOTOS } from '../data/DanhMucAnh'
// Nhập kiểu dữ liệu từ '../domain/KieuDuLieuDuKhach'.
import type { Category } from '../domain/KieuDuLieuDuKhach'

// CHỨC NĂNG: Cung cấp ký hiệu danh mục.
// XỬ LÝ: Tên hiển thị lấy qua i18n, không nằm trong object này.
// Khai báo categoryIcons: tạo object gồm monument, palace, gate, temple, tomb, museum.
export const categoryIcons: Record<Category, string> = {
  // Gán thuộc tính monument: chuỗi '⚑'.
  monument: '⚑',
  // Gán thuộc tính palace: chuỗi '▥'.
  palace: '▥',
  // Gán thuộc tính gate: chuỗi '▣'.
  gate: '▣',
  // Gán thuộc tính temple: chuỗi '♜'.
  temple: '♜',
  // Gán thuộc tính tomb: chuỗi '▰'.
  tomb: '▰',
  
  museum: '▤',
}

// CHỨC NĂNG: Hero và nguồn ảnh dùng cùng danh mục đã kiểm tra.
// Khai báo HERO_IMAGE: chuỗi 'photo:ngo-mon'.
export const HERO_IMAGE = 'photo:ngo-mon'
// Khai báo PHOTO_CREDITS: Object.values(PLACE_PHOTOS).map tạo mảng kết quả từ từng phần tử, dùng cho dữ liệu dẫn xuất hoặc danh sách thành phần.
export const PHOTO_CREDITS = Object.values(PLACE_PHOTOS).map(photo => ({
  // Gán thuộc tính title: tính biểu thức photo.title + ' — ' + photo.author.
  title: photo.title + ' — ' + photo.author,
  // Gán thuộc tính url: đọc photo.url từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  url: photo.url,
  // Gán thuộc tính license: đọc photo.license từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
  license: photo.license,
  
  licenseUrl: photo.licenseUrl,
}))
