import React from "react";
import styled from "styled-components";

import Sidebar from "./Sidebar";
import Main from "./Main";

const Layout = ({ mainTitle, children }) => (
  <Page>
    <Sidebar />
    <Main title={mainTitle}>{children}</Main>
  </Page>
);

export default Layout;

const Page = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 18vw) auto;
  grid-template-areas: "sidebar main";
  height: 100%;
`;
