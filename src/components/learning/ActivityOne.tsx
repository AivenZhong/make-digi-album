'use client'

import { useState } from 'react'
import { useLearningStore, type Activity1Answer } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Camera, ImageIcon, Clock, Pencil, Music } from 'lucide-react'

type OptionKey = 'storage' | 'duration' | 'editable' | 'materials'

interface RowConfig {
  key: OptionKey
  label: string
  icon: React.ReactNode
  options: { value: string; label: string }[]
}

const rows: RowConfig[] = [
  {
    key: 'storage',
    label: '存储载体',
    icon: <Camera className="w-4 h-4" />,
    options: [
      { value: '纸张', label: '纸张（相纸）' },
      { value: '数字设备', label: '数字设备' },
    ],
  },
  {
    key: 'duration',
    label: '保存时间',
    icon: <Clock className="w-4 h-4" />,
    options: [
      { value: '一段时间', label: '可保存一段时间' },
      { value: '永久保存', label: '永久保存' },
    ],
  },
  {
    key: 'editable',
    label: '是否能修改',
    icon: <Pencil className="w-4 h-4" />,
    options: [
      { value: '是', label: '是' },
      { value: '否', label: '否' },
    ],
  },
  {
    key: 'materials',
    label: '包含的素材',
    icon: <Music className="w-4 h-4" />,
    options: [
      { value: '图片', label: '图片' },
      { value: '文字', label: '文字' },
      { value: '音频', label: '音频' },
    ],
  },
]

const SUMMARY_TRADITIONAL = {
  storage: '纸张',
  duration: '一段时间',
  editable: '否',
  materials: ['图片'],
}

const SUMMARY_DIGITAL = {
  storage: '数字设备',
  duration: '永久保存',
  editable: '是',
  materials: ['图片', '文字', '音频'],
}

