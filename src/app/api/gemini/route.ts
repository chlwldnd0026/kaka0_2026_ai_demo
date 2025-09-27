import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// Configure model/version via env with safe defaults (align with working script)
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite'
const API_VER = process.env.GEMINI_API_VER || 'v1beta'
const GEMINI_ENDPOINT_BASE = `https://generativelanguage.googleapis.com/${API_VER}/models/${MODEL}:generateContent`

export async function POST(req: NextRequest) {
  try {
    const { name, instructions, message } = await req.json()
    if (!name || !instructions) {
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'missing_api_key' }, { status: 500 })
    }

    const userText = message ? String(message) : `이 카나나의 이름은 "${name}" 입니다. 적절한 시작 프롬프트를 간단히 제안해 주세요.`
    // 간결성과 가독성을 위한 스타일 가이드 추가
    const prompt = `# 카나나 이름\n${String(name)}\n\n# 시스템 지시\n${String(instructions)}\n\n# 스타일 가이드\n- 한국어 존댓말로 응답하세요.\n- 최대 2~3문장 또는 150자 이내로 간결하게 답하세요.\n- 목록이 필요하면 3개 이하의 짧은 불릿으로 정리하세요.\n- 링크/코드블록은 사용하지 마세요.\n\n# 사용자 메시지\n${userText}`
    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: { temperature: 0.5, maxOutputTokens: 180 },
    }

    const url = `${GEMINI_ENDPOINT_BASE}?key=${encodeURIComponent(apiKey)}`
    const res = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
      validateStatus: () => true,
    })

    if (res.status < 200 || res.status >= 300) {
      // 디버그를 돕기 위해 upstream 응답을 text로도 반환
      return NextResponse.json({ error: 'upstream_error', text: JSON.stringify(res.data) }, { status: 502 })
    }

    const data = res.data
    let text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    // Sanitize Markdown-style bold markers '**...**' and loose '**'
    try {
      text = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*\*/g, '')
    } catch {}
    return NextResponse.json({ text })
  } catch (e) {
    console.error('Gemini route error', e)
    return NextResponse.json({ error: 'unknown', text: '서버 오류로 응답을 생성하지 못했습니다.' }, { status: 500 })
  }
}
