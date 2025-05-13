"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useData } from "@/context/data-context"
import QuestionList from "@/components/question-list"
import QuestionForm from "@/components/question-form"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import TagFilter from "@/components/tag-filter"
import Logo from "@/components/logo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RegisterSW from "./register-sw"

export default function Home() {
  const { questions, tags } = useData()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState(questions)
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Animate intro sequence
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter questions based on selected tags
    let filtered = questions

    if (selectedTags.length > 0) {
      filtered = filtered.filter((question) => selectedTags.some((tag) => question.tags?.includes(tag)))
    }

    setFilteredQuestions(filtered)
  }, [selectedTags, questions])

  // Sort questions by trending (upvotes + recency)
  const trendingQuestions = [...filteredQuestions].sort((a, b) => {
    const aScore = a.upvotes + (Date.now() - a.timestamp) / 86400000
    const bScore = b.upvotes + (Date.now() - b.timestamp) / 86400000
    return bScore - aScore
  })

  // Sort questions by recency
  const recentQuestions = [...filteredQuestions].sort((a, b) => b.timestamp - a.timestamp)

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80 overflow-hidden">
      <RegisterSW />
      {!showContent ? (
        <div className="h-screen w-full flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex justify-center mb-4"
            >
              <Logo size="large" />
            </motion.div>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="text-xl text-muted-foreground"
            >
              Your campus discussion platform
            </motion.p>
          </motion.div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <Logo />

              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary-accent hover:opacity-90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ask a Question
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <QuestionForm
                    onSuccess={() => {
                      setIsSheetOpen(false)
                      toast({
                        title: "Question posted!",
                        description: "Your question has been posted successfully.",
                      })
                    }}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
              {tags.length > 0 && (
                <div className="mb-6">
                  <TagFilter availableTags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                </div>
              )}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Tabs defaultValue="trending" className="mb-8">
                  <TabsList className="mb-4 bg-muted/50 p-1">
                    <TabsTrigger
                      value="trending"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      🔥 Trending
                    </TabsTrigger>
                    <TabsTrigger
                      value="recent"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      ⏱️ Most Recent
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="trending">
                    <QuestionList questions={trendingQuestions} />
                  </TabsContent>

                  <TabsContent value="recent">
                    <QuestionList questions={recentQuestions} />
                  </TabsContent>
                </Tabs>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </main>
  )
}
