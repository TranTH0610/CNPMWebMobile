/**
 * FILE: packages/visitor-core/src/audio/DieuPhoiPhatAmThanh.ts
 * FILE NÀY LÀM GÌ: Điều phối quyền phát để nguồn mới yêu cầu nguồn đang giữ quyền tạm dừng; dùng cả nghe thuyết minh và nghe thử.
 * VAI TRÒ: Module dùng chung; được giao diện hoặc máy chủ gọi tùy chức năng.
 * UC LIÊN QUAN (bộ UC01–UC14 đã gộp):
 * - UC07: Nghe, điều khiển và tiếp tục phiên nghe.
 * - UC11: Soạn nội dung thuyết minh đa ngôn ngữ.
 * - UC12: Kiểm duyệt nội dung và âm thanh.
 * CÁCH ĐỌC: Tìm chú thích [UCxx] ngay trước hàm/khối để biết đoạn đó làm việc gì.
 * TRA CỨU ĐOẠN CODE: Xem docs/BanDoUCVaCode.md để mở đúng file và dòng.
 */
export type PlaybackOwner = { pause(): void }
export class PlaybackCoordinator {
  private owner?: PlaybackOwner
  // CHỨC NĂNG: Nguồn mới chiếm quyền phát trước khi gọi API play bất đồng bộ.
  // XỬ LÝ: Gán owner trước khi pause để sự kiện pause của nguồn cũ không xóa nguồn mới.
  // [UC07 / UC11 / UC12] claim — Chuyển quyền phát cho nguồn mới và yêu cầu nguồn đang giữ quyền tạm dừng.
  claim(owner: PlaybackOwner): void {
    const previous = this.owner
    this.owner = owner
    
    if (previous && previous !== owner) previous.pause()
  }
  // TẠI SAO (claim): Chỉ một chủ sở hữu phát tại một thời điểm giúp bài thuyết minh và nghe thử
  // không chồng âm trong cùng app.
  // CHỨC NĂNG: Kiểm tra nguồn có còn giữ quyền phát không.
  // XỬ LÝ: Một lời gọi play đang chờ có thể đã bị nguồn khác giành quyền trong lúc đợi.
  // [UC07 / UC11 / UC12] owns — Kiểm tra nguồn có còn giữ quyền phát không.
  owns(owner: PlaybackOwner): boolean { return this.owner === owner }
  // TẠI SAO (owns): Quyền phát có thể đổi trong khi await; kiểm tra lại ngăn một lệnh play cũ
  // giành phát trở lại.
  // CHỨC NĂNG: Trả quyền phát của nguồn hiện tại.
  // XỬ LÝ: Chỉ bỏ quyền nếu đúng chủ sở hữu để không ảnh hưởng nguồn mới.
  
  // [UC07 / UC11 / UC12] release — Nhả quyền phát nếu nguồn yêu cầu vẫn là chủ sở hữu hiện tại.
  release(owner: PlaybackOwner): void { if (this.owner === owner) this.owner = undefined }
  // TẠI SAO (release): Chỉ trả đúng quyền của mình để nguồn đóng muộn không xóa quyền của bài vừa
  // bắt đầu.
}
export const playbackCoordinator = new PlaybackCoordinator()
/* CÁCH KIỂM TRA: Bắt đầu B làm A pause; release A không xóa quyền B; resume A không tua về 0. */
