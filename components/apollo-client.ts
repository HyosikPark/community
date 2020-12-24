import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri:
    process.env.NODE_ENV !== 'development'
      ? `${process.env.PRO_END_POINT}`
      : `${process.env.DEV_END_POINT}`,
  cache: new InMemoryCache(),
});

export default client;
