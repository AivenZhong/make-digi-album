'use client'

import { useLearningStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const STEPS = [
  { label: '开始', icon: '🏠' },
  { label: '活动一', icon: '📸' },
  { label: '活动二', icon: '🎬' },
  { label: '活动三', icon: '🎨' },
  { label: '小测试', icon: '📝' },
  { label: '自我评价', icon: '⭐' },
  { label: 'AI评语', icon: '🤖' },
]

export function StepNav() {
  const { currentStep, totalSteps, setCurrentStep } = useLearningStore()

  return (
    <div className="w-full py-3 px-4">
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
            initial={false}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {STEPS.map((step, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentStep(index)}
            className="flex flex-col items-center gap-1 focus:outline-none"
          >
            <motion.div
              className={cn(
                'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-colors',
                index < currentStep
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                  : index === currentStep
                  ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-200 scale-110'
                  : 'bg-muted text-muted-foreground'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {index < currentStep ? '✓' : step.icon}
            </motion.div>
            <span
              className={cn(
                'text-[10px] sm:text-xs font-medium',
                index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {step.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
