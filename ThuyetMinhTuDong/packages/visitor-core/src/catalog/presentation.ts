/**
 * FILE NÀY LÀM GÌ
 * Các hàm dẫn xuất giá trị hiển thị của địa điểm, giúp UI dùng thống nhất dữ liệu còn thiếu.
 *
 * VỊ TRÍ: packages/visitor-core/src/catalog/presentation.ts
 * DÙNG BỞI: packages/visitor-core/src/index.ts.
 * PHỤ THUỘC: ../data/photos; ../domain/model
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module giúp nơi sử dụng có một đầu mối nhất quán
 * và dễ bảo trì.
 */
// Nhập các thành phần từ '../data/photos'.
import { PLACE_PHOTOS } from '../data/photos'
// Nhập kiểu dữ liệu từ '../domain/model'.
import type { Category } from '../domain/model'

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
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `museum: '▤',`: Gán thuộc tính museum: chuỗi '▤'.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
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
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `licenseUrl: photo.licenseUrl,`: Gán thuộc tính licenseUrl: đọc photo.licenseUrl từ đối tượng/mảng để dùng tại bước hiện tại. Đặt tên trường để nơi nhận đọc đúng giá trị theo hợp đồng đối tượng.
   * DÒNG `}))`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  licenseUrl: photo.licenseUrl,
}))
