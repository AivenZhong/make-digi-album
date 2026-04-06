'use client'

import { useState } from 'react'
import { useLearningStore, type Activity2Answer } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ArrowRight, Video, Smartphone, Monitor, Scissors, Sparkles } from 'lucide-react'

const softwareItems = [
  {
    name: '剪映',
    icon: <Scissors className="w-8 h-8" />,
    color: 'from-emerald-400 to-teal-500',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    highlight: true,
    description: '支持电脑端和手机端，功能强大，模板丰富，适合制作数字相册！',
  },
  {
    name: 'PowerPoint',
    icon: <Monitor className="w-8 h-8" />,
    color: 'from-orange-400 to-red-500',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    highlight: false,
    description: '微软演示文稿软件，也可以用来制作简单的电子相册。',
  },
  {
    name: '美篇',
    icon: <Smartphone className="w-8 h-8" />,
    color: 'from-pink-400 to-rose-500',
    textColor: 'text-pink-700',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    highlight: false,
    description: '手机端应用，方便快速制作图文并茂的作品。',
  },
  {
    name: '其他软件',
    icon: <Video className="w-8 h-8" />,
    color: 'from-violet-400 to-purple-500',
    textColor: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    highlight: false,
    description: '还有很多其他软件和App可以制作数字相册。',
  },
]

export function ActivityTwo() {
  const { nextStep, setActivity2Answer, setActivity2Completed } = useLearningStore()
  const [showTemplates, setShowTemplates] = useState(false)
  const [isVideo, setIsVideo] = useState<boolean | null>(null)
  const [templateExplored, setTemplateExplored] = useState(false)

  const handleConfirm = () => {
    const answer: Activity2Answer = {
      knowSoftware: '剪映',
      isVideo: isVideo === true,
      templateExplored,
    }
    setActivity2Answer(answer)
    setActivity2Completed(true)
  }

  const canFinish = isVideo === true && templateExplored

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
            🎬 活动二
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            认识制作数字相册的软件
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            了解有哪些软件可以制作数字相册
          </p>
        </div>

        {/* Software Introduction */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            💡 常见的数字相册制作软件
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {softwareItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-2 ${item.highlight ? item.borderColor + ' shadow-lg' : 'border-border'} overflow-hidden`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold ${item.textColor}`}>{item.name}</h3>
                          {item.highlight && (
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                              推荐使用
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Insight */}
        <Card className="border-blue-200 shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              🔍 思考：数字相册到底是什么？
            </h2>
          </div>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-4">
              数字相册里不仅有图片，还能加入文字和音乐，带有动画效果和过渡效果。你觉得，数字相册本质上是什么类型的作品呢？
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsVideo(true)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isVideo === true
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-border bg-white hover:border-blue-200'
                }`}
              >
                <Video className="w-8 h-8 text-blue-500 mb-2" />
                <h3 className="font-bold text-foreground mb-1">视频</h3>
                <p className="text-xs text-muted-foreground">
                  数字相册本质上是视频，可以用视频剪辑软件来制作！
                </p>
                {isVideo === true && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      ✓ 回答正确！
                    </span>
                  </motion.div>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsVideo(false)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isVideo === false
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-border bg-white hover:border-blue-200'
                }`}
              >
                <Monitor className="w-8 h-8 text-gray-500 mb-2" />
                <h3 className="font-bold text-foreground mb-1">图片/PPT</h3>
                <p className="text-xs text-muted-foreground">
                  可能是图片或PPT类型
                </p>
                {isVideo === false && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                    <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                      再想想哦～
                    </span>
                  </motion.div>
                )}
              </motion.button>
            </div>

            {isVideo === true && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
              >
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>没错！</strong>数字相册本质上就是<strong>视频</strong>。因为它不仅包含静态的图片，
                  还加入了动态的过渡效果、背景音乐和文字动画，这些都是视频的典型特征。
                  所以我们可以使用<strong>视频剪辑软件</strong>（比如<strong>剪映</strong>）来制作数字相册！
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Template Exploration */}
        {isVideo === true && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-emerald-200 shadow-lg mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  🎨 体验剪映相册模板
                </h2>
              </div>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground mb-4">
                  剪映提供了很多精美的相册模板，可以帮助我们快速制作数字相册。
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                    <span className="text-lg">1️⃣</span>
                    <div>
                      <h4 className="font-bold text-sm text-emerald-800">打开剪映</h4>
                      <p className="text-xs text-emerald-600">在电脑或手机上打开剪映软件</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                    <span className="text-lg">2️⃣</span>
                    <div>
                      <h4 className="font-bold text-sm text-emerald-800">进入模板中心</h4>
                      <p className="text-xs text-emerald-600">在首页找到&quot;模板&quot;入口，点击进入</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                    <span className="text-lg">3️⃣</span>
                    <div>
                      <h4 className="font-bold text-sm text-emerald-800">搜索相册模板</h4>
                      <p className="text-xs text-emerald-600">在搜索栏输入&quot;校园&quot;、&quot;相册&quot;等关键词，浏览模板效果</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                    <span className="text-lg">4️⃣</span>
                    <div>
                      <h4 className="font-bold text-sm text-emerald-800">选择喜欢的模板</h4>
                      <p className="text-xs text-emerald-600">和小组同学讨论，选择最适合&quot;校园美好生活&quot;主题的模板</p>
                    </div>
                  </div>
                </div>

                {/* Template Examples */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 mb-4">
                  <h3 className="font-bold text-sm text-purple-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    模板选择小贴士
                  </h3>
                  <ul className="space-y-1.5 text-xs text-purple-700">
                    <li>• 根据主题选择合适的模板风格</li>
                    <li>• 可以在搜索栏输入关键词快速找到模板</li>
                    <li>• 注意模板中的图片数量和我们的素材是否匹配</li>
                    <li>• 选择背景音乐风格和主题相符的模板</li>
                  </ul>
                </div>

                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => {
                      setTemplateExplored(true)
                      setShowTemplates(true)
                    }}
                    className="w-full h-11 text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200"
                  >
                    {templateExplored ? '✓ 已完成模板探索' : '我已完成模板探索'}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            {/* Next Step */}
            {canFinish && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => {
                      handleConfirm()
                      nextStep()
                    }}
                    className="h-11 px-8 text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200"
                  >
                    下一步
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
