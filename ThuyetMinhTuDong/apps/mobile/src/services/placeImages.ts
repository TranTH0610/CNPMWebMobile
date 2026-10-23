/** FILE NÀY LÀM GÌ: Đổi mã photo:ID thành JPG Metro đóng gói để native có ảnh khi mất mạng. */
import type { ImageSourcePropType } from 'react-native'
import photo0 from '../../assets/places/truong-sanh-cung.jpg'
import photo1 from '../../assets/places/ngo-mon.jpg'
import photo2 from '../../assets/places/cung-dien-tho.jpg'
import photo3 from '../../assets/places/hien-lam-cac.jpg'
import photo4 from '../../assets/places/ky-dai.jpg'
import photo5 from '../../assets/places/the-mieu.jpg'
import photo6 from '../../assets/places/dien-can-chanh.jpg'
import photo7 from '../../assets/places/dien-thai-hoa.jpg'
const assets: Record<string, number> = { 'truong-sanh-cung': photo0, 'ngo-mon': photo1, 'cung-dien-tho': photo2, 'hien-lam-cac': photo3, 'ky-dai': photo4, 'the-mieu': photo5, 'dien-can-chanh': photo6, 'dien-thai-hoa': photo7 }
export function resolvePlaceImage(uri?: string): ImageSourcePropType | undefined {
  if (!uri) return undefined
  if (!uri.startsWith('photo:')) return { uri }
  return assets[uri.slice(6)]
}
