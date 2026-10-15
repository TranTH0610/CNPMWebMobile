/**
 * FILE NÀY LÀM GÌ:
 * Khai báo route cho stack gốc, bottom tab và stack Khám phá.
 * Navigator và Home/Search dùng file này.
 * Phụ thuộc các type React Navigation và CategoryId.
 * Liên quan điều hướng UC03; giữ route cũ để không phá M1/Detail.
 */

import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native'

import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack'

import type {
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs'

import type {
  CategoryId,
} from '@travelguide/shared-types'

// CHỨC NĂNG: giữ tên route Home ở stack gốc.
// XỬ LÝ: Home giờ chứa tab, LanguageScreen vẫn replace('Home') được.
export type RootStackParamList = {
  Language: { change?: boolean } | undefined
  Home: undefined
  Detail: { placeId: string }
  AddPlace: undefined
  Settings: undefined
}

export type ExploreStackParamList = {
  ExploreHome: undefined
  SearchResults: {
    query: string
    category?: CategoryId | null
  }
}

export type MainTabParamList = {
  Explore:
    NavigatorScreenParams<ExploreStackParamList> | undefined
  Map: undefined
  Favorites: undefined
  Preferences: undefined
}

// CHỨC NĂNG: cho màn Khám phá dùng cả route nội bộ và route gốc.
// XỬ LÝ: CompositeScreenProps giữ kiểm tra kiểu cho navigate,
// không cần ép navigation thành any.
export type ExploreScreenProps<
  RouteName extends keyof ExploreStackParamList,
> = CompositeScreenProps<
  NativeStackScreenProps<
    ExploreStackParamList,
    RouteName
  >,
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, 'Explore'>,
    NativeStackScreenProps<RootStackParamList, 'Home'>
  >
>
