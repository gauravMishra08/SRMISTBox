"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useData } from "@/context/data-context"
import type { Question } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface QuestionFormProps {
  onSuccess?: () => void
  editMode?: boolean
  questionToEdit?: Question
}

export default function QuestionForm({ onSuccess, editMode = false, questionToEdit }: QuestionFormProps) {
  const { addQuestion, updateQuestion, availableTags, addTag } = useData()
  const { toast } = useToast()
  const [author, setAuthor] = useState(editMode && questionToEdit ? questionToEdit.author : "")
  const [content, setContent] = useState(editMode && questionToEdit ? questionToEdit.content : "")
  const [selectedTags, setSelectedTags] = useState<string[]>(
    editMode && questionToEdit?.tags ? questionToEdit.tags : [],
  )
  const [newTag, setNewTag] = useState("")
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
      newErrors.content = "Content is required"
    } else if (content.length < 10) {
      newErrors.content = "Content must be at least 10 characters"
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
      if (editMode && questionToEdit) {
        updateQuestion({
          ...questionToEdit,
          author,
          content,
          tags: selectedTags,
        })

        toast({
          title: "Question updated!",
          description: "Your question has been updated successfully.",
        })
      } else {
        addQuestion({
          author,
          content,
          tags: selectedTags,
        })

        // Reset form
        setAuthor("")
        setContent("")
        setSelectedTags([])
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error submitting your question. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      const tag = newTag.trim().toLowerCase().replace(/\s+/g, "-")
      setSelectedTags([...selectedTags, tag])
      addTag(tag)
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault()
      handleAddTag()
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
        <Label htmlFor="author">Your Name</Label>
        <Input
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter your name"
          disabled={isSubmitting}
          className="bg-background"
        />
        {errors.author && <p className="text-destructive text-sm mt-1">{errors.author}</p>}
      </div>

      <div>
        <Label htmlFor="content">Your Question</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What would you like to ask?"
          rows={5}
          disabled={isSubmitting}
          className="bg-background"
        />
        {errors.content && <p className="text-destructive text-sm mt-1">{errors.content}</p>}
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input
            id="tags"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tags (e.g. hostel, exam)"
            disabled={isSubmitting}
            onKeyDown={handleKeyDown}
            className="bg-background"
          />
          <Button type="button" variant="outline" onClick={handleAddTag} disabled={!newTag.trim() || isSubmitting}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1 bg-secondary/50">
              #{tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 rounded-full"
                onClick={() => handleRemoveTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>

        {availableTags.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-1">Popular tags:</p>
            <div className="flex flex-wrap gap-2">
              {availableTags.slice(0, 8).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary/50"
                  onClick={() => {
                    if (!selectedTags.includes(tag)) {
                      setSelectedTags([...selectedTags, tag])
                    }
                  }}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-primary to-primary-accent hover:opacity-90"
      >
        {isSubmitting ? "Submitting..." : editMode ? "Update Question" : "Post Question"}
      </Button>
    </motion.form>
  )
}
