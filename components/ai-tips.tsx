"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, X } from "lucide-react"

interface AITipsProps {
  tips: string
  isLoading: boolean
  onClose: () => void
}

export default function AITips({ tips, isLoading, onClose }: AITipsProps) {
  return (
    <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-900/20 dark:border-amber-800">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-amber-800 dark:text-amber-400 flex items-center text-lg">
          <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
          AI Tips
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <p className="text-amber-900 dark:text-amber-200">{tips}</p>
        )}
      </CardContent>
    </Card>
  )
}
