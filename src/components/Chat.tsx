"use client"

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import AIPanel from './AIPanel'
import { KakaoInput } from '@/components/ui'
import { getActiveKanana } from '@/lib/storage'
import type { Kanana } from '@/lib/storage'
import { dicebearUrl, getFirstWord, getInitials, initialsSvgData } from '@/lib/avatar'

const ChatWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Header = styled.div`
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 600;
  position: relative;
  padding: 0 8px;
`

const BackBtn = styled.button`
  position: absolute;
  left: 0;
  top: 0;
  height: 52px;
  padding: 0 8px 0 12px;
  background: transparent;
  border: none;
  color: var(--text-primary-color);
`

const RightIcons = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 52px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px 0 12px;
  opacity: .7;
`

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Row = styled.div<{ $me?: boolean }>`
  display: flex;
  justify-content: ${(p) => (p.$me ? 'flex-end' : 'flex-start')};
  gap: 6px;
  padding: 2px 0;
`

const Bubble = styled.div<{ $me?: boolean }>`
  position: relative;
  max-width: 78%;
  background: ${(p) => (p.$me ? 'var(--primary-color)' : 'var(--component-color)')};
  color: var(--text-primary-color);
  border-radius: ${(p) => (p.$me ? '18px 18px 6px 18px' : '18px 18px 18px 6px')};
  padding: 10px 12px;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  font-size: 15px;
  ${(p) => p.$me ? `
    &:after { content: ''; position: absolute; right: -4px; bottom: 6px; width: 0; height: 0; border-left: 6px solid var(--primary-color); border-top: 6px solid transparent; }
  ` : ''}
`

const Time = styled.div`
  font-size: 11px;
  color: var(--text-secondary-color);
  margin: 2px 4px 0 4px;
  text-align: right;
`

const DateRow = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
`

const DateDivider = styled.span`
  display: inline-block;
  font-size: 11px;
  color: #ffffff;
  background: rgba(0,0,0,0.28);
  border-radius: 16px;
  padding: 4px 10px;
`

const InputBar = styled.form`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 12px;
  position: sticky;
  bottom: 0;
  background: #eceff4;
  border-top: 1px solid #dfe3ea;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
`

const TextInput = styled(KakaoInput)`
  flex: 1;
  height: 40px;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  font-size: 15px;
`

const IconCircle = styled.button<{ $primary?: boolean }>`
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: ${(p) => (p.$primary ? 'none' : '1px solid #e0e0e0')};
  background: ${(p) => (p.$primary ? 'var(--primary-color)' : '#ffffff')};
  color: ${(p) => (p.$primary ? 'var(--action-color)' : '#6b6b6b')};
`

const AITextButton = styled(IconCircle)`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 0; /* 고정 원형 크기에 맞춰 텍스트만 중앙 정렬 */
`

const AvatarImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #23314d;
  background: #0b1222;
  object-fit: cover;
  margin-right: 6px;
