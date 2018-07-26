import React from "react";
import styled from "styled-components";
import Link from "next/link";

/*
 * NOTE: SearchBox state is kept uncontrolled because it reduces
 * the complexity of the code and reduces the amount of possible
 * re-renders.
 */

/* TODO: Type props and state better */
interface ChatListUIProps {
  data: {
    chats: any[];
  };
}

interface ChatListUIState {
  filteredChats: any;
}

class ChatListUI extends React.Component<ChatListUIProps, ChatListUIState> {
  state = {
    filteredChats: this.props.data.chats
  };

  updateFilteredChatsState = searchTerm => {
    const filteredChats = this.props.data.chats.filter(chat =>
      chat.title.includes(searchTerm)
    );
    this.setState({ filteredChats });
  };

  /* TODO: Add reset button in the right of the box (clears input) */
  render() {
    return (
      <div>
        <SearchBox
          type="search"
          placeholder="Search Talq"
          spellCheck={false}
          autoComplete="off"
          onChange={event => this.updateFilteredChatsState(event.target.value)}
        />
        <ul>
          {this.state.filteredChats.map(chat => (
            <li key={chat.id}>
              <Link as={`/chat/${chat.id}`} href={`/chat?id=${chat.id}`}>
                <a>{chat.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ChatListUI;

/* TODO: Add search icon inside box like messenger */
const searchBoxMargin = 12;
const SearchBox = styled.input`
  margin: ${searchBoxMargin}px;
  width: calc(100% - ${searchBoxMargin * 2}px);
  height: 35px;
  padding: 10px;
  font-size: 14px;
  background-color: #f5f6f7;
  border: none;
  border-radius: 5px;
`;
