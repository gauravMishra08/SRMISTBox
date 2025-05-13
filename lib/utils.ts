import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple profanity filter
export function filterProfanity(text: string): string {
  // Get profanity list from localStorage
  let profanityList: string[] = []

  try {
    if (typeof window !== "undefined") {
      const storedList = localStorage.getItem("campusqa_profanity_list")
      if (storedList) {
        profanityList = JSON.parse(storedList)
      }
    }
  } catch (error) {
    console.error("Error loading profanity list:", error)
    // Default list if localStorage fails
    profanityList = ["profanity", "offensive", "inappropriate"]
  }

  if (!profanityList.length) {
    return text
  }

  let filteredText = text

  profanityList.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    const replacement = "*".repeat(word.length)
    filteredText = filteredText.replace(regex, replacement)
  })

  return filteredText
}
