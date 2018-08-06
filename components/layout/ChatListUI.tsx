import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Router from "next/router";

import SearchBox from "../SearchBox";
import { UserDetailsContext } from "../layout";

/**
 * TODO: Update cache for sidebar with latest message when user sends
 * a message (Or just wait for GraphQL Subscriptions to be added?).
 */

/**
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

/* TODO: Improve tying */
interface ChatListUIState {
  filteredChats: any;
}

class ChatListUI extends React.Component<ChatListUIProps, ChatListUIState> {
  state = {
    filteredChats: this.props.data.chats
  };

  updateFilteredChatsState = (searchTerm: string) => {
    const normalisedSearchTerm = searchTerm.toLowerCase();

    const filteredChats = this.props.data.chats.filter(chat => {
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
    this.setState({ filteredChats });
  };

  /* TODO: Add reset button in the right of the box (clears input) */
  render() {
    return (
      <UserDetailsContext.Consumer>
        {({ username }) => (
          <ChatListWrapper>
            <SearchBox
              boxMargin={10}
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

const NoMatches = styled.p`
  text-align: center;
  font-size: 15px;
  margin: 12px 15px 0px 15px;
`;
