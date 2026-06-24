import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '文案審核器',
  description: 'AI 智慧文案品質分析，快速找出改善方向',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">{children}</body>
    </html>
  )
}
