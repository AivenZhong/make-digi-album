import { NextRequest, NextResponse } from 'next/server'

/**
 * AI评语生成接口
 * 
 * 支持三种模式（按优先级）：
 * 1. z-ai-web-dev-sdk（沙盒环境自动可用）
 * 2. OpenAI 兼容 API（需要配置环境变量 OPENAI_API_KEY 和 OPENAI_BASE_URL）
 * 3. 本地模板生成（无需任何API，完全离线可用）
 */

async function generateWithZAI(systemPrompt: string, userPrompt: string): Promise<string | null> {
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    })
    return completion.choices[0]?.message?.content || null
  } catch {
    return null
  }
}

async function generateWithOpenAI(systemPrompt: string, userPrompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

  if (!apiKey) return null

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    })

    if (!response.ok) return null
    const data = await response.json()
    return data.choices?.[0]?.message?.content || null
  } catch {
    return null
  }
}

function generateLocalComment(data: {
  studentName: string
  studentClass: string
  activity1Completed: boolean
  activity2Completed: boolean
  activity3Completed: boolean
  quizCorrect: number
  quizTotal: number
  quizScore: number
  avgEval: number
}): string {
  const { studentName, activity1Completed, activity2Completed, activity3Completed, quizCorrect, quizTotal, quizScore, avgEval } = data
  const name = studentName || '同学'

  const completedCount = [activity1Completed, activity2Completed, activity3Completed].filter(Boolean).length

  // 开头 - 肯定努力
  const openings = [
    `${name}，今天你在信息课上的表现非常出色！`,
    `${name}，今天的课堂你积极参与，表现得很棒！`,
    `${name}，看到你今天认真学习的样子，老师非常高兴！`,
  ]
  const opening = openings[Math.floor(Math.random() * openings.length)]

  // 活动评价
  let activityComment = ''
  if (completedCount === 3) {
    activityComment = '三个学习活动你都顺利完成，这说明你不仅认真听讲，还能够积极动手实践。'
  } else if (completedCount === 2) {
    activityComment = '你完成了大部分学习活动，学习态度值得表扬！'
  } else {
    activityComment = '虽然有些活动还没来得及完成，但你已经迈出了学习的步伐，这本身就很棒！'
  }

  // 测试评价
  let quizComment = ''
  if (quizTotal > 0) {
    if (quizScore >= 80) {
      quizComment = `课堂小测试你答对了${quizCorrect}道题，取得了${quizScore}分的好成绩，对今天学到的知识掌握得很扎实！`
    } else if (quizScore >= 60) {
      quizComment = `小测试你答对了${quizCorrect}道题，得分${quizScore}分，基础掌握得不错，继续加油！`
    } else {
      quizComment = `小测试答对了${quizCorrect}道题，得分${quizScore}分。没关系，学习就是不断积累的过程，多复习几遍就会越来越好的！`
    }
  }

  // 自评评价
  let evalComment = ''
  if (avgEval >= 4) {
    evalComment = '你的自我评价非常高，说明你对自己充满信心，老师也相信你一定可以做得更好！'
  } else if (avgEval >= 3) {
    evalComment = '你的自我评价很中肯，能够客观认识自己的学习情况，这种自我反思的能力非常可贵。'
  } else if (avgEval > 0) {
    evalComment = '你觉得还有进步的空间，这恰恰说明你是一个追求进步的孩子！'
  }

  // 结尾 - 展望未来
  const endings = [
    '希望你把今天学到的制作数字相册的本领用到生活中，用数字相册记录你成长的每一个精彩瞬间！加油！',
    '相信你已经掌握了制作数字相册的方法，课下可以试试给家人制作一个温馨的数字相册，他们一定会非常开心的！',
    '数字相册是记录美好回忆的好帮手，期待你用今天学到的技能，创作出更多精彩的作品！继续加油哦！',
  ]
  const ending = endings[Math.floor(Math.random() * endings.length)]

  return `${opening}\n\n${activityComment}\n\n${quizComment}\n\n${evalComment}\n\n${ending}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      studentName,
      studentClass,
      activity1Completed,
      activity2Completed,
      activity3Completed,
      quizCorrect,
      quizTotal,
      avgEval,
    } = body

    const quizScore = quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : 0

    const systemPrompt = '你是一位经验丰富、和蔼可亲的小学信息技术老师，擅长写鼓励性评语。你的评语温暖、具体、有针对性，适合小学三年级学生阅读。'
    const userPrompt = `你是一位经验丰富、和蔼可亲的小学信息技术老师。请根据以下学生课堂表现数据，为这位学生写一段鼓励性的评语。

学生姓名：${studentName}
班级：${studentClass || '未填写'}
活动一完成情况：${activity1Completed ? '已完成' : '未完成'}
活动二完成情况：${activity2Completed ? '已完成' : '未完成'}
活动三完成情况：${activity3Completed ? '已完成' : '未完成'}
课堂小测试成绩：${quizCorrect}/${quizTotal}（正确${quizScore}分）
自我评价平均星级：${avgEval}/5

评语要求：
1. 以鼓励和正向为主，语言温暖亲切，适合小学三年级学生阅读
2. 评语控制在150-250字左右
3. 先肯定学生的努力和完成情况
4. 根据测试成绩和自评情况，给予具体的表扬
5. 如果有未完成的活动或测试成绩不理想，用鼓励的方式引导继续努力，不要批评
6. 最后展望未来，鼓励学生在生活中也能运用所学知识
7. 适当使用感叹号和亲切的称呼，语气活泼
8. 不要使用emoji或表情符号
9. 直接输出评语内容，不要加引号或额外格式`

    // 依次尝试：z-ai-web-dev-sdk → OpenAI兼容API → 本地模板
    let comment = await generateWithZAI(systemPrompt, userPrompt)

    if (!comment) {
      comment = await generateWithOpenAI(systemPrompt, userPrompt)
    }

    if (!comment) {
      comment = generateLocalComment({
        studentName: studentName || '同学',
        studentClass: studentClass || '',
        activity1Completed,
        activity2Completed,
        activity3Completed,
        quizCorrect,
        quizTotal,
        quizScore,
        avgEval,
      })
    }

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('AI comment generation error:', error)
    return NextResponse.json(
      { error: '生成评语失败，请重试' },
      { status: 500 }
    )
  }
}
