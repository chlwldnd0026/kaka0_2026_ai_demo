'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { validateInstructions, validateName } from '@/lib/validation'
import { addKanana } from '@/lib/storage'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import KakaoHeader from '@/components/KakaoHeader'
import { KakaoInput, KakaoTextArea, KakaoPrimaryButton, KakaoSecondaryButton, KakaoCard } from '@/components/ui'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`

const Label = styled.label`
  font-size: 12px;
  color: var(--text-secondary-color);
`

const Input = KakaoInput
const TextArea = KakaoTextArea

const PrimaryButton = KakaoPrimaryButton
const SecondaryButton = KakaoSecondaryButton

const ErrorText = styled.div`
  color: #d14343;
  font-size: 12px;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  padding-bottom: 92px;
`

const Card = styled(KakaoCard)`
  overflow: hidden;
  padding-bottom: 0;
`

const PageActionBar = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: var(--mobile-width);
  background: #eceff4;
  border-top: 1px solid #dfe3ea;
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  display: flex;
  gap: 8px;
`

export default function CreatePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [instError, setInstError] = useState<string | null>(null)

  async function doSubmit() {
    const ne = validateName(name)
    const ie = validateInstructions(instructions)
    setNameError(ne)
    setInstError(ie)
    if (ne || ie) return
    setSubmitting(true)
    try {
      const res = await axios.post('/api/gemini', { name, instructions })
      if (res.status < 200 || res.status >= 300) throw new Error('API 호출 실패')
      addKanana(name, instructions)
      router.push('/')
    } catch (err) {
      setInstError('생성에 실패했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await doSubmit()
  }

  return (
    <Page>
      <KakaoHeader title="카나나 만들기" />
      <Content>
        <Card>
          <form id="create-form" onSubmit={handleSubmit}>
            <Field>
              <Label>이름</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 여행 가이드"
                maxLength={20}
                aria-invalid={!!nameError}
                aria-describedby={nameError ? 'name-error' : undefined}
              />
              {nameError && <ErrorText id="name-error">{nameError}</ErrorText>}
            </Field>
            <Field>
              <Label>설명/규칙</Label>
              <TextArea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="예: 반말 금지, 간결한 답변, 링크는 3개 이내..."
                maxLength={1000}
                aria-invalid={!!instError}
                aria-describedby={instError ? 'inst-error' : undefined}
              />
              {instError && (
                <div>
                  <ErrorText id="inst-error">{instError}</ErrorText>
                  <div style={{ marginTop: 6 }}>
                    <PrimaryButton type="button" onClick={() => doSubmit()} disabled={submitting}>
                      다시 시도
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </Field>
          </form>
        </Card>
      </Content>
      <PageActionBar>
        <SecondaryButton type="button" onClick={() => router.back()}>취소</SecondaryButton>
        <PrimaryButton type="submit" form="create-form" disabled={submitting}>
          {submitting ? '생성 중...' : '생성'}
        </PrimaryButton>
      </PageActionBar>
    </Page>
  )
}
