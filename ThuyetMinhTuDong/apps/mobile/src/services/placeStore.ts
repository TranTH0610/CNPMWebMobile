import AsyncStorage from '@react-native-async-storage/async-storage'
import { PLACES, type Place } from './places'

const PLACES_KEY = 'places:custom'
const TRANS_KEY = 'translations'

async function loadCustomPlaces(): Promise<Place[]> {
  const raw = await AsyncStorage.getItem(PLACES_KEY)
  return raw ? (JSON.parse(raw) as Place[]) : []
}

export async function loadAllPlaces(): Promise<Place[]> {
  return [...PLACES, ...(await loadCustomPlaces())]
}

export async function getPlace(id: string): Promise<Place | undefined> {
  return (await loadAllPlaces()).find((p) => p.id === id)
}

export async function addPlace(place: Place) {
  const list = await loadCustomPlaces()
  await AsyncStorage.setItem(PLACES_KEY, JSON.stringify([...list, place]))
}

async function loadTranslations(): Promise<Record<string, string>> {
  const raw = await AsyncStorage.getItem(TRANS_KEY)
  return raw ? JSON.parse(raw) : {}
}

export async function getSavedTranslation(key: string) {
  return (await loadTranslations())[key]
}

export async function saveTranslation(key: string, value: string) {
  const map = await loadTranslations()
  map[key] = value
  await AsyncStorage.setItem(TRANS_KEY, JSON.stringify(map))
}