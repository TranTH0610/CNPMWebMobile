/**
 * CHỨC NĂNG: [THUYET-MINH]
 * VAI TRÒ: LOGIC / DỮ LIỆU DÙNG CHUNG
 *
 * FILE NÀY LÀM GÌ:
 * Bộ điều phối quyền phát trong cùng ứng dụng; yêu cầu nguồn trước tạm dừng khi nguồn mới nhận
 *
 * VỊ TRÍ: packages/visitor-core/src/audio/DieuPhoiPhatAmThanh.ts
 *
 * ĐƯỢC DÙNG BỞI:
 * - packages/visitor-core/src/XuatCongKhai.ts
 *
 * PHỤ THUỘC:
 * - Không import module khác.
 *
 * CÁC KHỐI CHÍNH:
 * 1. PlaybackCoordinator
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
 */
// Đặt tên kiểu PlaybackOwner.
export type PlaybackOwner = { pause(): void }
// Khai báo lớp PlaybackCoordinator.
// ==================== [THUYET-MINH] PlaybackCoordinator ====================
// CHỨC NĂNG: Thực hiện bước PlaybackCoordinator trong nhiệm vụ: Bộ điều phối quyền phát trong cùng ứng dụng; yêu cầu nguồn trước tạm dừng khi nguồn mới nhận
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tập trung trách nhiệm của module để nơi gọi có một đầu mối dễ tìm và bảo trì.
export class PlaybackCoordinator {
  // Khai báo owner không bắt buộc, kiểu PlaybackOwner.
  private owner?: PlaybackOwner
  // CHỨC NĂNG: Nguồn mới chiếm quyền phát trước khi gọi API play bất đồng bộ.
  // XỬ LÝ: Gán owner trước khi pause để sự kiện pause của nguồn cũ không xóa nguồn mới.
  // Khai báo claim(owner). Nhận đầu vào qua tham số.
  claim(owner: PlaybackOwner): void {
    // Khai báo previous: đọc this.owner từ đối tượng/mảng để dùng tại bước hiện tại.
    const previous = this.owner
    // Thực hiện tính biểu thức this.owner = owner.
    this.owner = owner
    
    if (previous && previous !== owner) previous.pause()
  }
  // TẠI SAO (claim): Chỉ một chủ sở hữu phát tại một thời điểm giúp bài thuyết minh và nghe thử
  // không chồng âm trong cùng app.
  // CHỨC NĂNG: Kiểm tra nguồn có còn giữ quyền phát không.
  // XỬ LÝ: Một lời gọi play đang chờ có thể đã bị nguồn khác giành quyền trong lúc đợi.
  // Khai báo owns(owner). Nhận đầu vào qua tham số. | Trả kết quả: tính biểu thức this.owner === owner.
  owns(owner: PlaybackOwner): boolean { return this.owner === owner }
  // TẠI SAO (owns): Quyền phát có thể đổi trong khi await; kiểm tra lại ngăn một lệnh play cũ
  // giành phát trở lại.
  // CHỨC NĂNG: Trả quyền phát của nguồn hiện tại.
  // XỬ LÝ: Chỉ bỏ quyền nếu đúng chủ sở hữu để không ảnh hưởng nguồn mới.
  
  release(owner: PlaybackOwner): void { if (this.owner === owner) this.owner = undefined }
  // TẠI SAO (release): Chỉ trả đúng quyền của mình để nguồn đóng muộn không xóa quyền của bài vừa
  // bắt đầu.
}
// Khai báo playbackCoordinator: Tạo đối tượng bằng new PlaybackCoordinator().
export const playbackCoordinator = new PlaybackCoordinator()
/* CÁCH KIỂM TRA: Bắt đầu B làm A pause; release A không xóa quyền B; resume A không tua về 0. */
