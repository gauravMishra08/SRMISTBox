"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface AIContextType {
  isGenerating: boolean
  generateTips: (content: string) => Promise<string>
}

const AIContext = createContext<AIContextType>({
  isGenerating: false,
  generateTips: async () => "",
})

export const useAI = () => useContext(AIContext)

interface AIProviderProps {
  children: ReactNode
}

export function AIProvider({ children }: AIProviderProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  // Simulate AI tip generation
  const generateTips = useCallback(async (content: string): Promise<string> => {
    setIsGenerating(true)

    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a tip based on the question content
        const tips = [
          "Try breaking down your problem into smaller parts for better understanding.",
          "Consider reaching out to your professor during office hours for personalized help.",
          "Check the SRM Knowledge Base for similar questions that might have been answered before.",
          "The library has excellent resources that might help with this topic.",
          "Study groups can be very effective for tackling complex problems like this.",
          "This seems like a common question - check previous year question papers for similar problems.",
          "For technical questions, the lab assistants are often a great resource.",
          "Consider posting this question on the department forum for more visibility.",
          "This topic is covered in detail in the recommended textbook, chapter 5.",
          "The SRM online learning portal has video tutorials that might help with this concept.",
        ]

        // Choose a tip that seems relevant based on simple keyword matching
        let selectedTip = tips[Math.floor(Math.random() * tips.length)]

        // Try to make the tip more relevant based on keywords
        const keywords = {
          exam: "Review past exam papers for similar questions. The pattern often repeats.",
          fee: "The accounts department on the 2nd floor of the main building can help with fee-related queries.",
          hostel: "The hostel warden's office is open from 9 AM to 5 PM for addressing hostel-related concerns.",
          assignment: "Check the submission guidelines carefully before finalizing your assignment.",
          project: "Consider scheduling a meeting with your project guide for personalized feedback.",
          placement: "The placement cell offers mock interviews every Wednesday to help students prepare.",
          attendance: "You can check your attendance status on the student portal under the 'Academic' section.",
          library: "The library's digital resources can be accessed remotely using your student credentials.",
          scholarship: "Scholarship applications for the next semester open next month - prepare your documents early.",
          internship: "The internship coordinator can help you find opportunities aligned with your interests.",
        }

        const lowerContent = content.toLowerCase()

        for (const [keyword, tip] of Object.entries(keywords)) {
          if (lowerContent.includes(keyword)) {
            selectedTip = tip
            break
          }
        }

        setIsGenerating(false)
        resolve(selectedTip)
      }, 1500)
    })
  }, [])

  return (
    <AIContext.Provider
      value={{
        isGenerating,
        generateTips,
      }}
    >
      {children}
    </AIContext.Provider>
  )
}
