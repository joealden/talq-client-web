import React from "react";
import styled from "styled-components";

import MessageList from "./MessageList";
import CreateMessageBox from "./CreateMessageBox";

interface user {
  username: string;
  firstName: string;
  lastName: string;
}

export interface message {
  id: string;
  author: user;
  createdAt: string;
  content: string;
}

interface ChatUIProps {
  data: {
    chat: {
      title: string;
      members: user[];
      messages: message[];
    };
  };
}

interface ChatUIState {
  messageListRef: React.RefObject<HTMLUListElement>;
}

class ChatUI extends React.Component<ChatUIProps, ChatUIState> {
  state = {
    messageListRef: undefined as React.RefObject<HTMLUListElement>
  };

  componentDidUpdate() {
    this.scrollMessageListToBottom();
  }

  updateMessageListRefState = (
    messageListRef: React.RefObject<HTMLUListElement>
  ) => {
    this.setState({ messageListRef });
  };

  scrollMessageListToBottom = () => {
    const messageList = this.state.messageListRef.current;

    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  };

  render() {
    const { data } = this.props;

    if (data && data.chat) {
      return (
        <ChatUIWrapper>
          <MessageList
            messages={data.chat.messages}
            updateParentRefState={this.updateMessageListRefState}
          />
          <CreateMessageBox
            scrollMessageListToBottom={this.scrollMessageListToBottom}
          />
        </ChatUIWrapper>
      );
    }

    return null;
  }
}

export default ChatUI;

const ChatUIWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
