/**
 * FILE NÀY LÀM GÌ
 * Bộ điều phối quyền phát trong cùng ứng dụng; yêu cầu nguồn trước tạm dừng khi nguồn mới nhận
 * quyền.
 *
 * VỊ TRÍ: packages/visitor-core/src/audio/playback.ts
 * DÙNG BỞI: packages/visitor-core/src/index.ts.
 * TẠI SAO TÁCH FILE: Logic dùng chung cần tách khỏi thiết bị để web và native điều khiển cùng
 * một nghiệp vụ.
 */
// Đặt tên kiểu PlaybackOwner.
export type PlaybackOwner = { pause(): void }
// Khai báo lớp PlaybackCoordinator.
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
    /* GIẢI THÍCH TỪNG DÒNG:
     * DÒNG `if (previous && previous !== owner) previous.pause()`: Rẽ nhánh nếu previous && previous !== owner. | Thực hiện previous.pause tạm dừng nguồn âm thanh hiện tại.
     * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
     */
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
  /* GIẢI THÍCH TỪNG DÒNG:
   * DÒNG `release(owner: PlaybackOwner): void { if (this.owner === owner) this.owner = undefine`: Khai báo release(owner). Nhận đầu vào qua tham số. | Rẽ nhánh nếu this.owner === owner. | Thực hiện tính biểu thức this.owner = undefined.
   * DÒNG `}`: Kết thúc khối lệnh hoặc đối tượng đang viết.
   */
  release(owner: PlaybackOwner): void { if (this.owner === owner) this.owner = undefined }
  // TẠI SAO (release): Chỉ trả đúng quyền của mình để nguồn đóng muộn không xóa quyền của bài vừa
  // bắt đầu.
}
// Khai báo playbackCoordinator: Tạo đối tượng bằng new PlaybackCoordinator().
export const playbackCoordinator = new PlaybackCoordinator()
/* CÁCH KIỂM TRA: Bắt đầu B làm A pause; release A không xóa quyền B; resume A không tua về 0. */
