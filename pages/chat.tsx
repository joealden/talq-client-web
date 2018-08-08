import React from "react";
import styled from "styled-components";
import { withRouter, WithRouterProps } from "next/router";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import Layout from "../components/layout";
import loggedIn from "../utils/loggedIn";
import NotLoggedIn from "../components/account/NotLoggedIn";
import ShowApolloError from "../components/ApolloError";
import { UserDetailsContext } from "../components/layout";
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

const CHAT_PAGE_SUBSCRIPTION = gql`
  subscription CHAT_PAGE_SUBSCRIPTION($chatId: ID!) {
    newChatMessage(chatId: $chatId) {
      id
      author {
        username
      }
      createdAt
      content
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
    <Query query={CHAT_PAGE_QUERY} variables={{ chatId: router.query.id }}>
      {({ data, loading, error, subscribeToMore }) => {
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
              <UserDetailsContext.Consumer>
                {({ username }) => {
                  const subscribeToMoreMessages = () =>
                    subscribeToMore({
                      document: CHAT_PAGE_SUBSCRIPTION,
                      variables: { chatId: router.query.id },
                      updateQuery: (previous, { subscriptionData }) => {
                        if (!subscriptionData.data) return previous;

                        const newMessage = subscriptionData.data.newChatMessage;

                        /**
                         * TODO: Think about scenario where the same account
                         * is logged in on two different devices (will be more
                         * important when native app is developed). A way to
                         * solve this would be to check the most recent messages
                         * id and compare it against the new messages id. This
                         * would mean that local store updates wouldn't effect
                         * other devices that are logged into the same account
                         * but didn't make the mutation.
                         */
                        if (newMessage.author.username === username) {
                          return previous;
                        }

                        return {
                          ...previous,
                          chat: {
                            ...previous.chat,
                            messages: [...previous.chat.messages, newMessage]
                          }
                        };
                      }
                    });

                  return (
                    <React.Fragment>
                      <ShowApolloError error={error} />
                      <ChatIdContext.Provider value={router.query.id}>
                        <ChatUI
                          data={data}
                          subscribeToMoreMessages={subscribeToMoreMessages}
                        />
                      </ChatIdContext.Provider>
                    </React.Fragment>
                  );
                }}
              </UserDetailsContext.Consumer>
            </Layout>
          );
        }

        return null;
      }}
    </Query>
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
