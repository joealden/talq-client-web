import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import Router from "next/router";

import { UserDetailsContext } from "../layout";
import ShowApolloError from "../ApolloError";
import { CHAT_LIST_QUERY } from "../layout/ChatList";
import constants from "../../utils/constants";

const START_CHAT_MUTATION = gql`
  mutation START_CHAT_MUTATION(
    $title: String
    $usernames: [String!]!
    $initialMessage: String!
  ) {
    startChat(
      title: $title
      usernames: $usernames
      initialMessage: $initialMessage
    ) {
      id
    }
  }
`;

interface user {
  username: string;
}

interface InitialMessageBoxProps {
  members: Array<user>;
}

interface InitialMessageBoxState {
  message: string;
}

class InitialMessageBox extends React.Component<
  InitialMessageBoxProps,
  InitialMessageBoxState
> {
  state = {
    message: ""
  };

  updateMessageState = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ message: event.target.value });
  };

  render() {
    const { members } = this.props;
    const usernames = members.map(member => member.username);

    return (
      <Mutation mutation={START_CHAT_MUTATION}>
        {(startChat, { loading, error }) => {
          const initalMessageEmpty = this.state.message.trim() === "";
          const buttonDisabled =
            initalMessageEmpty || loading || members.length === 0;

          return (
            <UserDetailsContext.Consumer>
              {({ username }) => (
                <InitialMessageBoxWrapper>
                  <ShowApolloError error={error} />
                  <textarea
                    placeholder="Initial message..."
                    disabled={loading}
                    onChange={this.updateMessageState}
                    value={this.state.message}
                  />
                  <button
                    className={buttonDisabled ? null : "enabled"}
                    disabled={buttonDisabled}
                    title="Start a chat with the above members"
                    onClick={() => {
                      const initialMessage = this.state.message.trim();

                      startChat({
                        variables: {
                          /* TODO: Add optional field for title */
                          title: "Placeholder chat title",
                          usernames,
                          initialMessage
                        },

                        update: (cache, result) => {
                          if (!result.errors) {
                            const newChatId = result.data.startChat.id;

                            const { chats } = cache.readQuery({
                              query: CHAT_LIST_QUERY
                            });

                            const newChat = {
                              __typename: "Chat",
                              id: newChatId,
                              /* TODO: Add optional field for title */
                              title: "Placeholder chat title",
                              messages: [
                                {
                                  __typename: "Message",
                                  author: {
                                    __typename: "PublicUser",
                                    username
                                  },
                                  content: initialMessage
                                }
                              ]
                            };

                            const updatedChats = [newChat, ...chats];

                            cache.writeQuery({
                              query: CHAT_LIST_QUERY,
                              data: {
                                __typename: "Query",
                                chats: updatedChats
                              }
                            });

                            /* Redirect to new chat if mutation successful */
                            Router.push(
                              `/chat?id=${newChatId}`,
                              `/chat/${newChatId}`
                            );
                          }
                        }
                      });
                    }}
                  >
                    Start Chat
                  </button>
                </InitialMessageBoxWrapper>
              )}
            </UserDetailsContext.Consumer>
          );
        }}
      </Mutation>
    );
  }
}

export default InitialMessageBox;

/**
 * TODO:
 * - Make it so that like messenger, the box
 *   grows to a certain point(max-height) when
 *   the amount of text increases (also using
 *   min-height).
 * - Like messenger, remove padding at top of
 *   box when scrolling
 */

const initialMessageBoxHeight = 60;

/* TODO: Dedupe code between message box components */

const InitialMessageBoxWrapper = styled.div`
  height: ${initialMessageBoxHeight}px;

  border-top: ${constants.borderHorizontal};
  display: flex;

  textarea {
    height: 100%;
    flex: 1;
    padding: 14px;
    padding-bottom: 0;
    resize: none;
    outline: none;
    border: none;
    border-right: ${constants.borderHorizontal};
  }

  button {
    width: 125px;
    background-color: white;
    color: ${constants.color};
    font-weight: normal;
    border: none;
    transition: 0.1s ease-in-out;
    cursor: pointer;

    &.enabled {
      &:hover,
      &:focus {
        background-color: rgba(0, 0, 0, 0.1);
      }

      &:active {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }

    &:disabled {
      cursor: not-allowed;
      background-color: rgba(0, 0, 0, 0.1);
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;
