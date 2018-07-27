import React from "react";
import styled from "styled-components";

/* TODO: Improve prop typing */
interface ChatUIProps {
  data: any;
}

const ChatUI = ({ data }: ChatUIProps) => {
  if (data && data.chat) {
    return (
      <ChatUIWrapper>
        <p>Title - {data.chat.title}</p>
      </ChatUIWrapper>
    );
  }

  return null;
};

export default ChatUI;

const ChatUIWrapper = styled.div`
  height: 100%;
`;
