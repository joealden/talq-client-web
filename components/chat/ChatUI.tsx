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

const ChatUI = ({ data }: ChatUIProps) => {
  if (data && data.chat) {
    return (
      <ChatUIWrapper>
        <MessageList messages={data.chat.messages} />
        <CreateMessageBox />
      </ChatUIWrapper>
    );
  }

  return null;
};

export default ChatUI;

const ChatUIWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
