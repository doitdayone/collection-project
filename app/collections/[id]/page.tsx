import { Suspense } from "react"
import { CollectionHeader } from "@/components/collection-header"
import { ItemsTimeline } from "@/components/items-timeline"
import { CreateItemButton } from "@/components/create-item-button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CollectionPageProps {
  params: Promise<{ id: string }>
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="rounded-full hover:bg-white/50 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collections
            </Button>
          </Link>
        </div>

        {/* Collection Header */}
        <Suspense
          fallback={
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 animate-pulse">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-2xl"></div>
                <div>
                  <div className="h-8 bg-gray-200 rounded-full w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-32"></div>
                </div>
              </div>
            </div>
          }
        >
          <CollectionHeader collectionId={id} />
        </Suspense>

        {/* Create Item Button */}
        <div className="flex justify-center mb-8">
          <CreateItemButton collectionId={id} />
        </div>

        {/* Items Timeline */}
        <Suspense
          fallback={
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
          }
        >
          <ItemsTimeline collectionId={id} />
        </Suspense>
      </div>
    </div>
  )
}
