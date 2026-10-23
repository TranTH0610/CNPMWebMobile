/**
 * FILE NÀY LÀM GÌ: Quét QR được phép và điều hướng tới hệ thống/địa điểm theo parser chung.
 * Vị trí: apps/mobile/src/screens/ScanScreen.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useEffect, useRef, useState } from 'react'
import { AppState, Linking, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useIsFocused } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { CatalogError, parseQrTarget } from '@travelguide/visitor-core'
import type { MessageKey } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { Action, State, ui } from '../components/index'
import { qrPolicy } from '../services/platform'
import type { VisitorStack } from '../navigation/types'

// CHỨC NĂNG: Kết nối camera với kiểm tra QR và điều hướng.
// XỬ LÝ: Kiểm tra cả định dạng QR lẫn trạng thái công bố của địa điểm.
export default function ScanScreen({
  navigation,
}: NativeStackScreenProps<VisitorStack, 'Scan'>) {
  const [
    permission,
    requestPermission,
    getPermission,
  ] = useCameraPermissions()

  const [message, setMessage] = useState<MessageKey | null>(null)
  const [busy, setBusy] = useState(false)
  const [manual, setManual] = useState('')

  const [active, setActive] = useState(
    AppState.currentState === 'active',
  )

  const focused = useIsFocused()
  const locked = useRef(false)
  const generation = useRef(0)
  const mounted = useRef(true)

  const { catalog } = useVisitor()
  const t = useText()

  // CHỨC NĂNG: Theo dõi app đang hoạt động hay chạy nền.
  // XỬ LÝ: Gỡ listener khi unmount để không nhận sự kiện thừa.
  useEffect(() => {
    mounted.current = true

    const listener = AppState.addEventListener(
      'change',
      (state) => setActive(state === 'active'),
    )

    return () => {
      mounted.current = false
      listener.remove()
    }
  }, [])

  // CHỨC NĂNG: Đọc lại quyền sau khi quay về từ cài đặt thiết bị.
  // XỬ LÝ: Chỉ đọc quyền; không tự bật hộp xin quyền.
  // Rời màn/chạy nền thì vô hiệu hóa request QR đang chờ.
  useEffect(() => {
    if (active && focused) {
      void getPermission().catch(
        () => setMessage('cameraFailed'),
      )
    }

    if (!active || !focused) {
      generation.current++
      locked.current = false
      setBusy(false)
    }
  }, [active, focused, getPermission])

  // CHỨC NĂNG: Xử lý một kết quả camera hoặc link dán thủ công.
  // XỬ LÝ:
  // - Khóa bằng ref trước await để nhiều frame không mở nhiều màn.
  // - Request chỉ được điều hướng khi vẫn còn hiệu lực.
  // - replace bỏ màn quét khỏi đỉnh stack sau khi thành công.
  const open = async (raw: string) => {
    if (locked.current || !focused) return

    locked.current = true
    setBusy(true)

    const request = ++generation.current

    const current = () =>
      mounted.current
      && generation.current === request

    try {
      // CHỨC NĂNG: Phân biệt QR vào chung và QR một điểm.
      // XỬ LÝ: QR chung không bị coi là lỗi thiếu ID.
      const target = parseQrTarget(raw, qrPolicy)

      if (target.kind === 'home') {
        if (current()) {
          navigation.replace('Places')
        }

        return
      }

      // CHỨC NĂNG: Kiểm tra điểm tồn tại và còn được công bố.
      // XỬ LÝ: Đúng định dạng QR chưa đủ để cho mở địa điểm.
      const id = target.id
      await catalog.get(id)

      if (current()) {
        navigation.replace('Detail', {
          placeId: id,
        })
      }
    } catch (error: unknown) {
      if (current()) {
        setMessage(
          error instanceof CatalogError
            ? 'notFound'
            : error instanceof Error
              && error.message === 'invalidQr'
              ? 'invalidQr'
              : 'loadError',
        )
      }
    } finally {
      if (current()) setBusy(false)
    }
  }

  // CHỨC NĂNG: Cho phép quét lại sau lỗi.
  // XỬ LÝ: Mở khóa và xóa thông báo trước khi gắn camera trở lại.
  const reset = () => {
    locked.current = false
    setMessage(null)
  }

  return (
    <SafeAreaView
      style={ui.page}
      edges={['bottom', 'left', 'right']}
    >
      <View style={[ui.content, { flex: 1 }]}>
        <Text style={ui.text}>{t('scanHint')}</Text>
        <Text style={ui.muted}>{t('browserOnly')}</Text>

        {!permission ? (
          <State message="loading" busy />
        ) : !permission.granted ? (
          <View style={ui.card}>
            <Text style={ui.text}>
              {t(
                permission.canAskAgain
                  ? 'cameraInfo'
                  : 'cameraDenied',
              )}
            </Text>

            <Action
              title={t(
                permission.canAskAgain
                  ? 'allowCamera'
                  : 'systemSettings',
              )}
              onPress={() => {
                if (permission.canAskAgain) {
                  void requestPermission().catch(
                    () => setMessage('cameraFailed'),
                  )
                } else {
                  void Linking.openSettings().catch(
                    () => setMessage('cameraFailed'),
                  )
                }
              }}
            />
          </View>
        ) : focused && active && !message ? (
          <CameraView
            style={{
              flex: 1,
              minHeight: 180,
            }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onMountError={() => setMessage('cameraFailed')}
            onBarcodeScanned={
              busy
                ? undefined
                : ({ data }) => {
                  void open(data)
                }
            }
          />
        ) : null}

        {busy && <State message="loading" busy />}

        {message && <State message={message} />}

        {message && (
          <Action
            title={t('again')}
            onPress={reset}
          />
        )}

        <TextInput
          style={ui.input}
          value={manual}
          onChangeText={setManual}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={t('enterQr')}
          accessibilityLabel={t('enterQr')}
        />

        <Action
          title={t('openQr')}
          disabled={busy || !manual.trim()}
          onPress={() => {
            void open(manual)
          }}
        />

        <Action
          title={t('back')}
          onPress={() => navigation.navigate('Places')}
        />
      </View>
    </SafeAreaView>
  )
}
