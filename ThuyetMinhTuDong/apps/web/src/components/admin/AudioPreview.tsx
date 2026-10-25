/** FILE NÀY LÀM GÌ: Nghe thử bản biên tập/kiểm duyệt bằng cùng HTML audio.
 * ContentEditorPage và ReviewsPage dùng; phụ thuộc resolver và coordinator chung.
 * UC14/UC15: pause giữ currentTime, resume không thay src hoặc tạo audio mới.
 */
import { useEffect, useRef } from 'react'
import { playbackCoordinator } from '@travelguide/visitor-core'
import { narrationSource } from '../../services/narrationSource'
export function AudioPreview({url}:{url:string}) {
  const ref=useRef<HTMLAudioElement>(null)
  useEffect(()=>{
    const audio=ref.current
    if(!audio)return
    // CHỨC NĂNG: Rời màn/đổi bài dừng và nhả nguồn đang nghe thử.
    return()=>{audio.pause();playbackCoordinator.release(audio)}
  },[url])
  return <audio ref={ref} controls preload="metadata" src={narrationSource(url,true)} onPlay={event=>{
    // XỬ LÝ: Bao gồm cả audio du khách do adapter tạo, không chỉ thẻ trong DOM.
    playbackCoordinator.claim(event.currentTarget)
  }} />
}
/* CÁCH KIỂM TRA: Pause tại 0:12, resume từ 0:12; bật bản khác làm bản trước pause. */
