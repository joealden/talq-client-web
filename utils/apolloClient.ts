import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split, concat } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { onError } from "apollo-link-error";
import { getOperationDefinition } from "apollo-utilities";

import Router from "next/router";

import NodeWebSocket from "ws";
import serverFetch from "cross-fetch";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const {
  API_ENDPOINT,
  API_SUBSCRIPTION_ENDPOINT,
  LOG_APOLLO_ERRORS
} = publicRuntimeConfig;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  /* TODO: disabled logging of errors in production */
  if (typeof window !== "undefined") {
    if (graphQLErrors) {
      if (LOG_APOLLO_ERRORS === "true") {
        console.error("A GraphQLError occured:", graphQLErrors);
      }

      graphQLErrors.forEach(error => {
        /**
         * If either of these conditions are met, it means that a
         * request that requires authorization failed. Requests that
         * require authorization only happen when the user is logged in.
         *
         * This means that these errors will only occur if the user has
         * changed the token to an invalid value, or if they have removed
         * the token cookie all together.
         *
         * If this happens, the localStorage item `loggedIn` that keeps
         * track on the frontend if the user is logged in or not (because
         * the token cookie is set to httpOnly for security reasons) gets
         * removed. This will change what is displayed to the user.
         *
         * The best way I could think of to trigger a reload of the UI
         * from an apollo link was to essentially refresh the page client
         * side. This would mean that the page's component tree would
         * be re-rendered, resulting in the logged out fallback UI if that
         * page had one. Peforming this refresh client side does not cause
         * a hard reload of the page.
         *
         * This means that if the user tampers with the token cookie at
         * any time while the application is running, the UI will render
         * correctly instead of just blank screening like it did before.
         *
         * NOTE:
         * I thought about also sending a `signout` mutation to the API in
         * this case, but I realised that there isn't really much point.
         * If the user re-logs in, the token cookie that is stored for the
         * API endpoint will be overwritten anyway.
         */
        if (
          /* Happens if no token is present */
          error.message === "not authorized" ||
          /* Happens if an invalid token is present */
          error.message === "invalid token"
        ) {
          localStorage.removeItem("loggedIn");
          Router.push({ pathname: Router.pathname });
        }
      });
    }

    if (networkError && LOG_APOLLO_ERRORS === "true") {
      console.error("A networkError occured:", networkError);
    }
  }
});

/* Required because fetch isn't available in node */
let fetchOption;
if (typeof window === "undefined") {
  fetchOption = serverFetch;
} else {
  fetchOption = fetch;
}

const httpLink = new HttpLink({
  uri: API_ENDPOINT,
  credentials: "include",
  fetch: fetchOption
});

/* Required because WebSocket isn't available in node */
let webSocketImpl;
if (typeof window === "undefined") {
  webSocketImpl = NodeWebSocket;
} else {
  webSocketImpl = WebSocket;
}

const wsLink = new WebSocketLink({
  uri: API_SUBSCRIPTION_ENDPOINT,
  options: {
    reconnect: true
  },
  webSocketImpl
});

/**
 * The reason this function is needed is because Web Sockets don't
 * work very well when trying to use client side. I attempted to provide
 * a custom Web Socket implmentation, however I couldn't get it to work.
 *
 * NOTE:
 * getOperationDefinition is used instead of getMainDefinition
 * that is shown in the Apollo client docs due to the fact that
 * getMainOperation returns a union type where there it is possible
 * for the return type of getMainDefinition does not have an
 * 'operation' property.
 *
 * By the looks of things, getMainDefinition is a combination of
 * both getOperationDefinition and getFragmentDefinition by quickly
 * looking at the source code and the return type of getMainDefinition.
 * the return type of getFragmentDefinition is the type that does not
 * have an operation property, as it is not an operation.
 *
 * TODO:
 * Look into diffrence between the following functions:
 * - getOperationDefinition
 * - getOperationDefinitionOrDie
 */

const httpAndWslink = split(
  ({ query }) => {
    const { kind, operation } = getOperationDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const link = concat(errorLink, httpAndWslink);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  /* Enable SSR mode if code is executed on the server */
  ssrMode: typeof window === "undefined"
});

export default client;
