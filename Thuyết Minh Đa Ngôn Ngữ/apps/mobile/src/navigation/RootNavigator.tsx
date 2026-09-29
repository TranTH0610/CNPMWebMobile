import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import DetailScreen from '../screens/DetailScreen'
import type { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ' }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Chi tiết' }} />
    </Stack.Navigator>
  )
}