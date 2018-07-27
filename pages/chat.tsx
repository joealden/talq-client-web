import React from "react";
import { withRouter, WithRouterProps } from "next/router";
import styled from "styled-components";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import ShowApolloError from "../components/ApolloError";
import Layout from "../components/layout";

const CHAT_PAGE_QUERY = gql`
  query CHAT_PAGE_QUERY($chatId: ID!) {
    chat(chatId: $chatId) {
      title
      members {
        username
        firstName
        lastName
      }
      messages {
        id
        author {
          username
          firstName
          lastName
        }
        createdAt
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
                  <ChatWrapper>
                    <div>
                      You don't have any chats. To create a new chat, click the
                      new chat icon in the toolbar.
                    </div>
                  </ChatWrapper>
                </Layout>
              );
            }
            /* If the user does have a chat, redirect to the most recent one */
            router.push({ pathname: `/chat/${data.chats[0].id}` });
          }
        }}
      </Query>
    );
  }

  return (
    <Query query={CHAT_PAGE_QUERY} variables={{ chatId: router.query.id }}>
      {({ data, loading, error }) => (
        <Layout
          mainTitle={
            /* TODO: simplify this horrible ternary */
            data ? (data.chat ? data.chat.title : "Loading...") : "Loading..."
          }
        >
          <ChatWrapper>
            {error ? <ShowApolloError error={error} /> : null}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                Data arrived! - <span>{data.chat.title}</span>
              </div>
            )}
          </ChatWrapper>
        </Layout>
      )}
    </Query>
  );
};

export default withRouter(ChatPage);

const ChatWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
