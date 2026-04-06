'use client'

import { useState } from 'react'
import { useLearningStore, type SelfEvalAnswer } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'

interface EvalItem {
  id: number
  title: string
  description: string
  icon: string
  color: string
}

const evalItems: EvalItem[] = [
  {
    id: 1,
    title: '我了解',
    description: '我了解数字相册的特点，知道制作数字相册的基本流程以及使用的设备和软件。',
    icon: '📖',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    id: 2,
    title: '我会做',
    description: '我能利用软件的相关功能（如模板）制作"校园美好生活"数字相册。',
    icon: '🎨',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 3,
    title: '我最棒',
    description: '我制作的数字相册能充分展示主题，图文一致，文字与背景音乐切合主题表达。',
    icon: '⭐',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 4,
    title: '我分享',
    description: '完成作品后，我能和同学分享交流，表达自己的想法和感受。',
    icon: '💬',
    color: 'from-pink-400 to-rose-500',
  },
  {
    id: 5,
    title: '我探究',
    description: '我在学习过程中积极思考，遇到困难会想办法解决，并且乐于尝试新的方法。',
    icon: '🔍',
    color: 'from-violet-400 to-purple-500',
  },
]

function StarRating({ value, onChange, disabled }: { value: number; onChange: (v: number) => void; disabled: boolean }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          whileHover={!disabled ? { scale: 1.2 } : {}}
          whileTap={!disabled ? { scale: 0.9 } : {}}
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(0)}
          className="transition-transform"
        >
          <Star
            className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
              star <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-muted-foreground/30'
            }`}
          />
        </motion.button>
      ))}
    </div>
  )
}

export function SelfEvaluation() {
  const { nextStep, setSelfEvalAnswers, setSelfEvalCompleted } = useLearningStore()
  const [ratings, setRatings] = useState<Record<number, number>>({})

  const handleRate = (id: number, rating: number) => {
    setRatings((prev) => ({ ...prev, [id]: rating }))
  }

  const handleSubmit = () => {
    const answers: SelfEvalAnswer[] = evalItems.map((item) => ({
      itemId: item.id,
      rating: ratings[item.id] || 0,
    }))
    setSelfEvalAnswers(answers)
    setSelfEvalCompleted(true)
    nextStep()
  }

  const allRated = evalItems.every((item) => ratings[item.id] && ratings[item.id] > 0)
  const avgRating = Object.values(ratings).length > 0
    ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length).toFixed(1)
    : '0'

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
            ⭐ 自我评价
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            评一评：我的学习情况
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            根据自己的学习表现，给每个评价项目打星吧！
          </p>
        </div>

        {/* Rating Cards */}
        <div className="space-y-4 mb-6">
          {evalItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-amber-100 shadow-md overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl flex-shrink-0`}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    <div className="sm:flex-shrink-0">
                      <StarRating
                        value={ratings[item.id] || 0}
                        onChange={(v) => handleRate(item.id, v)}
                        disabled={false}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        {allRated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-amber-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-4">
                <h3 className="font-bold text-white text-center">评价小结</h3>
              </div>
              <CardContent className="p-5">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-1">
                    {avgRating} 分
                  </div>
                  <p className="text-sm text-muted-foreground">平均星级（满分5分）</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleSubmit}
              disabled={!allRated}
              className="h-11 px-8 text-base font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200 disabled:opacity-50"
            >
              查看AI评语
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
