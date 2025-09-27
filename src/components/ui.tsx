"use client"

import styled from 'styled-components'

export const Spacing = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
}

export const KakaoPrimaryButton = styled.button`
  background-color: var(--primary-color);
  color: var(--action-color);
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 500;
  transition: filter .15s ease, transform .02s ease;
  &:hover { filter: brightness(0.98); }
  &:active { transform: translateY(1px); }
`

export const KakaoSecondaryButton = styled.button`
  background-color: #f7f7f7;
  color: var(--text-primary-color);
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 12px 16px;
  transition: background-color .15s ease, transform .02s ease, border-color .15s ease;
  &:hover { background-color: #f2f2f2; border-color: #e0e0e0; }
  &:active { transform: translateY(1px); }
`

export const KakaoInput = styled.input`
  width: 100%;
  background: var(--component-color);
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 15px;
  font-family: inherit;
  color: var(--text-primary-color);
  transition: box-shadow .15s ease, border-color .15s ease;
  &:hover { border-color: #d0d0d0; }
  &:focus-visible { box-shadow: 0 0 0 3px rgba(43,108,176,.2); border-color: #2b6cb0; }
`

export const KakaoTextArea = styled.textarea`
  width: 100%;
  background: var(--component-color);
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 15px;
  min-height: 140px;
  font-family: inherit;
  color: var(--text-primary-color);
  transition: box-shadow .15s ease, border-color .15s ease;
  &:hover { border-color: #d0d0d0; }
  &:focus-visible { box-shadow: 0 0 0 3px rgba(43,108,176,.2); border-color: #2b6cb0; }
`

export const KakaoCard = styled.div`
  background: var(--component-color);
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px 16px;
`

export const KakaoChip = styled.button<{ $active?: boolean }>`
  border: none;
  padding: 6px 10px;
  border-radius: 16px;
  background: ${(p) => (p.$active ? 'var(--primary-color)' : '#f0f0f0')};
  color: ${(p) => (p.$active ? 'var(--action-color)' : 'var(--text-primary-color)')};
  transition: background-color .15s ease;
`
