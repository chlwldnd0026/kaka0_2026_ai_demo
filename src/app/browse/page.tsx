'use client'

import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import KakaoHeader from '@/components/KakaoHeader'
import { PRESET_TEMPLATES } from '@/lib/templates'
import { addKanana } from '@/lib/storage'
import { useRouter } from 'next/navigation'
import { KakaoPrimaryButton } from '@/components/ui'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #0f172a;
  color: #e5e7eb;
  /* 다크 배경에서 헤더/아이콘 색상을 밝게 보이도록 변수 오버라이드 */
  --text-primary-color: #e5e7eb;
`

const PageBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 80px;
`

const Controls = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`

const Input = styled.input`
  flex: 1;
  background: #0b1222;
  border: 1px solid #23314d;
  border-radius: 22px;
  padding: 10px 14px;
  color: #e5e7eb;
  font-size: 15px;
  &::placeholder { color: #94a3b8; }
  &:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(254,229,0,0.2); border-color: #2e4063; }
`

const SecondaryButton = styled.button`
  background: #0b1222;
  color: #e5e7eb;
  border: 1px solid #23314d;
  border-radius: 10px;
  padding: 12px 14px;
`

const PrimaryButton = styled(KakaoPrimaryButton)`
  height: 40px;
  padding: 0 14px;
  font-size: 14px;
  line-height: 40px; /* 높이와 동일하게 설정하여 수직 정렬 + 줄바꿈 방지 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(254,229,0,0.25);
  white-space: nowrap; /* 줄바꿈 방지 */
  word-break: keep-all; /* 한국어 단어 단위 유지 */
  min-width: 64px; /* 좁은 컨테이너에서도 줄바꿈 방지 */
`

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  background: #111827;
  border: 1px solid #23314d;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.25);
`

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Tag = styled.span`
  display: inline-block;
  font-size: 12px;
  color: #cbd5e1;
`

const Chips = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`

const Chip = styled.button<{ $active?: boolean }>`
  border: 1px solid #23314d;
  padding: 6px 10px;
  border-radius: 16px;
  background: ${(p) => (p.$active ? 'var(--primary-color)' : '#0b1222')};
  color: ${(p) => (p.$active ? 'var(--action-color)' : '#e5e7eb')};
`

const AvatarImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #23314d;
  background: #0b1222;
  object-fit: cover;
`

export default function BrowsePage() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<'전체' | '생산성' | '여행' | '학습'>('전체')

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    const byQuery = (t: typeof PRESET_TEMPLATES[number]) =>
      !query || t.name.toLowerCase().includes(query) || (t.description ?? '').toLowerCase().includes(query)
    const byCat = (t: typeof PRESET_TEMPLATES[number]) => cat === '전체' || t.category === cat
    return PRESET_TEMPLATES.filter((t) => byQuery(t) && byCat(t))
  }, [q, cat])

  function handleDownload(name: string, instructions: string) {
    addKanana(name, instructions)
    router.push('/')
  }

  return (
    <Page>
      <KakaoHeader title="카나나 플래닛" />
      <PageBody>
        <Controls>
          <Input
            placeholder="검색 (예: 여행, 회의)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <SecondaryButton onClick={() => router.back()}>닫기</SecondaryButton>
        </Controls>

        <Chips>
          {(['전체', '생산성', '여행', '학습'] as const).map((c) => (
            <Chip key={c} $active={cat === c} onClick={() => setCat(c)} aria-pressed={cat === c}>
              #{c}
            </Chip>
          ))}
        </Chips>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((t) => (
            <Card key={t.name}>
              <Meta>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <InitialAvatar name={t.name} />
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#ffffff' }}>{t.name}</div>
                </div>
                <Tag>#{t.category}</Tag>
                {t.description && (
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>{t.description}</div>
                )}
              </Meta>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PrimaryButton onClick={() => handleDownload(t.name, t.instructions)}>추가</PrimaryButton>
              </div>
            </Card>
          ))}
        </div>
      </PageBody>
    </Page>
  )
}

function getFirstWord(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts[0] || '카나나'
}

function getInitials(name: string) {
  const first = getFirstWord(name)
  return first.slice(0, 2)
}

function colorFor(name: string) {
  const palette = ['FEE500','93C5FD','A5B4FC','FCA5A5','6EE7B7','FBCFE8','FDE68A','A5F3FC','C7D2FE','86EFAC']
  const s = name || 'seed'
  let hash = 0
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0
  return palette[hash % palette.length]
}

function dicebearUrl(name: string) {
  const first = getFirstWord(name)
  const seed = encodeURIComponent(first)
  const initials = encodeURIComponent(getInitials(name))
  const bg = colorFor(first)
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&letters=${initials}&chars=${initials}&size=64&fontSize=30&radius=32&backgroundColor=${bg}`
}

function initialsSvgData(initials: string, seedForColor: string) {
  const bg = colorFor(seedForColor)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>
    <rect width='100%' height='100%' rx='32' ry='32' fill='#${bg}'/>
    <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' font-weight='700' fill='#45332E'>${initials}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function InitialAvatar({ name }: { name: string }) {
  const [src, setSrc] = useState(() => initialsSvgData(getInitials(name), getFirstWord(name)))
  useEffect(() => {
    const url = dicebearUrl(name)
    const img = new Image()
    img.onload = () => setSrc(url)
    img.onerror = () => setSrc(initialsSvgData(getInitials(name), getFirstWord(name)))
    img.src = url
  }, [name])
  return <AvatarImg src={src} alt={`${name} 이니셜 아바타`} />
}
