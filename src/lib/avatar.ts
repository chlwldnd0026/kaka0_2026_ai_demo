export function getFirstWord(name: string) {
  const parts = (name || '').trim().split(/\s+/)
  return parts[0] || '카나나'
}

export function getInitials(name: string) {
  const first = getFirstWord(name)
  return first.slice(0, 2)
}

export function colorFor(name: string) {
  const palette = ['FEE500','93C5FD','A5B4FC','FCA5A5','6EE7B7','FBCFE8','FDE68A','A5F3FC','C7D2FE','86EFAC']
  const s = name || 'seed'
  let hash = 0
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0
  return palette[hash % palette.length]
}

export function dicebearUrl(name: string) {
  const first = getFirstWord(name)
  const seed = encodeURIComponent(first)
  const initials = encodeURIComponent(getInitials(name))
  const bg = colorFor(first)
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&letters=${initials}&chars=${initials}&size=64&fontSize=30&radius=32&backgroundColor=${bg}`
}

export function initialsSvgData(initials: string, seedForColor: string) {
  const bg = colorFor(seedForColor)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>
    <rect width='100%' height='100%' rx='32' ry='32' fill='#${bg}'/>
    <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' font-weight='700' fill='#45332E'>${initials}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

