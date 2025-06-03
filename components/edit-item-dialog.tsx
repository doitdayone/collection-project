"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { RichTextEditor } from "./rich-text-editor"
import type { Item } from "@/types"
import { useMutation } from "@apollo/client"
import { UPDATE_ITEM } from "@/lib/graphql/mutations"
import { GET_COLLECTION_ITEMS } from "@/lib/graphql/queries"

interface EditItemDialogProps {
  item: Item
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditItemDialog({ item, open, onOpenChange }: EditItemDialogProps) {
  const [title, setTitle] = useState(item.title)
  const [url, setUrl] = useState(item.url || "")
  const [image, setImage] = useState(item.image || "")
  const [content, setContent] = useState(item.content || "")
  const router = useRouter()

  const [updateItem, { loading }] = useMutation(UPDATE_ITEM, {
    refetchQueries: [{ query: GET_COLLECTION_ITEMS, variables: { collectionId: item.collectionId } }],
    onCompleted: () => {
      onOpenChange(false)
      router.refresh()
    },
  })

  useEffect(() => {
    if (open) {
      setTitle(item.title)
      setUrl(item.url || "")
      setImage(item.image || "")
      setContent(item.content || "")
    }
  }, [item, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    if (item.type === "link" && !url.trim()) return

    updateItem({
      variables: {
        id: item.id,
        input: {
          title: title.trim(),
          url: item.type === "link" ? url.trim() : undefined,
          image: image.trim() || undefined,
          content: item.type === "diary" ? content : undefined,
        },
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            Edit {item.type === "link" ? "Link" : "Diary Entry"} ✨
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <Label htmlFor="edit-title" className="text-sm font-semibold text-gray-700">
              Title
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={item.type === "link" ? "Amazing article title..." : "My diary entry title..."}
              className="mt-2 rounded-2xl border-2 border-blue-100 focus:border-blue-300 transition-colors"
              required
            />
          </div>

          {item.type === "link" ? (
            <>
              <div>
                <Label htmlFor="edit-url" className="text-sm font-semibold text-gray-700">
                  URL
                </Label>
                <Input
                  id="edit-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="mt-2 rounded-2xl border-2 border-blue-100 focus:border-blue-300 transition-colors"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-image" className="text-sm font-semibold text-gray-700">
                  Custom Image URL (optional)
                </Label>
                <Input
                  id="edit-image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-2 rounded-2xl border-2 border-blue-100 focus:border-blue-300 transition-colors"
                />
              </div>
            </>
          ) : (
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
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-2xl border-2 border-gray-200 hover:border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !title.trim() || (item.type === "link" && !url.trim())}
              className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? "Saving..." : "Save Changes 💫"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
