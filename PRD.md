# PRD: '나만의 카나나' MVP 데모 (최종)

## 1. 개요 (Overview)
본 문서는 카카오톡 스타일 UI 위에서 사용자 맞춤 AI를 만들고 공유 템플릿을 탐색하는 ‘나만의 카나나’ MVP의 요구 사항을 정의합니다. 개발은 PRD.md와 design_reference.md를 단일 기준으로 하며, 아래 사양을 충실히 구현합니다.

## 2. 목표 (Goals)
- 핵심 플로우 구현: 개인 카나나 생성과 템플릿 탐색/다운로드
- 실사용 감: 실제 Gemini API 호출, 모바일 최적화 UX
- 명확한 범위: 로컬 상태 관리, 최소 기능으로 빠른 검증

## 3. 기능 명세 (Feature Specifications)

### Flow 1: 나만의 카나나 만들기
- 진입: 별도 페이지(`/create`). 목록이 비어있으면 빈 상태 UI와 아래 안내 문구(2줄) 및 만들기 버튼 표시.
  - '아직만들어진카나나가없네요'
  - '나만의첫번째카나나를만들어볼까요?'
- UI: 이름(Text), 역할/규칙(TextArea), 취소/생성 버튼.
- 유효성: 이름(필수, 2–20자, 특수문자·이모지 금지), 역할/규칙(필수, 10–500자). 위반 시 명확한 에러 메시지 노출.
- 로직: ‘생성’ 시 역할/규칙을 System Prompt로 사용하여 Gemini 호출 → 성공 시 목록에 추가 후 목록 화면으로 이동.

### Flow 2: 카나나 템플릿 찾아보기/다운로드
- 진입: 목록 화면의 “템플릿 찾아보기” 버튼.
- UI: 전체 화면 모달/페이지, 카테고리 탭(업무 헬퍼/학습 튜터/재미 & 심심풀이), 미리 준비된 템플릿 3개 목록과 상세(다운로드 버튼).
- 로직: ‘다운로드’ 시 해당 템플릿을 목록에 추가하고 닫기/이동.

## 4. 개발 환경 & 프레임워크
- Node.js: 최신 LTS, 패키지 매니저: npm
- Next.js(최신, App Router), React Hooks로 상태 관리, 로컬 데이터는 `localStorage` 사용
- 스타일: styled-components 고정, Axios로 API 호출

## 5. 데이터 모델 & 상태
- 저장소: `localStorage` 키 `kakaotalk:kanana_list`
- 스키마: `[ { id, name, instructions, createdAt } ]`
- ID: UUID 생성, 정렬: 최신 생성순(내림차순)

## 6. API 사양 (Gemini)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- 인증: URL 파라미터 `?key=YOUR_API_KEY`
- 요청 스키마(예): `{ system_instruction:{ parts:{ text:"..." } }, contents:[ { role:"user", parts:{ text:"..." } } ] }`
- 응답 파싱: `data.candidates[0].content.parts[0].text`
- 오류 처리: 공통 Fallback 메시지 “죄송합니다. 지금은 처리해드릴 수 없어요. 잠시 후 다시 시도해주세요.” 표시, 재시도 버튼 선택적 제공

## 7. 디자인 가이드 요약 (상세는 design_reference.md)
- 디자인 토큰: CSS 변수 사용 허용(`--color-primary`, `--font-size-body` 등)
- 반응형: 모바일 중심, 최소 가로 360px 기준
- 접근성: WCAG AA 목표, 시맨틱 HTML 적용

## 8. 범위에서 제외 (Out of Scope)
- 사용자 로그인/계정 시스템, 백엔드 서버/데이터베이스
- 클라우드 업로드, 실제 공유 기능
- 자동 배포/CI, 테스트 도구 도입(향후 Jest+RTL 고려)
