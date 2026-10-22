/**
 * FILE NÀY LÀM GÌ:
 * Chứa icon danh mục, ảnh hero và thông tin nguồn ảnh.
 * Card, hero và footer hai app sử dụng; liên quan UC02–UC04.
 * Không phụ thuộc API nền tảng.
 */

import type { Category } from './model'

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

export const HERO_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/DGJ_1178_-_Ngo_Mon_Gate_%283442074085%29.jpg/960px-DGJ_1178_-_Ngo_Mon_Gate_%283442074085%29.jpg'

// CHỨC NĂNG: Giữ thông tin nguồn ảnh đi cùng giao diện.
// XỬ LÝ: Không gắn ảnh công trình khác để lấp chỗ trống.
export const PHOTO_CREDITS = [
  {
    title: 'Ngọ Môn — Dennis G. Jarvis',
    url: 'https://commons.wikimedia.org/wiki/File:DGJ_1178_-_Ngo_Mon_Gate_(3442074085).jpg',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  {
    title: 'Thái Hòa — Bernard Gagnon',
    url: 'https://commons.wikimedia.org/wiki/File:Thai_Hoa_palace.jpg',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  {
    title: 'Thế Miếu — Jorge Cancela',
    url: 'https://commons.wikimedia.org/wiki/File:Inside_The_Mieu_Temple,_Hue_20130810.jpg',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
]