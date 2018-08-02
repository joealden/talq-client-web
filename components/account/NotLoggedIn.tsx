import React from "react";
import styled from "styled-components";
import Link from "next/link";

import constants from "../../utils/constants";
import { AccountPageHeader } from "./account";

const AlreadyLoggedIn = () => (
  <Main>
    <Wrapper>
      <AccountPageHeader />
      <InnerWrapper>
        <p>
          You are not currently logged in, and this page requires you to be.
        </p>
        <p>
          If you already have an account, click{" "}
          <Link href="/signin">
            <a>here</a>
          </Link>{" "}
          to be taken to the sign in page.
        </p>
        <p>
          If you don't already have an account but would like one, click{" "}
          <Link href="/signup">
            <a>here</a>
          </Link>{" "}
          to be taken to the sign up page.
        </p>
      </InnerWrapper>
    </Wrapper>
  </Main>
);

export default AlreadyLoggedIn;

const Main = styled.main`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  text-align: center;

  h1 {
    margin-bottom: 6px;
    font-size: 36px;
  }

  h2 {
    margin-bottom: 32px;
  }
`;

const InnerWrapper = styled.div`
  p {
    &:first-child {
      margin-bottom: 32px;
    }

    &:nth-child(2) {
      margin-bottom: 8px;
    }

    a {
      color: ${constants.color};
    }
  }
`;
