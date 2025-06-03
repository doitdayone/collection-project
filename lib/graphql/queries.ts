import { gql } from "@apollo/client"

// Collection fragments
export const COLLECTION_FRAGMENT = gql`
  fragment CollectionFields on Collection {
    id
    title
    image
    createdAt
    itemCount
  }
`

export const COLLECTION_DETAIL_FRAGMENT = gql`
  fragment CollectionDetailFields on Collection {
    id
    title
    image
    createdAt
  }
`

// Item fragments
export const ITEM_FRAGMENT = gql`
  fragment ItemFields on Item {
    id
    title
    type
    url
    image
    content
    createdAt
    collectionId
  }
`

// Queries
export const GET_COLLECTIONS = gql`
  query GetCollections {
    collections {
      ...CollectionFields
    }
  }
  ${COLLECTION_FRAGMENT}
`

export const GET_COLLECTION = gql`
  query GetCollection($id: ID!) {
    collection(id: $id) {
      ...CollectionDetailFields
    }
  }
  ${COLLECTION_DETAIL_FRAGMENT}
`

export const GET_COLLECTION_ITEMS = gql`
  query GetCollectionItems($collectionId: ID!) {
    items(collectionId: $collectionId) {
      ...ItemFields
    }
  }
  ${ITEM_FRAGMENT}
`
