import { gql } from "@apollo/client"
import { COLLECTION_FRAGMENT, ITEM_FRAGMENT } from "./queries"

// Collection mutations
export const CREATE_COLLECTION = gql`
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      ...CollectionFields
    }
  }
  ${COLLECTION_FRAGMENT}
`

export const UPDATE_COLLECTION = gql`
  mutation UpdateCollection($id: ID!, $input: UpdateCollectionInput!) {
    updateCollection(id: $id, input: $input) {
      ...CollectionFields
    }
  }
  ${COLLECTION_FRAGMENT}
`

export const DELETE_COLLECTION = gql`
  mutation DeleteCollection($id: ID!) {
    deleteCollection(id: $id) {
      id
      success
    }
  }
`

// Item mutations
export const CREATE_ITEM = gql`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      ...ItemFields
    }
  }
  ${ITEM_FRAGMENT}
`

export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {
    updateItem(id: $id, input: $input) {
      ...ItemFields
    }
  }
  ${ITEM_FRAGMENT}
`

export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id) {
      id
      success
    }
  }
`
