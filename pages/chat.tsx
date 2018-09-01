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

  /**
   * NOTE:
   * ChatPageQuery has a key prop so that when the user navigates
   * to other chat, an entirely new component instance is created
   * instead of the current instance just being updated. This means
   * that all state contained at and below this point in the tree
   * is cleared. Look at the following link for more information:
   *
   * https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
   *
   * The reason that this component needs to be recreated is because
   * when a ChatUI component instance is created, a GraphQL subscription
   * is set up in the componentDidMount lifecycle method. Unfortunately,
   * as far as I can see, Apollo does not allow you to unsubscribe from
   * a subscription (there is no 'unsubscribeToMore' counterpart to
   * subscribeToMore).
   *
   * The issue that I was experiencing was that when a chat page loaded,
   * a subscription would be set up. This worked as expected until the
   * user navigated to another chat. At this point, the subscription for
   * the previous chat was still active. This meant that if another member
   * of the previous chat posted a message in the previous chat, it would
   * appear in the newly opened chat.
   *
   * By using this key technique, when the previous chats component tree
   * gets unmounted, the subscription socket gets disconnected.
   */
  return (
    <ChatPageQuery
      query={CHAT_PAGE_QUERY}
      /**
       * TODO: This of a better way to solve the below issue, because
       * with this fix, switching between chats is a lot slower because
       * an API request is always made even when it might not be needed.
       * This may be solved by instead setting up a central caching
       * strategy, where all chats that are in the sidebar are subscribed
       * to. When a new message is sent in any of these chats and that
       * chat data has already been cached, append the new message. This
       * will mean that cached chats will remain quick to access while
       * fixing the stale cache issue.
       *
       * NOTE:
       * fetch policy has been set to cache-and-network because when a
       * user sent a message in a chat that the user was not currently on
       * but was already cached, the new message would not appear in the
       * another chat when the user revisited it because it was only
       * showing the cached messages. Setting this to cache-and-network
       * ensures that new messages will bypass the cache.
       */
      fetchPolicy={"cache-and-network"}
      variables={{ chatId: String(router.query.id) }}
      key={String(router.query.id)}
    >
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

                        /**
                         * NOTE:
                         * Currently, it seems as though apollo-client's
                         * typings don't allow for fetchMore/subscribeToMore
                         * to return data that has a diffrent structure to
                         * the original query.
                         *
                         * This is an issue because it means that in this case,
                         * apollo types subscriptionData.data incorrectly, even
                         * though we have provided a different documentNode to
                         * the subscribeToMore function. For this reason,
                         * newMessage has to be manually typed.
                         */

                        // @ts-ignore
                        const { data } = subscriptionData as {
                          data: {
                            newChatMessage: {
                              id: string;
                              author: {
                                username: string;
                              };
                              content: string;
                            };
                          };
                        };

                        const { newChatMessage } = data;

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

                        if (newChatMessage.author.username === username) {
                          return previous;
                        }

                        return {
                          ...previous,
                          chat: {
                            ...previous.chat,
                            messages: [
                              ...previous.chat.messages,
                              newChatMessage
                            ]
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
