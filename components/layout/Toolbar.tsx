import React from "react";
import Link from "next/link";
import styled, { css } from "styled-components";

import constants from "../../utils/constants";
import SettingsIcon from "../icons/SettingsIcon";
import NewChatIcon from "../icons/NewChatIcon";

/**
 * TODO: Look into stopping auto scroll to top when settings / new-chat
 * is pressed. Already tried scroll={false} on links, doesn't work.
 */
const Toolbar: React.SFC = () => (
  <ToolbarWrapper>
    <Link prefetch href="/settings">
      <a title="Settings">
        <StyledSettingsIcon />
      </a>
    </Link>
    <LogoWrapper>
      <img src="/static/talq-icon.svg" alt="Talq logo" />
    </LogoWrapper>
    <Link prefetch href="/new">
      <a title="Create a new chat">
        <StyledNewChatIcon />
      </a>
    </Link>
  </ToolbarWrapper>
);

export default Toolbar;

const ToolbarWrapper = styled.div`
  background-color: white;
  border-bottom: ${constants.borderHorizontal};
  height: ${constants.headerHeight}px;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  user-select: none;

  img {
    width: 50px;
    margin-bottom: -6px;
  }
`;

const iconStyles = css`
  color: ${constants.color};
  height: 38px;
  width: 38px;
  stroke-width: 1.2px;
  padding: 6px;
`;

const StyledSettingsIcon = styled(SettingsIcon)`
  ${iconStyles};
`;
const StyledNewChatIcon = styled(NewChatIcon)`
  ${iconStyles};
`;
