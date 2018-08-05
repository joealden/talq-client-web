import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import constants from "../../utils/constants";
import ShowApolloError from "../ApolloError";
import ChatListUI from "./ChatListUI";

const CHAT_LIST_QUERY = gql`
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
 * TODO: Figure out a way to type the data variable coming from the
 * Query render function in the same shape as the above query.
 */
const ChatList = () => (
  <ChatListWrapper>
    <Query query={CHAT_LIST_QUERY}>
      {({ data, error, loading }) => {
        if (error) return <ShowApolloError error={error} />;
        if (loading) return <CenterDiv>Loading...</CenterDiv>;

        if (data.chats.length === 0) {
          return <CenterDiv>Chat list is empty.</CenterDiv>;
        }

        if (data) {
          return <ChatListUI data={data} />;
        }

        return null;
      }}
    </Query>
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
`;
