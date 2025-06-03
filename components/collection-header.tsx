"use client"
import { Heart, Calendar } from "lucide-react"
import Image from "next/image"
import { useQuery } from "@apollo/client"
import { GET_COLLECTION } from "@/lib/graphql/queries"

interface CollectionHeaderProps {
  collectionId: string
}

export function CollectionHeader({ collectionId }: CollectionHeaderProps) {
  const { loading, error, data } = useQuery(GET_COLLECTION, {
    variables: { id: collectionId },
  })

  const collection = data?.collection

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 animate-pulse">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-200 rounded-2xl"></div>
          <div>
            <div className="h-8 bg-gray-200 rounded-full w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-full w-32"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !collection) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8">
        <div className="text-center">
          <div className="text-4xl mb-2">😢</div>
          <h2 className="text-xl font-semibold text-gray-700">Collection not found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-lg">
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md">
          <Image
            src={collection.image || "/placeholder.svg?height=96&width=96"}
            alt={collection.title}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            {collection.title}
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
          </h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {collection.itemCount || 0} {collection.itemCount === 1 ? "item" : "items"} saved
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