`

type ChatMsg = { me: boolean; text: string; time: string; date?: string }

export default function Chat() {
  const [aiOpen, setAiOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [active, setActive] = useState<Kanana | null>(null)
  const [mounted, setMounted] = useState(false)

  // 활성 카나나 변경 이벤트 구독 + 초기 동기화
  useEffect(() => {
    const update = () => setActive(getActiveKanana())
    window.addEventListener('kanana:active-changed', update)
    update(); setMounted(true)
    return () => window.removeEventListener('kanana:active-changed', update)
  }, [])

  // 활성 카나나가 있을 때: 초기 메시지 없이 Gemini 응답만 표시
  useEffect(() => {
    if (active) {
      setMessages([])
      fetch('/api/gemini', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: active.name, instructions: active.instructions, message: `${active.name}로 간단한 자기소개 한 문장으로 시작해 주세요.` })
      }).then(r => r.json()).then(data => {
        const txt = String(data?.text ?? '').trim(); if (!txt) return
        const d = new Date(); const hh = d.getHours(); const mm = d.getMinutes().toString().padStart(2, '0')
        const ampm = hh < 12 ? '오전' : '오후'; const h12 = ((hh + 11) % 12) + 1
        const time = `${ampm} ${h12}:${mm}`
        setMessages([{ me: false, text: txt, time }])
      }).catch(() => {})
    } else {
      setMessages([])
    }
  }, [active])

  // 기본 안내(활성 카나나 없을 때만)
  useEffect(() => {
    if (active) return
    if (messages.length > 0) return
    const now = () => {
      const d = new Date(); const hh = d.getHours(); const mm = d.getMinutes().toString().padStart(2, '0')
      const ampm = hh < 12 ? '오전' : '오후'; const h12 = ((hh + 11) % 12) + 1
      return `${ampm} ${h12}:${mm}`
    }
    setMessages([
      { me: true, time: now(), text: "이 데모는 '나만의 카나나'를 구현했습니다. 사용자는 나만의 카나나를 만들고, 다른 사람들이 만든 카나나를 '카나나 플래닛'에서 추가할 수 있습니다." },
      { me: true, time: now(), text: '하단 AI 버튼 → 카나나 관리에서 나만의 카나나 추가/선택/삭제/해제를 할 수 있어요. 카나나 플래닛에서 나만의 카나나를 추가하세요.' },
      { me: true, time: now(), text: '현재 이 데모는 카나나들을 Gemini API로 구현한 상태이며, 일시적인 네트워크 불안정 또는 사용 제한이 발생할 수 있어요. 응답이 없으면 잠시 뒤, 페이지를 새로고침 하여 다시 시도 해주세요.' },
    ])
  }, [active, messages.length])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = msg.trim(); if (!trimmed) return
    const d = new Date(); const hh = d.getHours(); const mm = d.getMinutes().toString().padStart(2, '0')
    const ampm = hh < 12 ? '오전' : '오후'; const h12 = ((hh + 11) % 12) + 1
    const time = `${ampm} ${h12}:${mm}`
    setMessages((prev) => [...prev, { me: true, text: trimmed, time }])
    setMsg('')
    if (active) {
      fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: active.name, instructions: active.instructions, message: trimmed }) })
        .then(r => r.json()).then(data => {
          const reply = String(data?.text ?? '').trim()
          const t = new Date(); const hh2 = t.getHours(); const mm2 = t.getMinutes().toString().padStart(2, '0')
          const ampm2 = hh2 < 12 ? '오전' : '오후'; const h122 = ((hh2 + 11) % 12) + 1
          const time2 = `${ampm2} ${h122}:${mm2}`
          setMessages((prev) => [...prev, { me: false, text: reply || '(응답이 비어 있어요)', time: time2 }])
        }).catch(() => {
          const t = new Date(); const hh2 = t.getHours(); const mm2 = t.getMinutes().toString().padStart(2, '0')
          const ampm2 = hh2 < 12 ? '오전' : '오후'; const h122 = ((hh2 + 11) % 12) + 1
          const time2 = `${ampm2} ${h122}:${mm2}`
          setMessages((prev) => [...prev, { me: false, text: '답변을 불러오지 못했어요.', time: time2 }])
        })
    }
  }

  const hasText = msg.trim().length > 0

  return (
    <>
      <ChatWrap>
        <Header>
          <BackBtn aria-label="뒤로">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </BackBtn>
          <span suppressHydrationWarning>{mounted && active ? active.name : '채팅방'}</span>
          <RightIcons>
            <button aria-label="검색" style={{ background:'transparent', border:'none', padding:'8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button aria-label="메뉴" style={{ background:'transparent', border:'none', padding:'8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </RightIcons>
        </Header>
        <Messages>
          {messages.map((m, i) => (
            <div key={i}>
              {m.date && (
                <DateRow>
                  <DateDivider>{m.date}</DateDivider>
                </DateRow>
              )}
              <Row $me={m.me}>
                {!m.me && active && (
                  <AvatarImg
                    src={dicebearUrl(active.name)}
                    alt={`${active.name} 아바타`}
                    onError={(e) => {
                      const first = getFirstWord(active.name)
                      ;(e.currentTarget as HTMLImageElement).src = initialsSvgData(getInitials(active.name), first)
                    }}
                  />
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                    {m.me ? <Time>{m.time}</Time> : null}
                    <Bubble $me={m.me}>{m.text}</Bubble>
                    {!m.me ? <Time>{m.time}</Time> : null}
                  </div>
                </div>
              </Row>
            </div>
          ))}
        </Messages>
        <InputBar onSubmit={onSubmit}>
          <IconCircle type="button" aria-label="추가">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </IconCircle>
          <TextInput
            placeholder="메시지를 입력하세요"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <IconCircle type="button" aria-label="이모지">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="10" r="1" fill="currentColor"/>
              <circle cx="15" cy="10" r="1" fill="currentColor"/>
              <path d="M8 14C9 16 11 17 13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </IconCircle>
          {hasText ? (
            <IconCircle type="submit" aria-label="전송" $primary>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12L20 5L16 19L12 14L4 12Z" fill="currentColor"/>
              </svg>
            </IconCircle>
          ) : (
            <AITextButton type="button" aria-label="AI" onClick={() => setAiOpen(true)}>AI</AITextButton>
          )}
        </InputBar>
      </ChatWrap>
      <AIPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  )
}
