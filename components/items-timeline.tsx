"use client"
import type { Item } from "@/types"
import { ItemCard } from "./item-card"
import { useQuery } from "@apollo/client"
import { GET_COLLECTION_ITEMS } from "@/lib/graphql/queries"

interface ItemsTimelineProps {
  collectionId: string
}

interface GroupedItems {
  [key: string]: Item[]
}

export function ItemsTimeline({ collectionId }: ItemsTimelineProps) {
  const { loading, error, data } = useQuery(GET_COLLECTION_ITEMS, {
    variables: { collectionId },
  })

  const items = data?.items || []

  const groupItemsByMonth = (items: Item[]): GroupedItems => {
    return items.reduce((groups, item) => {
      const date = new Date(item.createdAt)
      const monthYear = date.toLocaleDateString("en-US", {
        month: "2-digit",
        year: "numeric",
      })

      if (!groups[monthYear]) {
        groups[monthYear] = []
      }
      groups[monthYear].push(item)
      return groups
    }, {} as GroupedItems)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded-full w-32 mb-4"></div>
            <div className="grid gap-4">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                  <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
                </div>
              ))}
            </div>
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
        <p className="text-gray-500">We couldn't load your items. Please try again later.</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No items yet!</h3>
        <p className="text-gray-500">Add your first link or diary entry ✨</p>
      </div>
    )
  }

  const groupedItems = groupItemsByMonth(items)
  const sortedMonths = Object.keys(groupedItems).sort((a, b) => {
    const [monthA, yearA] = a.split("/")
    const [monthB, yearB] = b.split("/")
    const dateA = new Date(Number.parseInt(yearA), Number.parseInt(monthA) - 1)
    const dateB = new Date(Number.parseInt(yearB), Number.parseInt(monthB) - 1)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="space-y-8">
      {sortedMonths.map((monthYear) => (
        <div key={monthYear}>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
              {monthYear}
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-pink-200 to-transparent"></div>
          </div>
          <div className="grid gap-4">
            {groupedItems[monthYear]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
