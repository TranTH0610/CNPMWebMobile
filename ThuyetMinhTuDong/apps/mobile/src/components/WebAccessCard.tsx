/**
 * FILE NÀY LÀM GÌ: Thẻ mở/chia sẻ website và trang QR chung từ mobile.
 * Vị trí: apps/mobile/src/components/WebAccessCard.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useEffect, useRef, useState } from 'react'
import { Linking, Share, Text, View } from 'react-native'
import { useText } from '../i18n/index'
import { webOrigin } from '../services/platform'
import { Action, ui } from './index'

export default function WebAccessCard() {
  const t = useText()

  const [failed, setFailed] =
    useState(false)

  const alive = useRef(true)

  // CHỨC NĂNG: Theo dõi component còn trên màn hình hay không.
  // XỬ LÝ: Hộp chia sẻ hoặc trình duyệt có thể trả kết quả
  // sau khi người dùng đã rời màn Cài đặt.
  useEffect(() => {
    alive.current = true

    return () => {
      alive.current = false
    }
  }, [])

  // CHỨC NĂNG: Mở website hoặc trang hiển thị QR chung.
  // XỬ LÝ: Dùng URL website đã cấu hình, không tạo liên kết exp://.
  const open = async (qr: boolean) => {
    if (!webOrigin) {
      return
    }

    setFailed(false)

    try {
      await Linking.openURL(
        webOrigin + (qr ? '/qr' : '/'),
      )
    } catch {
      if (alive.current) {
        setFailed(true)
      }
    }
  }

  // CHỨC NĂNG: Chia sẻ cùng một URL cho thiết bị khác.
  // XỬ LÝ: Người nhận mở bằng trình duyệt thông thường.
  const share = async () => {
    if (!webOrigin) {
      return
    }

    setFailed(false)

    try {
      await Share.share({
        message: webOrigin + '/',
        url: webOrigin + '/',
      })
    } catch {
      if (alive.current) {
        setFailed(true)
      }
    }
  }

  return (
    <View style={ui.card}>
      <Text style={ui.heading}>
        {t('generalQr')}
      </Text>

      <Text style={ui.muted}>
        {t('browserOnly')}
      </Text>

      {webOrigin ? (
        <>
          <Text
            selectable
            style={ui.text}
          >
            {webOrigin + '/'}
          </Text>

          <Action
            title={t('openWebsite')}
            onPress={() => {
              void open(false)
            }}
          />

          <Action
            title={t('qrAccess')}
            onPress={() => {
              void open(true)
            }}
          />

          <Action
            title={t('shareWebsite')}
            onPress={() => {
              void share()
            }}
          />
        </>
      ) : (
        <Text style={ui.muted}>
          {t('qrSetup')}
        </Text>
      )}

      {failed && (
        <Text
          accessibilityRole="alert"
          style={ui.muted}
        >
          {t('websiteError')}
        </Text>
      )}
    </View>
  )
}
