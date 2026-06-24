import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'

const client = new Anthropic()

const SYSTEM_PROMPT = `你是一位專業資深文案審核員，擁有豐富的行銷、廣告與社群媒體文案審核經驗。

你的工作是針對提交的文案，提供具體、實用的審核意見，幫助文案人員快速精進內容品質。

請依照以下格式，用繁體中文回應：

## 整體評分

X/10 分 — [一句話總評]

## 亮點

- [具體說明優點一]
- [具體說明優點二]

## 待改進之處

針對每個問題，請提供：
- **[問題類型]**：[說明問題] → 修改方向：[具體建議]

## 修改後版本

[提供完整的修改後文案]

---

語氣專業而具體，聚焦可執行的改善方向。若文案主題有特殊情境，請在審核中一併考量。`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { topic, copyText } = body

    if (!topic?.trim() || !copyText?.trim()) {
      return NextResponse.json({ error: '主題和文案內容為必填欄位' }, { status: 400 })
    }

    const userMessage = `【主題】${topic.trim()}\n\n【文案內容】\n${copyText.trim()}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const aiResponse = message.content[0].type === 'text' ? message.content[0].text : ''

    const review = await prisma.review.create({
      data: {
        topic: topic.trim(),
        copyText: copyText.trim(),
        aiResponse,
      },
    })

    return NextResponse.json({ id: review.id, response: aiResponse })
  } catch (err) {
    console.error('Review API error:', err)
    return NextResponse.json({ error: '審核服務暫時無法使用，請稍後再試' }, { status: 500 })
  }
}
