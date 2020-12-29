import '../styles/globals.scss';
import '../styles/home.scss';
import '../styles/layout.scss';
import '../styles/category.scss';
import '../styles/board.scss';
import '../styles/post.scss';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import { ApolloProvider } from '@apollo/client';
import client from '../components/apollo-client';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Layout />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
