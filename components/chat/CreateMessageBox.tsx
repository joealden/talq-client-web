import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

import { ChatIdContext } from "../../pages/chat";
import { UserDetailsContext } from "../layout";
import { CHAT_PAGE_QUERY } from "../../pages/chat";
import ShowApolloError from "../ApolloError";
import constants from "../../utils/constants";

/**
 * TODO:
 * - Make message state change when navigating between chats
 * - Dedupe sendMessage mutation calls
 * - Work out updating cache if using GraphQL Subscriptons
 */

const SEND_MUTATION = gql`
  mutation SEND_MUTATION($chatId: ID!, $content: String!) {
    sendMessageToChat(chatId: $chatId, content: $content) {
      id
      author {
        username
      }
    }
  }
`;

interface CreateMessageBoxProps {
  scrollMessageListToBottom: Function;
}

interface CreateMessageBoxState {
  message: string;
}

class CreateMessageBox extends React.Component<
  CreateMessageBoxProps,
  CreateMessageBoxState
> {
  state = {
    message: ""
  };

  updateMessageState = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ message: event.target.value });
  };

  render() {
    return (
      <Mutation mutation={SEND_MUTATION}>
        {(sendMessage, { loading, error }) => (
          <UserDetailsContext.Consumer>
            {({ username }) => (
              <ChatIdContext.Consumer>
                {chatId => (
                  <CreateMessageBoxWrapper>
                    <ShowApolloError error={error} />
                    <textarea
                      placeholder="Type a message..."
                      disabled={loading}
                      value={this.state.message}
                      onChange={this.updateMessageState}
                      onKeyDown={async event => {
                        /* If key pressed is the enter key */
                        if (event.keyCode === 13) {
                          const trimmedMessage = this.state.message.trim();

                          if (trimmedMessage === "") {
                            return;
                          }

                          await sendMessage({
                            variables: {
                              chatId,
                              content: this.state.message
                            },

                            update: (
                              cache,
                              { data: { sendMessageToChat } }
                            ) => {
                              const { chat } = cache.readQuery({
                                query: CHAT_PAGE_QUERY,
                                variables: { chatId }
                              });

                              chat.messages.push({
                                __typename: "Message",
                                id: sendMessageToChat.id,
                                author: sendMessageToChat.author,
                                content: trimmedMessage
                              });

                              cache.writeQuery({
                                query: CHAT_PAGE_QUERY,
                                variables: { chatId },
                                data: { chat }
                              });
                            },

                            optimisticResponse: {
                              __typename: "Mutation",
                              sendMessageToChat: {
                                /* Placeholder ID value */
                                __typename: "Message",
                                id: "0",
                                author: {
                                  __typename: "PublicUser",
                                  username: username
                                }
                              }
                            }
                          });

                          this.setState({ message: "" });
                          this.props.scrollMessageListToBottom();
                        }
                      }}
                    />
                    <button
                      title="Send message to chat"
                      className={
                        this.state.message.trim() !== "" && !loading
                          ? "enabled"
                          : null
                      }
                      disabled={this.state.message.trim() === "" || loading}
                      onClick={async () => {
                        const trimmedMessage = this.state.message.trim();

                        if (trimmedMessage === "") {
                          return;
                        }

                        await sendMessage({
                          variables: {
                            chatId,
                            content: this.state.message
                          },

                          update: (cache, { data: { sendMessageToChat } }) => {
                            const { chat } = cache.readQuery({
                              query: CHAT_PAGE_QUERY,
                              variables: { chatId }
                            });

                            chat.messages.push({
                              __typename: "Message",
                              id: sendMessageToChat.id,
                              author: sendMessageToChat.author,
                              content: trimmedMessage
                            });

                            cache.writeQuery({
                              query: CHAT_PAGE_QUERY,
                              variables: { chatId },
                              data: { chat }
                            });
                          },

                          optimisticResponse: {
                            __typename: "Mutation",
                            sendMessageToChat: {
                              /* Placeholder ID value */
                              __typename: "Message",
                              id: "0",
                              author: {
                                __typename: "PublicUser",
                                username: username
                              }
                            }
                          }
                        });

                        this.setState({ message: "" });
                        this.props.scrollMessageListToBottom();
                      }}
                    >
                      Send
                    </button>
                  </CreateMessageBoxWrapper>
                )}
              </ChatIdContext.Consumer>
            )}
          </UserDetailsContext.Consumer>
        )}
      </Mutation>
    );
  }
}

export default CreateMessageBox;

/**
 * TODO:
 * - Make it so that like messenger, the box
 *   grows to a certain point(max-height) when
 *   the amount of text increases (also using
 *   min-height).
 * - Like messenger, remove padding at top of
 *   box when scrolling
 */

const createMessageBoxHeight = 60;

const CreateMessageBoxWrapper = styled.div`
  height: ${createMessageBoxHeight}px;

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
    width: 100px;
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
