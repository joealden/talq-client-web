import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import constants from "../../utils/constants";
import ShowApolloError from "../ApolloError";
import ChatListUI from "./ChatListUI";

/**
 * TODO:
 * Alter return of chats query so that instead 'messages' with
 * params, replace with mostRecentMessage of type message instead
 * of [message] (also modify below interface to conform to this).
 */
export const CHAT_LIST_QUERY = gql`
  query {
    chats {
      id
      title
      messages(first: 1, orderBy: createdAt_DESC) {
        author {
          username
        }
        content
      }
    }
  }
`;

/**
 * NOTE:
 * Messages is a tuple of length 1 because the query will always
 * return an array with a length of 1 (The most recent message).
 */
export interface ChatListQueryData {
  chats: Array<{
    id: string;
    title: string;
    messages: Array<{
      author: {
        username: string;
      };
      content: string;
    }>;
  }>;
}

class ChatListQuery extends Query<ChatListQueryData> {}

const CHAT_LIST_SUBSCRIPTION = gql`
  subscription CHAT_LIST_SUBSCRIPTION {
    updatedChat {
      id
      title
      messages(first: 1, orderBy: createdAt_DESC) {
        author {
          username
        }
        content
      }
    }
  }
`;

const ChatList: React.SFC = () => (
  <ChatListWrapper>
    <ChatListQuery query={CHAT_LIST_QUERY}>
      {({ data, error, loading, subscribeToMore }) => {
        if (error) return <ShowApolloError error={error} />;
        if (loading) return <CenterDiv>Loading...</CenterDiv>;

        if (data.chats) {
          if (data.chats.length === 0) {
            return (
              <CenterDiv>
                <p>Chat list is empty.</p>
              </CenterDiv>
            );
          }

          const subscribeToChatUpdates = () =>
            subscribeToMore({
              document: CHAT_LIST_SUBSCRIPTION,
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
                const { data: subData } = subscriptionData as {
                  data: {
                    updatedChat: {
                      id: string;
                      title: string;
                      messages: Array<{
                        author: {
                          username: string;
                        };
                        content: string;
                      }>;
                    };
                  };
                };

                const { updatedChat } = subData;

                /**
                 * If the updatedChat already exists in the current list of
                 * chats, that item will be filtered out.
                 */
                const chatListWithoutUpdatedChat = previous.chats.filter(
                  chat => chat.id !== updatedChat.id
                );

                /* Prepend the updatedChat with the previous chat list */
                return {
                  ...previous,
                  chats: [updatedChat, ...chatListWithoutUpdatedChat]
                };
              }
            });

          return (
            <ChatListUI
              data={data}
              subscribeToChatUpdates={subscribeToChatUpdates}
            />
          );
        }

        return null;
      }}
    </ChatListQuery>
  </ChatListWrapper>
);

export default ChatList;

const ChatListWrapper = styled.nav`
  height: calc(100vh - ${constants.headerHeight}px);
  overflow: auto;
`;

const CenterDiv = styled.div`
  height: calc(100vh - ${constants.headerHeight}px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    text-align: center;
    margin: 15px;
  }
`;
