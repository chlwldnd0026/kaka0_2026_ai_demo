"use client"

import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { Kanana, readList, addKanana, removeKanana, setActiveKanana } from '@/lib/storage'
import { KakaoCard, KakaoPrimaryButton, KakaoSecondaryButton, KakaoInput, KakaoTextArea } from '@/components/ui'
import axios from 'axios'
import { validateInstructions, validateName } from '@/lib/validation'

const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  opacity: ${(p) => (p.$open ? 1 : 0)};
  pointer-events: ${(p) => (p.$open ? 'auto' : 'none')};
  transition: opacity .2s ease;
  z-index: 40;
`

const Sheet = styled.div<{ $open: boolean }>`
  position: fixed;
  left: 50%;
  transform: translateX(-50%) translateY(${(p) => (p.$open ? '0' : '100%')});
  bottom: 0;
  width: var(--mobile-width);
  background: var(--component-color);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 10px 16px 16px;
  box-shadow: 0 -8px 24px rgba(0,0,0,0.2);
  transition: transform .24s ease;
  z-index: 50;
  max-height: 65vh;
  overflow: auto;
  visibility: ${(p) => (p.$open ? 'visible' : 'hidden')};
  pointer-events: ${(p) => (p.$open ? 'auto' : 'none')};
`

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 55;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`

const Title = styled.h2`
  font-size: 17px;
  font-weight: 600;
  margin: 0;
`

const PrimaryButton = KakaoPrimaryButton
const SecondaryButton = KakaoSecondaryButton

const Card = styled(KakaoCard)`
  margin-bottom: 8px;
`
const ItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`
const DangerTextButton = styled.button`
  border: 1px solid #e5b3b3;
  background: #fff5f5;
  color: #b42323;
  border-radius: 8px;
  padding: 6px 10px;
`

const Grabber = styled.div`
  width: 48px;
  height: 4px;
  border-radius: 2px;
  background: #ddd;
  margin: 6px auto 8px;
`

export default function AIPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [list, setList] = useState<Kanana[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [nameError, setNameError] = useState<string | null>(null)
  const [instError, setInstError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) setList(readList())
  }, [open])

  async function handleCreateSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const ne = validateName(name)
    const ie = validateInstructions(instructions)
    setNameError(ne)
    setInstError(ie)
    if (ne || ie) return
    setSubmitting(true)
    try {
      // 생성 시 API 응답이 실패하더라도 저장 자체는 가능하도록 관대하게 처리
      try {
        const res = await axios.post('/api/gemini', { name, instructions })
        if (!(res.status >= 200 && res.status < 300)) {
          console.warn('Create: upstream not ok', res.status, res.data)
        }
      } catch (err) {
        console.warn('Create: upstream error (ignored for local save)', err)
      }
      addKanana(name, instructions)
      setList(readList())
      setShowCreate(false)
      setName('')
      setInstructions('')
    } catch (err) {
      setInstError('생성에 실패했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Backdrop $open={open} onClick={onClose} />
      <Sheet $open={open} role="dialog" aria-modal="true" aria-label="AI 패널" onClick={(e) => e.stopPropagation()}>
        <Grabber />
        <Row>
          <Title>카나나 관리</Title>
          <div style={{ display: 'flex', gap: 8 }}>
            <SecondaryButton type="button" onClick={() => { setActiveKanana(null); onClose(); }}>선택 해제</SecondaryButton>
            <SecondaryButton onClick={onClose}>닫기</SecondaryButton>
          </div>
        </Row>
        <Row style={{ gap: 8, justifyContent: 'flex-end' }}>
          <a href="/browse"><SecondaryButton>찾아보기</SecondaryButton></a>
          <PrimaryButton onClick={() => setShowCreate(true)}>만들기</PrimaryButton>
        </Row>
        {list.length === 0 ? (
          <div>
            <p>아직 만든 카나나가 없네요.</p>
            <p className="empty-caption">나만의 첫번째 카나나를 만들어볼까요?</p>
          </div>
        ) : (
          <div>
            {list.map((item) => (
              <Card key={item.id}>
                <ItemRow>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AvatarImg
                      src={dicebearUrl(item.name)}
                      alt={`${item.name} 이니셜 아바타`}
                      onError={(e) => {
                        const first = getFirstWord(item.name)
                        ;(e.currentTarget as HTMLImageElement).src = initialsSvgData(getInitials(item.name), first)
                      }}
                    />
                  <div onClick={() => { setActiveKanana(item); onClose(); }} style={{ cursor: 'pointer' }}>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary-color)' }}>
                        {new Date(item.createdAt).toLocaleString('ko-KR')}
                      </div>
                    </div>
                  </div>
                  <DangerTextButton
                    type="button"
                    onClick={() => {
                      const next = removeKanana(item.id)
                      setList(next)
                    }}
                    aria-label={`${item.name} 삭제`}
                  >
                    삭제
                  </DangerTextButton>
                </ItemRow>
              </Card>
            ))}
          </div>
        )}

      </Sheet>
      {showCreate && (
        <>
          <ModalBackdrop onClick={() => setShowCreate(false)} />
          <CreateModal role="dialog" aria-modal="true" aria-label="카나나 만들기" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 12px', fontSize: 17, fontWeight: 600 }}>카나나 만들기</h3>
            <form onSubmit={handleCreateSubmit}>
              <Field>
                <label className="caption">이름</label>
                <KInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 여행 가이드"
                  maxLength={20}
                  aria-invalid={!!nameError}
                  aria-describedby={nameError ? 'create-name-error' : undefined}
                />
                {nameError && <ErrorText id="create-name-error">{nameError}</ErrorText>}
              </Field>
              <Field>
                <label className="caption">설명/규칙</label>
                <KText
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="예: 반말 금지, 간결한 답변, 링크는 3개 이내..."
                  maxLength={1000}
                  aria-invalid={!!instError}
                  aria-describedby={instError ? 'create-inst-error' : undefined}
                />
                {instError && <ErrorText id="create-inst-error">{instError}</ErrorText>}
              </Field>
              <Row style={{ gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <SecondaryButton type="button" onClick={() => setShowCreate(false)}>취소</SecondaryButton>
                <PrimaryButton type="submit" disabled={submitting}>{submitting ? '생성 중…' : '생성'}</PrimaryButton>
              </Row>
            </form>
          </CreateModal>
        </>
      )}
    </>
  )
}

const CreateModal = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(var(--mobile-width) - 32px);
  max-height: 70vh;
  overflow: auto;
  background: var(--component-color);
  border-radius: 12px;
  padding: 16px;
  z-index: 60;
  box-shadow: 0 12px 32px rgba(0,0,0,0.25);
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  .caption { font-size: 12px; color: var(--text-secondary-color); }
`

const KInput = styled(KakaoInput)`
  height: 40px;
`
const KText = styled(KakaoTextArea)`
  min-height: 140px;
`
const ErrorText = styled.div`
  color: #d14343;
  font-size: 12px;
`

// 공통: 이니셜 아바타 유틸/스타일 (browse 페이지와 규칙 통일)
const AvatarImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #23314d;
  background: #0b1222;
  object-fit: cover;
`

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
