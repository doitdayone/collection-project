"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Heart } from "lucide-react";
import type { Item } from "@/types";
import { useState } from "react";
import { EditItemDialog } from "./edit-item-dialog";

interface ViewDiaryDialogProps {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewDiaryDialog({
  item,
  open,
  onOpenChange,
}: ViewDiaryDialogProps) {
  const [editOpen, setEditOpen] = useState(false);

  if (item.type !== "diary") return null;

  const handleEdit = () => {
    onOpenChange(false);
    setEditOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
                {item.title}
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              </DialogTitle>
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="rounded-full border-2 border-pink-200 hover:border-pink-300 hover:bg-pink-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            {/* Date info */}
            <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
              <Calendar className="w-4 h-4" />
              <span>
                Created on{" "}
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="mt-6">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-100">
              {item.content ? (
                <div
                  className="prose prose-sm max-w-none [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_p]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-pink-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:rounded-lg [&_img]:shadow-md"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p>This diary entry is empty.</p>
                  <p className="text-sm">Click "Edit" to add some content!</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer with cute decorations */}
          <div className="mt-6 text-center">
            <div className="flex justify-center gap-2 text-2xl">
              <span>✨</span>
              <span>🌸</span>
              <span>💖</span>
              <span>🦄</span>
              <span>🌈</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EditItemDialog item={item} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
