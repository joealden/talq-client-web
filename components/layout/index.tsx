import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { Query } from "react-apollo";

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

interface UserQueryData {
  user: {
    username: string;
  };
}

class UserQuery extends Query<UserQueryData> {}

interface LayoutProps {
  mainTitle: string;
  children: JSX.Element;
}

const Layout: React.SFC<LayoutProps> = ({ mainTitle, children }) => (
  <UserQuery query={USER_QUERY}>
    {({ data, loading, error }) => {
      /* TODO: Replace with spinner */
      if (!data || loading) return null;

      return (
        <UserDetailsContext.Provider value={data.user}>
          <ShowApolloError error={error} />
          <Page>
            <Sidebar />
            <Main title={mainTitle}>{children}</Main>
          </Page>
        </UserDetailsContext.Provider>
      );
    }}
  </UserQuery>
);

export default Layout;

const Page = styled.div`
  display: grid;
  grid-template-columns: minmax(270px, 17vw) minmax(350px, auto);
  grid-template-areas: "sidebar main";
  height: 100%;
`;
