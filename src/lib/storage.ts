export type Kanana = {
  id: string
  name: string
  instructions: string
  createdAt: string
}

const STORAGE_KEY = 'kakaotalk:kanana_list'
const ACTIVE_KEY = 'kakaotalk:active_kanana'

function isBrowser() {
  return typeof window !== 'undefined'
}

export function readList(): Kanana[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Kanana[]
  } catch {
    return []
  }
}

export function saveList(list: Kanana[]) {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function normalizeName(name: string) {
  return (name || '').trim().replace(/\s+/g, ' ').toLowerCase()
}

export function addKanana(name: string, instructions: string): Kanana | null {
  if (!isBrowser()) return null
  const { v4: uuidv4 } = require('uuid')
  const item: Kanana = {
    id: uuidv4(),
    name,
    instructions,
    createdAt: new Date().toISOString(),
  }
  const current = readList()
  const n = normalizeName(name)
  // 동일 이름(공백 정규화 기준)은 중복 추가하지 않도록 제거 후 맨 앞에 추가
  const deduped = current.filter((x) => normalizeName(x.name) !== n)
  const next = [item, ...deduped]
  saveList(next)
  return item
}

export function removeKanana(id: string): Kanana[] {
  if (!isBrowser()) return []
  const current = readList()
  const next = current.filter((x) => x.id !== id)
  saveList(next)
  return next
}

export function removeKananaByName(name: string): Kanana[] {
  if (!isBrowser()) return []
  const n = normalizeName(name)
  const current = readList()
  const next = current.filter((x) => normalizeName(x.name) !== n)
  saveList(next)
  return next
}

export function setActiveKanana(k: Kanana | null) {
  if (!isBrowser()) return
  if (k) {
    window.localStorage.setItem(ACTIVE_KEY, JSON.stringify(k))
  } else {
    window.localStorage.removeItem(ACTIVE_KEY)
  }
  // 알림 이벤트 발행(브라우저 내부 통신)
  const evt = new CustomEvent('kanana:active-changed')
  window.dispatchEvent(evt)
}

export function getActiveKanana(): Kanana | null {
  if (!isBrowser()) return null
  try {
    const raw = window.localStorage.getItem(ACTIVE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Kanana
  } catch {
    return null
  }
}
