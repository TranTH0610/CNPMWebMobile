/**
 * FILE NÀY LÀM GÌ:
 * Nút sắp xếp mở bảng lựa chọn bằng Modal.
 * Home/Search dùng; phụ thuộc SortOrder, i18n và theme.
 * Liên quan UC03, sắp xếp theo tên/đánh giá/khoảng cách.
 */

import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import type { SortOrder } from '@travelguide/place-core'

import {
  colors,
  spacing,
  radii,
  sizes,
  ui,
} from '../theme'

type Props = {
  value: SortOrder
  open: boolean
  onOpen: () => void
  onClose: () => void
  onChange: (order: SortOrder) => void
}

const orders: SortOrder[] = [
  'nearest',
  'name',
  'rating',
]

export default function SortDropdown({
  value,
  open,
  onOpen,
  onClose,
  onChange,
}: Props) {
  const { t } = useTranslation()

  return (
    <>
      <Pressable
        style={styles.trigger}
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={t('explore.sort')}
      >
        <Text style={ui.muted}>
          {t(`explore.sort_${value}`)}
        </Text>

        <Ionicons
          name="chevron-down"
          size={sizes.icon}
          color={colors.muted}
        />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.backdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessibilityLabel={t('explore.close')}
          />

          <View
            style={styles.sheet}
            accessibilityViewIsModal
          >
            <View style={ui.between}>
              <Text style={ui.section}>
                {t('explore.sort')}
              </Text>

              <Pressable
                style={ui.iconButton}
                onPress={onClose}
                accessibilityLabel={t('explore.close')}
              >
                <Ionicons
                  name="close"
                  size={sizes.icon}
                  color={colors.text}
                />
              </Pressable>
            </View>

            {orders.map((order) => (
              <Pressable
                key={order}
                style={styles.option}
                accessibilityRole="radio"
                accessibilityState={{
                  selected: value === order,
                }}
                onPress={() => {
                  onChange(order)
                  onClose()
                }}
              >
                <Text style={ui.body}>
                  {t(`explore.sort_${order}`)}
                </Text>

                {value === order && (
                  <Ionicons
                    name="checkmark"
                    size={sizes.icon}
                    color={colors.primary}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  trigger: {
    minHeight: sizes.touch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: colors.background,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
  },
  option: {
    minHeight: sizes.touch,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})