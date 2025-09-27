# KakaoTalk Demo - Design Reference

이 문서는 '나만의 카나나' 데모 제작을 위한 카카오톡 디자인 시스템 가이드입니다. 코딩 시 아래의 명세를 참고하여 일관된 UI를 구현합니다.

---

## 1. 색상 (Colors)

| 역할 | 설명 | HEX 코드 |
| :--- | :--- | :--- |
| **Primary** | 브랜드 메인 컬러, 나의 말풍선, 핵심 버튼 배경 | `#FEE500` |
| **Background** | 채팅방 등 앱의 기본 배경색 | `#9bb2c5` |
| **Component** | 상대방 말풍선, 입력창, 헤더 등 컴포넌트 배경 | `#FFFFFF` |
| **Text (Primary)** | 기본 텍스트 색상 | `#191919` |
| **Text (Secondary)**| 시간, 부가 정보 등 보조 텍스트 색상 | `#8b8b8b` |
| **Action / Link**| 확인, 전송 등 활성화된 버튼 내부 텍스트 | `#45332E` |

---

## 2. 타이포그래피 (Typography)

카카오톡은 자체 서체를 사용하지만, 데모에서는 웹에서 접근 가능한 기본 시스템 폰트를 사용합니다.

- **기본 글꼴 (Font Family):** `Apple SD Gothic Neo`, `Noto Sans CJK KR`, `sans-serif` (시스템 우선순위)

| 역할 | 크기 (Font Size) | 굵기 (Font Weight) | 사용처 예시 |
| :--- | :--- | :--- | :--- |
| **Header Title** | 17px | `600` (Semibold) | 페이지 상단 제목 ('카나나 플래닛') |
| **List Title** | 16px | `600` (Semibold) | 카나나 목록의 이름 |
| **Body / Message** | 15px | `400` (Regular) | 채팅 메시지, 컴포넌트 내 설명 |
| **Button Text** | 15px | `500` (Medium) | 버튼 내부 텍스트 |
| **Caption** | 12px | `400` (Regular) | 보조 설명, 시간 표시 |

---

## 3. 핵심 컴포넌트 (Core Components)

### 3.1. 버튼 (Buttons)

- **Primary Button (주요 버튼):**
  - `background-color`: `var(--primary-color)` (#FEE500)
  - `color`: `var(--action-color)` (#45332E)
  - `border-radius`: 8px
  - `padding`: 12px 16px
  - `border`: none

- **Secondary Button (보조 버튼 - e.g., '취소'):**
  - `background-color`: `#F0F0F0`
  - `color`: `var(--text-primary-color)` (#191919)
  - `border-radius`: 8px
  - `padding`: 12px 16px
  - `border`: none

### 3.2. 입력창 (Input Fields)

- `background-color`: `var(--component-color)` (#FFFFFF)
- `border`: `1px solid #E0E0E0`
- `border-radius`: 20px
- `padding`: 10px 16px
- `font-size`: 15px

### 3.3. 말풍선 (Chat Bubbles)

- **나의 말풍선 (My Bubble):**
  - `background-color`: `var(--primary-color)` (#FEE500)
  - `border-radius`: 12px
  - `padding`: 8px 12px

- **상대방 말풍선 (Other's Bubble):**
  - `background-color`: `var(--component-color)` (#FFFFFF)
  - `border-radius`: 12px
  - `padding`: 8px 12px