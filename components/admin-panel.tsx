"use client"

import { useState } from "react"
import { useAdmin } from "@/context/admin-context"
import { useData } from "@/context/data-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ShieldAlert, Save, Trash, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

export default function AdminPanel() {
  const { adminPassword, setAdminPassword } = useAdmin()
  const { clearAllData, addProfanityWord, removeProfanityWord, profanityList } = useData()
  const { toast } = useToast()
  const [newAdminPassword, setNewAdminPassword] = useState(adminPassword)
  const [newProfanityWord, setNewProfanityWord] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSaveAdminPassword = () => {
    if (newAdminPassword.trim()) {
      setAdminPassword(newAdminPassword.trim())
      toast({
        title: "Admin password updated",
        description: "Your admin password has been updated successfully.",
      })
    }
  }

  const handleAddProfanityWord = () => {
    if (newProfanityWord.trim()) {
      addProfanityWord(newProfanityWord.trim().toLowerCase())
      setNewProfanityWord("")
      toast({
        title: "Word added to filter",
        description: "The word has been added to the profanity filter.",
      })
    }
  }

  const handleRemoveProfanityWord = (word: string) => {
    removeProfanityWord(word)
    toast({
      title: "Word removed from filter",
      description: "The word has been removed from the profanity filter.",
    })
  }

  const handleClearAllData = () => {
    clearAllData()
    toast({
      title: "All data cleared",
      description: "All questions and replies have been deleted.",
    })
  }

  return (
    <Card className="mb-6 border-destructive/20 bg-destructive/5">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Admin Panel
            </CardTitle>
            <CardDescription>Manage platform settings and moderation</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <>
          <CardContent className="pt-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Admin Settings</h3>
                <div className="grid gap-2">
                  <Label htmlFor="adminPassword">Admin Password</Label>
                  <div className="flex gap-2">
                    <Input
                      id="adminPassword"
                      type="password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Set admin password"
                      className="bg-background"
                    />
                    <Button variant="outline" onClick={handleSaveAdminPassword} className="shrink-0">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Content Moderation</h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="profanityWord">Add Word to Profanity Filter</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="profanityWord"
                        value={newProfanityWord}
                        onChange={(e) => setNewProfanityWord(e.target.value)}
                        placeholder="Enter word to filter"
                        className="bg-background"
                      />
                      <Button variant="outline" onClick={handleAddProfanityWord} className="shrink-0">
                        Add
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Current Filter List</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profanityList.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No words in filter list</p>
                      ) : (
                        profanityList.map((word) => (
                          <div
                            key={word}
                            className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                          >
                            <span>{word}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 ml-1"
                              onClick={() => handleRemoveProfanityWord(word)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="ml-auto">
                  <Trash className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all questions and replies. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
