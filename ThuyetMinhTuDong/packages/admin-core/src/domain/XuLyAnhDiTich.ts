/**
 * CHỨC NĂNG: [TAI-NGUYEN]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Các thao tác ảnh đang nhập trong form, dùng chung cho web/mobile.
 *
 * VỊ TRÍ: packages/admin-core/src/domain/XuLyAnhDiTich.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/admin-core/src/XuatCongKhai.ts
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. imageList
 * 2. selectCoverImage
 * 3. removePlaceImage
 * 4. editImageLinks
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// ==================== [TAI-NGUYEN] imageList ====================
export function imageList(value: string): string[] {
  // CHỨC NĂNG: Tách danh sách để xem trước và thao tác; giữ nguyên chuỗi gốc khi đang gõ URL.
  return [
    ...new Set(
      value
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ]
}
// ==================== [TAI-NGUYEN] selectCoverImage ====================
// CHỨC NĂNG: Thực hiện bước selectCoverImage trong nhiệm vụ: Các thao tác ảnh đang nhập trong form, dùng chung cho web/mobile.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function selectCoverImage(value: string, image: string): string {
  // CHỨC NĂNG: Đưa ảnh vừa chọn lên đầu; giữ các ảnh khác và không tạo bản trùng.
  // TẠI SAO: Ảnh đầu được dùng ở card/chi tiết, nên preview và dữ liệu lưu phải cùng thứ tự.
  return [image, ...imageList(value).filter((item) => item !== image)].join('\n')
}
// ==================== [TAI-NGUYEN] removePlaceImage ====================
// CHỨC NĂNG: Thực hiện bước removePlaceImage trong nhiệm vụ: Các thao tác ảnh đang nhập trong form, dùng chung cho web/mobile.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function removePlaceImage(value: string, image: string): string {
  // CHỨC NĂNG: Bỏ đúng ảnh; xóa ảnh đầu sẽ tự dùng ảnh kế tiếp làm đại diện.
  return imageList(value)
    .filter((item) => item !== image)
    .join('\n')
}
// ==================== [TAI-NGUYEN] editImageLinks ====================
// CHỨC NĂNG: Thực hiện bước editImageLinks trong nhiệm vụ: Các thao tác ảnh đang nhập trong form, dùng chung cho web/mobile.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export function editImageLinks(value: string, links: string): string {
  // CHỨC NĂNG: URL nhập tay đứng trước các tệp đang chọn; không bỏ các tệp chưa lưu.
  // XỬ LÝ: Không trim phần đang gõ để Enter vẫn tạo được dòng mới trong textarea/TextInput.
  const uploads = imageList(value).filter((item) => item.startsWith('data:'))
  return [links, ...uploads].filter(Boolean).join('\n')
}
