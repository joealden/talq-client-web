import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getOperationDefinition } from "apollo-utilities";

import fetch from "cross-fetch";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const { API_ENDPOINT, API_SUBSCRIPTION_ENDPOINT } = publicRuntimeConfig;

export enum executeContextEnum {
  Browser = "browser",
  Server = "server"
}

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

export const createApolloClient = (executeContext: executeContextEnum) => {
  if (executeContext === executeContextEnum.Browser) {
    const httpLink = new HttpLink({
      uri: API_ENDPOINT,
      credentials: "include"
    });

    const wsLink = new WebSocketLink({
      uri: API_SUBSCRIPTION_ENDPOINT,
      options: {
        reconnect: true
      }
    });

    const link = split(
      ({ query }) => {
        const { kind, operation } = getOperationDefinition(query);
        return kind === "OperationDefinition" && operation === "subscription";
      },
      wsLink,
      httpLink
    );

    return new ApolloClient({
      link,
      cache: new InMemoryCache()
    });
  } else if (executeContext === executeContextEnum.Server) {
    const link = new HttpLink({
      uri: API_ENDPOINT,
      credentials: "include",
      /* Required because fetch isn't available in node */
      fetch
    });

    return new ApolloClient({
      link,
      cache: new InMemoryCache()
    });
  }
};
