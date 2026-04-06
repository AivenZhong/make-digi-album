'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useLearningStore } from '@/lib/store'
import { StepNav } from '@/components/learning/StepNav'
import { WelcomePage } from '@/components/learning/WelcomePage'
import { ActivityOne } from '@/components/learning/ActivityOne'
import { ActivityTwo } from '@/components/learning/ActivityTwo'
import { ActivityThree } from '@/components/learning/ActivityThree'
import { Quiz } from '@/components/learning/Quiz'
import { SelfEvaluation } from '@/components/learning/SelfEvaluation'
import { AIComment } from '@/components/learning/AIComment'

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 0:
      return <WelcomePage />
    case 1:
      return <ActivityOne />
    case 2:
      return <ActivityTwo />
    case 3:
      return <ActivityThree />
    case 4:
      return <Quiz />
    case 5:
      return <SelfEvaluation />
    case 6:
      return <AIComment />
    default:
      return <WelcomePage />
  }
}

export default function Home() {
  const { currentStep, totalSteps } = useLearningStore()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50/50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
              AI
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">制作数字相册</h1>
              <p className="text-[10px] text-muted-foreground">信息科技 第13课</p>
            </div>
          </div>
          {currentStep > 0 && (
            <div className="text-xs text-muted-foreground">
              {currentStep} / {totalSteps - 1}
            </div>
          )}
        </div>
        {currentStep > 0 && <StepNav />}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="pb-8"
            >
              <StepContent step={currentStep} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border/50 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <p className="text-center text-xs text-muted-foreground">
            AI电子学习单 · 信息科技 三年级上册 第四单元 第13课 · 制作数字相册
          </p>
        </div>
      </footer>
    </div>
  )
}
