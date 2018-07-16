import React from "react";
import styled from "styled-components";

import Toolbar from "./Toolbar";
import ChatList from "./ChatList";

const Sidebar = () => (
  <SidebarWrapper>
    <Toolbar />
    <ChatList />
  </SidebarWrapper>
);

export default Sidebar;

const SidebarWrapper = styled.div`
  grid-area: "sidebar";
  height: 100%;
`;
