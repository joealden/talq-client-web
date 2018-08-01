import React from "react";
import styled from "styled-components";

import constants from "../../utils/constants";

/* title prop may need to be reworked when buttons
 * like video call etc. are added to chat page header.
 * Also needs changing if new chat is to work exactly
 * like Messenger.
 * 
 * Possible solution is to pass a component down in
 * place of title so consumer can decide what the render.
 * Could leave title prop in by require XOR on title and
 * component prop.
 */

interface MainProps {
  title: string;
  children: JSX.Element;
}

const Main = ({ title, children }: MainProps) => (
  <MainWrapper>
    <TitleWrapper>
      <h1>{title}</h1>
    </TitleWrapper>
    <ContentWrapper>{children}</ContentWrapper>
  </MainWrapper>
);

export default Main;

const MainWrapper = styled.main`
  grid-area: "main";
  background-color: white;
  border-left: ${constants.borderVertical};
`;

const TitleWrapper = styled.div`
  background-color: white;
  border-bottom: ${constants.borderHorizontal};
  height: ${constants.headerHeight}px;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  h1 {
    font-size: 17px;
    font-weight: normal;
  }
`;

const ContentWrapper = styled.div`
  height: calc(100vh - ${constants.headerHeight}px);
`;
