import { ApolloClient, InMemoryCache } from '@apollo/client';
import { withApollo } from 'next-with-apollo';

export default withApollo(
  ({ initialState }) =>
    new ApolloClient({
      cache: new InMemoryCache().restore(initialState || {}),
      uri:
        process.env.NODE_ENV !== 'development'
          ? `${process.env.PRO_END_POINT}`
          : `${process.env.DEV_END_POINT}`,
    })
);
