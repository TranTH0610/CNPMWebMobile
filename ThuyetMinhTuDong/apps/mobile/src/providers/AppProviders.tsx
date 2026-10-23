/**
 * FILE NÀY LÀM GÌ: Ghép các provider mobile một lần tại gốc, giữ nguyên khóa lưu ngôn ngữ/tiến độ.
 * Vị trí: apps/mobile/src/providers/AppProviders.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import type { ReactNode } from 'react'
import { ActivityIndicator } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { getLocales } from 'expo-localization'
import { VisitorProvider } from '@travelguide/visitor-core/react'
import { JourneyProvider } from '@travelguide/visitor-core/journey/react'
import { boot } from '../i18n'
import { storage } from '../services/platform'
import { journeyAdapters } from '../services/journeyAdapters'

const deviceLanguage = getLocales()[0]?.languageTag ?? null
// CHỨC NĂNG: Giữ thứ tự provider để điều hướng, ngôn ngữ và phiên nghe dùng chung trạng thái.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <VisitorProvider
        boot={boot}
        storage={storage}
        deviceLanguage={deviceLanguage}
        loading={<ActivityIndicator />}
      >
        <JourneyProvider adapters={journeyAdapters}>
          {children}
        </JourneyProvider>
      </VisitorProvider>
    </SafeAreaProvider>
  )
}
