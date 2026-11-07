/**
 * CHỨC NĂNG: [DUNG-CHUNG]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Điểm export công khai của package; nơi dùng import tên package thay vì truy cập sâu vào file nội
 *
 * VỊ TRÍ: packages/admin-core/src/XuatCongKhai.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - Điểm vào/cấu hình/bộ test hoặc nơi dùng qua package; xem docs/BanDoChucNang.md.
 *
 * PHỤ THUỘC:
 * - ./domain/KieuDuLieuQuanTri
 * - ./domain/HopDongDichVu
 * - ./domain/KiemTraDuLieu
 * - ./services/XuLyNghiepVuQuanTri
 * - ./services/GoiApiQuanTri
 * - ./domain/XuLyAnhDiTich
 *
 * CÁC KHỐI CHÍNH:
 * 1. Khai báo kiểu/dữ liệu, ghép cấu hình hoặc xuất module.
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
export * from './domain/KieuDuLieuQuanTri'

export * from './domain/HopDongDichVu'

export * from './domain/KiemTraDuLieu'

export * from './services/XuLyNghiepVuQuanTri'
/* CÁCH KIỂM TRA: Import entry này trong test Node không được kéo React/DOM vào. */

export * from './services/GoiApiQuanTri'

// CHỨC NĂNG: Xuất thao tác ảnh form dùng chung, không kéo React vào logic thuần.
export * from './domain/XuLyAnhDiTich'
