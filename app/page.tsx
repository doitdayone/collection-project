import { Suspense } from "react";
import { CollectionsGrid } from "@/components/collections-grid";
import { CreateCollectionButton } from "@/components/create-collection-button";
import { Heart, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              My Cute Collections
            </h1>
            <Sparkles className="w-8 h-8 text-purple-500 fill-purple-500" />
          </div>
          <p className="text-gray-600 text-lg">
            Save your favorite things in adorable collections! ✨
          </p>
        </div>

        {/* Create Collection Button */}
        <div className="flex justify-center mb-8">
          <CreateCollectionButton />
        </div>

        {/* Collections Grid */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
                </div>
              ))}
            </div>
          }
        >
          <CollectionsGrid />
        </Suspense>
      </div>
    </div>
  );
}
