import React from "react";
import styled from "styled-components";

import Layout from "../components/layout";

const NewChatPage = () => (
  <Layout mainTitle="New Chat">
    <ChatWrapper>New Chat Page</ChatWrapper>
  </Layout>
);

export default NewChatPage;

const ChatWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
