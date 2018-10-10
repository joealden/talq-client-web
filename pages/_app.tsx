import React from "react";
import App, { Container } from "next/app";
import { injectGlobal } from "styled-components";
import { ApolloProvider } from "react-apollo";
import Head from "next/head";

import client from "../utils/apolloClient";

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Roboto');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
  }

  body {
    height: 100vh;
    max-height: 100vh;
  }

  a {
    text-decoration: none;
  }

  #__next {
    height: 100%;
  }
`;

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Head>
          <title>Talq</title>
        </Head>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}
