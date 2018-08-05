import React from "react";
import styled from "styled-components";
import Link from "next/link";

import loggedIn from "../utils/loggedIn";
import NotLoggedIn from "../components/account/NotLoggedIn";
import Layout from "../components/layout";
import SignOutButton from "../components/settings/SignOutButton";
import constants from "../utils/constants";

/**
 * TODO:
 *
 * Create a new page called 'friends'. This will have the two column
 * arrangement that the current settings page has. On the left will
 * be a list of current friends and on the right will be a list of
 * all users.
 *
 * Revert the changes made to the settings page, making it a simple
 * single column page that will have options to change user details
 * such as email, username, password, names etc. This page will also
 * have a link to the friends page.
 *
 * Friends page details:
 *
 * - Both lists will have a header and a search box at the top.
 * - Both lists will be scrollable
 *
 * On the current friends list, each friend item will have an option to
 * remove them as a friend is there in the form of a button. When this
 * button is pressed, perform a GraphQL mutation to remove them from this
 * user's friends list. Update the apollo cache to remove this friend.
 *
 * On the all users list, each item will have a button. If the user is
 * already a friend, color the button differently with the text 'remove'.
 * This button will act the same as the button found on each item in the
 * current friends list (updates the cache as well). If the user is not
 * already a friend of the currently logged in user, have a button with
 * the text 'add'. This will perform a mutation to add this user to the
 * currently logged in user's friends list. This also will need to update
 * the apollo cache to keep both lists in the correct state.
 */

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
