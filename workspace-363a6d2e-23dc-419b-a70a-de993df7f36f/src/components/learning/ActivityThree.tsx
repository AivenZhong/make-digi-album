'use client'

import { useState, useCallback } from 'react'
import { useLearningStore, type Activity3Answer } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, GripVertical, CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const CORRECT_ORDER = ['分析需求', '收集素材', '制作作品', '完善作品', '发布作品']

const STEP_DESCRIPTIONS: Record<string, string> = {
  分析需求: '确定作品的主题和内容，给作品起一个响亮的名字。',
  收集素材: '根据主题，准备好需要的图片、文字和背景音乐。',
  制作作品: '使用剪映等软件，选择模板并替换素材。',
  完善作品: '检查作品，修改不合适的地方，让作品更好。',
  发布作品: '导出视频文件，保存并分享你的数字相册。',
}

function SortableItem({ id, index }: { id: string; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all ${
          isDragging
            ? 'border-emerald-400 bg-emerald-50 shadow-lg scale-105'
            : 'border-border bg-white hover:border-emerald-200'
        }`}
      >
        {/* Touch-friendly drag handle - larger hit area on mobile */}
        <div
          className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white flex-shrink-0 cursor-grab active:cursor-grabbing touch-none select-none"
          {...attributes}
          {...listeners}
          role="button"
          aria-label={`拖拽排列 ${id}`}
        >
          <GripVertical className="w-5 h-5" />
        </div>
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-bold text-sm sm:text-base">{id}</span>
          <p className="text-xs text-muted-foreground sm:hidden mt-0.5">{STEP_DESCRIPTIONS[id]}</p>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:block">{STEP_DESCRIPTIONS[id]}</span>
      </div>
    </div>
  )
}

export function ActivityThree() {
  const { nextStep, setActivity3Answer, setActivity3Completed } = useLearningStore()
  const [items, setItems] = useState(() => [...CORRECT_ORDER].sort(() => Math.random() - 0.5))
  const [checked, setChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [theme, setTheme] = useState('')
  const [phase, setPhase] = useState<'sort' | 'guide'>('sort')

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.indexOf(active.id as string)
        const newIndex = prev.indexOf(over.id as string)
        return arrayMove(prev, oldIndex, newIndex)
      })
      setChecked(false)
    }
  }, [])

  const checkOrder = () => {
    const correct = items.every((item, index) => item === CORRECT_ORDER[index])
    setIsCorrect(correct)
    setChecked(true)
    if (correct) {
      setTimeout(() => setPhase('guide'), 1500)
    }
  }

  const handleFinish = () => {
    const answer: Activity3Answer = {
      sortOrder: items.map((item) => CORRECT_ORDER.indexOf(item) + 1),
      theme,
    }
    setActivity3Answer(answer)
    setActivity3Completed(true)
    nextStep()
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
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
            🎨 活动三
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            制作数字相册
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            回顾制作流程，开始创作你的数字相册
          </p>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'sort' && (
            <motion.div
              key="sort"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Sorting Game */}
              <Card className="border-amber-200 shadow-lg mb-5 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    🧩 排一排：梳理创作数字作品的流程
                  </h2>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-2">
                    回顾上节课学过的知识，把下面制作数字作品的关键环节按正确顺序排列！
                  </p>
                  <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2.5 mb-4 border border-amber-100">
                    💡 <strong>操作提示：</strong>长按左侧绿色拖拽手柄，然后上下移动来调整顺序。手机端请长按150ms后拖动。
                  </p>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3">
                        {items.map((item, index) => (
                          <SortableItem key={item} id={item} index={index} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  {/* Check Result */}
                  {checked && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
                        isCorrect
                          ? 'bg-emerald-50 border border-emerald-200'
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-sm text-emerald-800">排列正确！太棒了！</p>
                            <p className="text-xs text-emerald-600">
                              正确的流程是：分析需求 → 收集素材 → 制作作品 → 完善作品 → 发布作品
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-sm text-red-800">顺序不太对哦，再试试！</p>
                            <p className="text-xs text-red-600">
                              提示：先想一想，制作作品之前需要先做什么呢？
                            </p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  <motion.div className="mt-4 flex justify-center" whileTap={{ scale: 0.97 }}>
                    <Button
                      onClick={checkOrder}
                      disabled={checked && isCorrect}
                      className="h-11 px-8 text-base font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200 disabled:opacity-50"
                    >
                      检查顺序
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {phase === 'guide' && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Theme Selection */}
              <Card className="border-emerald-200 shadow-lg mb-5 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    📋 第一步：确定主题
                  </h2>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-3">
                    根据制作流程，首先要确定你的数字相册主题。你想做一个什么主题的数字相册呢？
                  </p>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100 mb-4">
                    <p className="text-xs text-amber-700 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      参考主题：校园美好生活、冬日校园、主题班会、二十四节气等
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium flex-shrink-0">我的主题是：</span>
                    <Input
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      placeholder="例如：校园的春天"
                      className="h-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Step by step guide */}
              <Card className="border-emerald-200 shadow-lg mb-5 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    🎯 第二步：制作指南
                  </h2>
                </div>
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        1
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">收集素材</h4>
                        <p className="text-xs text-muted-foreground">
                          打开学习包，找到老师提供的图片和音频素材。也可以使用自己拍摄的照片。
                        </p>
                      </div>
                    </div>
                    {/* Step 2 */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        2
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">选择相册模板</h4>
                        <p className="text-xs text-muted-foreground">
                          打开剪映，在模板中搜索与主题相关的模板（如&quot;校园&quot;）。
                        </p>
                      </div>
                    </div>
                    {/* Step 3 */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        3
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">替换模板中的图片</h4>
                        <p className="text-xs text-muted-foreground">
                          点击模板中的图片，替换成你收集的素材图片。
                        </p>
                      </div>
                    </div>
                    {/* Step 4 */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        4
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">修改文字</h4>
                        <p className="text-xs text-muted-foreground">
                          修改模板中的文字，换成你自己的标题和描述。
                        </p>
                      </div>
                    </div>
                    {/* Step 5 */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        5
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">预览并导出</h4>
                        <p className="text-xs text-muted-foreground">
                          预览效果，确认无误后导出视频，保存你的数字相册作品！
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="border-purple-200 shadow-lg mb-5">
                <CardContent className="p-5">
                  <h3 className="font-bold text-sm text-purple-800 mb-3">💡 制作小贴士</h3>
                  <ul className="space-y-2 text-sm text-purple-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">●</span>
                      <span>选择的图片要和主题内容相关</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">●</span>
                      <span>文字要简洁、清楚，表达出你想说的话</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">●</span>
                      <span>背景音乐要和主题气氛相匹配</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">●</span>
                      <span>遇到问题可以举手问老师，或者和小组同学讨论</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Finish */}
              <div className="flex justify-end">
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={handleFinish}
                    className="h-11 px-8 text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200"
                  >
                    完成活动三
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
