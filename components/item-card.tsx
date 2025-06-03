"use client"

import type React from "react"

import type { Item } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, BookOpen, Calendar, Edit, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useState } from "react"
import { EditItemDialog } from "./edit-item-dialog"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"
import { useRouter } from "next/navigation"
import { useMutation } from "@apollo/client"
import { DELETE_ITEM } from "@/lib/graphql/mutations"
import { GET_COLLECTION_ITEMS } from "@/lib/graphql/queries"

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()
  const isLink = item.type === "link"

  const [deleteItem, { loading: deleteLoading }] = useMutation(DELETE_ITEM, {
    variables: { id: item.id },
    refetchQueries: [{ query: GET_COLLECTION_ITEMS, variables: { collectionId: item.collectionId } }],
    onCompleted: () => {
      router.refresh()
    },
  })

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger click if clicking on dropdown menu
    if ((e.target as HTMLElement).closest("[data-dropdown-trigger]")) {
      return
    }

    if (isLink && item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer")
    }
  }

  const handleDelete = async () => {
    deleteItem()
  }

  return (
    <>
      <Card
        className={`bg-white/70 backdrop-blur-sm border-0 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
          isLink ? "cursor-pointer hover:bg-white/90 hover:scale-[1.02]" : ""
        }`}
        onClick={handleClick}
      >
        <CardContent className="p-0">
          <div className="flex items-start gap-4 p-4">
            {/* Item Image/Icon */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shadow-sm flex-shrink-0">
              {item.image ? (
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
              ) : (
                <div className="text-lg">{isLink ? "🔗" : "📝"}</div>
              )}
            </div>

            {/* Item Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-800 line-clamp-2 leading-tight">{item.title}</h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {isLink && <ExternalLink className="w-4 h-4 text-gray-400" />}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild data-dropdown-trigger>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl border-0 shadow-lg bg-white/95 backdrop-blur-sm"
                    >
                      <DropdownMenuItem onClick={() => setEditOpen(true)} className="rounded-lg">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="rounded-lg text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Rich text preview for diary entries */}
              {item.type === "diary" && item.content && (
                <div
                  className="text-sm text-gray-600 mt-2 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: item.content.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
                  }}
                />
              )}

              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  {isLink ? <ExternalLink className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                  <span>{isLink ? "Link" : "Diary"}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditItemDialog item={item} open={editOpen} onOpenChange={setEditOpen} />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Item"
        description={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
      />
    </>
  )
}
