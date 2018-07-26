import React from "react";
import styled from "styled-components";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Link from "next/link";

/* Move account error out into generic component */
import Error from "../account/AccountError";
import constants from "../../utils/constants";

const CHAT_LIST_QUERY = gql`
  query {
    chats {
      id
      title
    }
  }
`;

const ChatList = () => (
  <ChatListWrapper>
    <Query query={CHAT_LIST_QUERY}>
      {({ data, error, loading }) => {
        if (error) return <Error error={error} />;
        if (loading) return <p>Loading...</p>;
        if (data.chats.length === 0) return <p>Chat list is empty.</p>;

        return (
          <React.Fragment>
            <SearchBox
              type="text"
              placeholder="Search Talq"
              spellCheck={false}
              autoComplete="off"
            />
            <ul>
              {data.chats.map(chat => (
                <li key={chat.id}>
                  <Link as={`/chat/${chat.id}`} href={`/chat?id=${chat.id}`}>
                    <a>{chat.title}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </React.Fragment>
        );
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

// TODO: Add search icon inside box like messenger
const searchBoxMargin = 12;
const SearchBox = styled.input`
  margin: ${searchBoxMargin}px;
  width: calc(100% - ${searchBoxMargin * 2}px);
  height: 35px;
  padding: 10px;
  font-size: 14px;
  background-color: #f5f6f7;
  border: none;
  border-radius: 5px;
`;
