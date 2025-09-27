"use client"

import styled from 'styled-components'
import { useRouter } from 'next/navigation'

const Bar = styled.div`
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const Title = styled.div`
  font-size: 17px;
  font-weight: 600;
`

const Back = styled.button`
  position: absolute;
  left: 0;
  top: 0;
  height: 52px;
  padding: 0 12px;
  border: none;
  background: transparent;
  color: var(--text-primary-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const Right = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 52px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  color: var(--text-primary-color);
  opacity: .7;
`

export default function KakaoHeader({ title }: { title: string }) {
  const router = useRouter()
  return (
    <Bar role="banner">
      <Back aria-label="뒤로" onClick={() => router.back()}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Back>
      <Title>{title}</Title>
      <Right>⋯</Right>
    </Bar>
  )
}
