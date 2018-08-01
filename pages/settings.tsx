import React from "react";
import styled, { css } from "styled-components";

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
        <UserSettingsWrapper>
          <div>
            <h3>User Settings</h3>
          </div>
          <div>
            <SignOutButton />
          </div>
        </UserSettingsWrapper>
        <FriendsListWrapper>
          <div>
            <h3>Friends List</h3>
          </div>
          <div>
            <SearchBox
              type="search"
              title="Search for friends by username"
              placeholder="Search for friends by username..."
              spellCheck={false}
              autoComplete="off"
            />
            <TestList />
          </div>
        </FriendsListWrapper>
      </SettingsWrapper>
    </Layout>
  );
};

export default SettingsPage;

const SettingsWrapper = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;

  & > div {
    display: flex;
    flex-direction: column;
  }
`;

const titleSectionHeight = 40;

const titleSectionStyles = css`
  border-bottom: ${constants.borderHorizontal};
  height: ${titleSectionHeight}px;
  display: flex;
  justify-content: center;
  align-items: center;

  h3 {
    font-size: 16px;
    text-align: center;
  }
`;

const mainSectionStyles = css`
  height: calc(100vh - ${constants.headerHeight + titleSectionHeight}px);
  overflow: auto;
`;

const UserSettingsWrapper = styled.div`
  border-right: ${constants.borderVertical};

  & > div:first-child {
    ${titleSectionStyles};
  }

  & > div:last-child {
    ${mainSectionStyles};
    /* Temp */
    padding: 15px;
    text-align: center;
  }
`;

const FriendsListWrapper = styled.div`
  & > div:first-child {
    ${titleSectionStyles};
  }

  & > div:last-child {
    ${mainSectionStyles};
    /* Temp */
    padding: 15px;
  }
`;

const searchBoxMargin = 0;
const searchBoxHeight = 36;

const SearchBox = styled.input`
  margin: ${searchBoxMargin}px;
  width: calc(100% - ${searchBoxMargin * 2}px);
  height: ${searchBoxHeight}px;
  padding: 10px 10px 10px ${searchBoxHeight}px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  background-color: #f5f6f7;
  background-image: url("/static/search-icon.svg");
  background-size: ${searchBoxHeight / 2}px;
  background-position: ${searchBoxHeight / 4}px;
  background-repeat: no-repeat;
`;

const TestList = () => (
  <ul>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
    <li>Test Item</li>
  </ul>
);
