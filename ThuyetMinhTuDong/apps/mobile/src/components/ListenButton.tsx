/** FILE NÀY LÀM GÌ: Nút nghe chính có icon và trạng thái đồng bộ với player. */
import { useText } from '../i18n'
import { useVisitor } from '../hooks/useVisitor'
import { useJourney } from '../hooks/useJourney'
import { Action } from './Action'

export function ListenButton({ id }: { id: string }) {
  const { engine, state } = useJourney(), { language } = useVisitor(), t = useText()
  const same = state.session?.placeId === id && state.session.language === language
  const playing = same && state.status === 'playing'
  const paused = same && state.status === 'paused'
  const busy = state.status === 'loading'
  const label = t(busy ? 'jPreparing' : playing ? 'jPause' : paused ? 'jResume' : 'jPlay')
  // CHỨC NĂNG: Bấm lại cùng bài thì pause/resume, không tự phát lại từ đầu.
  const toggle = () => {
    if (playing) engine.pause()
    else if (paused) void engine.resume()
    else void engine.play(id, language)
  }
  return <Action title={label} icon={playing ? 'pause' : 'play'} variant="primary" disabled={busy} onPress={toggle} />
}
