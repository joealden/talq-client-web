import React from "react";
import styled from "styled-components";

import MessageList from "./MessageList";
import CreateMessageBox from "./CreateMessageBox";

import { ChatPageQueryData } from "../../pages/chat";

interface ChatUIProps {
  data: ChatPageQueryData;
  subscribeToMoreMessages: Function;
}

interface ChatUIState {
  messageListRef: React.RefObject<HTMLUListElement>;
}

class ChatUI extends React.Component<ChatUIProps, ChatUIState> {
  state = {
    messageListRef: undefined as React.RefObject<HTMLUListElement>
  };

  componentDidMount() {
    this.props.subscribeToMoreMessages();
  }

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
