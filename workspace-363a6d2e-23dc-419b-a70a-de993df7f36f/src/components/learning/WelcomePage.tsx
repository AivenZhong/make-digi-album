'use client'

import { useLearningStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { BookOpen, Sparkles } from 'lucide-react'

export function WelcomePage() {
  const { studentName, studentClass, setStudentName, setStudentClass, nextStep } = useLearningStore()

  const canStart = studentName.trim().length > 0 && studentClass.trim().length > 0

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Decorative top */}
        <div className="text-center mb-6">
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">AI 电子学习单</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            制作数字相册
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            信息科技 三年级上册 第四单元 第13课
          </p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-emerald-100/50 border border-emerald-100 p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground mb-1">欢迎来到课堂</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                今天我们将学习如何制作精美的数字相册，记录美好的校园生活！
              </p>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-6 border border-amber-100">
            <h3 className="text-sm font-bold text-amber-800 mb-2">学习目标</h3>
            <ul className="space-y-1.5 text-sm text-amber-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">●</span>
                <span>了解数字相册的特点和素材类型</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">●</span>
                <span>学会使用软件模板制作数字相册</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">●</span>
                <span>掌握创作数字相册的过程和方法</span>
              </li>
            </ul>
          </div>

          {/* Student Info Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                请输入你的姓名
              </label>
              <Input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="例如：张小明"
                className="h-11 text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                请输入你的班级
              </label>
              <Input
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="例如：三年级1班"
                className="h-11 text-base"
              />
            </div>
          </div>

          {/* Start Button */}
          <motion.div className="mt-6" whileTap={{ scale: 0.97 }}>
            <Button
              onClick={nextStep}
              disabled={!canStart}
              className="w-full h-12 text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              开始学习
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
