import React from "react";
import { withRouter } from "next/router";
import styled from "styled-components";

import Layout from "../components/layout";

/* Remember to handle case where id is not defined (redirect) */
const ChatPage = ({ router }) => {
  const chatId = router.query.id || "Not defined, needs redirecting!";

  return (
    <Layout mainTitle="Chat Title">
      <ChatWrapper>Chat ID: {chatId}</ChatWrapper>
    </Layout>
  );
};

export default withRouter(ChatPage);

const ChatWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
