import React from "react";
import styled from "styled-components";

import loggedIn from "../utils/loggedIn";
import NotLoggedIn from "../components/account/NotLoggedIn";
import Layout from "../components/layout";

const NewChatPage = () => {
  /* Makes sure client side routing checks for auth */
  if (typeof window !== "undefined" && !loggedIn()) {
    return <NotLoggedIn />;
  }

  return (
    <Layout mainTitle="New Chat">
      <ChatWrapper>New Chat Page</ChatWrapper>
    </Layout>
  );
};

export default NewChatPage;

const ChatWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
