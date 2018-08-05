import React from "react";
import styled from "styled-components";
import Link from "next/link";

import loggedIn from "../utils/loggedIn";
import NotLoggedIn from "../components/account/NotLoggedIn";
import Layout from "../components/layout";
import SignOutButton from "../components/settings/SignOutButton";
import constants from "../utils/constants";

const SettingsPage = () => {
  /* Makes sure client side routing checks for auth */
  if (typeof window !== "undefined" && !loggedIn()) {
    return <NotLoggedIn />;
  }

  return (
    <Layout mainTitle="Settings">
      <SettingsWrapper>
        <p>
          <Link href="/friends">
            <a>Friends Page</a>
          </Link>
        </p>

        <SignOutButton />
      </SettingsWrapper>
    </Layout>
  );
};

export default SettingsPage;

const SettingsWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* Temp */
  p {
    margin-bottom: 15px;

    a {
      color: ${constants.color};
    }
  }
`;
