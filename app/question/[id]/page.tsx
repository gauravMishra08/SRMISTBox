"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useAnimationControls } from "framer-motion"
import { useData } from "@/context/data-context"
import ReplyForm from "@/components/reply-form"
import ReplyList from "@/components/reply-list"
import QuestionDetail from "@/components/question-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, MessageSquare, ChevronDown, ChevronUp, Sparkles, RotateCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Logo from "@/components/logo"

const funMessages = [
  "Knowledge is power! Share yours 💡",
  "What's your take on this? 🤔",
  "Your insight could help someone! ✨",
  "Drop some wisdom here 📚",
  "Be the hero this question needs 🦸"
]

export default function QuestionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { questions, replies } = useData()
  const [isClient, setIsClient] = useState(false)
  const [isRepliesExpanded, setIsRepliesExpanded] = useState(true)
  const [randomMessage, setRandomMessage] = useState(funMessages[0])
  const controls = useAnimationControls()

  useEffect(() => {
    setIsClient(true)
    setRandomMessage(funMessages[Math.floor(Math.random() * funMessages.length)])
  }, [])

  const refreshMessage = () => {
    controls.start({
      rotate: 360,
      transition: { duration: 0.6 }
    }).then(() => {
      setRandomMessage(funMessages[Math.floor(Math.random() * funMessages.length)])
      controls.start({ rotate: 0 })
    })
  }

  if (!isClient) {
    return null
  }

  const question = questions.find((q) => q.id === params.id)

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Logo />
            </motion.div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              variant="outline" 
              onClick={() => router.push("/")} 
              className="mb-4 bg-card hover:bg-accent border-border"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Take me back to safety
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Alert variant="destructive" className="border-destructive bg-destructive/10">
              <AlertDescription>
                <span className="font-medium">Whoops!</span> This question has vanished into the digital void. 
                Maybe it got abducted by aliens? 👽
              </AlertDescription>
            </Alert>
          </motion.div>
        </div>
      </div>
    )
  }

  const questionReplies = replies.filter((r) => r.questionId === question.id && !r.parentReplyId)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Logo />
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }}
        >
          <Button 
            variant="outline" 
            onClick={() => router.push("/")} 
            className="mb-6 bg-card hover:bg-accent border-border"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to the question jungle
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6"
          whileHover={{ scale: 1.005 }}
        >
          <QuestionDetail question={question} />
        </motion.div>

        <AnimatePresence>
          {question.isLocked ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="my-6"
            >
              <Alert className="border-primary bg-primary/10">
                <AlertDescription className="flex items-center text-primary">
                  <Lock className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>
                    <span className="font-medium">Discussion locked!</span> This question has been archived. 
                    No new replies can be added, but you can still read the wisdom shared.
                  </span>
                </AlertDescription>
              </Alert>
            </motion.div>
          ) : (
            <motion.div
              className="my-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <motion.p 
                  className="text-sm text-primary font-medium"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {randomMessage}
                </motion.p>
                <motion.button
                  onClick={refreshMessage}
                  animate={controls}
                  className="text-primary/70 hover:text-primary"
                  aria-label="Refresh message"
                >
                  <RotateCw className="h-4 w-4" />
                </motion.button>
              </div>
              <ReplyForm
                questionId={question.id}
                onSuccess={() => {
                  toast({
                    title: "🎉 Reply posted!",
                    description: "Your knowledge has been shared with the class!",
                  })
                  setIsRepliesExpanded(true)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <motion.button
            className="flex items-center gap-2 mb-4 group w-full"
            onClick={() => setIsRepliesExpanded(!isRepliesExpanded)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.h2 
              className="text-2xl font-bold flex items-center gap-2"
              animate={{ 
                color: isRepliesExpanded ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                x: isRepliesExpanded ? 0 : 2
              }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="h-5 w-5" />
              {questionReplies.length} {questionReplies.length === 1 ? "Classmate Response" : "Classmate Responses"}
              {questionReplies.length > 0 && (
                <span className="text-sm font-normal ml-2 px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {questionReplies.length} wisdom nugget{questionReplies.length !== 1 ? 's' : ''}
                </span>
              )}
            </motion.h2>
            <motion.span
              animate={{ rotate: isRepliesExpanded ? 0 : 180 }}
              transition={{ duration: 0.2 }}
              className="ml-auto text-muted-foreground group-hover:text-primary"
            >
              {isRepliesExpanded ? <ChevronUp /> : <ChevronDown />}
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {isRepliesExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ReplyList
                  replies={questionReplies}
                  allReplies={replies}
                  questionId={question.id}
                  questionLocked={question.isLocked}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}