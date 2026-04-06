'use client'

import { useState } from 'react'
import { useLearningStore, type QuizAnswer } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react'

interface Question {
  id: number
  question: string
  options: { label: string; value: string }[]
  correctAnswer: string
}

const questions: Question[] = [
  {
    id: 1,
    question: '数字相册和传统纸质相册最大的区别是什么？',
    options: [
      { label: 'A', value: 'a', text: '数字相册只能保存图片' },
      { label: 'B', value: 'b', text: '数字相册具有动态展示效果，还能加入音乐' },
      { label: 'C', value: 'c', text: '传统相册比数字相册好看' },
      { label: 'D', value: 'd', text: '它们没有区别' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 2,
    question: '以下哪个软件可以用来制作数字相册？',
    options: [
      { label: 'A', value: 'a', text: 'Word文字处理软件' },
      { label: 'B', value: 'b', text: 'Excel表格软件' },
      { label: 'C', value: 'c', text: '剪映视频剪辑软件' },
      { label: 'D', value: 'd', text: '计算器' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 3,
    question: '数字相册本质上是什么类型的作品？',
    options: [
      { label: 'A', value: 'a', text: '一张普通的图片' },
      { label: 'B', value: 'b', text: '一个视频' },
      { label: 'C', value: 'c', text: '一段纯音乐' },
      { label: 'D', value: 'd', text: '一篇文档' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 4,
    question: '制作数字相册的正确流程是？',
    options: [
      { label: 'A', value: 'a', text: '制作作品 → 收集素材 → 分析需求' },
      { label: 'B', value: 'b', text: '分析需求 → 收集素材 → 制作作品 → 完善作品 → 发布作品' },
      { label: 'C', value: 'c', text: '发布作品 → 制作作品 → 收集素材' },
      { label: 'D', value: 'd', text: '收集素材 → 发布作品 → 制作作品' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 5,
    question: '在剪映中，以下哪种方式可以快速制作数字相册？',
    options: [
      { label: 'A', value: 'a', text: '使用相册模板，替换其中的图片和文字' },
      { label: 'B', value: 'b', text: '只能一个一个手动添加图片' },
      { label: 'C', value: 'c', text: '剪映不能制作数字相册' },
      { label: 'D', value: 'd', text: '需要自己画所有的动画效果' },
    ],
    correctAnswer: 'a',
  },
]

export function Quiz() {
  const { nextStep, setQuizAnswers, setQuizCompleted } = useLearningStore()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)

  const handleSelect = (questionId: number, value: string) => {
    if (showResult) return
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = () => {
    setShowResult(true)
    const quizAnswers: QuizAnswer[] = questions.map((q) => ({
      questionId: q.id,
      selectedOption: answers[q.id] || '',
      isCorrect: answers[q.id] === q.correctAnswer,
    }))
    setQuizAnswers(quizAnswers)
    setQuizCompleted(true)
  }

  const handleRetry = () => {
    setAnswers({})
    setShowResult(false)
    setCurrentQ(0)
  }

  const allAnswered = questions.every((q) => answers[q.id])
  const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length
  const score = Math.round((correctCount / questions.length) * 100)

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
            📝 课堂小测试
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            检验你的学习成果
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            共 {questions.length} 道选择题，看看你学会了多少！
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={`question-${currentQ}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question Card */}
              <Card className="border-rose-200 shadow-lg mb-5 overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">
                      第 {currentQ + 1} 题
                    </h2>
                    <span className="text-sm text-white/80">
                      {currentQ + 1} / {questions.length}
                    </span>
                  </div>
                </div>
                <CardContent className="p-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-5 leading-relaxed">
                    {questions[currentQ].question}
                  </h3>

                  <div className="space-y-3">
                    {questions[currentQ].options.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelect(questions[currentQ].id, option.value)}
                        className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${
                          answers[questions[currentQ].id] === option.value
                            ? 'border-rose-400 bg-rose-50 shadow-md'
                            : 'border-border bg-white hover:border-rose-200'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                            answers[questions[currentQ].id] === option.value
                              ? 'bg-rose-500 text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {option.label}
                        </div>
                        <span className="text-sm sm:text-base">{option.text}</span>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Question Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                  disabled={currentQ === 0}
                  className="h-10"
                >
                  上一题
                </Button>

                {/* Question indicators */}
                <div className="flex gap-1.5">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQ(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        idx === currentQ
                          ? 'bg-rose-500 scale-125'
                          : answers[questions[idx].id]
                          ? 'bg-rose-300'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                {currentQ < questions.length - 1 ? (
                  <Button
                    onClick={() => setCurrentQ(currentQ + 1)}
                    className="h-10 bg-rose-500 hover:bg-rose-600"
                  >
                    下一题
                  </Button>
                ) : (
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      onClick={handleSubmit}
                      disabled={!allAnswered}
                      className="h-10 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-200 disabled:opacity-50"
                    >
                      提交答案
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Score Card */}
              <Card className="border-rose-200 shadow-lg mb-5 overflow-hidden">
                <div className={`p-6 text-center ${score >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : score >= 60 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-rose-500 to-pink-500'}`}>
                  <Trophy className="w-12 h-12 text-white mx-auto mb-2" />
                  <h2 className="text-2xl font-bold text-white mb-1">{score} 分</h2>
                  <p className="text-white/80 text-sm">
                    {score >= 80 ? '太棒了！你掌握得很好！' : score >= 60 ? '不错哦！继续加油！' : '别灰心，多复习一下！'}
                  </p>
                </div>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    {questions.map((q, idx) => {
                      const userAnswer = answers[q.id]
                      const isCorrect = userAnswer === q.correctAnswer
                      const userOption = q.options.find((o) => o.value === userAnswer)
                      const correctOption = q.options.find((o) => o.value === q.correctAnswer)

                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-xl border ${
                            isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            {isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            )}
                            <h4 className="font-bold text-sm">{q.question}</h4>
                          </div>
                          <div className="ml-7 text-xs space-y-1">
                            <p className={isCorrect ? 'text-emerald-700' : 'text-red-700'}>
                              你的答案：{userOption?.label}. {userOption?.text}
                            </p>
                            {!isCorrect && (
                              <p className="text-emerald-700">
                                正确答案：{correctOption?.label}. {correctOption?.text}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    className="h-11"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    重新答题
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={nextStep}
                    className="h-11 px-8 text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200"
                  >
                    下一步
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
