import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import constants from "../../utils/constants";
import ShowApolloError from "../ApolloError";
import ChatListUI from "./ChatListUI";

/**
 * NOTE:
 *
 * Unlike other queries that query for messages on a Chat type, this
 * query does not have a connection directive attached to its messages
 * field. The connection directive tells Apollo Client that queries
 * with different parameters (in this case, messages(last: x)) that
 * they are indeed the same data and can be safely treated as the same
 * piece of data in the cache. This means that instead of different
 * cache items for messages(last: 1) and messages(last: 50), then are
 * both just 'messages'.
 *
 * For more information on the connection directive, visit the following link:
 * https://www.apollographql.com/docs/react/advanced/caching.html#connection-directive
 *
 * The reason why this query does not have a connection directive is
 * because as it stands, there is a race condition between this query
 * and the query called `CHAT_PAGE_QUERY` located in `pages/chat.tsx`.
 * This is because both queries query for some of the same data. The
 * issue is that whatever query finishes last overwrites the data
 * stored in the cache of the query that finshes first. In this case,
 * it is common for `CHAT_PAGE_QUERY` to finish before `CHAT_LIST_QUERY`.
 * This results in the messages fetched by `CHAT_PAGE_QUERY` being discarded.
 * As a result, the chat page UI only shows the more recently sent message.
 *
 * By removing the connection directive, this issue is mitigated as instead
 * of there being a single entry in the cache for a chats messages, there is
 * two. This means that no matter what query returns first, there is no
 * possiblity of the two queries conflicting and potentially overwriting each
 * others data. Now, the issue is that there is two sets of identical data in
 * the cache, which seems a bit hacky to me.
 *
 * TODO:
 * De-hackify the solution to the above problem.
 */

export const CHAT_LIST_QUERY = gql`
  query CHAT_LIST_QUERY {
    chats {
      id
      title
      messages(last: 1) {
        id
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
      messages(last: 1) @connection(key: "messages") {
        id
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
