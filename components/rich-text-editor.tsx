"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Palette,
  Highlighter,
} from "lucide-react"
import { useCallback } from "react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
  })

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:")
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addEmoji = useCallback(
    (emoji: string) => {
      if (editor) {
        editor.chain().focus().insertContent(emoji).run()
      }
    },
    [editor],
  )

  if (!editor) {
    return null
  }

  return (
    <div className="border-2 border-pink-100 rounded-2xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-pink-100 p-3 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`rounded-lg ${editor.isActive("bold") ? "bg-pink-200" : ""}`}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`rounded-lg ${editor.isActive("italic") ? "bg-pink-200" : ""}`}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`rounded-lg ${editor.isActive("strike") ? "bg-pink-200" : ""}`}
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`rounded-lg ${editor.isActive("code") ? "bg-pink-200" : ""}`}
          >
            <Code className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-pink-200 mx-1" />

          {/* Lists */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`rounded-lg ${editor.isActive("bulletList") ? "bg-pink-200" : ""}`}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`rounded-lg ${editor.isActive("orderedList") ? "bg-pink-200" : ""}`}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`rounded-lg ${editor.isActive("blockquote") ? "bg-pink-200" : ""}`}
          >
            <Quote className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-pink-200 mx-1" />

          {/* Colors */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setColor("#ef4444").run()}
            className="rounded-lg"
          >
            <Palette className="w-4 h-4 text-red-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setColor("#3b82f6").run()}
            className="rounded-lg"
          >
            <Palette className="w-4 h-4 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setColor("#10b981").run()}
            className="rounded-lg"
          >
            <Palette className="w-4 h-4 text-green-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`rounded-lg ${editor.isActive("highlight") ? "bg-pink-200" : ""}`}
          >
            <Highlighter className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-pink-200 mx-1" />

          {/* Media */}
          <Button variant="ghost" size="sm" onClick={addImage} className="rounded-lg">
            <ImageIcon className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-pink-200 mx-1" />

          {/* Undo/Redo */}
          <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} className="rounded-lg">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} className="rounded-lg">
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        {/* Emoji Bar */}
        <div className="flex gap-1 mt-2 pt-2 border-t border-pink-100">
          {["😊", "❤️", "🎉", "✨", "🌸", "🦄", "🌈", "⭐", "💖", "🎀"].map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              onClick={() => addEmoji(emoji)}
              className="rounded-lg text-lg hover:bg-pink-100"
            >
              {emoji}
            </Button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="min-h-[200px]">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-4"
        />
      </div>
    </div>
  )
}
