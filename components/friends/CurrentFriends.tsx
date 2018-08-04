import React from "react";
import styled from "styled-components";

class CurrentFriends extends React.Component {
  render() {
    return (
      <CurrentFriendsWrapper>
        <SearchBox
          type="search"
          title="Search current friends"
          placeholder="Search for current friends..."
          spellCheck={false}
          autoComplete="off"
        />
        <ListWrapper>
          <TestList />
        </ListWrapper>
      </CurrentFriendsWrapper>
    );
  }
}

export default CurrentFriends;

const CurrentFriendsWrapper = styled.div`
  padding: 10px;
`;

/* TODO: Extract out into seperate component as it is used in the sidebar as well */
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

const ListWrapper = styled.div`
  margin-top: 10px;

  ul {
    list-style: none;

    li {
      padding: 5px 0;
    }
  }
`;

/* Temp */
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
