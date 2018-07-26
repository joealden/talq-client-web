import React from "react";
import styled from "styled-components";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import constants from "../../utils/constants";
import ShowApolloError from "../ApolloError";
import ChatListUI from "./ChatListUI";

const CHAT_LIST_QUERY = gql`
  query {
    chats {
      id
      title
    }
  }
`;

/* 
 * TODO: Figure out a way to type the data variable coming
 * from the Query render function in the same shape as the
 * above query.
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
  height: calc(100vh - ${constants.headerHeight});
  overflow: auto;

  ul {
    list-style: none;

    li {
      border: 1px solid black;
      margin: 4px;

      a {
        display: block;
        padding: 10px;
        text-decoration: none;
        color: black;
        transition: 0.1s ease-in-out;

        &:hover {
          color: ${constants.color};
        }
      }
    }
  }
`;

const CenterDiv = styled.div`
  height: calc(100vh - ${constants.headerHeight});
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