export function ActivityOne() {
  const { prevStep, nextStep, setActivity1Answer, setActivity1Completed } = useLearningStore()

  const [traditional, setTraditional] = useState<Record<OptionKey, string>>({
    storage: '',
    duration: '',
    editable: '',
    materials: '',
  })
  const [digital, setDigital] = useState<Record<OptionKey, string>>({
    storage: '',
    duration: '',
    editable: '',
    materials: '',
  })
  const [traditionalMaterials, setTraditionalMaterials] = useState<string[]>([])
  const [digitalMaterials, setDigitalMaterials] = useState<string[]>([])
  const [samePoint, setSamePoint] = useState('')
  const [showSummary, setShowSummary] = useState(false)

  const toggleMaterial = (type: 'traditional' | 'digital', material: string) => {
    if (type === 'traditional') {
      setTraditionalMaterials((prev) =>
        prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]
      )
    } else {
      setDigitalMaterials((prev) =>
        prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]
      )
    }
  }

  const handleSubmit = () => {
    const answer: Activity1Answer = {
      traditional: {
        storage: traditional.storage,
        duration: traditional.duration,
        editable: traditional.editable,
        materials: traditionalMaterials,
        other: '',
      },
      digital: {
        storage: digital.storage,
        duration: digital.duration,
        editable: digital.editable,
        materials: digitalMaterials,
        other: '',
      },
      samePoint,
    }
    setActivity1Answer(answer)
    setShowSummary(true)
    setActivity1Completed(true)
  }

  const isComplete =
    traditional.storage && traditional.duration && traditional.editable &&
    digital.storage && digital.duration && digital.editable

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
            📸 活动一
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            议一议：数字相册及其特点
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            对比传统相册和数字相册，发现它们的不同！
          </p>
        </div>

        {/* Comparison Table */}
        <AnimatePresence mode="wait">
          {!showSummary ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Same Point */}
              <Card className="mb-5 border-purple-100 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-purple-500" />
                    相同点（填一填）
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    无论是传统相册还是数字相册，它们都是多张 _______ 组成的。
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">都是由多张</span>
                    <input
                      value={samePoint}
                      onChange={(e) => setSamePoint(e.target.value)}
                      placeholder="请输入..."
                      className="flex-1 max-w-32 h-9 px-3 text-sm border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none transition-colors"
                    />
                    <span className="text-sm">组成的。</span>
                  </div>
                </CardContent>
              </Card>

              {/* Comparison Rows */}
              <div className="space-y-4">
                {rows.map((row) => (
                  <Card key={row.key} className="border-purple-100 shadow-md">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                          {row.icon}
                        </div>
                        <h3 className="font-bold text-sm sm:text-base">{row.label}</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Traditional */}
                        <div className="bg-amber-50 rounded-xl p-3 sm:p-4 border border-amber-100">
                          <h4 className="text-sm font-bold text-amber-800 mb-3">📖 传统纸质相册</h4>
                          {row.key === 'materials' ? (
                            <div className="flex flex-wrap gap-2">
                              {row.options.map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={() => toggleMaterial('traditional', opt.value)}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    traditionalMaterials.includes(opt.value)
                                      ? 'bg-amber-500 text-white shadow-md'
                                      : 'bg-white text-amber-700 border border-amber-200 hover:border-amber-400'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {row.options.map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={() =>
                                    setTraditional((prev) => ({ ...prev, [row.key]: opt.value }))
                                  }
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    traditional[row.key] === opt.value
                                      ? 'bg-amber-500 text-white shadow-md'
                                      : 'bg-white text-amber-700 border border-amber-200 hover:border-amber-400'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Digital */}
                        <div className="bg-emerald-50 rounded-xl p-3 sm:p-4 border border-emerald-100">
                          <h4 className="text-sm font-bold text-emerald-800 mb-3">💻 数字相册</h4>
                          {row.key === 'materials' ? (
                            <div className="flex flex-wrap gap-2">
                              {row.options.map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={() => toggleMaterial('digital', opt.value)}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    digitalMaterials.includes(opt.value)
                                      ? 'bg-emerald-500 text-white shadow-md'
                                      : 'bg-white text-emerald-700 border border-emerald-200 hover:border-emerald-400'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {row.options.map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={() =>
                                    setDigital((prev) => ({ ...prev, [row.key]: opt.value }))
                                  }
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    digital[row.key] === opt.value
                                      ? 'bg-emerald-500 text-white shadow-md'
                                      : 'bg-white text-emerald-700 border border-emerald-200 hover:border-emerald-400'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Submit */}
              <motion.div className="mt-6 flex justify-center" whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={handleSubmit}
                  disabled={!isComplete}
                  className="h-11 px-8 text-base font-bold bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg shadow-purple-200 disabled:opacity-50"
                >
                  查看总结
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Summary Card */}
              <Card className="border-emerald-200 shadow-lg mb-5 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 sm:p-5">
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    ✨ 活动一总结：数字相册的优点
                  </h2>
                </div>
                <CardContent className="p-5 sm:p-6">
                  <div className="space-y-4">
                    {/* Comparison Results Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="border border-border p-2.5 text-left font-bold">对比项目</th>
                            <th className="border border-border p-2.5 text-left font-bold text-amber-700">📖 传统纸质相册</th>
                            <th className="border border-border p-2.5 text-left font-bold text-emerald-700">💻 数字相册</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-border p-2.5 font-medium">存储载体</td>
                            <td className="border border-border p-2.5 text-amber-700">纸张（相纸）</td>
                            <td className="border border-border p-2.5 text-emerald-700">数字设备</td>
                          </tr>
                          <tr className="bg-muted/30">
                            <td className="border border-border p-2.5 font-medium">保存时间</td>
                            <td className="border border-border p-2.5 text-amber-700">可保存一段时间</td>
                            <td className="border border-border p-2.5 text-emerald-700">永久保存</td>
                          </tr>
                          <tr>
                            <td className="border border-border p-2.5 font-medium">是否能修改</td>
                            <td className="border border-border p-2.5 text-amber-700">否</td>
                            <td className="border border-border p-2.5 text-emerald-700">是</td>
                          </tr>
                          <tr className="bg-muted/30">
                            <td className="border border-border p-2.5 font-medium">包含的素材</td>
                            <td className="border border-border p-2.5 text-amber-700">图片</td>
                            <td className="border border-border p-2.5 text-emerald-700">图片、文字、音频</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Key Points */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                      <h3 className="font-bold text-emerald-800 mb-2 text-sm">💡 数字相册的优点：</h3>
                      <ul className="space-y-2 text-sm text-emerald-700">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                          <span><strong>存储方便：</strong>保存在数字设备中，不占用物理空间，随身携带。</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                          <span><strong>永久保存：</strong>不会褪色、不会损坏，可以长期保存珍贵回忆。</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                          <span><strong>方便编辑：</strong>可以随时修改、添加或删除照片和文字。</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                          <span><strong>素材丰富：</strong>不仅有图片，还能添加文字说明和背景音乐。</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                          <span><strong>动态展示：</strong>以动态方式展现，配有动画效果，更加生动有趣。</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                          <span><strong>便于分享：</strong>可以在各种设备和平台上与家人朋友分享。</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-end">
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
