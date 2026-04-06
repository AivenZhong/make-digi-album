import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

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

    const prompt = `你是一位经验丰富、和蔼可亲的小学信息技术老师。请根据以下学生课堂表现数据，为这位学生写一段鼓励性的评语。

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

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: '你是一位经验丰富、和蔼可亲的小学信息技术老师，擅长写鼓励性评语。你的评语温暖、具体、有针对性，适合小学三年级学生阅读。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      thinking: { type: 'disabled' },
    })

    const comment = completion.choices[0]?.message?.content || '你今天的表现很棒！继续加油！'

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('AI comment generation error:', error)
    return NextResponse.json(
      { error: '生成评语失败，请重试' },
      { status: 500 }
    )
  }
}
