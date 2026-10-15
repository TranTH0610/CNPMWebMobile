/**
 * FILE NÀY LÀM GÌ:
 * Khởi tạo i18n, safe area, navigation và settings của ứng dụng.
 * Expo gọi App; phụ thuộc provider và RootNavigator.
 * Giữ SettingsProvider hiện có.
 */

import './src/i18n'

import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import RootNavigator from './src/navigation/RootNavigator'
import { SettingsProvider } from './src/store/SettingsContext'

export default function App() {
  return (
