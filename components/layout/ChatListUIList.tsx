import React from "react";
import styled from "styled-components";
import * as R from "ramda";
import Router from "next/router";
import Link from "next/link";

import { ChatListQueryData } from "./ChatList";
import { UserDetailsContext } from "../layout";

interface ChatListUIListProps {
  data: ChatListQueryData;
  searchTerm: string;
}

const AllUsersList: React.SFC<ChatListUIListProps> = ({ data, searchTerm }) => {
  const normalisedSearchTerm = searchTerm.toLowerCase().trim();

  const filteredChats = data.chats.filter(chat => {
    if (chat.title) {
      const normalisedChatTitle = chat.title.toLowerCase();
      return normalisedChatTitle.includes(normalisedSearchTerm);
    }

    /**
     * TODO: Will require changing when untitled chats are given
     * the title of the member's usernames.
     */

    return "Untitled Chat".toLowerCase().includes(normalisedSearchTerm);
  });

  if (filteredChats.length === 0) {
    return <NoMatches>No chats match this search term.</NoMatches>;
  }

  return (
    <UserDetailsContext.Consumer>
      {({ username }) => (
        <StyledList>
          {filteredChats.map(chat => {
            let usernameToDisplay;

            /* If most recent message was sent by the current user */
            if (R.last(chat.messages).author.username === username) {
              usernameToDisplay = "You";
            } else {
              usernameToDisplay = R.last(chat.messages).author.username;
            }

            const messageContent = R.last(chat.messages).content;
            const mostRecentMessage = `${usernameToDisplay}: ${messageContent}`;

            /**
             * TODO: Instead of using untitled chat, uses member usernames.
             * This will require updating the query and query type above
             * to include the member's usernames of each chat.
             */
            const chatTitle = chat.title ? chat.title : "Untitled Chat";

            return (
              <li
                key={chat.id}
                className={Router.query.id === chat.id ? "current" : null}
              >
                <Link
                  prefetch
                  as={`/chat/${chat.id}`}
                  href={`/chat?id=${chat.id}`}
                >
                  <a>
                    <span>{chatTitle}</span>
                    <span>{mostRecentMessage}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </StyledList>
      )}
    </UserDetailsContext.Consumer>
  );
};

export default AllUsersList;

const NoMatches = styled.p`
  text-align: center;
  font-size: 15px;
  margin: 12px 15px 0px 15px;
`;

const StyledList = styled.ul`
  li {
    a {
      display: flex;
      flex-direction: column;
      padding: 10px;

      span {
        margin-right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      span:first-child {
        font-size: 15px;
        color: black;
        margin-bottom: 4px;
      }

      span:last-child {
        font-size: 12px;
        color: rgba(153, 153, 153, 1);
      }
    }

    &.current,
    &:hover,
    &:focus {
      background-color: rgba(0, 0, 0, 0.05);
    }

    &:active {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
`;
