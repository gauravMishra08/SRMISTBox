"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Question, Reply } from "@/types"

// List of offensive words to filter automatically
const DEFAULT_PROFANITY_LIST = [
  "profanity",
  "offensive",
  "inappropriate",
  "damn",
  "hell",
  "shit",
  "fuck",
  "asshole",
  "bitch",
  "bastard",
  "cunt",
  "dick",
  "pussy",
  "slut",
  "whore",
  "piss",
  "cock",
  "bullshit",
  "ass",
  "crap",
  "idiot",
  "stupid",
  "dumb",
  "retard",
  "moron",
  "jerk",
  "loser",
  "fat",
]

// Function to filter profanity
function filterProfanity(text: string): string {
  let filteredText = text

  DEFAULT_PROFANITY_LIST.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    const replacement = "*".repeat(word.length)
    filteredText = filteredText.replace(regex, replacement)
  })

  return filteredText
}

interface DataContextType {
  questions: Question[]
  replies: Reply[]
  availableTags: string[]
  addQuestion: (
    questionData: Omit<Question, "id" | "timestamp" | "upvotes" | "upvoted" | "isPinned" | "isLocked">,
  ) => void
  updateQuestion: (question: Question) => void
  upvoteQuestion: (id: string) => void
  addReply: (replyData: Omit<Reply, "id" | "timestamp" | "upvotes" | "upvoted">) => void
  upvoteReply: (id: string) => void
  getReplyCount: (questionId: string) => number
  addTag: (tag: string) => void
  tags: string[]
}

const DataContext = createContext<DataContextType>({
  questions: [],
  replies: [],
  availableTags: [],
  addQuestion: () => {},
  updateQuestion: () => {},
  upvoteQuestion: () => {},
  addReply: () => {},
  upvoteReply: () => {},
  getReplyCount: () => 0,
  addTag: () => {},
  tags: [],
})

export const useData = () => useContext(DataContext)

interface DataProviderProps {
  children: ReactNode
}

export function DataProvider({ children }: DataProviderProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [replies, setReplies] = useState<Reply[]>([])
  const [tags, setTags] = useState<string[]>([
    "hostel",
    "exam",
    "fees",
    "club",
    "faculty",
    "placement",
    "events",
    "food",
  ])

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedQuestions = localStorage.getItem("campusqa_questions")
      const storedReplies = localStorage.getItem("campusqa_replies")
      const storedTags = localStorage.getItem("campusqa_tags")

      if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions))
      }

      if (storedReplies) {
        setReplies(JSON.parse(storedReplies))
      }

      if (storedTags) {
        setTags(JSON.parse(storedTags))
      }
    }
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("campusqa_questions", JSON.stringify(questions))
    }
  }, [questions])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("campusqa_replies", JSON.stringify(replies))
    }
  }, [replies])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("campusqa_tags", JSON.stringify(tags))
    }
  }, [tags])

  const addQuestion = (
    questionData: Omit<Question, "id" | "timestamp" | "upvotes" | "upvoted" | "isPinned" | "isLocked">,
  ) => {
    // Filter profanity from content
    const filteredContent = filterProfanity(questionData.content)

    const newQuestion: Question = {
      id: uuidv4(),
      timestamp: Date.now(),
      upvotes: 0,
      upvoted: false,
      isPinned: false,
      isLocked: false,
      ...questionData,
      content: filteredContent,
    }

    setQuestions((prev) => [newQuestion, ...prev])

    // Add any new tags to the tags list
    if (questionData.tags && questionData.tags.length > 0) {
      const newTags = questionData.tags.filter((tag) => !tags.includes(tag))
      if (newTags.length > 0) {
        setTags((prev) => [...prev, ...newTags])
      }
    }
  }

  const updateQuestion = (updatedQuestion: Question) => {
    // Filter profanity from content
    const filteredContent = filterProfanity(updatedQuestion.content)

    setQuestions((prev) =>
      prev.map((q) => (q.id === updatedQuestion.id ? { ...updatedQuestion, content: filteredContent } : q)),
    )

    // Add any new tags to the tags list
    if (updatedQuestion.tags && updatedQuestion.tags.length > 0) {
      const newTags = updatedQuestion.tags.filter((tag) => !tags.includes(tag))
      if (newTags.length > 0) {
        setTags((prev) => [...prev, ...newTags])
      }
    }
  }

  const upvoteQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            upvotes: q.upvoted ? q.upvotes - 1 : q.upvotes + 1,
            upvoted: !q.upvoted,
          }
        }
        return q
      }),
    )
  }

  const addReply = (replyData: Omit<Reply, "id" | "timestamp" | "upvotes" | "upvoted">) => {
    // Filter profanity from content
    const filteredContent = filterProfanity(replyData.content)

    const newReply: Reply = {
      id: uuidv4(),
      timestamp: Date.now(),
      upvotes: 0,
      upvoted: false,
      ...replyData,
      content: filteredContent,
    }

    setReplies((prev) => [newReply, ...prev])
  }

  const upvoteReply = (id: string) => {
    setReplies((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            upvotes: r.upvoted ? r.upvotes - 1 : r.upvotes + 1,
            upvoted: !r.upvoted,
          }
        }
        return r
      }),
    )
  }

  const getReplyCount = (questionId: string): number => {
    return replies.filter((r) => r.questionId === questionId).length
  }

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags((prev) => [...prev, tag])
    }
  }

  return (
    <DataContext.Provider
      value={{
        questions,
        replies,
        availableTags: tags,
        addQuestion,
        updateQuestion,
        upvoteQuestion,
        addReply,
        upvoteReply,
        getReplyCount,
        addTag,
        tags,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
