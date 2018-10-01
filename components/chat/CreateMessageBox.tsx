import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

import { ChatIdContext } from "../../pages/chat";
import { UserDetailsContext } from "../layout";
import { CHAT_PAGE_QUERY } from "../../pages/chat";
import { CHAT_LIST_QUERY } from "../layout/ChatList";

import ShowApolloError from "../ApolloError";
import constants from "../../utils/constants";

/**
 * TODO:
 * - Make message state change when navigating between chats
 *   - Restore message state when navigating back to same schat
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

interface SendMutationData {
  sendMessageToChat: {
    id: string;
    author: {
      username: string;
    };
  };
}

interface SendMutationVariables {
  chatId: string;
  content: string;
}

class SendMutation extends Mutation<SendMutationData, SendMutationVariables> {}

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

  updateApolloCacheWithNewMessage = async ({
    sendMessage,
    chatId,
    username
  }: {
    sendMessage: Function;
    chatId: string;
    username: string;
  }) => {
    const trimmedMessage = this.state.message.trim();

    if (trimmedMessage === "") {
      return;
    }

    await sendMessage({
      variables: {
        chatId,
        content: this.state.message
      },

      /**
       * NOTE:
       * Read note at the top of `/components/layout/ChatList.tsx`
       * for information on why there needs to be two cache updates.
       */

      update: (cache, { data: { sendMessageToChat } }) => {
        /* ----- Update current chat cache ----- */

        const { chat } = cache.readQuery({
          query: CHAT_PAGE_QUERY,
          variables: { chatId }
        });

        const newMessage = {
          __typename: "Message",
          id: sendMessageToChat.id,
          author: sendMessageToChat.author,
          content: trimmedMessage
        };

        chat.messages.push(newMessage);

        cache.writeQuery({
          query: CHAT_PAGE_QUERY,
          variables: { chatId },
          data: { chat }
        });

        /* ------ Update chat list cache ------ */

        const { chats } = cache.readQuery({
          query: CHAT_LIST_QUERY
        });

        const currentChat = chats.find(chat => chat.id === chatId);

        const chatListWithoutCurrentChat = chats.filter(
          chat => chat.id !== chatId
        );

        const currentChatWithNewMessage = {
          ...currentChat,
          messages: [...currentChat.messages, newMessage]
        };

        const updatedChatList = [
          currentChatWithNewMessage,
          ...chatListWithoutCurrentChat
        ];

        cache.writeQuery({
          query: CHAT_LIST_QUERY,
          data: { chats: updatedChatList }
        });
      },

      optimisticResponse: {
        __typename: "Mutation",
        sendMessageToChat: {
          __typename: "Message",
          /* Placeholder ID value */
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
  };

  updateMessageState = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ message: event.target.value });
  };

  render() {
    return (
      <SendMutation mutation={SEND_MUTATION}>
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
                      onKeyDown={event => {
                        /* If key pressed is the enter key */
                        if (event.keyCode === 13) {
                          this.updateApolloCacheWithNewMessage({
                            sendMessage,
                            chatId,
                            username
                          });
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
                      onClick={() => {
                        this.updateApolloCacheWithNewMessage({
                          sendMessage,
                          chatId,
                          username
                        });
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
      </SendMutation>
    );
  }
}

export default CreateMessageBox;

/**
 * TODO:
 * - Make it so that like messenger, the box grows to a certain point
 *   (max-height) when the amount of text increases (also using min-height).
 * - Like messenger, remove padding at top of box when scrolling
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
