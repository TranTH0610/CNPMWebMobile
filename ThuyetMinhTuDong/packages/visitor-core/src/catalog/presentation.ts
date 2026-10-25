/**
 * FILE NÀY LÀM GÌ:
 * Chứa icon danh mục, ảnh hero và thông tin nguồn ảnh.
 * Card, hero và footer hai app sử dụng; liên quan UC02–UC04.
 * Không phụ thuộc API nền tảng.
 */

import { PLACE_PHOTOS } from '../data/photos'
import type { Category } from '../domain/model'

// CHỨC NĂNG: Cung cấp ký hiệu danh mục.
// XỬ LÝ: Tên hiển thị lấy qua i18n, không nằm trong object này.
export const categoryIcons: Record<Category, string> = {
  monument: '⚑',
  palace: '▥',
  gate: '▣',
  temple: '♜',
  tomb: '▰',
  museum: '▤',
}

// CHỨC NĂNG: Hero và nguồn ảnh dùng cùng danh mục đã kiểm tra.
export const HERO_IMAGE = 'photo:ngo-mon'
export const PHOTO_CREDITS = Object.values(PLACE_PHOTOS).map(photo => ({
  title: photo.title + ' — ' + photo.author,
  url: photo.url,
  license: photo.license,
  licenseUrl: photo.licenseUrl,
}))
