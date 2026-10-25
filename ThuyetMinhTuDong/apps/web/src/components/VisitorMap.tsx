/**
 * FILE NÀY LÀM GÌ: Bản đồ Leaflet với marker là nút HTML, hỗ trợ bấm/Enter mở đúng chi tiết.
 * Vị trí: apps/web/src/components/VisitorMap.tsx. Liên quan UC01–UC11.
 * Phụ thuộc các import bên dưới; nghiệp vụ chung nằm trong visitor-core.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import { publishedText } from '@travelguide/visitor-core'
import { useText } from '../i18n/index'
import { useVisitor } from '../hooks/useVisitor'
import { useJourney } from '../hooks/useJourney'
import { mapPointFor } from '@travelguide/visitor-core/journey/data'
import 'leaflet/dist/leaflet.css'

export function VisitorMap({ selected }: { selected: string | null }) {
  const element = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const t = useText()
  const mapRef = useRef<L.Map | null>(null)
  const userLayer = useRef<L.LayerGroup | null>(null)
  const { state } = useJourney(), { language } = useVisitor(), navigate = useNavigate()
  const open = useCallback((id: string) => navigate('/places/' + id), [navigate])
  useEffect(() => {
    if (!element.current) return
    const map = L.map(element.current, { zoomAnimation: false }).setView([16.468, 107.578], 17)
    mapRef.current = map
    userLayer.current = L.layerGroup().addTo(map)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors', maxZoom: 19 }).on('tileerror', () => setFailed(true)).addTo(map)
    state.places.forEach(place => {
      const point = mapPointFor(place)
      if (!point) return
      const title = publishedText(place, language)?.title ?? place.canonicalTitle
      const label = document.createElement('span'); label.textContent = title
      // CHỨC NĂNG: Marker là nút HTML thật, bấm chuột hoặc Enter đều mở chi tiết.
      // XỬ LÝ: Không chèn tên từ API bằng innerHTML; tránh vùng bấm SVG quá nhỏ.
      const button = document.createElement('button')
      button.type = 'button'; button.textContent = '●'; button.setAttribute('aria-label', title)
      button.style.cssText = 'width:30px;height:30px;padding:0;border-radius:50%;background:white;color:#0759c7;border:2px solid #0759c7;font-size:20px;cursor:pointer'
      if (selected === place.id) button.style.backgroundColor = '#dbeafe'
      button.addEventListener('click', event => { event.stopPropagation(); open(place.id) })
      L.marker([point.lat, point.lng], { keyboard: false,
        icon: L.divIcon({ html: button, className: '', iconSize: [30, 30], iconAnchor: [15, 15] }) })
        .addTo(map).bindTooltip(label)
      if (selected === place.id) map.setView([point.lat, point.lng], 18)
    })
    return () => { map.remove(); mapRef.current = null; userLayer.current = null }
  }, [state.places, selected, language, open])
  useEffect(() => {
    userLayer.current?.clearLayers()
    if (state.fix && userLayer.current) L.circleMarker([state.fix.lat, state.fix.lng], { radius: 9, color: '#16813c' }).addTo(userLayer.current)
  }, [state.fix, state.places, selected, language, open])
  return <>{failed && <p role="alert">{t('loadError')}</p>}<div ref={element} role="region" aria-label={t('jMap')} style={{ height: 360, width: '100%' }} /></>
}
