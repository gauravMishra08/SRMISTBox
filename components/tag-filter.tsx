"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface TagFilterProps {
  availableTags: string[]
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
}

export default function TagFilter({ availableTags, selectedTags, setSelectedTags }: TagFilterProps) {
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleClearAll = () => {
    setSelectedTags([])
  }

  if (availableTags.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card/50 backdrop-blur-sm p-4 rounded-lg shadow-sm"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Filter by tags</h3>
        {selectedTags.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-xs h-7">
            Clear all
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag, index) => (
          <motion.div
            key={tag}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
          >
            <Badge
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={`cursor-pointer ${
                selectedTags.includes(tag) ? "bg-primary hover:bg-primary/90" : "hover:bg-secondary/50"
              }`}
              onClick={() => handleTagSelect(tag)}
            >
              #{tag}
              {selectedTags.includes(tag) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 text-primary-foreground hover:bg-primary/90"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedTags(selectedTags.filter((t) => t !== tag))
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
