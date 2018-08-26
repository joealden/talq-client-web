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

const ChatList: React.SFC = () => (
  <ChatListWrapper>
    <ChatListQuery query={CHAT_LIST_QUERY}>
      {({ data, error, loading }) => {
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

          return <ChatListUI data={data} />;
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
