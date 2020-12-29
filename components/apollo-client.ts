import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  uri:
    process.env.NODE_ENV !== 'development'
      ? `${process.env.PRO_END_POINT}`
      : `${process.env.DEV_END_POINT}`,
  cache: new InMemoryCache(),
});

export default client;

// export async function getStandaloneApolloClient() {
//   const { ApolloClient, InMemoryCache, HttpLink } = await import(
//     "@apollo/client"
//   );
//   return new ApolloClient({
//     link: new HttpLink({
//       uri: "https://..../graphql"
//       fetch
//     }),
//     cache: new InMemoryCache()
//   });
// }
