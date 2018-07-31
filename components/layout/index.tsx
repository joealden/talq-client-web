import React from "react";
import styled from "styled-components";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Sidebar from "./Sidebar";
import Main from "./Main";
import ShowApolloError from "../ApolloError";

export const UserDetailsContext = React.createContext(undefined);

const USER_QUERY = gql`
  query USER_QUERY {
    user {
      username
    }
  }
`;

interface LayoutProps {
  mainTitle: string;
  children: JSX.Element;
}

const Layout = ({ mainTitle, children }: LayoutProps) => (
  <Query query={USER_QUERY}>
    {({ data: { user }, loading, error }) => {
      /* TODO: Replace with spinner */
      if (!user || loading) return null;

      return (
        <UserDetailsContext.Provider value={user}>
          <ShowApolloError error={error} />
          <Page>
            <Sidebar />
            <Main title={mainTitle}>{children}</Main>
          </Page>
        </UserDetailsContext.Provider>
      );
    }}
  </Query>
);

export default Layout;

const Page = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 18vw) auto;
  grid-template-areas: "sidebar main";
  height: 100%;
`;
