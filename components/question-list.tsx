"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useData } from "@/context/data-context"
import type { Question } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, Pin } from "lucide-react"

interface QuestionListProps {
  questions: Question[]
}

export default function QuestionList({ questions }: QuestionListProps) {
  const router = useRouter()
  const { upvoteQuestion, replies, getReplyCount } = useData()

  if (questions.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="mb-4 border-dashed bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No questions found. Be the first to ask a question!
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Sort pinned questions to the top
  const sortedQuestions = [...questions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })

  return (
    <div className="space-y-4">
      {sortedQuestions.map((question, index) => (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.01 }}
          className="transition-all duration-200"
        >
          <Card
            className={`transition-all hover:shadow-md ${
              question.isPinned
                ? "border-primary/50 bg-gradient-to-r from-primary/10 to-primary-accent/10"
                : "bg-card/50 backdrop-blur-sm hover:bg-card"
            }`}
          >
            <CardContent className="pt-4 cursor-pointer" onClick={() => router.push(`/question/${question.id}`)}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">{question.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(question.timestamp, { addSuffix: true })}
                  </p>
                </div>

                <div className="flex gap-1">
                  {question.isPinned && (
                    <Badge variant="outline" className="border-primary text-primary">
                      <Pin className="h-3 w-3 mr-1" />
                      Pinned
                    </Badge>
                  )}
                </div>
              </div>

              <p className="line-clamp-3">{question.content}</p>

              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-secondary/50">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between pt-2">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 ${question.upvoted ? "text-primary" : "text-muted-foreground"}`}
                  onClick={() => upvoteQuestion(question.id)}
                >
                  <ThumbsUp className={`h-4 w-4 ${question.upvoted ? "fill-primary text-primary" : ""}`} />
                  <span>{question.upvotes}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-muted-foreground"
                  onClick={() => router.push(`/question/${question.id}`)}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{getReplyCount(question.id)}</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
