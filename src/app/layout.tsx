import './globals.css'
import StyledComponentsRegistry from '@/lib/styled-registry'

export const metadata = {
  title: 'KakaoTalk Demo',
  description: '나만의 카나나 MVP',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <div className="mobile-frame">
            <div className="container">
              {children}
            </div>
          </div>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
