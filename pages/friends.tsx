import React from "react";
import styled from "styled-components";

import loggedIn from "../utils/loggedIn";
import NotLoggedIn from "../components/account/NotLoggedIn";

import Layout from "../components/layout";
import CurrentFriends from "../components/friends/CurrentFriends";
import AllUsers from "../components/friends/AllUsers";

import constants from "../utils/constants";

const FriendsPage = () => {
  /* Makes sure client side routing checks for auth */
  if (typeof window !== "undefined" && !loggedIn()) {
    return <NotLoggedIn />;
  }

  return (
    <Layout mainTitle="Friends">
      <FriendsWrapper>
        <FriendsColumn>
          <div>
            <h3>Current Friends</h3>
          </div>
          <CurrentFriends />
        </FriendsColumn>
        <FriendsColumn>
          <div>
            <h3>All Users</h3>
          </div>
          <AllUsers />
        </FriendsColumn>
      </FriendsWrapper>
    </Layout>
  );
};

export default FriendsPage;

const FriendsWrapper = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;

  & > div:first-child {
    border-right: ${constants.borderHorizontal};
  }
`;

const titleSectionHeight = 40;

const FriendsColumn = styled.div`
  display: flex;
  flex-direction: column;

  & > :first-child {
    border-bottom: ${constants.borderHorizontal};
    height: ${titleSectionHeight}px;
    display: flex;
    justify-content: center;
    align-items: center;

    h3 {
      font-size: 16px;
      text-align: center;
    }
  }

  & > :last-child {
    height: calc(100vh - ${constants.headerHeight + titleSectionHeight}px);
    overflow: auto;
  }
`;
