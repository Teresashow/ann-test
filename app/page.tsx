'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ReviewResult {
  id: string
  response: string
}

export default function Home() {
  const [topic, setTopic] = useState('')
  const [copyText, setCopyText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [error, setError] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [result])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim() || !copyText.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, copyText }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? '審核失敗，請稍後再試')
        return
      }

      setResult(data)
    } catch {
      setError('網路連線異常，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError('')
    setTopic('')
    setCopyText('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="border-b border-cream-200 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-wood-600 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-wood-900 font-semibold text-base leading-tight">文案審核器</h1>
            <p className="text-wood-500 text-xs">AI 智慧文案品質分析</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-wood-900 mb-2">輸入文案，立即獲得專業審核意見</h2>
          <p className="text-wood-500 text-sm">AI 自動分析文案優缺點，提供具體修改建議與改寫版本</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Topic */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-wood-800 mb-1.5">
                主題
                <span className="text-wood-400 font-normal ml-1">（這篇文案是要做什麼用的？）</span>
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="例如：新品上市、節慶促銷、品牌故事、招募公告..."
                required
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-wood-900 placeholder-wood-300 focus:outline-none focus:ring-2 focus:ring-wood-400 focus:border-transparent transition disabled:opacity-50 text-sm"
              />
            </div>

            {/* Copy Text */}
            <div>
              <label htmlFor="copyText" className="block text-sm font-medium text-wood-800 mb-1.5">
                文案內容
                <span className="text-red-400 ml-1">*</span>
              </label>
              <textarea
                id="copyText"
                value={copyText}
                onChange={e => setCopyText(e.target.value)}
                placeholder="請貼入需要審核的文案內容..."
                required
                disabled={loading}
                rows={8}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-wood-900 placeholder-wood-300 focus:outline-none focus:ring-2 focus:ring-wood-400 focus:border-transparent transition disabled:opacity-50 text-sm resize-y leading-relaxed"
              />
              <p className="text-wood-300 text-xs mt-1 text-right">{copyText.length} 字</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !topic.trim() || !copyText.trim()}
              className="w-full py-3 rounded-xl bg-wood-600 hover:bg-wood-700 active:bg-wood-800 text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-flex gap-1">
                    <span className="thinking-dot w-1.5 h-1.5 rounded-full bg-white/80 inline-block" />
                    <span className="thinking-dot w-1.5 h-1.5 rounded-full bg-white/80 inline-block" />
                    <span className="thinking-dot w-1.5 h-1.5 rounded-full bg-white/80 inline-block" />
                  </span>
                  審核中，請稍候...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 2 11 13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  送出審核
                </>
              )}
            </button>
          </form>
        </div>

        {/* Thinking Indicator */}
        {loading && (
          <div className="mt-6 flex items-center gap-3 px-5 py-4 bg-cream-100 border border-cream-200 rounded-2xl">
            <div className="flex gap-1">
              <span className="thinking-dot w-2 h-2 rounded-full bg-wood-400 inline-block" />
              <span className="thinking-dot w-2 h-2 rounded-full bg-wood-400 inline-block" />
              <span className="thinking-dot w-2 h-2 rounded-full bg-wood-400 inline-block" />
            </div>
            <p className="text-wood-600 text-sm">文案審核員思考中...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div ref={resultRef} className="mt-6 scroll-mt-24">
            {/* Result Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-wood-600 flex items-center justify-center flex-shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-wood-800 font-medium text-sm">審核完成</h3>
              <span className="text-wood-300 text-xs ml-auto">主題：{topic}</span>
            </div>

            {/* Result Card */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm px-6 md:px-8 py-6">
              <div className="prose-wood max-w-none text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.response}
                </ReactMarkdown>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleReset}
                className="px-5 py-2 rounded-xl border border-cream-300 text-wood-600 hover:bg-cream-100 text-sm font-medium transition-colors"
              >
                重新審核
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cream-200 mt-20 py-6 text-center">
        <p className="text-wood-300 text-xs">文案審核器 · AI 提供參考意見，最終判斷仍請人工確認</p>
      </footer>
    </div>
  )
}
