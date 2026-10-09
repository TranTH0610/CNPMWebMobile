// CHỨC NĂNG: import i18n ĐẦU TIÊN để chắc chắn thư viện dịch được khởi tạo
// trước khi bất kỳ màn hình nào gọi useTranslation().
import './src/i18n'
import { NavigationContainer } from '@react-navigation/native'
import RootNavigator from './src/navigation/RootNavigator'

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}