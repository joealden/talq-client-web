import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getOperationDefinition } from "apollo-utilities";

import NodeWebSocket from "ws";
import serverFetch from "cross-fetch";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const { API_ENDPOINT, API_SUBSCRIPTION_ENDPOINT } = publicRuntimeConfig;

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

const link = split(
  ({ query }) => {
    const { kind, operation } = getOperationDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  /* Enable SSR mode if code is executed on the server */
  ssrMode: typeof window === "undefined"
});

export default client;
