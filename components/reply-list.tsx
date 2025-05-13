"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useData } from "@/context/data-context"
import type { Reply } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import ReplyForm from "./reply-form"
import { useToast } from "@/components/ui/use-toast"

interface ReplyListProps {
  replies: Reply[]
  allReplies: Reply[]
  questionId: string
  questionLocked?: boolean
  level?: number
}

export default function ReplyList({
  replies,
  allReplies,
  questionId,
  questionLocked = false,
  level = 0,
}: ReplyListProps) {
  const { upvoteReply } = useData()
  const { toast } = useToast()
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({})

  const toggleReply = (replyId: string) => {
    if (replyingTo === replyId) {
      setReplyingTo(null)
    } else {
      setReplyingTo(replyId)
    }
  }

  const toggleExpand = (replyId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [replyId]: !prev[replyId],
    }))
  }

  const getChildReplies = (replyId: string) => {
    return allReplies.filter((r) => r.parentReplyId === replyId)
  }

  if (replies.length === 0) {
    return <div className="text-center text-muted-foreground py-4">No replies yet. Be the first to reply!</div>
  }

  const marginLeft = level > 0 ? `${Math.min(level * 16, 64)}px` : "0"
  const borderColors = [
    "border-l-primary/70",
    "border-l-primary-accent/70",
    "border-l-secondary/70",
    "border-l-accent/70",
  ]
  const borderColor = borderColors[level % borderColors.length]

  return (
    <div className="space-y-4">
      {replies.map((reply, index) => {
        const childReplies = getChildReplies(reply.id)
        const hasChildren = childReplies.length > 0
        const isExpanded = expandedReplies[reply.id] !== false // Default to expanded

        return (
          <motion.div
            key={reply.id}
            style={{ marginLeft }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className={`border-l-4 ${borderColor} bg-card/50 backdrop-blur-sm`}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{reply.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <p className="whitespace-pre-line">{reply.content}</p>
              </CardContent>

              <CardFooter className="flex justify-between py-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1 ${reply.upvoted ? "text-primary" : ""}`}
                    onClick={() => upvoteReply(reply.id)}
                  >
                    <ThumbsUp className={`h-4 w-4 ${reply.upvoted ? "fill-primary text-primary" : ""}`} />
                    <span>{reply.upvotes}</span>
                  </Button>

                  {!questionLocked && level < 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => toggleReply(reply.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Reply</span>
                    </Button>
                  )}
                </div>

                {hasChildren && (
                  <Button variant="ghost" size="sm" onClick={() => toggleExpand(reply.id)}>
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Hide Replies
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show Replies ({childReplies.length})
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>

            <AnimatePresence>
              {replyingTo === reply.id && !questionLocked && (
                <motion.div
                  className="mt-2 mb-4 ml-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReplyForm
                    questionId={questionId}
                    parentReplyId={reply.id}
                    onSuccess={() => {
                      setReplyingTo(null)
                      setExpandedReplies((prev) => ({
                        ...prev,
                        [reply.id]: true,
                      }))
                      toast({
                        title: "Reply posted!",
                        description: "Your reply has been posted successfully.",
                      })
                    }}
                    onCancel={() => setReplyingTo(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {hasChildren && isExpanded && (
                <motion.div
                  className="mt-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReplyList
                    replies={childReplies}
                    allReplies={allReplies}
                    questionId={questionId}
                    questionLocked={questionLocked}
                    level={level + 1}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
