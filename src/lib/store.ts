import { create } from 'zustand'

export interface Activity1Answer {
  traditional: {
    storage: string
    duration: string
    editable: string
    materials: string[]
    other: string
  }
  digital: {
    storage: string
    duration: string
    editable: string
    materials: string[]
    other: string
  }
  samePoint: string
}

export interface Activity2Answer {
  knowSoftware: string
  isVideo: boolean
  templateExplored: boolean
}

export interface Activity3Answer {
  sortOrder: number[] // 正确顺序: 1-分析需求 2-收集素材 3-制作作品 4-完善作品 5-发布作品
  theme: string
}

export interface QuizAnswer {
  questionId: number
  selectedOption: string
  isCorrect: boolean
}

export interface SelfEvalAnswer {
  itemId: number
  rating: number // 1-5 stars
}

export interface LearningStore {
  // Step navigation
  currentStep: number
  totalSteps: number
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  // Student info
  studentName: string
  studentClass: string
  setStudentName: (name: string) => void
  setStudentClass: (cls: string) => void

  // Activity 1
  activity1Completed: boolean
  activity1Answer: Activity1Answer | null
  setActivity1Answer: (answer: Activity1Answer) => void
  setActivity1Completed: (completed: boolean) => void

  // Activity 2
  activity2Completed: boolean
  activity2Answer: Activity2Answer | null
  setActivity2Answer: (answer: Activity2Answer) => void
  setActivity2Completed: (completed: boolean) => void

  // Activity 3
  activity3Completed: boolean
  activity3Answer: Activity3Answer | null
  setActivity3Answer: (answer: Activity3Answer) => void
  setActivity3Completed: (completed: boolean) => void

  // Quiz
  quizCompleted: boolean
  quizAnswers: QuizAnswer[]
  setQuizAnswers: (answers: QuizAnswer[]) => void
  setQuizCompleted: (completed: boolean) => void

  // Self Evaluation
  selfEvalCompleted: boolean
  selfEvalAnswers: SelfEvalAnswer[]
  setSelfEvalAnswers: (answers: SelfEvalAnswer[]) => void
  setSelfEvalCompleted: (completed: boolean) => void

  // AI Comment
  aiComment: string
  setAiComment: (comment: string) => void

  // Reset
  resetAll: () => void
}

export const useLearningStore = create<LearningStore>((set) => ({
  currentStep: 0,
  totalSteps: 7, // 0=welcome, 1=活动一, 2=活动二, 3=活动三, 4=小测试, 5=自我评价, 6=AI评语
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

  studentName: '',
  studentClass: '',
  setStudentName: (name) => set({ studentName: name }),
  setStudentClass: (cls) => set({ studentClass: cls }),

  activity1Completed: false,
  activity1Answer: null,
  setActivity1Answer: (answer) => set({ activity1Answer: answer }),
  setActivity1Completed: (completed) => set({ activity1Completed: completed }),

  activity2Completed: false,
  activity2Answer: null,
  setActivity2Answer: (answer) => set({ activity2Answer: answer }),
  setActivity2Completed: (completed) => set({ activity2Completed: completed }),

  activity3Completed: false,
  activity3Answer: null,
  setActivity3Answer: (answer) => set({ activity3Answer: answer }),
  setActivity3Completed: (completed) => set({ activity3Completed: completed }),

  quizCompleted: false,
  quizAnswers: [],
  setQuizAnswers: (answers) => set({ quizAnswers: answers }),
  setQuizCompleted: (completed) => set({ quizCompleted: completed }),

  selfEvalCompleted: false,
  selfEvalAnswers: [],
  setSelfEvalAnswers: (answers) => set({ selfEvalAnswers: answers }),
  setSelfEvalCompleted: (completed) => set({ selfEvalCompleted: completed }),

  aiComment: '',
  setAiComment: (comment) => set({ aiComment: comment }),

  resetAll: () => set({
    currentStep: 0,
    studentName: '',
    studentClass: '',
    activity1Completed: false,
    activity1Answer: null,
    activity2Completed: false,
    activity2Answer: null,
    activity3Completed: false,
    activity3Answer: null,
    quizCompleted: false,
    quizAnswers: [],
    selfEvalCompleted: false,
    selfEvalAnswers: [],
    aiComment: '',
  }),
}))
