"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/context/data-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  const router = useRouter()
  const { searchQuestions } = useData()
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<{ id: string; title: string; tags?: string[] }>>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = searchQuestions(searchQuery)
        .slice(0, 5)
        .map((q) => ({ id: q.id, title: q.title, tags: q.tags }))
      setSuggestions(results)
    } else {
      setSuggestions([])
    }
  }, [searchQuery, searchQuestions])

  const handleClear = () => {
    setSearchQuery("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleSelect = (questionId: string) => {
    setOpen(false)
    router.push(`/question/${questionId}`)
  }

  return (
    <div className="relative">
      <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="pl-10 pr-10 bg-background/70 backdrop-blur-sm focus:bg-background"
              onFocus={() => setOpen(true)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[calc(100vw-2rem)] sm:w-[500px]" align="start">
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion.id}
                    onSelect={() => handleSelect(suggestion.id)}
                    className="flex flex-col items-start"
                  >
                    <div className="flex items-center w-full">
                      <Search className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{suggestion.title}</span>
                    </div>
                    {suggestion.tags && suggestion.tags.length > 0 && (
                      <div className="flex gap-1 mt-1 ml-6">
                        {suggestion.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        {suggestion.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{suggestion.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
