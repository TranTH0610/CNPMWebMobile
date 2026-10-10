// CHỨC NĂNG: import i18n ĐẦU TIÊN để thư viện dịch được khởi tạo trước mọi màn hình.
import './src/i18n'
import { NavigationContainer } from '@react-navigation/native'
import RootNavigator from './src/navigation/RootNavigator'
import { SettingsProvider } from './src/store/SettingsContext'

export default function App() {
  return (
    <NavigationContainer>
      {/* CHỨC NĂNG: bọc ngoài RootNavigator để MỌI màn hình dùng được useSettings() */}
      <SettingsProvider>
        <RootNavigator />
      </SettingsProvider>
    </NavigationContainer>
  )
}