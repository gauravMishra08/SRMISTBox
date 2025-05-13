"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useData } from "@/context/data-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface ReplyFormProps {
  questionId: string
  parentReplyId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function ReplyForm({ questionId, parentReplyId, onSuccess, onCancel }: ReplyFormProps) {
  const { addReply } = useData()
  const { toast } = useToast()
  const [author, setAuthor] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({
    author: "",
    content: "",
  })

  const validate = () => {
    const newErrors = {
      author: "",
      content: "",
    }

    if (!author.trim()) {
      newErrors.author = "Name is required"
    }

    if (!content.trim()) {
      newErrors.content = "Reply content is required"
    } else if (content.length < 5) {
      newErrors.content = "Reply must be at least 5 characters"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      addReply({
        questionId,
        parentReplyId,
        author,
        content,
      })

      // Reset form
      setAuthor("")
      setContent("")

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error submitting your reply. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <Label htmlFor={`author-${parentReplyId || "main"}`}>Your Name</Label>
        <Input
          id={`author-${parentReplyId || "main"}`}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter your name"
          disabled={isSubmitting}
          className="bg-background"
        />
        {errors.author && <p className="text-destructive text-sm mt-1">{errors.author}</p>}
      </div>

      <div>
        <Label htmlFor={`content-${parentReplyId || "main"}`}>Your Reply</Label>
        <Textarea
          id={`content-${parentReplyId || "main"}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your reply here"
          rows={3}
          disabled={isSubmitting}
          className="bg-background"
        />
        {errors.content && <p className="text-destructive text-sm mt-1">{errors.content}</p>}
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-primary to-primary-accent hover:opacity-90"
        >
          {isSubmitting ? "Submitting..." : "Post Reply"}
        </Button>
      </div>
    </motion.form>
  )
}
