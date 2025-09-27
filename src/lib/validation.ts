export function validateName(name: string): string | null {
  const trimmed = name.trim()
  if (trimmed.length < 2 || trimmed.length > 20) {
    return '이름은 2~20자여야 해요.'
  }
  // 한글/영문/숫자/공백만 허용 (특수문자/이모지 금지)
  const allowed = /^[A-Za-z0-9가-힣\s]+$/
  if (!allowed.test(trimmed)) {
    return '이름에는 특수문자/이모지를 사용할 수 없어요.'
  }
  return null
}

export function validateInstructions(text: string): string | null {
  const trimmed = text.trim()
  if (trimmed.length < 10 || trimmed.length > 1000) {
    return '설명/규칙은 10~1000자여야 해요.'
  }
  return null
}

