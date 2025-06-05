import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// Create an http link for the GraphQL API
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "https://localhost:7174/graphql",
});

// Create Apollo Client
export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
