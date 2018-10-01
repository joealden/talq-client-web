import React from "react";
import styled from "styled-components";
import { withRouter, WithRouterProps } from "next/router";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import Layout from "../components/layout";
import loggedIn from "../utils/loggedIn";
import NotLoggedIn from "../components/account/NotLoggedIn";
import ShowApolloError from "../components/ApolloError";
import ChatUI from "../components/chat/ChatUI";

export const ChatIdContext = React.createContext(undefined);

export const CHAT_PAGE_QUERY = gql`
  query CHAT_PAGE_QUERY($chatId: ID!) {
    chat(chatId: $chatId) {
      id
      title
      members {
        username
      }
      messages(last: 50) @connection(key: "messages") {
        id
        author {
          username
        }
        content
      }
    }
  }
`;

export interface ChatPageQueryData {
  chat: {
    title: string;
    members: Array<{ username: string }>;
    messages: Array<{
      id: string;
      author: {
        username: string;
      };
      content: string;
    }>;
  };
}

interface ChatPageQueryVariables {
  chatId: string;
}

class ChatPageQuery extends Query<ChatPageQueryData, ChatPageQueryVariables> {}

const FALLBACK_CHAT_PAGE_QUERY = gql`
  query {
    chats(first: 1) {
      id
    }
  }
`;

const ChatPage: React.SFC<WithRouterProps> = ({ router }) => {
  /* Makes sure client side routing checks for auth */
  if (typeof window !== "undefined" && !loggedIn()) {
    return <NotLoggedIn />;
  }

  /* Redirect user to most recent chat if id query string is empty */
  if (!router.query.id) {
    return (
      <Query query={FALLBACK_CHAT_PAGE_QUERY}>
        {({ data, loading, error }) => {
          /**
           * TODO:
           * Replace null with centered spinner with redirecting text?
           * Will be nicer to implement with React suspense and the
           * 'Placeholder' component.
           */
          if (loading || !data) return null;
          if (error) return <ShowApolloError error={error} />;
          if (data) {
            /* Display a message if the logged in user doesn't have any chats */
            if (!data.chats[0]) {
              return (
                <Layout mainTitle="Chat Page">
                  <CenterDiv>
                    <p>
                      You don't have any chats. To create a new chat, click the
                      new chat icon in the toolbar.
                    </p>
                  </CenterDiv>
                </Layout>
              );
            }
            /* If the user does have a chat, redirect to the most recent one */
            router.push({ pathname: `/chat/${data.chats[0].id}` });
          }

          return null;
        }}
      </Query>
    );
  }

  return (
    <ChatPageQuery
      query={CHAT_PAGE_QUERY}
      variables={{ chatId: String(router.query.id) }}
    >
      {({ data, loading, error }) => {
        /**
         * Render data.chat.title if it exists, otherwise render default
         *
         * TODO: Update this logic when usernames of members are used as
         * the default chat title
         */

        if (loading) {
          return (
            <Layout mainTitle="Loading Chat...">
              <CenterDiv> Loading chat...</CenterDiv>
            </Layout>
          );
        }

        if (data && data.chat) {
          return (
            <Layout mainTitle={data.chat.title || "Untitled Chat"}>
              <React.Fragment>
                <ShowApolloError error={error} />
                <ChatIdContext.Provider value={router.query.id}>
                  <ChatUI data={data} />
                </ChatIdContext.Provider>
              </React.Fragment>
            </Layout>
          );
        }

        return null;
      }}
    </ChatPageQuery>
  );
};

export default withRouter(ChatPage);

const CenterDiv = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    text-align: center;
    margin: 15px;
  }
`;
