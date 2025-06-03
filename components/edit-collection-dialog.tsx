"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Collection } from "@/types"
import { useMutation } from "@apollo/client"
import { UPDATE_COLLECTION } from "@/lib/graphql/mutations"
import { GET_COLLECTIONS, GET_COLLECTION } from "@/lib/graphql/queries"

interface EditCollectionDialogProps {
  collection: Collection
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCollectionDialog({ collection, open, onOpenChange }: EditCollectionDialogProps) {
  const [title, setTitle] = useState(collection.title)
  const [image, setImage] = useState(collection.image || "")
  const router = useRouter()

  const [updateCollection, { loading }] = useMutation(UPDATE_COLLECTION, {
    refetchQueries: [{ query: GET_COLLECTIONS }, { query: GET_COLLECTION, variables: { id: collection.id } }],
    onCompleted: () => {
      onOpenChange(false)
      router.refresh()
    },
  })

  useEffect(() => {
    if (open) {
      setTitle(collection.title)
      setImage(collection.image || "")
    }
  }, [collection, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    updateCollection({
      variables: {
        id: collection.id,
        input: {
          title: title.trim(),
          image: image.trim() || undefined,
        },
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Edit Collection ✨
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <Label htmlFor="edit-collection-title" className="text-sm font-semibold text-gray-700">
              Collection Title
            </Label>
            <Input
              id="edit-collection-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My awesome collection..."
              className="mt-2 rounded-2xl border-2 border-pink-100 focus:border-pink-300 transition-colors"
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-collection-image" className="text-sm font-semibold text-gray-700">
              Custom Image URL (optional)
            </Label>
            <Input
              id="edit-collection-image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mt-2 rounded-2xl border-2 border-pink-100 focus:border-pink-300 transition-colors"
            />
          </div>
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
              disabled={loading || !title.trim()}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? "Saving..." : "Save Changes 💫"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
