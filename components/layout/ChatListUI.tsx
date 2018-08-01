import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Router from "next/router";

import { UserDetailsContext } from "../layout";

/* 
 * TODO: Update cache for sidebar with latest message when user sends
 * a message (Or just wait for GraphQL Subscriptions to be added?).
 */

/*
 * NOTE: SearchBox state is kept uncontrolled because it reduces the
 * complexity of the code and reduces the amount of possible re-renders.
 */

interface ChatListUIProps {
  data: {
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
  };
}

interface ChatListUIState {
  filteredChats: any;
}

class ChatListUI extends React.Component<ChatListUIProps, ChatListUIState> {
  state = {
    filteredChats: this.props.data.chats
  };

  updateFilteredChatsState = searchTerm => {
    const filteredChats = this.props.data.chats.filter(chat =>
      chat.title.includes(searchTerm)
    );
    this.setState({ filteredChats });
  };

  /* TODO: Add reset button in the right of the box (clears input) */
  render() {
    return (
      <UserDetailsContext.Consumer>
        {({ username }) => (
          <ChatListWrapper>
            <SearchBox
              type="search"
              title="Search for chats"
              placeholder="Search for chats..."
              spellCheck={false}
              autoComplete="off"
              onChange={event =>
                this.updateFilteredChatsState(event.target.value.trim())
              }
            />
            {this.state.filteredChats.length !== 0 ? (
              <ul>
                {this.state.filteredChats.map(chat => {
                  /* Determine what to display below chat title */
                  let mostRecentMessage;
                  if (chat.messages.length === 0) {
                    mostRecentMessage = "This chat has no messages.";
                  } else {
                    let usernameToDisplay;
                    /* If most recent message was sent by the current user */
                    if (chat.messages[0].author.username === username) {
                      usernameToDisplay = "You";
                    } else {
                      usernameToDisplay = chat.messages[0].author.username;
                    }

                    const messageContent = chat.messages[0].content;
                    mostRecentMessage = `${usernameToDisplay}: ${messageContent}`;
                  }

                  return (
                    <li
                      key={chat.id}
                      className={Router.query.id === chat.id ? "current" : null}
                    >
                      <Link
                        as={`/chat/${chat.id}`}
                        href={`/chat?id=${chat.id}`}
                      >
                        <a>
                          <span>{chat.title}</span>
                          <span>{mostRecentMessage}</span>
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <NoMatches>No chats match this search term.</NoMatches>
            )}
          </ChatListWrapper>
        )}
      </UserDetailsContext.Consumer>
    );
  }
}

export default ChatListUI;

const ChatListWrapper = styled.div`
  list-style: none;

  li {
    a {
      display: flex;
      flex-direction: column;
      padding: 10px;
      text-decoration: none;
      color: black;

      span:first-child {
        font-size: 15px;
        margin-bottom: 4px;
      }

      span:last-child {
        font-size: 12px;
        color: rgba(153, 153, 153, 1);
        margin-right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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

const searchBoxMargin = 12;
const searchBoxHeight = 36;

const SearchBox = styled.input`
  margin: ${searchBoxMargin}px;
  width: calc(100% - ${searchBoxMargin * 2}px);
  height: ${searchBoxHeight}px;
  padding: 10px 10px 10px ${searchBoxHeight}px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  background-color: #f5f6f7;
  background-image: url("/static/search-icon.svg");
  background-size: ${searchBoxHeight / 2}px;
  background-position: ${searchBoxHeight / 4}px;
  background-repeat: no-repeat;
`;

const NoMatches = styled.p`
  text-align: center;
  margin-top: 12px;
`;
