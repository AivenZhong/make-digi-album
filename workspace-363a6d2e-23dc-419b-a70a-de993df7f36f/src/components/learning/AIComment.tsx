'use client'

import { useEffect, useState } from 'react'
import { useLearningStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Bot, Loader2, Sparkles, RotateCcw } from 'lucide-react'

export function AIComment() {
  const {
    studentName,
    studentClass,
    activity1Completed,
    activity2Completed,
    activity3Completed,
    quizAnswers,
    selfEvalAnswers,
    aiComment,
    setAiComment,
    resetAll,
    setCurrentStep,
  } = useLearningStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!aiComment) {
      generateComment()
    }
  }, [])

  const generateComment = async () => {
    setLoading(true)
    setError('')

    try {
      const quizCorrect = quizAnswers.filter((a) => a.isCorrect).length
      const quizTotal = quizAnswers.length
      const avgEval =
        selfEvalAnswers.length > 0
          ? selfEvalAnswers.reduce((sum, a) => sum + a.rating, 0) / selfEvalAnswers.length
          : 0

      const response = await fetch('/api/ai-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentName || '同学',
          studentClass: studentClass || '',
          activity1Completed,
          activity2Completed,
          activity3Completed,
          quizCorrect,
          quizTotal,
          avgEval: Math.round(avgEval * 10) / 10,
        }),
      })

      if (!response.ok) {
        throw new Error('生成评语失败')
      }

      const data = await response.json()
      setAiComment(data.comment)
    } catch (err) {
      setError('生成评语时出现问题，请重试。')
    } finally {
      setLoading(false)
    }
  }

  const handleRestart = () => {
    resetAll()
    setCurrentStep(0)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
            🤖 AI 评语
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            你的专属AI评价
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            AI老师根据你的课堂表现给出评价
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-3 border border-purple-100 text-center"
          >
            <div className="text-2xl mb-1">📸</div>
            <div className="text-xs text-purple-600 font-medium">活动一</div>
            <div className="text-sm font-bold text-purple-800">
              {activity1Completed ? '已完成' : '未完成'}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100 text-center"
          >
            <div className="text-2xl mb-1">🎬</div>
            <div className="text-xs text-blue-600 font-medium">活动二</div>
            <div className="text-sm font-bold text-blue-800">
              {activity2Completed ? '已完成' : '未完成'}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-3 border border-rose-100 text-center"
          >
            <div className="text-2xl mb-1">📝</div>
            <div className="text-xs text-rose-600 font-medium">小测试</div>
            <div className="text-sm font-bold text-rose-800">
              {quizAnswers.length > 0
                ? `${quizAnswers.filter((a) => a.isCorrect).length}/${quizAnswers.length}`
                : '未完成'}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100 text-center"
          >
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-xs text-amber-600 font-medium">自评</div>
            <div className="text-sm font-bold text-amber-800">
              {selfEvalAnswers.length > 0
                ? `${(selfEvalAnswers.reduce((s, a) => s + a.rating, 0) / selfEvalAnswers.length).toFixed(1)}/5`
                : '未完成'}
            </div>
          </motion.div>
        </div>

        {/* AI Comment Card */}
        <Card className="border-emerald-200 shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI老师的话
            </h2>
          </div>
          <CardContent className="p-5 sm:p-6">
            {loading ? (
              <div className="text-center py-10">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">AI老师正在为你生成专属评语...</p>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-sm text-red-500 mb-4">{error}</p>
                <Button onClick={generateComment} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  重试
                </Button>
              </div>
            ) : aiComment ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose prose-sm max-w-none"
              >
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 sm:p-5 border border-emerald-100">
                  <div className="flex items-start gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-bold text-emerald-800">
                      亲爱的{studentName || '同学'}：
                    </span>
                  </div>
                  <div className="text-sm text-emerald-700 leading-relaxed whitespace-pre-line">
                    {aiComment}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              onClick={generateComment}
              disabled={loading}
              variant="outline"
              className="h-11"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              重新生成
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleRestart}
              className="h-11 px-8 text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200"
            >
              重新开始
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
