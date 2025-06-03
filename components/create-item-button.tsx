"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Link, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { RichTextEditor } from "./rich-text-editor"
import { useMutation } from "@apollo/client"
import { CREATE_ITEM } from "@/lib/graphql/mutations"
import { GET_COLLECTION_ITEMS } from "@/lib/graphql/queries"

interface CreateItemButtonProps {
  collectionId: string
}

export function CreateItemButton({ collectionId }: CreateItemButtonProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [image, setImage] = useState("")
  const [content, setContent] = useState("")
  const [activeTab, setActiveTab] = useState("link")
  const router = useRouter()

  const [createItem, { loading }] = useMutation(CREATE_ITEM, {
    refetchQueries: [{ query: GET_COLLECTION_ITEMS, variables: { collectionId } }],
    onCompleted: () => {
      setTitle("")
      setUrl("")
      setImage("")
      setContent("")
      setOpen(false)
      router.refresh()
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    if (activeTab === "link" && !url.trim()) return

    createItem({
      variables: {
        input: {
          title: title.trim(),
          type: activeTab,
          url: activeTab === "link" ? url.trim() : undefined,
          image: image.trim() || undefined,
          content: activeTab === "diary" ? content : undefined,
          collectionId,
        },
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Plus className="w-5 h-5 mr-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            Add New Item ✨
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-2xl p-1">
            <TabsTrigger value="link" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Link className="w-4 h-4 mr-2" />
              Link
            </TabsTrigger>
            <TabsTrigger
              value="diary"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Diary
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div>
              <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={activeTab === "link" ? "Amazing article title..." : "My diary entry title..."}
                className="mt-2 rounded-2xl border-2 border-blue-100 focus:border-blue-300 transition-colors"
                required
              />
            </div>

            <TabsContent value="link" className="space-y-6 mt-0">
              <div>
                <Label htmlFor="url" className="text-sm font-semibold text-gray-700">
                  URL
                </Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="mt-2 rounded-2xl border-2 border-blue-100 focus:border-blue-300 transition-colors"
                  required={activeTab === "link"}
                />
              </div>
              <div>
                <Label htmlFor="image" className="text-sm font-semibold text-gray-700">
                  Custom Image URL (optional)
                </Label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-2 rounded-2xl border-2 border-blue-100 focus:border-blue-300 transition-colors"
                />
              </div>
            </TabsContent>

            <TabsContent value="diary" className="space-y-6 mt-0">
              <div>
                <Label className="text-sm font-semibold text-gray-700">Content</Label>
                <div className="mt-2">
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Write your thoughts, memories, or anything you want to remember... ✨"
                  />
                </div>
              </div>
            </TabsContent>

            <Button
              type="submit"
              disabled={loading || !title.trim() || (activeTab === "link" && !url.trim())}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-2xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? "Adding..." : `Add ${activeTab === "link" ? "Link" : "Diary Entry"} 🎉`}
            </Button>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
