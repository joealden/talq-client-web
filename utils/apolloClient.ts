import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import fetch from "cross-fetch";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const client = new ApolloClient({
  link: new HttpLink({
    uri: publicRuntimeConfig.API_ENDPOINT,
    credentials: "include",

    /**
     * Required because of SSR
     * (fetch used in Apollo is not present in Node env)
     */
    fetch
  }),
  cache: new InMemoryCache()
});

export default client;
