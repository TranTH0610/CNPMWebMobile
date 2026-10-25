/** FILE NÀY LÀM GÌ: Hiện nguồn bài và ghi công Wikipedia trên native.
 * DetailScreen và ContentEditorScreen dùng; phụ thuộc Action, i18n và PublishedText.
 * UC04/UC14: dùng metadata cùng web, không tự tạo một danh sách nguồn khác.
 */
import { Alert, Linking, Text, View } from 'react-native'
import type { PublishedText } from '@travelguide/visitor-core'
import { useText } from '../i18n'
import { Action } from './Action'
import { ui } from './index'
export function ContentSources({ text }: { text?: PublishedText }) {
  const t = useText()
  if (!text?.sources?.length) return null
  // CHỨC NĂNG: Mở bài gốc bằng trình duyệt; lỗi mở link có thông báo rõ.
  const open = (url: string) => { void Linking.openURL(url).catch(() => Alert.alert(t('heritageSources'), t('websiteError'))) }
  return <View style={ui.card}>
    <Text style={ui.heading}>{t('heritageSources')}</Text>
    <Text style={ui.muted}>{t('heritageCredit')}</Text>
    {text.sources.map(source => <View key={source.url}>
      <Action title={'Wikipedia · ' + source.title} onPress={() => open(source.url)} />
      <Text style={ui.muted}>{t('heritageChecked')}: {source.accessedAt}</Text>
      <Action title={source.license} onPress={() => open(source.licenseUrl)} />
    </View>)}
    {text.audio?.url.startsWith('narration:') && <Text style={ui.muted}>{t('heritageSynthetic')}</Text>}
  </View>
}
/* CÁCH KIỂM TRA: Nguồn khớp di tích; nhãn đổi theo ngôn ngữ; lỗi mở trình duyệt hiện thông báo. */
