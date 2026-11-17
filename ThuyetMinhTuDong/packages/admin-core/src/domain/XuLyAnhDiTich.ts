/**
 * FILE: packages/admin-core/src/domain/XuLyAnhDiTich.ts
 * FILE NÀY LÀM GÌ: Chuẩn hóa danh sách ảnh, chọn ảnh đại diện và xóa/thay liên kết ảnh trong biểu mẫu.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC10: Quản lý di tích.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
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
export function selectCoverImage(value: string, image: string): string {
  // CHỨC NĂNG: Đưa ảnh vừa chọn lên đầu; giữ các ảnh khác và không tạo bản trùng.
  // TẠI SAO: Ảnh đầu được dùng ở card/chi tiết, nên preview và dữ liệu lưu phải cùng thứ tự.
  return [image, ...imageList(value).filter((item) => item !== image)].join('\n')
}
export function removePlaceImage(value: string, image: string): string {
  // CHỨC NĂNG: Bỏ đúng ảnh; xóa ảnh đầu sẽ tự dùng ảnh kế tiếp làm đại diện.
  return imageList(value)
    .filter((item) => item !== image)
    .join('\n')
}
export function editImageLinks(value: string, links: string): string {
  // CHỨC NĂNG: URL nhập tay đứng trước các tệp đang chọn; không bỏ các tệp chưa lưu.
  // XỬ LÝ: Không trim phần đang gõ để Enter vẫn tạo được dòng mới trong textarea/TextInput.
  const uploads = imageList(value).filter((item) => item.startsWith('data:'))
  return [links, ...uploads].filter(Boolean).join('\n')
}
