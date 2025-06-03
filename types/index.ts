export interface Collection {
  id: string
  title: string
  image?: string
  createdAt: string
  itemCount?: number
  items?: Item[]
}

export interface Item {
  id: string
  title: string
  type: "link" | "diary"
  url?: string
  image?: string
  content?: string // Rich text content for diary entries
  createdAt: string
  collectionId: string
}
