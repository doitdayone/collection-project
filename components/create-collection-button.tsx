"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMutation } from "@apollo/client"
import { CREATE_COLLECTION } from "@/lib/graphql/mutations"
import { GET_COLLECTIONS } from "@/lib/graphql/queries"

export function CreateCollectionButton() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const router = useRouter()

  const [createCollection, { loading }] = useMutation(CREATE_COLLECTION, {
    refetchQueries: [{ query: GET_COLLECTIONS }],
    onCompleted: () => {
      setTitle("")
      setImage("")
      setOpen(false)
      router.refresh()
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    createCollection({
      variables: {
        input: {
          title: title.trim(),
          image: image.trim() || undefined,
        },
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Plus className="w-5 h-5 mr-2" />
          Create Collection
          <Sparkles className="w-5 h-5 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Create New Collection ✨
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
              Collection Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My awesome collection..."
              className="mt-2 rounded-2xl border-2 border-pink-100 focus:border-pink-300 transition-colors"
              required
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
              className="mt-2 rounded-2xl border-2 border-pink-100 focus:border-pink-300 transition-colors"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-2xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? "Creating..." : "Create Collection 🎉"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
