export interface Question {
  id: string
  content: string
  author: string
  timestamp: number
  upvotes: number
  upvoted: boolean
  isPinned: boolean
  isLocked: boolean
  tags?: string[]
}

export interface Reply {
  id: string
  questionId: string
  parentReplyId?: string
  content: string
  author: string
  timestamp: number
  upvotes: number
  upvoted: boolean
}
