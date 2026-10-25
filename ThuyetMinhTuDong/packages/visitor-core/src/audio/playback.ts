/** FILE NÀY LÀM GÌ: Giữ quyền phát duy nhất giữa bài du khách và nghe thử Admin.
 * Adapter native/web và AdminAudioPreview dùng; không phụ thuộc React/thiết bị.
 * UC07/UC14: đổi nguồn chỉ tạm dừng nguồn trước, giữ vị trí để có thể tiếp tục.
 */
export type PlaybackOwner = { pause(): void }
export class PlaybackCoordinator {
  private owner?: PlaybackOwner
  // CHỨC NĂNG: Nguồn mới chiếm quyền phát trước khi gọi API play bất đồng bộ.
  // XỬ LÝ: Gán owner trước khi pause để sự kiện pause của nguồn cũ không xóa nguồn mới.
  claim(owner: PlaybackOwner): void {
    const previous = this.owner
    this.owner = owner
    if (previous && previous !== owner) previous.pause()
  }
  owns(owner: PlaybackOwner): boolean { return this.owner === owner }
  release(owner: PlaybackOwner): void { if (this.owner === owner) this.owner = undefined }
}
export const playbackCoordinator = new PlaybackCoordinator()
/* CÁCH KIỂM TRA: Bắt đầu B làm A pause; release A không xóa quyền B; resume A không tua về 0. */
