"use client"
import { CollectionCard } from "./collection-card"
import type { Collection } from "@/types"
import { useQuery } from "@apollo/client"
import { GET_COLLECTIONS } from "@/lib/graphql/queries"

export function CollectionsGrid() {
  const { loading, error, data } = useQuery(GET_COLLECTIONS)
  const collections = data?.collections || []

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 animate-pulse">
            <div className="w-full h-48 bg-gray-200 rounded-2xl mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">😢</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-500">We couldn't load your collections. Please try again later.</p>
      </div>
    )
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🌸</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No collections yet!</h3>
        <p className="text-gray-500">Create your first collection to get started ✨</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection: Collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  )
}
