import '../styles/globals.scss';
import '../styles/home.scss';
import '../styles/layout.scss';
import '../styles/category.scss';
import '../styles/board.scss';
import '../styles/write.scss';
import '../styles/post.scss';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

import { ApolloProvider } from '@apollo/client';
import Layout from '../components/Layout';
import withApollo from '../components/apollo-client';
import App from 'next/app';

require('intersection-observer');

function MyApp({ Component, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo}>
      <Layout />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default withApollo(MyApp);
