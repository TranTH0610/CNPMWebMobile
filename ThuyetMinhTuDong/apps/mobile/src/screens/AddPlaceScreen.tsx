import { useState } from 'react'
import { ActivityIndicator, Button, ScrollView, Text, TextInput } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../navigation/types'
import { LANGUAGES, type LangCode } from '../i18n'
import { fetchWikiSummary } from '../services/translate'
import { addPlace } from '../services/placeStore'

type Props = NativeStackScreenProps<RootStackParamList, 'AddPlace'>

const input = { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 }

export default function AddPlaceScreen({ navigation }: Props) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fromWiki = async () => {
    setLoading(true)
    setError('')
    try {
      setText(await fetchWikiSummary(title.trim(), 'vi'))
    } catch {
      setError('Không tìm thấy bài Wikipedia này')
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    const name = Object.fromEntries(LANGUAGES.map((l) => [l.code, title.trim()])) as Record<LangCode, string>
    await addPlace({ id: Date.now().toString(), name, description: { vi: text.trim() } })
    navigation.goBack()
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <TextInput style={input} placeholder="Tên địa điểm (vd: Chùa Một Cột)" value={title} onChangeText={setTitle} />
      <Button title="Lấy văn bản từ Wikipedia" onPress={fromWiki} disabled={!title.trim() || loading} />
      {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
      {error !== '' && <Text style={{ color: 'crimson', marginTop: 12 }}>{error}</Text>}
      <TextInput
        style={[input, { height: 200, textAlignVertical: 'top', marginTop: 16 }]}
        placeholder="Hoặc dán nội dung thuyết minh tiếng Việt vào đây"
        multiline
        value={text}
        onChangeText={setText}
      />
      <Button title="Lưu địa điểm" onPress={save} disabled={!title.trim() || !text.trim()} />
    </ScrollView>
  )
}