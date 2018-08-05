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
      title
      members {
        username
      }
      messages {
        id
        author {
          username
        }
        content
      }
    }
  }
`;

const FALLBACK_CHAT_PAGE_QUERY = gql`
  query {
    chats(first: 1) {
      id
    }
  }
`;

const ChatPage = ({ router }: WithRouterProps) => {
  /* Makes sure client side routing checks for auth */
  if (typeof window !== "undefined" && !loggedIn()) {
    return <NotLoggedIn />;
  }

  /* Redirect user to most recent chat if id query string is empty */
  if (!router.query.id) {
    return (
      <Query query={FALLBACK_CHAT_PAGE_QUERY}>
        {({ data, loading, error }) => {
          /* TODO: Replace null with centered spinner with redirecting text? */
          if (loading || !data) return null;
          if (error) return <ShowApolloError error={error} />;
          if (data) {
            /* Display a message if the logged in user doesn't have any chats */
            if (!data.chats[0]) {
              return (
                <Layout mainTitle="Chat Page">
                  <CenterDiv>
                    You don't have any chats. To create a new chat, click the
                    new chat icon in the toolbar.
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
    <Query query={CHAT_PAGE_QUERY} variables={{ chatId: router.query.id }}>
      {({ data, loading, error }) => (
        /* Render data.chat.title if it exists */
        <Layout mainTitle={data && data.chat && data.chat.title}>
          <React.Fragment>
            <ShowApolloError error={error} />
            {loading ? (
              <CenterDiv>Loading chat...</CenterDiv>
            ) : (
              <ChatIdContext.Provider value={router.query.id}>
                <ChatUI data={data} />
              </ChatIdContext.Provider>
            )}
          </React.Fragment>
        </Layout>
      )}
    </Query>
  );
};

export default withRouter(ChatPage);

const CenterDiv = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
