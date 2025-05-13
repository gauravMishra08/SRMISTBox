"use client"

import { motion } from "framer-motion"
import { useData } from "@/context/data-context"
import type { Question } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, Pin } from "lucide-react"

interface QuestionDetailProps {
  question: Question
}

export default function QuestionDetail({ question }: QuestionDetailProps) {
  const { upvoteQuestion } = useData()

  return (
    <Card
      className={`
      ${
        question.isPinned
          ? "border-primary/50 bg-gradient-to-r from-primary/10 to-primary-accent/10"
          : "bg-card/50 backdrop-blur-sm"
      }
    `}
    >
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <p className="text-xl font-bold">{question.author}</p>
            <p className="text-muted-foreground">{formatDistanceToNow(question.timestamp, { addSuffix: true })}</p>
          </div>

          <div className="flex gap-2">
            {question.isPinned && (
              <Badge variant="outline" className="border-primary text-primary">
                <Pin className="h-3 w-3 mr-1" />
                Pinned
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="whitespace-pre-line">{question.content}</p>

        {question.tags && question.tags.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mt-4"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {question.tags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
              >
                <Badge variant="secondary" className="bg-secondary/50">
                  #{tag}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 ${question.upvoted ? "text-primary" : ""}`}
          onClick={() => upvoteQuestion(question.id)}
        >
          <ThumbsUp className={`h-4 w-4 ${question.upvoted ? "fill-primary text-primary" : ""}`} />
          <span>{question.upvotes}</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
