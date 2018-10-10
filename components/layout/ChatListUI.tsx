import React from "react";
import styled from "styled-components";

import constants from "../../utils/constants";
import SearchBox from "../SearchBox";
import { ChatListQueryData } from "./ChatList";
import ChatListUIList from "./ChatListUIList";

interface ChatListUIProps {
  data: ChatListQueryData;
  subscribeToChatUpdates: Function;
}

interface ChatListUIState {
  searchTerm: string;
}

class ChatListUI extends React.Component<ChatListUIProps, ChatListUIState> {
  state = {
    searchTerm: ""
  };

  componentDidMount() {
    this.props.subscribeToChatUpdates();
  }

  updateSearchTermState = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  /* TODO: Add reset button in the right of the box (clears input) */
  render() {
    if (this.props.data.chats.length === 0) {
      return (
        <CenterDiv>
          <p>Chat list is empty.</p>
        </CenterDiv>
      );
    }

    return (
      <div>
        <SearchBox
          boxMargin={10}
          type="search"
          title="Search for chats"
          placeholder="Search for chats..."
          spellCheck={false}
          autoComplete="off"
          onChange={this.updateSearchTermState}
          value={this.state.searchTerm}
        />
        <ListWrapper>
          <ChatListUIList
            data={this.props.data}
            searchTerm={this.state.searchTerm}
          />
        </ListWrapper>
      </div>
    );
  }
}

export default ChatListUI;

const ListWrapper = styled.div`
  ul {
    list-style: none;
  }
`;

const CenterDiv = styled.div`
  height: calc(100vh - ${constants.headerHeight}px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    text-align: center;
    margin: 15px;
  }
`;
