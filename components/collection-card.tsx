"use client";

import type React from "react";

import type { Collection } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, BookOpen, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { EditCollectionDialog } from "./edit-collection-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { DELETE_COLLECTION } from "@/lib/graphql/mutations";
import { GET_COLLECTIONS } from "@/lib/graphql/queries";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();
  const itemCount = collection.itemCount || 0;

  const [deleteCollection, { loading: deleteLoading }] = useMutation(
    DELETE_COLLECTION,
    {
      variables: { id: collection.id },
      refetchQueries: [{ query: GET_COLLECTIONS }],
      onCompleted: () => {
        router.refresh();
      },
    }
  );

  const handleDelete = async () => {
    deleteCollection();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on dropdown menu
    if ((e.target as HTMLElement).closest("[data-dropdown-trigger]")) {
      e.preventDefault();
      return;
    }
  };

  return (
    <>
      <Link href={`/collections/${collection.id}`} onClick={handleCardClick}>
        <Card className="group bg-white/70 backdrop-blur-sm border-0 rounded-3xl overflow-hidden hover:bg-white/90 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
          <CardContent className="p-0">
            {/* Collection Image */}
            <div className="relative h-48 overflow-hidden rounded-t-3xl">
              <img
                src={
                  collection.image || "/placeholder.svg?height=200&width=300"
                }
                alt={collection.title}
                className="object-cover group-hover:scale-110 transition-transform duration-300 w-full h-full object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild data-dropdown-trigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full"
                      onClick={(e) => e.preventDefault()}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-0 shadow-lg bg-white/95 backdrop-blur-sm"
                  >
                    <DropdownMenuItem
                      onClick={() => setEditOpen(true)}
                      className="rounded-lg"
                    >
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

            {/* Collection Info */}
            <div className="p-6">
              <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                {collection.title}
              </h3>
              <div className="flex items-center gap-2 text-gray-500">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <EditCollectionDialog
        collection={collection}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Collection"
        description={`Are you sure you want to delete "${collection.title}" and all its items? This action cannot be undone.`}
      />
    </>
  );
}
